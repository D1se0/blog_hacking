# Redes (Networking)

Configuración, diagnóstico y análisis de redes en Linux. Desde comandos básicos hasta técnicas avanzadas de análisis de tráfico.

---

## 1. Interfaces de Red

```bash
ip a                             # Ver todas las interfaces con sus IPs (moderno)
ip addr show                     # Equivalente
ip addr show eth0                # Solo la interfaz eth0
ifconfig                         # Clásico (requiere net-tools: apt install net-tools)
```

### Configurar interfaces

```bash
# Asignar IP estática temporal
ip addr add 192.168.1.100/24 dev eth0
ip addr del 192.168.1.100/24 dev eth0   # Eliminar

# Activar/desactivar interfaz
ip link set eth0 up
ip link set eth0 down

# Modo promiscuo (captura todo el tráfico del segmento)
ip link set eth0 promisc on
ip link set eth0 promisc off

# Cambiar MTU
ip link set eth0 mtu 1400

# Cambiar MAC (spoofing)
ip link set eth0 down
ip link set eth0 address AA:BB:CC:DD:EE:FF
ip link set eth0 up
```

### Configuración persistente

```bash
# Debian/Ubuntu — /etc/network/interfaces
auto eth0
iface eth0 inet static
    address 192.168.1.100
    netmask 255.255.255.0
    gateway 192.168.1.1
    dns-nameservers 8.8.8.8 1.1.1.1

# Aplicar cambios
sudo systemctl restart networking
```

---

## 2. Enrutamiento

```bash
ip route show                    # Ver tabla de rutas
ip route                         # Equivalente corto
route -n                         # Clásico (con net-tools)
netstat -rn                      # Alternativa clásica
```

```bash
# Añadir/quitar rutas
ip route add 10.0.0.0/8 via 192.168.1.1         # Ruta a red
ip route add 10.0.0.0/8 dev eth1                # Ruta por interfaz
ip route del 10.0.0.0/8 via 192.168.1.1         # Eliminar
ip route add default via 192.168.1.1            # Puerta de enlace por defecto

# Ver qué ruta se usa para llegar a una IP
ip route get 8.8.8.8

# Rutas persistentes (Debian)
echo "up ip route add 10.0.0.0/8 via 192.168.1.1" >> /etc/network/interfaces
```

---

## 3. DNS — Resolución de Nombres

```bash
# Consultas DNS
nslookup ejemplo.com              # Consulta básica
nslookup -type=MX ejemplo.com     # Registros MX
nslookup -type=NS ejemplo.com     # Servidores de nombres
nslookup ejemplo.com 8.8.8.8      # Usar DNS específico
```

```bash
# dig — herramienta DNS avanzada
dig ejemplo.com                   # Consulta A (IPv4)
dig AAAA ejemplo.com              # Registro IPv6
dig MX ejemplo.com                # Registros de correo
dig NS ejemplo.com                # Servidores de nombres
dig TXT ejemplo.com               # Registros TXT (SPF, DKIM, etc.)
dig ANY ejemplo.com               # Todos los registros
dig ejemplo.com @1.1.1.1          # Usar Cloudflare como resolver
dig -x 8.8.8.8                    # DNS inverso (IP → nombre)
dig +short ejemplo.com            # Solo el resultado
dig +trace ejemplo.com            # Traza completa de resolución
dig +noall +answer ejemplo.com    # Solo la sección Answer
dig axfr @ns1.ejemplo.com ejemplo.com  # Zone transfer (si está mal configurado)
```

```bash
host ejemplo.com                  # Simple y rápido
host -t MX ejemplo.com            # Tipo específico
host 8.8.8.8                      # DNS inverso
```

```bash
# Configuración DNS del sistema
cat /etc/resolv.conf              # Servidores DNS configurados
cat /etc/hosts                    # Resolución local (se consulta antes que DNS)
cat /etc/nsswitch.conf            # Orden de resolución de nombres
```

---

## 4. Diagnóstico de Conectividad

```bash
# ping — comprobación de conectividad ICMP
ping 8.8.8.8                     # Infinito (Ctrl+C para parar)
ping -c 4 google.com             # Solo 4 paquetes
ping -i 0.2 host                 # Intervalo de 0.2 segundos
ping -s 1400 host                # Tamaño de paquete específico
ping -t 64 host                  # TTL específico
ping6 ::1                        # Ping IPv6
```

```bash
# traceroute / tracepath — ruta hasta el destino
traceroute google.com            # Usando UDP (por defecto)
traceroute -I google.com         # Usando ICMP
traceroute -T -p 80 google.com   # Usando TCP (útil si ICMP está bloqueado)
tracepath google.com             # Versión sin root, detecta MTU también
```

```bash
# mtr — traceroute interactivo en tiempo real
mtr google.com                   # Modo interactivo
mtr --report google.com          # Genera reporte estático
mtr -n google.com                # Sin resolución DNS (más rápido)
mtr -c 100 google.com --report   # 100 ciclos y reporte
```

---

## 5. Puertos y Conexiones Activas

