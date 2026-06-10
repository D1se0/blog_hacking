# Búsqueda y Procesamiento de Texto

Las herramientas de búsqueda y procesamiento de texto son el corazón del trabajo en la línea de comandos. Dominarlas permite automatizar cualquier tarea con datos de texto.

---

## 1. echo y printf

```bash
echo "texto"                     # Muestra texto con salto de línea final
echo -n "texto"                  # Sin salto de línea al final
echo -e "línea1\nlínea2"        # Interpreta escapes: \n, \t, \r, \\, \a
echo -e "\033[31mTexto rojo\033[0m"  # Colores ANSI
echo $'texto\tcon\ttabs'        # Formato $'...' interpreta escapes

printf "%-20s %5d\n" "alice" 1000    # Formato C: %-20s = alineado izquierda 20 chars
printf "%05d\n" 42                   # 00042
printf "%.2f\n" 3.14159              # 3.14
printf "%b" "texto\n"                # Interpreta escapes (como echo -e)
```

---

## 2. grep — Búsqueda de Patrones

```bash
grep "patrón" archivo                    # Buscar en archivo
grep "patrón" archivo1 archivo2          # En múltiples archivos
grep "patrón" *.log                      # Con comodín
comando | grep "patrón"                  # Desde pipe
```

### Opciones esenciales

```bash
grep -i "patrón" archivo         # Insensible a mayúsculas
grep -v "patrón" archivo         # Invertido: líneas que NO coinciden
grep -n "patrón" archivo         # Con número de línea
grep -c "patrón" archivo         # Cuenta líneas con coincidencia (no ocurrencias)
grep -l "patrón" *.log           # Solo nombres de archivos con coincidencias
grep -L "patrón" *.log           # Archivos SIN coincidencias
grep -r "patrón" directorio/     # Recursivo
grep -R "patrón" directorio/     # Recursivo (sigue symlinks)
grep -w "palabra" archivo        # Palabra completa (no subcadena)
grep -x "línea_exacta" archivo   # Línea completa exacta
grep -o "patrón" archivo         # Solo la parte que coincide (una por línea)
grep -h "patrón" *.log           # Sin mostrar nombre de archivo
grep -H "patrón" archivo         # Fuerza mostrar nombre de archivo
grep -m 5 "patrón" archivo       # Máximo 5 coincidencias
grep -A 3 "patrón" archivo       # 3 líneas After (después)
grep -B 3 "patrón" archivo       # 3 líneas Before (antes)
grep -C 3 "patrón" archivo       # 3 líneas de Contexto (antes y después)
grep -q "patrón" archivo         # Silencioso (solo return code, para scripts)
grep -s "patrón" archivo         # Silencia errores de archivos inexistentes
grep --color=always "patrón" archivo  # Fuerza color (útil con less)
grep -a "patrón" binario         # Tratar archivo binario como texto
```

### Expresiones regulares

```bash
# Básicas (BRE — por defecto)
grep "^inicio" archivo           # Líneas que empiezan por "inicio"
grep "fin$" archivo              # Líneas que terminan por "fin"
grep "^$" archivo                # Líneas vacías
grep "a.b" archivo               # a + cualquier carácter + b
grep "a*b" archivo               # Cero o más 'a' seguidos de 'b'
grep "a\+b" archivo              # Uno o más 'a' seguidos de 'b' (BRE necesita \+)
grep "colou\?r" archivo          # color o colour (\? = 0 o 1 ocurrencias en BRE)
grep "[aeiou]" archivo           # Cualquier vocal
grep "[^aeiou]" archivo          # Cualquier no-vocal
grep "[a-z][0-9]" archivo        # Letra minúscula seguida de dígito
grep "\bpalabra\b" archivo       # Límite de palabra

# Extendidas (ERE — con -E o egrep)
grep -E "colou?r" archivo        # color o colour
grep -E "gato|perro" archivo     # gato O perro
grep -E "(ha)+" archivo          # ha, haha, hahaha...
grep -E "\d{3}-\d{4}" archivo    # Teléfono 3-4 dígitos (según implementación)
grep -E "[[:alpha:]]" archivo    # Clases POSIX: alpha, digit, alnum, upper, lower, space, punct

# Perl Compatible (PCRE — con -P)
grep -P "\d{3}" archivo          # Dígitos con Perl regex
grep -P "(?<=usuario: )\w+" archivo  # Lookbehind: captura el usuario tras "usuario: "
grep -P "password\K.*"           # \K reinicia el inicio del match
grep -P "\b(?!sudo)\w+" archivo  # Lookahead negativo
```

