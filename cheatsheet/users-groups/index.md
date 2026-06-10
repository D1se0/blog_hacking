# Usuarios y Grupos en Linux

Administración completa de cuentas, grupos, contraseñas y políticas de acceso. Sección esencial para administración de sistemas y análisis de seguridad.

---

## 1. Archivos del Sistema de Usuarios

Antes de gestionar usuarios, hay que entender los archivos que los definen:

### `/etc/passwd` — Cuentas de usuario

```
alice:x:1001:1001:Alice García,,,:/home/alice:/bin/bash
│     │ │    │    └─────────────── GECOS (info personal: nombre, teléfono...)
│     │ │    └──────────────────── GID (grupo primario)
│     │ └───────────────────────── UID (identificador único del usuario)
│     └─────────────────────────── Contraseña (x = en /etc/shadow)
└───────────────────────────────── Nombre de usuario (login name)

/home/alice                        # Directorio HOME
/bin/bash                          # Shell de inicio (o /sbin/nologin para daemons)
```

**UIDs reservados**:
- `0`: root
- `1–99`: cuentas del sistema (reservadas)
- `100–999`: cuentas de sistema creadas por paquetes/daemons
- `1000+`: usuarios humanos normales

### `/etc/shadow` — Contraseñas cifradas

```
alice:$6$rounds=5000$salt$hash...:19900:0:99999:7:::
│     │                           │     │ │     │
│     └─── Hash de la contraseña  │     │ │     └── Días de inactividad antes de deshabilitar
│          $6$ = SHA-512          │     │ └──────── Máximo días entre cambios de contraseña
│          $5$ = SHA-256          │     └────────── Mínimo días entre cambios de contraseña
│          $1$ = MD5 (INSEGURO)   └──────────────── Días desde 01/01/1970 del último cambio
└─────────────────────────────────── Nombre de usuario
```

### `/etc/group` — Definición de grupos

```
developers:x:1005:alice,bob,carol
│          │ │    └───────────────── Miembros secundarios (separados por coma)
│          │ └──────────────────── GID del grupo
│          └────────────────────── Contraseña (x = en /etc/gshadow, raramente usada)
└───────────────────────────────── Nombre del grupo
```

### `/etc/gshadow` — Contraseñas de grupos

```
developers:$6$hash...:alice:bob,carol
│          │          │     └───────── Miembros del grupo
│          │          └─────────────── Administradores del grupo
│          └────────────────────────── Contraseña hasheada del grupo
└───────────────────────────────────── Nombre del grupo
```

### `/etc/skel` — Plantilla para nuevos usuarios

Contiene los archivos que se copian al crear un nuevo usuario:
```bash
ls -la /etc/skel
# .bash_logout, .bashrc, .profile
# Añade aquí tus configuraciones por defecto
```

---

## 2. Información de Usuarios

```bash
# Identificación del usuario actual
whoami                           # Solo el nombre
id                               # UID, GID y todos los grupos
id alice                         # Información de otro usuario
id -u                            # Solo el UID
id -g                            # Solo el GID primario
id -G                            # Todos los GIDs (grupos)
id -un                           # Solo el nombre del usuario (útil en scripts)
id -gn                           # Nombre del grupo primario

# Usuarios conectados
who                              # Usuarios conectados, terminal, hora de login
who -H                           # Con encabezados
who -a                           # Información completa
w                                # Como who pero con comando actual y carga del sistema
last                             # Historial de logins (lee /var/log/wtmp)
last alice                       # Historial de logins de alice
last reboot                      # Historial de reinicios
lastb                            # Intentos fallidos de login (lee /var/log/btmp)
lastlog                          # Último login de cada usuario del sistema
lastlog -u alice                 # Solo para alice

# Grupos
groups                           # Grupos del usuario actual
groups alice                     # Grupos de alice
```

---

## 3. Gestión de Cuentas de Usuario

### Crear usuarios

```bash
# adduser — script interactivo amigable (Debian/Ubuntu)
sudo adduser alice
sudo adduser --home /opt/alice alice        # HOME personalizado
sudo adduser --shell /bin/zsh alice        # Shell personalizada
sudo adduser --no-create-home alice        # Sin crear directorio home
sudo adduser --system --no-create-home svc # Usuario de sistema (daemon)
sudo adduser --ingroup developers alice    # Grupo primario específico

# useradd — comando de bajo nivel (portátil, para scripts)
sudo useradd alice                          # Sin home, sin contraseña, sin shell interactiva
sudo useradd -m alice                       # Con creación de home
sudo useradd -m -s /bin/bash alice          # Con home y shell bash
sudo useradd -m -s /bin/bash -G sudo,developers alice  # Con grupos secundarios
sudo useradd -u 1500 alice                  # UID específico
sudo useradd -d /custom/home alice          # HOME específico
sudo useradd -e 2025-12-31 alice           # Fecha de expiración de cuenta
sudo useradd -r svc_nginx                   # Usuario de sistema (UID en rango de sistema)

# Ver configuración por defecto de useradd
sudo useradd -D
# Cambiar la configuración por defecto
sudo useradd -D -s /bin/bash               # Shell por defecto
sudo useradd -D -b /home                   # Base de directorio home por defecto
```

