# Task 10 — Rediseño del modal de detalles de proyectos

## Status: Done

## Context

El modal actual (`ProjectDetailModal` en `components/projects-section.tsx`) usa `DialogContent` con scroll interno y un `DialogHeader` estándar que se desplaza con el contenido. Tiene dos problemas:

1. **Header no fijo** — al hacer scroll dentro del modal, el título y el botón de cerrar desaparecen.
2. **Sin carrusel de imágenes** — solo muestra `project.image` (una sola imagen). El tipo `Project` ya tiene un campo `gallery?: string[]` pero no se usa en el modal.

El objetivo es:
- Header fijo (sticky) con título a la izquierda y botón de cerrar a la derecha.
- Modal más ancho (`sm:max-w-3xl` o `sm:max-w-4xl`) para aprovechar mejor el espacio.
- Si el proyecto tiene más de una imagen (`gallery`), mostrar un carrusel con flechas prev/next que aparezcan centradas verticalmente sobre la imagen al hacer hover.
- El contenido de los proyectos en `docs/portfolio.md` es la **fuente de verdad** y debe traducirse a los idiomas soportados.

---

## Plan

### Step 1 — Ampliar ancho del modal

En `components/projects-section.tsx`, cambiar `sm:max-w-2xl` a `sm:max-w-3xl` (o `sm:max-w-4xl`) en `DialogContent`.

### Step 2 — Header fijo con close button

En `components/projects-section.tsx`, reestructurar `DialogContent` para que:

- El header sea `sticky top-0 z-10 bg-background` con `flex justify-between items-center`.
- Título (`DialogTitle`) a la izquierda.
- Botón de cerrar (`X` de lucide-react) a la derecha, llamando a `onClose`.
- El contenido debajo sea scrollable (`overflow-y-auto`).
- Remover el close button por defecto de `DialogContent` (shadcn/ui lo agrega con `DialogClose`); verificar en `components/ui/dialog.tsx` si hay que quitarlo o usar `hideCloseButton` prop.

### Step 3 — Carrusel de imágenes en el modal

Construir un carrusel inline dentro del modal:

- Reunir las imágenes: si `project.gallery` existe y tiene más de 1 imagen, usar `gallery`; de lo contrario usar `[project.image]` (comportamiento actual, sin flechas).
- Estado local `currentIndex` para trackear la imagen visible.
- Renderizar las imágenes en un contenedor `relative aspect-video` con `overflow-hidden`.
- Flechas (`ChevronLeft`, `ChevronRight` de lucide-react) posicionadas `absolute top-1/2 -translate-y-1/2` en left/right.
- Las flechas solo se muestran en hover sobre el contenedor de imagen (`group` + `opacity-0 group-hover:opacity-100 transition-opacity`).
- No mostrar flechas si hay solo 1 imagen.
- Opcionalmente, agregar indicadores de dots debajo de la imagen.

### Step 4 — Agregar imágenes de galería a los datos

Las imágenes de los proyectos se encuentran en `public/projects/`. A continuación la asociación entre cada proyecto de `docs/portfolio.md` y sus assets:

| # | Proyecto (portfolio.md) | Carpeta / archivo en `public/projects/` |
|---|---|---|
| 1 | Sitios Corporativos (WordPress) — Evalor, Grupo DAGS, Monteleva | `corporativos/` |
| 2 | Pagos Digitales — Grupo Xcaret | `grupo-xcaret/` |
| 3 | Plataforma Web — Galerías | `galerias/` |
| 4 | E-commerce Shopify — Simonett & Twelve Thirty Four | `ecommerce/` |

**Nomenclatura de screenshots:** en cada subcarpeta usar nombres cortos `screenshot-1.png`, `screenshot-2.png`, etc. (actualmente: `corporativos/screenshot-1.png`–`screenshot-4.png`, `galerias/screenshot-1.png`, `ecommerce/screenshot-1.png`–`screenshot-4.png` además de `simonett.png`, `grupo-xcaret/logo.jpg`).

**Acción:** En `content/data/projects.json`, actualizar `image` y `gallery` de cada proyecto usando rutas locales (`/projects/<subcarpeta>/<archivo>`). Agregar más screenshots a cada subcarpeta conforme estén disponibles.

### Step 5 — Actualizar contenido de proyectos desde `docs/portfolio.md`

`docs/portfolio.md` es la fuente de verdad para el contenido de los proyectos. Actualizar los datos en `lib/data.ts` / `content/data/` y las traducciones en `content/i18n/` para que reflejen fielmente la información de ese documento:

- Revisar cada proyecto en `docs/portfolio.md` y asegurar que `name`, `description`, `detail` (problem, architecture, decisions, challenges, results) estén alineados.
- Traducir el contenido al inglés (y otros idiomas soportados) para las claves `Record<Locale, string>`.
- Si hay proyectos en `docs/portfolio.md` que no existen en los datos, agregarlos.

### Step 6 — Verificar

1. Run `npm run build`
2. Probar en `http://localhost:3000`:
   - Abrir modal de un proyecto con galería → verificar carrusel con flechas en hover.
   - Abrir modal de un proyecto con una sola imagen → sin flechas, comportamiento normal.
   - Hacer scroll en el modal → el header con título y close button permanece fijo.
   - Botón de cerrar funciona correctamente.
3. Verificar responsive en móvil (flechas visibles por defecto en touch).

---

## Files Involved

### Modified
- `components/projects-section.tsx` — reestructurar `ProjectDetailModal`: header sticky, carrusel de imágenes
- `components/ui/dialog.tsx` — posiblemente ocultar el close button por defecto si interfiere con el custom close button

### Added
- Ninguno (todo se modifica inline)

### Data
- `lib/data.ts` o `content/data/projects.json` — agregar `gallery` a proyectos de ejemplo

---

## Acceptance Criteria

- [ ] Header del modal es sticky con título a la izquierda y close button a la derecha
- [ ] El close button cierra el modal correctamente
- [ ] Proyectos con `gallery` (>1 imagen) muestran carrusel con flechas prev/next
- [ ] Flechas aparecen centradas verticalmente sobre la imagen solo en hover
- [ ] Proyectos con 1 sola imagen no muestran flechas
- [ ] Modal es más ancho que antes (`sm:max-w-3xl` o superior)
- [ ] Contenido de proyectos refleja `docs/portfolio.md` como fuente de verdad
- [ ] Traducciones completas para todos los idiomas soportados
- [ ] `npm run build` pasa sin errores
