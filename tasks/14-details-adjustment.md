# 14 - Ajustes de detalles

## Orden de ejecución

### Tarea 2 — Agregar email en footer
- Agrega correo con dominio en footer → hola@saulpuentes.com
- **Archivos**: `components/footer.tsx`
- Agregar `<a href="mailto:hola@saulpuentes.com">` usando `siteConfig.email`

---

### Tarea 1 — Fix overlap de títulos en mobile
- Los títulos de las secciones Servicios y Proyectos se sobreponen en mobile
- **Archivos**: `components/services-section.tsx`
- La sección usa `height: 300vh` + `sticky` para animación de scroll, lo cual causa overlap en mobile
- En mobile: deshabilitar sticky, mostrar todos los servicios, usar `height: auto`
- Usar media query o state para alternar comportamiento desktop/mobile

---

### Tarea 3 — Rediseñar vista de detalles de proyecto
- **Archivos**: `components/projects/project-detail-modal.tsx`, `content/i18n/en.json`, `content/i18n/es.json`, `content/i18n/de.json`, `lib/i18n/types.ts`
- Subtareas:
  - Agregar un título al stack de tecnología (nueva key i18n `techStack`)
  - Cambiar título de "Enlaces del proyecto" a "Enlaces" en los 3 JSON i18n
  - Mover la descripción debajo de la foto
  - Reorganizar el contenido del modal:
    1. Carrusel de imágenes
    2. Descripción
    3. Stack tecnológico (con título nuevo)
    4. Enlaces (con título acortado)
    5. Secciones de detalle (problema, arquitectura, decisiones, retos, resultados, lecciones)

---

### Tarea 4 — Cards del carrusel clickeables
- Hacer que las cards del scroll carousel sean clickeables para abrir el modal
- **Archivos**: `components/scroll-carousel.tsx`, `components/projects/index.tsx`, `styles/scroll-carousel.css`
- Agregar prop `onCardClick` al componente `ScrollCarousel`
- En CSS: agregar `pointer-events: auto` al `.card` dentro de `.no-interaction`
- En `projects/index.tsx`: pasar callback que abre el modal al hacer click en la card

---

### Tarea 5 — Color picker centralizado
- Centralizar el highlight color y crear un color picker en el header navigation
- **Archivos nuevos**: `lib/accent-color.tsx`, `components/accent-color-picker.tsx`
- **Archivos a modificar**: `components/header.tsx`, `app/page.tsx`, `app/globals.css`
- Crear contexto React con los 6 colores predefinidos:
  - Indigo: #4F46E5
  - Indigo 2: #6366F1
  - Emerald / Teal: #0D9488
  - Verde neón: #22C55E
  - Cian: #06B6D4
  - Electric Blue: #3B82F6
- Persistir selección en localStorage
- Aplicar color via `document.documentElement.style.setProperty("--accent", ...)`
- Colocar picker junto al ThemeToggle en el header (desktop y mobile)
