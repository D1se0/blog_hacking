# SQL Cheatsheet

## Introducción a SQL

**SQL (Structured Query Language)** es un lenguaje de consulta
estructurado diseñado para trabajar con **bases de datos relacionales**.

Se divide en tres sublenguajes principales:

-   **DDL (Data Definition Language)** -- Definición de estructuras.
-   **DML (Data Manipulation Language)** -- Manipulación de datos.
-   **DCL (Data Control Language)** -- Control de acceso y seguridad.

------------------------------------------------------------------------
# 1. Clasificación de Sentencias SQL

El **SQL (Structured Query Language)** es un lenguaje estructurado que permite realizar operaciones en bases de datos relacionales y se compone de diversos sublenguajes especializados. Una sentencia SQL se define por una **palabra clave** y varias **cláusulas** que actúan sobre los objetos de la base de datos.

---
## DDL (Data Definition Language) - Lenguaje de Definición de Datos

Este sublenguaje se utiliza para **definir y modificar la estructura** de los objetos de la base de datos, como tablas, vistas e índices.

- **CREATE**: Permite la creación de objetos. La sentencia `CREATE TABLE` define las columnas, sus tipos de datos (como `NUMBER`, `VARCHAR2` o `DATE`) y las **restricciones de integridad** (como `PRIMARY KEY` o `FOREIGN KEY`). También se usa para crear **vistas** (`CREATE VIEW`), que son tablas virtuales basadas en consultas.
- **ALTER**: Se emplea para **modificar objetos existentes**. Con `ALTER TABLE` se pueden añadir o redefinir columnas, así como agregar o eliminar restricciones de integridad sin borrar la tabla.
- **DROP**: Se utiliza para **eliminar permanentemente** objetos de la base de datos (tablas, índices, vistas o usuarios). Si se usa `DROP TABLE` con la opción `CASCADE CONSTRAINTS`, también se eliminan las restricciones de integridad referencial asociadas.
- **TRUNCATE**: A diferencia de `DROP`, la orden `TRUNCATE TABLE` **elimina todas las filas** de una tabla pero **mantiene su estructura** e índices para uso futuro.
- **CREATE INDEX**: Los índices son estructuras que permiten a la base de datos localizar filas de forma más rápida, actuando de forma similar al índice de un libro. Se recomienda crearlos sobre columnas que se consultan frecuentemente en la cláusula `WHERE`.

---
## DML (Data Manipulation Language) - Lenguaje de Manipulación de Datos

El DML permite a los usuarios **gestionar y consultar la información** contenida dentro de las estructuras creadas por el DDL.

- **SELECT**: Es la sentencia más compleja y potente. Permite **recuperar datos** de una o más tablas o vistas. Puede incluir filtrado de filas (`WHERE`), ordenación (`ORDER BY`), agrupamiento de datos (`GROUP BY`) y funciones estadísticas como `SUM`, `AVG` o `COUNT`.
- **INSERT**: Se usa para **añadir nuevas filas** de datos. Se pueden insertar valores específicos o los resultados de una subconsulta.
- **UPDATE**: Permite **cambiar los valores** de los datos ya almacenados en una tabla o en la tabla base de una vista.
- **DELETE**: Se utiliza para **eliminar filas específicas** de una tabla que cumplan con una condición determinada.

---
## DCL (Data Control Language) - Lenguaje de Control de Datos

Este sublenguaje está orientado a la **seguridad, confidencialidad y control de la base de datos**. Gestiona quién puede acceder a qué datos y qué acciones puede realizar.

- **GRANT**: Se utiliza para **conceder privilegios o roles** a los usuarios. Existen dos tipos de privilegios:
    - **Privilegios del sistema**: Permiten realizar operaciones generales (ej. `CREATE SESSION` para conectarse o `CREATE TABLE`).
    - **Privilegios sobre objetos**: Permiten acciones específicas sobre una tabla o vista particular (ej. `SELECT`, `UPDATE` o `DELETE` sobre la tabla "EMPLEADO").
- **REVOKE**: Se utiliza para **retirar privilegios** previamente concedidos a usuarios o roles.
- **Control de Transacciones**: Aunque a menudo se categorizan aparte, las fuentes indican que las sentencias para el control de transacciones también caen bajo el control de datos.

Conceptos Adicionales de Control:

- **Usuarios y Esquemas**: Cada usuario posee un **esquema** (un contenedor de sus objetos).
- **Roles**: Son conjuntos de privilegios que facilitan la administración al asignarse a grupos de usuarios con responsabilidades similares.
- **Perfiles**: Permiten establecer **límites de recursos**, como el número de sesiones simultáneas o el tiempo de conexión.

---
# 2. Tipos de Datos

El estándar **ANSI** define un subconjunto de tipos de datos que la mayoría de los sistemas comerciales, como Oracle, mantienen por motivos de **compatibilidad**.
## Tipos ANSI (Estándar)

Estos tipos están diseñados para asegurar la portabilidad entre diferentes sistemas de gestión de bases de datos.
### Numéricos

Pueden contener números con o sin punto decimal y signo.

- **INTEGER**: Para números enteros estándar.
- **SMALLINT**: Para números enteros pequeños, optimizando el espacio.
- **DECIMAL(p,s)**: Permite definir una **precisión (p)** total de dígitos y una **escala (s)** o número de dígitos a la derecha del punto decimal.
- **FLOAT(p)**: Números en coma flotante con una precisión específica.
- **REAL**: Números de coma flotante de **baja precisión**.
- **DOUBLE PRECISION**: Números de coma flotante de **alta precisión**.
### Alfanuméricos

Utilizados para almacenar cadenas de caracteres.

- **CHAR(n)**: Cadena de **longitud fija** de _n_ caracteres.
- **VARCHAR(n)**: Conocido en el estándar como `CHARACTER VARYING(N)`, se utiliza para cadenas de **longitud variable**.

---
## Tipos Oracle

Oracle implementa tipos de datos específicos que ofrecen mayor rendimiento y capacidades de almacenamiento extendidas.
### Cadenas de caracteres

- **VARCHAR2(n)**: Es el tipo recomendado por Oracle para cadenas variables, con un máximo de **4000 caracteres**. Aunque existe el tipo `VARCHAR`, actualmente es idéntico a `VARCHAR2`, pero su funcionalidad podría cambiar en el futuro, por lo que se prefiere este último.
- **CHAR(n)**: En Oracle, tiene un máximo de 2000 caracteres y, si no se especifica la longitud, por defecto es 1.
- **LONG**: Puede almacenar hasta **2 GB**, pero Oracle recomienda actualmente el uso de tipos **LOB** para grandes volúmenes de texto, manteniéndolo solo por compatibilidad.
### Numéricos y Fechas

- **NUMBER**: Es extremadamente versátil, ya que maneja tanto números fijos como de coma flotante con hasta **38 dígitos significativos**.
- **DATE**: Almacena de forma fija en 7 bytes el **siglo, año, mes, día, hora, minutos y segundos**. Soporta un rango desde el año 4712 a.C. hasta el 9999 d.C..
- **BINARY_FLOAT** **/** **BINARY_DOUBLE**: Tipos numéricos de simple (32 bits) y doble precisión (64 bits) que requieren 5 y 9 bytes respectivamente.
### Objetos de Gran Tamaño (LOB - Large Objects)

Estos tipos permiten almacenar datos masivos de hasta **128 Terabytes**, dependiendo de la configuración de la base de datos.

- **CLOB**: (Character LOB) Almacena grandes cantidades de caracteres utilizando el conjunto de caracteres de la base de datos.
- **NLOB**: Similar al CLOB, pero utiliza el conjunto de caracteres **Unicode**.
- **BLOB**: (Binary LOB) Objeto binario no estructurado para datos como **imágenes, videos o audios**.
- **BFILE**: Almacena un **localizador** que apunta a un archivo binario externo situado en el sistema operativo, fuera de la base de datos.
- **LONG RAW**: Utilizado para datos binarios variables de hasta 2 GB, aunque también se recomienda migrar a `BLOB`.

---
# 3. Operadores

Los **operadores** son elementos que se utilizan dentro de las sentencias SQL para realizar cálculos, comparaciones y evaluaciones lógicas, principalmente dentro de la cláusula `WHERE` para filtrar los resultados.

---
## 3.1 Operadores Aritméticos

Se utilizan para realizar operaciones matemáticas sobre valores numéricos. Estos operadores siguen un **orden de preferencia** en su ejecución:

1. **+** **,** **-** **(Unarios):** Proporcionan carácter positivo o negativo a una expresión.
2. ***** **,** **/** **:** Multiplicación y división.
3. **+** **,** **-** **(Binarios):** Suma y resta.

**Ejemplos:**

```sql
-- Suma de dos columnas
SELECT sueldo + comision FROM empleado;

-- Multiplicación de valores
SELECT Pts * hora FROM pagos;
```

---
## 3.2 Operadores Relacionales (Comparación)

Se usan para comparar dos expresiones, devolviendo un valor de verdadero o falso.

|Operador|Significado|
|---|---|
|**=**|Igual|
|**<>** **o** **!=**|Distinto|
|**>**|Mayor|
|**<**|Menor|
|**>=**|Mayor o igual|
|**<=**|Menor o igual|

Operadores Especiales de Comparación:

- **BETWEEN a AND b**: Evalúa si un valor está comprendido en el intervalo entre _a_ y _b_, inclusive.
- **IN (lista)**: Comprueba si un valor pertenece a una lista de valores especificada.
- **IS [NOT] NULL**: Es el operador utilizado para testear si un campo contiene un valor nulo, ya que no se pueden usar comparadores normales para esto.
- **LIKE**: Permite la **comparación de patrones** usando comodines:
    - `%`: Representa cualquier cadena de caracteres (cero o más).
    - `_`: Representa una única posición o carácter.

**Ejemplos:**

```sql
-- Uso de BETWEEN para rangos
SELECT * FROM empleado WHERE sueldo BETWEEN 2000 AND 5000;

-- Uso de IN para listas
SELECT nombre, edad FROM empleado WHERE edad IN (22, 23, 25, 35);

-- Uso de LIKE con comodín %
SELECT nombre FROM empleado WHERE nombre LIKE 'WIL%';

-- Uso de IS NULL
SELECT nombre FROM empleado WHERE edad IS NULL;
```

---
## 3.3 Operadores Lógicos

Estos operadores permiten combinar múltiples condiciones de comparación en una sola cláusula.

- **AND**: Devuelve verdadero solo si **ambas** condiciones son verdaderas.
- **OR**: Devuelve verdadero si **al menos una** de las condiciones es verdadera.
- **NOT**: Invierte el resultado de una condición; es verdadero si la condición original es falsa.

**Ejemplo:**

```sql
-- Combinación de condiciones con AND
SELECT * FROM empleado WHERE sueldo > 1000 AND comision > 2000;

-- Inversión de condición con NOT
SELECT * FROM empleado WHERE NOT (sueldo > 1000);
```

---
## 3.4 Operadores de Subconsultas y Conjuntos

Existen otros operadores avanzados que permiten trabajar con resultados de otras consultas o combinar conjuntos de datos:

