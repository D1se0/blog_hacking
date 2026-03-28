# Información del Sistema y Utilidades Básicas

Comandos para identificar el hardware y el entorno (Equivalente a fuentes).

`hostname`: Muestra el nombre del equipo (Igual que en Linux).

`systeminfo`: Genera un informe detallado de la versión de Windows, BIOS, parches (Hotfixes), memoria y red.

`wmic cpu get name, numberofcores, maxclockspeed`: Información detallada de la CPU (Equivalente a lscpu).

`wmic computersystem get totalphysicalmemory`: Muestra la RAM total en bytes (Equivalente a free).

`date /t` y `time /t`: Muestran la fecha y hora actual (Equivalente a date).

`cls`: Limpia la pantalla de la terminal (Equivalente a clear).

`ver`: Muestra la versión del kernel de Windows (Equivalente a uname `-r`).

---

## Gestión de Paquetes (Winget)

Administración de software mediante el Administrador de Paquetes de Windows (Equivalente a APT en fuentes).

`winget search [nombre]`: Busca aplicaciones en el repositorio (Equivalente a apt-cache search).

`winget install [nombre]`: Instala una aplicación (Equivalente a apt install).

`winget list`: Muestra todas las aplicaciones instaladas y si tienen actualizaciones.

`winget upgrade --all`: Actualiza todos los programas a la última versión (Equivalente a apt upgrade).

`winget uninstall [nombre]`: Elimina un programa (Equivalente a apt remove).

---

## Gestión de Archivos y Directorios

Navegación y manipulación del sistema de archivos (Equivalente a fuentes).
Navegación y Listado

`cd`: Muestra el directorio actual (Equivalente a `pwd`).

`cd /d [ruta]`: Cambia de directorio y de unidad (Ej: de `C:` a `D:`).

`dir`: Lista archivos y carpetas (Equivalente a `ls`).

`dir /a` : Incluye archivos ocultos (Equivalente a `ls -a`).

`dir /s` : Lista de forma recursiva (Equivalente a `ls -R`).

`dir /o:s` : Ordena por tamaño (Equivalente a `ls -S`).

Manipulación

`mkdir [nombre]`: Crea una carpeta (Igual que en Linux).

`type nul > archivo.txt`: Crea un archivo vacío (Equivalente a `touch`).

`copy [origen] [destino]`: Copia archivos (Equivalente a `cp`).

`robocopy [origen] [destino] /s`: Copia directorios de forma robusta y recursiva (Equivalente a `cp -r`).

`move [origen] [destino]`: Mueve o renombra (Equivalente a `mv`).

`del [archivo]`: Borra archivos (Equivalente a `rm`).

`rmdir /s /q [carpeta]`: Borra directorios y su contenido (Equivalente a `rm -rf`).

---

## Usuarios y Grupos

Administración de cuentas y seguridad local (Equivalente a fuentes).

`whoami`: Muestra el usuario actual (Equivalente a `id`).

`net user`: Lista todos los usuarios del sistema.

`net user [nombre] [password] /add`: Crea un usuario (Equivalente a `adduser`).

`net user [nombre] /delete`: Elimina un usuario (Equivalente a `userdel`).

`net localgroup [grupo] [usuario] /add`: Añade un usuario a un grupo como "Administradores" (Equivalente a `usermod -aG`).

`net user [nombre] /active:no`: Bloquea la cuenta (Equivalente a `passwd -l`).

---

## Permisos y Propiedades (ACL)

Windows utiliza el sistema `NTFS` de permisos (Equivalente a `chmod/chown` en fuentes).

`icacls [archivo]`: Muestra los permisos actuales.

`icacls [archivo] /grant [usuario]:F`: Otorga control total (Full) al usuario (Equivalente a `chmod 777` o similar).

`icacls [archivo] /deny [usuario]:R`: Deniega el acceso de lectura.

`takeown /f [archivo]`: Cambia el propietario del archivo al usuario actual (Equivalente a `chown`).

---

## Búsqueda y Procesamiento de Texto

Filtros y manipulación de datos (Equivalente a fuentes).