### Casos de uso prácticos

```bash
# Buscar IPs en un log
grep -Eo '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' access.log | sort -u

# Buscar emails
grep -Eo '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' archivo.txt

# Buscar contraseñas en código (pentesting)
grep -rn --include="*.php" -i "password\|passwd\|pwd" /var/www/

# Excluir múltiples patrones
grep -v -E "comentario|#|^$" config.conf

# Buscar en archivos comprimidos
zgrep "error" archivo.log.gz
bzgrep "error" archivo.log.bz2
```

---

## 3. find — Búsqueda de Archivos

```bash
find [ruta] [criterios] [acciones]
find .                           # Lista todo desde el directorio actual
find / 2>/dev/null               # Todo el sistema, suprimiendo errores de permiso
```

### Criterios de búsqueda

```bash
# Por nombre
find . -name "*.log"             # Nombre exacto, case sensitive
find . -iname "*.LOG"            # Case insensitive
find . -name "arch*"             # Con comodín
find . -not -name "*.bak"        # Negación: todo excepto .bak
find . \( -name "*.log" -o -name "*.txt" \)  # OR: .log O .txt

# Por tipo
find . -type f                   # Solo archivos
find . -type d                   # Solo directorios
find . -type l                   # Solo symlinks
find . -type f -empty            # Archivos vacíos
find . -type d -empty            # Directorios vacíos

# Por tamaño
find . -size +100M               # Mayores de 100 MB
find . -size -1k                 # Menores de 1 KB
find . -size +1G                 # Mayores de 1 GB
find . -size +1M -size -100M     # Entre 1 y 100 MB

# Por tiempo (n = exactamente n días, +n = más de n, -n = menos de n)
find . -mtime -1                 # Modificados en las últimas 24h
find . -mtime +7                 # Modificados hace más de 7 días
find . -atime -1                 # Accedidos en las últimas 24h
find . -ctime -1                 # Cambio de metadatos en las últimas 24h
find . -newer referencia.txt     # Más recientes que referencia.txt
find . -mmin -60                 # Modificados en los últimos 60 minutos

# Por permisos y propietario
find . -perm 644                 # Exactamente 644
find . -perm -u+s                # Con SUID
find . -perm -g+s                # Con SGID
find . -perm /o+w                # World-writable (cualquier bit 'w' para otros)
find . -perm -002                # World-writable (bit escrito para otros)
find . -user alice               # Propiedad de alice
find . -group developers         # Del grupo developers
find . -nouser                   # Sin dueño (UID no existe)
find . -nogroup                  # Sin grupo (GID no existe)

# Profundidad
find . -maxdepth 2               # Máximo 2 niveles de profundidad
find . -mindepth 2               # Mínimo 2 niveles
find . -maxdepth 1 -type f       # Solo archivos en el directorio actual

# Combinaciones con AND (-a), OR (-o), NOT (!)
find . -type f -name "*.sh" -perm -u+x    # Scripts ejecutables
find . \( -name "*.jpg" -o -name "*.png" \)  # jpg O png
find . -type f ! -name "*.txt"             # Archivos que no son .txt
```

### Acciones

```bash
# -print (por defecto)
find . -name "*.log" -print

# -exec: ejecutar comando por cada resultado (\; = uno a uno, + = agrupar)
find . -name "*.sh" -exec chmod +x {} \;        # Dar ejecución a cada script
find . -name "*.tmp" -exec rm -v {} \;           # Borrar archivos temporales
find . -name "*.log" -exec gzip {} \;            # Comprimir logs
find . -type f -exec ls -la {} +                 # Listar (más eficiente con +)
find . -name "*.conf" -exec grep -l "password" {} \;  # Buscar texto dentro

# -execdir: ejecuta en el directorio del archivo encontrado (más seguro)
find . -name "*.py" -execdir python3 -m py_compile {} \;

# -delete: borrar (cuidado — irreversible)
find . -name "*.tmp" -delete
find . -type d -empty -delete                    # Borrar directorios vacíos

# -ls: formato largo (como ls -l)
find . -name "*.log" -ls

# -printf: formato personalizado
find . -type f -printf "%p\t%s\t%TY-%Tm-%Td\n"  # ruta, tamaño, fecha
find . -name "*.log" -printf "%f\n"               # Solo nombre de archivo

# Combinación con xargs (para procesar muchos resultados eficientemente)
find . -name "*.log" -print0 | xargs -0 wc -l   # Contar líneas de todos los .log
find . -name "*.jpg" -print0 | xargs -0 -I{} mv {} /fotos/
```

