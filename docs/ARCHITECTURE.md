# Architecture — sa-help-center

> Última actualización: 2026-06-06 (post-cutover Vercel → Cloud Run)

`help.saleads.ai` es el centro de ayuda de SaleAds.ai: sitio de documentación construido con Next.js 16 + Fumadocs MDX, desplegado como contenedor en Google Cloud Run y fronted por Cloudflare. Incluye un asistente de chat con Gemini que responde preguntas sobre el producto y captura feedback.

## 1. Topología

```
                        ┌──────────────────────────────────┐
       Usuario  ──────► │  Cloudflare proxy (zone saleads.ai)
                        │  - Plan: Pro                     │
                        │  - DNS: CNAME help → ghs.googlehosted.com (proxied)
                        │  - WAF + Rate Limit Rule:        │
                        │    10 req/min/IP sobre /api/chat │
                        │    POST → Block 1h               │
                        │  - TLS termination con cert *.saleads.ai
                        └─────────────┬────────────────────┘
                                      │
                                      │ HTTPS (Full mode)
                                      ▼
                        ┌──────────────────────────────────┐
                        │  ghs.googlehosted.com            │
                        │  (Google Frontend, SNI routing)  │
                        │  - Cert managed: Google Trust    │
                        │    Services WR3 (auto-renew)     │
                        │  - SNI = help.saleads.ai →       │
                        │    Cloud Run Domain Mapping      │
                        └─────────────┬────────────────────┘
                                      │
                                      ▼
                        ┌──────────────────────────────────┐
                        │  Cloud Run: sa-help-center       │
                        │  - Project: saleads-prod         │
                        │  - Region: us-central1           │
                        │  - Container: us-central1-       │
                        │    docker.pkg.dev/saleads-prod/  │
                        │    sa-help-center/app:<sha>      │
                        │  - SA: sa-help-center-runtime@   │
                        │    saleads-prod.iam              │
                        │  - 1 vCPU, 1 GiB, min=1 max=10   │
                        │  - Concurrency: 80, timeout: 60s │
                        └──────┬───────────────────────────┘
                               │
              ┌────────────────┼─────────────────────┐
              ▼                ▼                     ▼
      ┌─────────────┐  ┌──────────────────┐  ┌──────────────────┐
      │ Secret Mgr  │  │  Gemini API      │  │  BigQuery        │
      │ Gemini API  │  │  (Google AI)     │  │  saleads_help_   │
      │ key (latest)│  │  gemini-2.5-     │  │  center.{chat,   │
      │             │  │  flash-lite      │  │  page}_feedback  │
      └─────────────┘  └──────────────────┘  └──────────────────┘
```

## 2. Componentes

### 2.1 Frontend (Next.js 16 + Fumadocs)
- **Framework**: Next.js 16.2 (App Router) con Turbopack.
- **i18n**: paths `/[locale]/...` con `es` (default) y `en`.
- **Docs MDX**: Fumadocs 16.7 compila el contenido en `content/docs/<locale>` a páginas estáticas (133 páginas SSG al momento de la migración).
- **Asset estáticos**: `/public/images` (~50 MB de screenshots), servidos por Cloud Run.
- **Image optimization**: `next/image` con `sharp` (instalado en el contenedor; Vercel lo proveía automático).

### 2.2 API routes
| Ruta | Método | Descripción |
|---|---|---|
| `/api/health` | GET | Liveness/readiness probe. Devuelve `{status, commit, uptime_seconds}`. |
| `/api/chat` | POST | Recibe `{message, locale, history, pageContext}`. Llama Gemini. Devuelve `{answer, sources, suggestions, confidence}`. |
| `/api/chat/feedback` | POST | Recibe rating de un mensaje del chat. Persiste en BQ. |
| `/api/chat/feedback` | GET | Stats agregadas + últimos 20 feedbacks (window 30d). |
| `/api/feedback` | POST | Recibe rating de una página de docs. Persiste en BQ. |
| `/api/feedback` | GET | Stats agregadas con filtro opcional por path. |
| `/api/search` | GET | Búsqueda full-text en docs (Fumadocs SSG). |

