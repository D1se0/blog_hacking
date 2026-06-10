# Windows — Administración y Comandos

Referencia completa de comandos CMD y PowerShell para administración, diagnóstico y pentesting en entornos Windows. Cada sección incluye el equivalente Linux cuando es relevante.

---

## 1. Información del Sistema

### CMD

```cmd
hostname                         :: Nombre del equipo
systeminfo                       :: Informe completo: OS, BIOS, parches, RAM, red
systeminfo | findstr /B /C:"OS"  :: Solo información del OS
ver                              :: Versión del kernel de Windows
echo %PROCESSOR_ARCHITECTURE%   :: Arquitectura (AMD64, x86, ARM64)
echo %COMPUTERNAME%              :: Nombre del equipo (variable de entorno)
echo %USERNAME%                  :: Usuario actual
echo %USERDOMAIN%                :: Dominio actual
set                              :: Todas las variables de entorno
wmic cpu get name,numberofcores,maxclockspeed  :: Info CPU
wmic computersystem get totalphysicalmemory   :: RAM total en bytes
wmic os get osarchitecture       :: Arquitectura del OS
wmic bios get serialnumber       :: Número de serie (útil para licencias/forense)
date /t && time /t               :: Fecha y hora actual
```

### PowerShell

```powershell
Get-ComputerInfo                  # Información completa del sistema
Get-ComputerInfo | Select-Object CsName, WindowsProductName, OsVersion
[System.Environment]::OSVersion   # Versión del OS
$env:COMPUTERNAME                 # Nombre del equipo
$env:USERNAME                     # Usuario actual
$env:USERDOMAIN                   # Dominio
Get-WmiObject Win32_Processor | Select-Object Name, NumberOfCores, MaxClockSpeed
Get-WmiObject Win32_PhysicalMemory | Measure-Object Capacity -Sum
(Get-Date).ToString("yyyy-MM-dd HH:mm:ss")  # Fecha y hora formateada
Get-HotFix | Sort-Object -Descending InstalledOn | Select-Object -First 10  # Últimos parches
```

---

## 2. Gestión de Paquetes

### Winget (Windows Package Manager)

```cmd
winget search firefox             :: Buscar paquete
winget install Mozilla.Firefox    :: Instalar
winget install --id Mozilla.Firefox -e   :: Instalación exacta por ID
winget list                       :: Aplicaciones instaladas con actualizaciones disponibles
winget upgrade --all              :: Actualizar todo
winget upgrade Mozilla.Firefox    :: Actualizar uno específico
winget uninstall Mozilla.Firefox  :: Desinstalar
winget show Mozilla.Firefox       :: Información del paquete
winget export -o lista.json       :: Exportar lista de aplicaciones
winget import -i lista.json       :: Importar e instalar lista
```

### Chocolatey

```cmd
choco search paquete              :: Buscar
choco install paquete             :: Instalar
choco install paquete -y          :: Sin confirmación
choco upgrade paquete             :: Actualizar
choco upgrade all                 :: Actualizar todo
choco uninstall paquete           :: Desinstalar
choco list --local-only           :: Instalados localmente
```

### PowerShell (PSGallery)

```powershell
Find-Module Nombre                # Buscar módulo
Install-Module Nombre             # Instalar
Update-Module Nombre              # Actualizar
Uninstall-Module Nombre          # Desinstalar
Get-InstalledModule               # Listar instalados
```

---

## 3. Gestión de Archivos y Directorios

### Navegación

```cmd
:: CMD
cd                               :: Muestra directorio actual (= pwd)
cd /d D:\proyectos               :: Cambiar disco y directorio a la vez
cd ..                            :: Subir un nivel
cd \                             :: Ir a la raíz de la unidad
pushd C:\temp                    :: Apilar directorio actual e ir a C:\temp
popd                             :: Volver al directorio apilado
dir                              :: Listar contenido
dir /a                           :: Incluir archivos ocultos y del sistema
dir /a:h                         :: Solo archivos ocultos
dir /s                           :: Recursivo
dir /o:s                         :: Ordenar por tamaño
dir /o:d                         :: Ordenar por fecha
dir /q                           :: Mostrar propietario
dir /b                           :: Solo nombres (bare format, para scripts)
dir /b /s *.log                  :: Todos los .log recursivamente
```