- **Operadores de Subconsulta:**
    - **ANY** **/** **SOME**: Compara un valor con una lista y es verdadero si coincide con **alguno** de ellos.
    - **ALL**: Es verdadero si la comparación se cumple para **todos** los valores de la lista.
    - **EXISTS**: Se evalúa como cierto si la subconsulta devuelve **al menos una fila**.
- **Operadores de Conjunto:**
    - **UNION**: Combina los resultados de dos consultas eliminando duplicados.
    - **INTERSECT**: Devuelve solo las filas que aparecen en **ambas** consultas.
    - **MINUS**: Devuelve las filas de la primera consulta que **no aparecen** en la segunda.

**Ejemplo de unión:**

```sql
-- Obtener nombres de empleados que son LEÑADORES o CONDUCTORES
SELECT nombre FROM empleado WHERE oficio = 'LEÑADOR'
UNION
SELECT nombre FROM empleado WHERE oficio = 'CONDUCTOR DE SEGADORA';
```

---
# 4. Creación de Tablas

La sentencia **CREATE TABLE** pertenece al Lenguaje de Definición de Datos (**DDL**). Su función es definir la estructura de una tabla, especificando sus columnas, tipos de datos y las **restricciones de integridad** que aseguran la validez de la información.
## 4.1 Conceptos Clave

- **Esquema (Schema):** Identifica al propietario de la tabla. Por defecto, cada usuario tiene un esquema con su nombre donde crea sus propios objetos.
- **Columnas:** Una tabla puede contener hasta **254 columnas**.
- **Valor por Defecto (****DEFAULT****):** Permite asignar automáticamente un valor a una columna si el usuario no proporciona uno durante la inserción (por ejemplo, usar `SYSDATE` para la fecha actual).
- **Restricciones (Constraints):** Son reglas que los datos deben cumplir. Pueden definirse a **nivel de columna** (junto al tipo de dato) o a **nivel de tabla** (al final de la definición de columnas).

---
## 4.2 Ejemplos de Creación Manual

Ejemplo Básico (Nivel de Columna)

Este es el ejemplo que proporcionaste, donde las restricciones se definen directamente en la columna:

```sql
CREATE TABLE cliente (
    num NUMBER(4) PRIMARY KEY,        -- Clave primaria a nivel de columna
    nombre VARCHAR2(50),
    fechaAlta DATE DEFAULT SYSDATE    -- Si no se pone fecha, usa la del sistema
);
```

Ejemplo con Restricciones a Nivel de Tabla

Es útil cuando queremos dar un nombre específico a la restricción para facilitar la identificación de errores.

```sql
CREATE TABLE cliente_v2 (
    num NUMBER(4),
    dni VARCHAR2(15),
    nombre VARCHAR2(50),
    CONSTRAINT pk_cliente PRIMARY KEY(num),    -- Nombre personalizado: pk_cliente
    CONSTRAINT uq_dni_unico UNIQUE(dni)        -- Asegura que el DNI no se repita
);
```

Ejemplo con Claves Compuestas y Foráneas

Si una clave primaria está formada por varias columnas, **obligatoriamente** debe definirse a nivel de tabla.

```sql
CREATE TABLE aficiones_personales (
    persona NUMBER(4),
    aficion NUMBER(4),
    -- Clave primaria compuesta por dos campos
    CONSTRAINT pk_aficiones_p PRIMARY KEY (persona, aficion),
    -- Clave ajena que referencia a otra tabla con borrado en cascada
    CONSTRAINT fk_aficion FOREIGN KEY (aficion) 
        REFERENCES aficion(cod_af) ON DELETE CASCADE 
);
```

Ejemplo con Restricciones de Verificación (`CHECK`)

Permiten validar que los datos cumplan una condición lógica antes de ser insertados.

```sql
CREATE TABLE empleado (
    num_emp NUMBER(4) PRIMARY KEY,
    nombre VARCHAR2(15),
    sexo CHAR CONSTRAINT ck_sexo CHECK (sexo IN ('V', 'M')), -- Solo permite 'V' o 'M'
    sueldo NUMBER(7,2) CONSTRAINT ck_sueldo_min CHECK (sueldo > 0)
);
```

---
## 4.3 Creación desde Consulta (`AS subquery`)

Esta variante permite crear una tabla basada en el resultado de una sentencia `SELECT`. La nueva tabla heredará los nombres de columna y tipos de datos de la consulta original, e insertará automáticamente las filas devueltas.

**Copia exacta de una tabla:**

```sql
CREATE TABLE copia_empleado AS 
SELECT * FROM empleado; -- Crea la tabla y copia todos los datos
```

**Creación con filtros o columnas específicas:**

```sql
CREATE TABLE solo_nombres AS 
SELECT nombre, sueldo 
FROM empleado 
WHERE sueldo > 2000; -- La tabla nueva solo tendrá estas dos columnas y los datos filtrados
```

> **Nota:** Al usar `AS subquery`, no es necesario definir manualmente las columnas, ya que Oracle las deduce de la consulta. Sin embargo, el resto de parámetros técnicos de almacenamiento suelen ser manejados por el administrador de la base de datos.

---
# 5. Restricciones (Constraints)

Las **restricciones de integridad** son reglas que se definen sobre las columnas de una tabla para asegurar la validez y consistencia de los datos almacenados. Estas pueden definirse de dos formas: a **nivel de columna** (junto a la definición del tipo de dato) o a **nivel de tabla** (al final de la definición de todas las columnas).

Es muy recomendable asignar un **nombre personalizado** a cada restricción usando la palabra clave `CONSTRAINT`. De lo contrario, Oracle asignará nombres genéricos (como `SYS_Cn`), lo que dificulta identificar qué regla se ha roto cuando el sistema devuelve un mensaje de error.
## 5.1 Tipos de Restricciones

|Restricción|Descripción|Detalle Técnico|
|---|---|---|
|**NOT NULL**|No permite valores nulos.|Obliga a que la columna siempre tenga un valor.|
|**UNIQUE**|Valores únicos.|Asegura que no existan dos filas con el mismo valor en esa columna (o combinación de columnas).|
|**PRIMARY KEY**|Identificador único.|Designa la columna (o conjunto de ellas) como clave primaria. Oracle crea automáticamente un **índice** para estas columnas para acelerar las búsquedas.|
|**FOREIGN KEY**|Relación con otra tabla.|Establece una relación de integridad referencial con la clave primaria o única de otra tabla.|
|**CHECK**|Condición lógica.|Obliga a que cada fila cumpla una condición específica (ej. que un sueldo sea mayor a cero).|

---
## 5.2 Ejemplos de Implementación

Definición al crear una tabla (Nivel de Columna y Tabla)

En este ejemplo se combinan ambos métodos y se añade la cláusula `ON DELETE CASCADE`, que permite borrar automáticamente los registros hijos si se borra el registro padre en la tabla referenciada.

```sql
CREATE TABLE AFICIONESPERSONALES (
    persona NUMBER(4),
    aficion NUMBER(4),
    -- Clave primaria compuesta (obligatorio definirla a nivel de tabla)
    CONSTRAINT pk_aficionesp PRIMARY KEY (persona, aficion),
    -- Clave ajena con borrado en cascada
    CONSTRAINT fk_persona_per FOREIGN KEY (persona) 
        REFERENCES PERSONA(cod_per) ON DELETE CASCADE
);
```

Restricciones de Verificación (`CHECK`)

Estas restricciones permiten validar rangos o listas de valores permitidos.

```sql
CREATE TABLE empleado (
    num_emp NUMBER(4) PRIMARY KEY,
    nombre VARCHAR2(15),
    -- Solo permite valores 'V' o 'M'
    sexo CHAR CONSTRAINT ck_sexo CHECK (sexo IN ('V', 'M')),
    fecha_ingreso DATE,
    fecha_nacimiento DATE,
    -- Condición compleja: el empleado debe ser mayor de 18 años al ingresar
    CONSTRAINT ck_mayor_edad CHECK ((MONTHS_BETWEEN(fecha_ingreso, fecha_nacimiento)/12) >= 18)
);
```

---
## 5.3 Gestión con `ALTER TABLE`

Si la tabla ya existe, podemos usar la sentencia `ALTER TABLE` para añadir o eliminar restricciones.

**Añadir una Clave Primaria:**

```sql
ALTER TABLE persona
ADD CONSTRAINT pk_persona PRIMARY KEY (cod_per); -- Ejemplo original
```

**Añadir una restricción de verificación:**

```sql
ALTER TABLE empleado
ADD CONSTRAINT ck_sueldo_minimo CHECK (sueldo > 900);
```

**Modificar una restricción:** En SQL, las restricciones no se pueden modificar directamente. Si necesitas cambiar una regla (por ejemplo, subir el sueldo mínimo de 900 a 1000), debes **eliminarla y volver a crearla**:

```sql
-- Paso 1: Eliminar la restricción antigua
ALTER TABLE empleado DROP CONSTRAINT ck_sueldo_minimo;

-- Paso 2: Crear la nueva con la condición actualizada
ALTER TABLE empleado ADD CONSTRAINT ck_sueldo_minimo CHECK (sueldo > 1000);
```

> **Nota importante:** Si al intentar activar una nueva restricción existen filas en la tabla que la incumplen, Oracle informará del error y no permitirá activarla hasta que se corrijan esos datos.

---
# 6. ALTER TABLE

La sentencia **ALTER TABLE** forma parte del Lenguaje de Definición de Datos (**DDL**) y se utiliza para **modificar la estructura** de una tabla que ya ha sido creada.

A través de esta orden, es posible realizar cuatro operaciones principales:

1. **Añadir nuevas columnas.**
2. **Añadir restricciones de integridad.**
3. **Eliminar restricciones de integridad.**
4. **Redefinir columnas existentes** (cambiar su tipo de dato, tamaño o valor por defecto).

---
## 6.1 Añadir Columnas o Restricciones (`ADD`)

Se utiliza la cláusula `ADD` para incorporar elementos que no existían en la definición original de la tabla.

- **Ejemplo - Añadir una columna:**
- **Ejemplo - Añadir una restricción de verificación (****CHECK****):**

---
## 6.2 Modificar Columnas Existentes (`MODIFY`)

La cláusula `MODIFY` permite **redefinir** una columna. Es útil si, por ejemplo, el tamaño asignado inicialmente se queda corto para los datos reales.

- **Ejemplo - Cambiar el tamaño o precisión:**

**Nota:** También puedes usar `MODIFY` para cambiar el **tipo de dato** o el **valor por defecto** (`DEFAULT`) de una columna.

---
## 6.3 Eliminar Restricciones (`DROP`)

Para eliminar una regla de integridad (como una clave primaria o una validación), se utiliza la cláusula `DROP CONSTRAINT` seguida del nombre que se le asignó a dicha restricción.

- **Ejemplo - Eliminar clave primaria:**

---
## 6.4 Caso Especial: "Modificar" una Restricción

En SQL, **no es posible modificar una restricción directamente**. Si deseas cambiar una regla (por ejemplo, subir el sueldo mínimo de 900 a 1000), debes seguir dos pasos:

1. **Eliminar** la restricción antigua con `DROP`.
2. **Volver a crearla** con la nueva condición usando `ADD`.
3. **Ejemplo de actualización de regla:**

> **Importante:** Si al intentar activar una nueva restricción existen filas en la tabla que la incumplen, Oracle informará del error y no permitirá activar la restricción hasta que se corrijan esos datos.

---
# 7. Índices

Un índice es un concepto similar al **índice de un libro**, donde una lista de palabras clave nos indica el número de página para localizar la información rápidamente. En una base de datos, los índices se crean sobre una o varias columnas para **acelerar la localización de filas** específicas durante una consulta.
## 7.1 Funcionamiento y Ventajas

Cuando existe un índice, Oracle busca primero en él la ubicación exacta de los datos en lugar de recorrer toda la tabla, obteniendo la información de manera mucho más veloz.

- **Candidatos para indexar**: Las columnas que aparecen frecuentemente en la cláusula **WHERE** de un `SELECT` o aquellas que se utilizan para **combinar tablas (Join)** son las mejores candidatas para tener un índice.
- **Consulta de índices**: En Oracle, se pueden consultar los índices existentes a través de la vista del diccionario de datos llamada `user_indexes`.
## 7.2 Creación de Índices

La sintaxis básica permite definir si el índice debe obligar a que los valores sean únicos o no.

Índice Único (`UNIQUE`)

Asegura que no existan valores duplicados en la columna indexada. Aunque la tabla no tenga una restricción de integridad `UNIQUE` previa, el índice obligará a que se cumpla esta condición.

```sql
-- Ejemplo original: Crea un índice único para la descripción del canal
CREATE UNIQUE INDEX canal_desc_idx
ON canal(descripcion);
```

Índice Estándar (No único)

Se utiliza simplemente para mejorar el rendimiento sin imponer restricciones de unicidad.

```sql
-- Ejemplo adicional: Índice para acelerar búsquedas por nombre de empleado
CREATE INDEX emp_nombre_idx
ON empleado(nombre);
```
## 7.3 Índices Automáticos

Es importante destacar que **Oracle crea índices de manera automática** sobre las columnas definidas como **PRIMARY KEY** (Clave Primaria) de una tabla. Esto garantiza que las búsquedas por el identificador principal siempre sean eficientes.
## 7.4 Restricciones y Limitaciones

- **Número de columnas**: Un solo índice puede estar compuesto por hasta **16 columnas** de una misma tabla.
- **Tipos de datos prohibidos**: No se pueden crear índices sobre columnas de tipo **LONG** o **LONG RAW**.
- **Ordenación**: Aunque se permite especificar `ASC` (ascendente) o `DESC` (descendente) por compatibilidad, los índices se crean generalmente en orden ascendente.
## 7.5 Eliminación de Índices

Si un índice ya no es necesario o no mejora el rendimiento, se puede eliminar utilizando la sentencia `DROP INDEX`.

```sql
-- Ejemplo: Borrar el índice creado anteriormente
DROP INDEX canal_desc_idx;
```

---
# 8. DROP y TRUNCATE

Las sentencias **DROP** y **TRUNCATE** pertenecen al Lenguaje de Definición de Datos (**DDL**) y se utilizan para eliminar objetos o su contenido de la base de datos,. Aunque ambas implican borrar información, tienen propósitos y efectos estructurales muy distintos.

---
## 8.1 DROP TABLE

La sentencia **DROP TABLE** se utiliza para **eliminar de forma permanente tanto la definición de la tabla como toda la información** (filas) que contiene,. Una vez ejecutada, la tabla deja de existir en el diccionario de datos.

- **CASCADE CONSTRAINTS**: Es un modificador crítico. Si la tabla que deseas borrar tiene claves primarias o únicas que son referenciadas por claves ajenas en otras tablas, Oracle impedirá el borrado para proteger la integridad. Al añadir esta cláusula, se eliminan automáticamente todas esas restricciones de integridad referencial, permitiendo el borrado de la tabla.

**Ejemplos de** **DROP****:**

```sql
-- Borrado simple: Elimina la tabla empleado si no tiene dependencias
DROP TABLE empleado;

-- Borrado con dependencias: Elimina la tabla menu y rompe sus relaciones
DROP TABLE menu CASCADE CONSTRAINTS;

-- Borrado de otros objetos (no solo tablas)
DROP INDEX canal_desc_idx;
```

---
## 8.2 TRUNCATE TABLE

La orden **TRUNCATE TABLE** se emplea cuando se desea realizar una limpieza total de los datos pero se tiene la intención de **mantener la estructura de la tabla** (columnas, tipos de datos e índices) para un uso futuro.

- A diferencia de `DROP`, tras un `TRUNCATE` la tabla sigue apareciendo en la base de datos, pero totalmente vacía.
- Es una operación mucho más rápida y eficiente que usar una sentencia `DELETE` masiva, ya que actúa a nivel de estructura de datos.

**Ejemplos de** **TRUNCATE****:**

```sql
-- Vacía la tabla de empleados pero conserva sus columnas y restricciones
TRUNCATE TABLE empleado;

-- Útil para limpiar tablas de registros temporales o detalles de pedidos
TRUNCATE TABLE detallepedido;
```

---
## 8.3 Resumen Comparativo

|Comando|Acción sobre los **Datos**|Acción sobre la **Estructura**|Uso de `CASCADE`|
|---|---|---|---|
|**DROP**|Los elimina permanentemente.|**Elimina la definición** de la tabla por completo.|Disponible para eliminar restricciones referenciales.|
|**TRUNCATE**|Los elimina permanentemente.|**Mantiene la definición** y la tabla para futuros datos.|No aplica (solo actúa sobre el contenido de la propia tabla).|

**Nota de Seguridad:** Ambas operaciones son irreversibles en la mayoría de las configuraciones estándar, por lo que deben ejecutarse con precaución, especialmente `DROP TABLE` con la opción `CASCADE CONSTRAINTS`, ya que afecta a la integridad de otras tablas relacionadas.

---
# 9. Inserción de Datos (INSERT)

La sentencia **INSERT** pertenece al Lenguaje de Manipulación de Datos (**LMD** o DML) y se utiliza para añadir nuevas filas de información a las tablas o vistas de la base de datos.
## 9.1 Sintaxis y Reglas Básicas

Para realizar una inserción, se debe especificar la tabla de destino y los valores que se van a introducir. Existen dos formas principales de hacerlo:

1. **Especificando columnas:** Se asocian los valores de la cláusula `VALUES` a las columnas listadas en el mismo orden.
2. **Sin especificar columnas:** Los valores deben seguir estrictamente el orden en que fueron definidas las columnas al crear la tabla. Si falta algún valor, el sistema devolverá un error.

**Ejemplos de inserción manual:**

```sql
-- Ejemplo original: Inserción especificando columnas
INSERT INTO actomedico (cod_act, descripcion)
VALUES (1, 'CONSULTA');

-- Ejemplo adicional: Inserción completa (sin listar columnas)
-- Se deben proporcionar valores para todos los campos en orden
INSERT INTO ACTOMEDICO VALUES (1, 'ACTOMEDICO1', 7500);

-- Ejemplo adicional: Inserción con valores nulos
-- Si una columna no tiene la restricción 'NOT NULL', se puede omitir para que sea NULL
INSERT INTO ACTOMEDICO(COD_ACT, DESCRIPCION) VALUES (2, 'ACTOMEDICO2');
```
## 9.2 Inserción desde Consulta (`Subquery`)

Esta modalidad es extremadamente útil para realizar **inserciones masivas**. Permite tomar datos resultantes de una consulta `SELECT` e introducirlos directamente en otra tabla. La única condición es que la lista seleccionada en la subconsulta tenga el mismo número de columnas que la tabla de destino.

**Ejemplos de inserción masiva:**

```sql
-- Ejemplo original: Insertar en tarifa valores fijos basados en otra tabla
INSERT INTO tarifa
SELECT cod_act, 10
FROM actomedico;

-- Ejemplo adicional: Población de una tabla relacional (Tarifa) 
-- combinando datos de Acto Médico y Compañía
INSERT INTO TARIFA(COD_ACT, COD_COMP) 
SELECT COD_ACT, COD_COMP 
FROM ACTOMEDICO, COMPANIA;
```
## 9.3 Uso de Secuencias en la Inserción

En Oracle, es común utilizar un objeto llamado **secuencia** para generar automáticamente números enteros únicos, ideales para **claves primarias**. Para obtener el siguiente número de una secuencia se utiliza la seudocolumna `NEXTVAL`.

**Ejemplo con secuencias:**

```sql
-- Supongamos que existe una secuencia llamada SEQ_CODACT
INSERT INTO ACTOMEDICO 
VALUES (SEQ_CODACT.NEXTVAL, 'ACTOMEDICOTRES', 10500);
```
## 9.4 Inserciones a través de Vistas

Es posible insertar datos en una tabla base utilizando una **vista**. Sin embargo, existen restricciones importantes:

- No es posible si la vista omite una columna de la tabla base que tenga restricción `NOT NULL`.
- No se permite si la definición de la vista contiene funciones de grupo, cláusulas `GROUP BY`, `DISTINCT`, u operadores de conjunto.
- Tampoco es posible si la vista se creó con la opción `WITH READ ONLY`.

**Ejemplo de inserción en vista:**

```sql
-- Insertar un empleado a través de una vista simplificada
INSERT INTO DATOSEMPLEADO VALUES (35, 'PEPITO', 3);
```

Conceptos adicionales a tener en cuenta:

- **Valor por Defecto (****DEFAULT****):** Si al crear la tabla se definió un valor por defecto para una columna, este se asignará automáticamente si dicha columna se omite en la sentencia `INSERT`.
- **Esquemas:** Si la tabla no pertenece al usuario actual, se debe anteponer el nombre del esquema (ej. `ESQUEMA.TABLA`).

---
# 10. Secuencias

Una **secuencia** es un objeto de la base de datos que permite a múltiples usuarios generar **números enteros únicos** de forma automática. Son especialmente útiles para garantizar que los valores de las **claves primarias** no se dupliquen.

---
## 10.1 Creación de una Secuencia

Para crear una secuencia en tu propio esquema, necesitas el privilegio `CREATE SEQUENCE`. La sentencia permite configurar diversos parámetros para controlar cómo se generan los números:

|Parámetro|Función|
|---|---|
|**INCREMENT BY**|Fija el intervalo entre los números (puede ser positivo o negativo).|
|**START WITH**|Especifica el primer número que se generará.|
|**MAXVALUE** **/** **NOMAXVALUE**|Determina el valor máximo permitido.|
|**MINVALUE** **/** **NOMINVALUE**|Determina el valor mínimo permitido.|
|**CYCLE** **/** **NOCYCLE**|Indica si la secuencia debe volver a empezar al alcanzar el máximo (`CYCLE`) o detenerse (`NOCYCLE`).|
|**CACHE**|Prealoja valores en memoria para un acceso más rápido (por defecto suele prealojar 20).|