`echo "texto"`: Imprime texto (Igual que en Linux).

`findstr /i "patrón" archivo.txt`: Busca texto ignorando mayúsculas (Equivalente a `grep -i`).

`findstr /s "patrón" *.*`: Búsqueda recursiva en archivos (Equivalente a `grep -r`).

`sort`: Ordena las líneas de un archivo (Igual que en Linux).

`PowerShell (Get-Content archivo.txt | Select-Object -First 10)`: Muestra las primeras 10 líneas (Equivalente a `head`).

`PowerShell (Get-Content archivo.txt -Tail 10 -Wait)`: Muestra las últimas 10 líneas y sigue el archivo en tiempo real (Equivalente a `tail -f`).

---

## Gestión de Discos y Sistemas de Archivos

Comandos de almacenamiento (Equivalente a fuentes).

`diskpart`: Consola interactiva para particionar discos (Equivalente a `fdisk`).

`wmic logicaldisk get caption, freespace, size`: Espacio en disco (Equivalente a `df -h`).

`format [unidad]: /fs:NTFS /q`: Formateo rápido (Equivalente a `mkfs`).

`chkdsk [unidad]: /f`: Escanea y repara errores en el disco.

`label [unidad]: [nombre]`: Cambia la etiqueta del disco.

---

## Gestión de Procesos

Control de recursos y programas (Equivalente a fuentes).

`tasklist`: Lista todos los procesos con su uso de memoria (Equivalente a `ps aux`).

`taskkill /pid [ID] /f`: Termina un proceso por la fuerza (Equivalente a `kill -9`).

`taskkill /im [nombre.exe] /f`: Termina todos los procesos con ese nombre (Equivalente a `killall`).

`start /low [programa.exe]`: Inicia un programa con prioridad baja (Equivalente a `nice`).

---

## Redes (Networking)

Diagnóstico de conexión (Equivalente a fuentes).

`ipconfig /all`: Muestra IPs, MACs y DNS (Equivalente a `ip a`).

`ping [host]`: Prueba de latencia (Igual que en Linux).

`netstat -ano`: Muestra conexiones activas y qué proceso (PID) las usa (Equivalente a `ss -tunlp`).

`tracert [host]`: Traza la ruta de red (Equivalente a `traceroute`).

`nslookup [dominio]`: Consulta servidores DNS.

`getmac`: Muestra la dirección física de la tarjeta de red.

---

## Automatización

Programación de tareas (Equivalente a Crontab en fuentes).

`schtasks /query`: Lista todas las tareas programadas.

`schtasks /create /tn "Backup" /tr "C:\scripts\bk.bat" /sc daily /st 02:00`: Crea una tarea diaria a las 02:00 AM (Equivalente a `0 2 * * *` en `crontab`).

---

## Compresión y Archivado

(Equivalente a `tar` y `gzip` en fuentes).

PowerShell (`Compress-Archive -Path .\Data -DestinationPath backup.zip`): Crea un archivo comprimido.

PowerShell (`Expand-Archive -Path backup.zip -DestinationPath .\Destino`): Descomprime el archivo.

---

## Comunicación y Sesión

(Equivalente a fuentes).

`msg * "Hola equipo"`: Envía un mensaje emergente a todos los usuarios (Equivalente a `wall`).

`runas /user:Administrador cmd`: Ejecuta la consola como otro usuario (Equivalente a `sudo` o `su`).

`shutdown /s /t 0`: Apagado inmediato (Equivalente a `shutdown -h now`).

`shutdown /r /t 0`: Reinicio inmediato (Equivalente a `reboot`).

`logoff`: Cierra la sesión (Equivalente a `logout`).

`doskey c=cls`: Crea un alias temporal (Equivalente a `alias`).

---

# Información del Sistema y Hardware

Equivalente a la sección de utilidades básicas de las fuentes.
Propósito

## Comando CMD / Comando PowerShell

### Nombre del equipo

```
hostname
```

```powershell
$env:COMPUTERNAME
```

### Resumen del sistema

```
systeminfo
```

```powershell
Get-ComputerInfo
```

### Versión del Kernel/OS

```
ver
```

