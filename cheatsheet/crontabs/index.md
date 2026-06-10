# Crontabs y Tareas Programadas

Automatización de tareas periódicas en Linux mediante cron, anacron y systemd timers.

---

## 1. Sintaxis de Cron

```
*    *    *    *    *    comando
│    │    │    │    └── Día de la semana (0-7, 0 y 7 = domingo)
│    │    │    └─────── Mes (1-12)
│    │    └──────────── Día del mes (1-31)
│    └───────────────── Hora (0-23)
└────────────────────── Minuto (0-59)
```

### Operadores especiales

| Operador | Descripción | Ejemplo |
|---|---|---|
| `*` | Cualquier valor | `* * * * *` → cada minuto |
| `,` | Lista de valores | `1,15,30 * * * *` → en el minuto 1, 15 y 30 |
| `-` | Rango | `9-17 * * * *` → de las 9:xx a las 17:xx |
| `/` | Cada N unidades | `*/5 * * * *` → cada 5 minutos |
| `@reboot` | Al reiniciar | `@reboot /script.sh` |
| `@daily` | Una vez al día | Equivale a `0 0 * * *` |
| `@weekly` | Una vez a la semana | Equivale a `0 0 * * 0` |
| `@monthly` | Una vez al mes | Equivale a `0 0 1 * *` |
| `@yearly` | Una vez al año | Equivale a `0 0 1 1 *` |
| `@hourly` | Cada hora | Equivale a `0 * * * *` |

### Ejemplos de expresiones cron

```bash
0 2 * * *           # Cada día a las 02:00
0 9-17 * * 1-5      # Cada hora de 9 a 17, de lunes a viernes
*/15 * * * *        # Cada 15 minutos
0 */6 * * *         # Cada 6 horas (00:00, 06:00, 12:00, 18:00)
0 8 1 * *           # El primer día de cada mes a las 08:00
30 7 * * 1          # Los lunes a las 07:30
0 12 * * 1,3,5      # Lunes, miércoles y viernes a las 12:00
@reboot             # Al arrancar el sistema
```

---

## 2. Gestión de Crontabs

```bash
# Editar el crontab del usuario actual
crontab -e                       # Abre en el editor por defecto ($EDITOR)
EDITOR=vim crontab -e            # Forzar vim como editor

# Ver crontab
crontab -l                       # Listar el crontab del usuario actual
sudo crontab -l -u alice         # Ver el crontab de alice

# Eliminar crontab
crontab -r                       # Eliminar todo el crontab (CUIDADO)
crontab -i                       # Eliminar con confirmación

# Crontab de otro usuario (como root)
sudo crontab -e -u alice
sudo crontab -l -u alice
```

---

## 3. Archivos y Directorios de Cron del Sistema

```bash
/etc/crontab                     # Crontab del sistema (con campo de usuario)
/etc/cron.d/                     # Archivos de cron de aplicaciones
/etc/cron.hourly/                # Scripts que se ejecutan cada hora
/etc/cron.daily/                 # Scripts diarios
/etc/cron.weekly/                # Scripts semanales
/etc/cron.monthly/               # Scripts mensuales
/var/spool/cron/                 # Crontabs de usuarios (generados por crontab -e)

# Formato de /etc/crontab (tiene campo de usuario):
# MIN HORA DÍA MES DIASEM USUARIO COMANDO
0 2 * * * root /usr/bin/backup.sh
*/5 * * * * www-data /opt/check_service.sh
```

---

## 4. Variables de Entorno en Cron

```bash
# Al inicio del crontab se pueden definir variables
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=admin@empresa.com         # Enviar salida a este email (vacío = sin email)
HOME=/root

# Si no se define MAILTO, cron envía la salida por email local
# Para suprimir toda salida:
0 2 * * * /script.sh > /dev/null 2>&1
# Para guardar en log:
0 2 * * * /script.sh >> /var/log/mi_script.log 2>&1
```

---

## 5. Buenas Prácticas