**Ejemplo original:**

```sql
CREATE SEQUENCE seq_id
START WITH 1
INCREMENT BY 1;
```

---
## 10.2 Uso y Pseudocolumnas

Una vez creada, se accede a sus valores mediante dos pseudocolumnas específicas:

- **NEXTVAL**: Incrementa la secuencia y devuelve el **siguiente valor** disponible.
- **CURRVAL**: Devuelve el **valor actual** de la secuencia (el último valor obtenido en la sesión actual). No se puede usar si no se ha llamado primero a `NEXTVAL` en esa sesión.

---
## 10.3 Ejemplos de Aplicación

Inserción básica (Ejemplo original)

```sql
INSERT INTO tabla VALUES (seq_id.NEXTVAL, 'dato');
```

Creación avanzada con límites y caché (Ejemplo adicional)

En este caso, la secuencia empieza en 100, aumenta de 10 en 10 y no permite superar el 1000. Además, guarda 30 números en memoria para mejorar el rendimiento.

```sql
CREATE SEQUENCE seq_empleados
START WITH 100
INCREMENT BY 10
MAXVALUE 1000
NOCYCLE
CACHE 30;
```

Uso en inserción masiva (Ejemplo adicional)

Si ya tienes registros y quieres empezar la secuencia desde un punto específico para evitar conflictos de claves primarias:

```sql
-- Suponiendo que ya hay 2 actos médicos, empezamos en el 3
CREATE SEQUENCE SEQ_CODACT START WITH 3 INCREMENT BY 1;

-- Inserción usando la secuencia
INSERT INTO ACTOMEDICO (COD_ACT, DESCRIPCION, PRECIOMEDICO)
VALUES (SEQ_CODACT.NEXTVAL, 'ACTOMEDICOTRES', 10500);
```

Consulta del valor actual

A veces es útil saber qué ID se acaba de generar para usarlo en otra tabla relacionada (como una clave ajena):

```sql
SELECT seq_id.CURRVAL FROM dual;
```

**Nota:** El espacio de nombres para las secuencias es el mismo que para las tablas y vistas; por lo tanto, no puedes llamar a una secuencia igual que a una tabla dentro del mismo esquema.

---
# 11. Consulta de Datos (SELECT)

La sentencia **SELECT** es la operación más potente y compleja del sublenguaje DML (Lenguaje de Manipulación de Datos). Su función principal es **recuperar datos** de una o más tablas o vistas de la base de datos.
## 11.1 Sintaxis General

Para ejecutar esta sentencia, el usuario debe tener privilegios de selección sobre la tabla o vista que desea consultar.

```sql
SELECT [DISTINCT] {* | columna1, columna2, ... [c_alias]}
FROM tabla [t_alias]
[WHERE condicion]
[GROUP BY columnas]
[HAVING condicion_grupo]
[ORDER BY columna [ASC | DESC]];
```

---
## 11.2 Cláusulas Principales

A. Proyección (SELECT)

Permite elegir qué columnas queremos ver. El uso de ***** recupera todas las filas y columnas de la tabla. Si se desea evitar filas repetidas, se utiliza la palabra clave **DISTINCT**.

- **Ejemplo original:**

B. Filtrado (WHERE)

Establece condiciones que deben cumplir las filas para ser devueltas. Se pueden usar operadores relacionales (`=`, `>`, `<`) y especiales como:

- **BETWEEN**: Para intervalos.
- **LIKE**: Para búsqueda de patrones con comodines (`%` para varios caracteres, `_` para una posición).
- **IS NULL**: Para detectar valores nulos.
- **Ejemplo con filtros:**

C. Ordenación (ORDER BY)

Organiza el resultado según una o más columnas. Por defecto, la ordenación es **ascendente** (`ASC`), pero puede cambiarse a **descendente** con `DESC`.

- **Ejemplo original extendido:**

---
## 11.3 Funciones de Grupo y Agrupamiento

Las funciones estadísticas (o de grupo) permiten realizar cálculos sobre un conjunto de valores, ignorando los nulos.