### Modificar usuarios

```bash
sudo usermod opciones usuario

# Cambiar shell
sudo usermod -s /bin/zsh alice
sudo usermod -s /sbin/nologin alice        # Deshabilitar shell interactiva

# Cambiar HOME
sudo usermod -d /nuevo/home alice          # Cambia la ruta
sudo usermod -d /nuevo/home -m alice       # Cambia y mueve el contenido

# Gestión de grupos
sudo usermod -g developers alice           # Cambiar grupo primario
sudo usermod -G sudo,docker alice          # Reemplazar grupos secundarios
sudo usermod -aG docker alice              # AÑADIR al grupo (sin quitar otros)
sudo usermod -aG sudo alice               # Añadir alice a sudo

# Expiración y bloqueo
sudo usermod -e 2025-12-31 alice          # Fecha expiración (YYYY-MM-DD)
sudo usermod -e "" alice                   # Eliminar fecha de expiración
sudo usermod -L alice                      # Bloquear cuenta (añade ! en /etc/shadow)
sudo usermod -U alice                      # Desbloquear cuenta
sudo usermod -e 1 alice                    # Expirar cuenta inmediatamente (bloqueo efectivo)

# Renombrar
sudo usermod -l nuevo_nombre alice         # Cambia el login name (no el home)

# Cambiar UID
sudo usermod -u 1500 alice                 # Cambia el UID (y actualiza propiedad de archivos en home)
```

### Eliminar usuarios

```bash
sudo userdel alice                         # Eliminar solo la cuenta
sudo userdel -r alice                      # Eliminar cuenta + home + mailbox
sudo deluser alice                         # Debian/Ubuntu: interactivo
sudo deluser --remove-home alice           # Con home
sudo deluser --remove-all-files alice      # Elimina todos los archivos del usuario en el sistema
sudo deluser alice developers              # Quitar alice del grupo developers (no borra la cuenta)
```

---

## 4. Contraseñas

```bash
# Cambiar contraseña
passwd                                     # Cambiar la propia
sudo passwd alice                          # Cambiar la de alice (root)
sudo passwd -l alice                       # Lock: bloquear cuenta
sudo passwd -u alice                       # Unlock: desbloquear
sudo passwd -d alice                       # Eliminar contraseña (login sin contraseña)
sudo passwd -e alice                       # Expirar: forzar cambio en el próximo login
sudo passwd -S alice                       # Estado de la contraseña

# chage — políticas de caducidad de contraseñas
chage alice                                # Interfaz interactiva
chage -l alice                             # Listar política actual
sudo chage -M 90 alice                     # Máximo 90 días antes de expirar
sudo chage -m 7 alice                      # Mínimo 7 días entre cambios
sudo chage -W 14 alice                     # Aviso 14 días antes de expirar
sudo chage -I 30 alice                     # Inactivar cuenta 30 días después de expirar contraseña
sudo chage -E 2025-12-31 alice             # Expiración de cuenta (no de contraseña)
sudo chage -E -1 alice                     # Sin expiración
sudo chage -d 0 alice                      # Forzar cambio de contraseña en próximo login
sudo chage -d -1 alice                     # Equivalente: fecha de último cambio = "nunca"

# Ejemplo de política estricta
sudo chage -m 1 -M 60 -W 7 -I 14 alice
```

---

## 5. Gestión de Grupos

```bash
# Crear grupo
sudo groupadd devops
sudo groupadd -g 2000 devops              # GID específico
sudo groupadd -r svc_grupo                # Grupo de sistema

# Modificar grupo
sudo groupmod -n nuevo_nombre devops      # Renombrar
sudo groupmod -g 2001 devops              # Cambiar GID

# Eliminar grupo
sudo groupdel devops
# No se puede borrar si es el grupo primario de algún usuario

# gpasswd — administrar miembros de grupos
sudo gpasswd -a alice devops              # Añadir alice a devops
sudo gpasswd -d alice devops              # Quitar alice de devops
sudo gpasswd -A alice devops              # Hacer a alice administradora del grupo
sudo gpasswd -M alice,bob,carol devops    # Establecer lista completa de miembros
sudo gpasswd devops                       # Establecer contraseña del grupo

# Cambiar al grupo durante la sesión
newgrp devops                             # Abre nueva shell con el GID de devops
sg devops -c "comando"                    # Ejecutar un comando con el GID de devops
```

---

## 6. sudo — Privilegios Elevados