```bash
# 1. Usar rutas absolutas siempre
0 2 * * * /usr/bin/python3 /opt/scripts/backup.py >> /var/log/backup.log 2>&1

# 2. Redirigir stdout y stderr
0 2 * * * /script.sh >> /var/log/script.log 2>&1

# 3. Bloqueo para evitar ejecuciones paralelas
0 * * * * flock -n /tmp/mi_script.lock /script.sh

# 4. Crear script wrapper con manejo de errores
0 2 * * * /opt/scripts/run_backup.sh

# Contenido de run_backup.sh:
#!/bin/bash
set -euo pipefail
LOG=/var/log/backup.log
echo "[$(date)] Iniciando backup" >> $LOG
/opt/scripts/backup.py >> $LOG 2>&1
echo "[$(date)] Backup completado" >> $LOG

# 5. Monitorizar ejecución con systemd (o heartbeat)
0 2 * * * /script.sh && curl -s https://hc-ping.com/TU-UUID

# 6. Probar el script manualmente antes de añadir al cron
# Verificar que funciona con el entorno limitado de cron:
env -i HOME=$HOME PATH=/usr/bin:/bin /script.sh
```

---

## 6. anacron — Para Sistemas que no Están Siempre Encendidos

```bash
# anacron ejecuta tareas con retraso si el sistema estaba apagado
cat /etc/anacrontab

# Formato:
# PERÍODO   RETRASO   IDENTIFICADOR   COMANDO
1           5         cron.daily      run-parts /etc/cron.daily
7           10        cron.weekly     run-parts /etc/cron.weekly
@monthly    15        cron.monthly    run-parts /etc/cron.monthly

# PERÍODO: días entre ejecuciones (1 = diario, 7 = semanal)
# RETRASO: minutos de retraso tras el arranque antes de ejecutar

anacron -f                       # Forzar ejecución de todas las tareas
anacron -n                       # Sin retraso (inmediato)
anacron -u                       # Solo actualizar timestamps
```

---

## 7. systemd Timers — Alternativa Moderna a Cron

```bash
# Listar todos los timers
systemctl list-timers
systemctl list-timers --all      # Incluyendo los inactivos

# Ver estado de un timer
systemctl status mi-tarea.timer

# Crear un timer (par de archivos .service + .timer)
# /etc/systemd/system/mi-backup.service
[Unit]
Description=Backup diario de la base de datos

[Service]
Type=oneshot
ExecStart=/opt/scripts/backup.sh
User=backupuser

# /etc/systemd/system/mi-backup.timer
[Unit]
Description=Timer para backup diario
After=network.target

[Timer]
OnCalendar=*-*-* 02:00:00       # Cada día a las 02:00
RandomizedDelaySec=300          # Retraso aleatorio de hasta 5 min
Persistent=true                 # Ejecutar si se perdió la ejecución programada

[Install]
WantedBy=timers.target

# Activar
sudo systemctl daemon-reload
sudo systemctl enable --now mi-backup.timer

# Sintaxis de OnCalendar
OnCalendar=daily                 # Cada día a medianoche
OnCalendar=weekly                # Cada semana
OnCalendar=monthly               # Cada mes
OnCalendar=Mon,Fri 09:00        # Lunes y viernes a las 9
OnCalendar=*-*-* 00/6:00:00     # Cada 6 horas
OnCalendar=2025-12-25 08:00     # Fecha específica
OnBootSec=15min                  # 15 minutos después del arranque
OnUnitActiveSec=1h               # 1 hora después de la última ejecución
```

---

## 8. Seguridad de Cron

```bash
# Archivos de control de acceso
/etc/cron.allow              # Solo estos usuarios pueden usar cron (whitelist)
/etc/cron.deny               # Estos usuarios NO pueden usar cron (blacklist)
# Si cron.allow existe, solo los listados pueden usar cron
# Si solo existe cron.deny, todos excepto los listados pueden usar cron
# Si no existe ninguno, depende de la implementación (generalmente todos)

# Detectar crons sospechosos (pentesting)
ls -la /etc/cron*
cat /etc/crontab
cat /etc/cron.d/*
crontab -l 2>/dev/null
sudo crontab -l -u root 2>/dev/null
ls /var/spool/cron/crontabs/

# Buscar archivos ejecutados por cron con permisos débiles
find /etc/cron* -type f -perm -o+w 2>/dev/null
find /var/spool/cron -type f 2>/dev/null
```