- **SUM** **/** **AVG**: Suma y promedio.
- **COUNT**: Cuenta registros.
- **GROUP BY**: Agrupa las filas para que las funciones actúen sobre grupos específicos.
- **HAVING**: Filtra los grupos resultantes (actúa como un `WHERE` pero para grupos).
- **Ejemplo adicional (Agrupamiento):**

---
## 11.4 Combinación de Tablas (JOIN)

Debido a la normalización de las bases de datos, es común necesitar información dispersa en varias tablas.

- **Producto Cartesiano**: Si se listan varias tablas en el `FROM` sin un `WHERE` que las una, cada fila de la primera se combina con todas las de la segunda.
- **Inner Join**: Se igualan las claves ajenas con las claves primarias para obtener registros relacionados.
- **Ejemplo adicional (Join):**

---
## 11.5 Alias (Temporales)

Se pueden asignar nombres temporales tanto a columnas (`c_alias`) como a tablas (`t_alias`) para mejorar la legibilidad o facilitar la escritura.

- **Ejemplo adicional (Alias):**

---
# 12. Operadores Especiales

Los **operadores especiales** se utilizan dentro de la cláusula `WHERE` para establecer condiciones de filtrado más avanzadas que las comparaciones simples. Estos permiten trabajar con **patrones de texto, listas de valores, rangos y estados de nulidad**.

---
## 12.1 Operador `LIKE` (Comparación de Patrones)

Este operador se utiliza para buscar filas que cumplan con un **patrón específico** en columnas de texto. Utiliza dos caracteres comodín fundamentales:

- **%** **(Comodín):** Representa cualquier serie de caracteres o espacios (cero o más).
- **_** **(Subrayado):** Representa exactamente una única posición o carácter.

**Ejemplos:**

```sql
-- Obtener nombres que comienzan exactamente por 'WIL'
SELECT nombre FROM empleado WHERE nombre LIKE 'WIL%';

-- Buscar nombres cuya tercera letra sea una 'C' (mayúscula)
SELECT nombre FROM empleado WHERE nombre LIKE '__C%';
```

_Nota: Es importante recordar que_ _LIKE_ _distingue entre_ **mayúsculas y minúsculas** _en la búsqueda de patrones__._

---
## 12.2 Operador `IN` (Pertenencia a una lista)

El operador `IN` actúa de forma similar a los operadores lógicos pero trabajando sobre una **lista cerrada de valores**. Evalúa como verdadero si el valor de la columna coincide con cualquier elemento de la lista.

**Ejemplos:**

```sql
-- Filtrar empleados con edades específicas
SELECT nombre, edad FROM empleado WHERE edad IN (20, 30, 40);

-- Ejemplo con lista de cadenas (oficios)
SELECT nombre, oficio FROM empleado WHERE oficio IN ('analista', 'operador');

-- También existe la forma negativa para excluir valores
SELECT nombre FROM empleado WHERE oficio NOT IN ('leñador', 'herrero');
```

---
## 12.3 Operador `BETWEEN` (Intervalos)

Se utiliza para expresar un **intervalo de valores** de forma compacta. La condición evalúa como verdadera si el valor está comprendido entre el límite inferior y el superior, **incluyendo ambos límites**.

**Ejemplos:**

```sql
-- Buscar empleados con edad entre 18 y 30 años (inclusive)
SELECT * FROM empleado WHERE edad BETWEEN 18 AND 30;

-- Filtrar por rango de sueldos
SELECT nombre, sueldo FROM empleado WHERE sueldo BETWEEN 2000 AND 5000;
```

---
## 12.4 Operador `IS NULL` (Valores nulos)

Este operador es el único método válido para **testear si una columna contiene un valor nulo** (información no almacenada o desconocida). No se pueden utilizar comparadores tradicionales como `=` para detectar nulos, ya que el resultado de `NULL = NULL` siempre se evalúa como falso o desconocido.

**Ejemplos:**

```sql
-- Obtener empleados de los que no conocemos su edad
SELECT nombre FROM empleado WHERE edad IS NULL;

-- Obtener empleados que sí tienen una dirección registrada
SELECT nombre FROM empleado WHERE direccion IS NOT NULL;
```

--------------------------------------------------------------------------------

Resumen de Operadores Especiales

|Operador|Uso Principal|Descripción Técnica|
|---|---|---|
|**LIKE**|**Patrones**|Compara cadenas usando `%` (varios) y `_` (uno).|
|**IN**|**Lista**|Comprueba la pertenencia a un conjunto de valores.|
|**BETWEEN**|**Rango**|Evalúa si un valor está en un intervalo inclusivo `[a, b]`.|
|**IS NULL**|**Valores nulos**|Verifica si un campo está vacío o es desconocido.|

---
# 13. JOIN (Combinación de tablas)

La combinación de tablas o **JOIN** es una de las operaciones más fundamentales de SQL. Debido a la **normalización** de las bases de datos, la información suele estar dispersa en varias tablas relacionadas; los joins permiten reunir esos datos en un único resultado.

---
## 13.1 INNER JOIN (Combinación Interna)

Es el tipo de combinación más común. Devuelve únicamente las filas donde existe una **coincidencia** entre las columnas especificadas en ambas tablas (generalmente una clave ajena y una clave primaria).

Conceptos Clave

- **Producto Cartesiano**: Si se listan varias tablas en el `FROM` sin una condición de unión, cada fila de la primera tabla se combina con todas las de la segunda, generando resultados masivos y a menudo incorrectos.
- **Cláusula ON**: En la sintaxis moderna, se utiliza para especificar la condición de igualdad que debe cumplirse para "unir" los registros.
- **Ambigüedad**: Si ambas tablas tienen columnas con el mismo nombre, es obligatorio calificarlas con el nombre de la tabla (ej. `ALOJAMIENTO.ALOJAMIENTO`) para evitar errores del analizador.

**Ejemplos:**

```sql
-- Ejemplo original: Unión de Empleado y Alojamiento
SELECT e.nombre, a.alojamiento
FROM empleado e
JOIN alojamiento a
ON e.alojamiento = a.numaloj;

-- Ejemplo adicional: Combinación de 3 tablas (Empleado, Oficio y su relación)
-- Se requiere igualar las claves para que los datos sean coherentes
SELECT e.nombre, o.oficio 
FROM empleado e 
JOIN oficioempleado oe ON e.numemp = oe.empleado 
JOIN oficio o ON oe.oficio = o.numoficio;

-- Ejemplo adicional: Inner Join con filtros adicionales (WHERE)
SELECT e.nombre, a.alojamiento 
FROM empleado e 
JOIN alojamiento a ON e.alojamiento = a.numaloj 
WHERE e.nombre LIKE 'G%';
```

---
## 13.2 LEFT JOIN (Combinación Externa Izquierda)

El **LEFT OUTER JOIN** se utiliza cuando queremos obtener **todas las filas de la tabla de la izquierda** (la primera que aparece en la sentencia), incluso si no tienen una correspondencia en la tabla de la derecha.

Funcionamiento

- Si un registro de la tabla izquierda no encuentra coincidencia, las columnas de la tabla derecha se rellenan con **valores nulos (NULL)**.
- Es ideal para encontrar elementos "huérfanos" o generar listados completos (ej. todos los empleados, tengan o no un oficio registrado).

**Ejemplos:**

```sql
-- Ejemplo original: Asegura que salgan todos los empleados, aunque no tengan alojamiento
SELECT e.nombre, a.alojamiento
FROM empleado e
LEFT JOIN alojamiento a
ON e.alojamiento = a.numaloj;

-- Ejemplo adicional: Uso de NVL para mejorar la presentación
-- Si el empleado no tiene oficio, mostrará un texto descriptivo en lugar de un hueco
SELECT e.nombre, NVL(o.oficio, 'SIN OFICIO REGISTRADO') AS oficio 
FROM empleado e 
LEFT JOIN oficioempleado oe ON e.numemp = oe.empleado 
LEFT JOIN oficio o ON oe.oficio = o.numoficio 
ORDER BY e.nombre;

-- Ejemplo adicional: Sintaxis antigua de Oracle (+)
-- El signo (+) se coloca en la tabla donde queremos "forzar" la fila nula
SELECT nombre, oficio 
FROM empleado e, oficioempleado o 
WHERE e.numemp = o.empleado(+);
```

---
## 13.3 Otros tipos de Combinación (Resumen)

Aunque los anteriores son los más frecuentes, las fuentes mencionan otros conceptos relacionados:

- **RIGHT JOIN**: Similar al Left Join, pero preserva todas las filas de la tabla de la derecha.
- **Self-Join**: Es cuando una tabla se combina **consigo misma**. Es muy útil para estructuras jerárquicas (ej. una tabla de empleados donde una columna es el código del jefe, que también es un empleado).

**Ejemplo de Self-Join:**

```sql
-- Obtener el nombre del empleado y el nombre de su jefe usando la misma tabla
SELECT e.nombre AS empleado, j.nombre AS jefe 
FROM trabajador e 
JOIN trabajador j ON e.cod_jefe = j.cod_emp;
```

---
# 14. Alias

Un **alias** es un **nombre temporal** que se asigna a una tabla o a una columna dentro de una sentencia SQL para referenciarla de forma más sencilla o clara en otras partes de la misma consulta.

---
## 14.1 Alias de Columna

Se utilizan principalmente para que los resultados de una consulta sean más legibles y comprensibles para el usuario final, especialmente cuando los nombres técnicos de las tablas son abreviaturas poco claras.

- **Identificador simple:** Se escribe el alias directamente después del nombre de la columna.
- **Cadena de caracteres:** Si el alias contiene espacios o caracteres especiales, se debe escribir entre **comillas dobles**.

**Ejemplos:**

```sql
-- Alias simples para nombre y edad
SELECT NOMBRE EMPLEADO, EDAD AÑOS 
FROM EMPLEADO;

-- Alias con espacios usando comillas dobles
SELECT NOMBRE "NOMBRE DEL EMPLEADO", EDAD "EDAD ACTUAL" 
FROM EMPLEADO;
```

---
## 14.2 Alias de Tabla

Un alias de tabla es un nombre temporal que se asigna en la cláusula `FROM`. Tiene dos usos fundamentales:

1. **Comodidad:** Permite abreviar nombres de tablas largos para no tener que repetirlos al calificar columnas (ej. usar `E` en lugar de `EMPLEADO`).
2. **Auto-combinación (Self-Join):** Es **obligatorio** cuando se necesita combinar una tabla consigo misma, para que el sistema pueda distinguir entre las dos instancias de la misma tabla.

**Ejemplo de abreviación:**

```sql
-- 'E' y 'A' actúan como nombres cortos para calificar las columnas
SELECT E.NOMBRE, A.ALOJAMIENTO 
FROM EMPLEADO E, ALOJAMIENTO A 
WHERE E.ALOJAMIENTO = A.NUMALOJ;
```

---
## 14.3 Ejemplo Avanzado: Auto-combinación (Self-Join)

En el ejemplo que proporcionaste, se utiliza la tabla `TRABAJADOR` dos veces. Sin los alias `e` (empleado) y `j` (jefe), Oracle no sabría a qué instancia de la tabla nos referimos al comparar los códigos.

```sql
-- Se obtienen los nombres comparando el código del jefe con el del empleado
SELECT e.nombre "Empleado",
       j.nombre "Jefe"
FROM trabajador e, trabajador j
WHERE e.cod_jefe = j.cod_emp;
```

**Salida esperada de este ejemplo:** | Empleado | Jefe | | :--- | :--- | | BLAKE | KING | | CLARK | KING | | SMITH | FORD | | ADAMS | SCOTT | _(Los alias de columna "Empleado" y "Jefe" definen las cabeceras del listado)_.

---
## 14.4 Uso en funciones y expresiones

Los alias también son muy útiles para dar nombre al resultado de una **operación aritmética** o una **función de grupo**, ya que por defecto Oracle mostraría la fórmula completa como título de la columna.

**Ejemplo adicional:**

```sql
-- Se asigna el alias 'TOTAL' al resultado de la suma
SELECT SUM(CANTIDAD) TOTALARTICULOSVENDIDOS 
FROM DETALLEPEDIDO;

-- Uso de alias para ordenar (ORDER BY permite referenciar alias de columna)
SELECT PRODUCTO, SUM(CANTIDAD) UNIDADESVENDIDAS 
FROM DETALLEPEDIDO 
GROUP BY PRODUCTO 
ORDER BY UNIDADESVENDIDAS;
```

---
# 15. Subconsultas

Una **subconsulta** es, esencialmente, una consulta situada dentro de otra consulta principal. Es una de las dos formas fundamentales (junto con la combinación de tablas o _join_) para obtener información que reside en más de una tabla como consecuencia de la normalización de los datos.
## 15.1 Funcionamiento Básico

En una subconsulta, la cláusula `WHERE` de la sentencia principal utiliza el resultado devuelto por la consulta interna para realizar su propio filtrado.

**Ejemplo Original:** En este caso, primero se obtiene el código (`numaloj`) del alojamiento 'CRAMMER' y luego se usa ese valor para buscar a los empleados.

```sql
SELECT nombre
FROM empleado
WHERE alojamiento =
(
    SELECT numaloj
    FROM alojamiento
    WHERE alojamiento = 'CRAMMER'
);
```

---
## 15.2 Operadores de Comparación

Dependiendo de si la subconsulta devuelve un solo valor o una lista de ellos, debemos usar diferentes operadores:
### A. Operador de igualdad (`=`)

Se utiliza cuando la subconsulta genera un **valor único** (una sola fila y una sola columna).

- **Importante:** Si la subconsulta devuelve más de una fila y usamos `=`, Oracle devolverá el error _“single-row subquery returns more than one row”_.
### B. Operadores `IN`, `ANY` (o `SOME`)

Se utilizan cuando la subconsulta puede retornar **múltiples filas**.

- **IN**: Evalúa como verdadero si el valor de la columna coincide con **cualquiera** de los elementos de la lista devuelta por la subconsulta.
- **ANY** **/** **SOME**: Son equivalentes a `IN`. La condición es verdadera si la comparación es cierta para al menos un valor de la lista.

**Ejemplo (Empleados en alojamientos específicos):**

```sql
SELECT nombre 
FROM empleado 
WHERE alojamiento IN (SELECT numaloj 
                      FROM alojamiento 
                      WHERE alojamiento IN ('MULLERS', 'PAPA KING'));
```
### C. Operador `ALL`

Compara un valor con **todos** los valores de la lista resultante de la subconsulta. Se evalúa como verdadero solo si la comparación es cierta para cada uno de los elementos de la lista, o si la subconsulta no devuelve ninguna fila.

**Ejemplo (Filtrar por rango superior):**

```sql
-- Obtener empleados cuyo código de alojamiento es mayor que el de 'MULLERS' y 'PAPA KING'
SELECT nombre 
FROM empleado 
WHERE alojamiento > ALL (SELECT numaloj 
                         FROM alojamiento 
                         WHERE alojamiento IN ('MULLERS', 'PAPA KING'));
```
### D. Operador `EXISTS`

Este operador se evalúa como cierto si la subconsulta devuelve **al menos una fila**, sin importar el contenido de la misma.

**Ejemplo (Empleados con oficio registrado):**

```sql
SELECT nombre 
FROM empleado 
WHERE EXISTS (SELECT empleado 
              FROM oficioempleado 
              WHERE oficioempleado.empleado = empleado.numemp);
```

---
## 15.3 Conceptos Avanzados

Subconsultas Correlacionadas

Son subconsultas que se evalúan **una vez por cada fila** procesada por la sentencia principal (padre). Se identifican porque la subconsulta contiene una referencia a una tabla de la consulta padre.

**Ejemplo (Sueldos superiores a la media del departamento):**

```sql
SELECT departamento, nombre, sueldo 
FROM empleado e 
WHERE sueldo > (SELECT AVG(sueldo) 
                FROM empleado t 
                WHERE e.departamento = t.departamento);
```

Subconsultas en la cláusula `FROM`

Es posible situar una subconsulta en el `FROM`, actuando como si fuera una **tabla temporal** que contiene los valores calculados. Esto permite estructurar consultas complejas de forma muy versátil sin necesidad de crear objetos permanentes en la base de datos.

Anidamiento

Oracle permite anidar subconsultas dentro de otras subconsultas para resolver problemas lógicos complejos.

**Ejemplo (Nombres de los 'LEÑADORES'):**

```sql
SELECT nombre 
FROM empleado 
WHERE numemp IN (SELECT empleado 
                 FROM oficioempleado 
                 WHERE oficio = (SELECT numoficio 
                                 FROM oficio 
                                 WHERE oficio = 'LEÑADOR'));
```

---
# 16. Subconsultas Correlacionadas

Una **subconsulta correlacionada** es un tipo especial de subconsulta que se evalúa **una vez por cada fila** procesada por la sentencia principal o "padre". A diferencia de las subconsultas simples, que se ejecutan una sola vez para devolver un valor o lista a la consulta externa, la subconsulta correlacionada **depende de los valores de la fila actual** que está analizando la consulta padre.

¿Cómo funcionan?

El proceso de ejecución sigue estos pasos:

1. La consulta principal selecciona una fila.
2. Se pasa un valor de esa fila a la subconsulta (por eso se dice que están "correlacionadas").
3. La subconsulta se ejecuta utilizando ese valor y devuelve un resultado.
4. La consulta principal utiliza ese resultado para decidir si la fila cumple la condición del `WHERE`.
5. Se repite el proceso para la siguiente fila de la tabla principal.

---

Análisis del ejemplo principal

En este caso, buscamos empleados cuyo sueldo sea superior a la media de su propio departamento.

```sql
SELECT nombre, sueldo
FROM empleado e
WHERE sueldo >
(
    -- Esta subconsulta se ejecuta por cada empleado (e)
    SELECT AVG(sueldo)
    FROM empleado t
    WHERE e.departamento = t.departamento -- Correlación aquí
);
```

**Explicación:** Para cada empleado en la tabla `e`, la subconsulta calcula el sueldo promedio (`AVG`) únicamente de los empleados (`t`) que pertenecen al mismo departamento que el empleado actual (`e.departamento`). Si el sueldo de ese empleado en particular es mayor que el promedio de sus compañeros de departamento, se incluye en el listado final.

---

Ejemplos adicionales
### 1. Uso con el operador `EXISTS`

Este operador es muy común en subconsultas correlacionadas. Evalúa si la subconsulta devuelve al menos una fila. Por ejemplo, para obtener los nombres de los empleados que tienen algún oficio registrado en la tabla `OFICIOEMPLEADO`:

```sql
SELECT nombre 
FROM empleado e
WHERE EXISTS (
    SELECT 1
    FROM oficioempleado oe
    WHERE oe.empleado = e.numemp -- Correlación con el ID del empleado actual
);
```

Aquí, la subconsulta verifica para cada empleado de la tabla principal si existe al menos una entrada correspondiente en la tabla de oficios.
### 2. Encontrar el empleado de mayor edad por alojamiento

Si queremos saber quién es el trabajador más viejo en cada uno de los alojamientos registrados:

```sql
SELECT nombre, edad, a.alojamiento
FROM empleado e, alojamiento a
WHERE e.alojamiento = a.numaloj
AND edad = (
    SELECT MAX(edad)
    FROM empleado t
    WHERE e.alojamiento = t.alojamiento -- Correlación por código de alojamiento
);
```
### 3. Uso en sentencias `UPDATE`

Las subconsultas correlacionadas no solo sirven para consultar datos (`SELECT`), también pueden usarse para modificarlos. Por ejemplo, para incrementar el sueldo de todos los empleados que tienen el oficio de "HERRERO" igualándolo al sueldo más alto registrado en la empresa:

```sql
UPDATE empleado e
SET sueldo = (SELECT MAX(sueldo) FROM empleado)
WHERE numemp IN (
    SELECT numemp
    FROM empleado t, oficioempleado oe, oficio o
    WHERE t.numemp = oe.empleado
    AND oe.oficio = o.numoficio
    AND o.oficio = 'HERRERO'
    AND e.numemp = t.numemp -- Correlación para asegurar el empleado correcto
);
```

> Regla de oro

Siempre que una subconsulta contenga una **referencia a una columna de una tabla que aparece en la consulta padre** (usualmente mediante alias como `e.columna`), se convierte automáticamente en una **subconsulta correlacionada**.

---
# 17. Funciones de Agregación

Las **funciones de agregación**, también denominadas funciones para grupos de valores o funciones estadísticas, son herramientas que permiten realizar cálculos sobre un conjunto de datos tomados como un todo. Estas funciones son fundamentales para obtener resúmenes informativos, como el precio medio de los productos o el volumen total de ventas.

Un aspecto crítico de estas funciones es que **ignoran los valores** **NULL** al realizar sus cálculos, procesando únicamente las filas que contienen datos efectivos.

---
## 17.1 Detalle de las Funciones

