# Información del Dominio y Controladores

Equivalente a la obtención de información del sistema y red (Secciones 1 y 10 de las fuentes).

`Get-ADDomain`: Muestra información básica del dominio actual (Nombre, niveles funcionales, modo).

`Get-ADDomainController`: Identifica los controladores de dominio activos y sus roles (PDC, RID, etc.).

`Get-ADForest`: Proporciona detalles sobre el bosque de AD (dominios raíz, sitios).

`nltest /dclist:[dominio]`: Lista todos los controladores de dominio desde CMD.

`netdom query fsmo`: Identifica qué servidor posee los 5 roles FSMO (Maestro de operaciones).

---

## Gestión de Usuarios de Dominio (AD DS)

Equivalente avanzado a la sección de usuarios (adduser, usermod) de las fuentes.

`Get-ADUser -Identity [usuario] -Properties *`: Muestra todos los atributos de un usuario (incluyendo cuándo cambió su contraseña).

`New-ADUser -Name "Juan Perez" -SamAccountName jperez -UserPrincipalName jperez@empresa.com -Enabled $true`: Crea un nuevo usuario de dominio.

`Set-ADUser -Identity [usuario] -Replace @{title="Ingeniero"}`: Modifica atributos específicos (Equivalente a `usermod`).

`Unlock-ADAccount -Identity [usuario]`: Desbloquea una cuenta bloqueada por intentos fallidos.

`Search-ADAccount -LockedOut`: Busca todas las cuentas que están bloqueadas actualmente en el dominio.

`Disable-ADAccount / Enable-ADAccount`: Desactiva o activa una cuenta de dominio.

---

## Gestión de Grupos de Seguridad y Distribución

Equivalente a la gestión de grupos (groupadd, gpasswd) de las fuentes.

`Get-ADGroup -Filter 'Name -like "*Admin*"'`: Busca grupos que contengan la palabra "Admin".

`Add-ADGroupMember -Identity "Sistemas" -Members "jperez"`: Añade un usuario a un grupo (Equivalente a `gpasswd -a`).

`Remove-ADGroupMember -Identity "Sistemas" -Members "jperez"`: Elimina un usuario del grupo (Equivalente a `gpasswd -d`).

`Get-ADGroupMember -Identity "Administradores del Dominio"`: Lista todos los integrantes de un grupo.

`New-ADGroup -Name "Contabilidad" -GroupCategory Security -GroupScope Global`: Crea un grupo de seguridad global.

---

## Unidades Organizativas (OU) y Equipos

Equivalente a la jerarquía de directorios descrita en las fuentes.

`Get-ADOrganizationalUnit -Filter *`: Lista todas las OUs del dominio.

`New-ADOrganizationalUnit -Name "Ventas" -Path "dc=empresa,dc=com"`: Crea una nueva Unidad Organizativa.

`Get-ADComputer -Filter 'OperatingSystem -like "*Server*"'`: Busca todos los servidores registrados en el dominio.

`Move-ADObject -Identity "CN=PC01,CN=Computers,DC=empresa,DC=com" -TargetPath "OU=Ventas,DC=empresa,DC=com"`: Mueve un objeto entre OUs (Equivalente a `mv`).

---

## Políticas de Grupo (GPO)

El equivalente en AD a la automatización y configuración del sistema.

`gpupdate /force`: Fuerza la actualización inmediata de las políticas en el equipo local.

`gpresult /r`: Muestra un resumen de qué políticas se están aplicando al usuario y equipo actual (Equivalente a ver los logs de configuración).

`Get-GPO -All`: Lista todas las políticas de grupo creadas en el dominio.

`New-GPLink -Name "Seguridad_USB" -Target "OU=Ventas,DC=empresa,DC=com"`: Vincula una GPO a una unidad organizativa específica.

---

## Diagnóstico y Salud del Directorio Activo

Equivalente a las herramientas de diagnóstico de hardware y procesos de las fuentes.

`dcdiag`: Ejecuta una serie de pruebas de salud sobre el controlador de dominio (DNS, réplica, servicios).

`repadmin /showrepl`: Muestra el estado de la replicación entre controladores de dominio.

`repadmin /syncall`: Fuerza la sincronización de todos los controladores de dominio.

`Test-ADServiceAccount -Identity [cuenta]`: Verifica si una cuenta de servicio administrada (gMSA) funciona correctamente.

`Get-ADReplicationPartnerMetadata`: Muestra cuándo fue la última vez que un controlador replicó exitosamente.

---

## Consultas Avanzadas con Filtros (LDAP)

Equivalente al uso de grep y find en las fuentes para buscar datos complejos.

`Get-ADUser -Filter 'Enabled -eq $false' | Select-Object Name`: Busca todos los usuarios desactivados.

`Get-ADUser -Filter 'PasswordExpired -eq $true'`: Busca usuarios cuya contraseña ha expirado (Equivalente a `chage -l`).

`Get-ADUser -Filter 'LastLogonDate -lt (Get-Date).AddDays(-90)'`: Encuentra usuarios que no han iniciado sesión en los últimos 90 días.

`Get-ADObject -LDAPFilter "(objectClass=user)"`: Realiza una búsqueda directa usando sintaxis pura de LDAP.
