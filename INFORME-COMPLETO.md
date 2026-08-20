# Informe Resumido de Testing

**Fecha:** 2026-08-04
**Proyecto:** my-app-testing-lab
**Repositorio:** enlace compartido en archivo de entrega

## 1. Integración (MSW)

Se validó la pantalla completa de creación de tareas con interacción real entre UI, hooks y estado.

**Archivo principal:** `__tests__/integration/CreateTaskScreen.integration.test.tsx`

**Escenarios ejecutados (3/3):**
1. Éxito de creación (HTTP 201).
2. Error de API (HTTP 500).
3. Datos vacíos (`[]`).

**Resultado:** 3 pruebas aprobadas. Evidencia en `evidence/ejecucion-*/01-integracion.txt`.

**Pruebas de contrato nuevas:** se agregaron esquemas Zod para `POST /tasks` (`CreateTaskRequestSchema` y `CreateTaskResponseSchema`) y 3 pruebas nuevas que validan solicitud/respuesta correcta, respuesta inválida y solicitud inválida. La suite `__tests__/contract/taskApi.contract.test.ts` queda con 7 pruebas aprobadas.

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

## 6. Análisis de Rendimiento en Android

**Fecha:** 2026-08-19
**Rama validada:** `nueva-rama`
**Proyecto validado:** `my-app-testing-lab`
**Dispositivo:** motorola edge 60, Android 16 (`ZY22LVCT2F`)
**Ejecución:** Expo Go (`host.exp.exponent`) cargando el flujo Task Manager del proyecto. Se usó dispositivo Android físico porque el build nativo con Gradle quedó bloqueado por resolución de dependencias externas (`plugins.gradle.org`) y el emulador tenía una versión de Expo Go incompatible con SDK 54.

### Herramientas utilizadas

- `adb shell am start -W`: medición de arranque en frío.
- `adb shell dumpsys meminfo`: memoria del proceso.
- `adb shell dumpsys gfxinfo`: frames renderizados y jank durante interacción en la pantalla de tareas.

### Resultados obtenidos

| Métrica | Resultado |
| --- | --- |
| Tiempo de arranque en frío | 794 ms, 829 ms, 784 ms; promedio aproximado: 802 ms |
| Memoria total PSS | 198,757 KB, aproximadamente 194 MB |
| Memoria total RSS | 350,015 KB, aproximadamente 342 MB |
| Memoria Graphics | 46,099 KB, aproximadamente 45 MB |
| Frames durante interacción | 15 frames renderizados |
| Janky frames | 1 frame, 6.67% |
| Percentil 90 de frame time | 40 ms |
| VSync perdido | 1 |

### Interpretación

El arranque en frío observado fue estable, con variación baja entre tres ejecuciones. La memoria medida incluye Expo Go, por lo que debe interpretarse como una medición de desarrollo y no como el consumo exacto de un APK standalone. Aun así, sirve como línea base reproducible para comparar cambios futuros en esta rama.

En la interacción medida se observó 1 frame con jank y un percentil 90 de 40 ms. Para una pantalla simple no es crítico, pero sí indica margen de mejora si la lista de tareas crece o si se agregan más componentes visuales.

### Cuello de botella o área de mejora

La pantalla `CreateTaskScreen` renderiza las tareas con `tasks.map(...)` dentro de un `View`. Aunque existe el componente `TaskList` con `FlatList`, el flujo actual de creación no lo usa. Esto puede convertirse en un cuello de botella cuando haya muchas tareas, porque React Native montará todos los elementos de la lista a la vez en lugar de virtualizarlos.

**Mejora recomendada:** reemplazar el renderizado directo con `TaskList`/`FlatList` en `CreateTaskScreen` para aprovechar virtualización, `keyExtractor` y renderizado incremental. Después de ese cambio, repetir `dumpsys gfxinfo` con una lista de tareas más grande para comparar jank y percentiles de frame time.

### Comandos principales ejecutados

```powershell
$adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
& $adb -s ZY22LVCT2F shell am force-stop host.exp.exponent
& $adb -s ZY22LVCT2F shell am start -W -n host.exp.exponent/.experience.HomeActivity
& $adb -s ZY22LVCT2F shell dumpsys meminfo host.exp.exponent
& $adb -s ZY22LVCT2F shell dumpsys gfxinfo host.exp.exponent reset
& $adb -s ZY22LVCT2F shell dumpsys gfxinfo host.exp.exponent
```

### Validación posterior

- `npm test -- --runInBand`: 14 suites aprobadas, 55 pruebas aprobadas. Se observaron warnings de `act(...)` en pruebas de integración, sin fallos.
- `npm run lint`: 0 errores, 1 warning existente de accesibilidad (`jsx-a11y/alt-text`) en `app/(tabs)/explore.tsx`.

## 7. Revisión OWASP Mobile Top 10

Se revisó la aplicación Task Manager contra 4 puntos de OWASP Mobile Top 10 y se dejó evidencia en `evidence/owasp-mobile-2026-08-19.md`.

| Punto evaluado | Cumple | Resultado |
| --- | --- | --- |
| M9 - Insecure Data Storage | Sí | No se detectó almacenamiento persistente de datos sensibles. Si se agregan tokens o sesiones, deben guardarse con `expo-secure-store`. |
| M5 - Insecure Communication | Sí, parcialmente | La API usa HTTPS (`https://api.taskmanager.com`) y no se detectaron endpoints `http://`. Para producción, se recomienda validar URLs HTTPS por ambiente y considerar certificate pinning si hay datos sensibles. |
| Exposición de datos en logs | Sí | No se encontraron `console.log`, `console.warn`, `console.error` ni `console.debug` en el runtime de `app` o `src`. Se recomienda mantener sanitización si se agrega monitoreo. |
| M4 - Insufficient Input/Output Validation | No | Vulnerabilidad detectada: existen esquemas Zod, pero `taskService` no valida en runtime todas las respuestas de API antes de usarlas. Corrección: aplicar `TaskListSchema.safeParse` y `TaskSchema.safeParse` en `fetchTasks` y `createTask`. |

## 8. Pipeline de Integración Continua

Se creó el workflow `.github/workflows/tests.yml` para ejecutar automáticamente lint, pruebas unitarias, de componentes, contrato e integración en cada `push` y `pull_request`.

**Configuración aplicada:**

- Node.js `20.19.x`, compatible con Expo SDK 54.
- Instalación con `npm ci`.
- Lint con `npm run lint`.
- Suite completa con `npm run test:ci`.
- Cobertura con `jest --coverage --runInBand --silent --json --outputFile=jest-results.json`.
- Verificación del umbral global del 70% configurada directamente en `jest.config.js`.
- Artifact de cobertura `coverage-report` generado desde el directorio `coverage/`.
- Umbral global del 70% en `jest.config.js` para branches, functions, lines y statements.

**Validación local equivalente:**

- `npm run test:ci`: 14 suites aprobadas, 58 pruebas aprobadas.
- Cobertura global: statements 92.92%, branches 83.33%, functions 94.44%, lines 92.07%.
- `npm run lint`: 0 errores, 1 warning existente (`jsx-a11y/alt-text`).

La evidencia de configuración quedó en `evidence/ci-pipeline-2026-08-19.md`. La captura de GitHub Actions debe tomarse después de subir estos cambios y confirmar el workflow **Tests** en verde, porque el workflow nuevo todavía no existe ejecutado en GitHub desde este entorno local.