|Función|Descripción|Aplicación Técnica|
|---|---|---|
|**SUM()**|**Suma**|Suma todos los valores de una columna numérica.|
|**AVG()**|**Media**|Calcula el promedio aritmético de los valores.|
|**COUNT()**|**Conteo**|Cuenta el número de registros o valores no nulos.|
|**MIN()**|**Mínimo**|Identifica el valor más pequeño de un conjunto.|
|**MAX()**|**Máximo**|Identifica el valor más alto de un conjunto.|

---
## 17.2 Ejemplos de Uso

Uso Básico

Se pueden utilizar para obtener un único valor de toda una tabla:

```sql
-- Obtener el total de artículos vendidos (SUM)
SELECT SUM(CANTIDAD) AS TOTAL_ARTICULOS FROM DETALLEPEDIDO;

-- Calcular la cantidad media por línea de detalle (AVG)
SELECT AVG(CANTIDAD) AS MEDIA_CANTIDAD FROM DETALLEPEDIDO;

-- Encontrar la cantidad máxima solicitada en un pedido (MAX)
SELECT MAX(CANTIDAD) AS MAX_PEDIDO FROM DETALLEPEDIDO;
```

Variaciones de `COUNT`

Existen distintas formas de contar registros según la necesidad:

```sql
-- Contar todos los artículos del pedido 617, incluyendo duplicados
SELECT COUNT(*) FROM DETALLEPEDIDO WHERE NUMPEDIDO = 617;

-- Contar cuántos pedidos distintos existen (evitando duplicados con DISTINCT)
SELECT COUNT(DISTINCT NUMPEDIDO) AS TOTAL_PEDIDOS FROM DETALLEPEDIDO;
```

Uso en Subconsultas

Las funciones de agregación pueden anidarse para obtener registros específicos basados en un valor calculado:

```sql
-- Obtener los productos cuya cantidad coincide con la máxima de la tabla
SELECT DISTINCT PRODUCTO, CANTIDAD 
FROM DETALLEPEDIDO 
WHERE CANTIDAD = (SELECT MAX(CANTIDAD) FROM DETALLEPEDIDO);
```

---
## 17.3 Agrupamiento con `GROUP BY` y `HAVING`

Para que estas funciones operen sobre grupos específicos (por ejemplo, totales por producto), se utiliza la cláusula **GROUP BY**. Si se desea filtrar el resultado de estos grupos basándose en el cálculo realizado, se emplea **HAVING**, que actúa como un `WHERE` pero aplicado a los grupos.

**Ejemplo de agrupación y filtrado:**

```sql
-- Listar productos con más de 1500 unidades vendidas en total
SELECT PRODUCTO, SUM(CANTIDAD) AS UNIDADES_VENDIDAS 
FROM DETALLEPEDIDO 
GROUP BY PRODUCTO 
HAVING SUM(CANTIDAD) > 1500 
ORDER BY UNIDADES_VENDIDAS;

-- Listar oficios y el número de trabajadores en cada uno
SELECT O.OFICIO, COUNT(*) AS TOTAL_TRABAJADORES 
FROM OFICIO O, OFICIOEMPLEADO OE 
WHERE NUMOFICIO = OE.OFICIO 
GROUP BY O.OFICIO;
```

Reglas de Ejecución

Cuando se usa una sentencia con agrupamiento, Oracle sigue este orden:

1. Filtra las filas individuales mediante **WHERE**.
2. Agrupa las filas resultantes según **GROUP BY**.
3. Calcula las **funciones de grupo** para cada conjunto.
4. Filtra los grupos finales mediante **HAVING**.
5. Ordena el resultado final mediante **ORDER BY**.

---
# 18. GROUP BY y HAVING

Estas cláusulas permiten organizar los datos en conjuntos lógicos y aplicar funciones estadísticas sobre ellos, permitiendo obtener resúmenes informativos en lugar de filas individuales.
## 18.1 La Cláusula GROUP BY

La cláusula **GROUP BY** agrupa las filas devueltas por una consulta basándose en el valor de una o más columnas.

- **Funcionamiento:** Se crea un grupo único para todas aquellas filas que comparten el mismo valor en la columna especificada.
- **Funciones de Grupo:** Una vez creados los grupos, las funciones de agregación (como `SUM`, `AVG`, `COUNT`, `MIN` o `MAX`) realizan sus cálculos sobre cada grupo de forma independiente.

**Ejemplo de uso:**

```sql
-- Obtener el total de unidades vendidas por cada producto
SELECT producto, SUM(cantidad) AS unidades_vendidas
FROM detallepedido
GROUP BY producto; -- Crea un grupo por cada nombre de producto diferente
```

---
## 18.2 La Cláusula HAVING

La cláusula **HAVING** se utiliza para **filtrar los grupos** resultantes después de haber aplicado el agrupamiento y las funciones de cálculo.

- **Diferencia clave:** Mientras que `WHERE` filtra filas individuales antes de agrupar, `HAVING` actúa específicamente sobre los resultados de las funciones de grupo.
- **Alias:** A diferencia de `ORDER BY`, en la cláusula `HAVING` no se puede hacer referencia a los alias de columna; se debe escribir la función de grupo completa.

**Ejemplo original (con filtrado de grupos):**

```sql
SELECT producto, SUM(cantidad)
FROM detallepedido
GROUP BY producto
HAVING SUM(cantidad) > 1500; -- Solo muestra productos cuyo total vendido supera las 1500 unidades
```

---
## 18.3 Orden de Procesamiento en una Sentencia

Cuando una consulta incluye todas estas cláusulas, la base de datos sigue un orden estricto de ejecución para garantizar la coherencia de los resultados:

1. **WHERE**: Selecciona y filtra las filas individuales.
2. **GROUP BY**: Agrupa las filas filtradas en el paso anterior.
3. **Funciones de Grupo**: Calcula los valores (suma, media, etc.) para cada grupo.
4. **HAVING**: Selecciona o elimina los grupos según el resultado de sus cálculos.
5. **ORDER BY**: Ordena los grupos finales.

|Cláusula|Función|Momento de ejecución|
|---|---|---|
|**WHERE**|Filtra filas individuales|Antes de agrupar|
|**GROUP BY**|Agrupa registros|Durante el procesamiento|
|**HAVING**|Filtra grupos|Después de agrupar y calcular|

---
## 18.4 Ejemplos Adicionales

### A. Conteo de trabajadores por oficio

Este ejemplo combina dos tablas para contar cuántas personas desempeñan cada labor registrada en la empresa.

```sql
SELECT O.oficio, COUNT(*) AS trabajadores
FROM oficio O, oficioempleado OE
WHERE O.numoficio = OE.oficio -- Filtro de filas (Join)
GROUP BY O.oficio; -- Agrupa por el nombre del oficio
```
### B. Filtrado de trabajadores con múltiples oficios

Aquí se utiliza `HAVING` para mostrar solo a aquellos empleados que tienen una alta especialización (más de un oficio registrado).

```sql
SELECT nombre, COUNT(oficio) AS num_oficios
FROM empleado, oficioempleado
WHERE numemp = empleado
GROUP BY nombre
HAVING COUNT(oficio) > 1; -- Filtra los grupos que tienen 0 o 1 oficio
```
### C. Edad máxima por alojamiento

Permite identificar la edad del trabajador más veterano en cada una de las residencias de la empresa.

```sql
SELECT alojamiento, MAX(edad) AS edad_maxima
FROM empleado
GROUP BY alojamiento; -- Genera el máximo para cada código de alojamiento
```

---
# 19. Operadores de Conjunto

Los **operadores de conjunto** permiten combinar los resultados de dos o más consultas `SELECT` independientes en un único conjunto de resultados. Para que estas operaciones sean válidas, las consultas deben ser **compatibles en su esquema**, lo que significa que deben devolver el mismo número de columnas y que estas deben tener tipos de datos compatibles entre sí.

---
## 19.1 UNION (Unión)

El operador **UNION** combina los resultados de dos relaciones compatibles. El conjunto resultante incluye todas las filas que pertenecen a la primera consulta, a la segunda, o a ambas.

- **Eliminación de duplicados:** Por defecto, `UNION` elimina automáticamente las filas duplicadas para que el resultado final contenga únicamente tuplas únicas.

**Ejemplo:** Obtener el nombre de los trabajadores cuyo oficio sea 'LEÑADOR' o 'CONDUCTOR DE SEGADORA'.

```sql
SELECT NOMBRE FROM EMPLEADO E, OFICIO O, OFICIOEMPLEADO OE 
WHERE NUMEMP=EMPLEADO AND OE.OFICIO=NUMOFICIO AND O.OFICIO='LEÑADOR' 
UNION 
SELECT NOMBRE FROM EMPLEADO E, OFICIO O, OFICIOEMPLEADO OE 
WHERE NUMEMP=EMPLEADO AND OE.OFICIO=NUMOFICIO AND O.OFICIO='CONDUCTOR DE SEGADORA';
```

---
## 19.2 INTERSECT (Intersección)

El operador **INTERSECT** devuelve únicamente las filas que aparecen en **ambas consultas** simultáneamente. Es decir, el resultado está constituido por las tuplas que pertenecen a las dos relaciones al mismo tiempo.

**Ejemplo:** Nombre de los trabajadores que tienen registrado poder trabajar como leñadores y también como herreros.

```sql
-- Ejemplo original solicitado
SELECT nombre FROM empleado WHERE oficio='LEÑADOR'
INTERSECT
SELECT nombre FROM empleado WHERE oficio='HERRERO';

-- Ejemplo adicional: Trabajadores que son leñadores y conductores a la vez
SELECT NOMBRE FROM EMPLEADO E, OFICIO O, OFICIOEMPLEADO OE 
WHERE NUMEMP=EMPLEADO AND OE.OFICIO=NUMOFICIO AND O.OFICIO='LEÑADOR' 
INTERSECT 
SELECT NOMBRE FROM EMPLEADO E, OFICIO O, OFICIOEMPLEADO OE 
WHERE NUMEMP=EMPLEADO AND OE.OFICIO=NUMOFICIO AND O.OFICIO='CONDUCTOR DE SEGADORA';
```

---
## 19.3 MINUS (Diferencia)

El operador **MINUS** (conocido como `EXCEPT` en otros estándares) devuelve las tuplas que pertenecen a la primera relación pero **no están presentes** en la segunda.

**Ejemplo:** Nombres de los empleados que son conductores de segadora pero que **no** son leñadores.

```sql
SELECT NOMBRE FROM EMPLEADO E, OFICIO O, OFICIOEMPLEADO OE 
WHERE NUMEMP=EMPLEADO AND OE.OFICIO=NUMOFICIO AND O.OFICIO='CONDUCTOR DE SEGADORA' 
MINUS 
SELECT NOMBRE FROM EMPLEADO E, OFICIO O, OFICIOEMPLEADO OE 
WHERE NUMEMP=EMPLEADO AND OE.OFICIO=NUMOFICIO AND O.OFICIO='LEÑADOR';
```

--------------------------------------------------------------------------------

Resumen Comparativo de Operadores

|Operador|Descripción|Resultado Final|
|---|---|---|
|**UNION**|Une resultados|Filas de A + Filas de B (sin duplicados).|
|**INTERSECT**|Intersección|Filas que están en A **Y** también en B.|
|**MINUS**|Diferencia|Filas que están en A **PERO NO** en B.|

> **Nota técnica:** En el caso de `UNION`, si se quisiera una consulta equivalente sin usar el operador de conjunto, se podría emplear el operador lógico **OR** o el operador **IN** con una lista de valores, asegurando el uso de `DISTINCT` para eliminar duplicados.

---
# 20. Consultas Jerárquicas

Si una tabla contiene datos con una estructura de árbol (como una relación de empleados y jefes), Oracle permite recuperar las filas siguiendo un **orden jerárquico** mediante cláusulas específicas en la sentencia `SELECT`.

---
## 20.1 Cláusulas Fundamentales

Para construir este tipo de consultas, se utilizan tres elementos clave:

- **START WITH**: Define la fila o filas que actuarán como la **raíz (padre)** de la jerarquía.
- **CONNECT BY**: Especifica la relación lógica entre las filas padre y las filas hijo.
- **PRIOR**: Es un operador que se coloca dentro de `CONNECT BY` para identificar qué columna pertenece al registro padre en la comparación.

La Pseudocolumna `LEVEL`

Oracle incluye de forma automática la columna **LEVEL**, que devuelve un número entero indicando la profundidad del nodo:

- **1**: Nodo raíz.
- **2**: Nodo hijo.
- **3**: Nodo nieto, y así sucesivamente.

---
## 20.2 Ejemplos de Uso

Ejemplo 1: Estructura Básica (Top-Down)

Este ejemplo recorre la jerarquía desde el presidente (`KING`) hacia abajo, relacionando el código de empleado del padre con el código de jefe del hijo.

```sql
SELECT nombre
FROM trabajador
START WITH nombre='KING'
CONNECT BY PRIOR cod_emp = cod_jefe;
```

Ejemplo 2: Formateo Visual (Árbol)

Para visualizar la jerarquía de forma gráfica, se puede combinar `LEVEL` con la función **LPAD** para añadir espacios en blanco proporcionales a la profundidad del trabajador.

```sql
-- Los espacios se calculan según el nivel: 2 * (LEVEL - 1)
SELECT LPAD('   ', 2*(LEVEL-1)) || nombre AS TRABAJADOR, 
       cod_emp, 
       cod_jefe
FROM trabajador
START WITH nombre='KING'
CONNECT BY PRIOR cod_emp = cod_jefe;
```

**Resultado esperado****:**

```sql
KING
  JONES
    SCOTT
      ADAMS
    FORD
      SMITH
  BLAKE
    ...
```

Ejemplo 3: Filtrado en Jerarquías

Se puede usar una cláusula **WHERE** para restringir los resultados. Es importante notar que Oracle evalúa el `WHERE` **después** de construir la jerarquía; si una fila no cumple la condición, se elimina del resultado, pero sus hijos sí pueden aparecer si ellos la cumplen individualmente.

```sql
-- Obtener la jerarquía de KING pero solo mostrar empleados específicos
SELECT LEVEL, nombre
FROM trabajador
WHERE nombre != 'FORD' -- Filtra a FORD pero permite ver a sus subordinados
START WITH nombre='KING'
CONNECT BY PRIOR cod_emp = cod_jefe;
```

---
## 20.3 Reglas de Procesamiento y Restricciones

1. **Orden de ejecución**: Primero se seleccionan las filas raíz (`START WITH`), luego sus hijos inmediatos (`CONNECT BY`), y después las siguientes generaciones de forma recursiva,.
2. **Bucles**: Si en la base de datos existe un error de lógica donde una fila es antecesora y descendiente de sí misma a la vez, Oracle detectará un **bucle** y devolverá un mensaje de error.
3. **Límites**: El número de niveles máximos que puede mostrar la consulta depende principalmente de la memoria disponible en el sistema.

