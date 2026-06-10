# Gestión de Procesos

Un proceso es una instancia de un programa en ejecución. Entender cómo gestionarlos es esencial para la administración del sistema y para el análisis forense.

---

## 1. Conceptos Clave

| Concepto | Descripción |
|---|---|
| **PID** | Process ID — identificador único del proceso |
| **PPID** | Parent PID — PID del proceso padre |
| **UID/EUID** | User ID real / efectivo que ejecuta el proceso |
| **TTY** | Terminal asociada al proceso (`?` = sin terminal, daemon) |
| **Daemon** | Proceso en segundo plano sin terminal (servicios del sistema) |
| **Zombie** | Proceso que ha terminado pero el padre no ha recogido su estado |
| **Orphan** | Proceso cuyo padre ha muerto; adoptado por init (PID 1) |
| **Señal** | Mecanismo IPC para comunicarse con procesos |

---

## 2. Visualización de Procesos

### `ps` — Snapshot de procesos

```bash
ps aux                            # Todos los procesos, formato BSD
ps -ef                            # Todos los procesos, formato POSIX
ps -ejH                           # Árbol de jerarquía
ps aux --sort=-%cpu               # Ordenar por CPU (descendente)
ps aux --sort=-%mem               # Ordenar por memoria
ps aux | grep nginx               # Filtrar por nombre
ps -u alice                       # Procesos del usuario alice
ps -p 1234                        # Información de un PID específico
ps -o pid,ppid,user,stat,cmd      # Campos personalizados
```

Entender la columna `STAT`:

| Estado | Significado |
|---|---|
| `R` | Running / Runnable (en ejecución o listo) |
| `S` | Sleeping interruptible (espera evento) |
| `D` | Sleeping uninterruptible (espera I/O, no se puede matar) |
| `T` | Stopped (detenido, Ctrl+Z) |
| `Z` | Zombie (terminado, esperando al padre) |
| `I` | Idle kernel thread |
| `<` | Alta prioridad (nice negativo) |
| `N` | Baja prioridad (nice positivo) |
| `s` | Es líder de sesión |
| `l` | Multihilo |
| `+` | En el grupo de proceso en primer plano |

### `top` — Monitor interactivo

```bash
top                               # Abre el monitor
top -u alice                      # Solo procesos de alice
top -p 1234,5678                  # Monitorizar PIDs específicos
top -b -n 1 > snapshot.txt        # Batch mode, 1 iteración, guardar a archivo
top -b -n 5 -d 2 > monit.txt      # 5 iteraciones cada 2 segundos
```

Atajos dentro de `top`:

| Tecla | Acción |
|---|---|
| `P` | Ordenar por CPU |
| `M` | Ordenar por memoria |
| `N` | Ordenar por PID |
| `T` | Ordenar por tiempo de CPU |
| `R` | Invertir orden |
| `k` | Matar proceso (pide PID y señal) |
| `r` | Cambiar prioridad (renice) |
| `u` | Filtrar por usuario |
| `1` | Ver todas las CPUs individuales |
| `H` | Ver hilos en lugar de procesos |
| `c` | Mostrar comando completo |
| `i` | Ocultar procesos idle |
| `q` | Salir |
| `h` | Ayuda |

### `htop` — Monitor visual avanzado

```bash
htop                              # Requiere: apt install htop
htop -u alice                     # Solo procesos de alice
htop -p 1234,5678                 # PIDs específicos
htop -d 5                         # Actualizar cada 0.5 segundos (5 décimas)
```

Características adicionales de htop:
- Barra de CPU por core, barra de memoria visual
- Árbol de procesos con `F5`
- Búsqueda con `F3`
- Filtro con `F4`
- Ordenar con `F6`
- Matar con `F9`

### `pstree` — Árbol de procesos

```bash
pstree                            # Árbol de todos los procesos
pstree -p                         # Con PIDs
pstree -u                         # Con usuarios
pstree alice                      # Solo procesos de alice
pstree -a 1234                    # Árbol a partir de PID específico
pstree -h                         # Resalta el proceso actual y sus padres
```

---

## 3. Información Detallada de un Proceso

```bash
# /proc — sistema de archivos virtual con toda la info de procesos
ls /proc/1234/                    # Directorio del proceso con PID 1234
cat /proc/1234/cmdline            # Línea de comando (separado por \0)
cat /proc/1234/cmdline | tr '\0' ' '  # Legible
cat /proc/1234/status             # Estado detallado: PID, PPID, usuario, memoria...
cat /proc/1234/environ            # Variables de entorno (¡puede contener secrets!)
cat /proc/1234/environ | tr '\0' '\n'  # Legible
ls -la /proc/1234/fd/             # Archivos/sockets abiertos
cat /proc/1234/maps               # Regiones de memoria (mmap)
cat /proc/1234/net/tcp            # Conexiones TCP del proceso
readlink /proc/1234/exe           # Ruta del ejecutable
```

