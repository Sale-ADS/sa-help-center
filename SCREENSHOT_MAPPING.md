# Screenshot Mapping Guide for SaleAds.ai Documentation

This document provides a comprehensive mapping of where screenshots should be placed across all 41 documentation files, including specific UI elements to capture and implementation priorities.

**Last Updated:** March 2026  
**Total Documentation Files:** 41  
**Estimated Screenshots Needed:** 65-75

---

## Priority Legend

- 🔴 **CRITICAL** - Core user flows, high confusion risk
- 🟠 **HIGH** - Important features, frequently referenced
- 🟡 **MEDIUM** - Helpful but not essential
- 🟢 **LOW** - Nice-to-have, reference material

---

## 1. PRIMEROS PASOS (First Steps) - 4 files

### 1.1 crear-cuenta.mdx
**Purpose:** Login/registration flow with Google/Microsoft

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 1.1.1 | After line 19 | SaleAds.ai homepage showing "Comenzar Gratis" and "Iniciar sesión" buttons | Landing page with both CTAs visible, ideally showing login modal partially visible | 🔴 CRITICAL |
| 1.1.2 | After line 25 | Login modal with Google and Microsoft options side by side | Both "Sign in with Google" and "Sign in with Microsoft" buttons clearly visible | 🔴 CRITICAL |
| 1.1.3 | After line 39 | Google/Microsoft authorization window | Standard OAuth screen requesting permissions | 🟡 MEDIUM |
| 1.1.4 | After line 63 | Language selector dropdown | Top-right corner showing language options (English ▼) | 🟢 LOW |

### 1.2 seleccionar-plan.mdx
**Purpose:** Plan selection interface

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 1.2.1 | After intro | Plan selection screen showing PRO, BUSINESS, AGENCY tiers | All three plans visible with pricing, features, and "Seleccionar" buttons | 🔴 CRITICAL |
| 1.2.2 | Section comparison | Detailed feature comparison table | Expanded view showing feature-by-feature comparison | 🟠 HIGH |
| 1.2.3 | After selection | Plan confirmation/upgrade screen | Showing selected plan highlighted and next steps | 🟠 HIGH |

### 1.3 planes-disponibles.mdx
**Purpose:** Detailed plan features and differences

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 1.3.1 | Feature breakdown | Detailed plan comparison matrix | Table showing all features across PRO/BUSINESS/AGENCY | 🟠 HIGH |
| 1.3.2 | Limits section | Business/Agency limits display | Showing "3 negocios", "10 negocios" clearly | 🟡 MEDIUM |

### 1.4 navegacion-dashboard.mdx
**Purpose:** Dashboard navigation and structure overview

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 1.4.1 | After line 13 | **FULL DASHBOARD OVERVIEW** - Complete dashboard view | Main dashboard showing sidebar menu, top bar with business selector, notifications, profile, and main content area | 🔴 CRITICAL |
| 1.4.2 | Section "Menú de Navegación" | Sidebar menu expanded | Left sidebar showing all menu sections: Centro de Marca, Centro de Estrategias, Configuración | 🔴 CRITICAL |
| 1.4.3 | Section "Centro de Marca" | Centro de Marca submenu expanded | Dashboard, Configura Tu Negocio, Cuentas Conectadas visible | 🟠 HIGH |
| 1.4.4 | Section "Centro de Estrategias" | Centro de Estrategias submenu | Estrategia De Copy, Estrategias Activas options | 🟠 HIGH |
| 1.4.5 | Section "Selector de Negocio" | Business selector dropdown open | Dropdown showing multiple businesses with "Cambiar" option | 🟠 HIGH |
| 1.4.6 | Section "Barra Superior" | Top bar elements | Search bar, notifications bell, profile avatar with dropdown | 🟠 HIGH |
| 1.4.7 | Section "Indicadores Importantes" | Meta connection status indicators | Showing "No conectado", "Conectado - Configuración pendiente", "Configurado" states | 🟠 HIGH |
| 1.4.8 | Corner indicator | Credit balance display | Top-right corner showing "400 créditos" or similar | 🟡 MEDIUM |

---

## 2. CONECTAR PLATAFORMAS (Connect Platforms) - 7 files

