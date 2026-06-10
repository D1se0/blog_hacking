# Permisos y Control de Acceso en Linux

El sistema de permisos de Linux es la primera línea de defensa del sistema. Entenderlo en profundidad es fundamental tanto para administración como para pentesting.

---

## 1. El Modelo de Permisos Unix

Linux usa un modelo de permisos de 9 bits (más 3 especiales) organizado en tres grupos:

```
-  r w x  r w x  r w x
│  └─┬─┘  └─┬─┘  └─┬─┘
│   Dueño  Grupo  Otros
└─── tipo de archivo
```

### Tipos de archivo (primer carácter)

| Carácter | Tipo |
|---|---|
| `-` | Archivo regular |
| `d` | Directorio |
| `l` | Enlace simbólico |
| `b` | Dispositivo de bloque (discos) |
| `c` | Dispositivo de carácter (terminal, tty) |
| `p` | Named pipe (FIFO) |
| `s` | Socket |

### Significado de permisos según el tipo de objeto

| Permiso | En archivos | En directorios |
|---|---|---|
| `r` (4) | Leer contenido | Listar contenido (`ls`) |
| `w` (2) | Modificar contenido | Crear/borrar archivos dentro |
| `x` (1) | Ejecutar como programa | Acceder/entrar (`cd`) |

> **Importante**: Para acceder a un archivo dentro de un directorio necesitas `x` en **todos** los directorios del camino, aunque no necesites `r` en ellos.

---

## 2. Notación Octal

Cada grupo de 3 bits se representa con un dígito octal (0–7):

| Octal | Binario | Permisos |
|---|---|---|
| 7 | 111 | rwx |
| 6 | 110 | rw- |
| 5 | 101 | r-x |
| 4 | 100 | r-- |
| 3 | 011 | -wx |
| 2 | 010 | -w- |
| 1 | 001 | --x |
| 0 | 000 | --- |

### Combinaciones más comunes

| Octal | Permisos | Uso típico |
|---|---|---|
| `777` | rwxrwxrwx | Todos los permisos (peligroso) |
| `755` | rwxr-xr-x | Ejecutables, directorios públicos |
| `750` | rwxr-x--- | Solo dueño y grupo pueden leer/ejecutar |
| `700` | rwx------ | Solo el dueño tiene acceso total |
| `644` | rw-r--r-- | Archivos de configuración normales |
| `640` | rw-r----- | Configs con datos sensibles (solo grupo lee) |
| `600` | rw------- | Archivos privados (claves SSH, etc.) |
| `400` | r-------- | Solo lectura, solo el dueño |

---

## 3. chmod — Cambiar Permisos

```bash
chmod [quién][operación][permisos] archivo
chmod modo_octal archivo
```

### Notación simbólica

**Quién**: `u` (dueño/user), `g` (grupo), `o` (otros), `a` (todos)

**Operación**: `+` (añadir), `-` (quitar), `=` (asignar exactamente)

**Permisos**: `r`, `w`, `x`, `X` (ejecutable solo si ya es dir o ejecutable), `s` (SUID/SGID), `t` (sticky)

```bash
chmod u+x script.sh              # Añade ejecución al dueño
chmod g-w archivo.conf           # Quita escritura al grupo
chmod o= archivo_privado         # Elimina todos los permisos a otros
chmod a+r documento.pdf          # Lectura para todos
chmod u=rwx,g=rx,o= binario      # Asignación completa
chmod +x script.sh               # Sin especificar quién: añade ejecución a todos (equivale a a+x)
chmod go-rwx secreto.key         # Quita todo a grupo y otros
chmod u+x,go-x binario           # Combinación en una línea
```

### Notación octal

```bash
chmod 755 /usr/local/bin/app     # rwxr-xr-x
chmod 644 /etc/motd              # rw-r--r--
chmod 600 ~/.ssh/id_rsa          # rw------- (obligatorio para SSH)
chmod 700 ~/.ssh                 # rwx------ (directorio SSH)
chmod 1777 /tmp                  # sticky bit + rwxrwxrwx
chmod 4755 /usr/bin/programa     # SUID + rwxr-xr-x
```

### Recursivo

```bash
chmod -R 755 directorio/         # Aplica a todo el árbol
chmod -R u+rw,go+r directorio/  # Simbólico recursivo
```

