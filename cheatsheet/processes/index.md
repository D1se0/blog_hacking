# Gestión de Procesos

## Control de la ejecución de programas y recursos del sistema.

### Monitorización

```bash
top
```

Monitor interactivo de procesos en tiempo real, muestra consumo de CPU y RAM.

```bash
htop
```

Versión mejorada y visual de `top`, permite buscar y matar procesos fácilmente (requiere instalación).

```bash
ps aux
```

Muestra una instantánea de todos los procesos del sistema con detalles de usuario, CPU y memoria.

```bash
pstree
```

Muestra la jerarquía de procesos en forma de árbol para ver qué proceso generó a cuál.

```bash
pgrep <nombre>
```

Busca y devuelve el PID de los procesos que coinciden con el nombre dado.

### Control de Procesos

```bash
kill [señal] <PID>
```

Envía una señal a un proceso mediante su identificador (PID).

Señales comunes:

`15` (SIGTERM): Terminar el proceso de forma amable (por defecto).

`9` (SIGKILL): Forzar el cierre inmediato y agresivo.

`1` (SIGHUP): Recargar la configuración del proceso.

```bash
killall <nombre>
```

Mata todos los procesos que tengan el nombre indicado.

```bash
pkill <patrón>
```

Mata procesos basados en una coincidencia de nombre o patrón.

Prioridad (Nice / Renice)

Rango de `-20` (máxima prioridad) a `19` (mínima prioridad).

```bash
nice -n 10 <comando>
```

Lanza un nuevo comando con una prioridad específica (ej. 10 es baja prioridad).

```bash
renice -n 5 -p <PID>
```

Cambia la prioridad de un proceso que ya se está ejecutando.

### Trabajos en Segundo Plano (Jobs)

```bash
<comando> &
```

Ejecuta el comando en segundo plano directamente, liberando la terminal.

```bash
Ctrl + Z
```

Suspende y detiene momentáneamente un proceso que está en primer plano.

```bash
jobs
```

Lista los trabajos actuales gestionados por la terminal actual.

```bash
bg %n
```

Reanuda el trabajo suspendido número "n" en segundo plano.

```bash
fg %n
```

Trae el trabajo número "n" al primer plano (foreground).

```bash
disown %n
```

Desvincula el proceso de la terminal para que no se cierre si cerramos la sesión.