### 2.1 meta-ads/requisitos-previos.mdx
**Purpose:** Prerequisites for Meta Ads connection

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 2.1.1 | Requirements checklist | Prerequisites verification screen | Checklist showing Business Manager, Ad Account, Payment method with status icons | 🟠 HIGH |
| 2.1.2 | Error state | Missing requirement warning | Modal showing "Configuración pendiente" with specific missing items | 🟡 MEDIUM |

### 2.2 meta-ads/conectar-meta.mdx
**Purpose:** Meta Ads connection process

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 2.2.1 | Connection button | "Conectar con Meta" button | Prominent button in Cuentas Conectadas section | 🔴 CRITICAL |
| 2.2.2 | OAuth flow | Meta login popup | Standard Facebook login requesting permissions | 🔴 CRITICAL |
| 2.2.3 | Permissions screen | Meta permissions request | Screen showing requested permissions (ads_management, business_management) | 🟠 HIGH |
| 2.2.4 | Success state | Connection successful notification | Green checkmark with "Cuenta conectada" message | 🟠 HIGH |

### 2.3 meta-ads/configurar-meta.mdx
**Purpose:** Selecting Business Manager and Ad Account

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 2.3.1 | Business Manager selection | BM dropdown menu | Dropdown showing available Business Managers with selection | 🔴 CRITICAL |
| 2.3.2 | Ad Account selection | Ad Account selection screen | List of ad accounts with balances and selection option | 🔴 CRITICAL |
| 2.3.3 | Page selection | Facebook Page selector | Available pages with profile pictures and selection checkboxes | 🟠 HIGH |
| 2.3.4 | Complete configuration | All selections made | Screen showing BM, Ad Account, and Page all selected with "Guardar" button | 🟠 HIGH |

### 2.4 meta-ads/verificar-conexion.mdx
**Purpose:** Verifying Meta connection status

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 2.4.1 | Status dashboard | Connection status overview | Green checks for all connected elements, warnings for missing | 🟠 HIGH |
| 2.4.2 | Error state | Connection issue display | Red indicators showing which component needs attention | 🟡 MEDIUM |

### 2.5 meta-ads/errores-meta.mdx
**Purpose:** Common Meta connection errors

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 2.5.1 | Error examples | Screenshots of specific error messages | "Permisos insuficientes", "Cuenta no encontrada", etc. | 🟡 MEDIUM |
| 2.5.2 | Troubleshooting | Step-by-step error resolution | Screenshots showing where to find settings in Meta Business Manager | 🟡 MEDIUM |

### 2.6 google-ads/conectar-google.mdx
**Purpose:** Google Ads connection (if applicable)

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 2.6.1 | Connection process | Google OAuth flow | Similar to Meta but for Google Ads | 🟡 MEDIUM |

### 2.7 tiktok-ads/conectar-tiktok.mdx
**Purpose:** TikTok Ads connection (if applicable)

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 2.7.1 | Connection process | TikTok authorization | TikTok for Business connection flow | 🟡 MEDIUM |

---

## 3. CONFIGURAR NEGOCIO (Business Setup) - 7 files

### 3.1 informacion-del-negocio.mdx
**Purpose:** Basic business information setup

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 3.1.1 | Business profile form | Business information input fields | Name, industry, website, description fields | 🟠 HIGH |
| 3.1.2 | Social media links | Social media integration section | Fields for Instagram, Facebook, website URLs | 🟡 MEDIUM |

### 3.2 brief-audio.mdx
**Purpose:** Creating business brief via audio recording

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 3.2.1 | Recording interface | Audio recorder UI | "Grabar Audio" tab selected with "Comenzar a Grabar" button | 🔴 CRITICAL |
| 3.2.2 | Recording in progress | Active recording state | Timer counting up, waveform visualization, "Detener" button | 🔴 CRITICAL |
| 3.2.3 | Playback interface | Recording playback | Play button, waveform, duration display, "Grabar de Nuevo" option | 🟠 HIGH |
| 3.2.4 | Upload tab | "Subir Audio" interface | Drag-and-drop area with supported formats listed | 🟠 HIGH |
| 3.2.5 | Processing states | AI processing stages | Sequential screens: "Analizando tu marca" → "Analizando redes sociales" → "Generando Brief" → "¡Brief Generado!" | 🔴 CRITICAL |
| 3.2.6 | Error states | Common error messages | "Audio muy corto", "No se pudo acceder al micrófono", "Archivo muy grande" | 🟡 MEDIUM |