---
# 21. Database Links (Enlaces de Base de Datos)

Un **Database Link** es un objeto de la base de datos que permite acceder a datos y objetos de un esquema a través de un **sistema de base de datos distribuido**. En términos sencillos, permite que una sesión en una base de datos local pueda consultar o manipular tablas que se encuentran físicamente en un servidor remoto.
## 21.1 Tipos de Enlaces

Dependiendo de quién pueda utilizar el enlace, Oracle distingue tres tipos:

- **Privado:** Solo puede ser utilizado por el dueño del enlace o por los subprogramas (procedimientos, funciones) de su esquema. Requiere el privilegio `CREATE DATABASE LINK`.
- **Público:** Puede ser utilizado por todos los usuarios y subprogramas de la base de datos donde se ha definido. Requiere el privilegio `CREATE PUBLIC DATABASE LINK`.
- **Global:** Es accesible para todos los usuarios y subprogramas de todo el sistema de base de datos distribuido.

**Nota de seguridad:** Para que el enlace funcione, el usuario especificado en la conexión debe tener el privilegio **CREATE SESSION** en la base de datos remota.

---
## 21.2 Sintaxis y Configuración

La creación de un enlace requiere definir las credenciales de acceso y la ubicación del servidor remoto.

```sql
CREATE [PUBLIC] DATABASE LINK nombre_enlace
CONNECT TO usuario IDENTIFIED BY password
USING 'cadena_conexion';
```

Parámetros principales:

- **PUBLIC**: (Opcional) Indica que el enlace será accesible para todos los usuarios. Si se omite, el enlace es privado.
- **CONNECT TO**: Especifica el usuario y la contraseña con permisos sobre el esquema remoto del que se obtendrán los datos.
- **USING**: Especifica el nombre del servicio de la base de datos remota. Este nombre debe estar definido previamente en el archivo de configuración de red de Oracle (**tnsnames.ora**) del servidor local.

---
## 21.3 Ejemplos de Uso

Ejemplo 1: Creación de un enlace privado (Ejemplo original)

Este comando crea un enlace básico para acceder a otra base de datos usando credenciales específicas.

```sql
CREATE DATABASE LINK enlace
CONNECT TO usuario IDENTIFIED BY password
USING 'cadena_conexion';
```

Ejemplo 2: Creación de un enlace a un servidor específico

Supongamos que queremos acceder desde nuestra base de datos local al esquema `CICLO` que reside en un servidor remoto identificado en el `tnsnames.ora` como `ORADELL`:

```sql
CREATE DATABASE LINK CICLODELL 
CONNECT TO CICLO IDENTIFIED BY CICLO 
USING 'ORADELL';
```

Ejemplo 3: Consulta de datos remotos

Para consultar una tabla remota, simplemente se añade el sufijo **@nombre_enlace** detrás del nombre de la tabla.

```sql
-- Acceder a la tabla CICLO a través del enlace creado en el ejemplo anterior
SELECT * FROM CICLO@CICLODELL;
```

Ejemplo 4: Uso de Sinónimos para mayor comodidad (Adicional)

Dado que escribir el sufijo `@enlace` en cada consulta puede ser tedioso, es una práctica común crear un **sinónimo**. Esto permite referenciar la tabla remota como si fuera una tabla local.

```sql
-- Crear un sinónimo local para la tabla remota
CREATE SYNONYM tabla_local FOR CICLO@CICLODELL;

-- Ahora puedes consultar la tabla remota sin usar el sufijo @
SELECT * FROM tabla_local;
```

---
## 21.4 El archivo `tnsnames.ora`

Para que el parámetro `USING` funcione, el administrador debe haber configurado el archivo `tnsnames.ora` con los detalles técnicos del host remoto (IP, puerto y nombre del servicio). Por ejemplo:

```sql
ORADELL =
  (DESCRIPTION =
    (ADDRESS = (PROTOCOL = TCP)(HOST = 10.0.1.12)(PORT = 1521))
    (CONNECT_DATA =
      (SERVER = DEDICATED)
      (SERVICE_NAME = ORADAI)
    )
  )
```

---
# 22. Vistas

Una **vista** se define como una **tabla virtual** basada en una o más tablas (o incluso otras vistas). A diferencia de las tablas físicas, las vistas no almacenan los datos en la base de datos; lo que se guarda permanentemente es su **definición** en el diccionario de datos. Desde la perspectiva del usuario, funciona exactamente como una tabla real con filas y columnas.

Propósitos de las Vistas

- **Seguridad:** Permiten restringir el acceso, haciendo que ciertos usuarios solo vean columnas o filas específicas de las tablas base.
- **Simplicidad:** Ocultan la complejidad de las consultas, permitiendo tratar un resultado compuesto por varias tablas como si fuera una sola.
- **Perspectiva:** Organizan los datos para que diferentes usuarios los vean según sus necesidades particulares (nivel externo de la arquitectura ANSI).

---
## 22.1 Creación y Opciones Avanzadas

La sintaxis básica permite añadir parámetros para controlar cómo se crea y se comporta la vista:

- **OR REPLACE**: Permite recrear una vista que ya existe para cambiar su definición sin tener que borrarla previamente.
- **FORCE**: Crea la vista incluso si las tablas base aún no existen o si no se tienen permisos sobre ellas en ese momento (aunque se comprobarán al intentar usarla).
- **WITH READ ONLY**: Esta opción es fundamental cuando queremos que la vista sea estrictamente para consulta, impidiendo cualquier inserción, modificación o borrado de datos a través de ella.
- **WITH CHECK OPTION**: Asegura que cualquier operación de `INSERT` o `UPDATE` realizada a través de la vista cumpla con las condiciones de la consulta `SELECT` que define la propia vista.

---
## 22.2 Ejemplos de Implementación

Inserción y Manipulación básica

Es posible realizar operaciones de manipulación de datos (DML) a través de una vista, las cuales afectarán directamente a la tabla base.

```sql
-- Ejemplo original: Creación de vista simple
CREATE VIEW vista_empleados AS
SELECT nombre, sueldo
FROM empleado;

-- Consultar la vista como si fuera una tabla
SELECT * FROM vista_empleados;

-- Insertar datos a través de la vista
INSERT INTO vista_empleados (nombre, sueldo) 
VALUES ('PEPITO', 3000);
```

Uso de Joins y Alias

Las vistas son ideales para simplificar relaciones complejas. En este caso, se usa un `LEFT OUTER JOIN` para asegurar que aparezcan empleados aunque no tengan alojamiento.

```sql
CREATE OR REPLACE VIEW ALOJAMIENTOEMPLEADO AS
SELECT nombre EMPLEADO, A.alojamiento
FROM empleado E 
LEFT OUTER JOIN alojamiento A ON E.alojamiento = A.numaloj;

-- Uso de la vista con funciones adicionales
SELECT empleado, NVL(alojamiento, '** NO REGISTRADO **') AS alojamiento 
FROM ALOJAMIENTOEMPLEADO;
```

Simplificación de consultas complejas

Podemos crear una vista que filtre un grupo específico (por ejemplo, los "HERREROS") para que las consultas posteriores sean mucho más cortas.

```sql
-- Vista que pre-filtra los empleados con oficio 'HERRERO'
CREATE VIEW HERRERO AS
SELECT E.numemp, nombre
FROM empleado E, oficio O, oficioempleado OE
WHERE E.numemp = OE.empleado 
AND O.numoficio = OE.oficio 
AND O.oficio = 'HERRERO';

-- Consulta sencilla apoyada en la vista anterior
SELECT E.nombre, sueldo 
FROM empleado E, HERRERO H
WHERE E.numemp = H.numemp 
AND sueldo > 1;
```

---
## 22.3 Restricciones de Modificación

No siempre es posible insertar o actualizar datos a través de una vista. Las limitaciones más importantes incluyen:

1. Si la vista omite columnas de la tabla base que son **NOT NULL** o que forman parte de la **clave primaria**.
2. Si la consulta constructora de la vista contiene:
    - Funciones de grupo (`SUM`, `AVG`, etc.).
    - Cláusulas **GROUP BY**, **START WITH** o **CONNECT BY**.
    - El operador **DISTINCT**.
    - Operadores de conjunto (`UNION`, `INTERSECT`, `MINUS`).
3. Si la vista se definió con la opción **WITH READ ONLY**.

Para gestionar y consultar las vistas creadas en nuestro esquema, podemos recurrir a la vista del diccionario de datos **USER_VIEWS**.

---
# 23. UPDATE y DELETE con Subconsultas

Las sentencias **UPDATE** y **DELETE** forman parte del Lenguaje de Manipulación de Datos (**DML**) y se utilizan para modificar o eliminar filas existentes en una tabla o en la tabla base de una vista,,,. El uso de **subconsultas** dentro de estas operaciones ofrece una gran versatilidad, ya que permite que los cambios en una tabla dependan de la información almacenada en otras tablas relacionadas.

---
## 23.1 Sentencia UPDATE con Subconsultas

La sentencia `UPDATE` permite cambiar los valores de una o varias columnas,. Cuando se combina con una subconsulta, el filtro de la cláusula `WHERE` o incluso el nuevo valor asignado pueden provenir de otro proceso de selección.

- **Ejemplo original:**
    - **Explicación:** Esta consulta incrementa en dos unidades el sueldo de aquellos empleados cuyo número de empleado (`numemp`) figure en la lista de trabajadores registrados como 'HERRERO' en la tabla de oficios,.
- **Ejemplos adicionales:**
    - **Actualización con valor calculado:** Se puede asignar a una columna el resultado de una función de grupo, como el sueldo máximo de la empresa:
    - **Actualización masiva basada en múltiples tablas:** Incrementar el sueldo de todos los 'HERREROS' igualándolo al sueldo más alto de toda la empresa:

---
## 23.2 Sentencia DELETE con Subconsultas

La orden `DELETE` elimina filas completas de una tabla. Es fundamental utilizar la cláusula `WHERE` con subconsultas para precisar qué registros deben borrarse; de lo contrario, se eliminarían todas las filas de la tabla.

- **Ejemplo original:**
- **Consideraciones de Integridad Referencial:** Al intentar borrar registros, Oracle puede devolver un error si existen registros hijos dependientes en otras tablas (por ejemplo, si un empleado tiene oficios asignados en `oficioempleado`). Si no se definió la clave ajena con la opción `ON DELETE CASCADE`, es necesario **borrar primero los registros de las tablas hijas** antes de poder eliminar el registro principal,,.
- **Ejemplo adicional (Borrado manual en cascada):** Para eliminar a un empleado específico (como 'WILFRED LOWELL'), primero debemos limpiar sus referencias en la tabla de oficios:

---
## 23.3 Subconsultas Correlacionadas en DML

Tanto en `UPDATE` como en `DELETE`, se pueden emplear **subconsultas correlacionadas**, que son aquellas que se evalúan **una vez por cada fila** que procesa la sentencia principal. Esto ocurre siempre que la subconsulta interna hace referencia a una columna de la tabla que aparece en la consulta padre.

Esta técnica es muy potente para realizar actualizaciones o borrados que dependan de condiciones calculadas específicamente para cada registro individual (por ejemplo, borrar empleados que cobren más que la media de su propio departamento),.

---
# 24. Seguridad (DCL)

El **Lenguaje de Control de Datos (DCL)** es la parte de SQL utilizada para gestionar la **confidencialidad y seguridad** de la base de datos. Su función principal es la creación de usuarios y la administración de permisos para controlar qué acciones puede realizar cada persona sobre el sistema,.
## 24.1 Gestión de Usuarios

Cada usuario en Oracle tiene un nombre y una clave de acceso única, y posee sus propios recursos (tablas, vistas, etc.) que cree dentro de su **esquema**.

Para crear un usuario, se utiliza la sentencia `CREATE USER`. Es posible especificar parámetros adicionales como el espacio de almacenamiento (tablespace) y los límites de espacio (cuotas),.

**Ejemplo de creación básica:**

```sql
CREATE USER pepe IDENTIFIED BY clave123;
```

**Ejemplo avanzado (con cuotas y almacenamiento):** Este comando crea al usuario asignándole un límite de 20 megabytes en el espacio de tablas "GESTION".

```sql
CREATE USER pepe IDENTIFIED BY clave123
DEFAULT TABLESPACE gestion
QUOTA 20M ON gestion;
```

---
## 24.2 Privilegios

Los privilegios permiten a los usuarios ejecutar acciones específicas. Se dividen en dos categorías principales:

### A. Privilegios del Sistema

Permiten realizar operaciones a nivel de toda la base de datos.

- **CREATE SESSION**: Permite conectarse a la base de datos (sin este, el usuario no puede ni entrar),.
- **CREATE TABLE**: Permite crear tablas en el propio esquema.
- **CREATE VIEW**: Permite crear vistas.

**Ejemplo de asignación:**

```sql
GRANT CREATE SESSION, CREATE TABLE TO pepe;
```

### B. Privilegios sobre Objetos

Permiten realizar operaciones sobre un objeto específico (como una tabla de otro usuario). Los más comunes son `SELECT`, `INSERT`, `UPDATE` y `DELETE`.

**Ejemplo de asignación sobre una tabla:**

```sql
-- Permitir que todos (PUBLIC) consulten la tabla empleado
GRANT SELECT ON empleado TO PUBLIC;

-- Permitir que pepe actualice solo columnas específicas
GRANT UPDATE(alojamiento, direccion) ON alojamiento TO pepe;
```

---
## 24.3 Roles

Un **rol** es un conjunto de privilegios que se agrupan para facilitar la administración. En lugar de asignar 20 permisos a 50 usuarios uno por uno, se asignan esos permisos a un rol y luego el rol a los usuarios.

**Ejemplo de creación y uso de un Rol:**

```sql
-- 1. Crear el rol
CREATE ROLE administrativo;

-- 2. Asignar privilegios al rol
GRANT CREATE SESSION, CREATE TABLE TO administrativo;

-- 3. Asignar el rol al usuario
GRANT administrativo TO pepe;
```

---
## 24.4 Perfiles

Un **perfil** es un conjunto de **limitaciones sobre los recursos** de la base de datos. Sirven para evitar que un usuario consuma demasiada memoria o CPU.

**Ejemplo de creación de un perfil:** Este perfil limita a un máximo de 3 las sesiones que el usuario puede tener abiertas al mismo tiempo,.

