# Revision OWASP Mobile Top 10 - Task Manager

**Fecha:** 2026-08-19
**Rama:** `nueva-rama`
**Proyecto:** `my-app-testing-lab`
**Alcance:** revision estatica del codigo en `app`, `src`, `__tests__`, `app.json` y `package.json`.

## Puntos evaluados

| Punto OWASP evaluado | Evidencia revisada | Cumple | Resultado | Correccion propuesta |
| --- | --- | --- | --- | --- |
| M9 - Insecure Data Storage / almacenamiento inseguro | No se encontraron usos de `AsyncStorage`, `SecureStore`, `localStorage`, `MMKV`, `SQLite`, `FileSystem`, `Keychain`, `NSUserDefaults` ni `SharedPreferences` en el codigo de la app. El estado de tareas se mantiene en memoria (`fallbackTasks`) dentro de `src/services/taskService.ts`. | Si, para el alcance actual | No hay almacenamiento persistente de datos sensibles. | Si en el futuro se guardan tokens, sesiones o datos personales, usar `expo-secure-store` en lugar de storage plano. En Android, SecureStore usa SharedPreferences cifrado con Android Keystore; en iOS usa Keychain. Evitar guardar secretos en AsyncStorage o archivos locales sin cifrado. |
| M5 - Insecure Communication / comunicaciones sin cifrar | `src/services/taskService.ts` define `API_URL = 'https://api.taskmanager.com'` y las pruebas MSW usan la misma URL HTTPS. No se detectaron endpoints `http://` en `app` o `src`. | Si, parcialmente | La app no usa HTTP claro para la API de tareas. | Mantener solo HTTPS en produccion, mover la URL a configuracion por ambiente y validar al iniciar que empiece con `https://`. Para una app productiva, considerar certificate pinning o controles equivalentes si la API maneja datos sensibles. |
| Exposicion de datos en logs, relacionado con M6 - Inadequate Privacy Controls | No se encontraron `console.log`, `console.warn`, `console.error` ni `console.debug` en `app` o `src`. Los logs detectados pertenecen a scripts de desarrollo, no al runtime movil. | Si | No se observan logs de titulos de tareas, respuestas de API, tokens ni datos de usuario. | Mantener una politica de logging: no registrar payloads completos, tokens, headers `Authorization` ni datos personales. Si se agrega monitoreo, sanitizar eventos antes de enviarlos. |
| M4 - Insufficient Input/Output Validation / validacion insuficiente | Existe `src/schemas/taskSchema.ts` con `TaskSchema` y `TaskListSchema`, pero `src/services/taskService.ts` solo valida que `fetchTasks` reciba un arreglo con `Array.isArray(tasks)`. `createTask` acepta directamente `createdTask` desde `res.json()`. | No | Vulnerabilidad detectada: respuestas no confiables de API pueden llegar al estado de la UI sin validacion de contrato en runtime. | Aplicar `TaskListSchema.safeParse` en `fetchTasks` y `TaskSchema.safeParse` en `createTask` antes de actualizar `fallbackTasks` o devolver datos a la pantalla. Ante datos invalidos, rechazar la respuesta y mostrar error controlado. |

## Evidencia de busqueda

Busqueda acotada a `app`, `src`, `__tests__`, `app.json`, `package.json`, `jest.config.js` y `jest.setup.js` con patrones de logs, almacenamiento, secretos y red.

Coincidencias relevantes:

```text
app/(tabs)/explore.tsx: enlaces externos HTTPS de documentacion.
src/mocks/handlers.ts: const API_URL = 'https://api.taskmanager.com';
src/services/taskService.ts: const API_URL = 'https://api.taskmanager.com';
src/services/taskService.ts: fetch(`${API_URL}/tasks`);
__tests__/integration/CreateTaskScreen.integration.test.tsx: mocks HTTPS para /tasks.
```

No se encontraron coincidencias en el codigo runtime para:

```text
console.log / console.warn / console.error / console.debug
AsyncStorage / SecureStore / localStorage / MMKV / SQLite / FileSystem
Authorization / Bearer / token / secret / apiKey / password
http://
```

## Conclusiones

La aplicacion cumple con los puntos revisados de almacenamiento inseguro, comunicaciones sin cifrar y exposicion de datos en logs dentro del alcance actual. La principal vulnerabilidad detectada esta en la validacion insuficiente de respuestas de API: aunque hay esquemas Zod y pruebas de contrato, esos esquemas no se aplican en el servicio real antes de usar los datos recibidos.

## Siguiente correccion recomendada

Actualizar `src/services/taskService.ts` para parsear las respuestas con `TaskListSchema` y `TaskSchema`. Esto cerraria el hallazgo M4 y reutilizaria la infraestructura de validacion ya existente en el proyecto.