```bash
# ss — herramienta moderna (reemplaza netstat)
ss -tunlp                        # TCP/UDP, numérico, listening, con PID
ss -s                            # Resumen estadístico
ss -t                            # Solo TCP
ss -u                            # Solo UDP
ss -l                            # Solo puertos en escucha
ss -p                            # Muestra el proceso asociado
ss -n                            # Numérico (sin resolver nombres)
ss -4                            # Solo IPv4
ss -6                            # Solo IPv6
ss state ESTABLISHED             # Solo conexiones establecidas
ss -tnp | grep :443              # Filtrar por puerto
```

```bash
# netstat (clásico, requiere net-tools)
netstat -tulnp                   # Equivalente a ss -tunlp
netstat -an                      # Todas las conexiones
netstat -rn                      # Tabla de rutas
netstat -i                       # Estadísticas de interfaces
```

```bash
# lsof — ver qué archivos/puertos tiene abiertos cada proceso
lsof -i                          # Todas las conexiones de red
lsof -i :80                      # Qué proceso usa el puerto 80
lsof -i TCP:80                   # Solo TCP en puerto 80
lsof -i @192.168.1.1             # Conexiones con una IP específica
lsof -i -n -P                    # Sin resolución de nombres
lsof -u alice                    # Archivos abiertos por el usuario alice
lsof -p 1234                     # Archivos del proceso con PID 1234
```

---

## 6. Análisis de Tráfico

```bash
# tcpdump — capturador de paquetes
tcpdump -i eth0                           # Capturar en eth0
tcpdump -i any                            # Todas las interfaces
tcpdump -n                                # Sin resolución DNS
tcpdump -v / -vv / -vvv                   # Verbosidad
tcpdump -c 100                            # Solo 100 paquetes
tcpdump -w captura.pcap                   # Guardar en archivo
tcpdump -r captura.pcap                   # Leer archivo guardado

# Filtros
tcpdump host 192.168.1.1                  # Solo tráfico con esa IP
tcpdump port 443                          # Solo puerto 443
tcpdump src 10.0.0.1                      # Solo origen
tcpdump dst 10.0.0.1                      # Solo destino
tcpdump tcp                               # Solo TCP
tcpdump udp                               # Solo UDP
tcpdump icmp                              # Solo ICMP
tcpdump 'tcp and port 80 and host google.com'  # Combinar filtros
tcpdump 'tcp flags & (syn) != 0'          # Solo paquetes SYN (escaneos)
tcpdump -i eth0 -A port 80                # Ver contenido HTTP en ASCII
```

```bash
# Capturar credenciales en texto plano (pentesting)
tcpdump -i eth0 -A 'tcp port 21 or tcp port 23 or tcp port 110'  # FTP, Telnet, POP3
```

---

## 7. Transferencia de Archivos

```bash
# scp — copia segura sobre SSH
scp archivo.txt user@host:/destino/       # Local → remoto
scp user@host:/remoto/archivo.txt .       # Remoto → local
scp -r directorio/ user@host:/destino/   # Recursivo
scp -P 2222 archivo user@host:/dest/     # Puerto personalizado
scp -i ~/.ssh/clave.pem archivo user@host:/dest/  # Con clave específica

# rsync — sincronización eficiente
rsync -avz origen/ user@host:/destino/   # Sincronizar con compresión
rsync -av --progress archivo dest/       # Mostrar progreso
rsync -av --delete origen/ destino/      # Borrar en destino lo que no está en origen
rsync -e "ssh -p 2222" -av orig/ user@host:/dest/  # Puerto SSH personalizado

# wget / curl — descargas HTTP/FTP
wget https://ejemplo.com/archivo.tar.gz  # Descargar
wget -c https://ejemplo.com/archivo      # Continuar descarga interrumpida
wget -r -l2 https://sitio.com            # Descarga recursiva (depth 2)
wget -O nuevo_nombre.tar.gz https://...  # Nombre de salida específico

curl -O https://ejemplo.com/archivo      # Descargar (mantiene nombre)
curl -o archivo.tar.gz https://...       # Nombre personalizado
curl -L https://...                      # Seguir redirecciones
curl -k https://...                      # Ignorar errores SSL
curl -u user:pass https://...            # Autenticación básica
curl -H "Authorization: Bearer TOKEN" https://...  # Header personalizado
curl -X POST -d '{"key":"val"}' -H "Content-Type: application/json" https://...
curl -I https://ejemplo.com              # Solo cabeceras HTTP
curl -v https://ejemplo.com             # Verbose (ver request y response completos)
```

---

## 8. Configuración de Firewall (iptables / nftables / ufw)

### UFW (Uncomplicated Firewall — Ubuntu)

