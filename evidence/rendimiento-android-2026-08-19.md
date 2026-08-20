# Evidencia de Rendimiento Android

**Fecha:** 2026-08-19
**Rama:** `nueva-rama`
**Proyecto:** `my-app-testing-lab`
**Dispositivo:** motorola edge 60, Android 16 (`ZY22LVCT2F`)
**Runtime:** Expo Go (`host.exp.exponent`)

## Arranque en frio

Comando:

```powershell
& $adb -s ZY22LVCT2F shell am force-stop host.exp.exponent
& $adb -s ZY22LVCT2F shell am start -W -n host.exp.exponent/.experience.HomeActivity
```

Resultados:

```text
LaunchState: COLD
TotalTime: 794 ms
WaitTime: 801 ms

LaunchState: COLD
TotalTime: 829 ms
WaitTime: 831 ms

LaunchState: COLD
TotalTime: 784 ms
WaitTime: 786 ms
```

Promedio aproximado de `TotalTime`: **802 ms**.

## Memoria

Comando:

```powershell
& $adb -s ZY22LVCT2F shell dumpsys meminfo host.exp.exponent
```

Resumen:

```text
Java Heap:      25,996 KB
Native Heap:    39,064 KB
Graphics:       46,099 KB
Private Other:  23,460 KB
System:         10,150 KB
TOTAL PSS:     198,757 KB
TOTAL RSS:     350,015 KB
```

## Frames durante interaccion

Comandos:

```powershell
& $adb -s ZY22LVCT2F shell dumpsys gfxinfo host.exp.exponent reset
& $adb -s ZY22LVCT2F shell input tap 610 1280
& $adb -s ZY22LVCT2F shell input swipe 610 2100 610 700 500
& $adb -s ZY22LVCT2F shell input swipe 610 700 610 2100 500
& $adb -s ZY22LVCT2F shell dumpsys gfxinfo host.exp.exponent
```

Resumen:

```text
Total frames rendered: 15
Janky frames: 1 (6.67%)
90th percentile: 40ms
95th percentile: 40ms
99th percentile: 40ms
Number Missed Vsync: 1
Number Slow UI thread: 1
```

## Area de mejora identificada

`CreateTaskScreen` renderiza las tareas con `tasks.map(...)` dentro de un `View`. Para listas grandes, conviene usar el componente existente `TaskList` basado en `FlatList` para virtualizar filas y reducir trabajo de renderizado.

## Validacion del proyecto

```text
npm test -- --runInBand
Test Suites: 14 passed, 14 total
Tests:       55 passed, 55 total
```

```text
npm run lint
0 errors, 1 warning
app/(tabs)/explore.tsx: jsx-a11y/alt-text
```