```bash
# Usar sudo
sudo comando                              # Ejecutar como root
sudo -u alice comando                     # Ejecutar como alice
sudo -i                                   # Shell root interactiva (login shell)
sudo -s                                   # Shell root sin login
sudo -l                                   # Ver qué puede hacer el usuario con sudo
sudo -l -U alice                          # Ver los permisos sudo de alice
sudo !!                                   # Repetir el último comando con sudo
sudo -v                                   # Renovar el ticket de sudo sin ejecutar nada

# Configuración de sudoers
sudo visudo                               # SIEMPRE usar visudo para editar (valida sintaxis)
# Archivo: /etc/sudoers

# Ejemplos de líneas en /etc/sudoers:
# alice ALL=(ALL:ALL) ALL              -- alice puede ejecutar todo como cualquier usuario
# alice ALL=(root) NOPASSWD: /bin/systemctl restart nginx  -- sin contraseña, solo ese comando
# %sudo ALL=(ALL:ALL) ALL             -- El grupo sudo puede hacer todo
# %developers ALL=(ALL) /usr/bin/git  -- El grupo developers puede ejecutar git como cualquier usuario
# alice ALL=(ALL) NOPASSWD: ALL       -- Sin contraseña para todo (INSEGURO)

# Archivos en /etc/sudoers.d/ (mejor práctica)
sudo visudo -f /etc/sudoers.d/alice
# Cada archivo tiene una línea/regla para mayor granularidad
```

---

## 7. PAM — Pluggable Authentication Modules

PAM es el sistema de autenticación modular de Linux. Su configuración está en `/etc/pam.d/`.

```bash
ls /etc/pam.d/                            # Ver archivos de configuración PAM
cat /etc/pam.d/sshd                       # Configuración PAM para SSH
cat /etc/pam.d/login                      # Para logins locales
cat /etc/pam.d/common-auth               # Módulos de autenticación compartidos
cat /etc/pam.d/common-password           # Políticas de contraseña
```

### Políticas de contraseña con pam_pwquality

```bash
# /etc/pam.d/common-password
password requisite pam_pwquality.so retry=3

# /etc/security/pwquality.conf
minlen = 12         # Longitud mínima
dcredit = -1        # Al menos 1 dígito
ucredit = -1        # Al menos 1 mayúscula
lcredit = -1        # Al menos 1 minúscula
ocredit = -1        # Al menos 1 carácter especial
maxrepeat = 3       # No más de 3 caracteres repetidos consecutivos
gecoscheck = 1      # Rechazar si contiene el nombre del usuario
```

---

## 8. Análisis de Seguridad y Pentesting

```bash
# Encontrar usuarios con UID 0 (todos son root)
awk -F: '($3 == 0)' /etc/passwd

# Usuarios con shell válida (login permitido)
grep -v '/sbin/nologin\|/bin/false\|/usr/sbin/nologin' /etc/passwd

# Usuarios sin contraseña o con contraseña débil
sudo awk -F: '($2 == "" || $2 == "!")' /etc/shadow   # Sin hash o cuenta bloqueada
sudo awk -F: '($2 != "x" && $2 != "*" && $2 != "!")' /etc/passwd  # Contraseña en passwd (¡antiguo!)

# Historial de accesos
cat /var/log/auth.log | grep "Accepted password"     # Logins exitosos
cat /var/log/auth.log | grep "Failed password"        # Intentos fallidos
grep "sudo:" /var/log/auth.log | grep "COMMAND"       # Comandos ejecutados con sudo
last -a                                               # Logins con hostname
lastb 2>/dev/null                                     # Intentos fallidos (requiere permisos)

# Archivos con SUID — escalada de privilegios
find / -user root -perm -4000 -type f 2>/dev/null
find / -user root -perm /4000 -type f 2>/dev/null     # Equivalente

# Archivos pertenecientes a un usuario
find / -user alice 2>/dev/null
find / -uid 1001 2>/dev/null

# Sudo sin contraseña (jugoso para escalada)
sudo -l 2>/dev/null | grep NOPASSWD

# Grupos con privilegios especiales
cat /etc/group | grep -E "sudo|wheel|admin|docker|lxd"
# docker y lxd pueden usarse para escapar a root

# Ver quién puede hacer sudo
grep -v "^#" /etc/sudoers 2>/dev/null
grep -v "^#" /etc/sudoers.d/* 2>/dev/null

# Cuentas con contraseña expirada pero sin bloqueo
sudo chage -l $(awk -F: '{print $1}' /etc/passwd) 2>/dev/null | grep -A1 "Password expires"

# Usuarios recién creados
sort -t: -k3 -n /etc/passwd | tail            # Los últimos UID asignados
```

---

## 9. Referencia Rápida de Comandos

| Acción | Comando (Debian/Ubuntu) |
|---|---|
| Crear usuario interactivo | `sudo adduser alice` |
| Crear usuario (script) | `sudo useradd -m -s /bin/bash alice` |
| Eliminar usuario | `sudo deluser --remove-home alice` |
| Cambiar contraseña | `sudo passwd alice` |
| Bloquear cuenta | `sudo passwd -l alice` |
| Desbloquear cuenta | `sudo passwd -u alice` |
| Añadir al grupo sudo | `sudo usermod -aG sudo alice` |
| Crear grupo | `sudo groupadd devops` |
| Ver grupos de usuario | `groups alice` o `id alice` |
| Ver todos los usuarios | `awk -F: '{print $1}' /etc/passwd` |
| Ver política de contraseña | `chage -l alice` |
| Forzar cambio contraseña | `sudo chage -d 0 alice` |
| Ver quién está conectado | `w` o `who` |
| Historial de logins | `last` |
| Permisos sudo del usuario | `sudo -l` |
| Editar sudoers | `sudo visudo` |