```powershell
# PowerShell
Get-Location                      # Equivalente a pwd
Set-Location C:\proyectos         # cd
Push-Location C:\temp             # pushd
Pop-Location                      # popd
Get-ChildItem                     # ls/dir
Get-ChildItem -Force              # Incluir ocultos
Get-ChildItem -Recurse            # Recursivo
Get-ChildItem *.log -Recurse      # Todos los .log recursivamente
Get-ChildItem | Sort-Object Length -Descending  # Ordenar por tamaño
Get-ChildItem | Where-Object { $_.Extension -eq ".log" }
```

### Manipulación de archivos

```cmd
:: CMD
mkdir nueva_carpeta              :: Crear directorio
mkdir ruta\completa\nueva        :: Crea toda la cadena
type nul > archivo.txt           :: Crear archivo vacío (= touch)
echo Contenido > archivo.txt     :: Crear con contenido (sobreescribe)
echo Más contenido >> archivo.txt :: Añadir al final
type archivo.txt                 :: Mostrar contenido (= cat)
more archivo.txt                 :: Paginado
copy origen destino              :: Copiar archivo
copy /b archivo1+archivo2 resultado :: Combinar archivos
xcopy origen\ destino\ /s /e /i  :: Copiar directorio recursivamente
robocopy origen destino /mir     :: Sincronización robusta (recomendado)
robocopy origen destino /s /xo   :: Copiar solo archivos nuevos o modificados
move origen destino              :: Mover o renombrar
ren archivo.txt nuevo.txt        :: Renombrar
del archivo.txt                  :: Borrar archivo
del /f /q archivo.txt            :: Forzado y silencioso
del /s *.tmp                     :: Borrar todos los .tmp recursivamente
rd carpeta                       :: Eliminar directorio vacío
rmdir /s /q carpeta              :: Eliminar directorio con contenido (= rm -rf)
```

```powershell
# PowerShell
New-Item -ItemType Directory -Name nueva_carpeta
New-Item -ItemType File -Name archivo.txt
New-Item -ItemType File -Path ruta\archivo.txt -Force
Get-Content archivo.txt          # cat
Get-Content archivo.txt -Tail 20 # tail -n 20
Get-Content archivo.txt | Select-Object -First 10  # head
Copy-Item origen destino
Copy-Item -Recurse directorio/ destino/
Move-Item origen destino
Rename-Item archivo.txt nuevo.txt
Remove-Item archivo.txt
Remove-Item -Recurse -Force directorio/  # rm -rf
Compare-Object (Get-Content f1) (Get-Content f2)  # diff básico
```

### Búsqueda de archivos

```cmd
:: CMD — where (busca en PATH)
where python                     :: Ruta del ejecutable python
where /r C:\ *.txt               :: Buscar recursivamente (= find)

:: findstr (= grep)
findstr "texto" archivo.txt      :: Buscar texto en archivo
findstr /s /i "password" *.txt   :: Recursivo, insensible, en .txt
findstr /n "error" log.txt       :: Con número de línea
findstr /v "excluir" archivo.txt :: Invertido (líneas que NO contienen)
findstr /r "^admin" usuarios.txt :: Con expresión regular
```

```powershell
# PowerShell
Get-ChildItem -Recurse -Filter "*.log"   # Buscar por nombre
Get-ChildItem -Recurse | Where-Object { $_.Name -like "*config*" }
Select-String -Path *.log -Pattern "error"       # grep básico
Select-String -Path C:\**\*.txt -Pattern "password" -Recurse  # Búsqueda recursiva
Select-String -Path archivo.txt -Pattern "^\d+" -CaseSensitive
Get-ChildItem -Recurse | Where-Object { $_.Length -gt 100MB }  # Por tamaño
Get-ChildItem -Recurse | Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-7) }  # Modificados en 7 días
```

---

## 4. Usuarios y Grupos

### CMD (net / wmic)