### 3.3 revisar-brief.mdx
**Purpose:** Reviewing and editing AI-generated brief

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 3.3.1 | Brief overview | Generated brief display | All sections: Audiencia, Propuesta de valor, Objetivos, Tono, Mensajes clave | 🔴 CRITICAL |
| 3.3.2 | Edit mode | Brief editing interface | Expandable sections with edit icons and input fields | 🟠 HIGH |
| 3.3.3 | Audience section | Target audience details | Demographics, interests, behaviors sections | 🟡 MEDIUM |
| 3.3.4 | Value proposition | Propuesta de valor display | Unique selling points and competitive advantages | 🟡 MEDIUM |

### 3.4 ubicacion-audiencia.mdx
**Purpose:** Setting audience location/geography

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 3.4.1 | Location selector | Geographic targeting interface | Country/city selector with search and multiple selection | 🟠 HIGH |
| 3.4.2 | Selected locations | List of chosen locations | Display showing "Colombia, Bogotá, Medellín" or similar | 🟠 HIGH |
| 3.4.3 | Map view | Geographic visualization | Map showing selected regions highlighted | 🟡 MEDIUM |

### 3.5 cuentas-conectadas.mdx
**Purpose:** Managing connected advertising accounts

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 3.5.1 | Connected accounts dashboard | List of all connected platforms | Meta, Google, TikTok with connection status and last synced | 🔴 CRITICAL |
| 3.5.2 | Account details | Expanded account view | BM name, Ad Account ID, Page name, status indicators | 🟠 HIGH |
| 3.5.3 | Disconnect confirmation | Disconnect warning modal | "¿Estás seguro de desconectar?" with consequences explained | 🟡 MEDIUM |

### 3.6 redes-sociales.mdx
**Purpose:** Connecting social media profiles

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 3.6.1 | Social profiles section | Instagram/Facebook connection | Connected accounts with profile pictures and follower counts | 🟡 MEDIUM |
| 3.6.2 | Instagram insights | Connected Instagram data | Recent posts, engagement metrics pulled from API | 🟢 LOW |

### 3.7 perfil-negocio.mdx
**Purpose:** Complete business profile management

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 3.7.1 | Profile overview | Complete business profile view | All sections: info, brief, locations, connected accounts | 🟠 HIGH |
| 3.7.2 | Edit profile | Profile editing mode | All fields editable with save/cancel buttons | 🟡 MEDIUM |

---

## 4. ESTRATEGIAS (Strategies) - 8 files

### 4.1 que-es-estrategia.mdx
**Purpose:** Strategy concepts and overview

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 4.1.1 | Strategy definition | Strategy concept visualization | Diagram showing how strategies connect objectives → creatives → results | 🟠 HIGH |
| 4.1.2 | Strategy examples | Sample strategy cards | 2-3 strategy cards showing different objectives (Ventas, Tráfico, Reconocimiento) | 🟠 HIGH |

### 4.2 explorar-estrategias.mdx
**Purpose:** Strategy catalog browsing

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 4.2.1 | Strategy catalog | Main strategies grid/list | Multiple strategy cards with images, names, descriptions | 🔴 CRITICAL |
| 4.2.2 | Category filter | Filtered view | Strategies filtered by "E-commerce", "Servicios", "Apps" | 🟠 HIGH |
| 4.2.3 | Search results | Search functionality | Search bar with "ventas" typed and filtered results | 🟡 MEDIUM |
| 4.2.4 | Strategy detail | Individual strategy page | Full strategy description with requirements, objectives, and "Usar esta estrategia" button | 🔴 CRITICAL |
| 4.2.5 | Favorites/bookmarks | Saved strategies section | User's saved/bookmarked strategies with heart icons | 🟡 MEDIUM |

