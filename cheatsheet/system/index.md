# Sistema — Información y Administración

Comandos para obtener información del hardware y el sistema operativo, gestionar el arranque, monitorizar recursos y administrar la configuración global.

---

## 1. Información del Sistema

```bash
uname -a                         # Todo: kernel, hostname, arquitectura, fecha
uname -r                         # Solo versión del kernel (ej: 6.1.0-20-amd64)
uname -m                         # Arquitectura (x86_64, aarch64, i686...)
uname -n                         # Hostname (nombre de la máquina)
uname -s                         # Nombre del SO (Linux)
uname -o                         # Sistema operativo (GNU/Linux)

hostname                         # Nombre del host
hostname -I                      # Todas las IPs de la máquina
hostname -f                      # FQDN (Fully Qualified Domain Name)

# Distribución Linux
cat /etc/os-release              # Información estándar de la distro (systemd)
cat /etc/issue                   # Mensaje de bienvenida (nombre de distro)
lsb_release -a                   # Info completa (requiere lsb-release)
lsb_release -d                   # Solo descripción (ej: Ubuntu 24.04 LTS)

# Versión del kernel desde /proc
cat /proc/version                # Versión del kernel + compilador usado
cat /proc/sys/kernel/osrelease   # Solo versión del kernel
cat /proc/sys/kernel/hostname    # Hostname
```

---

## 2. Hardware — CPU, RAM, Dispositivos

```bash
# CPU
lscpu                            # Información completa de CPU
lscpu | grep -E "CPU\(s\)|Thread|Core|Socket|Model name"
nproc                            # Número de CPUs/cores disponibles
cat /proc/cpuinfo                # Información detallada por core
cat /proc/cpuinfo | grep "model name" | uniq  # Modelo de CPU
grep -c processor /proc/cpuinfo  # Número de procesadores lógicos
```

```bash
# Memoria RAM
free -h                          # RAM y swap en formato legible
free -m                          # En megabytes
free -s 2                        # Actualizar cada 2 segundos
cat /proc/meminfo                # Información detallada de memoria
vmstat -s                        # Estadísticas de memoria y sistema

# Parámetros clave de /proc/meminfo:
# MemTotal     → RAM física total
# MemFree      → RAM libre (no utilizada)
# MemAvailable → RAM disponible para nuevos procesos (más real que MemFree)
# Buffers      → Cache de metadatos del sistema de archivos
# Cached       → Caché de contenido de archivos
# SwapTotal    → Espacio de swap total
# SwapFree     → Swap libre
```

```bash
# Dispositivos y buses
lsblk                            # Dispositivos de bloques (discos, particiones)
lsblk -f                         # Con sistemas de archivos y UUIDs
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT,FSTYPE  # Columnas personalizadas
lsusb                            # Dispositivos USB
lsusb -v                         # Verbose (información detallada)
lspci                            # Dispositivos PCI (tarjetas de red, GPU, etc.)
lspci -v                         # Verbose
lspci | grep -i "network\|ethernet\|wifi"  # Solo dispositivos de red
lspci | grep -i "vga\|display"   # Solo GPU
dmidecode                        # Información de BIOS y hardware (requiere root)
dmidecode -t memory              # Módulos de RAM
dmidecode -t processor           # CPU desde BIOS
dmidecode -t bios                # Información de BIOS
dmidecode -s system-serial-number  # Número de serie del sistema
```

---

## 3. Tiempo de Actividad y Carga

```bash
uptime                           # Tiempo activo, usuarios y carga media
uptime -p                        # Formato "pretty": up 2 days, 3 hours, 15 minutes
uptime -s                        # Fecha y hora de inicio del sistema

# Load average (carga media)
# Los 3 números son: media de 1min, 5min, 15min
# En un sistema con 4 cores: 4.0 = 100% de uso; >4.0 = sobrecargado

cat /proc/loadavg                # Carga media + procesos en ejecución/total + último PID

w                                # Usuarios, tiempo activo y carga
who -b                           # Hora del último arranque

last reboot | head -5            # Historial de reinicios
last shutdown | head -5          # Historial de apagados
```

---

## 4. Fecha y Hora