```cmd
whoami                           :: Usuario y dominio actual
whoami /priv                     :: Privilegios del usuario actual
whoami /groups                   :: Grupos del usuario
whoami /all                      :: Todo lo anterior
net user                         :: Listar todos los usuarios locales
net user alice                   :: Detalles del usuario alice
net user alice Password123 /add  :: Crear usuario
net user alice /delete           :: Eliminar usuario
net user alice /active:no        :: Deshabilitar cuenta
net user alice /active:yes       :: Habilitar cuenta
net user alice *                 :: Cambiar contraseña interactivo
net user alice Password123       :: Cambiar contraseña directo
net localgroup                   :: Listar grupos locales
net localgroup Administradores   :: Miembros del grupo Administradores
net localgroup Administradores alice /add   :: Añadir alice a Administradores
net localgroup Administradores alice /delete :: Quitar alice de Administradores

wmic useraccount list brief      :: Lista de usuarios con SID
wmic useraccount where name="alice" get sid  :: SID de un usuario específico
```

### PowerShell

```powershell
Get-LocalUser                    # Listar usuarios locales
Get-LocalUser alice              # Detalles de un usuario
New-LocalUser -Name alice -Password (ConvertTo-SecureString "Pass123!" -AsPlainText -Force)
Remove-LocalUser alice
Enable-LocalUser alice
Disable-LocalUser alice
Set-LocalUser -Name alice -Password (ConvertTo-SecureString "NuevoPass" -AsPlainText -Force)

Get-LocalGroup                   # Listar grupos
Get-LocalGroupMember Administradores  # Miembros de un grupo
Add-LocalGroupMember -Group Administradores -Member alice
Remove-LocalGroupMember -Group Administradores -Member alice

# Active Directory (requiere RSAT o estar en dominio)
Get-ADUser -Filter *             # Todos los usuarios del dominio
Get-ADUser alice -Properties *   # Todos los atributos
Get-ADGroupMember "Domain Admins" # Miembros de Domain Admins
Get-ADComputer -Filter *         # Equipos del dominio
```

---

## 5. Permisos (NTFS / ACL)

Windows usa **ACL (Access Control Lists)** en lugar del modelo Unix rwx. Cada archivo tiene un DACL con entradas ACE.

### Tipos de permisos NTFS básicos

| Permiso | Descripción |
|---|---|
| `F` | Full Control — control total |
| `M` | Modify — leer, escribir, ejecutar, borrar |
| `RX` | Read & Execute |
| `R` | Read Only |
| `W` | Write Only |

```cmd
icacls archivo.txt                      :: Ver permisos
icacls directorio /T                    :: Ver permisos recursivos
icacls archivo /grant alice:F           :: Dar control total a alice
icacls archivo /grant alice:(R,W)       :: Dar lectura y escritura
icacls archivo /grant "Todos":R         :: Dar lectura a todos
icacls archivo /deny alice:W            :: Denegar escritura a alice
icacls archivo /remove alice            :: Eliminar todas las entradas de alice
icacls archivo /inheritance:d           :: Deshabilitar herencia
icacls archivo /inheritance:r           :: Eliminar permisos heredados
icacls archivo /setowner alice          :: Cambiar propietario
icacls directorio /grant alice:(OI)(CI)F :: Propagación a subdirectorios y archivos
takeown /f archivo                      :: Tomar posesión del archivo
takeown /f directorio /r /d y           :: Recursivo con confirmación automática
```

```powershell
# PowerShell — control de ACL
Get-Acl archivo.txt                      # Ver ACL completa
Get-Acl archivo.txt | Format-List        # Formato detallado

# Añadir permiso
$acl = Get-Acl "C:\archivo.txt"
$regla = New-Object System.Security.AccessControl.FileSystemAccessRule("alice","FullControl","Allow")
$acl.SetAccessRule($regla)
Set-Acl "C:\archivo.txt" $acl

# Copiar ACL de un archivo a otro
Get-Acl "origen.txt" | Set-Acl "destino.txt"

# Buscar archivos con permisos débiles (pentesting)
Get-ChildItem C:\inetpub -Recurse | Get-Acl | Where-Object { $_.AccessToString -match "Everyone.*FullControl" }
```

---