```sql
CREATE PROFILE limite_sesiones LIMIT SESSIONS_PER_USER 3;

-- Asignar el perfil al usuario
ALTER USER pepe PROFILE limite_sesiones;
```

---
## 24.5 Retirada de Permisos (REVOKE)

Para quitar un privilegio o un rol previamente concedido, se utiliza la sentencia `REVOKE`.

**Ejemplos de REVOKE:**

```sql
-- Quitar un rol a un usuario
REVOKE administrativo FROM pepe;

-- Quitar permiso de selección sobre una tabla
REVOKE SELECT ON empleado FROM pepe;

-- Quitar un privilegio a un rol (afecta a todos los usuarios que tengan ese rol)
REVOKE CREATE TABLE FROM administrativo;
```

Resumen de Conceptos Clave

|Concepto|Función Principal|
|---|---|
|**Usuario**|Cuenta individual con nombre y clave para acceder al sistema.|
|**Privilegio**|Permiso para realizar una acción específica (sistema u objeto),.|
|**Rol**|"Contenedor" de privilegios para una gestión masiva más sencilla.|
|**Perfil**|Conjunto de límites sobre el uso de recursos (CPU, sesiones, etc.).|

---
# 25. Sinónimos

Un **sinónimo** es un **nombre alternativo** (un alias permanente) que se asigna a diversos objetos de la base de datos, como tablas, vistas, secuencias, procedimientos o funciones. Su propósito principal es simplificar la escritura de consultas y proporcionar un nivel de abstracción que oculte la ubicación real o el propietario del objeto.
## 25.1 Utilidad y Ventajas

- **Comodidad:** Permite sustituir nombres largos o complejos (como los que incluyen el esquema y el enlace de base de datos) por términos más cortos y fáciles de recordar.
- **Transparencia:** Si el objeto original cambia de nombre o de esquema, solo es necesario actualizar el sinónimo sin tener que modificar todas las aplicaciones o consultas que lo utilizan.
- **Seguridad:** Oculta el nombre real del esquema propietario del objeto.
## 25.2 Tipos de Sinónimos y Privilegios

Para crear un sinónimo, se requieren privilegios específicos según su alcance:

|Tipo|Alcance|Privilegio Requerido|
|---|---|---|
|**Privado**|Solo accesible para el dueño o dentro de su esquema.|`CREATE SYNONYM`.|
|**Público**|Accesible para todos los usuarios de la base de datos.|`CREATE PUBLIC SYNONYM`.|

_Nota: Para crear un sinónimo en un esquema ajeno, se requiere el privilegio_ _CREATE ANY SYNONYM__._

---
## 25.3 Ejemplos de Implementación

Ejemplo Básico (Sintaxis General)

Este es el formato estándar para crear un nombre alternativo local para un objeto de otro esquema.

```sql
CREATE SYNONYM nombre_sinonimo
FOR esquema.objeto;
```

Ejemplo con Tablas de Otros Esquemas

Supongamos que el usuario `EUROVISION` tiene una tabla llamada `CANTANTE` y te ha concedido permisos para consultarla. Para no tener que escribir siempre el nombre completo del esquema, puedes crear un sinónimo:

```sql
-- 1. Crear el sinónimo
CREATE SYNONYM CANTANTEEUROVISION FOR EUROVISION.CANTANTE;

-- 2. Usar el sinónimo en una consulta
SELECT * FROM CANTANTEEUROVISION; -- Equivale a SELECT * FROM EUROVISION.CANTANTE
```

Ejemplo con Objetos Remotos (Database Links)

Los sinónimos son extremadamente útiles cuando se trabaja con bases de datos distribuidas, ya que permiten ocultar la cadena de conexión `@enlace`.

```sql
-- Crear un sinónimo para una tabla situada en un servidor remoto
CREATE SYNONYM clientes_madrid
FOR ventas.clientes@enlace_madrid;

-- Ahora puedes consultar la tabla remota de forma sencilla
SELECT nombre FROM clientes_madrid;
```

Ejemplo de Sinónimo Público

Los administradores suelen crear sinónimos públicos para que tablas de uso general sean accesibles por su nombre sin anteponer el esquema.

```sql
-- Solo usuarios con privilegios de administrador pueden ejecutar esto
CREATE PUBLIC SYNONYM empleados FOR recursos_humanos.plantilla;
```

---
## 25.4 Borrado de Sinónimos

Si un sinónimo ya no es necesario, se elimina con la orden `DROP`, especificando si es público en caso de serlo.

```sql
DROP SYNONYM CANTANTEEUROVISION;
DROP PUBLIC SYNONYM empleados;
```

---
# 26. Funciones de Cadenas

Las **funciones de manejo de cadenas** permiten manipular y transformar datos de tipo alfanumérico (`CHAR`, `VARCHAR2`) para presentar la información de forma más clara o realizar búsquedas precisas,,.

---
## 26.1 Concatenación (`||`)

El operador de **concatenación** se utiliza para unir dos o más cadenas de caracteres o columnas en un único resultado. Es muy útil para generar frases personalizadas en los listados.

- **Ejemplo - Creación de una frase (Original):**
- **Ejemplo - Unión de columnas (Adicional):**

---
## 26.2 Transformación de Mayúsculas y Minúsculas

Estas funciones permiten **normalizar el formato del texto**, lo cual es crítico ya que Oracle distingue entre mayúsculas y minúsculas en las comparaciones de patrones,.

- **LOWER**: Convierte toda la cadena a minúsculas.
- **UPPER**: Convierte toda la cadena a mayúsculas.
- **INITCAP**: Coloca en mayúscula la inicial de cada palabra.
- **Ejemplo - Combinación de funciones (Original):**
- **Ejemplo - Filtro insensible a mayúsculas (Adicional):**

---
## 26.3 Longitud y Subcadenas

- **LENGTH**: Devuelve el **número total de caracteres** que componen la cadena.
- **SUBSTR**: Extrae una porción de la cadena indicando la posición de inicio y, opcionalmente, cuántos caracteres se desean obtener.
- **Ejemplo - Medir longitud (Original):**
- **Ejemplo - Extraer parte del nombre (Original):**

---
## 26.4 Reemplazo y Búsqueda

- **REPLACE**: Busca un conjunto de caracteres y los **sustituye** por otro conjunto definido.
- **INSTR**: Busca la **posición numérica** donde se encuentra una subcadena dentro de otra.
- **Ejemplo - Reemplazo de texto (Original):**
- **Ejemplo - Localizar un carácter (Adicional):**

---
## 26.5 Limpieza de espacios (`TRIM`, `LTRIM`, `RTRIM`)

Estas funciones son esenciales para **eliminar caracteres no deseados** (generalmente espacios en blanco) de los extremos de una cadena.

- **TRIM**: Suprime los espacios en blanco si no se especifica un conjunto de caracteres.
- **LTRIM**: Recorta por la izquierda.
- **RTRIM**: Recorta por la derecha.
- **Ejemplo - Recorte selectivo (Original):**

---
## 26.6 Relleno de caracteres (`LPAD` y `RPAD`)

Aumentan el tamaño de una cadena por la izquierda (`LPAD`) o derecha (`RPAD`) hasta alcanzar una longitud determinada, rellenando el espacio con el carácter que elijamos.

- **Ejemplo - Formateo con almohadillas (Original):**
- **Ejemplo - Identación jerárquica (Adicional):**

---
# 27. Funciones de Fechas

El tipo de dato **DATE** en Oracle es un campo de **longitud fija (7 bytes)** que no solo almacena el día, mes y año, sino también el **siglo, la hora, los minutos y los segundos**. El rango de fechas permitido abarca desde el 1 de enero del año 4712 a.C. hasta el 31 de diciembre del 9999 d.C.
## 27.1 Aritmética de Fechas

Antes de ver las funciones, es vital entender que Oracle permite realizar operaciones matemáticas directas con fechas:

- **Sumar/Restar números:** Al sumar 1 a una fecha, se está sumando un **día completo**. Por ejemplo, una diferencia de 0,5 equivale a 12 horas.
- **Diferencia de fechas:** Restar dos fechas devuelve el **número de días** transcurridos entre ambas.

---
## 27.2 Detalle de Funciones Principales

`SYSDATE`

Devuelve la **fecha y hora actual** configurada en el sistema operativo donde reside la base de datos.

```sql
-- Ejemplo original: Obtener la fecha del sistema
SELECT SYSDATE FROM dual;

-- Ejemplo adicional: Mostrar fecha y hora con formato específico
SELECT TO_CHAR(SYSDATE, 'DD-MM-YYYY HH24:MI') AS FECHA_HORA_ACTUAL FROM dual;
```

`ADD_MONTHS(d, n)`

Devuelve la fecha `d` tras **sumar o restar** `n` meses.

```sql
-- Ejemplo original: Sumar y restar 5 meses a una fecha de nacimiento
SELECT NOMBRE, FECHANACIMIENTO, 
       ADD_MONTHS(FECHANACIMIENTO, 5) "5 meses+", 
       ADD_MONTHS(FECHANACIMIENTO, -5) "5 meses-" 
FROM ALUMNO;
```

`LAST_DAY(d)`

Identifica la fecha correspondiente al **último día del mes** de la fecha proporcionada.

```sql
-- Ejemplo original: Calcular cuántos días faltan para acabar el mes
SELECT SYSDATE, 
       LAST_DAY(SYSDATE) "Último", 
       LAST_DAY(SYSDATE) - SYSDATE "Faltan días" 
FROM dual;

-- Ejemplo adicional: Obtener el primer día del mes actual
SELECT LAST_DAY(ADD_MONTHS(SYSDATE, -1)) + 1 AS PRIMERO_DE_MES FROM dual;
```

`MONTHS_BETWEEN(d1, d2)`

Devuelve el número de **meses transcurridos** entre las fechas `d1` y `d2`. Si `d1` es anterior a `d2`, el resultado será negativo.

```sql
-- Ejemplo original: Calcular la edad exacta en años
SELECT NOMBRE, 
       TRUNC(MONTHS_BETWEEN(SYSDATE, FECHANACIMIENTO) / 12) AS EDAD 
FROM ALUMNO;
```

`NEXT_DAY(fecha, 'día')`

Devuelve la fecha del **primer día de la semana especificado** (ej. 'SÁBADO') que sea posterior a la fecha dada.

```sql
-- Ejemplo original: Buscar el próximo sábado tras un cumpleaños
SELECT NOMBRE, 
       NEXT_DAY(FECHANACIMIENTO, 'SÁBADO') AS FIESTA 
FROM ALUMNO;

-- Ejemplo adicional: Si el cumple cae en sábado y queremos ese mismo día (restando 1)
SELECT NOMBRE, 
       NEXT_DAY(TO_DATE('15-06-2024', 'DD-MM-YYYY') - 1, 'SÁBADO') 
FROM dual;
```

---
## 27.3 Funciones de Comparación y Redondeo (Adicionales)

Las fuentes también destacan otras funciones potentes para el manejo de cronología:

- **GREATEST** **y** **LEAST**: Seleccionan la fecha más tardía o más temprana de una lista, respectivamente.
- **ROUND**: Redondea la fecha a las **12 A.M. del día más cercano** (si es pasado el mediodía, redondea al día siguiente).
- **TRUNC**: Trunca la fecha eliminando las horas, minutos y segundos, dejando siempre las **12 A.M. del propio día**.

> **Nota:** Es común usar estas funciones junto con **TO_CHAR** y **TO_DATE** para convertir las fechas en cadenas de texto legibles o viceversa, permitiendo usar formatos como 'DD-MON-YYYY' o 'HH24:MI:SS'.

---
# 28. Conversión de Tipos y Formateo

Las funciones de conversión son herramientas esenciales en Oracle para transformar datos entre tipos (alfanumérico, numérico y fecha) y para presentar la información en formatos legibles y personalizados.
## 28.1 Función `TO_CHAR` (Fechas)

Se utiliza para convertir un dato de tipo `DATE` en una cadena de caracteres (`VARCHAR2`) siguiendo un formato específico. Es especialmente útil para mostrar horas o nombres de meses que no aparecen en el formato por defecto del cliente.

**Ejemplos de Fechas:**

```sql
-- Ejemplo original: Formato de día, mes y año
SELECT TO_CHAR(fecha, 'DD/MM/YYYY') FROM tabla;

-- Mostrar fecha con nombre de mes abreviado y año de 4 cifras
SELECT nombre, TO_CHAR(fechanacimiento, 'DD-MON-YYYY') FROM alumno;

-- Mostrar fecha y hora completa (24 horas y minutos)
SELECT TO_CHAR(SYSDATE, 'DD-MM-YYYY HH24:MI') AS fecha_hora_actual FROM dual;

-- Filtrar registros usando una parte de la fecha (ej. nacidos en mayo)
SELECT nombre FROM alumno WHERE TO_CHAR(fechanacimiento, 'MM') = '05';
```

---
## 28.2 Función `TO_CHAR` (Números)

Permite dar formato a valores numéricos para incluir símbolos de moneda, separadores de miles o decimales.

Formatos numéricos solicitados:

|Elemento|Descripción|
|---|---|
|**9**|Representa un dígito. Si el número tiene menos dígitos, los ceros a la izquierda se muestran como blancos.|
|**0**|Muestra ceros a la izquierda o derecha de forma obligatoria.|
|**G**|Separador de grupo (miles). Se adapta a la configuración local (NLS).|
|**D**|Punto decimal. Se adapta a la configuración local (NLS).|
|**$**|Añade el signo de dólar delante del número.|

**Ejemplos Numéricos:**

```sql
-- Formato con separador de miles y decimales (9G999D99)
SELECT TO_CHAR(sueldo, '9G999D99') FROM empleado;

-- Forzar ceros a la izquierda para códigos de 4 dígitos
SELECT TO_CHAR(12, '0999') FROM dual; -- Resultado: '0012'

-- Formato con signo de dólar y decimales
SELECT TO_CHAR(123.45, '$999.99') FROM dual; -- Resultado: ' $123.45'

-- Uso de 'L' para el símbolo de moneda local (ej. €)
SELECT TO_CHAR(amount_sold, 'L999G999') FROM sales;
```

---
## 28.3 Función `TO_DATE`

Esta función realiza el proceso inverso: convierte una cadena de caracteres en un tipo de dato `DATE`. Es obligatoria cuando queremos realizar aritmética de fechas o comparaciones precisas con literales que no siguen el formato por defecto del sistema.

**Ejemplos de** **TO_DATE****:**

