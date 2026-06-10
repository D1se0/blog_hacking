# Gestión de Archivos y Directorios

Dominar el sistema de archivos de Linux es la base de todo lo demás. Esta sección cubre desde la navegación básica hasta técnicas avanzadas de manipulación, enlaces, permisos en profundidad y gestión de archivos especiales.

---

## 1. Navegación y Orientación

```bash
pwd
```
Muestra la ruta absoluta del directorio de trabajo actual (Print Working Directory).

```bash
cd /ruta/absoluta
cd ruta/relativa
```
Cambia el directorio de trabajo. Las rutas absolutas empiezan por `/`; las relativas parten del directorio actual.

| Atajo | Acción |
|---|---|
| `cd ..` | Sube un nivel al directorio padre |
| `cd -` | Vuelve al directorio anterior (útil para alternar entre dos rutas) |
| `cd ~` o `cd` | Va al `$HOME` del usuario actual |
| `cd ~usuario` | Va al `$HOME` de otro usuario |
| `cd /` | Va a la raíz del sistema de archivos |

```bash
dirs -v
```
Muestra la pila de directorios. Combinado con `pushd` y `popd` permite navegar eficientemente entre múltiples rutas:

```bash
pushd /var/log    # Apila /var/log y va a él
pushd /etc        # Apila /etc encima
popd              # Vuelve a /var/log y lo desapila
```

---

## 2. Listado de Contenido (`ls`)

```bash
ls [opciones] [ruta]
```

El comando más usado en Linux. Sin argumentos lista el contenido del directorio actual.

### Opciones esenciales

| Opción | Descripción |
|---|---|
| `-l` | Formato largo: permisos, propietario, tamaño, fecha |
| `-a` | Incluye archivos ocultos (los que empiezan por `.`) |
| `-A` | Como `-a` pero omite `.` y `..` |
| `-h` | Tamaños en formato humano (K, M, G) — usar con `-l` |
| `-R` | Recursivo: lista subdirectorios también |
| `-i` | Muestra el número de i-nodo de cada archivo |
| `-t` | Ordena por fecha de modificación (más reciente primero) |
| `-S` | Ordena por tamaño (mayor primero) |
| `-r` | Invierte el orden de listado |
| `-d` | Lista el directorio en sí, no su contenido |
| `--color` | Colorea la salida según el tipo de archivo |
| `-1` | Un archivo por línea (útil para scripts) |
| `-X` | Ordena por extensión |
| `-F` | Añade indicador de tipo (`/` dir, `*` ejecutable, `@` enlace) |

### Combinaciones frecuentes

```bash
ls -lah           # Lista larga, ocultos, tamaños legibles
ls -ltr           # Más antiguos al final (útil para ver últimos cambios)
ls -la /etc       # Lista detallada de /etc
ls -lS | head -10 # Los 10 archivos más grandes
ls -d */          # Solo directorios del directorio actual
```

### Interpretar la salida de `ls -l`

```
-rwxr-xr-- 2 alice devs 4096 Jun 09 10:32 script.sh
│└──┬───┘ │  │     │    │    └─────────── fecha modificación
│   │     │  │     │    └────────────── tamaño en bytes
│   │     │  │     └─────────────────── grupo propietario
│   │     │  └───────────────────────── usuario propietario
│   │     └──────────────────────────── número de enlaces duros
│   └────────────────────────────────── permisos (dueño|grupo|otros)
└────────────────────────────────────── tipo: - archivo, d dir, l enlace, b bloque
```

---

## 3. Manipulación de Archivos y Directorios

### Crear

```bash
mkdir nombre_directorio
mkdir -p ruta/completa/anidada   # Crea toda la cadena de directorios
mkdir -m 750 privado             # Crea con permisos específicos desde el inicio
mkdir dir1 dir2 dir3             # Crea varios a la vez
```