## 6. Procesos y Servicios

### Procesos

```cmd
tasklist                         :: Listar procesos (= ps aux)
tasklist /svc                    :: Con servicios asociados
tasklist /fi "imagename eq notepad.exe"  :: Filtrar por nombre
tasklist /fi "status eq running" :: Solo procesos activos
tasklist /fo csv                 :: Formato CSV (para scripts)
taskkill /pid 1234               :: Terminar por PID (SIGTERM)
taskkill /f /pid 1234            :: Forzar terminación (SIGKILL)
taskkill /im notepad.exe         :: Terminar por nombre
taskkill /f /im notepad.exe      :: Forzar por nombre
taskkill /f /im notepad.exe /t   :: Terminar proceso y sus hijos
wmic process list brief          :: Lista detallada
wmic process where name="notepad.exe" get processid,commandline  :: PID y comando
```

```powershell
Get-Process                      # Listar procesos
Get-Process -Name chrome         # Por nombre
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10  # Top CPU
Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 10  # Top RAM
Stop-Process -Id 1234            # Terminar por PID
Stop-Process -Name notepad       # Terminar por nombre
Stop-Process -Name notepad -Force # Forzar
Get-Process | Where-Object { $_.CPU -gt 50 }  # Más de 50s de CPU
Get-Process | Select-Object Name, Id, CPU, WorkingSet, Path  # Con ruta del ejecutable
```

### Servicios

```cmd
sc query                         :: Listar todos los servicios
sc query nombre_servicio         :: Estado de un servicio
sc start nombre_servicio         :: Iniciar
sc stop nombre_servicio          :: Parar
sc restart nombre_servicio       :: Reiniciar (desde Windows 10)
sc config nombre_servicio start= auto    :: Configurar inicio automático
sc config nombre_servicio start= disabled  :: Deshabilitar
sc create NuevoServ binPath= "C:\ruta\app.exe"  :: Crear servicio
sc delete NuevoServ              :: Eliminar servicio
net start nombre_servicio        :: Iniciar (alternativa)
net stop nombre_servicio         :: Parar (alternativa)
```

```powershell
Get-Service                      # Listar todos los servicios
Get-Service -Name sshd           # Un servicio específico
Get-Service | Where-Object { $_.Status -eq "Running" }  # Solo activos
Start-Service -Name sshd
Stop-Service -Name sshd
Restart-Service -Name sshd
Set-Service -Name sshd -StartupType Automatic
Set-Service -Name sshd -StartupType Disabled
New-Service -Name "MiServicio" -BinaryPathName "C:\app.exe"
```

---

## 7. Red y Conectividad

```cmd
ipconfig                         :: Configuración de red básica
ipconfig /all                    :: Información completa (MAC, DNS, DHCP, etc.)
ipconfig /release                :: Liberar IP obtenida por DHCP
ipconfig /renew                  :: Pedir nueva IP por DHCP
ipconfig /flushdns               :: Limpiar caché DNS
ipconfig /displaydns             :: Ver caché DNS actual

ping 8.8.8.8                     :: Ping básico
ping -t 8.8.8.8                  :: Ping continuo (Ctrl+C para parar)
ping -n 5 8.8.8.8                :: Solo 5 pings
ping -l 1400 8.8.8.8             :: Paquetes de 1400 bytes

tracert 8.8.8.8                  :: Traceroute
tracert -d 8.8.8.8               :: Sin resolución DNS

nslookup ejemplo.com             :: Consulta DNS
nslookup -type=MX ejemplo.com    :: Registros MX
nslookup ejemplo.com 8.8.8.8     :: Usar DNS específico

netstat -an                      :: Todas las conexiones y puertos
netstat -b                       :: Con ejecutable (requiere admin)
netstat -r                       :: Tabla de rutas
netstat -ano                     :: Con PID
netstat -p TCP                   :: Solo TCP

arp -a                           :: Tabla ARP
route print                      :: Tabla de rutas completa
route add 10.0.0.0 mask 255.0.0.0 192.168.1.1  :: Añadir ruta

netsh wlan show profiles                          :: Redes WiFi guardadas
netsh wlan show profile name="SSID" key=clear    :: Ver contraseña WiFi guardada
netsh wlan show interfaces                        :: Estado WiFi actual
```

