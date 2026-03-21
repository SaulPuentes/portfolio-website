# Task 11 — Modal Links Más Visibles y Card Image Speed

## Status: Pending

## Context

En la vista detallada del proyecto (`ProjectDetailModal` en `components/projects/project-detail-modal.tsx`), los links a sitios live y repo aparecen como botones `outline` pequeños (`size="sm"`) al final del contenido, con poco contraste visual. Necesitan ser más prominentes para que el usuario los encuentre fácilmente.

Además, en el `ImageCarousel` (`components/projects/image-carousel.tsx`), las imágenes de la galería en cada card cambian cada 1500ms, lo cual es demasiado rápido. Se necesita un intervalo más lento para que el usuario pueda apreciar cada imagen.

---

## Plan

### Step 1 — Hacer los links más visibles en el modal

**Archivo:** `components/projects/project-detail-modal.tsx`

Cambios en la sección de links (líneas ~170–196):

1. Cambiar los botones de live URL de `variant="outline" size="sm"` a `variant="default"` (botón primario, tamaño normal) para mayor prominencia.
2. Mantener el botón de repo como `variant="outline"` pero aumentar a tamaño normal.
3. Mover la sección de links más arriba o darle más padding/margen para que destaque.
4. Considerar añadir un fondo sutil o más espacio visual para separar los links del contenido.

### Step 2 — Reducir velocidad de cambio de imágenes en el card

**Archivo:** `components/projects/image-carousel.tsx`

Cambiar el intervalo de `1500` a `3000` (3 segundos) para dar más tiempo al usuario de ver cada imagen.

```typescript
// Antes
}, 1500)

// Después
}, 3000)
```

### Step 3 — Verify

1. Run `npm run build`
2. Test en `http://localhost:3000`:
   - Abrir modal de un proyecto con links live → verificar que los botones son prominentes
   - Observar el carousel de proyectos → confirmar que las imágenes cambian cada ~3s
3. Probar en mobile y desktop

---

## Files Involved

### Modified
- `components/projects/project-detail-modal.tsx` — estilos de los botones de links en `ProjectDetailModal`
- `components/projects/image-carousel.tsx` — intervalo de cambio de imágenes en el carousel

---

## Acceptance Criteria

- [ ] Los links de sitios live en el modal son visualmente prominentes (botón primario o con mayor contraste)
- [ ] El botón de repo mantiene diferenciación visual respecto a los links live
- [ ] Las imágenes en los cards del carousel cambian cada 3 segundos en lugar de 1.5
- [ ] Build pasa sin errores