```bash
touch archivo.txt                # Crea vacío o actualiza timestamps
touch -t 202501011200 archivo    # Establece fecha/hora específica (YYYYMMDDhhmm)
touch -a archivo                 # Solo actualiza fecha de acceso (atime)
touch -m archivo                 # Solo actualiza fecha de modificación (mtime)
```

### Copiar

```bash
cp origen destino
cp -r directorio/ destino/       # Recursivo (directorios)
cp -p archivo destino            # Preserva permisos, fechas y propietario
cp -a directorio/ destino/       # Archive: preserva todo (equivale a -dR --preserve=all)
cp -i origen destino             # Pide confirmación antes de sobrescribir
cp -u origen destino             # Copia solo si origen es más nuevo que destino
cp -v origen destino             # Modo verbose: muestra qué copia
cp --backup=numbered orig dest   # Crea backup numerado si destino existe
```

```bash
# Copiar múltiples archivos a un directorio
cp archivo1 archivo2 archivo3 /destino/

# Copiar con preservación total y verbose
cp -av /origen/ /destino/

# Copiar solo si ha cambiado (útil para sincronización manual)
cp -u -r /origen/ /destino/
```

### Mover y Renombrar

```bash
mv origen destino                # Mueve o renombra
mv -i origen destino             # Pide confirmación antes de sobrescribir
mv -u origen destino             # Mueve solo si origen es más nuevo
mv -v origen destino             # Verbose
mv *.log /var/log/               # Mueve todos los .log a /var/log/

# Renombrar múltiples archivos (requiere rename o for loop)
for f in *.txt; do mv "$f" "${f%.txt}.md"; done
rename 's/.txt/.md/' *.txt       # Versión con rename (Perl)
```

### Eliminar

```bash
rm archivo
rm -i archivo                    # Interactivo: pide confirmación
rm -f archivo                    # Force: sin confirmación, ignora errores
rm -r directorio/                # Recursivo (directorios)
rm -rf directorio/               # Recursivo + forzado (IRREVERSIBLE — usar con cautela)
rm -v archivo                    # Verbose: confirma qué borra
```

> **⚠ Peligro**: `rm -rf /` o `rm -rf /*` destruye todo el sistema. Usa siempre rutas absolutas verificadas o `--one-file-system` para prevenir borrados fuera de partición.

```bash
# Alternativa segura: mover a papelera (requiere trash-cli)
trash-put archivo
trash-list
trash-restore
```

### Renombrado masivo avanzado

```bash
# Añadir prefijo a todos los archivos .jpg
for f in *.jpg; do mv "$f" "2025_$f"; done

# Convertir nombres a minúsculas
for f in *; do mv "$f" "$(echo $f | tr '[:upper:]' '[:lower:]')"; done

# Sustituir espacios por guiones bajos
rename 's/ /_/g' *
```

---

## 4. Lectura y Visualización de Contenido

```bash
cat archivo                      # Muestra todo el contenido
cat -n archivo                   # Con número de línea
cat -A archivo                   # Muestra caracteres especiales (tabs como ^I, fin de línea como $)
cat archivo1 archivo2            # Concatena y muestra varios archivos
cat -s archivo                   # Colapsa líneas vacías múltiples en una sola
```

```bash
tac archivo                      # Como cat pero al revés (última línea primero)
```

```bash
head archivo                     # Primeras 10 líneas
head -n 25 archivo               # Primeras 25 líneas
head -c 100 archivo              # Primeros 100 bytes
```

```bash
tail archivo                     # Últimas 10 líneas
tail -n 50 archivo               # Últimas 50 líneas
tail -f archivo                  # Sigue el archivo en tiempo real (logs)
tail -F archivo                  # Como -f pero reconecta si el archivo rota
```

```bash
less archivo                     # Paginador avanzado (recomendado sobre more)
```

Atajos dentro de `less`:

