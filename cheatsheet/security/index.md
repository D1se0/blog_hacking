# Seguridad y Contraseñas

## Control de políticas de expiración y acceso.

```bash
sudo passwd <usuario>
```

Cambia la contraseña de un usuario.

`-l`: Bloquea la cuenta del usuario (pone un ! en /etc/shadow).

`-u`: Desbloquea la cuenta.

`-S`: Muestra el estado de la cuenta (si está bloqueada o no).

`-d`: Deshabilita el usuario eliminando su contraseña (permite entrar sin pass si el servicio lo permite).

```bash
sudo chage [opciones] <usuario>
```

Gestiona la expiración y caducidad de contraseñas.

`-l`: Muestra la información de expiración detallada actual.

`-M <días>`: Máximo de días entre cambios de contraseña.

`-m <días>`: Mínimo de días entre cambios.

`-W <días>`: Días de aviso antes de la expiración.

`-I <días>`: Días de inactividad tras expirar la pass antes de bloquear la cuenta.

`-E <fecha>`: Fecha de expiración de la cuenta (formato AAAA-MM-DD).

`-d 0`: Fuerza al usuario a cambiar la contraseña en su próximo login.