```powershell
Get-NetIPAddress                 # Interfaces y sus IPs
Get-NetIPConfiguration           # Configuración completa
Get-DnsClientCache               # Caché DNS
Clear-DnsClientCache             # Limpiar caché DNS
Test-NetConnection 8.8.8.8      # Ping avanzado
Test-NetConnection -ComputerName host -Port 443  # Probar puerto específico
Get-NetTCPConnection             # Conexiones TCP activas
Get-NetTCPConnection | Where-Object State -eq Listen  # Puertos en escucha
Resolve-DnsName ejemplo.com      # Resolución DNS
Resolve-DnsName -Type MX ejemplo.com
```

---

## 8. Registro de Windows (Registry)

```cmd
:: Consultar clave
reg query "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion"
reg query "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion" /v ProductName

:: Añadir/modificar valor
reg add "HKCU\SOFTWARE\MiApp" /v Configuracion /t REG_SZ /d "valor"
reg add "HKCU\SOFTWARE\MiApp" /v Numero /t REG_DWORD /d 1

:: Eliminar
reg delete "HKCU\SOFTWARE\MiApp" /v Configuracion /f
reg delete "HKCU\SOFTWARE\MiApp" /f  :: Eliminar clave completa

:: Exportar/importar
reg export "HKCU\SOFTWARE\MiApp" backup.reg
reg import backup.reg
```

```powershell
Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion"
Get-ItemProperty -Path "HKLM:\SOFTWARE\..." -Name "ProductName"
Set-ItemProperty -Path "HKCU:\SOFTWARE\MiApp" -Name "Setting" -Value "valor"
New-Item -Path "HKCU:\SOFTWARE\MiApp"
Remove-Item -Path "HKCU:\SOFTWARE\MiApp" -Recurse

# Buscar en registro (pentesting — buscar credenciales, configuraciones)
Get-ChildItem -Recurse "HKLM:\SOFTWARE" | Where-Object { $_.PSChildName -like "*password*" }
reg query HKLM /f password /t REG_SZ /s   :: Buscar "password" en todo HKLM
```

---

## 9. Tareas Programadas

```cmd
schtasks /query                  :: Ver todas las tareas
schtasks /query /fo list         :: Formato lista detallada
schtasks /query /tn "NombreTarea" /fo list /v  :: Tarea específica detallada
schtasks /run /tn "NombreTarea"  :: Ejecutar tarea ahora
schtasks /delete /tn "NombreTarea" /f  :: Eliminar tarea

:: Crear tarea (ejecutar script cada día a las 12:00)
schtasks /create /tn "MiTarea" /tr "C:\script.bat" /sc daily /st 12:00
:: Ejecutar al inicio del sistema como SYSTEM
schtasks /create /tn "InicioPersistencia" /tr "C:\payload.exe" /sc onstart /ru SYSTEM
```

```powershell
Get-ScheduledTask                # Listar tareas
Get-ScheduledTask -TaskName "Windows Defender*"
Start-ScheduledTask -TaskName "MiTarea"
Unregister-ScheduledTask -TaskName "MiTarea" -Confirm:$false

# Crear tarea programada
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File C:\script.ps1"
$trigger = New-ScheduledTaskTrigger -Daily -At 12:00
Register-ScheduledTask -TaskName "MiTarea" -Action $action -Trigger $trigger -RunLevel Highest
```

---

## 10. PowerShell — Fundamentos

### Variables y tipos

```powershell
$nombre = "Alice"                # String
$numero = 42                     # Int
$decimal = 3.14                  # Double
$activo = $true                  # Boolean
$lista = @(1, 2, 3, "cuatro")    # Array
$hash = @{ clave = "valor"; num = 1 }  # Hashtable
$nulo = $null                    # Null

# Tipos explícitos
[int]$n = "5"
[string]$s = 100
[datetime]$fecha = "2025-06-09"

# Strings
"Hola $nombre"                   # Interpolación (comillas dobles)
'Hola $nombre'                   # Literal (comillas simples, sin interpolación)
"$($nombre.ToUpper())"           # Expresión dentro de string
@"
Texto
multilínea
"@                               # Here-string
```