| Tecla | Acción |
|---|---|
| `Espacio` / `f` | Página siguiente |
| `b` | Página anterior |
| `g` | Ir al inicio |
| `G` | Ir al final |
| `/patrón` | Buscar hacia adelante |
| `?patrón` | Buscar hacia atrás |
| `n` / `N` | Siguiente/anterior coincidencia |
| `q` | Salir |
| `-N` | Activar/desactivar número de línea |
| `F` | Modo seguimiento (como `tail -f`) |

```bash
more archivo                     # Paginador básico (solo adelante)
```

---

## 5. Información y Metadatos de Archivos

```bash
file archivo                     # Detecta el tipo real (no se fía de la extensión)
file /bin/ls                     # → ELF 64-bit LSB pie executable...
file imagen.jpg                  # → JPEG image data...
file script.sh                   # → Bourne-Again shell script...
```

```bash
stat archivo                     # Información completa: tamaño, i-nodo, permisos, timestamps
```
Ejemplo de salida:
```
  File: archivo.txt
  Size: 2048            Blocks: 8          IO Block: 4096   regular file
Device: 8,1     Inode: 12345678    Links: 1
Access: (0644/-rw-r--r--)  Uid: ( 1000/   alice)   Gid: ( 1000/   alice)
Access: 2025-06-09 10:00:00.000 +0000
Modify: 2025-06-08 18:30:00.000 +0000
Change: 2025-06-08 18:30:00.000 +0000
 Birth: 2025-06-01 09:00:00.000 +0000
```

```bash
du -sh directorio/               # Tamaño total del directorio (human-readable)
du -sh *                         # Tamaño de cada elemento del directorio actual
du -ah directorio/ | sort -rh    # Ordenar por tamaño, mayor primero
du --max-depth=1 /var            # Solo primer nivel de profundidad

df -h                            # Espacio libre en todos los sistemas de archivos
df -h /                          # Solo para la partición raíz
df -i                            # Inodos disponibles (importante cuando hay millones de archivos pequeños)
```

---

## 6. Búsqueda de Archivos

```bash
find /ruta [criterios] [acciones]
```

### Buscar por nombre

```bash
find . -name "archivo.txt"              # Nombre exacto, case sensitive
find . -iname "*.log"                   # Nombre insensible a mayúsculas
find . -name "*.conf" -not -name "*.bak"  # Combinar criterios
find /etc -name "*.conf" 2>/dev/null    # Suprimir errores de permisos
```

### Buscar por tipo

```bash
find . -type f          # Solo archivos regulares
find . -type d          # Solo directorios
find . -type l          # Solo enlaces simbólicos
find . -type f -empty   # Archivos vacíos
find . -type d -empty   # Directorios vacíos
```

### Buscar por tamaño

```bash
find . -size +100M            # Mayores de 100 MB
find . -size -1k              # Menores de 1 KB
find . -size +1M -size -100M  # Entre 1 MB y 100 MB
```

### Buscar por tiempo

```bash
find . -mtime -1          # Modificados en las últimas 24 horas
find . -mtime +7          # Modificados hace más de 7 días
find . -newer archivo.txt  # Más recientes que archivo.txt
find . -atime +30         # No accedidos en 30+ días
find . -ctime -1          # Cuyo metadato cambió en últimas 24h
```

### Buscar por permisos y propietario

```bash
find . -perm 777                  # Exactamente 777
find . -perm -u+s                 # Con SUID activado
find . -perm -g+s                 # Con SGID activado
find . -user alice                # Propiedad de alice
find . -group developers          # Del grupo developers
find . -perm /o+w                 # Con escritura para otros (potencial riesgo)
```

### Ejecutar acciones sobre resultados

```bash
find . -name "*.log" -delete               # Borrar archivos encontrados
find . -name "*.sh" -exec chmod +x {} \;  # Hacer ejecutables los scripts
find . -type f -exec grep -l "password" {} \;  # Buscar texto dentro de archivos
find . -name "*.tmp" -exec rm -v {} +     # Borrar con verbose (+ más eficiente que \;)
find . -type d -exec chmod 755 {} \;      # Permisos a directorios
```