```sql
-- Ejemplo original: Convertir cadena a objeto fecha
SELECT TO_DATE('10-01-2024', 'DD-MM-YYYY') FROM dual;

-- Comparar dos literales de fecha correctamente
SELECT LEAST(TO_DATE('15-ENERO-2020', 'DD-MONTH-YYYY'), 
             TO_DATE('15-DICIEMBRE-2020', 'DD-MONTH-YYYY')) FROM dual;

-- Insertar una fecha específica en una tabla
INSERT INTO empleado (nombre, fecha_alta) 
VALUES ('JUAN', TO_DATE('11-OCT-2001', 'DD-MON-YYYY'));
```

Conceptos Adicionales

- **Parámetros NLS:** Se pueden incluir para fijar el idioma de los nombres de los meses o días (ej. 'SPANISH') independientemente de la configuración de la sesión.
- **Precisión de SYSDATE:** Recuerda que `SYSDATE` incluye horas, minutos y segundos; si necesitas comparar fechas ignorando la hora, suele combinarse con `TRUNC` o `TO_CHAR`.

---
# 29. Funciones Numéricas

Las funciones numéricas en SQL se aplican a datos de tipo `NUMBER` (que en Oracle pueden almacenar hasta 38 dígitos significativos) para realizar cálculos matemáticos precisos sobre valores individuales. A diferencia de las funciones de agregación que actúan sobre grupos, estas funciones operan fila por fila.

A continuación, se presenta una explicación detallada de las funciones solicitadas:

---
## 29.1 Funciones de Redondeo y Aproximación

Estas funciones permiten ajustar la precisión de los números decimales:

- **ABS(n)**: Devuelve el **valor absoluto** de un número `n` (su valor sin signo).
- **CEIL(n)**: Devuelve el **entero superior** más pequeño que sea mayor o igual a `n`. Es útil para cálculos donde siempre se debe redondear hacia arriba (como en el número de páginas necesarias para un listado).
- **FLOOR(n)**: Devuelve el **entero inferior** más grande que sea menor o igual a `n`.
- **ROUND(n [, m])**: Devuelve `n` **redondeado** a `m` decimales. Si se omite `m`, redondea a 0 decimales. Si `m` es negativo, redondea los dígitos a la izquierda del punto decimal.
- **TRUNC(n [, m])**: Devuelve `n` **truncado** a `m` posiciones decimales. A diferencia del redondeo, simplemente "corta" los dígitos sobrantes.

---
## 29.2 Operaciones Aritméticas Avanzadas

- **MOD(m, n)**: Devuelve el **resto** de la división de `m` entre `n`. Si `n` es 0, la función devuelve el valor de `m`.
- **POWER(m, n)**: Eleva la base `m` a la **potencia** `n`.
- **SQRT(n)**: Calcula la **raíz cuadrada** de `n`. El valor de `n` no puede ser negativo.

---
## 29.3 Otras Funciones Numéricas de Interés

Para extender la explicación, las fuentes también mencionan las siguientes funciones útiles:

- **SIGN(n)**: Indica el signo del número. Devuelve **-1** si es negativo, **0** si es cero y **1** si es positivo.
- **EXP(n)**: Eleva el número e (aprox. 2.71828) a la potencia `n`.
- **LOG(m, n)**: Devuelve el logaritmo en base `m` de `n`.

Ejemplo de Aplicación Práctica

Podemos combinar estas funciones para realizar cálculos complejos en un listado de empleados, como calcular una gratificación basada en el sueldo y redondearla:

```sql
-- Ejemplo adicional: Calcular el 15.5% de sueldo y redondearlo al entero superior
SELECT nombre, 
       sueldo, 
       CEIL(sueldo * 0.155) AS gratificacion_redondeada
FROM empleado;
```

> **Nota:** Al usar estas funciones en sentencias `SELECT`, es común utilizar la tabla **dual**, que es una tabla especial en Oracle con una sola fila y una sola columna, diseñada precisamente para evaluar expresiones y funciones que no requieren datos de una tabla específica.

---
# 30. Extensiones de Agrupación

Las extensiones de la cláusula `GROUP BY` (`ROLLUP`, `CUBE` y `GROUPING SETS`) están orientadas a mejorar el **procesamiento analítico** a través de SQL. Permiten generar múltiples niveles de subtotales y totales generales en una sola sentencia, lo que antes requería unir varias consultas con el operador `UNION`.

---
## 30.1 ROLLUP (Subtotales Jerárquicos)

La extensión **ROLLUP** se utiliza para calcular acumulados parciales (subtotales) siguiendo un orden jerárquico basado en las dimensiones (columnas) especificadas.

- **Funcionamiento:** Si se trabaja con n dimensiones, produce n+1 niveles de resultados. Por ejemplo, si agrupamos por (Canal, País), obtendremos:
    1. Totales por Canal y País.
    2. Subtotales por cada Canal (agregando todos los países).
    3. Total General (agregando todos los canales y países).

**Ejemplo original (Ventas por canal y país):**

```sql
SELECT channels.channel_desc, countries.country_iso_code, 
       TO_CHAR(SUM(amount_sold), '9,999,999,999') SALES$
FROM sales, customers, times, channels, countries
WHERE sales.time_id=times.time_id 
  AND sales.channel_id=channels.channel_id 
  AND customers.country_id=countries.country_id
  -- (Otros filtros omitidos para brevedad)
GROUP BY ROLLUP(channels.channel_desc, countries.country_iso_code);
```

---
## 30.2 CUBE (Todas las Combinaciones)

A diferencia de `ROLLUP`, la extensión **CUBE** genera subtotales para **todas las combinaciones posibles** de las columnas indicadas.

- **Funcionamiento:** Si tenemos n columnas en el agrupamiento, se obtendrán 2n niveles de parciales. Es ideal para informes donde se necesita analizar los datos desde cualquier perspectiva cruzada.

**Ejemplo (Mismas dimensiones que el anterior):**

```sql
SELECT channels.channel_desc, countries.country_iso_code, 
       TO_CHAR(SUM(amount_sold), '9,999,999,999') SALES$
FROM sales, customers, times, channels, countries
WHERE -- (Condiciones de Join y filtros)
GROUP BY CUBE(channels.channel_desc, countries.country_iso_code);
```

_Este ejemplo generará totales por canal, totales por país, totales por combinación de ambos y el gran total__._

---
## 30.3 GROUPING SETS (Subtotales específicos)

**GROUPING SETS** permite seleccionar específicamente qué conjuntos de grupos queremos calcular, evitando computar el cubo entero.

- **Ventaja:** Aumenta considerablemente el **rendimiento**, ya que el uso de `CUBE` implica un procesamiento muy pesado al calcular todas las combinaciones posibles, muchas de las cuales pueden no ser necesarias.

**Ejemplo (Tres agrupamientos definidos):**

```sql
SELECT channel_desc, calendar_month_desc, country_iso_code, 
       TO_CHAR(SUM(amount_sold), '9,999,999,999') SALES$
FROM sales, customers, times, channels, countries
WHERE -- (Condiciones de Join y filtros)
GROUP BY GROUPING SETS(
    (channel_desc, calendar_month_desc, country_iso_code), -- Nivel detalle
    (channel_desc, country_iso_code),                     -- Subtotal por canal/país
    (calendar_month_desc, country_iso_code)               -- Subtotal por mes/país
);
```

---
## 30.4 Identificación de Totales con `GROUPING` (Añadido)

Un reto al usar estas extensiones es diferenciar un valor `NULL` real de uno generado por `ROLLUP` o `CUBE` para indicar una fila de subtotal. Para ello se usa la función **GROUPING**:

- Devuelve **1** si la fila es un subtotal (el valor es un NULL generado).
- Devuelve **0** si es un valor almacenado.

**Ejemplo avanzado (Combinando** **GROUPING** **y** **DECODE****):** Permite sustituir los huecos de los totales por etiquetas descriptivas para que el informe sea legible.

```sql
SELECT 
    DECODE(GROUPING(channels.channel_desc), 1, 'Todos los Canales', channels.channel_desc) AS Canal,
    DECODE(GROUPING(countries.country_iso_code), 1, 'Los dos países', countries.country_iso_code) AS Pais,
    TO_CHAR(SUM(amount_sold), '9,999,999,999') AS SALES$
FROM sales, customers, times, channels, countries
WHERE -- (Condiciones de Join y filtros)
GROUP BY CUBE(channels.channel_desc, countries.country_iso_code);
```

_En el resultado, en lugar de aparecer espacios vacíos en las filas de los totales, leeremos claramente "Todos los Canales" o "Los dos países"__._

---
# 31. Funciones Analíticas

Las **funciones analíticas** están orientadas a mejorar el procesamiento de datos para informes y análisis directamente a través de SQL. A diferencia de las funciones de grupo tradicionales, estas operan sobre un conjunto de filas (particiones) y devuelven un resultado para cada fila individual.

Es fundamental entender su **orden de procesamiento**: primero se ejecutan las uniones y las cláusulas `WHERE`, `GROUP BY` y `HAVING`. Una vez obtenido ese resultado, se aplican las funciones analíticas y, finalmente, se procesa el `ORDER BY` global de la consulta.

---
## 31.1 Funciones de Clasificación (Ranking)

Estas funciones calculan la posición u orden de un registro en comparación con otros, basándose en los valores de una o varias medidas.

- **RANK()**: Asigna un ranking dejando **huecos** en la secuencia cuando existen empates. Por ejemplo, si tres personas empatan en el segundo puesto, todas reciben el número 2, pero la siguiente persona recibirá el número 5.
- **DENSE_RANK()**: Realiza un ranking **sin huecos**. En el mismo caso anterior, las tres personas tendrían el número 2, pero la siguiente persona recibiría el número 3.
- **ROW_NUMBER()**: Asigna un **número único** y secuencial a cada fila, comenzando por 1, según el orden especificado.

Cláusulas Clave

- **PARTITION BY**: (Opcional) Divide el resultado en grupos. La clasificación se reinicia cada vez que cambia el grupo.
- **ORDER BY**: (Obligatorio) Especifica los criterios para establecer la clasificación.

Ejemplos de Ranking

**Comparación entre RANK y DENSE_RANK:**

```sql
SELECT channel_desc, 
       calendar_month_desc, 
       TRUNC(SUM(amount_sold),-5) AS VENTAS,
       RANK() OVER (ORDER BY TRUNC(SUM(amount_sold),-5) DESC) AS RANK,
       DENSE_RANK() OVER (ORDER BY TRUNC(SUM(amount_sold),-5) DESC) AS DENSE_RANK
FROM sales, channels, times
WHERE sales.channel_id = channels.channel_id 
  AND sales.time_id = times.time_id
  AND calendar_month_desc IN ('2000-09', '2000-10')
GROUP BY channel_desc, calendar_month_desc;
```

En este caso, si dos meses tienen ventas idénticas (ej. 1,200,000), ambos reciben el rango 1. Con `RANK`, el siguiente valor saltaría al 3; con `DENSE_RANK`, pasaría al 2.

**Uso de PARTITION BY para reiniciar el conteo:**

```sql
-- Clasificar meses por ventas dentro de cada canal específico
SELECT channel_desc, calendar_month_desc, SUM(amount_sold) AS SALES,
       RANK() OVER (PARTITION BY channel_desc ORDER BY SUM(amount_sold) DESC) AS RANK_POR_CANAL
FROM sales, channels, times
WHERE sales.channel_id = channels.channel_id 
  AND sales.time_id = times.time_id
GROUP BY channel_desc, calendar_month_desc;
```

Aquí, el ranking se restablece a 1 cada vez que cambiamos de canal de distribución.

**Ejemplo de ROW_NUMBER():**

```sql
-- Numerar de forma única todas las combinaciones de canal y mes
SELECT channel_desc, calendar_month_desc, 
       ROW_NUMBER() OVER (ORDER BY SUM(amount_sold) DESC) AS NUM_FILA
FROM sales, channels, times
WHERE sales.channel_id = channels.channel_id 
  AND sales.time_id = times.time_id
GROUP BY channel_desc, calendar_month_desc;
```

Esta función garantiza un identificador único para cada fila del listado.

---
## 31.2 Funciones de Informe (Reporting)

Las funciones de informe permiten calcular valores agregados (como sumas o promedios) sobre una partición y ponerlos a disposición de cada fila individual. Esto evita el uso de subconsultas complejas para calcular porcentajes o comparativas respecto al total.

- **SUM(...) OVER (PARTITION BY ...)**: Calcula el total de un grupo y repite ese valor en cada fila de dicho grupo.
- **RATIO_TO_REPORT()**: Calcula la proporción o **porcentaje** de un valor individual respecto a la suma total de su conjunto.

Ejemplos de Reporting

**Cálculo de cuotas con RATIO_TO_REPORT:**

```sql
-- Ver el porcentaje de ventas de cada canal sobre el total del día
SELECT ch.channel_desc, 
       SUM(amount_sold) AS SALES,
       RATIO_TO_REPORT(SUM(amount_sold)) OVER () AS PORCENTAJE_SOBRE_TOTAL
FROM sales s, channels ch 
WHERE s.channel_id = ch.channel_id 
  AND s.time_id = TO_DATE('11-OCT-2000', 'DD-MON-YYYY')
GROUP BY ch.channel_desc;
```

Si la cláusula `OVER()` está vacía, el cálculo se realiza sobre el conjunto completo de resultados de la consulta.

**Comparativa con el máximo del grupo:**

```sql
-- Mostrar ventas por región y el máximo de su categoría para comparar
SELECT prod_category, country_region, 
       SUM(amount_sold) AS VENTAS_REGION,
       MAX(SUM(amount_sold)) OVER (PARTITION BY prod_category) AS MAX_CATEGORIA
FROM sales s, products p, countries co, customers c
WHERE s.prod_id = p.prod_id AND s.cust_id = c.cust_id AND c.country_id = co.country_id
GROUP BY prod_category, country_region;
```

Este método es mucho más eficiente y sencillo de escribir que unir varias consultas para obtener el máximo de cada categoría.

**Sueldo acumulado por jefe (Windowing):**

```sql
-- Calcula el sueldo acumulado de los empleados que dependen de un mismo jefe
SELECT manager_id, last_name, salary, 
       SUM(salary) OVER (PARTITION BY manager_id ORDER BY salary ROWS UNBOUNDED PRECEDING) AS SALARIO_ACUMULADO
FROM employees;
```

La opción `UNBOUNDED PRECEDING` indica que la ventana de suma tiene en cuenta todas las filas anteriores dentro de la misma partición del jefe.