---

## 4. sed — Editor de Flujo

`sed` procesa texto línea a línea. Es ideal para sustituciones, eliminaciones e inserciones masivas.

```bash
sed 'instrucción' archivo        # Sin modificar el archivo
sed -i 'instrucción' archivo     # Edición in-place (MODIFICA el archivo)
sed -i.bak 'instrucción' archivo # In-place con backup (.bak)
sed -n 'instrucción' archivo     # Sin output por defecto (solo lo indicado)
sed -E 'instrucción' archivo     # Usar expresiones regulares extendidas
sed -f script.sed archivo        # Instrucciones desde un archivo
```

### Sustitución (s/patrón/reemplazo/)

```bash
sed 's/hola/adiós/' archivo      # Primera ocurrencia por línea
sed 's/hola/adiós/g' archivo     # Todas las ocurrencias (global)
sed 's/hola/adiós/gi' archivo    # Global, insensible a mayúsculas
sed 's/hola/adiós/2' archivo     # Solo la segunda ocurrencia
sed 's/hola/adiós/gp' archivo    # Global + print (con -n muestra solo líneas modificadas)

# Delimitador alternativo (útil cuando el patrón contiene /)
sed 's|/var/log|/opt/log|g' archivo
sed 's#http://old.com#http://new.com#g' archivo

# Grupos de captura
sed 's/\(hola\) \(mundo\)/\2 \1/' archivo    # Intercambiar palabras (BRE)
sed -E 's/(hola) (mundo)/\2 \1/' archivo     # Con ERE (-E)
sed -E 's/([0-9]+)\.([0-9]+)/\2.\1/' archivo # Intercambiar números

# Backreferences en el patrón
sed 's/\(.\)\1/[DUPLICADO]/' archivo          # Detectar caracteres duplicados

# Sustitución solo en líneas que coincidan con un patrón
sed '/^#/s/^#//' archivo                      # Quitar # al inicio de comentarios
sed '/error/s/error/ERROR/g' archivo          # MAYÚSCULAS solo en líneas con "error"
```

### Rangos de líneas y direcciones

```bash
sed '5s/a/A/' archivo            # Solo línea 5
sed '5,10s/a/A/' archivo         # Líneas 5 a 10
sed '5,$s/a/A/' archivo          # Línea 5 hasta el final
sed '/inicio/,/fin/s/a/A/' archivo  # Entre patrones
sed '1~2s/a/A/' archivo          # Líneas impares (1, 3, 5...)
sed '0~2s/a/A/' archivo          # Líneas pares (2, 4, 6...)
```

### Eliminar líneas (d)

```bash
sed '3d' archivo                 # Eliminar línea 3
sed '3,7d' archivo               # Eliminar líneas 3 a 7
sed '/patrón/d' archivo          # Eliminar líneas que contienen el patrón
sed '/^$/d' archivo              # Eliminar líneas vacías
sed '/^#/d' archivo              # Eliminar comentarios
sed '/^[[:space:]]*$/d' archivo  # Eliminar líneas solo con espacios/tabs
sed '$d' archivo                 # Eliminar última línea
```

### Imprimir líneas (p)

```bash
sed -n '5p' archivo              # Imprimir línea 5
sed -n '5,10p' archivo           # Imprimir líneas 5 a 10
sed -n '/patrón/p' archivo       # Imprimir líneas con el patrón (= grep)
sed -n '$p' archivo              # Imprimir última línea
```

### Insertar y añadir (i, a, c)

```bash
sed '3i\Nueva línea antes' archivo    # Insertar antes de línea 3
sed '3a\Nueva línea después' archivo  # Insertar después de línea 3
sed '3c\Reemplazar línea 3' archivo   # Reemplazar línea 3 completamente
sed '/patrón/a\Línea añadida' archivo # Añadir después de líneas con patrón
```

