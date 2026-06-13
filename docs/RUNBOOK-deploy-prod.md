# Runbook — Deploy a producción (`help.saleads.ai`)

> **Para**: Jorge Triana (soportetech@saleads.ai) — operador del servicio.
> **Tiempo total**: ~3 minutos de trabajo activo + ~2 minutos de espera del workflow.
> **Riesgo**: bajo. Rollback en <1 minuto si algo falla.

---

## 🟡 Deploy pendiente AHORA

Hay un commit validado en staging esperando deploy a producción.

| Item | Valor |
|---|---|
| **Commit SHA** | `e29e55f1eee14bef05df30dcce361e9ce9d150c7` |
| **Qué incluye** | Migración Cloud Run consolidada en `main` + página nueva `ubicacion-detallada` (PR #3 y #4) |
| **Validado en staging desde** | 2026-06-13 |
| **Cómo verificar staging antes**: | `curl https://sa-help-center-staging-pw3jsh3cga-uc.a.run.app/api/health` debería retornar el SHA `e29e55f1...` |

Si confirmaste que staging responde bien con ese SHA, pasá a "Paso a paso" abajo y usá ese commit.

---

## Cuándo usar este runbook

Cada vez que querás publicar a `https://help.saleads.ai` un cambio que ya está en `main` y ya fue validado en staging.

Recordá: **el deploy a prod NO es automático** — está diseñado así para que ningún merge accidental afecte el sitio real. Solo se dispara cuando vos lo decidís.

## Antes de empezar (pre-flight, 30 segundos)

1. **Confirmar que staging tiene el SHA que querés deployar**:
   ```
   curl https://sa-help-center-staging-pw3jsh3cga-uc.a.run.app/api/health
   ```
   El campo `commit` debe ser el SHA que pensás promover. Si no matchea, hay que esperar a que el workflow `Deploy to Cloud Run (staging)` termine de buildar y deployar el commit último de `main`.

2. **Navegar staging un par de páginas** — verificar visualmente que no se rompió nada (homepage `/es`, alguna página de docs, el widget de chat).

3. **Opcional pero recomendado**: avisar en Slack al equipo "voy a hacer deploy a prod del help-center, SHA <abc>". Si algo se rompe sabe el equipo a quién preguntar.

## Paso a paso

### 1. Conseguir el SHA del commit a deployar

Tres formas equivalentes de conseguirlo:

- **Desde staging** (lo más confiable): `curl https://sa-help-center-staging-pw3jsh3cga-uc.a.run.app/api/health` → copiá el campo `commit`.
- **Desde GitHub**: https://github.com/Sale-ADS/sa-help-center/commits/main → último commit verde → copiar el SHA completo (40 chars).
- **Desde local**: `cd sa-help-center && git fetch && git log origin/main --oneline -1` → copiar el SHA.

### 2. Ir al workflow de deploy a prod

Abrí: https://github.com/Sale-ADS/sa-help-center/actions

En el sidebar izquierdo, click **Deploy to Cloud Run (PROD)**.

### 3. Disparar el workflow manualmente

Click el botón **Run workflow** (arriba a la derecha, suele ser un dropdown).

Se abre un mini-form con 3 campos:

| Campo | Valor |
|---|---|
| **Use workflow from / Branch** | `main` (default) |
| **`image_sha`** | Pegá el SHA que conseguiste en el paso 1 (40 chars completo) |
| **`confirm`** | Escribí **exactamente** la frase: `deploy to prod` |

Click el botón verde **Run workflow**.

### 4. Esperar y mirar el progreso (~2 min)

- La página refresca con el nuevo run en la lista (status amarillo "in_progress").
- Click en el run para ver detalles.
- Pasos que deberías ver pasar uno por uno:
  1. **Confirmation gate** — verifica que escribiste "deploy to prod" bien
  2. **Authenticate to GCP** — usa el secret `GCP_SA_KEY_HELP_CENTER`
  3. **Verify image exists in Artifact Registry** — falla acá si el SHA es incorrecto o no fue buildado
  4. **Deploy to Cloud Run prod** — ~30-60 segundos
  5. **Smoke test /api/health** — valida que retorna el SHA esperado
  6. **Summary** — link a la URL prod

Si todos los steps salen verdes, **el deploy fue exitoso**.

### 5. Validar en el navegador

1. Abrí `https://help.saleads.ai/api/health` (nueva pestaña). Debe retornar:
   ```json
   {"status":"ok","commit":"<el-sha-que-deployaste>","uptime_seconds":<algun-numero-bajo>}
   ```
   El `uptime_seconds` cerca de 0 confirma que es la instancia nueva.

2. Navegá la home `https://help.saleads.ai/es` para verificar render.

3. Si el cambio era de UI o contenido nuevo, navegá específicamente a la página que cambió (por ejemplo, después del deploy de hoy: `https://help.saleads.ai/es/docs/configurar-negocio/ubicacion-detallada`).

4. Probá el chat: abrí el widget, mandá una pregunta tonta tipo "hola", verificá que responde.

Si todo eso responde sin errores, **deploy completado**. Cerrá el ticket o avisá en Slack que está live.

## Si algo falla

### El workflow falla en "Confirmation gate"

Escribiste mal la frase `deploy to prod` (debe ser exacta, sin comillas, todo minúsculas, con espacios). Click "Run workflow" de nuevo escribiéndola bien.

### El workflow falla en "Verify image exists in Artifact Registry"

El SHA que pasaste no tiene una imagen buildada. Causas comunes:
- Copiaste mal el SHA (typo)
- El workflow de staging para ese commit aún no terminó → esperá que termine y reintentá
- El workflow de staging falló para ese commit → arreglá el commit primero (mirá los logs del staging deploy)

### El workflow falla en "Smoke test /api/health"

El deploy técnicamente pasó pero el health check no responde como esperado. Causas:
- Cloud Run no levantó la instancia bien → mirá Cloud Run console
- El commit deployado no matchea el que pediste (extraño, escalá al data architect)

**No estás pateando nada en producción todavía** — Cloud Run mantiene el revision anterior sirviendo el 100% del tráfico si el deploy nuevo no pasa health check. Sitio sigue funcionando con la versión vieja.

### El deploy pasó pero el sitio prod tiene un bug

Rollback rápido a la revisión anterior de Cloud Run (NO toca DNS):

```
# Listar revisiones
gcloud run revisions list \
  --service=sa-help-center \
  --region=us-central1 \
  --project=saleads-prod

# Cambiar tráfico 100% a la revisión anterior (poné el nombre que aparece en el listado)
gcloud run services update-traffic sa-help-center \
  --region=us-central1 \
  --project=saleads-prod \
  --to-revisions=<previous-revision-name>=100
```

RTO: **30 segundos**. Después podés debuggear sin presión.

### Si nada funciona y necesitás volver a Vercel

Mientras el Vercel deployment esté vivo (hasta que decomisionemos en Fase 7), tenés la salida de emergencia documentada en [OPERATIONS.md §3.2](./OPERATIONS.md#32-rollback-completo-a-vercel-cutover-undo).

## Después del deploy

Si todo salió bien:
- Comentá en el PR original que se mergeó: "Deployed to prod (SHA `<abc>`) at <hora>". Eso da trazabilidad.
- Actualizá un sticky note / Notion / Linear ticket si lo tenés.

## Contactos en caso de duda

- **Arquitecto de datos** (escalación técnica si el deploy se rompe raro): Leonardo — arquitectosoluciones@juanads.co
- **Logs del runtime en Cloud Run**: GCP Console → Cloud Run → `sa-help-center` (saleads-prod / us-central1) → tab "Logs"
- **Documentación de arquitectura**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Tareas comunes (rotar key Gemini, cambiar modelo, etc.)**: [OPERATIONS.md](./OPERATIONS.md)

## FAQ corto

**¿Por qué no es automático el deploy a prod?**
Para que un merge accidental a `main` no rompa producción. El paso manual es la barrera intencional.

**¿Cada cuánto puedo deployar?**
Las veces que quieras. Cada deploy son ~2 min, no afecta tráfico activo (Cloud Run hace rolling update). Si hay error, rollback en 30s.

**¿Y si quiero deployar un SHA viejo?**
Funciona igual, solo poné el SHA viejo en `image_sha`. El workflow verifica que la imagen exista en Artifact Registry (las imágenes viejas no se borran).

**¿Y si necesito cambiar algo del environment (ej. modelo Gemini)?**
No con este runbook — eso se hace editando los workflows (`deploy-staging.yml` + `deploy-prod.yml`), mergeando a main, y disparando el deploy. Ver [OPERATIONS.md §5.2](./OPERATIONS.md#52-cambiar-el-modelo-gemini).
