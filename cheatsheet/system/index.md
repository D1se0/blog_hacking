# Información del Sistema y Utilidades Básicas

## Comandos para obtener información general sobre el hardware, el sistema operativo y el entorno actual.

```bash
hostname
```

Muestra el nombre del host del servidor actual.

Para modificarlo temporalmente: `hostname nuevo-nombre`.

Para modificarlo permanentemente: `echo "nombre-servidor" > /etc/hostname`.

```bash
uname
```

Muestra información sobre la máquina, el sistema operativo y la arquitectura.

`-r`: Ver la versión del kernel.

`-a`: Ver toda la información disponible del sistema (kernel, arquitectura, nodo).

`-m`: Muestra la arquitectura de hardware (ej. `x86_64`).

```bash
uptime
```

Muestra cuánto tiempo lleva el sistema encendido, el número de usuarios y la carga media.

```bash
lscpu
```

Muestra información detallada sobre la arquitectura de la CPU (núcleos, hilos, caché).

```bash
free -h
```

Muestra la cantidad de memoria RAM libre y usada en formato legible (human-readable).

```bash
date
```

Devuelve la hora y la fecha actual del sistema.

```bash
cal
```

Muestra el calendario del mes actual.

`-y`: Muestra el calendario de todo el año actual.

```bash
tty
```

Imprime el nombre del dispositivo de caracteres asociado a la terminal actual (ej. `/dev/pts/0`).
