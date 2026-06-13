# Operations Manual — sa-help-center

> Última actualización: 2026-06-06 (post-cutover Vercel → Cloud Run)

Manual de operación día-a-día del servicio `help.saleads.ai`. Si vas a entender cómo está armado todo, lee primero [ARCHITECTURE.md](./ARCHITECTURE.md).

## 1. Quick reference

| Recurso | Identificador |
|---|---|
| URL pública | https://help.saleads.ai |
| Cloud Run service prod | `sa-help-center` (saleads-prod / us-central1) |
| Cloud Run service staging | `sa-help-center-staging` (mismo proyecto/region) |
| Repo | https://github.com/Sale-ADS/sa-help-center |
| Branch de migración | `migration/cloud-run-prep` (mantener vivo hasta Fase 7) |
| Artifact Registry | `us-central1-docker.pkg.dev/saleads-prod/sa-help-center/app` |
| Secret Gemini | `saleads-help-center-gemini-api-key-prod` (saleads-prod) |
| BQ dataset feedback | `saleads-prod.saleads_help_center` |
| Runtime SA | `sa-help-center-runtime@saleads-prod.iam.gserviceaccount.com` |
| CI SA | `sa-help-center-cicd@saleads-prod.iam.gserviceaccount.com` |

## 2. Deploys

### 2.1 Deploy a staging (automático)

Cualquier push a una rama que matchee `main` o `migration/**` dispara GitHub Actions → workflow **Deploy to Cloud Run (staging)**:

1. Build de la imagen Docker (`Dockerfile` multi-stage).
2. Push a Artifact Registry con tags `:<sha>` y `:latest`.
3. Deploy a `sa-help-center-staging` con la imagen recién buildada.
4. Smoke test de `/api/health` (5 retries con backoff).
5. Si hay un PR abierto para esa rama, comenta la URL del staging.

Tiempo típico: **2 minutos**. URL fija: `https://sa-help-center-staging-pw3jsh3cga-uc.a.run.app`.

### 2.2 Deploy a producción (manual con doble confirmación)

GitHub UI → `Sale-ADS/sa-help-center` → **Actions** → **Deploy to Cloud Run (PROD)** → **Run workflow**:

| Campo | Qué poner |
|---|---|
| `image_sha` | El SHA exacto de un commit cuya imagen ya esté en Artifact Registry (típicamente uno ya validado en staging) |
| `confirm` | Exactamente la frase: `deploy to prod` |

Click **Run workflow**. El workflow:
1. Verifica que la imagen `:<sha>` exista en AR (falla si no — protege contra typos).
2. Deploya a `sa-help-center` (servicio prod).
3. Smoke test `/api/health` validando que el commit retornado matche el SHA pedido.
4. Resumen visible en el workflow summary.

**Cómo conseguir un SHA válido para producir**:
- Mirar el último deploy verde de staging en la rama que querés shipear (Actions → Deploy to Cloud Run staging → último run en verde → SHA del commit).
- O `gcloud artifacts docker tags list us-central1-docker.pkg.dev/saleads-prod/sa-help-center/app --limit=5` desde tu terminal.

### 2.3 Cambios al código

```
git checkout migration/cloud-run-prep    # rama de trabajo activa
# ... tus cambios ...
git commit -m "..."
git push                                 # dispara staging automático
# Verificar staging URL funciona
# Cuando esté listo: ir a GH Actions → Deploy to Cloud Run (PROD)
```

## 3. Rollback

### 3.1 Rollback rápido a una revisión Cloud Run previa (más común)

Si el último deploy a prod rompe algo:

```
# Listar revisiones
gcloud run revisions list \
  --service=sa-help-center \
  --region=us-central1 \
  --project=saleads-prod

# Cambiar traffic 100% a la revisión anterior
gcloud run services update-traffic sa-help-center \
  --region=us-central1 \
  --project=saleads-prod \
  --to-revisions=<previous-revision-name>=100
```

