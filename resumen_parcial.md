# Entrenamiento Intensivo — Modelo Físico (SI400 UPC)

Basado en:
- solucionario de examen parcial 2022-2
- ejercicios de modelado SI400
- estilo real de evaluación UPC

---

# ¿Qué evalúa SI400?

Según la rúbrica:

- modelado físico,
- tablas,
- atributos,
- PK,
- FK,
- relaciones,
- normalización,
- DDL,
- DML.

Lo MÁS importante:
- detectar entidades,
- detectar relaciones,
- detectar N:M,
- crear tablas puente.

---

# Cómo piensa el curso

El curso convierte:

## Sustantivos → tablas

Ejemplo:

> profesores, universidades, propuestas

↓

```text
professors
universities
proposals
```

---

# Relaciones 1:N

Ejemplo:

```text
universities 1:N professors
```

Entonces:

```text
professors lleva university_id FK
```

---

# Relaciones N:M

Ejemplo:

> alumnos se inscriben en charlas

Muchos alumnos.
Muchas charlas.

↓

```text
students N:M talks
```

Entonces:

```text
enrollments
```

Tabla puente:

```text
enrollments
-------------------------
talk_id PK FK
student_id PK FK
```

---

# Regla MÁS importante

Si puedes decir:

> “muchos X tienen muchos Y”

↓

TABLA PUENTE.

---

# Ejemplos de tablas puente del curso

- enrollments
- proyectos_areas
- temas_eventos
- ordenes_tecnicos
- favoritos
- visualizaciones

---

# Cómo detectar entidades

Busca sustantivos fuertes:

- empresa
- usuario
- evento
- charla
- curso
- profesor
- alumno

↓

Tabla.

---

# Cómo detectar tablas catálogo

Si el enunciado menciona:

- estados,
- categorías,
- tipos,
- niveles,
- especialidades,

probablemente quieren tabla aparte.

---

# Ejemplo

En vez de guardar:

```text
estado = "Activo"
```

Hacen:

```text
states
--------------
id PK
name
```

Y luego:

```text
project.state_id FK
```

---

# Estructura favorita del curso

```text
tabla
--------------
id PK
name
otra_tabla_id FK
```

---

# Cómo resolver un examen

# PASO 1 — Subrayar entidades

Ejemplo:

> Un cliente realiza pedidos.

Entidades:

- cliente
- pedido

---

# PASO 2 — Detectar relaciones

Ejemplo:

```text
CLIENTE 1:N PEDIDO
```

---

# PASO 3 — Agregar FK

La FK va en el lado MUCHOS.

↓

```text
PEDIDO
--------------
cliente_id FK
```

---

# PASO 4 — Detectar N:M

Ejemplo:

> muchos alumnos llevan muchos cursos

↓

```text
ALUMNO N:M CURSO
```

---

# PASO 5 — Crear tabla puente

↓

```text
MATRICULA
--------------
alumno_id PK FK
curso_id PK FK
```

---

# PASO 6 — Agregar tipos de datos

| Dato | Tipo |
|---|---|
| ID | INT |
| Nombre | VARCHAR(100) |
| Fecha | DATE |
| Hora | TIME |
| Dinero | DECIMAL(10,2) |
| Booleano | BIT / BOOLEAN |

---

# Ejemplo completo

## ENUNCIADO

> Una empresa publica muchos proyectos.
> Los usuarios pueden participar en muchos proyectos.

---

# Modelo físico

```text
companies
-------------------------
id PK
name
ruc

users
-------------------------
id PK
name
email

projects
-------------------------
id PK
title
description
company_id FK

participants
-------------------------
user_id PK FK
project_id PK FK
attendance
```

---

# Cómo reconocer cardinalidades

# Uno a Muchos (1:N)

Palabras típicas:

- “un cliente tiene muchos pedidos”
- “un profesor dicta muchos cursos”

↓

FK en el lado MUCHOS.

---

# Muchos a Muchos (N:M)

Palabras típicas:

- “muchos usuarios participan en muchos eventos”
- “muchos alumnos llevan muchos cursos”