### Casos prácticos

```bash
# Eliminar espacios al inicio y final de cada línea
sed 's/^[[:space:]]*//;s/[[:space:]]*$//' archivo

# Comentar todas las líneas de un archivo
sed 's/^/#/' archivo

# Descomentar todas las líneas
sed 's/^#//' archivo

# Añadir línea en blanco entre cada línea
sed 'G' archivo

# Mostrar solo las líneas 10-20
sed -n '10,20p' archivo

# Reemplazar la cuarta columna (separada por :) por "XXXX"
sed 's/\([^:]*:\)\{3\}[^:]*/\1XXXX/' /etc/passwd

# Eliminar comentarios y líneas vacías de un config
sed '/^#/d; /^$/d' archivo.conf

# Añadir cabecera y pie a un archivo
sed -i '1i\# Cabecera' archivo
sed -i '$a\# Pie' archivo

# Inversión de un archivo (revertir orden líneas)
sed -n '1!G;h;$p' archivo         # Equivalente a tac
```

---

## 5. awk — Procesamiento de Campos

`awk` trata el texto como una tabla: divide cada línea en campos y permite procesarlos con lógica de programación.

```bash
awk 'programa' archivo
awk -F: 'programa' archivo        # Separador de campo personalizado (: en este caso)
awk -F'[,;]' 'programa' archivo   # Múltiples separadores con regex
awk -v var=valor 'programa' archivo  # Pasar variable desde el shell
awk -f script.awk archivo         # Programa desde archivo
```

### Variables especiales

| Variable | Descripción |
|---|---|
| `$0` | Línea completa actual |
| `$1`, `$2`... | Campo 1, 2... (separados por FS) |
| `$NF` | Último campo |
| `$(NF-1)` | Penúltimo campo |
| `NR` | Número de línea actual (Number of Record) |
| `NF` | Número de campos de la línea actual (Number of Fields) |
| `FS` | Separador de campos entrada (Field Separator, por defecto espacio/tab) |
| `OFS` | Separador de campos salida (Output Field Separator) |
| `RS` | Separador de registros (Record Separator, por defecto \n) |
| `ORS` | Separador de registros salida |
| `FILENAME` | Nombre del archivo que se está procesando |
| `FNR` | Número de línea dentro del archivo actual (útil con múltiples archivos) |
| `ARGC` / `ARGV` | Número y lista de argumentos |

### Estructura de un programa awk

```bash
awk 'BEGIN { inicio } /patrón/ { acción } END { final }' archivo
#    └──────────────┘ └───────────────────┘ └──────────┘
#    Antes de leer    Por cada línea que      Después de
#    ninguna línea    coincida con el patrón  leer todo
```

### Ejemplos progresivos

```bash
# Imprimir columnas específicas
awk '{print $1}' archivo          # Primera columna
awk '{print $1, $3}' archivo      # Columnas 1 y 3 (con espacio)
awk '{print $1 ":" $3}' archivo   # Con separador personalizado
awk '{print $NF}' archivo         # Última columna
awk -F: '{print $1}' /etc/passwd  # Nombres de usuario (sep=:)
awk -F: '{print $1, $7}' /etc/passwd  # Usuario y shell

# Filtrado
awk '/error/' archivo             # Líneas con "error" (como grep)
awk '!/comentario/' archivo       # Líneas SIN "comentario"
awk '$3 > 100' archivo            # Tercera columna mayor de 100
awk '$1 == "Alice"' archivo       # Primera columna igual a "Alice"
awk 'NR >= 5 && NR <= 10' archivo # Líneas 5 a 10
awk 'NF > 0' archivo              # Líneas no vacías

# Cálculos
awk '{sum += $3} END {print sum}' archivo          # Suma de la tercera columna
awk '{sum += $3} END {print sum/NR}' archivo       # Media
awk 'BEGIN{max=0} $3>max{max=$3} END{print max}' archivo  # Máximo
awk '{if($3>max) max=$3} END{print max}' archivo   # Equivalente

# Formateo de salida
awk '{printf "%-20s %8.2f\n", $1, $3}' archivo    # Columnas alineadas
awk '{printf "%05d: %s\n", NR, $0}' archivo        # Numeración con ceros

# Condiciones y lógica
awk '$3 > 1000 {print $1, "ALTO"} $3 <= 1000 {print $1, "NORMAL"}' archivo

# OFS: separador de salida
awk -F: 'BEGIN{OFS=","} {print $1, $3, $7}' /etc/passwd  # CSV de usuario,UID,shell

# Contar ocurrencias con arrays
awk '{count[$1]++} END {for(k in count) print k, count[k]}' log.txt

# Top N más frecuentes
awk '{count[$1]++} END {for(k in count) print count[k], k}' log.txt | sort -rn | head -10

# Procesar solo ciertas líneas
awk 'NR==1 || /patrón/' archivo   # Primera línea + las que coincidan

# Cambiar separador de salida
awk -F: '{OFS="\t"; $1=$1; print}' /etc/passwd  # : → tab

# Calcular tamaños con ls
ls -la | awk '/^-/ {sum+=$5} END {print "Total:", sum, "bytes"}'
```