> **Cuidado**: `chmod -R 777 directorio` es una mala práctica de seguridad. Mejor usar:
```bash
find directorio -type d -exec chmod 755 {} \;   # Solo directorios
find directorio -type f -exec chmod 644 {} \;   # Solo archivos
```

---

## 4. Permisos Especiales: SUID, SGID y Sticky Bit

Son el cuarto dígito octal (el que va antes de los tres habituales).

### SUID (Set User ID) — Octal `4000`

El archivo se ejecuta con los **privilegios del propietario del archivo**, no del usuario que lo lanza.

```bash
chmod 4755 programa              # Añadir SUID
chmod u+s programa               # Equivalente simbólico
```

Se muestra como `s` en lugar de `x` en el bit de ejecución del dueño:
```
-rwsr-xr-x 1 root root 68208 mar 19 /usr/bin/passwd
```

**Implicaciones de seguridad**: Un binario con SUID de root ejecutado por cualquier usuario tiene privilegios de root. Buscar estos archivos es crítico en pentesting:
```bash
find / -perm -4000 -type f 2>/dev/null    # Todos los binarios SUID
find / -perm -u=s -type f 2>/dev/null     # Equivalente
```

### SGID (Set Group ID) — Octal `2000`

- En **archivos**: se ejecuta con el GID del grupo propietario del archivo
- En **directorios**: los archivos creados dentro heredan el grupo del directorio

```bash
chmod 2755 directorio_compartido    # SGID en directorio
chmod g+s directorio_compartido     # Simbólico
```

Se muestra como `s` en el bit de ejecución del grupo:
```
drwxr-sr-x 2 alice proyecto 4096 jun  9 /compartido
```

```bash
find / -perm -2000 -type f 2>/dev/null    # Binarios con SGID
```

### Sticky Bit — Octal `1000`

En directorios: solo el **propietario del archivo** (o root) puede borrarlo, aunque otros tengan escritura en el directorio.

```bash
chmod 1777 /tmp                  # El uso más común
chmod +t /directorio_compartido  # Simbólico
```

Se muestra como `T` (sin ejecución) o `t` (con ejecución) en el bit de otros:
```
drwxrwxrwt 15 root root 4096 jun  9 /tmp
```

```bash
find / -perm -1000 -type d 2>/dev/null    # Directorios con sticky bit
```

### Combinación de especiales

```bash
chmod 6755 binario               # SUID + SGID (4000+2000=6000)
chmod 7777 peligroso             # Todos los especiales + todos los permisos
```

---

## 5. chown — Cambiar Propietario

```bash
chown usuario archivo
chown usuario:grupo archivo      # Cambia usuario y grupo
chown :grupo archivo             # Solo cambia el grupo
chown -R usuario:grupo dir/      # Recursivo
chown --reference=ref.txt dest.txt  # Copia propietario de un archivo a otro
```

```bash
# Ejemplos prácticos
sudo chown www-data:www-data /var/www/html/   # Webserver
sudo chown -R alice:developers /proyectos/    # Proyecto de equipo
sudo chown root:root /etc/shadow              # Archivo crítico
```

---

## 6. chgrp — Cambiar Grupo

```bash
chgrp grupo archivo
chgrp -R grupo directorio/
chgrp --reference=ref.txt dest.txt
```

---

## 7. umask — Máscara de Permisos por Defecto

La `umask` define los permisos que se **restan** al crear nuevos archivos y directorios.

```bash
umask            # Muestra la máscara actual (ej: 0022)
umask -S         # En formato simbólico (ej: u=rwx,g=rx,o=rx)
umask 027        # Establece máscara para la sesión actual
```

**Cálculo**:
- Archivos nuevos: `666 - umask` (la `x` nunca se da por defecto a archivos)
- Directorios nuevos: `777 - umask`

| umask | Archivos → | Directorios → |
|---|---|---|
| `022` | `644` (rw-r--r--) | `755` (rwxr-xr-x) |
| `027` | `640` (rw-r-----) | `750` (rwxr-x---) |
| `077` | `600` (rw-------) | `700` (rwx------) |
| `002` | `664` (rw-rw-r--) | `775` (rwxrwxr-x) |

**Configuración permanente**: Añadir a `~/.bashrc`, `~/.profile` o `/etc/profile`:
```bash
echo "umask 027" >> ~/.bashrc
```

---

