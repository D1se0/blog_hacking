# Usuarios y Grupos

## Administración de cuentas de usuario, contraseñas y grupos en el sistema.

### Información de Usuarios

```bash
id [usuario]
```

Muestra el UID, GID y los grupos del usuario actual o del especificado.

```bash
who
```

Muestra los usuarios conectados, sus terminales y la hora de login.

`-H`: Imprime encabezados de columnas.

`-w`: Indica si el usuario puede recibir mensajes (`+/-`).

`-i`: Muestra el tiempo de inactividad (idle time).

`-q`: Muestra solo los nombres y el total de usuarios conectados.

```bash
last
```

Muestra un listado de los últimos usuarios que han iniciado sesión.

### Gestión de Cuentas

```bash
sudo adduser <usuario>
```

Crea un nuevo usuario de forma interactiva (pide contraseña y datos).

`--home /dir`: Especifica un directorio HOME diferente (el directorio debe existir).

```bash
sudo useradd <usuario>
```

Comando de bajo nivel para añadir usuarios (no crea home ni pide pass por defecto).

```bash
sudo useradd -D
```

Muestra la configuración predeterminada para la creación de usuarios.

```bash
sudo userdel -r <usuario>
```

Borra un usuario junto con su directorio personal y buzón de correo.

```bash
sudo usermod [opciones] <usuario>
```

Modifica una cuenta de usuario.

`-s /bin/bash`: Establece la shell del usuario.

`-G grupo1,grupo2`: Establece o añade grupos secundarios.

`-aG grupo`: Añade el usuario a un grupo sin quitarlo de los actuales.

`-e AAAA-MM-DD`: Establece la fecha de expiración de la cuenta.

`-L`: Bloquea la cuenta del usuario.

`-U`: Desbloquea la cuenta.

### Gestión de Grupos

```bash
sudo groupadd <grupo>
```

Crea un nuevo grupo en el sistema.

```bash
sudo groupdel <grupo>
```

Elimina un grupo existente.

```bash
sudo groupmod -n <nuevo_nombre> <nombre_actual>
```

Cambia el nombre de un grupo.

```bash
sudo gpasswd [opciones] <grupo>
```

Administra grupos y sus contraseñas.

`-A <usuario>`: Define al usuario como administrador del grupo.

`-a <usuario>`: Añade un usuario al grupo.

`-d <usuario>`: Elimina un usuario del grupo.

Sin opciones: Permite cambiar la contraseña del grupo.

```bash
newgrp <grupo>
```

Inicia una nueva shell cambiando el GID (ID de grupo) actual del usuario a un grupo al que ya pertenezca.

### Archivos de Configuración Críticos

`/etc/passwd`: Información de cuentas de usuario (nombre, UID, GID, home, shell).

`/etc/shadow`: Contraseñas cifradas de usuarios y políticas de expiración.

`/etc/group`: Información de definición de grupos.

`/etc/gshadow`: Contraseñas cifradas de grupos.

`/etc/skel`: Directorio que contiene archivos base (.bashrc, .profile) que se copian al crear un nuevo usuario.