### awk complejo: script de análisis de logs

```bash
# Analizar Apache access.log: contar peticiones por IP, código y método
awk '{
    ip=$1; method=$6; code=$9;
    gsub(/"/, "", method);
    requests[ip]++;
    codes[code]++;
    methods[method]++;
} END {
    print "=== Top 10 IPs ===";
    for(ip in requests) print requests[ip], ip
    | "sort -rn | head -10";

    print "\n=== Códigos HTTP ===";
    for(c in codes) print codes[c], c
    | "sort -rn";
}' access.log
```

---

## 6. sort, uniq, wc, cut, tr

### sort — Ordenar

```bash
sort archivo                     # Ordenación alfabética
sort -r archivo                  # Inverso
sort -n archivo                  # Numérico
sort -rn archivo                 # Numérico inverso
sort -f archivo                  # Case insensitive
sort -u archivo                  # Eliminar duplicados al ordenar
sort -k 2 archivo                # Ordenar por columna 2
sort -k 2,2 archivo              # Solo por columna 2 (no seguir con la 3)
sort -k 2 -k 1 archivo           # Por columna 2, luego 1
sort -t: -k 3 -n /etc/passwd     # Por UID (sep=:, columna 3, numérico)
sort -h archivo                  # Orden "humano": 1K < 10K < 1M
sort -V archivo                  # Orden de versiones: 1.9 < 1.10 < 2.0
sort -R archivo                  # Aleatorio
sort --parallel=4 grande.txt     # Usar 4 hilos (archivos muy grandes)
```

### uniq — Líneas únicas/duplicadas

```bash
# Nota: uniq solo detecta duplicados CONSECUTIVOS — ordenar antes con sort
sort archivo | uniq              # Eliminar duplicados
sort archivo | uniq -d           # Solo líneas duplicadas
sort archivo | uniq -u           # Solo líneas únicas (no duplicadas)
sort archivo | uniq -c           # Contar ocurrencias de cada línea
sort archivo | uniq -c | sort -rn  # Más frecuente primero

uniq -i archivo                  # Case insensitive
uniq -f 2 archivo                # Ignorar primeros 2 campos al comparar
uniq -s 4 archivo                # Ignorar primeros 4 caracteres
uniq -w 10 archivo               # Comparar solo primeros 10 caracteres
```

### wc — Contar

```bash
wc archivo                       # Líneas, palabras, bytes
wc -l archivo                    # Solo líneas
wc -w archivo                    # Solo palabras
wc -c archivo                    # Solo bytes
wc -m archivo                    # Solo caracteres (diferente a bytes con UTF-8)
wc -L archivo                    # Línea más larga (número de chars)
wc -l *.log                      # Contar líneas en múltiples archivos
find . -name "*.py" | wc -l      # Contar número de archivos .py
```

### cut — Extraer columnas/caracteres

```bash
cut -d: -f1 /etc/passwd          # Campo 1 separado por :
cut -d: -f1,3 /etc/passwd        # Campos 1 y 3
cut -d: -f1-3 /etc/passwd        # Campos 1 a 3
cut -d, -f2- datos.csv           # Desde campo 2 hasta el final
cut -c1-10 archivo               # Caracteres 1 a 10
cut -c5 archivo                  # Solo carácter 5
cut -c1-10,20-30 archivo         # Rangos múltiples
cut -d'\t' -f2 archivo           # Separado por tab (también: -d$'\t')

# Alternativa con awk (más flexible)
awk -F: '{print $1}' /etc/passwd  # Equivalente a cut -d: -f1
```

