# Informe Resumido de Testing

**Fecha:** 2026-08-04  
**Proyecto:** my-app-testing-lab  
**Repositorio:** enlace compartido en la entrega (privado)

## 1. Integración (MSW)

Se validó la pantalla completa de creación de tareas con interacción real entre UI, hooks y estado.

**Archivo principal:** `__tests__/integration/CreateTaskScreen.integration.test.tsx`

**Escenarios ejecutados (3/3):**
1. Éxito de creación (HTTP 201).
2. Error de API (HTTP 500).
3. Datos vacíos (`[]`).

**Resultado:** 3 pruebas aprobadas. Evidencia en `evidence/ejecucion-*/01-integracion.txt`.

## 2. Accesibilidad

Se ejecutó análisis con `eslint-plugin-jsx-a11y` y pruebas con `jest-native`.

**Configuración lint:** `eslint.config.js`

**Hallazgos corregidos en componentes objetivo:**
1. Falta de `accessibilityLabel` en campo de texto.
2. Botones sin `accessibilityRole` o etiqueta descriptiva.

**Pruebas jest-native:**
- `__tests__/accessibility/a11y.test.tsx`
- `__tests__/accessibility/TaskCard.a11y.test.tsx`

**Resultado:** 7 pruebas aprobadas. Evidencia en `evidence/ejecucion-*/02-accesibilidad-tests.txt`.

**Estado lint actual:** 0 errores, 1 warning (`jsx-a11y/alt-text` en `app/(tabs)/explore.tsx`). Evidencia en `evidence/ejecucion-*/03-lint.txt`.

## 3. E2E con Maestro

Se automatizó flujo E2E completo en dispositivo Android real.

**Flujo principal:** `.maestro/create-task-via-url-flow.yaml`

**Evidencia de ejecución:**
- `evidence/maestro-evidencia-correcta-2026-08-04_221822/report.html`
- Capturas en `takeScreenshot/`
- Trazabilidad en `commands.json` y `manifest.json`

## 4. Mejoras de Accesibilidad Aplicadas

1. Se agregó `accessibilityHint` en el campo de título.
2. Se agregaron etiquetas y roles descriptivos en botones clave.

## 5. Cumplimiento

Se cumple la rúbrica solicitada: integración con MSW (3 escenarios), automatización E2E con YAML y evidencia, verificaciones de accesibilidad con lint y jest-native, y al menos 2 mejoras concretas.