RTO: **~30 segundos**. Esto NO requiere rebuild ni redeploy — solo cambia routing.

### 3.2 Rollback completo a Vercel (cutover undo)

Solo si algo grave pasa con Cloud Run o BigQuery. Mientras Vercel siga vivo:

1. Cloudflare → DNS → Records → buscar `help` → Edit.
2. Target: cambiar de `ghs.googlehosted.com` → CNAME original de Vercel (`sa-help-center-3mk66iah5-juanlus-projects-9edd6a...`).
3. Proxy ON (orange cloud, no cambia).
4. Save.

RTO: **3-5 minutos** (propagación CF + TTL). Vercel deployment sigue alive hasta que se decomisione en Fase 7.

## 4. Monitoreo

### 4.1 Logs de la app

Cloud Logging UI → query:
```
resource.type="cloud_run_revision"
resource.labels.service_name="sa-help-center"
```

Eventos estructurados a buscar (todos los handlers loguean en JSON con `severity`):
- `bq_insert_failed` → feedback no aterrizó en BQ. Revisar IAM o schema.
- `gemini_generation_failed` → Gemini API falló. Revisar `model`, `status` en el log.
- `chat_start_failed` → SDK Gemini no pudo iniciar sesión. Raro.
- `chat_feedback_*_error` / `feedback_*_error` → errores genéricos en feedback handlers.

### 4.2 Comandos útiles

```
# Todos los errores de la última hora
gcloud logging read \
  'resource.type=cloud_run_revision AND resource.labels.service_name=sa-help-center AND severity>=ERROR' \
  --limit=50 --freshness=1h --project=saleads-prod

# Solo fallos de Gemini
gcloud logging read \
  'resource.type=cloud_run_revision AND jsonPayload.event=gemini_generation_failed' \
  --limit=20 --freshness=24h --project=saleads-prod

# Volumen de chat por hora
gcloud logging read \
  'resource.type=cloud_run_revision AND httpRequest.requestUrl=~"/api/chat"' \
  --limit=200 --freshness=1h --project=saleads-prod | wc -l
```

### 4.3 Métricas (Cloud Monitoring)

Cloud Run → seleccionar `sa-help-center` → tab **Metrics**:
- Requests/s
- Latencia (p50, p95, p99)
- Instance count
- Container CPU/memory
- Error rate

### 4.4 Costo

GCP Billing → **Budgets** → `saleads-help-center-gemini-prod-monthly` (UID `4f4bad39-fc8a-4dd5-89d7-ddc9894bb0c7`):
- Cap: $100/mes
- Alertas: 50%, 90%, 100% real + 120% forecast
- Filter: `projects/saleads-prod` + servicio Gemini API
- Recipientes: Billing Admins de la cuenta

### 4.5 Cloudflare

Cloudflare → zone `saleads.ai`:
- **Analytics & Logs → Traffic** → filtrar por hostname `help.saleads.ai` para volumen y errores 5xx por país.
- **Security → Security rules** → ver la regla `Throttle help-center chat API` con contador de bloqueos last 24h.

## 5. Tareas comunes

### 5.1 Rotar la API key de Gemini

Antes de la rotación recomendada (2026-08-30) o si la key se compromete:

```
# 1. Crear nueva key en Google AI Studio (https://aistudio.google.com/apikey)
#    bajo el mismo proyecto saleads-prod, con misma API restriction
#    (solo generativelanguage.googleapis.com).

# 2. Agregar nueva versión al secret (NO sobreescribe, agrega)
echo -n "<new-key-value>" | \
  gcloud secrets versions add saleads-help-center-gemini-api-key-prod \
  --data-file=- --project=saleads-prod

# 3. Cloud Run usa :latest, así que en el próximo arranque de instancia
#    recoge la nueva. Para forzar:
gcloud run services update sa-help-center \
  --region=us-central1 --project=saleads-prod \
  --update-secrets=GEMINI_API_KEY=saleads-help-center-gemini-api-key-prod:latest

# 4. Cuando confirmes que la nueva funciona, deshabilitar versiones viejas:
gcloud secrets versions list saleads-help-center-gemini-api-key-prod --project=saleads-prod
gcloud secrets versions disable <old-version-number> \
  --secret=saleads-help-center-gemini-api-key-prod --project=saleads-prod
```

