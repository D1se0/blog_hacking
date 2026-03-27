# Comunicación y Sesión

## Mensajería entre usuarios y control de la sesión de trabajo.

### Mensajes entre Usuarios

```bash
write <usuario>
```

Envía un mensaje directo y en tiempo real a otro usuario conectado.

```bash
mesg [y/n]
```

Habilita (y) o deshabilita (n) la capacidad de recibir mensajes de otros usuarios.

```bash
wall "mensaje"
```

Envía un mensaje de difusión a todos los usuarios conectados actualmente al sistema.

### Control de Sesión y Privilegios

```bash
sudo -i
```

Abre una shell de root manteniendo el entorno del superusuario.

```bash
sudo su
```

Obtiene privilegios de superusuario.

```bash
su -
```

Se convierte en root (o en otro usuario si se indica) cargando su perfil y variables de entorno completas.

```bash
logout
```

Cierra la sesión actual de la shell.

```bash
exit
```

Cierra la terminal o sale del usuario actual (si se usó `su`).

```bash
kill -9 -1
```

Fuerza el cierre de todos los procesos del usuario actual y lo devuelve a la pantalla de login.

### Apagado y Reinicio

```bash
shutdown -h now
```

Apaga el sistema de forma inmediata y segura.

```bash
shutdown -r now
```

Reinicia el sistema inmediatamente.

```bash
shutdown -h 18:45
```

Programa un apagado automático para una hora específica.

```bash
reboot
```

Comando rápido para reiniciar el equipo.

### Alias

```bash
alias <nombre>='<comando>'
```

Crea un atajo personalizado para un comando largo o complejo.

Ejemplos:

`alias c='clear'`.

`alias ll='ls -l --color'`.

Para que sean permanentes, deben añadirse al archivo `~/.bashrc`.