### tr — Transformar caracteres

```bash
tr 'abc' 'ABC' < archivo         # Reemplazar a→A, b→B, c→C
tr '[:lower:]' '[:upper:]' < archivo  # Convertir a mayúsculas
tr '[:upper:]' '[:lower:]' < archivo  # Convertir a minúsculas
tr -d '\r' < archivo.txt         # Eliminar retornos de carro (Windows → Unix)
tr -d '[:digit:]' < archivo      # Eliminar todos los dígitos
tr -s ' ' < archivo              # Comprimir múltiples espacios en uno
tr -s ' ' '\n' < archivo         # Convertir espacios en saltos de línea
tr ' ' '_' < archivo             # Espacios → guiones bajos
tr -cd '[:print:]' < binario     # Mantener solo caracteres imprimibles
echo "hola mundo" | tr ' ' '\n' | sort | tr '\n' ' '  # Ordenar palabras

# Rangos
tr 'a-z' 'A-Z' < archivo         # Minúsculas → mayúsculas
tr '0-9' '*' < archivo           # Dígitos → asteriscos
```

---

## 7. Herramientas Adicionales

### head y tail

```bash
head archivo                     # Primeras 10 líneas
head -n 25 archivo               # Primeras 25 líneas
head -c 100 archivo              # Primeros 100 bytes

tail archivo                     # Últimas 10 líneas
tail -n 25 archivo               # Últimas 25 líneas
tail -c 100 archivo              # Últimos 100 bytes
tail -f archivo                  # Seguir en tiempo real (logs)
tail -F archivo                  # Como -f pero reconecta si rota el archivo
tail -n +5 archivo               # Desde la línea 5 hasta el final
```

### xargs — Construir comandos desde stdin

```bash
find . -name "*.log" | xargs rm                # Borrar archivos encontrados
find . -name "*.txt" | xargs grep "error"      # Buscar en archivos encontrados
ls *.jpg | xargs -I{} convert {} {}.png        # Convertir imágenes
cat urls.txt | xargs -n1 curl -O               # Descargar URLs una a una
find . -name "*.log" -print0 | xargs -0 rm    # Seguro con espacios en nombres (-print0 + -0)
find . -type f | xargs -P 4 -I{} gzip {}      # Comprimir en paralelo (4 procesos)
echo "a b c d" | xargs -n2                    # Agrupar de 2 en 2
```

### paste — Unir archivos por columnas

```bash
paste archivo1 archivo2          # Une las líneas de dos archivos con tab
paste -d, archivo1 archivo2      # Separado por coma (CSV)
paste -d: /etc/passwd /etc/shadow  # Unir con separador :
paste -s archivo                 # Convierte columna en fila (todas en una línea)
paste - - - < archivo            # Agrupar en 3 columnas
```

### join — Unir archivos por campo común

```bash
join archivo1 archivo2           # Une por el primer campo (ambos deben estar ordenados)
join -t: -1 3 -2 1 /etc/passwd /etc/group  # Unir por campo 3 de passwd y 1 de group
join -a 1 archivo1 archivo2      # Mantener líneas sin coincidencia del archivo 1 (LEFT JOIN)
join -a 2 archivo1 archivo2      # Mantener líneas sin coincidencia del archivo 2 (RIGHT JOIN)
```

### diff — Comparar archivos

```bash
diff archivo1 archivo2           # Diferencias básicas
diff -u archivo1 archivo2        # Formato unificado (más legible)
diff -y archivo1 archivo2        # Lado a lado
diff -i archivo1 archivo2        # Ignorar mayúsculas
diff -w archivo1 archivo2        # Ignorar espacios en blanco
diff -B archivo1 archivo2        # Ignorar líneas vacías
diff -r dir1/ dir2/              # Comparar directorios recursivamente
diff --color archivo1 archivo2   # Con colores
vimdiff archivo1 archivo2        # Comparación interactiva visual en vim

patch archivo < cambios.patch    # Aplicar un parche generado con diff
diff -u original.txt modificado.txt > cambios.patch  # Crear parche
```

### tee — Bifurcar la salida

