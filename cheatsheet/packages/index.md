# Gestión de Paquetes (APT)

## Comandos para la administración de software en sistemas basados en Debian/Ubuntu.

```bash
sudo apt update
```

Actualiza la lista de paquetes de los repositorios para conocer nuevas versiones.

```bash
sudo apt check
```

Comprueba que la actualización de los repositorios se haya realizado correctamente y busca dependencias rotas.

```bash
sudo apt install <paquete>
```

Instala un nuevo paquete en el sistema.
Ejemplo: `sudo apt install vim curl git`.

```bash
sudo apt upgrade
```

Instala dependencias o actualiza paquetes que ya están instalados a sus versiones más recientes.

```bash
sudo apt remove <paquete>
```

Elimina un paquete instalado pero conserva los archivos de configuración.

```bash
sudo apt remove --purge <paquete>
```

Elimina un paquete y también borra sus archivos de configuración.

```bash
sudo apt clean
```

Limpia el caché de paquetes descargados (`.deb`) en `/var/cache/apt/archives/`.

```bash
sudo apt autoclean
```

Limpia el caché eliminando únicamente paquetes viejos que ya no se pueden descargar.

```bash
sudo apt autoremove
```

Elimina automáticamente librerías y dependencias que ya no son necesarias por ningún paquete.

```bash
apt-cache search <término>
```

Busca un paquete determinado en los repositorios por nombre o descripción.

```bash
apt-show-versions (-u)
```

Muestra las versiones de los paquetes instalados y permite ver cuáles pueden actualizarse.
