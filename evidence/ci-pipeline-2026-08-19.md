# Evidencia de Configuracion CI

**Fecha:** 2026-08-19
**Rama:** `nueva-rama`
**Workflow:** `.github/workflows/tests.yml`

## Pipeline configurado

El workflow se ejecuta automaticamente en:

- `push` a cualquier rama.
- `pull_request` hacia cualquier rama.

Pasos configurados:

1. Checkout del repositorio.
2. Setup de Node.js `20.19.x`, version compatible con Expo SDK 54.
3. Instalacion reproducible con `npm ci`.
4. Ejecucion de lint con `npm run lint`.
5. Ejecucion de suite completa con cobertura usando `npm run test:ci`.
6. Publicacion del directorio `coverage/` como artifact `coverage-report`.

## Cobertura y umbral

El comando de CI ejecuta:

```powershell
npm run test:ci
```

que equivale a:

```powershell
jest --coverage --runInBand
```

El umbral minimo esta configurado en `jest.config.js`:

```js
coverageThreshold: {
  global: { branches: 70, functions: 70, lines: 70, statements: 70 },
}
```

Si alguna metrica global baja de 70%, Jest termina con error y el workflow falla.

## Validacion local equivalente

Resultado de `npm run test:ci`:

```text
Test Suites: 14 passed, 14 total
Tests:       58 passed, 58 total
Snapshots:   0 total

All files:
Statements: 92.92%
Branches:   83.33%
Functions:  94.44%
Lines:      92.07%
```

Resultado de `npm run lint`:

```text
0 errors, 1 warning
app/(tabs)/explore.tsx: jsx-a11y/alt-text
```

## Evidencia pendiente de GitHub Actions

Para completar la evidencia visual solicitada, despues de subir estos cambios a GitHub se debe adjuntar una captura de pantalla de la pestaña **Actions** mostrando el workflow **Tests** en verde.

En este entorno no se pudo obtener la captura remota porque el workflow nuevo aun no esta subido/ejecutado en GitHub y la CLI `gh` no esta disponible.