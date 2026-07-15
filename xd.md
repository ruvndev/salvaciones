
---

# 1. Método para resolver cualquier caso

## Paso 1: mira qué consultas debe facilitar

Busca frases como:

- “búsqueda de locales cercanos”
- “visualización de máquinas por zona”
- “stock disponible”
- “estado del pedido”
- “asientos disponibles por clase”

El modelo se diseña **para responder esas consultas**.

## Paso 2: elige mínimo dos colecciones

Regla práctica:

```text
Colección 1 = elemento principal que el usuario busca
Colección 2 = operación o historial que crece
```

Ejemplos:

| Caso | Colección principal | Segunda colección |
|---|---|---|
| Gimnasios | `gimnasios` | `usuarios` o `valoraciones` |
| Veterinarias | `clinicas` | `citas` |
| Productos | `productos` | `pedidos` |
| Vuelos | `vuelos` | `reservas` |
| Estaciones | `estaciones` | `sesiones_carga` |

## Paso 3: decide qué embeber y qué referenciar

```text
Pertenece al documento y se consulta junto → EMBEBER

Existe por separado, se comparte o crece mucho → REFERENCIAR
```

Ejemplos:

```text
Sede → zonas → máquinas                  EMBEBIDO
Producto → inventario                    EMBEBIDO
Vuelo → aeronave → clases                EMBEBIDO
Pedido → pago y entrega                  EMBEBIDO

Reserva → vuelo_id                       REFERENCIA
Sesión de carga → punto_carga_id         REFERENCIA
Valoración → usuario_id y sede_id        REFERENCIA
```

---

# 2. Patrones que debes mencionar

## Embedded document pattern

```javascript
{
  nombre: "Power Gym",
  ubicacion: {
    distrito: "San Miguel",
    direccion: "Av. La Marina 123"
  }
}
```

**Justificación:**

> Se aplicó el `Embedded document pattern` porque la ubicación pertenece al gimnasio y normalmente se consulta junto con sus datos principales, permitiendo recuperar la información en una sola operación.

---

## One-to-many with embedded documents

```javascript
{
  nombre: "Sede San Miguel",
  maquinas: [
    {
      codigo: "M001",
      nombre: "Caminadora",
      estado: "disponible"
    }
  ]
}
```

**Justificación:**

> Se modeló una relación uno a muchos mediante documentos embebidos porque las máquinas pertenecen a la sede y deben visualizarse dentro de su contexto.

---

## Reference pattern

```javascript
{
  usuario_id: ObjectId("..."),
  sede_id: ObjectId("..."),
  puntuacion: 5
}
```

**Justificación:**

> Se aplicó el `Reference pattern` porque la valoración relaciona entidades independientes y puede crecer continuamente, evitando duplicar información.

---

## Subset pattern

Se guarda solo lo más consultado en el documento principal y el historial completo en otra colección.

```javascript
// producto
{
  nombre: "Laptop",
  promedio_resenias: 4.8,
  resenias_recientes: [
    { puntuacion: 5, comentario: "Muy buena" }
  ]
}
```

```javascript
// resenias
{
  producto_id: ObjectId("..."),
  puntuacion: 5,
  comentario: "Muy buena",
  fecha: ISODate("2026-07-15T10:00:00Z")
}
```

**Justificación:**

> Se aplicó el `Subset pattern` para conservar en el documento principal solo la información de consulta frecuente y almacenar el historial completo en otra colección.

---

# 3. Modelo universal para Hackolade

## Colección principal

```javascript
{
  _id: ObjectId("..."),
  codigo: "ENT-001",
  nombre: "Nombre principal",
  estado: "activo",

  ubicacion: {
    type: "Point",
    coordinates: [-77.09, -12.08]
  },

  elementos: [
    {
      elemento_id: ObjectId("..."),
      nombre: "Elemento",
      estado: "disponible"
    }
  ]
}
```

## Colección transaccional

```javascript
{
  _id: ObjectId("..."),
  codigo: "TRA-001",

  entidad_principal_id: ObjectId("..."),

  usuario: {
    usuario_id: ObjectId("..."),
    nombre: "Carlos Ramirez"
  },

  fecha: ISODate("2026-07-15T10:00:00Z"),
  estado: "confirmado",
  total: 100
}
```

---

# 4. Cómo hacerlo en Hackolade

## Crear el modelo

1. Crear un modelo nuevo.
2. Elegir **MongoDB**.
3. Crear mínimo dos colecciones.
4. Agregar campos y tipos.
5. Marcar los obligatorios como `Required`.
6. Crear documentos embebidos y arreglos.
7. Crear referencias cuando corresponda.

## Tipos frecuentes

| Dato | Tipo Hackolade |
|---|---|
| Texto | `string` |
| Precio/costo | `numeric` |
| Fecha | `date` |
| Verdadero/falso | `boolean` |
| Identificador | `objectId` |
| Objeto embebido | `document` |
| Lista | `array` |

