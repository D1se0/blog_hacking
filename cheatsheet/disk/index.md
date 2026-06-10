# Gestión de Discos y Sistema de Archivos

Particionado, formateo, montaje, monitorización de espacio y mantenimiento de sistemas de archivos.

---

## 1. Información de Discos y Particiones

```bash
lsblk                            # Lista de discos y particiones en árbol
lsblk -f                         # Con sistemas de archivos y UUIDs
lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINT,UUID  # Columnas personalizadas
lsblk -d                         # Solo discos (sin particiones)

fdisk -l                         # Lista de discos y particiones (requiere root)
fdisk -l /dev/sda                # Solo el disco sda

parted -l                        # Lista con más info (GPT, MBR, tamaños)

cat /proc/partitions             # Particiones reconocidas por el kernel
cat /proc/diskstats              # Estadísticas de I/O por disco
```

---

## 2. Espacio en Disco

```bash
df -h                            # Espacio libre en todos los FS montados (legible)
df -H                            # Con potencias de 1000 (no 1024)
df -T                            # Con tipo de sistema de archivos
df -i                            # Inodos disponibles
df -h /var                       # Solo la partición de /var
df --output=source,size,used,avail,pcent,target  # Columnas personalizadas

# Uso de espacio en directorios
du -sh directorio/               # Tamaño total del directorio
du -sh *                         # Tamaño de cada elemento del dir actual
du -ah directorio/ | sort -rh | head -20  # Top 20 más grandes
du -h --max-depth=1 /            # Solo primer nivel de profundidad
du -h --max-depth=2 /var | sort -rh  # Dos niveles, ordenado

# Encontrar los archivos más grandes del sistema
find / -type f -printf "%s\t%p\n" 2>/dev/null | sort -rn | head -20
find / -type f -size +100M 2>/dev/null

# Monitorizar uso en tiempo real
watch -n5 df -h                  # Actualizar cada 5 segundos
iostat -x 2                      # Estadísticas de I/O extendidas cada 2s
iotop                            # Monitor de I/O por proceso (requiere root)
```

---

## 3. Montaje y Desmontaje

```bash
# Montar
mount /dev/sdb1 /mnt/datos       # Montar partición en punto de montaje
mount -t ext4 /dev/sdb1 /mnt/    # Especificar tipo de FS
mount -t ntfs-3g /dev/sdb1 /mnt/ # Montar NTFS (requiere ntfs-3g)
mount -o ro /dev/sdb1 /mnt/      # Solo lectura
mount -o remount,rw /            # Remontar con escritura (rescate)
mount -o loop imagen.iso /mnt/   # Montar imagen ISO
mount UUID="xxxx-xxxx" /mnt/     # Montar por UUID (más fiable que /dev/sdX)
mount LABEL="datos" /mnt/        # Montar por etiqueta

# Ver qué está montado
mount                            # Todo lo montado
mount | column -t                # Formateado como tabla
findmnt                          # Vista en árbol de montajes
findmnt /home                    # Info de un punto de montaje específico
cat /proc/mounts                 # Montajes actuales (del kernel)

# Desmontar
umount /mnt/datos                # Desmontar por punto de montaje
umount /dev/sdb1                 # Desmontar por dispositivo
umount -l /mnt/datos             # Lazy unmount (cuando termine de usarse)
umount -f /mnt/nfs               # Forzar (para NFS colgados)

# Si el sistema de archivos está ocupado
fuser -m /mnt/datos              # Ver qué procesos usan el FS
fuser -km /mnt/datos             # Matar procesos y desmontar
lsof /mnt/datos                  # Ver archivos abiertos en el FS
```

### /etc/fstab — Montajes permanentes

```bash
# Formato: dispositivo  punto_montaje  tipo  opciones  dump  pass
UUID=abc123  /home        ext4    defaults      0  2
UUID=def456  /boot        ext4    defaults      0  1
UUID=ghi789  /            ext4    errors=remount-ro  0  1
UUID=jkl012  swap         swap    sw            0  0
//server/share  /mnt/red  cifs    credentials=/etc/.smbcreds,uid=1000  0  0

# Opciones comunes:
# defaults     = rw,suid,dev,exec,auto,nouser,async
# ro           = solo lectura
# rw           = lectura/escritura
# noexec       = no ejecutar binarios (seguridad)
# nosuid       = ignorar bits SUID/SGID (seguridad)
# nodev        = ignorar dispositivos especiales
# noatime      = no actualizar atime (mejora rendimiento)
# nofail       = no fallar el arranque si el dispositivo no existe
# _netdev      = esperar a la red (para NFS, CIFS)

# Probar fstab sin reiniciar
sudo mount -a                    # Montar todo lo que esté en fstab y no montado
sudo mount -av                   # Con verbose

# Obtener UUID
blkid /dev/sdb1                  # UUID y tipo del FS
blkid                            # Todos los dispositivos
lsblk -o NAME,UUID,FSTYPE
```

---

## 4. Particionado

### fdisk (MBR — discos <2TB)

```bash
sudo fdisk /dev/sdb              # Abrir fdisk en el disco sdb

# Comandos dentro de fdisk:
# p → imprimir tabla de particiones
# n → nueva partición (primaria o extendida)
# d → eliminar partición
# t → cambiar tipo de partición (83=Linux, 82=swap, 8e=LVM, fd=RAID)
# l → listar tipos disponibles
# a → marcar como bootable
# w → escribir cambios y salir (APLICA LOS CAMBIOS)
# q → salir sin guardar
```