```powershell
[System.Environment]::OSVersion
```

### Arquitectura CPU

```
wmic cpu get name
```

```powershell
Get-CimInstance Win32*Processor
```

### Memoria RAM

```
wmic os get totalvisiblememorysize
```

```powershell
Get-CimInstance Win32_OperatingSystem | select \_mem*
```

### Tiempo encendido

```
net statistics server
```

```powershell
(Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime
```

### Parches/Updates

```
wmic qfe list brief
```

```powershell
Get-HotFix
```

### Modelo de Placa

```
wmic baseboard get product
```

```powershell
Get-CimInstance Win32_BaseBoard
```

> Tip Pro: Usa systeminfo | findstr /B /C:"OS Name" /C:"OS Version" para filtrar solo la versión del sistema, similar al comando uname -a de las fuentes.

---

# Gestión de Paquetes (Winget)

El equivalente moderno al comando apt descrito en las fuentes.

`winget search [nombre]`: Busca aplicaciones en el repositorio oficial.

`winget install [nombre]`: Instala software (Ej: winget install `Microsoft.PowerShell`).

`winget upgrade`: Lista todos los programas que tienen una versión más reciente.

`winget upgrade --all`: Actualiza todo el software instalado (Equivalente a `apt upgrade`).

`winget list`: Muestra todo lo instalado, incluyendo lo que no fue instalado por Winget.

`winget uninstall [nombre]`: Elimina el paquete (Equivalente a `apt remove`).

`winget export -o lista.json`: Crea un backup de tus apps para replicar el entorno en otra PC.

---

## Gestión de Archivos y Directorios

Operaciones de navegación y manipulación (Equivalente a fuentes).
Navegación (CMD/PowerShell)

`cd /d D:\Proyectos`: Cambia de directorio y de unidad de disco simultáneamente.

`pushd [ruta] / popd`: Guarda la ubicación actual en una pila y luego regresa a ella (Muy útil en scripts).

`dir /s /b`: Lista archivos de forma recursiva mostrando solo la ruta completa.

`Get-ChildItem -Hidden`: Muestra archivos ocultos (Equivalente a `ls -a`).

Manipulación Avanzada

`mkdir "Carpeta 1", "Carpeta 2"`: Crea múltiples carpetas a la vez.

`robocopy [origen] [destino] /mir /mt:32`: El "estándar de oro" para copias. `/mir` espeja directorios y `/mt:32` usa 32 hilos multihilo (Mucho más potente que `cp -r`).

`move [archivo] [destino]`: Mueve archivos (Igual que `mv`).

`del /s /q /f [archivo]`: Borrado forzado y silencioso en subdirectorios (Equivalente a `rm -rf`).

`mklink /D [enlace] [objetivo]`: Crea un enlace simbólico de directorio (Equivalente a `ln -s`).

---

## Usuarios y Grupos

Administración de identidades (Basado en la estructura de las fuentes).

`whoami /priv`: Muestra los privilegios del token actual (Clave para saber si eres admin real).

`net user [usuario] [pass] /add`: Crea un usuario local.

`net user [usuario] /active:no`: Desactiva la cuenta sin borrarla (Equivalente a `passwd -l`).

`net localgroup Administradores [usuario] /add`: Eleva a un usuario a administrador.

`Get-LocalUser \| Where-Object {$_.Enabled -eq $true}`: Lista solo usuarios activos vía PowerShell.

---

## Permisos y Seguridad (NTFS ACLs)

Windows usa Listas de Control de Acceso, equivalentes a los permisos de las fuentes.

`icacls [ruta]`: Muestra los permisos actuales.

`icacls [ruta] /grant:r [user]:(OI)(CI)F`:
`F`: Full Control.

`(OI)(CI)`: Herencia para objetos y carpetas (Equivalente a un cambio recursivo en Linux).

`icacls [ruta] /inheritance:r`: Elimina la herencia de permisos.

`takeown /f [archivo] /a`: Toma posesión del archivo como administrador (Equivalente a `chown`).

---

## Procesamiento de Texto y Búsqueda

Adaptación de herramientas como grep, sed y awk de las fuentes.

