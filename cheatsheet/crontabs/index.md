# Automatización (Crontab)

## Programación de tareas para su ejecución periódica automática.

```bash
crontab -e
```

Abre el editor para modificar las tareas programadas del usuario actual.

```bash
crontab -l
```

Lista todas las tareas programadas para el usuario.

```bash
crontab -r
```

Elimina todas las tareas programadas del usuario.

## Formato de Crontab

minuto hora dia_mes mes dia_semana comando

Campos:

minuto 0-59

hora 0-23

dia_mes 1-31

mes 1-12

dia_semana 0-7 (0 y 7 = domingo)

### Ejemplos

- - - - - comando
          → Se ejecuta cada minuto.

0 2 \* \* \* comando
→ Se ejecuta todos los días a las 02:00.

_/15 _ \* \* \* comando
→ Se ejecuta cada 15 minutos.

0 _/6 _ \* \* comando
→ Se ejecuta cada 6 horas.

@reboot comando
→ Se ejecuta una vez al iniciar el sistema.