### gdisk / parted (GPT — discos >2TB o UEFI)

```bash
sudo gdisk /dev/sdb              # GPT partition table
sudo parted /dev/sdb             # Interactivo

# parted en línea de comandos:
sudo parted /dev/sdb mklabel gpt                # Nueva tabla GPT
sudo parted /dev/sdb mkpart primary ext4 1MiB 50GiB  # Crear partición
sudo parted /dev/sdb print                      # Ver tabla
sudo parted /dev/sdb rm 1                       # Eliminar partición 1
sudo parted /dev/sdb name 1 "datos"            # Nombrar partición
```

---

## 5. Formateo (Creación de Sistemas de Archivos)

```bash
# ext4 (el más común en Linux)
sudo mkfs.ext4 /dev/sdb1
sudo mkfs.ext4 -L "datos" /dev/sdb1             # Con etiqueta
sudo mkfs.ext4 -m 1 /dev/sdb1                   # 1% de espacio reservado (por defecto 5%)
sudo mkfs.ext4 -b 4096 /dev/sdb1                # Tamaño de bloque 4096 bytes

# xfs (alto rendimiento, no tiene fsck)
sudo mkfs.xfs /dev/sdb1
sudo mkfs.xfs -L "datos" /dev/sdb1

# btrfs (moderno: snapshots, RAID, compresión)
sudo mkfs.btrfs /dev/sdb1
sudo mkfs.btrfs -L "datos" /dev/sdb1

# fat32 (compatible con Windows)
sudo mkfs.vfat -F 32 /dev/sdb1

# ntfs (para discos Windows)
sudo mkfs.ntfs /dev/sdb1

# Swap
sudo mkswap /dev/sdb2
sudo swapon /dev/sdb2            # Activar swap
sudo swapoff /dev/sdb2           # Desactivar swap
swapon --show                    # Ver swap activa
```

---

## 6. Mantenimiento del Sistema de Archivos

```bash
# fsck — verificar y reparar (SOLO con FS desmontado)
sudo fsck /dev/sdb1              # Verificación interactiva
sudo fsck -y /dev/sdb1           # Reparar automáticamente todo
sudo fsck -n /dev/sdb1           # Solo comprobar, no reparar
sudo fsck -a /dev/sdb1           # Reparar sin preguntar (menos seguro que -y)
sudo e2fsck -f /dev/sdb1         # Para ext2/3/4 (más control)

# Tune2fs — ajustar parámetros de ext4
sudo tune2fs -l /dev/sda1        # Mostrar propiedades del FS
sudo tune2fs -L "nueva-etiqueta" /dev/sda1  # Cambiar etiqueta
sudo tune2fs -m 2 /dev/sda1      # Cambiar % de espacio reservado
sudo tune2fs -c 50 /dev/sda1     # Fsck cada 50 montajes

# Etiquetas
sudo e2label /dev/sdb1 "datos"   # Cambiar etiqueta ext4
sudo xfs_admin -L "datos" /dev/sdb1  # Cambiar etiqueta xfs
blkid /dev/sdb1                  # Ver etiqueta actual

# Defragmentación
sudo e4defrag /dev/sda1          # Desfragmentar ext4 (generalmente innecesario)
sudo xfs_fsr /dev/sdb1           # Desfragmentar xfs

# Verificar errores sin desmontar (ext4)
sudo e2fsck -C 0 /dev/sda1       # Forzar verificación en siguiente reinicio
sudo tune2fs -C 1 /dev/sda1      # Marcar como si se montara por primera vez
```

---

## 7. LVM — Logical Volume Manager

```bash
# PV (Physical Volumes)
sudo pvcreate /dev/sdb /dev/sdc  # Crear PVs
pvdisplay                        # Ver PVs
pvs                              # Resumen de PVs

# VG (Volume Groups)
sudo vgcreate datos /dev/sdb /dev/sdc  # Crear VG "datos"
vgdisplay                        # Ver VGs
vgs                              # Resumen
sudo vgextend datos /dev/sdd     # Añadir disco al VG

# LV (Logical Volumes)
sudo lvcreate -L 50G -n home datos          # Crear LV de 50G
sudo lvcreate -l 100%FREE -n home datos     # Usar todo el espacio libre
lvdisplay                        # Ver LVs
lvs                              # Resumen

# Extender LV y FS (sin desmontar en ext4)
sudo lvextend -L +20G /dev/datos/home       # Añadir 20G
sudo lvextend -l +100%FREE /dev/datos/home  # Usar todo el espacio libre del VG
sudo resize2fs /dev/datos/home              # Extender el FS ext4
sudo xfs_growfs /home                       # Extender el FS xfs (montado)

# Snapshots LVM
sudo lvcreate -s -n snap_home -L 5G /dev/datos/home  # Crear snapshot de 5G
sudo lvremove /dev/datos/snap_home                    # Eliminar snapshot
sudo lvconvert --merge /dev/datos/snap_home           # Revertir al snapshot
```

---

## 8. SMART — Salud del Disco

```bash
sudo smartctl -a /dev/sda        # Información SMART completa
sudo smartctl -H /dev/sda        # Solo estado de salud (PASSED/FAILED)
sudo smartctl -t short /dev/sda  # Ejecutar test corto (~2 minutos)
sudo smartctl -t long /dev/sda   # Test largo (~horas)
sudo smartctl -l selftest /dev/sda  # Ver resultados de tests

# smartd — demonio para monitorización continua
sudo systemctl enable --now smartd
cat /etc/smartd.conf             # Configuración
```
