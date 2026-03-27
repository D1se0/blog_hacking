# Gestión de Discos y Sistemas de Archivos

## Comandos para particionar, formatear y montar dispositivos.

```bash
sudo fdisk -l
```

Muestra las tablas de particiones de todos los discos conectados.

```bash
sudo lsblk
```

Muestra una lista de todos los dispositivos de bloque (discos y particiones) en formato de árbol.

```bash
sudo fdisk /dev/sdb
```

Entra en el modo interactivo para crear, borrar o modificar particiones en el disco sdb.

Secuencia común: `n` (nueva), `p` (primaria), `w` (escribir cambios y salir).

```bash
sudo partprobe
```

Informa al sistema operativo de los cambios en la tabla de particiones sin necesidad de reiniciar.

```bash
sudo mkfs -t ext4 /dev/sdb1
```

Formatea una partición con el sistema de archivos especificado (ej. ext4, vfat, ntfs).

```bash
df -T
```

Muestra el espacio en disco usado y disponible, incluyendo el tipo de sistema de archivos de las particiones montadas.

`-h`: Muestra los tamaños en formato legible (GB, MB).

```bash
du -h <directorio>
```

Estima el uso de espacio en disco de los archivos y directorios.

`-s`: Muestra solo el total del directorio sin detallar cada subcarpeta.

`-c`: Proporciona un gran total al final de la lista.

`-a`: Muestra el tamaño de todos los archivos, no solo directorios.

```bash
sudo mount -t <tipo> <dispositivo> <punto_montaje>
```

Monta un sistema de archivos en una ruta específica.

Tipos: ext4, vfat (FAT32), ntfs, iso9660 (CD), auto.

```bash
sudo umount /dev/sdb1
```

Desmonta un dispositivo o partición del sistema.