### Estructuras de control

```powershell
# Condicional
if ($x -gt 10) { "mayor" } elseif ($x -eq 10) { "igual" } else { "menor" }

# Operadores de comparación
-eq, -ne, -lt, -le, -gt, -ge    # Numéricos: igual, distinto, menor, mayor...
-like, -notlike                  # Wildcards: *texto*, texto?
-match, -notmatch                # Regex
-contains, -notcontains          # ¿El array contiene el valor?
-in, -notin                      # ¿El valor está en el array?

# Bucles
foreach ($item in $coleccion) { ... }
for ($i = 0; $i -lt 10; $i++) { ... }
while ($condicion) { ... }
do { ... } while ($condicion)
1..10 | ForEach-Object { $_ * 2 }  # Pipeline con ForEach-Object
```

### Pipeline y filtros

```powershell
Get-Process | Where-Object { $_.CPU -gt 10 }        # Filtrar
Get-Process | Select-Object Name, CPU, Id           # Seleccionar columnas
Get-Process | Sort-Object CPU -Descending            # Ordenar
Get-Process | Group-Object -Property Name            # Agrupar
Get-Process | Measure-Object CPU -Sum -Average       # Calcular
Get-Service | Format-Table -AutoSize                 # Tabla formateada
Get-Service | Format-List                            # Lista detallada
Get-Process | Out-File procesos.txt                  # Guardar a archivo
Get-Process | Export-Csv procesos.csv -NoTypeInformation  # Exportar CSV
Import-Csv datos.csv | Where-Object { $_.Estado -eq "Activo" }  # Leer CSV
Get-Process | ConvertTo-Json | Out-File procesos.json  # Exportar JSON
```

### Funciones y scripts

```powershell
# Función básica
function Saludo {
    param([string]$Nombre = "Mundo")
    Write-Output "Hola, $Nombre!"
}
Saludo -Nombre "Alice"

# Función con tipos y validación
function Get-SquaredNumber {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory, ValueFromPipeline)]
        [int]$Numero
    )
    return $Numero * $Numero
}
1..5 | Get-SquaredNumber

# Manejo de errores
try {
    Get-Item "archivo_inexistente.txt" -ErrorAction Stop
} catch [System.IO.FileNotFoundException] {
    Write-Error "Archivo no encontrado: $_"
} catch {
    Write-Error "Error inesperado: $_"
} finally {
    Write-Host "Bloque finally siempre ejecuta"
}

# Ejecutar como administrador desde script
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Start-Process PowerShell -Verb RunAs -ArgumentList "-File `"$PSCommandPath`""
    exit
}
```

### Remoting y ejecución remota

```powershell
# WinRM (Windows Remote Management)
Enable-PSRemoting -Force                              # Habilitar WinRM
Enter-PSSession -ComputerName servidor               # Sesión interactiva
Invoke-Command -ComputerName servidor -ScriptBlock { Get-Process }  # Ejecución remota
New-PSSession -ComputerName servidor                 # Sesión persistente
Invoke-Command -Session $sesion -ScriptBlock { ... } # Usar sesión existente

# Con credenciales
$cred = Get-Credential
Enter-PSSession -ComputerName servidor -Credential $cred
```

---

## 11. Diagnóstico y Logs

```cmd
:: Event Viewer (CLI)
eventvwr.msc                     :: Abrir visor de eventos (GUI)
wevtutil qe System /c:10 /rd:true /f:text  :: Últimos 10 eventos del sistema
wevtutil qe Security /c:20 /rd:true /f:text  :: Últimos 20 eventos de seguridad
wevtutil cl System               :: Limpiar log del sistema (requiere admin)