### Locate (búsqueda rápida por base de datos)

```bash
locate archivo.conf       # Busca en la base de datos (instantáneo)
sudo updatedb             # Actualiza la base de datos de locate
locate -i ARCHIVO.CONF    # Case insensitive
locate -n 10 "*.log"      # Limita a 10 resultados
```

---

## 7. Enlaces (Hard Links y Symlinks)

### Enlace simbólico (Soft Link / Symlink)

```bash
ln -s /ruta/objetivo nombre_enlace
```

- Es como un acceso directo: apunta a la ruta del archivo
- Si se borra el objetivo, el enlace queda roto (dangling symlink)
- Puede cruzar sistemas de archivos y particiones
- Puede apuntar a directorios

```bash
ln -s /var/log/syslog ~/mis-logs/syslog   # Enlace en el home
ln -s /opt/programa/bin/app /usr/local/bin/app  # Acceso global
readlink -f enlace                          # Resuelve la ruta real absoluta
```

### Enlace duro (Hard Link)

```bash
ln origen nombre_enlace
```

- Ambos nombres apuntan al mismo i-nodo (mismo archivo físico)
- Borrar uno no afecta al otro — el archivo persiste hasta que el último hard link se elimina
- No puede cruzar particiones
- No puede apuntar a directorios (salvo root)

```bash
ln importante.conf backup.conf    # Ambos son el mismo archivo
stat importante.conf              # "Links: 2" indica que hay 2 hard links
```

### Gestión de enlaces

```bash
readlink enlace                  # Muestra a qué apunta un symlink
readlink -f enlace               # Ruta canónica absoluta
ls -la | grep "^l"               # Lista solo symlinks en el directorio actual
find . -type l -! -e             # Encuentra symlinks rotos (dangling)
find . -xtype l                  # Alternativa para symlinks rotos
```

---

## 8. Comodines y Expansión de Bash (Globbing)

Los comodines son interpretados por **bash** antes de pasarlos al comando.

| Patrón | Descripción | Ejemplo |
|---|---|---|
| `*` | Cualquier cadena (incluyendo vacía) | `*.log` → todos los .log |
| `?` | Exactamente un carácter | `file?.txt` → file1.txt, fileA.txt |
| `[abc]` | Un carácter del conjunto | `[abc].txt` → a.txt, b.txt, c.txt |
| `[a-z]` | Un carácter del rango | `[0-9].txt` → 1.txt, 5.txt... |
| `[!abc]` | Cualquier carácter excepto los del conjunto | `[!0-9]*` → sin iniciar con dígito |
| `{a,b,c}` | Expansión de llaves (genera múltiples valores) | `file.{txt,md,pdf}` |
| `**` | Recursivo (con `shopt -s globstar`) | `**/*.log` → todos los .log en subdirs |
| `~` | Directorio home del usuario actual | `~/documents` |

```bash
# Ejemplos prácticos
rm *.tmp                              # Borra todos los archivos .tmp
ls archivo[123].txt                   # Lista archivo1, archivo2, archivo3
cp config.{bak,old} /tmp/            # Copia config.bak y config.old
mkdir -p proyecto/{src,bin,docs,tests}  # Crea estructura de directorios
mv !(*.jpg|*.png) /otros/            # Mueve todo excepto jpg/png (extglob)
```

```bash
# Activar globbing extendido
shopt -s globstar    # Habilita **
shopt -s extglob     # Habilita !(pat), ?(pat), +(pat), *(pat), @(pat)

ls **/*.md           # Todos los .md en cualquier subdirectorio
```

---

## 9. Compresión y Archivado