### 5.2 Cambiar el modelo Gemini

Si Google deprecó el modelo actual o queremos uno más barato/mejor:

1. Editar `.github/workflows/deploy-staging.yml` y `deploy-prod.yml`:
   ```
   --set-env-vars=...,GEMINI_MODEL=<nuevo-modelo>,...
   ```
2. Commit + push.
3. Validar en staging (smoke test del chat con un prompt simple).
4. Deploy a prod via workflow_dispatch.

**Verificar antes** qué modelos están vivos consultando el catálogo (no asumir por nombre):
```
KEY=$(gcloud secrets versions access latest \
  --secret=saleads-help-center-gemini-api-key-prod --project=saleads-prod)
curl -s -H "x-goog-api-key: $KEY" \
  "https://generativelanguage.googleapis.com/v1beta/models" | jq '.models[].name'
unset KEY
```

### 5.3 Consultar el feedback

```
# Top 10 respuestas marcadas not-helpful en últimos 30 días
bq query --use_legacy_sql=false \
'SELECT message_id, reason, locale, model, created_at
 FROM `saleads-prod.saleads_help_center.chat_feedback`
 WHERE helpful=false
   AND created_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
 ORDER BY created_at DESC LIMIT 10'

# Páginas con más ratings negativos (últimos 30d)
bq query --use_legacy_sql=false \
'SELECT page_slug, COUNT(*) AS negative_count, COUNT(comment) AS with_comment
 FROM `saleads-prod.saleads_help_center.page_feedback`
 WHERE helpful=false
   AND created_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
 GROUP BY page_slug
 ORDER BY negative_count DESC LIMIT 10'

# Satisfaction rate del chat por día últimos 7 días
bq query --use_legacy_sql=false \
'SELECT DATE(created_at) AS day,
        COUNT(*) AS total,
        COUNTIF(helpful) AS helpful,
        ROUND(COUNTIF(helpful)/COUNT(*)*100, 1) AS satisfaction_pct
 FROM `saleads-prod.saleads_help_center.chat_feedback`
 WHERE created_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
 GROUP BY day ORDER BY day DESC'
```

### 5.4 Ajustar el rate limit

**En Cloudflare** (primary, recomendado):
- Security → Security rules → editar `Throttle help-center chat API`.
- Cambiar requests/period o duration.
- Save.

**En el app** (defense-in-depth, requiere deploy):
- `lib/rate-limit.ts` → `RATE_LIMIT_WINDOW`
- `app/api/chat/route.ts` → `RATE_LIMIT_MAX` (línea ~5)
- `app/api/chat/feedback/route.ts` → `RATE_LIMIT_MAX`
- `app/api/feedback/route.ts` → `RATE_LIMIT_MAX`

### 5.5 Agregar una variable de entorno o secret a Cloud Run

Editar `.github/workflows/deploy-staging.yml` y `deploy-prod.yml`:

Para env var pública (no secreto):
```
--set-env-vars=...,NUEVA_VAR=valor,...
```

Para secreto (debe estar en Secret Manager):
```
--set-secrets=...,NUEVA_VAR=nombre-del-secret:latest,...
```

La runtime SA `sa-help-center-runtime@saleads-prod.iam` necesita `secretAccessor` sobre el secret nuevo.

### 5.6 Ver qué versión está corriendo

```
# Cloud Run revisión actual y % traffic
gcloud run services describe sa-help-center \
  --region=us-central1 --project=saleads-prod \
  --format="value(status.traffic[].revisionName,status.traffic[].percent)"

# O directamente: /api/health expone el commit SHA buildado
curl https://help.saleads.ai/api/health
```

