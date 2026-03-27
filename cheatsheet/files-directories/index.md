# Gestión de Archivos y Directorios

## Operaciones fundamentales para navegar y manipular el sistema de archivos.

### Navegación y Ubicación

```bash
pwd
```

Muestra la ruta absoluta del directorio actual de trabajo.

```bash
cd /ruta/al/directorio
```

Cambia al directorio especificado.

`cd ..` : Sube un nivel en la jerarquía de directorios.

`cd -` : Vuelve al directorio anterior donde estabas.

`cd ~/` : Regresa al directorio personal (`HOME`) del usuario.

### Listado y Visualización (`ls`)

`ls` [opciones]

Lista el contenido de un directorio.

`-l`: Formato largo (permisos, dueño, tamaño, fecha).

`-a`: Incluye archivos ocultos (los que empiezan por punto).

`-h`: Tamaño en formato legible (human-readable: 1k, 16M, etc.).

`-R`: Lista directorios de forma recursiva.

`-i`: Muestra el identificador del i-nodo asociado.

`-t`: Ordena por fecha de modificación (el más reciente primero).

`-S`: Ordena por tamaño de archivo.

Ejemplos combinados: `ls -lah`, `ls -lai`, `ls -la`.

### Manipulación de Archivos

```bash
mkdir <nombre>
```

Crea un nuevo directorio.

`-p`: Crea directorios de forma recursiva (incluyendo padres si no existen). Ejemplo: `mkdir -p dir1/dir2`.

```bash
touch <archivo>
```

Crea un archivo vacío o actualiza la fecha de acceso/modificación si ya existe.

```bash
cp <origen> <destino>
```

Copia archivos y directorios.

`-r`: Copia directorios de forma recursiva.

`-i`: Pregunta antes de sobrescribir archivos existentes en el destino.

`-p`: Preserva los permisos y fechas originales del archivo.

```bash
mv <origen> <destino>
```

Mueve o renombra archivos y directorios.

```bash
rm <archivo>
```

Borra un archivo.

`-rf`: Borra un directorio y todo su contenido de forma recursiva y forzada.

`-i`: Ejecuta el borrado de forma interactiva (pide confirmación).

```bash
ln -s <objetivo> <nombre_enlace>
```

Crea un enlace simbólico (acceso directo) hacia un archivo o directorio.

### Tipos y Características

```bash
file <archivo>
```

Determina el tipo de archivo (binario, texto, imagen, etc.) con precisión.

```bash
stat <archivo>
```

Muestra información detallada sobre el estado de un archivo (permisos, i-nodos, fechas de acceso).

### Lectura de Contenido

```bash
cat <archivo>
```

Muestra todo el contenido del archivo por pantalla.

`-n`: Muestra el contenido numerando las líneas.

```bash
more <archivo>
```

Visualización de archivos de texto de forma paginada (solo hacia adelante).

```bash
less <archivo>
```

Versión mejorada de `more` que permite navegar hacia adelante y hacia atrás.

```bash
vi / vim <archivo>
```

Editores de texto potentes por consola.

### Comodines (Wildcards) en Bash

Se utilizan para realizar búsquedas o ejecutar comandos sobre múltiples archivos:

`?`: Sustituye un carácter cualquiera.

`\*`: Sustituye cualquier número de caracteres (incluyendo ninguno).

`[abc]`: Sustituye por cualquier carácter del conjunto (`a`, `b` o `c`).

`[a-b]`: Sustituye por un rango de caracteres (ej.).

`{a,b,c}`: Expansión de llaves; se sustituye por cada elemento de la lista.

`[!a]`: Negación; cualquier carácter excepto el indicado.

`\a`: Escapa el carácter para que bash lo interprete literalmente (ej. `\*`).