↓

Tabla puente obligatoria.

---

# Error MÁS común

## MAL

```text
usuario
--------------
cursos = "SQL,Python,Java"
```

---

## BIEN

```text
users_courses
--------------
user_id FK
course_id FK
```

---

# Otro error común

## MAL

```text
ALUMNO ---- CURSO
```

cuando es N:M.

---

## BIEN

```text
ALUMNO --- MATRICULA --- CURSO
```

---

# Cómo sacar FK rápido

Regla:

## En 1:N
La FK va en N.

---

# Ejemplo

```text
CLIENTE 1:N PEDIDO
```

↓

```text
PEDIDO
--------------
cliente_id FK
```

---

# Cómo piensa SI400

El curso prioriza:

- claridad,
- relaciones,
- PK/FK,
- normalización básica.

NO buscan arquitectura empresarial compleja.

---

# Normalización

# 1FN

No grupos repetitivos.

## MAL

```text
telefonos = "999,888"
```

## BIEN

Tabla aparte.

---

# 2FN

Dependencia funcional completa.

Ejemplo:

```text
enrollments
--------------
talk_id PK
student_id PK
assistance
```

La asistencia depende de ambas columnas.

---

# 3FN

No dependencias transitivas.

Los atributos dependen directamente de la PK.

---

# Plantilla universal para examen

```text
TABLA
-------------------------
id INT PK
name VARCHAR(100)
otra_tabla_id INT FK
```

---

# Ejercicio tipo examen

## ENUNCIADO

> Un restaurante tiene mesas.
> Cada mesa puede tener muchos pedidos.
> Cada pedido contiene muchos platos.
> Un plato puede estar en muchos pedidos.

---

# Resolución

## Tablas

```text
MESA
PEDIDO
PLATO
DETALLE_PEDIDO
```

---

# Relaciones

```text
MESA 1:N PEDIDO

PEDIDO N:M PLATO
```

---

# Tabla puente

```text
DETALLE_PEDIDO
-------------------------
pedido_id PK FK
plato_id PK FK
cantidad
```

---

# Modelo físico final

```text
MESA
-------------------------
id_mesa INT PK
numero INT

PEDIDO
-------------------------
id_pedido INT PK
id_mesa INT FK
fecha DATE

PLATO
-------------------------
id_plato INT PK
nombre VARCHAR(100)
precio DECIMAL(10,2)

DETALLE_PEDIDO
-------------------------
pedido_id INT PK FK
plato_id INT PK FK
cantidad INT
```

---

# Qué debes practicar

NO SQL todavía.

Debes practicar:

- detectar entidades,
- detectar 1:N,
- detectar N:M,
- crear tablas puente,
- poner PK,
- poner FK.

Eso es el 80% del examen.

---

# Trucos PRO para SI400

## 1. Catálogos

Si hay:
- tipos,
- estados,
- categorías,
- niveles,

probablemente crean tabla aparte.

---

## 2. PK compuesta

En tablas puente:

```text
user_id PK FK
event_id PK FK
```

---

## 3. FK naming

Usan:

```text
tabla_id
```

Ejemplo:

```text
company_id
user_id
proposal_id
```

---

# Checklist final antes de entregar

- ¿Todas las tablas tienen PK?
- ¿Todas las relaciones tienen FK?
- ¿Detecté todos los N:M?
- ¿Creé tablas puente?
- ¿Hay atributos repetidos?
- ¿Usé tipos de datos coherentes?

---

# Ejercicios recomendados

Practicar:

- FreelanceHub
- EventHub
- AutoCarePro

Porque son casi idénticos al patrón de examen SI400.

---

# Resumen definitivo

## 1:N

FK en el lado MUCHOS.

---

## N:M

Tabla puente obligatoria.

---

## Tipos de datos

- INT
- VARCHAR
- DATE
- TIME
- DECIMAL

---

## PK

Todas las tablas tienen.

---

## FK

Conectan tablas.

---

## Tablas puente

Llevan:
- PK compuesta,
- FKs,
- atributos de la relación.