### 4.3 configurar-estrategia.mdx
**Purpose:** Strategy configuration wizard

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 4.3.1 | Configuration header | Strategy name and category | Top section showing selected strategy with breadcrumb | 🟠 HIGH |
| 4.3.2 | Verification panel | Pre-flight checklist | "Cuenta de Meta conectada ✅" and "Cuenta publicitaria configurada ✅/❌" | 🔴 CRITICAL |
| 4.3.3 | Budget input | Daily budget field | Input with $8.00 USD example, showing minimum/recommended/maximum | 🔴 CRITICAL |
| 4.3.4 | Location verification | Audience location display | Showing configured locations from brief with option to edit | 🟠 HIGH |
| 4.3.5 | Creative upload section | "Sube creativos" area | Tab selector: "Subir manualmente" vs "Generar con IA" | 🔴 CRITICAL |
| 4.3.6 | Manual upload | File uploader interface | Drag-and-drop area with supported formats listed | 🟠 HIGH |
| 4.3.7 | Progress indicator | Upload counter | "Archivos cargados: 2/3 (1 restante)" with progress bar | 🟠 HIGH |
| 4.3.8 | "Crear anuncio" button | Primary action button | Prominent button with loading state when processing | 🔴 CRITICAL |
| 4.3.9 | Processing modal | Real-time upload progress | "Subiendo creativos a Meta" → "Procesando" → "Generando copies con IA" | 🔴 CRITICAL |
| 4.3.10 | Error examples | Common configuration errors | "Por favor selecciona al menos una ubicación", "No hay negocio seleccionado" | 🟡 MEDIUM |

### 4.4 subir-creativos.mdx
**Purpose:** Manual creative upload detailed guide

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 4.4.1 | File uploader | Detailed upload interface | Drag zone with file selection and format specifications | 🟠 HIGH |
| 4.4.2 | File list | Uploaded files display | Thumbnails with filenames, sizes, and delete/reorder options | 🟠 HIGH |
| 4.4.3 | Video specifications | Video requirements panel | MP4/MOV/AVI with 10MB limit, 1080x1920 resolution | 🟡 MEDIUM |
| 4.4.4 | Image specifications | Image requirements panel | JPG/PNG with 10MB limit, 1080x1080 or 1080x1350 | 🟡 MEDIUM |
| 4.4.5 | Error messages | Upload error states | "Archivo muy grande", "Formato no soportado", "Error al cargar" | 🟡 MEDIUM |
| 4.4.6 | Reorder interface | Creative ordering | Drag handles showing how to change creative priority | 🟢 LOW |

### 4.5 posts-instagram.mdx
**Purpose:** Using Instagram posts as creative source

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 4.5.1 | Instagram connection | Connected Instagram posts | Grid of recent posts with engagement metrics | 🟡 MEDIUM |
| 4.5.2 | Post selection | Choosing posts for strategy | Selected posts highlighted with checkmarks | 🟡 MEDIUM |
| 4.5.3 | Post preview | Individual post view | Full post with caption, likes, comments count | 🟢 LOW |

### 4.6 catalogo-productos.mdx
**Purpose:** Product catalog integration

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 4.6.1 | Catalog overview | Product catalog view | Grid of products with images, names, prices | 🟡 MEDIUM |
| 4.6.2 | Dynamic creative | Catalog-based ad creation | Showing how products populate creative automatically | 🟡 MEDIUM |

### 4.7 objetivos-campana.mdx
**Purpose:** Campaign objectives explained

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 4.7.1 | Objective selector | Campaign objective options | Visual comparison of Ventas, Tráfico, Reconocimiento, Engagement | 🟠 HIGH |
| 4.7.2 | Objective details | Expanded objective info | Description, use cases, and recommended strategies | 🟡 MEDIUM |

### 4.8 estrategias-whatsApp.mdx
**Purpose:** WhatsApp-specific strategies

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 4.8.1 | WhatsApp setup | WhatsApp Business integration | Phone number input and verification screen | 🟡 MEDIUM |
| 4.8.2 | WhatsApp strategy | WhatsApp click-to-message ad | Preview showing WhatsApp button in ad | 🟡 MEDIUM |

---

## 5. GENERAR CREATIVOS CON IA (AI Creative Generation) - 4 files