### 2.3 Persistencia (BigQuery)
Dataset `saleads-prod.saleads_help_center` en `us-central1`:

- **`chat_feedback`**: una fila por rating en el chat. Particionado por `created_at` (DAY), clustered por `locale, helpful`.
- **`page_feedback`**: una fila por rating en una página. Particionado por `created_at` (DAY), clustered por `locale, page_slug`.

Inserts son streaming (`@google-cloud/bigquery` SDK). Privacy: `ip_hash = sha256(cf-connecting-ip)`, sin IP en claro.

### 2.4 Secretos
- **`saleads-help-center-gemini-api-key-prod`** en Secret Manager (saleads-prod). Montado en Cloud Run como env var `GEMINI_API_KEY`. Rotación recomendada antes de 2026-08-30.

### 2.5 Servicios externos
- **Google Gemini API** (`generativelanguage.googleapis.com`): consulta directa con API key. Modelo enforced: `gemini-2.5-flash-lite`. Budget de Billing: $100/mes con alertas 50%/90%/100%/120%.
- **Cloudflare**: DNS authoritative, WAF, Rate Limit, cache HTML/static (default Pro).

## 3. Flujo de un request al chat

1. Usuario abre el widget de chat en `https://help.saleads.ai/es/docs/<algun-articulo>`.
2. Browser envía `POST /api/chat` con `{message, locale, history, pageContext}`.
3. Cloudflare recibe en su edge más cercano (Miami para Colombia → `MIA`).
4. CF evalúa la Rate Limit Rule: si esa IP ha hecho >10 POST a `/api/chat` en el último minuto → 429 (block 1h). Sino, prosigue.
5. CF hace TLS termination con su cert wildcard y abre conexión TLS hacia `ghs.googlehosted.com`, agregando headers `cf-connecting-ip`, `cf-ray`, etc.
6. Google Frontend recibe TLS con SNI=`help.saleads.ai`, busca el Domain Mapping correspondiente, rutea al servicio Cloud Run `sa-help-center`.
7. Cloud Run instancia (warm si hay traffic, o cold start ~1-2s si no) ejecuta el handler Next.js:
   - Lee `cf-connecting-ip` (fallback a `x-forwarded-for[0]`).
   - App-level rate limit: in-memory Map por instancia, 20/hr/IP. **Defense-in-depth**: la regla CF es el primary; el Map es backup si alguien bypassa CF.
   - Inicializa Gemini SDK (singleton lazy) usando `GEMINI_API_KEY` desde el secret mount.
   - Construye prompt con system prompt según locale + history del usuario + page context.
   - Llama `chat.sendMessage(prompt)` sobre `gemini-2.5-flash-lite`.
   - Si éxito: parsea respuesta, busca documentos relacionados (keyword matching contra slugs), genera suggestions, devuelve JSON.
   - Si error: log estructurado JSON (Cloud Logging severity filter), devuelve código de error apropiado.
8. Response viaja por Google → CF → user. CF agrega cache hint si aplica (`/api/chat` no se cachea).
9. Usuario ve la respuesta. Si rating: nuevo `POST /api/chat/feedback` → handler hace insert streaming a BQ.

## 4. Decisiones de arquitectura

### 4.1 Cloud Run vs GKE
Elegido Cloud Run por:
- Servicio único, sin necesidad de orquestación.
- `min=1` ya cubre cold start (cero spend extra de un nodo GKE idle).
- Sin operación de kubectl/Helm/etc para un sitio de docs.
- Trade-off conocido: no llega a LiteLLM ClusterIP. Excepción documentada en [[litellm_central_gateway]] (memoria interna).

### 4.2 Cloudflare Domain Mapping vs Load Balancer GCP
Elegido Domain Mapping por:
- **Costo $0** vs ~$18/mes del LB.
- Cert managed automático (Google Trust Services WR3, auto-renew).
- Trade-off: ventana de cert provisioning de 10-60 min sin CF proxy (en este cutover fueron 7 min). Aceptable para sitio de docs con tráfico bajo.
- Si en el futuro hay necesidad de Cloud CDN, blue-green con weights, o multi-backend, migrar a LB.

