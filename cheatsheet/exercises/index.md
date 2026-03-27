# Ejercicios Bash

Primero tendremos que preparar el entorno para poder practicar dichos ejercicios.

```bash
# Crear archivo1.txt con contenido variado
cat > archivo1.txt << 'EOF'
Juan Perez,30,Madrid,555-1234
Ana Garcia,25,Barcelona,555-5678
Luis Martinez,40,Valencia,555-9012
Maria Lopez,22,Madrid,555-3456
Carlos Ruiz,35,Barcelona,555-7890
EOF

# Crear archivo2.txt con números y texto
cat > archivo2.txt << 'EOF'
12 manzanas
5 peras
8 naranjas
3 platanos
15 fresas
7 kiwis
EOF

# Crear archivo3.txt con log de ejemplo
cat > archivo3.txt << 'EOF'
2024-01-15 10:30:45 ERROR Conexion fallida
2024-01-15 10:31:22 INFO Usuario login
2024-01-15 10:32:10 WARN Memoria baja
2024-01-15 10:33:05 ERROR Timeout
2024-01-15 10:34:30 INFO Backup completado
2024-01-15 10:35:18 ERROR Disco lleno
EOF

# Crear estructura de directorios para find
mkdir -p test/{dir1,dir2,dir3}
touch test/file1.txt test/file2.log test/file3.conf
touch test/dir1/file4.txt test/dir1/file5.log
touch test/dir2/file6.txt test/dir2/file7.conf
touch test/dir3/file8.log test/dir3/file9.txt
EOF
```

# EJERCICIOS

### 1. **echo** - Mostrar texto y variables

```bash
# Ejercicio 1.1: Muestra "Hola Mundo"
# Ejercicio 1.2: Muestra la fecha actual usando el comando date
# Ejercicio 1.3: Muestra tu nombre de usuario y directorio actual
```

### 2. **grep** - Buscar patrones

```bash
# Ejercicio 2.1: Busca todas las líneas que contengan "Madrid" en archivo1.txt
# Ejercicio 2.2: Busca líneas que contengan "ERROR" en archivo3.txt
# Ejercicio 2.3: Busca líneas que NO contengan "Barcelona"
# Ejercicio 2.4: Busca líneas que empiecen con "2024-01-15"
# Ejercicio 2.5: Cuenta cuántas líneas contienen números de teléfono (formato 555-XXXX)
```

### 3. **sed** - Stream editor

```bash
# Ejercicio 3.1: Reemplaza todas las comas por puntos y coma en archivo1.txt
# Ejercicio 3.2: Elimina la tercera línea de archivo1.txt
# Ejercicio 3.3: Muestra solo las líneas 2-4 de archivo3.txt
# Ejercicio 3.4: Añade "---" al principio de cada línea en archivo2.txt
# Ejercicio 3.5: Elimina todas las líneas que contengan "ERROR"
```

### 4. **awk** - Procesamiento de texto por columnas

```bash
# Ejercicio 4.1: Muestra solo los nombres (primera columna) de archivo1.txt
# Ejercicio 4.2: Muestra nombre y ciudad de personas mayores de 30 años
# Ejercicio 4.3: Calcula la suma de las edades en archivo1.txt
# Ejercicio 4.4: Muestra el promedio de edades
# Ejercicio 4.5: Muestra las frutas (segunda columna) con cantidad > 10
```

### 5. **tr** - Traducir o eliminar caracteres

```bash
# Ejercicio 5.1: Convierte todo archivo1.txt a mayúsculas
# Ejercicio 5.2: Elimina todos los dígitos de archivo2.txt
# Ejercicio 5.3: Reemplaza espacios por guiones bajos en archivo2.txt
# Ejercicio 5.4: Comprime múltiples espacios en uno solo
# Ejercicio 5.5: Elimina las vocales de archivo3.txt
```

### 6. **find** - Buscar archivos

```bash
# Ejercicio 6.1: Encuentra todos los archivos .txt en test/
# Ejercicio 6.2: Encuentra archivos modificados en los últimos 5 minutos
# Ejercicio 6.3: Encuentra todos los directorios
# Ejercicio 6.4: Encuentra archivos con tamaño 0 (vacío)
# Ejercicio 6.5: Ejecuta 'ls -l' sobre los archivos .log encontrados
```

### 7. **Comodines** `* ? []`

```bash
# Ejercicio 7.1: Lista todos los archivos .txt y .log en test/
# Ejercicio 7.2: Lista archivos que empiecen con "file" en test/
# Ejercicio 7.3: Lista archivos con nombres de 4 caracteres seguido de .txt
# Ejercicio 7.4: Lista archivos que tengan un número en el nombre
```

### 8. **Combinación de comandos** (pipes)

```bash
# Ejercicio 8.1: Encuentra todas las líneas con "ERROR" en archivo3.txt y muéstralas ordenadas
# Ejercicio 8.2: Muestra las 2 ciudades más comunes en archivo1.txt
# Ejercicio 8.3: Encuentra todos los archivos .txt, cuenta cuántos hay
# Ejercicio 8.4: De archivo2.txt, ordena por cantidad numérica
# Ejercicio 8.5: Muestra el nombre de la persona más joven
```

### 9. **Más ejercicios prácticos**