### 5.1 introduccion-al-generador.mdx
**Purpose:** AI image generator introduction

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 5.1.1 | Generator access | "Generar con IA" button location | Where button appears in strategy configuration | 🔴 CRITICAL |
| 5.1.2 | Generator interface | Main AI generator screen | Input field, optional product image upload, quality level selector | 🔴 CRITICAL |
| 5.1.3 | Product image upload | Reference image upload | User's product photo uploaded for AI to incorporate | 🟠 HIGH |
| 5.1.4 | Quality selection | Pro vs Ultra selector | Two options with credit costs displayed: "Pro (50 créditos)" / "Ultra (100 créditos)" | 🔴 CRITICAL |
| 5.1.5 | Generating state | AI processing | Loading animation with "Generando imágenes..." progress | 🟠 HIGH |
| 5.1.6 | Results grid | Generated images display | 4-6 generated images in grid format with selection checkboxes | 🔴 CRITICAL |
| 5.1.7 | Image selection | Selecting images | User has checked 2 of 4 images, "Usar seleccionados" button active | 🟠 HIGH |
| 5.1.8 | Credit warning | Insufficient credits | "Créditos insuficientes - Faltan X créditos" message | 🟡 MEDIUM |

### 5.2 prompts-efectivos.mdx
**Purpose:** Writing effective prompts for AI

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 5.2.1 | Good prompt example | Effective prompt input | Well-written prompt with results | 🟠 HIGH |
| 5.2.2 | Bad prompt example | Poor prompt input | Vague prompt with mediocre results for comparison | 🟠 HIGH |
| 5.2.3 | Before/after | Prompt refinement | Same concept with basic vs detailed prompt results | 🟡 MEDIUM |
| 5.2.4 | Style examples | Different visual styles | Same prompt with "minimalista", "vibrante", "elegante" modifiers | 🟡 MEDIUM |

### 5.3 niveles-calidad.mdx
**Purpose:** Quality levels Pro vs Ultra explained

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 5.3.1 | Side-by-side comparison | Pro vs Ultra visual difference | Same prompt showing both quality levels | 🔴 CRITICAL |
| 5.3.2 | Quality selector | Credit cost display | "Pro: 50 créditos | Ultra: 100 créditos" with visual indicators | 🟠 HIGH |
| 5.3.3 | Resolution info | Technical specifications | Resolution, detail level, processing time differences | 🟡 MEDIUM |

### 5.4 galeria-creativos.mdx
**Purpose:** Managing generated creative library

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 5.4.1 | Creative gallery | All generated images grid | Thumbnails with generation date, prompt preview, quality level | 🟡 MEDIUM |
| 5.4.2 | Creative detail | Individual image view | Full size with metadata: prompt, date, quality, credits used | 🟢 LOW |
| 5.4.3 | Organization | Folders/categories | User-created folders organizing images by campaign | 🟢 LOW |
| 5.4.4 | Download options | Export interface | Download buttons with format/size options | 🟢 LOW |

---

## 6. LANZAR CAMPAÑA (Launch Campaign) - 5 files

### 6.1 gestionar-campanas.mdx
**Purpose:** Campaign management and preview

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 6.1.1 | Preview screen | Full preview interface | Showing ad as it will appear on Facebook/Instagram | 🔴 CRITICAL |
| 6.1.2 | Platform tabs | Feed/Stories/Reels selector | Tabs showing how ad appears in different placements | 🔴 CRITICAL |
| 6.1.3 | Feed placement | Ad in Facebook Feed | 1:1 or 4:5 format with all elements: name, label, creative, copy, CTA | 🔴 CRITICAL |
| 6.1.4 | Stories placement | Ad in Instagram Stories | 9:16 full-screen format | 🟠 HIGH |
| 6.1.5 | Reels placement | Ad in Reels | 9:16 format with overlay text | 🟠 HIGH |
| 6.1.6 | Carousel (if applicable) | Multiple creatives | Swipeable carousel with multiple images/videos | 🟡 MEDIUM |
| 6.1.7 | Character counter | Copy length indicator | "125 caracteres restantes" or "-15 caracteres sobre el límite" | 🟡 MEDIUM |
| 6.1.8 | Navigation arrows | Multiple creatives navigation | Left/right arrows with "Video #1 | Video #2 | Video #3" tabs | 🟡 MEDIUM |