:: Logs de autenticación
wevtutil qe Security /q:"*[System[(EventID=4624)]]" /c:10 /rd:true /f:text  :: Logon exitosos
wevtutil qe Security /q:"*[System[(EventID=4625)]]" /c:10 /rd:true /f:text  :: Logon fallidos
```

```powershell
Get-EventLog -LogName System -Newest 20            # Últimos 20 eventos del sistema
Get-EventLog -LogName Security -InstanceId 4624 -Newest 10  # Logins exitosos
Get-WinEvent -LogName Security -MaxEvents 50       # Más moderno
Get-WinEvent -FilterHashtable @{LogName="Security"; Id=4625}  # Logins fallidos
Get-WinEvent -FilterHashtable @{LogName="System"; StartTime=(Get-Date).AddHours(-1)}  # Última hora

# SFC y DISM
sfc /scannow                     # Comprobar archivos del sistema
DISM /Online /Cleanup-Image /CheckHealth  # Estado de la imagen del sistema
DISM /Online /Cleanup-Image /RestoreHealth  # Reparar imagen del sistema
```

---

## 12. Variables de Entorno

```cmd
set                              :: Ver todas
echo %PATH%                      :: Ver PATH
echo %TEMP%                      :: Directorio temporal
echo %APPDATA%                   :: Datos de aplicaciones del usuario
echo %SYSTEMROOT%                :: Raíz de Windows (= C:\Windows)
echo %PROGRAMFILES%              :: Archivos de programa
setx VARIABLE "valor"           :: Establecer permanentemente (usuario)
setx VARIABLE "valor" /M        :: Establecer permanentemente (sistema, requiere admin)
set VARIABLE=valor               :: Temporal (solo sesión actual)
```

```powershell
[System.Environment]::GetEnvironmentVariables()  # Todas las variables
$env:PATH
$env:TEMP
$env:APPDATA
$env:SystemRoot
[System.Environment]::SetEnvironmentVariable("MI_VAR", "valor", "User")   # Permanente usuario
[System.Environment]::SetEnvironmentVariable("MI_VAR", "valor", "Machine") # Permanente sistema
$env:MI_VAR = "valor"            # Temporal (sesión actual)
```

---

## 13. Equivalencias Linux ↔ Windows

| Linux | Windows CMD | Windows PowerShell |
|---|---|---|
| `ls` | `dir` | `Get-ChildItem` |
| `pwd` | `cd` (sin args) | `Get-Location` |
| `cd` | `cd /d` | `Set-Location` |
| `cp` | `copy` / `xcopy` | `Copy-Item` |
| `mv` | `move` | `Move-Item` |
| `rm` | `del` / `rmdir /s /q` | `Remove-Item` |
| `cat` | `type` | `Get-Content` |
| `echo` | `echo` | `Write-Output` |
| `grep` | `findstr` | `Select-String` |
| `find` | `where /r` | `Get-ChildItem -Recurse` |
| `ps aux` | `tasklist` | `Get-Process` |
| `kill` | `taskkill` | `Stop-Process` |
| `top` | `tasklist` + loop | Módulo `Get-Process` loop |
| `chmod` | `icacls` | `Set-Acl` |
| `chown` | `takeown` / `icacls /setowner` | `Set-Acl` |
| `sudo` | `runas /user:administrator` | `Start-Process -Verb RunAs` |
| `ssh` | `ssh` (OpenSSH desde Win10) | `Enter-PSSession` |
| `systemctl` | `sc` / `net start/stop` | `Get-Service` / `Start-Service` |
| `crontab` | `schtasks` | `Register-ScheduledTask` |
| `df -h` | `wmic logicaldisk get size,freespace` | `Get-PSDrive` |
| `free -h` | `wmic OS get freephysicalmemory` | `Get-WmiObject Win32_OS` |
| `ifconfig` / `ip a` | `ipconfig /all` | `Get-NetIPConfiguration` |
| `netstat` | `netstat` | `Get-NetTCPConnection` |
| `ping` | `ping` | `Test-NetConnection` |
| `curl` | `curl` (desde Win10) | `Invoke-WebRequest` / `Invoke-RestMethod` |
| `tail -f` | Ninguno nativo | `Get-Content -Wait -Tail 10` |
| `history` | `doskey /history` | `Get-History` |
| `env` | `set` | `Get-ChildItem Env:` |
| `which` | `where` | `Get-Command` |
| `man` | `help` / `comando /?` | `Get-Help` |