## 6. Troubleshooting

### 6.1 Chat devuelve `GENERATION_ERROR`

Logs → buscar `event=gemini_generation_failed`. Posibles causas:

- **Modelo deprecado** (`404 "no longer available"`): cambiar `GEMINI_MODEL` (ver 5.2). Aprendizaje pasado: `gemini-2.0-flash-lite` se retiró pero el catálogo aún lo listaba — no asumir disponibilidad por listado.
- **API key inválida**: rotar (ver 5.1).
- **Budget excedido**: revisar Billing → Budgets.
- **Safety filter del modelo**: el prompt del usuario triggereó el bloqueo de Gemini. Raro pero pasa con queries adversas.

### 6.2 Feedback devuelve 500

Logs → `event=bq_insert_failed`. Posibles causas:

- Runtime SA perdió IAM en el dataset BQ. Regrant:
  ```
  bq show --format=prettyjson saleads-prod:saleads_help_center > /tmp/d.json
  # editar /tmp/d.json, agregar a access:
  #   {"role":"WRITER","userByEmail":"sa-help-center-runtime@saleads-prod.iam.gserviceaccount.com"}
  bq update --source /tmp/d.json saleads-prod:saleads_help_center
  rm /tmp/d.json
  ```
- Schema cambió y el row no encaja. Revisar el error message del log.
- Streaming buffer lleno (raro): retry naturalmente al próximo request.

### 6.3 `/api/health` devuelve un commit que no esperaba

Cloud Run tiene una revisión vieja sirviendo aún. Force traffic 100% a la nueva:
```
gcloud run services update-traffic sa-help-center \
  --region=us-central1 --project=saleads-prod \
  --to-latest
```

### 6.4 Sitio retorna 5xx o no carga

Orden de check:
1. **Cloudflare status**: https://www.cloudflarestatus.com (raro pero hay incidentes globales)
2. **Cloud Run status**: GCP Console → Cloud Run → `sa-help-center` → tab Logs
3. **Instancias agotadas**: si tráfico spike, `max-instances=10` puede ser bajo. Subir en el workflow.
4. **Quota Gemini**: si Gemini cae, `/api/chat` retorna 5xx pero docs estáticas siguen sirviendo. Validar `/es` carga ok.

### 6.5 Cert SSL expiró o no se renovó

No debería pasar — Google auto-renueva 90 días antes. Si pasa:
```
gcloud beta run domain-mappings describe \
  --domain=help.saleads.ai --region=us-central1 \
  --project=saleads-prod
```
Mirar `status.conditions[type=CertificateProvisioned]`. Si `False`, recrear el mapping (`delete` + `create` con mismo dominio).

### 6.6 Workflow de deploy falla

GitHub Actions → ver logs del run.

Errores comunes:
- **Auth failed**: el secret `GCP_SA_KEY_HELP_CENTER` puede haber sido rotado/borrado. Regenerar key del CI SA y subir.
- **Image not found** (solo en deploy-prod): el SHA que pasaste no tiene imagen en AR. Verificar que staging lo haya buildado primero.
- **`run.admin` denegado**: el CI SA perdió ese rol. Regrant:
  ```
  gcloud projects add-iam-policy-binding saleads-prod \
    --member="serviceAccount:sa-help-center-cicd@saleads-prod.iam.gserviceaccount.com" \
    --role="roles/run.admin"
  ```

## 7. Contactos

- **Owner / operador principal**: Jorge Triana — soportetech@saleads.ai (GitHub: `soportetech-dev`)
- **Data architect**: Leonardo — arquitectosoluciones@juanads.co
- **Legacy hosting (hasta Fase 7)**: Vercel team `juanlus-projects`

## 8. Documentos relacionados

- [ARCHITECTURE.md](./ARCHITECTURE.md) — arquitectura y decisiones de diseño
- PR #2 del repo — historial de migración Vercel → Cloud Run