```bash
# Información de un proceso específico
pgrep nginx                       # PID(s) por nombre
pgrep -a nginx                    # PID y comando completo
pgrep -u alice                    # PIDs de procesos de alice
pgrep -l -u root                  # Nombre y PID de procesos de root
pidof sshd                        # PID del proceso por nombre exacto
```

```bash
# lsof — archivos abiertos por un proceso
lsof -p 1234                      # Todos los archivos del proceso 1234
lsof -p 1234 | grep REG           # Solo archivos regulares
lsof -p 1234 | grep IPv4          # Solo conexiones IPv4
lsof -c nginx                     # Archivos abiertos por procesos nginx
```

---

## 4. Señales

Las señales son el mecanismo principal para comunicarse con procesos.

```bash
kill -l                           # Lista todas las señales disponibles
```

Señales más importantes:

| Número | Nombre | Descripción |
|---|---|---|
| 1 | SIGHUP | Hang up — recargar configuración (daemons) |
| 2 | SIGINT | Interrupt — equivalente a Ctrl+C |
| 3 | SIGQUIT | Quit — genera core dump, termina |
| 9 | SIGKILL | Kill inmediato — no puede ser ignorado ni capturado |
| 10 | SIGUSR1 | User-defined 1 — uso definido por la aplicación |
| 12 | SIGUSR2 | User-defined 2 |
| 15 | SIGTERM | Terminate gracefully — señal por defecto (da tiempo a limpiar) |
| 17 | SIGCHLD | Child stopped/terminated (enviado al padre) |
| 18 | SIGCONT | Continuar proceso detenido |
| 19 | SIGSTOP | Detener proceso — no puede ser ignorado (como Ctrl+Z) |
| 20 | SIGTSTP | Terminal stop — puede ser capturado (Ctrl+Z) |

```bash
# kill — enviar señal por PID
kill 1234                         # SIGTERM al PID 1234 (graceful)
kill -9 1234                      # SIGKILL (forzado)
kill -15 1234                     # SIGTERM explícito
kill -1 1234                      # SIGHUP (recargar configuración)
kill -SIGKILL 1234                # Por nombre
kill 0                            # Señal a todos los procesos del grupo actual

# killall — por nombre de proceso
killall nginx                     # SIGTERM a todos los procesos nginx
killall -9 chrome                 # SIGKILL a todos los chrome
killall -u alice bash             # Señal a los bash de alice
killall -w nginx                  # Esperar hasta que termine

# pkill — matar por patrón
pkill nginx                       # SIGTERM a procesos que coincidan con 'nginx'
pkill -9 -u alice                 # SIGKILL a todos los procesos de alice
pkill -f "python.*script.py"      # Coincidencia con comando completo
pkill -n nginx                    # Solo el proceso más reciente
pkill -o nginx                    # Solo el proceso más antiguo
```

---

## 5. Prioridad de Procesos

El valor **nice** va de `-20` (máxima prioridad) a `19` (mínima prioridad). Los procesos normales inician con 0.

```bash
# nice — lanzar con prioridad específica
nice comando                      # Prioridad 10 (por defecto)
nice -n 5 comando                 # Baja prioridad 5
nice -n -10 comando               # Alta prioridad -10 (requiere root)
nice -n 19 tar -czvf backup.tar.gz /  # Backup sin afectar el sistema

# renice — cambiar prioridad de proceso existente
renice -n 5 -p 1234               # Cambiar PID 1234 a nice 5
renice -n 10 -u alice             # Todos los procesos de alice a nice 10
renice -n -5 -p 1234              # Alta prioridad (requiere root)
sudo renice -20 -p 1234           # Máxima prioridad (solo root)
```

---

## 6. Trabajos en Segundo Plano (Job Control)

```bash
comando &                         # Lanzar en background desde el inicio
Ctrl + Z                          # Suspender proceso en foreground
Ctrl + C                          # Interrumpir proceso en foreground (SIGINT)

jobs                              # Listar trabajos en background/suspended
jobs -l                           # Con PIDs

bg %1                             # Reanudar trabajo 1 en background
bg %nginx                         # Por nombre
fg %1                             # Traer trabajo 1 a foreground
fg                                # Traer el más reciente a foreground

disown %1                         # Desvincular de la terminal (no muere al cerrar sesión)
disown -h %1                      # Igual pero no elimina de la lista de jobs
disown -a                         # Desvincular todos los trabajos
```