## Arreglo de documentos

```text
puntos_carga            array
  [0]                   document
    id_carga            objectId
    estado              string
    tipo_conector       string
```

## Documento embebido

```text
empresa                 document
  razon_social          string
  ruc                    string
  correo                 string
```

---

# 5. Cómo sacar el script de Hackolade

El archivo `.hck.json` es el proyecto de Hackolade. **No se ejecuta en MongoDB.**

Debes generar el script:

```text
Tools
→ Forward-Engineering
→ MongoDB Script
```

Después:

1. Selecciona las colecciones.
2. Genera el script de creación.
3. Copia el código `db.createCollection(...)`.
4. Pégalo en MongoDB Compass o `mongosh`.

Configura:

```text
Validation Level: Strict
Validation Action: Error
```

Debe generar:

```javascript
validationLevel: "strict",
validationAction: "error"
```

Evita:

```javascript
validationLevel: "off",
validationAction: "warn"
```

## Antes de ejecutar, revisa

- nombres iguales en todo el script;
- comas y llaves;
- costos y precios como números;
- teléfonos y RUC como texto;
- fechas como `date`;
- estados del `enum` iguales al documento que insertarás.

---

# 6. JSON Schema rápido

```javascript
db.createCollection("maquinas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",

      required: [
        "codigo",
        "nombre",
        "estado"
      ],

      properties: {
        _id: {
          bsonType: "objectId"
        },

        codigo: {
          bsonType: "string"
        },

        nombre: {
          bsonType: "string"
        },

        estado: {
          bsonType: "string",
          enum: [
            "disponible",
            "ocupada",
            "mantenimiento"
          ]
        }
      }
    }
  },

  validationLevel: "strict",
  validationAction: "error"
})
```

## Arreglo de documentos

```javascript
puntos_carga: {
  bsonType: "array",

  items: {
    bsonType: "object",

    required: [
      "id_carga",
      "estado",
      "tipo_conector"
    ],

    properties: {
      id_carga: {
        bsonType: "objectId"
      },

      estado: {
        bsonType: "string",
        enum: [
          "disponible",
          "ocupado",
          "mantenimiento"
        ]
      },

      tipo_conector: {
        bsonType: "string"
      }
    }
  }
}
```

## Puntuación de 1 a 5

```javascript
puntuacion: {
  bsonType: "int",
  minimum: 1,
  maximum: 5
}
```

## Probar documento válido

```javascript
db.maquinas.insertOne({
  codigo: "M001",
  nombre: "Caminadora",
  estado: "disponible"
})
```

Mostrar evidencia:

```javascript
db.maquinas.find()
```

---

# 7. Búsqueda de lugares cercanos

Cuando diga **cercanos**, incluye:

```javascript
ubicacion: {
  type: "Point",
  coordinates: [-77.09, -12.08]
}
```

Orden:

```text
[longitud, latitud]
```

Índice:

```javascript
db.estaciones.createIndex({
  ubicacion: "2dsphere"
})
```

Consulta:

```javascript
db.estaciones.find({
  ubicacion: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [-77.09, -12.08]
      },
      $maxDistance: 5000
    }
  }
})
```

Frase:

> Se utiliza GeoJSON y un índice `2dsphere` para permitir búsquedas geoespaciales de establecimientos cercanos.

---

# 8. Consultas esenciales

## Insertar uno

```javascript
db.productos.insertOne({
  codigo: "PRO-001",
  nombre: "Laptop Lenovo",
  precio: 2500
})
```

## Insertar cinco

```javascript
db.incidencias.insertMany([
  {
    codigo: "INC-001",
    estado: "cancelado",
    tipo: "Falla de camara",
    costo: 1200
  },
  {
    codigo: "INC-002",
    estado: "pendiente",
    tipo: "Problema de audio",
    costo: 800
  },
  {
    codigo: "INC-003",
    estado: "cancelado",
    tipo: "Falla de camara",
    costo: 950
  },
  {
    codigo: "INC-004",
    estado: "en atencion",
    tipo: "Falla de proyector",
    costo: 700
  },
  {
    codigo: "INC-005",
    estado: "registrado",
    tipo: "Falla de camara",
    costo: 600
  }
])
```

## Mostrar documentos

```javascript
db.incidencias.find()
```

## Igualdad

```javascript
db.incidencias.find({
  estado: "cancelado"
})
```

## Dos condiciones AND

```javascript
db.incidencias.find({
  estado: "cancelado",
  tipo: "Falla de camara"
})
```

## Contar

```javascript
db.incidencias.countDocuments({
  estado: "cancelado",
  tipo: "Falla de camara"
})
```

## Mayor que

```javascript
db.ventas.countDocuments({
  monto_total: {
    $gt: 1000
  }
})
```

## Operadores

```text
$gt   mayor que
$gte  mayor o igual
$lt   menor que
$lte  menor o igual
$ne   diferente
$in   dentro de una lista
```

