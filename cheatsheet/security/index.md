# Seguridad — Hardening y Análisis

Comandos y técnicas de análisis de seguridad, hardening del sistema y detección de vectores de ataque.

---

## 1. Auditoría de Usuarios y Accesos

```bash
# Ver todos los usuarios con shell válida
grep -v '/sbin/nologin\|/bin/false' /etc/passwd | awk -F: '{print $1, $3, $7}'

# Usuarios con UID 0 (root equivalents)
awk -F: '($3 == 0) {print}' /etc/passwd

# Últimos logins
last -20                         # Últimos 20 accesos
lastb -20 2>/dev/null            # Últimos 20 intentos fallidos
lastlog                          # Último acceso de cada cuenta
who                              # Usuarios conectados ahora

# Historial de comandos sudo
grep "sudo" /var/log/auth.log | grep "COMMAND"
journalctl _COMM=sudo | tail -50

# Ver qué puede hacer el usuario actual con sudo
sudo -l
```

---

## 2. Vectores de Escalada de Privilegios (Linux)

```bash
# SUID — ejecutables con privilegios del dueño
find / -perm -u=s -type f 2>/dev/null
find / -perm -4000 -user root -type f 2>/dev/null

# SGID
find / -perm -g=s -type f 2>/dev/null
find / -perm -2000 -type f 2>/dev/null

# Capabilities — privilegios específicos de root sin SUID completo
getcap -r / 2>/dev/null

# Archivos escribibles por todos (world-writable)
find / -perm -002 -type f -not -path "*/proc/*" 2>/dev/null
find / -perm -o+w -type f 2>/dev/null

# Directorios escribibles por el usuario actual
find / -writable -type d 2>/dev/null | grep -v proc

# Archivos sin propietario
find / -nouser 2>/dev/null
find / -nogroup 2>/dev/null

# Tareas cron (pueden contener scripts modificables)
cat /etc/crontab
ls -la /etc/cron*
cat /etc/cron.d/*
crontab -l 2>/dev/null

# Sudo sin contraseña
sudo -l 2>/dev/null | grep -i "nopasswd"

# Variables de entorno en sudo (LD_PRELOAD, PYTHONPATH...)
sudo -l | grep env_keep

# Binarios SUID/SGID interesantes para GTFOBins
find / -perm -4000 -type f 2>/dev/null | xargs ls -la | grep -E "vim|find|nano|python|perl|ruby|bash|sh|nmap|less|more|env|awk|sed|cp|mv|nmap|strace|gdb"
```

---

## 3. Análisis de Red y Servicios

```bash
# Puertos abiertos y servicios
ss -tunlp                        # TCP/UDP listening + proceso
ss -tunp state established       # Conexiones establecidas
netstat -tulnp 2>/dev/null       # Alternativa

# Reglas de firewall
iptables -L -n -v 2>/dev/null
iptables -t nat -L -n -v 2>/dev/null
ufw status verbose 2>/dev/null
nft list ruleset 2>/dev/null

# Interfaces y rutas
ip a                             # Interfaces y IPs
ip r                             # Tabla de rutas
ip neigh show                    # Tabla ARP (hosts vecinos)

# Conexiones salientes actuales
ss -tnp state established | grep -v "127.0\|::1"
lsof -i -n -P | grep ESTABLISHED
```

---

## 4. Análisis de Procesos y Binarios

```bash
# Procesos corriendo desde binarios eliminados (posible malware en memoria)
ls -la /proc/*/exe 2>/dev/null | grep deleted

# Procesos con conexiones de red
lsof -i -n -P 2>/dev/null

# Verificar integridad de binarios del sistema
dpkg --verify 2>/dev/null       # Debian/Ubuntu: detecta cambios en paquetes
rpm -Va 2>/dev/null             # Red Hat: audit de archivos de paquetes

# Strings en binarios (buscar credenciales hardcoded)
strings /ruta/binario | grep -i "password\|passwd\|secret\|token\|key"

# Verificar checksums
sha256sum /bin/bash              # Hash del bash actual
md5sum /etc/passwd               # Hash de archivos críticos

# Listar librerías de un proceso
ldd /bin/bash                    # Dependencias de biblioteca
cat /proc/1234/maps              # Mapas de memoria de un proceso
```

---

## 5. Logs de Seguridad

```bash
# Autenticación
tail -f /var/log/auth.log        # Debian/Ubuntu: logins, sudo, SSH
tail -f /var/log/secure          # Red Hat/CentOS: equivalente

# Errores del sistema
journalctl -p 0..3 -n 50        # Solo emergency, alert, critical, error

# SSH: ataques de fuerza bruta
grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn | head
grep "Accepted publickey\|Accepted password" /var/log/auth.log | tail -20

# Uso de sudo
grep "sudo" /var/log/auth.log | grep -v "pam\|session"

# Actividad reciente de root
last root | head -10
grep "root" /var/log/auth.log | grep "session opened" | tail -10
```

---

## 6. Hardening Básico del Sistema

```bash
# Deshabilitar servicios innecesarios
systemctl disable telnet rsh rlogin rexec 2>/dev/null
systemctl disable avahi-daemon cups bluetooth 2>/dev/null    # Si no se usan

# Permisos de archivos críticos
chmod 640 /etc/shadow
chmod 644 /etc/passwd
chmod 440 /etc/sudoers
chmod 700 /root
chmod 600 /etc/ssh/sshd_config

# Hacer archivos inmutables
sudo chattr +i /etc/passwd
sudo chattr +i /etc/shadow
sudo chattr +i /etc/sudoers
# Ver atributos
lsattr /etc/passwd

# Parámetros de kernel (sysctl)
sudo sysctl -w kernel.randomize_va_space=2    # ASLR completo
sudo sysctl -w net.ipv4.tcp_syncookies=1      # Protección SYN flood
sudo sysctl -w net.ipv4.icmp_echo_ignore_broadcasts=1  # Ignorar broadcast ICMP
sudo sysctl -w kernel.dmesg_restrict=1        # Solo root puede ver dmesg
sudo sysctl -w fs.protected_hardlinks=1       # Proteger hard links
sudo sysctl -w fs.protected_symlinks=1        # Proteger symlinks

# Permanente en /etc/sysctl.conf o /etc/sysctl.d/99-hardening.conf
```

---

## 7. Herramientas de Seguridad

```bash
# lynis — auditoría de seguridad del sistema
sudo lynis audit system          # Auditoría completa
sudo lynis show warnings         # Solo advertencias

# fail2ban — bloqueo automático de IPs abusivas
sudo fail2ban-client status      # Estado general
sudo fail2ban-client status sshd # Jails de SSH
sudo fail2ban-client set sshd banip 1.2.3.4  # Banear IP manualmente
sudo fail2ban-client set sshd unbanip 1.2.3.4  # Desbanear

# rkhunter — detección de rootkits
sudo rkhunter --update
sudo rkhunter --check --skip-keypress

# aide — integridad de archivos
sudo aide --init                 # Crear base de datos inicial
sudo aide --check                # Comparar con la base de datos

# clamav — antivirus
sudo freshclam                   # Actualizar firmas
sudo clamscan -r /home --bell -i  # Escanear directorio

# nmap — escaneo (auto-diagnóstico)
nmap -sV localhost               # Servicios del propio sistema
nmap -p- localhost               # Todos los puertos
```