```bash
sudo ufw status                    # Estado actual
sudo ufw status verbose            # Con más detalles
sudo ufw enable                    # Activar
sudo ufw disable                   # Desactivar

# Reglas
sudo ufw allow 22/tcp              # Permitir SSH
sudo ufw allow 80/tcp              # HTTP
sudo ufw allow 443                 # HTTPS (TCP por defecto)
sudo ufw allow from 192.168.1.0/24  # Permitir red completa
sudo ufw allow from 10.0.0.1 to any port 5432  # IP específica a puerto específico
sudo ufw deny 23/tcp               # Denegar Telnet
sudo ufw delete allow 80/tcp       # Eliminar regla
sudo ufw default deny incoming     # Política por defecto: denegar entrada
sudo ufw default allow outgoing    # Política: permitir salida
sudo ufw reset                     # Restablecer a configuración de fábrica
```

### iptables

```bash
# Ver reglas actuales
iptables -L                        # Listar todas
iptables -L -n -v                  # Numérico, verbose, con contadores
iptables -L INPUT -n               # Solo cadena INPUT

# Añadir reglas
iptables -A INPUT -p tcp --dport 22 -j ACCEPT      # Permitir SSH
iptables -A INPUT -p tcp --dport 80 -j ACCEPT      # Permitir HTTP
iptables -A INPUT -i lo -j ACCEPT                  # Permitir loopback
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT  # Conexiones existentes
iptables -A INPUT -j DROP                          # Denegar todo lo demás

# Eliminar reglas
iptables -D INPUT -p tcp --dport 80 -j ACCEPT
iptables -F                                        # Flush (borra todas las reglas)
iptables -F INPUT                                  # Solo flush de INPUT

# Guardar y restaurar
iptables-save > /etc/iptables/rules.v4
iptables-restore < /etc/iptables/rules.v4
```

---

## 9. Herramientas de Diagnóstico Avanzado

```bash
# Comprobar conectividad a un puerto específico
nc -zv 192.168.1.1 22             # ¿Está el puerto 22 abierto?
nc -zv 192.168.1.1 20-25          # Rango de puertos
nc -zvw3 host 443                 # Timeout de 3 segundos

# Servidor/cliente TCP simple
nc -l -p 4444                     # Servidor en puerto 4444
nc 192.168.1.1 4444               # Conectar al servidor

# Transferencia de archivo con netcat
nc -l -p 4444 > recibido.txt      # Receptor
nc 192.168.1.1 4444 < archivo.txt # Emisor
```

```bash
# nmap — escáner de red (básico para diagnóstico)
nmap 192.168.1.1                  # Escaneo básico
nmap -sn 192.168.1.0/24           # Ping sweep (host discovery)
nmap -sV 192.168.1.1              # Detectar versiones de servicios
nmap -O 192.168.1.1               # Detectar SO
nmap -p 80,443,8080 192.168.1.1   # Puertos específicos
nmap -p- 192.168.1.1              # Todos los puertos (65535)
```

```bash
# Estadísticas de interfaces
ifstat                             # Ancho de banda por interfaz
iftop -i eth0                      # Monitor de ancho de banda interactivo
nethogs eth0                       # Ancho de banda por proceso
nload eth0                         # Gráfico de ancho de banda
```

```bash
# ARP
ip neigh show                      # Tabla ARP (vecinos conocidos)
arp -a                             # Clásico
arping 192.168.1.1                 # Ping ARP (capa 2)

# Información de conexión WiFi
iwconfig                           # Estado de interfaces WiFi
iwlist wlan0 scan                  # Buscar redes WiFi disponibles
nmcli dev wifi list                # Con NetworkManager
nmcli con show                     # Conexiones activas
```

---

## 10. Túneles y VPN

```bash
# SSH tunneling
# Tunnel local: reenvía el puerto 8080 local al puerto 80 del servidor
ssh -L 8080:localhost:80 user@servidor

# Tunnel remoto: reenvía el 4444 del servidor al 4444 local
ssh -R 4444:localhost:4444 user@servidor

# Dynamic SOCKS proxy (proxy completo)
ssh -D 1080 user@servidor
# Luego configurar el navegador para usar SOCKS5 en 127.0.0.1:1080

# Saltar a través de un host intermedio (jump host)
ssh -J usuario@bastión usuario@destino_interno

# SSH sin terminal (solo túnel)
ssh -N -L 5432:localhost:5432 user@servidor-db
```

```bash
# WireGuard (VPN moderna)
wg show                           # Estado de WireGuard
wg-quick up wg0                   # Activar interfaz wg0
wg-quick down wg0                 # Desactivar
```

---

## 11. Archivos de Configuración Clave

| Archivo | Descripción |
|---|---|
| `/etc/hosts` | Resolución DNS local (consultado antes que DNS) |
| `/etc/resolv.conf` | Servidores DNS y dominio de búsqueda |
| `/etc/nsswitch.conf` | Orden de resolución (files, dns, mdns...) |
| `/etc/network/interfaces` | Configuración de red (Debian/Ubuntu legacy) |
| `/etc/netplan/*.yaml` | Configuración de red moderna (Ubuntu 18+) |
| `/etc/hostname` | Nombre del host |
| `/etc/ssh/sshd_config` | Configuración del servidor SSH |
| `/etc/ssh/ssh_config` | Configuración del cliente SSH |
| `/etc/iptables/rules.v4` | Reglas iptables guardadas |