```bash
date                             # Fecha y hora local
date -u                          # Fecha y hora UTC
date +"%Y-%m-%d"                 # Solo fecha: 2025-06-09
date +"%H:%M:%S"                 # Solo hora: 14:30:00
date +"%Y-%m-%d %H:%M:%S"        # Combinado
date +%s                         # Timestamp Unix (segundos desde 1970-01-01)
date -d "@1749427200"            # Convertir timestamp Unix a fecha
date -d "2025-12-31"             # Fecha específica
date -d "next monday"            # Lunes próximo
date -d "+30 days"               # En 30 días
date -d "yesterday"              # Ayer
date -d "last week"              # Hace una semana

timedatectl                      # Estado completo del tiempo y zona horaria
timedatectl list-timezones       # Zonas horarias disponibles
timedatectl list-timezones | grep Spain
sudo timedatectl set-timezone Europe/Madrid  # Cambiar zona horaria
sudo timedatectl set-ntp true    # Habilitar sincronización NTP
timedatectl show                 # Propiedades en formato clave=valor

hwclock                          # Hora del reloj hardware (RTC)
hwclock --systohc                # Sincronizar hardware clock con el sistema
hwclock --hctosys                # Sincronizar sistema con hardware clock

cal                              # Calendario del mes actual
cal -3                           # Mes anterior, actual y siguiente
cal -y                           # Calendario del año entero
cal 2025                         # Calendario de 2025
cal 12 2025                      # Diciembre de 2025
ncal                             # Formato alternativo (columnas = días)
```

---

## 5. Variables de Entorno

```bash
env                              # Todas las variables de entorno
printenv                         # Equivalente
printenv PATH                    # Variable específica
echo $HOME                       # Valor de HOME
echo $USER                       # Usuario actual
echo $SHELL                      # Shell actual
echo $PATH                       # Rutas de búsqueda de ejecutables
echo $LD_LIBRARY_PATH            # Rutas de bibliotecas dinámicas
echo $TERM                       # Tipo de terminal
echo $LANG                       # Idioma del sistema
echo $EDITOR                     # Editor por defecto

# Establecer variables
export MI_VARIABLE="valor"       # Exportar (disponible para subprocesos)
MI_VARIABLE="valor"              # Solo para el shell actual (no exportada)
unset MI_VARIABLE                # Eliminar variable

# Modificar PATH
export PATH=$PATH:/nuevo/directorio   # Añadir al final
export PATH=/nuevo/directorio:$PATH   # Añadir al inicio (prioridad)

# Variables permanentes
# ~/.bashrc            → solo para bash interactivo del usuario
# ~/.bash_profile / ~/.profile  → login shells del usuario
# /etc/environment     → sistema, todas las shells (no ejecuta comandos)
# /etc/profile         → login shells de todos los usuarios
# /etc/profile.d/      → scripts modulares (mejor práctica)
echo 'export MI_VAR="valor"' >> ~/.bashrc
source ~/.bashrc                 # Recargar sin reiniciar sesión

# Ver variable en un comando sin exportar globalmente
MI_VAR="test" python3 -c "import os; print(os.environ['MI_VAR'])"
```

---

## 6. Gestión del Sistema (systemd)

```bash
# Estado del sistema
systemctl status                 # Estado general del sistema
systemctl list-units --state=failed  # Unidades que fallaron
systemctl list-units --type=service --state=running  # Servicios activos
systemctl list-unit-files        # Todos los archivos de unidad con estado

# Apagado y reinicio
sudo shutdown -h now             # Apagar ahora
sudo shutdown -h +10             # Apagar en 10 minutos
sudo shutdown -h 22:00           # Apagar a las 22:00
sudo shutdown -r now             # Reiniciar ahora
sudo shutdown -r +5              # Reiniciar en 5 minutos
sudo shutdown -c                 # Cancelar shutdown programado
sudo halt                        # Apagar (sin avisar)
sudo reboot                      # Reiniciar (sin avisar)
sudo poweroff                    # Apagar completamente
sudo systemctl poweroff          # Equivalente con systemctl
sudo systemctl reboot            # Reiniciar con systemctl

# Niveles de ejecución (targets en systemd)
systemctl get-default                           # Target por defecto
sudo systemctl set-default graphical.target     # Arrancar en modo gráfico
sudo systemctl set-default multi-user.target    # Arrancar en modo texto
sudo systemctl isolate rescue.target            # Modo rescate (sin red)
sudo systemctl isolate emergency.target         # Modo emergencia (solo root)

# Journald — logs del sistema
journalctl                       # Todos los logs
journalctl -f                    # Seguir en tiempo real
journalctl -n 50                 # Últimas 50 líneas
journalctl --since "2025-06-09"  # Desde una fecha
journalctl --since "1 hour ago"  # Última hora
journalctl --since "09:00" --until "17:00"  # Rango horario
journalctl -u nginx              # Logs de un servicio específico
journalctl -p err                # Solo errores (emerg, alert, crit, err, warning, notice, info, debug)
journalctl -b                    # Solo el arranque actual
journalctl -b -1                 # Arranque anterior
journalctl --disk-usage          # Espacio usado por los logs
journalctl --vacuum-time=30d     # Eliminar logs de más de 30 días
journalctl --vacuum-size=1G      # Mantener solo 1GB de logs
journalctl -o json               # Formato JSON
```

