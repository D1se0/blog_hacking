# Compresión y Archivado

## Gestión de archivos comprimidos y empaquetados.

### Gzip y Gunzip

```bash
gzip <archivo>
```

Comprime un archivo individual resultando en `.gz`.

`-9`: Utiliza la máxima compresión posible (más lento pero genera archivos menores).

```bash
gunzip <archivo.gz>
```

Descomprime un archivo `.gz`.

Tar (Archivador)

```bash
tar [opciones] <nombre_archivo.tar> <objetivos>
```

Opciones principales:

`-c`: Crear un nuevo archivo agrupado.

`-x`: Extraer el contenido de un archivo.

`-z`: Comprimir o descomprimir usando gzip automáticamente.

`-v`: Modo detallado, muestra los archivos mientras se procesan.

`-f`: Permite especificar el nombre del archivo resultante.

`-j`: Comprimir o descomprimir usando bzip2 (mejor compresión que gzip).

`-t`: Lista el contenido de un archivo `.tar` sin extraerlo.

Ejemplo Crear: `tar cvfz copia.tgz /etc` (agrupa y comprime `/etc`).

Ejemplo Extraer: `tar xvfz copia.tgz` (descomprime y extrae en el dir actual).
