/** Paths under `public/` for entry-page card previews (locale-agnostic). */
const primerosPasos = '/images/screenshots/01-primeros-pasos/configura-tu-cuenta.png';
const conectarPlataformas =
  '/images/screenshots/02-conectar-plataformas/conecta-tus-plataformas.png';
const menu = '/images/screenshots/03-configurar-negocio/nuevo-negocio-menu.png';
const modal = '/images/screenshots/03-configurar-negocio/crear-negocio-modal.png';
const planesCreditos =
  '/images/screenshots/07-planes-creditos/creditos-configuracion.png';
const solucionProblemas =
  '/images/screenshots/08-solucion-problemas/ale-asistente-soporte.png';
const glosario =
  '/images/screenshots/09-informacion-general/glosario.png';
const crearEstrategia =
  '/images/screenshots/04-estrategias/crea-tu-estrategia.png';
const generarCreativos =
  '/images/screenshots/05-generar-creativos/generador-creativos-ia.png';
const lanzarCampana =
  '/images/screenshots/06-lanzar-campana/preparando-estrategia.png';

/** Reuses committed UI screenshots until per-section captures exist. */
export const entryPreviewImages = {
  gettingStarted: primerosPasos,
  connectPlatforms: conectarPlataformas,
  configureBusiness: menu,
  plansCredits: planesCreditos,
  createStrategies: crearEstrategia,
  generateCreatives: generarCreativos,
  launchCampaign: lanzarCampana,
  troubleshooting: solucionProblemas,
  glossary: glosario,
} as const;
