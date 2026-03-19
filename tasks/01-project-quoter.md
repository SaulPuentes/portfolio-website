# Task 01 — Cotizador de Proyectos Web/App

## Status: Pending

## Context

El portfolio necesita una herramienta de cotización que permita a potenciales clientes estimar el costo de un proyecto web o aplicación. El cotizador será una página independiente (`/cotizador`) accesible desde la navegación principal. Debe ser amigable para personas no técnicas, con preguntas claras y opciones como "No sé" que se consideren en el cálculo final. Al terminar, muestra un rango de precio estimado con un disclaimer de que es aproximado.

Las preguntas y sus opciones se definen en un archivo markdown editable (`content/data/quoter-questions.md`) para facilitar la personalización sin tocar código. La lógica de precios se maneja en un archivo de configuración JSON separado.

---

## Plan

### Step 1 — Crear el archivo de preguntas editable

Crear `content/data/quoter-questions.md` con todas las preguntas del formulario, organizadas por secciones/flujos. Este archivo sirve como referencia editable (no se parsea directamente — la fuente de verdad para el componente es el JSON del Step 2).

### Step 2 — Crear la configuración de precios y preguntas

Crear `content/data/quoter-config.json` con la estructura de preguntas, opciones, y valores de precio asociados. Estructura:

```json
{
  "disclaimer": "Este cotizador ofrece un estimado aproximado...",
  "currency": "MXN",
  "sections": [
    {
      "id": "project-type",
      "title": "Tipo de proyecto",
      "questions": [
        {
          "id": "type",
          "question": "¿Qué tipo de proyecto necesitas?",
          "type": "single",
          "options": [
            { "label": "Página web informativa", "value": "landing", "price": 8000 },
            { "label": "Tienda en línea", "value": "ecommerce", "price": 25000 },
            { "label": "Aplicación web", "value": "webapp", "price": 30000 },
            { "label": "Aplicación móvil", "value": "mobile", "price": 40000 },
            { "label": "No estoy seguro", "value": "unsure", "price": 15000 }
          ]
        }
      ]
    }
  ]
}
```

Cada opción "No sé" / "No estoy seguro" tiene un precio intermedio.

### Step 3 — Crear la página `/cotizador`

Crear `app/cotizador/page.tsx` con:
- Formulario multi-paso (wizard) usando estado local
- Barra de progreso
- Navegación anterior/siguiente
- Resumen final con rango de precio estimado (±20%)
- Disclaimer visible
- Botón de contacto al final

### Step 4 — Crear componentes del cotizador

- `components/quoter/quoter-form.tsx` — Componente principal del wizard
- `components/quoter/quoter-step.tsx` — Renderiza una pregunta individual
- `components/quoter/quoter-result.tsx` — Muestra el resultado con precio estimado
- `components/quoter/quoter-progress.tsx` — Barra de progreso

### Step 5 — Crear hook de lógica

Crear `hooks/use-quoter.ts` con:
- Estado del paso actual
- Respuestas seleccionadas
- Cálculo del precio basado en respuestas
- Navegación entre pasos

### Step 6 — Agregar enlace en la navegación

Agregar un enlace/botón a `/cotizador` en el componente de navegación principal o en el hero section.

### Step 7 — Verify

1. Run `npm run build`
2. Test en `http://localhost:3000/cotizador`:
   - Completar el flujo completo seleccionando opciones normales
   - Completar el flujo seleccionando "No sé" en todas las preguntas
   - Verificar que el precio se calcula correctamente
   - Verificar que el disclaimer es visible
   - Probar navegación anterior/siguiente
   - Verificar responsive en mobile
3. Verificar que el enlace desde la navegación principal funciona

---

## Files Involved

### Added
- `content/data/quoter-questions.md` — Documento editable con las preguntas
- `content/data/quoter-config.json` — Configuración de preguntas y precios
- `app/cotizador/page.tsx` — Página del cotizador
- `components/quoter/quoter-form.tsx` — Formulario wizard
- `components/quoter/quoter-step.tsx` — Paso individual
- `components/quoter/quoter-result.tsx` — Resultado con precio
- `components/quoter/quoter-progress.tsx` — Barra de progreso
- `hooks/use-quoter.ts` — Lógica del cotizador

### Modified
- Componente de navegación — agregar enlace a `/cotizador`

---

## Acceptance Criteria

- [ ] La página `/cotizador` carga correctamente
- [ ] El formulario tiene múltiples pasos con preguntas claras y no técnicas
- [ ] Todas las preguntas incluyen una opción "No sé" o "No estoy seguro"
- [ ] Las opciones "No sé" se reflejan en el precio final (valor intermedio)
- [ ] Al finalizar se muestra un rango de precio estimado
- [ ] Se muestra un disclaimer indicando que el costo es aproximado
- [ ] Existe un archivo `quoter-questions.md` editable con la lista de preguntas
- [ ] El formulario es responsive y funciona en mobile
- [ ] Se puede navegar entre pasos (anterior/siguiente)
- [ ] Hay un enlace accesible desde la navegación principal
- [ ] `npm run build` pasa sin errores