### 6.2 editar-copies.mdx
**Purpose:** Editing AI-generated ad copy

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 6.2.1 | Copy editing interface | Editable copy fields | Text fields for "Texto principal", "Título", "Descripción", "CTA" | 🔴 CRITICAL |
| 6.2.2 | AI suggestions | Copy alternatives | "Ver más opciones" button showing AI-generated variations | 🟠 HIGH |
| 6.2.3 | Character limits | Visual indicators | Fields showing current/max characters (e.g., "115/125") | 🟠 HIGH |
| 6.2.4 | Preview updates | Live preview changes | Ad preview updating as user types new copy | 🟠 HIGH |
| 6.2.5 | Reset option | Revert to original | "Restaurar copia original" button | 🟢 LOW |

### 6.3 revision-final.mdx
**Purpose:** Final review before launch

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 6.3.1 | Review modal | Summary screen | Modal showing: Estrategia, Nombre de campaña, Presupuesto, Creativos | 🔴 CRITICAL |
| 6.3.2 | Warning message | Paused status notice | "⚠️ La estrategia se creará en estado PAUSADO" prominently displayed | 🔴 CRITICAL |
| 6.3.3 | Verification checklist | Pre-launch verification | Visual checklist showing Content ✓, Configuration ✓, Infrastructure ✓ | 🟠 HIGH |
| 6.3.4 | Launch confirmation | Final confirmation dialog | "¿Lanzar estrategia?" with "Cancelar" and "Sí, lanzar" buttons | 🔴 CRITICAL |
| 6.3.5 | Launch progress | Real-time launch steps | Sequential: "Guardando copies" → "Preparando campaña" → "Lanzando en Meta" | 🔴 CRITICAL |
| 6.3.6 | Success state | Launch complete | ✅ "Estrategia creada exitosamente" with status "PAUSADO" | 🔴 CRITICAL |
| 6.3.7 | Error state | Launch failed | Error message with details and retry option | 🟡 MEDIUM |
| 6.3.8 | Post-launch options | Next steps buttons | "Cerrar", "Ver mis estrategias", "Activar estrategia" options | 🟠 HIGH |

### 6.4 lanzar-meta.mdx
**Purpose:** Meta Ads launch specifics

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 6.4.1 | Meta campaign view | Adsmanager.facebook.com | Screenshot of campaign as it appears in Meta (paused state) | 🟠 HIGH |
| 6.4.2 | Activate toggle | Status change | Switching from "Pausado" to "Activo" in Meta Ads Manager | 🟠 HIGH |
| 6.4.3 | Status indicators | Campaign status legend | Visual showing: Pausado, En revisión, Activa, Rechazada, Limitada | 🟠 HIGH |
| 6.4.4 | Metrics view | Initial metrics | Impressions, Clics, CTR from Meta Ads Manager | 🟡 MEDIUM |

### 6.5 estrategias-lanzadas.mdx
**Purpose:** Managing launched strategies

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 6.5.1 | Active strategies list | Dashboard view | Table/cards showing all launched strategies with status, dates, metrics | 🔴 CRITICAL |
| 6.5.2 | Strategy card | Individual strategy view | Strategy name, status badge, launch date, daily budget, quick actions | 🟠 HIGH |
| 6.5.3 | Status filters | Filtering by status | Tabs: "Todas", "Activas", "Pausadas", "En revisión", "Rechazadas" | 🟠 HIGH |
| 6.5.4 | Quick actions | Action buttons | "Activar", "Pausar", "Editar", "Duplicar", "Eliminar" buttons | 🟠 HIGH |
| 6.5.5 | Performance preview | Metrics snapshot | Mini charts showing spend, impressions, clicks over time | 🟡 MEDIUM |
| 6.5.6 | Empty state | No strategies yet | "No tienes estrategias activas" with CTA to create first | 🟡 MEDIUM |

---

## 7. PLANES Y CRÉDITOS (Plans & Credits) - 4 files

### 7.1 sistema-creditos.mdx
**Purpose:** Understanding the credits system

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 7.1.1 | Credit balance display | Multiple locations | Header showing "400 créditos", generator showing "50 créditos restantes" | 🔴 CRITICAL |
| 7.1.2 | Credit consumption | During generation | "Esta generación consumirá 50 créditos" warning before confirm | 🟠 HIGH |
| 7.1.3 | Insufficient credits | Error modal | "Créditos insuficientes - Faltan X créditos" with upgrade options | 🟡 MEDIUM |
| 7.1.4 | Credit history | Usage log | Table showing date, action, credits used/added, balance | 🟡 MEDIUM |