```bash
comando | tee archivo            # Muestra en pantalla Y guarda en archivo
comando | tee -a archivo         # Añade al archivo (no sobreescribe)
comando | tee archivo1 archivo2  # Guarda en múltiples archivos
comando | tee archivo | otro_comando  # Guarda Y sigue el pipeline
```

---

## 8. Expresiones Regulares — Referencia Completa

### Metacaracteres básicos

| Metacaracter | Descripción | Ejemplo |
|---|---|---|
| `.` | Cualquier carácter (excepto \n) | `a.c` → abc, a1c, a c |
| `^` | Inicio de línea | `^hola` → "hola mundo" |
| `$` | Fin de línea | `mundo$` → "hola mundo" |
| `*` | 0 o más del anterior | `ab*c` → ac, abc, abbc |
| `+` | 1 o más del anterior (ERE) | `ab+c` → abc, abbc |
| `?` | 0 o 1 del anterior (ERE) | `colou?r` → color, colour |
| `\|` | OR (ERE: `\|` o `|` con -E) | `gato\|perro` |
| `{n}` | Exactamente n repeticiones | `a{3}` → aaa |
| `{n,m}` | Entre n y m repeticiones | `a{2,4}` → aa, aaa, aaaa |
| `{n,}` | n o más repeticiones | `a{2,}` → aa, aaa... |

### Clases de caracteres

| Clase | Descripción |
|---|---|
| `[abc]` | Cualquiera de a, b, c |
| `[^abc]` | Cualquiera excepto a, b, c |
| `[a-z]` | Rango de a a z |
| `[a-zA-Z0-9]` | Alfanumérico |
| `[:alpha:]` | Letras (POSIX) |
| `[:digit:]` | Dígitos 0-9 (POSIX) |
| `[:alnum:]` | Letras y dígitos (POSIX) |
| `[:space:]` | Espacios, tabs, newlines (POSIX) |
| `[:upper:]` | Mayúsculas (POSIX) |
| `[:lower:]` | Minúsculas (POSIX) |
| `[:punct:]` | Puntuación (POSIX) |
| `[:print:]` | Caracteres imprimibles (POSIX) |

### Escapes especiales (Perl/PCRE con grep -P)

| Escape | Descripción |
|---|---|
| `\d` | Dígito (= `[0-9]`) |
| `\D` | No dígito |
| `\w` | Alfanumérico + _ (= `[a-zA-Z0-9_]`) |
| `\W` | No alfanumérico |
| `\s` | Espacio en blanco |
| `\S` | No espacio |
| `\b` | Límite de palabra |
| `\B` | No límite de palabra |
| `\t` | Tab |
| `\n` | Nueva línea |

### Lookahead y lookbehind (PCRE)

```bash
grep -P "(?<=usuario: )\w+"      # Lookbehind: lo que sigue a "usuario: "
grep -P "\w+(?= años)"           # Lookahead: lo que precede a " años"
grep -P "(?<!no )activo"         # Lookbehind negativo
grep -P "activo(?! siempre)"     # Lookahead negativo
```

---

## 9. Pipelines y Técnicas Avanzadas

```bash
# Múltiples transformaciones en cadena
cat /etc/passwd | grep -v "^#" | cut -d: -f1,3,7 | sort -t: -k2 -n

# Procesar salida de un comando como archivo
diff <(ls dir1) <(ls dir2)       # Process substitution
wc -l <(find . -name "*.py")     # Contar archivos sin pipe

# Guardar en variable el resultado de un pipeline
count=$(find . -name "*.log" | wc -l)
echo "Hay $count archivos de log"

# Procesar en paralelo
find . -name "*.jpg" | parallel convert {} {.}.png  # GNU parallel
find . -name "*.gz" | xargs -P 8 -I{} gunzip {}    # xargs paralelo

# Transformar JSON (requiere jq)
curl -s https://api.github.com/users/alice | jq '.name, .public_repos'
cat datos.json | jq '.[] | select(.activo == true) | .nombre'

# Procesar CSV con awk
awk -F, 'NR>1 {sum+=$3} END {print "Total:", sum}' datos.csv  # Saltar cabecera

# Estadísticas básicas con awk
awk '{sum+=$1; sq+=$1^2; n++} END {
    media=sum/n;
    var=(sq/n)-media^2;
    print "N:", n, "Media:", media, "Desv.std:", sqrt(var)
}' numeros.txt
```