```bash
# tar — archivador principal
tar -czvf archivo.tar.gz directorio/   # Crear comprimido con gzip
tar -cjvf archivo.tar.bz2 directorio/ # Crear comprimido con bzip2
tar -cJvf archivo.tar.xz directorio/  # Crear comprimido con xz (mejor ratio)
tar -xzvf archivo.tar.gz              # Extraer gzip
tar -xzvf archivo.tar.gz -C /destino/ # Extraer en directorio específico
tar -tzvf archivo.tar.gz              # Listar contenido sin extraer
tar -czvf backup.tar.gz --exclude='*.log' directorio/  # Excluir archivos

# Opciones clave de tar
# c: crear, x: extraer, t: listar
# z: gzip, j: bzip2, J: xz
# v: verbose, f: nombre del archivo
```

```bash
# gzip / gunzip
gzip archivo.txt          # Crea archivo.txt.gz (elimina el original)
gzip -k archivo.txt       # Mantiene el original (-k = keep)
gzip -d archivo.txt.gz    # Descomprime (equivale a gunzip)
gzip -9 archivo.txt       # Máxima compresión
gunzip archivo.txt.gz     # Descomprime

# bzip2 / bunzip2 (mejor compresión, más lento)
bzip2 archivo.txt
bunzip2 archivo.txt.bz2

# xz (mejor ratio, el más lento)
xz -9 archivo.txt
unxz archivo.txt.xz

# zip / unzip (compatible con Windows)
zip archivo.zip archivo1 archivo2
zip -r directorio.zip directorio/
unzip archivo.zip
unzip archivo.zip -d /destino/
unzip -l archivo.zip           # Listar sin extraer
```

---

## 10. Redirección y Pipes

```bash
# Redirección de salida
comando > archivo.txt       # Sobreescribe
comando >> archivo.txt      # Añade al final
comando 2> errores.txt      # Solo stderr
comando &> todo.txt         # stdout + stderr
comando 2>&1                # Redirige stderr a stdout

# Redirección de entrada
comando < archivo.txt       # Lee desde archivo
comando << EOF              # Heredoc: bloque de texto inline
Línea 1
Línea 2
EOF

# Pipes
comando1 | comando2         # Salida de 1 como entrada de 2
comando1 | tee archivo.txt | comando2  # Guarda Y pasa al siguiente
```

---

## 11. Operaciones Avanzadas

```bash
# rsync — sincronización eficiente
rsync -av origen/ destino/              # Sincronizar local
rsync -avz origen/ user@host:/destino/ # Sincronizar remoto
rsync -av --delete origen/ destino/    # Borrar en destino lo que no está en origen
rsync -av --exclude="*.log" orig/ dest/ # Excluir patrones
rsync -av --dry-run orig/ dest/         # Simular sin hacer nada

# split — dividir archivos grandes
split -b 100M archivo.zip parte_       # Divide en partes de 100 MB
cat parte_* > archivo_recuperado.zip  # Reensamblar

# dd — copia a bajo nivel
dd if=/dev/sda of=disco.img bs=4M     # Clonar disco
dd if=ubuntu.iso of=/dev/sdb bs=4M status=progress  # Grabar ISO
```

```bash
# Comparar archivos
diff archivo1.txt archivo2.txt        # Diferencias línea a línea
diff -u archivo1.txt archivo2.txt     # Formato unificado (más legible)
diff -r dir1/ dir2/                   # Comparar directorios recursivamente
vimdiff archivo1 archivo2             # Comparación visual en vim
```

```bash
# Ordenar y eliminar duplicados
sort archivo.txt                      # Ordenar alfabéticamente
sort -n archivo.txt                   # Ordenar numéricamente
sort -rn archivo.txt                  # Descendente numérico
sort -u archivo.txt                   # Ordenar y eliminar duplicados
sort archivo.txt | uniq               # Equivalente
sort archivo.txt | uniq -d            # Solo líneas duplicadas
sort archivo.txt | uniq -c | sort -rn  # Contar ocurrencias, más frecuente primero
```