### 7.2 creditos-incluidos.mdx
**Purpose:** Credits included in each plan

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 7.2.1 | Plan comparison | Credits by plan | Visual table: PRO (400), BUSINESS (3,180), AGENCY (consultar) | 🟠 HIGH |
| 7.2.2 | Image calculation | Usage estimator | "Con 400 créditos puedes generar: 8 imágenes Pro o 4 Ultra" | 🟡 MEDIUM |
| 7.2.3 | Credit breakdown | Detailed usage | Example campaign showing how credits are consumed | 🟡 MEDIUM |

### 7.3 facturacion.mdx
**Purpose:** Billing and payment management

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 7.3.1 | Billing overview | Payment methods | Saved cards, PayPal, other payment methods | 🟠 HIGH |
| 7.3.2 | Invoice history | Past invoices | List with dates, amounts, status (Pagado, Pendiente), download links | 🟠 HIGH |
| 7.3.3 | Invoice detail | Individual invoice | Breakdown of charges, dates, payment method, PDF download | 🟡 MEDIUM |
| 7.3.4 | Update payment | Edit payment method | Form to add new card or update existing | 🟡 MEDIUM |
| 7.3.5 | Cancel subscription | Cancellation flow | Confirmation screens for subscription cancellation | 🟢 LOW |

### 7.4 cambiar-plan.mdx
**Purpose:** Upgrading or changing plans

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 7.4.1 | Current plan | Your plan display | "Plan actual: PRO" with features and upgrade button | 🟠 HIGH |
| 7.4.2 | Upgrade options | Available upgrades | Higher tier plans with feature comparisons and pricing | 🟠 HIGH |
| 7.4.3 | Upgrade confirmation | Payment for upgrade | Confirming plan change with prorated amount | 🟡 MEDIUM |
| 7.4.4 | Downgrade flow | Plan reduction | Warning about losing features/credits when downgrading | 🟡 MEDIUM |

---

## 8. SOLUCIÓN DE PROBLEMAS (Troubleshooting) - 5 files

### 8.1 preguntas-frecuentes.mdx
**Purpose:** Frequently asked questions

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 8.1.1 | FAQ interface | Help center layout | Categorized questions with expand/collapse | 🟡 MEDIUM |
| 8.1.2 | Search help | FAQ search | Search bar with "cómo conectar meta" typed and results | 🟢 LOW |
| 8.1.3 | Contact option | Support button | "¿No encuentras lo que buscas? Contactar soporte" link | 🟢 LOW |

### 8.2 errores-lanzamiento.mdx
**Purpose:** Campaign launch errors

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 8.2.1 | Error examples | Common launch errors | Screenshots of error messages with solutions | 🟠 HIGH |
| 8.2.2 | Meta rejection | Ad rejection notice | Meta notification showing why ad was rejected | 🟠 HIGH |
| 8.2.3 | Connection errors | API failures | Error messages when Meta API is unavailable | 🟡 MEDIUM |

### 8.3 errores-meta.mdx
**Purpose:** Meta Ads specific errors

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 8.3.1 | Permission errors | Insufficient permissions | Meta error "You don't have permission to..." | 🟠 HIGH |
| 8.3.2 | Account errors | Invalid account | "Ad account not found" or similar errors | 🟡 MEDIUM |
| 8.3.3 | Payment errors | Billing issues | "Payment method declined" in Meta | 🟡 MEDIUM |

### 8.4 errores-archivos.mdx
**Purpose:** File upload errors

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 8.4.1 | Size errors | File too large | "El archivo excede el tamaño máximo de 10MB" | 🟡 MEDIUM |
| 8.4.2 | Format errors | Unsupported format | "Formato no soportado" with accepted formats list | 🟡 MEDIUM |
| 8.4.3 | Corrupt files | Damaged files | "Error al cargar" when file is corrupted | 🟢 LOW |

### 8.5 contactar-soporte.mdx
**Purpose:** Contacting support

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 8.5.1 | Support form | Contact interface | Form fields: name, email, issue type, description, attachments | 🟡 MEDIUM |
| 8.5.2 | Chat widget | Live chat | Bottom-right chat bubble with conversation | 🟢 LOW |
| 8.5.3 | Support status | Response time | "Tiempo de respuesta: 2-4 horas" indicator | 🟢 LOW |