## 8. ACL — Listas de Control de Acceso

Las ACL permiten permisos **más granulares** que el modelo básico usuario/grupo/otros, sin cambiar los permisos Unix tradicionales.

```bash
# Verificar si el sistema tiene ACL habilitadas
mount | grep acl
```

```bash
getfacl archivo              # Ver ACL del archivo
getfacl -R directorio/       # Ver ACL recursivo
```

```bash
# Establecer permisos
setfacl -m u:bob:rwx archivo          # Bob tiene rwx
setfacl -m g:equipo:rx archivo        # El grupo equipo tiene r-x
setfacl -m o::r archivo               # Otros solo lectura

# Permisos por defecto en directorios (heredables)
setfacl -d -m u:bob:rwx directorio/  # Bob tendrá rwx en nuevos archivos
setfacl -d -m g:equipo:rx directorio/ 

# Eliminar entradas ACL
setfacl -x u:bob archivo             # Quita la entrada de bob
setfacl -b archivo                   # Elimina todas las ACL del archivo

# Copiar ACL de un archivo a otro
getfacl archivo_orig | setfacl --set-file=- archivo_dest

# Aplicar recursivamente
setfacl -R -m u:bob:rx directorio/
```

Un archivo con ACL muestra un `+` al final de los permisos en `ls -l`:
```
-rw-rwxr--+ 1 alice equipo 1024 jun  9 archivo.conf
```

---

## 9. Atributos Extendidos (chattr / lsattr)

Los atributos extendidos del sistema de archivos ext2/3/4 van más allá de los permisos Unix.

```bash
lsattr archivo              # Ver atributos
lsattr -R directorio/       # Recursivo
```

```bash
chattr +i archivo           # Inmutable: nadie puede modificar ni borrar (ni root)
chattr -i archivo           # Quitar inmutabilidad
chattr +a archivo           # Append only: solo añadir (útil para logs)
chattr +d archivo           # No incluir en dump de backup
chattr +s archivo           # Borrar de forma segura (ceros al eliminar)
```

> **Útil en seguridad**: `chattr +i /etc/passwd` previene modificaciones no autorizadas incluso por root comprometido.

```bash
# Ver si hay archivos inmutables (pentesting/forense)
find / -xdev \( -perm -4000 -o -perm -2000 \) 2>/dev/null
lsattr /etc/passwd /etc/shadow /etc/hosts
```

---

## 10. Capability del Sistema (Capacidades Linux)

Las capacidades permiten dar **privilegios específicos de root** a binarios sin darles SUID completo.

```bash
getcap /usr/bin/ping         # Ver capacidades de un binario
getcap -r / 2>/dev/null      # Buscar todos los binarios con capacidades (pentesting)

setcap cap_net_raw+ep /usr/bin/ping  # Dar cap_net_raw a ping
setcap -r /ruta/binario              # Eliminar todas las capacidades
```

**Capacidades comunes en binarios mal configurados (escalada de privilegios)**:

| Capacidad | Qué permite |
|---|---|
| `cap_setuid` | Cambiar UID (permite escalar a root) |
| `cap_net_raw` | Sockets raw (sniffing) |
| `cap_net_bind_service` | Bind en puertos <1024 sin root |
| `cap_sys_admin` | Muchas operaciones administrativas |
| `cap_chown` | Cambiar propietario de archivos |

---

## 11. Casos Prácticos de Seguridad

### Hardening básico de permisos

```bash
# Archivos de configuración sensibles
chmod 600 /etc/shadow
chmod 600 /etc/gshadow
chmod 644 /etc/passwd
chmod 644 /etc/group
chmod 440 /etc/sudoers
chmod 700 /root

# Claves SSH
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/config
```

### Buscar archivos peligrosos (pentesting)

```bash
# SUID en todo el sistema
find / -perm -u=s -type f 2>/dev/null

# SGID en todo el sistema
find / -perm -g=s -type f 2>/dev/null

# Archivos escribibles por todos (world-writable)
find / -perm -o+w -type f 2>/dev/null
find / -perm -002 -type f 2>/dev/null

# Archivos sin dueño
find / -nouser 2>/dev/null
find / -nogroup 2>/dev/null

# Directorios escribibles por el usuario actual
find / -writable -type d 2>/dev/null

# Binarios con capacidades
getcap -r / 2>/dev/null
```