`findstr /spin "ERROR" *.log`:

`/s`: Recursivo. `/i`: Ignora mayúsculas. `/p`: Omite archivos no imprimibles. `/n`: Muestra línea. (Equivalente a `grep -rin`).

`Get-Content log.txt -Wait -Tail 20`: Monitorea un log en tiempo real (Equivalente exacto a `tail -f`).

`Select-String -Path .\*.txt -Pattern "Regex"`: El "Grep" nativo de PowerShell con soporte total de expresiones regulares.

`echo texto >> archivo.txt`: Añade texto al final (Redirección igual que en Linux).

---

## Gestión de Discos

Comandos para almacenamiento (Equivalente a fuentes).

`diskpart`: Consola interactiva para gestión de particiones.

list disk -> select disk X -> clean (Borra todo el disco).

`Get-Volume`: Muestra todas las particiones, etiquetas y espacio libre (Equivalente a `df -h`).

`Repair-Volume -DriveLetter C -Scan`: Escanea errores en caliente.

`Optimize-Volume -DriveLetter C -Defrag`: Desfragmenta o hace TRIM (en SSD).

---

## Gestión de Procesos

Control del sistema (Equivalente a fuentes).

`tasklist /v /fi "memusage gt 100000"`: Lista procesos que usan más de `100MB` de `RAM`.

`Get-Process \| Sort-Object CPU -Descending \| Select-Object -First 10`: Muestra el "Top 10" de procesos que más CPU consumen (Equivalente a `top`).

`taskkill /f /im chrome.exe`: Mata todos los procesos de un programa (Equivalente a `killall`).

`Stop-Process -Name "Proceso" -Force`: Fuerza el cierre en PowerShell.

---

## Redes (Networking)

Diagnóstico y configuración (Equivalente a fuentes).

`ipconfig /flushdns`: Limpia la caché de resolución de nombres.

`netstat -ano \| findstr :80`: Busca qué proceso tiene abierto el puerto 80 (Equivalente a `ss -tunlp`).

`Test-NetConnection -ComputerName [IP] -Port [Puerto]`: Verifica si un puerto específico está abierto en un servidor remoto.

`Get-NetIPAddress -InterfaceAlias Wi-Fi`: Detalles técnicos de la IP en la interfaz inalámbrica.

---

## Automatización (Tareas Programadas)

El equivalente a crontab descrito en la fuente.

`schtasks /create /sc hourly /mo 1 /tn "Limpieza" /tr "C:\scripts\clean.bat"`: Crea una tarea que se ejecuta cada hora.

`schtasks /run /tn "NombreTarea"`: Ejecuta una tarea programada manualmente.

`Get-ScheduledTask \| Where-Object {$_.State -ne "Disabled"}`: Lista tareas activas.

---

## Compresión y Comunicación

(Equivalente a fuentes).

`Compress-Archive -Path C:\Logs\* -DestinationPath C:\Backup\Logs.zip`: Comprime archivos (Equivalente a `tar -czf`).

`Expand-Archive -Path backup.zip -DestinationPath C:\Destino`: Descomprime.

`msg * "Atención: El servidor se reiniciará"`: Envía un mensaje a todos los usuarios (Equivalente a `wall`).

---

## Control de Energía y Sesión

(Equivalente a la sección final de las fuentes).

`shutdown /r /fw /t 0`: Reinicia el equipo y entra automáticamente a la BIOS/UEFI.

`shutdown /h`: Hiberna el equipo.

`logoff`: Cierra la sesión actual (Equivalente a `logout`).

`qwinsta`: Muestra quién está conectado por Escritorio Remoto (`RDP`).

---

## Bonus: Atajos y Alias de PowerShell

Para los que vienen de Linux (Sección inspirada en alias de las fuentes).
PowerShell incluye alias nativos para que te sientas como en casa:

`ls` -> apunta a `Get-ChildItem`

`ps` -> apunta a `Get-Process`

`cat` -> apunta a `Get-Content`

`man` -> apunta a `help` (o `Get-Help`)

`rm` -> apunta a `Remove-Item`