```bash
# Ejercicio 9.1: Extrae todos los números de teléfono de archivo1.txt
# Ejercicio 9.2: Crea un resumen: "Ciudad: X - Personas: Y" para cada ciudad
# Ejercicio 9.3: Encuentra la palabra más larga en archivo3.txt
# Ejercicio 9.4: Muestra las líneas de archivo1.txt ordenadas por edad (tercer campo)
# Ejercicio 9.5: Cuenta cuántos ERROR, INFO y WARN hay en archivo3.txt
```

### 10. **Expresiones regulares**

```bash
# Ejercicio 10.1: Encuentra líneas que comiencen con letra mayúscula
# Ejercicio 10.2: Encuentra direcciones de email (patrón: algo@algo.algo)
# Ejercicio 10.3: Encuentra números de teléfono con formato XXX-XXXX
# Ejercicio 10.4: Valida formato de fecha (YYYY-MM-DD)
```

# Solución

## 1. echo

```bash
# 1.1
echo "Hola Mundo"

# 1.2
echo "La fecha es: $(date)"

# 1.3
echo "Usuario: $USER, Directorio: $PWD"
```

## 2. grep

```bash
# 2.1
grep "Madrid" archivo1.txt

# 2.2
grep "ERROR" archivo3.txt

# 2.3
grep -v "Barcelona" archivo1.txt

# 2.4
grep "^2024-01-15" archivo3.txt

# 2.5
grep -c "[0-9]\{3\}-[0-9]\{4\}" archivo1.txt
```

## 3. sed

```bash
# 3.1
sed 's/,/;/g' archivo1.txt

# 3.2
sed '3d' archivo1.txt

# 3.3
sed -n '2,4p' archivo3.txt

# 3.4
sed 's/^/--- /' archivo2.txt

# 3.5
sed '/ERROR/d' archivo3.txt
```

## 4. awk

```bash
# 4.1
awk -F',' '{print $1}' archivo1.txt

# 4.2
awk -F',' '$3 > 30 {print $1, $3}' archivo1.txt

# 4.3
awk -F',' '{sum += $3} END {print "Suma edades:", sum}' archivo1.txt

# 4.4
awk -F',' '{sum += $3; count++} END {print "Promedio:", sum/count}' archivo1.txt

# 4.5
awk '$1 > 10' archivo2.txt
```

## 5. tr

```bash
# 5.1
tr '[:lower:]' '[:upper:]' < archivo1.txt

# 5.2
tr -d '0-9' < archivo2.txt

# 5.3
tr ' ' '_' < archivo2.txt

# 5.4
tr -s ' ' < archivo2.txt

# 5.5
tr -d 'aeiouAEIOU' < archivo3.txt
```

## 6. find

```bash
# 6.1
find test -name "*.txt"

# 6.2
find test -mmin -5

# 6.3
find test -type d

# 6.4
find test -type f -size 0

# 6.5
find test -name "*.log" -exec ls -l {} \;
```

## 7. Comodines

```bash
# 7.1
ls test/*.{txt,log} 2>/dev/null

# 7.2
ls test/file*

# 7.3
ls test/????.txt 2>/dev/null

# 7.4
ls test/*[0-9]* 2>/dev/null
```

## 8. Combinación de comandos

```bash
# 8.1
grep "ERROR" archivo3.txt | sort

# 8.2
awk -F',' '{print $3}' archivo1.txt | sort | uniq -c | sort -nr | head -2

# 8.3
find test -name "*.txt" | wc -l

# 8.4
sort -n archivo2.txt

# 8.5
awk -F',' '{print $1, $3}' archivo1.txt | sort -k2 -n | head -1
```

## 9. Más ejercicios prácticos

```bash
# 9.1
grep -o '[0-9]\{3\}-[0-9]\{4\}' archivo1.txt

# 9.2
awk -F',' '{count[$3]++} END {for (ciudad in count) print "Ciudad:", ciudad, "- Personas:", count[ciudad]}' archivo1.txt

# 9.3
tr ' ' '\n' < archivo3.txt | awk '{print length, $0}' | sort -nr | head -1 | cut -d' ' -f2-

# 9.4
sort -t',' -k3 -n archivo1.txt

# 9.5
awk '{count[$3]++} END {for (tipo in count) print tipo, count[tipo]}' archivo3.txt
```

## 10. Bonus - Expresiones regulares

```bash
# 10.1
grep "^[A-Z]" archivo3.txt

# 10.2 (crea archivo con emails para probar)
echo "test@email.com" > emails.txt
echo "user@domain.es" >> emails.txt
grep -E "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" emails.txt

# 10.3
grep -E "[0-9]{3}-[0-9]{4}" archivo1.txt

# 10.4
grep -E "^[0-9]{4}-[0-9]{2}-[0-9]{2}" archivo3.txt
```

## Explicación breve de cada comando:

- **echo**: Muestra texto en pantalla. `$()` ejecuta comando interno
- **grep**: Busca patrones. `-v` invierte, `-c` cuenta, `-E` regex extendida
- **sed**: Editor de flujo. `s/old/new/g` reemplaza, `d` elimina, `p` imprime
- **awk**: Procesa por columnas. `-F` define separador, `$1` primera columna
- **tr**: Traduce caracteres. `-d` elimina, `-s` comprime repeticiones
- **find**: Busca archivos. `-name` por nombre, `-type` tipo, `-exec` ejecuta
- **Comodines**: `*` cualquier texto, `?` un carácter, `[]` rango
- **Pipes**: `|` pasa salida de un comando a otro