---

## 9. INFORMACIÓN GENERAL (General Information) - 1 file

### 9.1 glosario.mdx
**Purpose:** Terminology and definitions

| # | Location | Screenshot Description | UI State Required | Priority |
|---|----------|----------------------|-------------------|----------|
| 9.1.1 | Glossary interface | Terms list | Alphabetical list or searchable glossary | 🟢 LOW |
| 9.1.2 | Term detail | Expanded definition | Term with full explanation and related terms | 🟢 LOW |

---

## Summary Statistics

### By Priority
- 🔴 **CRITICAL:** 34 screenshots
- 🟠 **HIGH:** 45 screenshots  
- 🟡 **MEDIUM:** 40 screenshots
- 🟢 **LOW:** 20 screenshots
- **TOTAL:** ~139 screenshots (many are alternatives/states)

### By Section
1. **Primeros Pasos:** 12 screenshots
2. **Conectar Plataformas:** 18 screenshots
3. **Configurar Negocio:** 20 screenshots
4. **Estrategias:** 32 screenshots
5. **Generar Creativos:** 16 screenshots
6. **Lanzar Campaña:** 24 screenshots
7. **Planes y Créditos:** 15 screenshots
8. **Solución de Problemas:** 12 screenshots
9. **Información General:** 2 screenshots

### Critical First (Phase 1 - 34 screenshots)
**Focus: Core user flows and high-confusion areas**

1. **Login/Registration** (1.1.1, 1.1.2)
2. **Dashboard Overview** (1.4.1, 1.4.2)
3. **Meta Connection** (2.2.1, 2.2.2, 2.3.1-2.3.4)
4. **Brief Creation** (3.2.1-3.2.5)
5. **Strategy Configuration** (4.2.1, 4.2.4, 4.3.2-4.3.10)
6. **AI Generator** (5.1.1-5.1.7)
7. **Campaign Preview & Launch** (6.1.1-6.1.4, 6.3.1-6.3.6)

### High Priority (Phase 2 - 45 screenshots)
**Focus: Important features and detailed flows**

Remaining HIGH priority items from all sections

### Medium/Low (Phase 3)
**Focus: Error states, edge cases, and reference**

Alternative states, error messages, and nice-to-have screenshots

---

## Implementation Guidelines

### Screenshot Naming Convention
```
[section]-[file]-[sequence]-[description].png

Examples:
- 01-primeros-pasos-crear-cuenta-01-homepage-login.png
- 04-estrategias-configurar-05-budget-input.png
- 06-lanzar-campana-revision-final-03-launch-confirmation.png
```

### Image Specifications
- **Format:** PNG (for UI clarity) or JPG (for photos)
- **Resolution:** Minimum 1440px width (for retina displays)
- **Aspect Ratio:** Match actual UI (varies by screen)
- **File Size:** Optimize to < 200KB each
- **Annotations:** Use red circles/arrows to highlight key elements
- **Clean State:** Remove personal/sensitive data, use demo accounts

### Placement in MDX
```mdx
<Image 
  src="/images/screenshots/01-primeros-pasos-crear-cuenta-01-homepage-login.png"
  alt="SaleAds.ai homepage showing login options"
  caption="Figure 1.1: Homepage with 'Comenzar Gratis' and 'Iniciar sesión' buttons"
/>
```

### Alternative: Using GoogleDriveEmbed
For video tutorials, continue using the existing pattern:
```mdx
<GoogleDriveEmbed fileId="FILE_ID" title="Descriptive Title" />
```

---

## Next Steps

1. **Screenshot Collection:** Use this mapping to guide screenshot capture sessions
2. **Asset Organization:** Create `/public/images/screenshots/` directory structure
3. **Implementation:** Insert screenshots into MDX files according to line numbers specified
4. **Testing:** Verify all screenshots load correctly and enhance understanding
5. **Maintenance:** Update screenshots when UI changes significantly

---

## Notes

- All line numbers are approximate and based on current document structure
- Some sections may need multiple states (before/after, error/success)
- Consider adding interactive elements (clickable hotspots) for complex UIs
- Ensure accessibility with proper alt text and captions
- Regular review needed quarterly to keep screenshots current with UI updates