---

## 7. Módulos del Kernel

```bash
lsmod                            # Módulos del kernel cargados actualmente
modinfo bluetooth                # Información de un módulo
modprobe bluetooth               # Cargar módulo (con dependencias)
sudo modprobe -r bluetooth       # Descargar módulo
sudo insmod /ruta/modulo.ko      # Cargar módulo específico (sin dependencias)
sudo rmmod bluetooth             # Descargar módulo específico

# Configuración permanente
echo "bluetooth" | sudo tee -a /etc/modules  # Cargar al inicio
echo "blacklist pcspkr" | sudo tee /etc/modprobe.d/pcspkr.conf  # Blacklist módulo

# Parámetros del kernel (sysctl)
sysctl -a                        # Todos los parámetros
sysctl net.ipv4.ip_forward       # Ver un parámetro
sudo sysctl -w net.ipv4.ip_forward=1  # Establecer temporalmente
sudo sysctl -p                   # Recargar /etc/sysctl.conf
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf  # Permanente

# Parámetros de seguridad útiles
sysctl kernel.randomize_va_space   # ASLR (debe ser 2 = full randomization)
sysctl kernel.dmesg_restrict       # Restricción de dmesg (1 = solo root)
sysctl net.ipv4.conf.all.rp_filter # Reverse path filtering

# Ver mensajes del kernel
dmesg                            # Buffer de mensajes del kernel
dmesg -T                         # Con timestamps legibles
dmesg | tail -20                 # Últimos mensajes
dmesg | grep -i error            # Solo errores
dmesg | grep -i "usb\|network\|eth"  # Filtrar por tipo
sudo dmesg -c                    # Limpiar el buffer (requiere root)
```

---

## 8. Arranque del Sistema (Boot)

```bash
# GRUB
cat /etc/default/grub            # Configuración de GRUB
sudo update-grub                 # Regenerar grub.cfg (Debian/Ubuntu)
sudo grub-mkconfig -o /boot/grub/grub.cfg  # Equivalente manual

# Initramfs
ls /boot/                        # Archivos de arranque
update-initramfs -u              # Actualizar initramfs (Debian/Ubuntu)
dracut --force                   # Actualizar initramfs (Red Hat/CentOS)

# systemd-analyze — análisis del tiempo de arranque
systemd-analyze                  # Tiempo total de arranque
systemd-analyze blame            # Tiempo de cada unidad ordenado por duración
systemd-analyze critical-chain   # Cadena crítica de dependencias
systemd-analyze plot > boot.svg  # Gráfico SVG del arranque

# Servicios que más tardan en arrancar
systemd-analyze blame | head -10
```

---

## 9. Localización e Idioma

```bash
locale                           # Configuración de locale actual
locale -a                        # Locales disponibles en el sistema
localectl                        # Estado de localización (systemd)
localectl list-locales           # Locales disponibles
sudo localectl set-locale LANG=es_ES.UTF-8  # Cambiar idioma del sistema
sudo localectl set-keymap es     # Distribución de teclado en modo texto
sudo localectl set-x11-keymap es  # Distribución de teclado en X11

# Generar locales (Debian/Ubuntu)
sudo locale-gen es_ES.UTF-8
sudo dpkg-reconfigure locales
```

---

## 10. Información Rápida — Referencia

```bash
# Ver todo en un pantallazo
echo "=== Sistema ==="
uname -a
echo "=== Distro ==="
cat /etc/os-release | grep PRETTY_NAME
echo "=== CPU ==="
lscpu | grep "Model name"
echo "=== RAM ==="
free -h | head -2
echo "=== Disco ==="
df -h /
echo "=== Uptime ==="
uptime
echo "=== IP ==="
hostname -I
echo "=== Usuario ==="
id
```

```bash
# Alias útiles para administración del sistema
alias sysinfo='uname -a && uptime && free -h && df -h /'
alias myip='curl -s ifconfig.me'
alias localip='hostname -I | awk "{print \$1}"'
alias ports='ss -tulnp'
alias listening='ss -tlnp'
alias cpuinfo='lscpu | grep -E "Model|CPU\(s\)|Thread|Core"'
alias meminfo='free -h && cat /proc/meminfo | grep -E "MemTotal|MemAvailable|SwapTotal"'
```
