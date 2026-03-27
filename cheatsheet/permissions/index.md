# Permisos y Propiedades

## Linux gestiona permisos para el Dueño (u), el Grupo (g) y Otros (o).

### Modificación de Permisos (chmod)

Notación Simbólica

Usuarios: `u` (dueño), `g` (grupo), `o` (otros), `a` (todos).

Operaciones: `+` (añadir), `-` (quitar), `=` (asignar exactamente).

Permisos: `r` (lectura), `w` (escritura), `x` (ejecución).

Ejemplo: `chmod u+x archivo` (da ejecución al dueño).

Notación Octal

7 (rwx), 6 (rw-), 5 (r-x), 4 (r--), 3 (-wx), 2 (-w-), 1 (--x), 0 (---).

Ejemplos comunes:

`755`: rwxr-xr-x (Dueño todo, resto leer y ejecutar).

`644`: rw-r--r-- (Dueño leer/escribir, resto solo leer).

`700`: rwx------ (Solo acceso para el dueño).

### Permisos Especiales

SUID (Set User ID - `4000`): El archivo se ejecuta con los privilegios del dueño del archivo, no del que lo lanza.

SGID (Set Group ID - `2000`): El archivo se ejecuta con privilegios del grupo. En directorios, los archivos nuevos heredan el grupo del directorio padre.

Sticky Bit (1000): En directorios, solo el dueño del archivo (o root) puede borrarlo, evitando que usuarios con permiso de escritura en la carpeta borren archivos de otros (ej. `/tmp`).

Máscara de Permisos (`umask`)

Define los permisos que NO se darán por defecto al crear nuevos archivos y directorios.

`umask`: Muestra la máscara actual en formato numérico.

`umask -S`: Muestra la máscara en formato simbólico.

Cálculo: Directorios (`777` - umask), Archivos (`666` - umask).

Ejemplo: `umask 022` genera permisos `755` para directorios y `644` para archivos.

### Propiedad de Archivos

```bash
sudo chown <usuario>:<grupo> <archivo>
```

Cambia el dueño y el grupo de un archivo o directorio.

`-R`: Aplica los cambios de forma recursiva en todos los subdirectorios y archivos.

```bash
sudo chgrp <grupo> <archivo>
```

Cambia únicamente el grupo de un archivo.