### Persistencia: nohup y screen/tmux

```bash
# nohup — protege contra cierre de sesión
nohup comando &                   # Salida va a nohup.out
nohup ./script.sh > mi.log 2>&1 & # Con log personalizado

# screen — multiplexor de terminales
screen                            # Abrir nueva sesión
screen -S nombre                  # Sesión con nombre
screen -ls                        # Listar sesiones
screen -r nombre                  # Reconectar a sesión
# Dentro de screen: Ctrl+A d = detach, Ctrl+A c = nueva ventana, Ctrl+A n = siguiente

# tmux — multiplexor moderno (recomendado)
tmux                              # Nueva sesión
tmux new -s trabajo               # Sesión con nombre
tmux ls                           # Listar sesiones
tmux attach -t trabajo            # Reconectar
tmux kill-session -t trabajo      # Matar sesión
# Dentro de tmux: Ctrl+B d = detach, Ctrl+B c = nueva ventana, Ctrl+B % = split vertical
```

---

## 7. Procesos del Sistema (Servicios)

```bash
# systemctl — gestión de servicios systemd
systemctl status nginx            # Estado del servicio
systemctl start nginx             # Iniciar
systemctl stop nginx              # Parar
systemctl restart nginx           # Reiniciar
systemctl reload nginx            # Recargar configuración (sin reiniciar)
systemctl enable nginx            # Habilitar al inicio
systemctl disable nginx           # Deshabilitar al inicio
systemctl is-active nginx         # ¿Está activo?
systemctl is-enabled nginx        # ¿Está habilitado al inicio?

systemctl list-units --type=service           # Todos los servicios
systemctl list-units --type=service --state=running   # Solo los activos
systemctl list-units --type=service --state=failed    # Los que fallaron
systemctl list-unit-files --type=service      # Todos con su estado de habilitación

# Ver logs de un servicio
journalctl -u nginx               # Todos los logs
journalctl -u nginx -f            # Seguir en tiempo real
journalctl -u nginx --since "1 hour ago"  # Última hora
journalctl -u nginx -n 50         # Últimas 50 líneas

# Daemon-reload tras modificar unit files
systemctl daemon-reload
```

---

## 8. Monitorización de Recursos

```bash
# Uso de CPU y memoria
vmstat 2 5                        # Estadísticas del sistema cada 2s, 5 veces
vmstat -s                         # Resumen de memoria

iostat 2                          # Estadísticas de I/O de disco
iostat -xz 2                      # Extendido, sin líneas a cero

mpstat 2                          # Estadísticas por CPU
mpstat -P ALL 2                   # Todas las CPUs individualmente

sar -u 2 5                        # Uso de CPU (requiere sysstat)
sar -r 2 5                        # Uso de memoria
sar -b 2 5                        # I/O

# Memoria
free -h                           # RAM y swap en formato humano
cat /proc/meminfo                 # Información completa de memoria
```

```bash
# Límites del sistema
ulimit -a                         # Ver todos los límites del shell actual
ulimit -n                         # Número máximo de archivos abiertos
ulimit -n 65535                   # Aumentar temporalmente
ulimit -u                         # Máximo de procesos del usuario
cat /proc/1234/limits             # Límites de un proceso específico

# Configuración permanente: /etc/security/limits.conf
# alice soft nofile 65535
# alice hard nofile 65535
```

---

## 9. Análisis Forense de Procesos

```bash
# Ver todos los procesos con detalles (útil en análisis de compromiso)
ps auxef                          # Todos, con variables de entorno
ps -eo pid,ppid,user,lstart,etime,cmd  # Con tiempo de inicio y duración

# Comparar procesos con binarios en disco (detectar ghosting)
ls -la /proc/*/exe 2>/dev/null | grep deleted  # Procesos corriendo desde binarios borrados
ls -la /proc/*/exe 2>/dev/null

# Procesos escuchando en red (sin root de forma limitada)
ss -tulnp
cat /proc/net/tcp                 # Conexiones TCP en formato hexadecimal
cat /proc/net/tcp6                # IPv6

# Ver qué hay en memoria de un proceso (dump)
gdb -p 1234                       # Adjuntar GDB al proceso
# En GDB: (gdb) dump memory /tmp/dump 0xSTART 0xEND

# Buscar strings en memoria del proceso
strings /proc/1234/mem 2>/dev/null | grep password
cat /proc/1234/maps               # Ver rangos de memoria para dump

# Detectar inyección de procesos
cat /proc/1234/maps | grep -v "\.so\|heap\|stack\|vvar\|vdso"  # Regiones anómalas
```