---

# 9. Objetos y arreglos en consultas

## Campo de un objeto

```javascript
db.gimnasios.find({
  "ubicacion.distrito": "San Miguel"
})
```

## Campo dentro de arreglo de objetos

```javascript
db.gimnasios.find({
  "maquinas.estado": "disponible"
})
```

## Dos condiciones sobre el mismo elemento

```javascript
db.estaciones.find({
  puntos_carga: {
    $elemMatch: {
      estado: "disponible",
      tipo_conector: "CCS"
    }
  }
})
```

---

# 10. `aggregate()` por seguridad

Solo úsalo si el enunciado dice **agrupar** o exige `aggregate`.

## Agrupar por estado

```javascript
db.ofertas.aggregate([
  {
    $group: {
      _id: "$estado",
      cantidad: {
        $sum: 1
      }
    }
  }
])
```

## Agrupar por campo anidado

```javascript
db.ofertas.aggregate([
  {
    $group: {
      _id: "$proceso.tipo_seleccion",
      cantidad: {
        $sum: 1
      }
    }
  }
])
```

## Filtrar y contar

```javascript
db.incidencias.aggregate([
  {
    $match: {
      estado: "cancelado",
      tipo: "Falla de camara"
    }
  },
  {
    $count: "cantidad"
  }
])
```

---

# 11. Modelos rápidos según el caso

## Productos

```javascript
{
  nombre: "Laptop Lenovo",
  categoria: "Tecnologia",
  marca: "Lenovo",
  precio: 2500,

  inventario: {
    stock_disponible: 12,
    stock_minimo: 3,
    estado: "disponible"
  }
}
```

## Pedido

```javascript
{
  cliente: {
    cliente_id: ObjectId("..."),
    nombre: "Carlos Ramirez"
  },

  productos: [
    {
      producto_id: ObjectId("..."),
      nombre: "Laptop Lenovo",
      cantidad: 1,
      precio_unitario: 2500
    }
  ],

  estado: "pagado",

  pago: {
    metodo: "tarjeta",
    estado: "confirmado"
  }
}
```

## Vuelo

```javascript
{
  codigo_vuelo: "AF-101",
  ciudad_origen: "Lima",
  ciudad_destino: "Cusco",
  fecha_vuelo: ISODate("2026-08-01T13:00:00Z"),
  estado: "programado",

  aeronave: {
    modelo: "Airbus A320",

    clases: [
      {
        nombre: "economica",
        disponibles: 35
      }
    ]
  }
}
```

## Gimnasio

```javascript
{
  nombre: "Power Gym",

  sedes: [
    {
      nombre: "San Miguel",

      ubicacion: {
        type: "Point",
        coordinates: [-77.09, -12.08]
      },

      zonas: [
        {
          nombre: "Cardio",

          maquinas: [
            {
              nombre: "Caminadora",
              estado: "disponible"
            }
          ]
        }
      ]
    }
  ]
}
```

---

# 12. Errores que debes evitar

- Crear demasiadas colecciones como si fuera SQL.
- No incluir los campos que permiten las consultas solicitadas.
- No usar coordenadas cuando piden lugares cercanos.
- Embeber historiales que crecerán indefinidamente.
- Guardar teléfono o RUC como número.
- Guardar precio o costo como texto.
- Usar un valor que no coincide con el `enum`.
- Dejar `validationLevel: "off"`.
- Dejar `validationAction: "warn"`.
- Olvidar las capturas o resultados como evidencia.

---

# 13. Checklist final

## Casos 1 y 2

- [ ] Mínimo dos colecciones.
- [ ] Campos necesarios para las consultas.
- [ ] Objetos y arreglos correctamente representados.
- [ ] Referencias claras.
- [ ] Patrones identificados y justificados.
- [ ] JSON Schema generado por Hackolade.
- [ ] `strict` + `error`.
- [ ] Documento válido insertado.
- [ ] `find()` ejecutado como evidencia.

## Caso 3

- [ ] Cinco registros con `insertMany()`.
- [ ] Todos siguen el modelo.
- [ ] `find()` ejecutado.
- [ ] Consulta con `countDocuments()` o `aggregate()`.
- [ ] Resultado visible.

---

# 14. Secuencia de emergencia

```text
1. Leer qué consultas debe facilitar.
2. Elegir dos colecciones.
3. Embeber lo que pertenece y se consulta junto.
4. Referenciar lo independiente o histórico.
5. Dibujar en Hackolade.
6. Explicar Embedded, Reference y Subset si aplica.
7. Generar script:
   Tools → Forward-Engineering → MongoDB Script.
8. Ejecutar el JSON Schema.
9. Insertar documento válido.
10. Mostrar find().
11. Insertar cinco documentos del caso 3.
12. Ejecutar countDocuments() o aggregate().
13. Capturar evidencias.
```
