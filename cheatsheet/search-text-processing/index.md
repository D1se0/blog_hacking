# Búsqueda y Procesamiento de Texto

## Herramientas potentes para filtrar y manipular datos.

### Echo

```bash
echo "texto"
```

Escribe texto por la salida estándar (normalmente la pantalla).

`-e`: Interpreta caracteres especiales como `\n` (salto de línea) o `\t` (tabulación).

`-n`: No imprime el salto de línea final.

### Grep (Búsqueda de patrones)

```bash
grep [opciones] "patrón" <archivo>
```

Busca coincidencias de texto dentro de archivos.

`-c`: Cuenta el número de líneas coincidentes.

`-i`: Ignora mayúsculas y minúsculas en la búsqueda.

`-v`: Muestra las líneas que NO contienen el patrón (inversa).

`-n`: Muestra el número de línea de cada coincidencia.

`-r`: Búsqueda recursiva en todos los directorios.

`-l`: Muestra solo el nombre de los archivos con coincidencias.

`-E`: Permite el uso de expresiones regulares extendidas.

### Find (Búsqueda de archivos)

```bash
find [ruta] [filtros]
```

Busca archivos y directorios en el sistema de archivos.

`-name`: Busca por nombre exacto (permite comodines entre comillas).

`-iname`: Busca por nombre ignorando mayúsculas.

`-type d`: Busca solo directorios.

`-type f`: Busca solo archivos.

`-size [+/-]X`: Busca por tamaño (ej. +10M busca mayores a 10 Megas).

`-mtime -X`: Busca archivos modificados en los últimos X días.

`-perm <modo>`: Busca por permisos específicos (ej. `-perm 777`).

`-user <nombre>`: Busca archivos pertenecientes a un usuario.

`-exec <comando> {} \;`: Ejecuta un comando sobre cada archivo encontrado.

### Manipulación de Líneas y Columnas

```bash
sort <archivo>
```

Ordena las líneas de texto.

`-r`: Orden inverso (descendente).

`-f`: Ignora mayúsculas al ordenar.

`-n`: Ordenación numérica.

`-k X`: Ordena por la columna X.

```bash
uniq <archivo>
```

Elimina o reporta líneas repetidas (el archivo debe estar ordenado antes).

`-c`: Cuenta las ocurrencias de cada línea.

`-d`: Muestra solo las líneas que están duplicadas.

`-u`: Muestra solo las líneas que no están repetidas.

```bash
wc <archivo>
```

Cuenta líneas, palabras y caracteres.

`-l`: Cuenta líneas.

`-w`: Cuenta palabras.

`-c`: Cuenta bytes.

`-m`: Cuenta caracteres.

```bash
head -n X <archivo>
```

Muestra las primeras X líneas del archivo.

```bash
tail -n X <archivo>
```

Muestra las últimas X líneas del archivo.

`-f`: "Sigue" el archivo en tiempo real, ideal para ver logs mientras crecen.

```bash
cut [opciones] <archivo>
```

Corta secciones o campos de cada línea de un archivo.

`-d <delimitador>`: Define el carácter separador (ej. `":"` o `","`).

`-f <campo>`: Indica el número de columna a extraer.

`-c <rango>`: Corta por posición de caracteres (ej. `-c 1-10`).

Ejemplo: `cut -d ":" -f 1 /etc/passwd` extrae los nombres de usuario.

### Sed (Editor de flujo)

Herramienta para transformar texto en tuberías o archivos.

Sustitución: `sed 's/viejo/nuevo/'` (sustituye la primera vez en cada línea).

Sustitución `global: sed 's/viejo/nuevo/g'` (sustituye todas las ocurrencias).

Eliminación: `sed '1d'` (borra la primera línea), `sed '$d'` (borra la última).

Eliminación por patrón: `sed '/patrón/d'` (borra las líneas que lo contienen).

Impresión: `sed -n '5,10p'` (muestra solo de la línea 5 a la 10).

Edición directa: `sed -i 's/v/n/' archivo` (modifica el archivo original, sin volcarlo a pantalla).

### Tr (Traductor de caracteres)

```bash
tr [opciones] conjunto1 [conjunto2]
```

Traduce o borra caracteres de la entrada estándar.

Sustitución: `echo "abc" | tr 'a' 'z'` resulta en "zbc".

Eliminación: `-d` borra los caracteres indicados. Ejemplo: `tr -d ' '` elimina espacios.

Comprimir repetidos: `-s` reduce caracteres consecutivos idénticos a uno solo.

Complemento: `-c` actúa sobre todo lo que NO está en el conjunto1.

Clases útiles: `[:upper:]`, `[:lower:]`, `[:digit:]`, `[:space:]`, `[:punct:]`.