### 4.3 BigQuery vs Firestore para feedback
Elegido BigQuery por:
- Volume de writes muy bajo (~feedback/día) — costo despreciable.
- Analítica trivial con SQL (joins, agregaciones, filtros temporales).
- Aprovecha infra BQ existente.
- Trade-off: latencia de write más alta que Firestore (50-200ms vs <50ms), pero usuario espera la respuesta del chat (~1s), así que +50ms no es problema.

### 4.4 Gemini key directa vs LiteLLM gateway
Elegido directo por:
- Cloud Run no llega al `litellm-gateway.cognitive` ClusterIP en GKE (no hay VPC connector configurado, ni LiteLLM expuesto público).
- Mismo trade-off que cuando estaba en Vercel.
- Defensa primaria contra abuso de costo: API restriction de la key (solo `generativelanguage.googleapis.com`) + budget alert $100/mes.
- Si en el futuro se expone LiteLLM público con auth, migrar a vkey + baseUrl gateway.

### 4.5 cf-connecting-ip vs x-forwarded-for
Usamos `cf-connecting-ip` como primary porque con CF en frente `x-forwarded-for[0]` puede traer la IP del edge CF, no del usuario real. Fallback a `x-forwarded-for[0].trim()` por si CF se cae o se desproxia (DNS-only).

### 4.6 min-instances = 1 en prod
Elegido para evitar cold start (~1-2s con Next.js 16). El costo extra (~$10/mes) vale la pena para UX. En staging `min=0` está bien.

## 5. Modelo de seguridad

| Capa | Defensa |
|---|---|
| Edge (Cloudflare) | WAF Pro + Rate Limit Rule + cache HTML |
| Transport | TLS end-to-end (user→CF, CF→Google, Google→Cloud Run) |
| Auth | Sitio público (docs), sin login |
| API key Gemini | Solo en Secret Manager, IAM scoped a runtime SA + soportetech@; API restriction al servicio Gemini |
| Rate limit | Edge primario (10/min/IP burst) + app secundario (20/hr/IP per-instance) |
| Privacy | `ip_hash = sha256(ip)` en BQ, no raw IP. No PII almacenada. |
| Logging | Sin logs de contenido del chat. Solo metadata (locale, model, ip_hash). |

## 6. Stack de cuentas y SAs

| Account | Rol |
|---|---|
| `sa-help-center-runtime@saleads-prod.iam` | SA de runtime de Cloud Run. Lee secret Gemini, escribe a BQ dataset, ejecuta BQ jobs |
| `sa-help-center-cicd@saleads-prod.iam` | SA de CI (GitHub Actions). Push AR images, deploy Cloud Run, act-as runtime SA |
| `arquitectosoluciones@juanads.co` | Data architect, owner BQ dataset, creador de la infra de migración |
| `soportetech@saleads.ai` | Operador / requester original de la key Gemini, secretAccessor sobre la key |

## 7. Costos mensuales aproximados

| Item | $/mes |
|---|---|
| Cloud Run prod (min=1, ~50k req/mes) | $20-30 |
| Cloud Run staging (min=0, mostly idle) | $1-5 |
| BigQuery (streaming inserts + storage <100MB) | <$1 |
| Secret Manager | <$1 |
| Domain Mapping + cert | $0 |
| Artifact Registry storage (~100MB image × N revs) | <$1 |
| **Total nuevo en GCP** | **~$25-35** |
| Gemini API | ≤$100 (budget cap) |
| **Cloudflare Pro** | (existente, no incremento) |

## 8. Referencias internas

- Repo: [Sale-ADS/sa-help-center](https://github.com/Sale-ADS/sa-help-center)
- PR migración: [#2](https://github.com/Sale-ADS/sa-help-center/pull/2)
- Operations manual: [OPERATIONS.md](./OPERATIONS.md)
- Memorias del equipo data architect: `[[sa-help-center-cloud-run-staging]]`, `[[help-center-gemini-api-key]]`, `[[cloudflare-zone-saleads-ai]]`
