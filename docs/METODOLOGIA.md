# Metodología de Traducción: Boletín Oficial → BoletínAI

Este documento explica cómo transformamos el contenido del Boletín Oficial de la República Argentina en artículos accesibles y comprensibles para el ciudadano común.

---

## Índice

1. [Visión General](#visión-general)
2. [Estructura de Datos](#estructura-de-datos)
3. [Mapeo de Secciones](#mapeo-de-secciones)
4. [Sistema de Categorías](#sistema-de-categorías)
5. [Generación de Contenido IA](#generación-de-contenido-ia)
6. [Criterios de Selección de Imágenes](#criterios-de-selección-de-imágenes)
7. [Flujo de Procesamiento](#flujo-de-procesamiento)

---

## Visión General

### El Problema

El Boletín Oficial publica diariamente cientos de normas en lenguaje técnico-legal que resulta inaccesible para la mayoría de los ciudadanos. Términos como "Visto", "Considerando", y referencias a leyes anteriores dificultan la comprensión del impacto real de cada norma.

### La Solución

BoletínAI transforma cada documento oficial en contenido **pedagógico y periodístico**. No solo informamos: **educamos**. Con el tiempo, los lectores van aprendiendo cómo funciona el Estado, qué es el Boletín Oficial, y cómo les afectan las normas.

### Principios Editoriales

1. **Pedagógico sin ser condescendiente**: Explicamos conceptos, no subestimamos al lector
2. **Periodístico y cercano**: Contamos historias, no listamos datos fríos
3. **Simple sin ser simplista**: Lenguaje claro, pero con profundidad
4. **Contextual**: Cada artículo es una oportunidad de enseñar algo sobre el Estado

### Qué Generamos

- **Título periodístico**: Cuenta qué pasó de forma atractiva
- **Resumen narrativo**: Como el primer párrafo de una nota de diario
- **Contexto educativo**: ¿Por qué existe este tipo de norma? ¿Qué significa?
- **Puntos clave explicados**: Con definiciones inline de términos técnicos
- **Impacto real**: Cómo cambia la vida de las personas, con ejemplos concretos
- **Texto original**: Siempre disponible para verificación

---

## Estructura de Datos

### Noticias del Día (`/data/noticias/YYYY-MM-DD.json`)

Archivo índice con las noticias de cada edición del Boletín:

```json
{
  "fecha": "2025-03-12",
  "edicion": "35.877",
  "generadoEn": "2025-03-12T08:00:00Z",
  "noticias": [
    {
      "id": "resol-energia-119-2025",
      "slug": "energia-actualizacion-mercado-electrico",
      "categoria": "nacional",
      "tema": "energia",
      "tipoDocumento": "resolucion",
      "numeroDocumento": "119/2025",
      "titulo": "Secretaría de Energía actualizó normativa del mercado eléctrico",
      "extracto": "Se modifican los mecanismos de despacho y se incorporan incentivos para energías renovables.",
      "imagen": "/images/articulos/energia.jpg",
      "fuente": "Boletín Oficial",
      "tiempoLectura": 4,
      "fechaPublicacion": "2025-03-12",
      "destacado": true,
      "tags": ["energia", "electricidad", "mercado"]
    }
  ]
}
```

### Artículo Completo (`/data/articulos/[slug].json`)

Contenido completo de cada documento:

```json
{
  "id": "resol-energia-119-2025",
  "slug": "energia-actualizacion-mercado-electrico",
  "metadata": {
    "categoria": "nacional",
    "tema": "energia",
    "tipoDocumento": "resolucion",
    "numeroDocumento": "119/2025",
    "organismoEmisor": "Secretaría de Energía",
    "urlOriginal": "https://www.boletinoficial.gob.ar/detalleAviso/primera/1192025/20250312",
    "fechaBoletinOficial": "2025-03-12",
    "numeroEdicion": "35.877"
  },
  "contenidoIA": {
    "titulo": "Secretaría de Energía actualizó normativa del mercado eléctrico",
    "resumen": "La Secretaría de Energía publicó la Resolución 119/2025 con actualizaciones para el funcionamiento del mercado eléctrico mayorista. Se modifican los mecanismos de despacho y se incorporan incentivos para energías renovables.",
    "puntosClaves": [
      {
        "titulo": "Prioridad renovable",
        "descripcion": "La energía de fuentes renovables tendrá prioridad de despacho sobre generación térmica convencional."
      }
    ],
    "aQuienAfecta": [
      {
        "grupo": "Generadores renovables",
        "icono": "sun",
        "descripcion": "Mayor prioridad de despacho y nuevas opciones de comercialización."
      }
    ]
  },
  "textoOriginal": {
    "encabezado": "RESOLUCIÓN 119/2025 - SECRETARÍA DE ENERGÍA",
    "articulos": [
      {
        "numero": "1",
        "titulo": "Despacho renovable",
        "contenido": "Artículo 1° - La energía generada a partir de fuentes renovables tendrá prioridad de despacho en el Mercado Eléctrico Mayorista (MEM)."
      }
    ]
  },
  "votacion": {
    "positivos": 678,
    "neutrales": 156,
    "negativos": 89
  },
  "relacionados": [],
  "imagen": "/images/articulos/energia.jpg",
  "fechaPublicacion": "2025-03-12T08:30:00Z",
  "tiempoLectura": 4,
  "tags": ["energia", "electricidad", "mercado"]
}
```

---

## Mapeo de Secciones

El Boletín Oficial tiene 4 secciones principales que mapeamos a categorías del portal:

| Sección BO | Contenido | Categoría Portal | Temas Comunes |
|------------|-----------|------------------|---------------|
| **Primera** | Decretos, Resoluciones, Disposiciones del PEN | `nacional` | economia, energia, salud, trabajo |
| **Segunda** | Avisos de sociedades comerciales | `empresas` | empresas |
| **Tercera** | Licitaciones y contrataciones públicas | `contrataciones` | contrataciones |
| **Cuarta** | Edictos judiciales, avisos legales | `judicial` | justicia |

### Tipos de Documentos

```typescript
type TipoDocumento =
  | "decreto"           // Firmado por el Presidente
  | "resolucion"        // Ministerios y Secretarías
  | "disposicion"       // Organismos descentralizados
  | "comunicacion"      // BCRA, CNV
  | "acordada"          // Poder Judicial
  | "ley"               // Promulgación de leyes
  | "decision_administrativa"  // Jefatura de Gabinete
```

---

## Sistema de Categorías

### Categorías Jurisdiccionales

Indican el nivel de gobierno que emitió la norma:

```typescript
const CATEGORIAS = {
  nacional: { color: "#0066CC", label: "NACIONAL" },
  provincial: { color: "#7C3AED", label: "PROVINCIAL" },
  municipal: { color: "#D97706", label: "MUNICIPAL" },
  internacional: { color: "#059669", label: "INTERNACIONAL" }
};
```

### Categorías Temáticas

22 temas para clasificar el contenido por área de interés:

| Tema | Icono | Color | Descripción |
|------|-------|-------|-------------|
| economia | `trending-up` | #0066CC | Medidas económicas, financieras, monetarias |
| energia | `zap` | #F59E0B | Electricidad, gas, petróleo, renovables |
| salud | `heart-pulse` | #EF4444 | Sistema sanitario, medicamentos, epidemias |
| trabajo | `briefcase` | #8B5CF6 | Empleo, convenios, jubilaciones |
| educacion | `graduation-cap` | #3B82F6 | Sistema educativo, universidades |
| transporte | `truck` | #6366F1 | Rutas, transporte público, aviación |
| justicia | `scale` | #1F2937 | Poder judicial, designaciones |
| seguridad | `shield` | #DC2626 | Fuerzas de seguridad, fronteras |
| ambiente | `leaf` | #10B981 | Medio ambiente, parques nacionales |
| tecnologia | `cpu` | #06B6D4 | Telecomunicaciones, digitalización |
| agro | `wheat` | #84CC16 | Agricultura, ganadería, pesca |
| comercio | `shopping-cart` | #F97316 | Comercio exterior, aranceles |
| cultura | `palette` | #EC4899 | INCAA, patrimonio, museos |
| defensa | `swords` | #475569 | Fuerzas armadas, equipamiento |
| vivienda | `home` | #14B8A6 | Prourbana, créditos hipotecarios |
| desarrollo-social | `users` | #A855F7 | Programas sociales, AUH |
| turismo | `plane` | #0EA5E9 | Turismo, parques nacionales |
| ciencia | `flask-conical` | #6366F1 | CONICET, investigación |
| interior | `map` | #78716C | Provincias, municipios |
| exterior | `globe` | #0D9488 | Relaciones internacionales |
| empresas | `building-2` | #64748B | Sociedades, registros |
| contrataciones | `file-text` | #71717A | Licitaciones públicas |

---

## Generación de Contenido IA

### Filosofía: Periodismo + Educación

Cada artículo tiene dos objetivos simultáneos:
1. **Informar** qué pasó (periodismo)
2. **Enseñar** cómo funciona el Estado (educación)

El lector que lee BoletínAI regularmente debería, con el tiempo:
- Entender la diferencia entre un Decreto, una Resolución y una Disposición
- Saber qué es el Boletín Oficial y por qué existe
- Conocer los principales organismos del Estado y sus funciones
- Poder leer una norma original con comprensión básica

---

### Título

**Tono**: Periodístico, como un titular de diario. Cuenta una historia, no describe un documento.

❌ Malo: "RESOLUCIÓN 119/2025 - SECRETARÍA DE ENERGÍA"
❌ Regular: "Secretaría de Energía actualizó normativa del mercado eléctrico"
✅ Bueno: "Las energías renovables tendrán prioridad en el despacho eléctrico"
✅ Bueno: "El Gobierno apuesta por la energía verde: nuevas reglas para el mercado eléctrico"

**Criterios**:
- Enfocarse en el **impacto**, no en el procedimiento
- Usar verbos activos y concretos
- Evitar jerga burocrática ("dispuso", "estableció", "mediante")
- Máximo 80 caracteres

---

### Resumen (Campo `resumen`)

**Tono**: Como el primer párrafo de una nota de Infobae o La Nación. Narrativo, fluido, que enganche.

**Estructura sugerida** (3-4 oraciones):
1. **El gancho**: Qué cambió y por qué importa
2. **El contexto**: Una oración que explique el "por qué" o el antecedente
3. **El dato duro**: El número, fecha o detalle concreto más relevante

**Ejemplo**:

❌ **Malo** (burocrático):
> La Secretaría de Energía publicó la Resolución 119/2025 con actualizaciones para el funcionamiento del mercado eléctrico mayorista. Se modifican los mecanismos de despacho y se incorporan incentivos para energías renovables.

✅ **Bueno** (periodístico-pedagógico):
> A partir de ahora, cuando haya que decidir qué central eléctrica abastece al país, las renovables van primero. La Secretaría de Energía acaba de cambiar las reglas del juego en el mercado eléctrico mayorista —el sistema donde las generadoras venden energía a las distribuidoras— con un claro mensaje: la transición energética es prioridad. El cambio entra en vigencia en 30 días.

**Técnicas clave**:
- **Explicar inline**: "el mercado eléctrico mayorista —el sistema donde las generadoras venden energía—"
- **Usar analogías**: "cambiar las reglas del juego"
- **Humanizar**: "con un claro mensaje"
- **Cerrar con lo concreto**: fechas, números, plazos

---

### Contexto Educativo (Campo `contexto` - NUEVO)

Un párrafo que explique **el marco institucional** de la noticia. Es la oportunidad de enseñar cómo funciona el Estado.

**Ejemplos por tipo de documento**:

Para un **Decreto**:
> 📚 **¿Qué es un Decreto?** Es una norma que firma el Presidente. Hay de dos tipos: los comunes (que reglamentan leyes) y los DNU (Decretos de Necesidad y Urgencia), que tienen fuerza de ley pero deben ser aprobados después por el Congreso. Este es un decreto común, lo que significa que no modifica ninguna ley, sino que organiza cómo el Poder Ejecutivo gestiona sus recursos.

Para una **Resolución**:
> 📚 **¿Por qué una Resolución y no un Decreto?** En Argentina, cada nivel de autoridad tiene su tipo de norma. El Presidente firma Decretos; los Ministros y Secretarios firman Resoluciones. Esta es una Resolución porque la decisión está dentro de las competencias de la Secretaría de Energía, sin necesidad de que intervenga el Presidente.

Para una **Disposición**:
> 📚 **¿Qué es una Disposición?** Es la norma que emiten los organismos descentralizados —entes con cierta autonomía dentro del Estado, como AFIP, ANSES o el SENASA—. Tienen menos jerarquía que las Resoluciones, pero son igual de obligatorias para quienes les compete.

---

### Puntos Clave (Campo `puntosClaves`)

**Cada punto debe ser autoexplicativo.** Si menciona un término técnico, lo define inline.

**Estructura por punto**:
- **Título**: 3-5 palabras, el concepto central
- **Descripción**: 2-3 oraciones. Primera: qué cambia. Segunda: qué significa. Tercera (opcional): ejemplo o dato.

**Ejemplo**:

❌ **Malo**:
```json
{
  "titulo": "Prioridad de despacho",
  "descripcion": "La energía renovable tendrá prioridad de despacho sobre la generación térmica."
}
```

✅ **Bueno**:
```json
{
  "titulo": "Las renovables, primero en la fila",
  "descripcion": "Cuando CAMMESA (la empresa que coordina el mercado eléctrico) decide qué centrales enciende para abastecer al país, ahora debe priorizar las que generan con sol, viento o agua antes que las que queman gas o carbón. En la práctica, esto significa más demanda garantizada para los parques eólicos y solares."
}
```

---

### A Quién Afecta (Campo `aQuienAfecta`)

**No solo listar grupos: explicar el impacto real con ejemplos concretos.**

**Estructura por grupo**:
- **Grupo**: Nombre claro y humano (no "usuarios del servicio", sino "familias que pagan la luz")
- **Icono**: De Lucide React
- **Descripción**: 2-3 oraciones que incluyan un ejemplo o situación concreta

**Ejemplo**:

❌ **Malo**:
```json
{
  "grupo": "Generadores renovables",
  "icono": "sun",
  "descripcion": "Mayor prioridad de despacho y nuevas opciones de comercialización."
}
```

✅ **Bueno**:
```json
{
  "grupo": "Empresas de energía solar y eólica",
  "icono": "sun",
  "descripcion": "Buenas noticias para los parques solares y eólicos del país. Con esta norma, tienen prácticamente garantizado que toda la energía que produzcan será comprada. Esto reduce la incertidumbre y podría atraer más inversiones al sector renovable."
}
```

---

### Glosario Inline

Siempre que aparezca un término técnico, explicarlo en el mismo texto usando:
- Guiones largos: "el MEM —Mercado Eléctrico Mayorista—"
- Paréntesis: "CAMMESA (la empresa estatal que coordina el sistema eléctrico)"
- Explicación natural: "los llamados 'grandes usuarios', que son industrias y comercios que consumen mucha energía"

**Términos que SIEMPRE hay que explicar la primera vez**:
- Siglas de organismos (AFIP, ANSES, SENASA, CAMMESA, etc.)
- Tipos de documentos (DNU, Resolución, Disposición)
- Conceptos legales (recurso jerárquico, cosa juzgada, prescripción)
- Jerga de cada sector (despacho eléctrico, valor FOB, arancel)

---

### Tono General

| Evitar | Preferir |
|--------|----------|
| "Se dispuso que..." | "A partir de ahora..." |
| "Mediante la presente..." | "Con esta medida..." |
| "Los sujetos alcanzados..." | "Las personas y empresas que..." |
| "Se establecen requisitos..." | "Ahora se va a exigir..." |
| "Conforme a lo normado..." | "Según las nuevas reglas..." |
| "El organismo competente..." | "El [nombre del organismo]..." |

**Sí**: Cercano, claro, explicativo, periodístico
**No**: Burocrático, frío, técnico, distante

---

## Criterios de Selección de Imágenes

### Por Tema

| Tema | Tipo de Imagen | Ejemplos |
|------|----------------|----------|
| economia | Gráficos, monedas, edificios financieros | Banco Central, pesos |
| energia | Torres eléctricas, paneles solares, represas | Líneas de transmisión |
| salud | Hospitales, vacunas, equipamiento médico | Personal de salud |
| trabajo | Oficinas, fábricas, construcción | Personas trabajando |
| transporte | Rutas, trenes, aviones, puertos | Infraestructura |
| agro | Campos, cosechas, ganado | Paisajes rurales |
| seguridad | Fuerzas de seguridad, fronteras | Pasos fronterizos |
| defensa | Equipamiento militar, bases | Fuerzas armadas |

### Especificaciones Técnicas

- **Formato**: JPG
- **Dimensiones**: 1200x800px mínimo
- **Aspect ratio**: 16:9 o 3:2
- **Ubicación**: `/public/images/articulos/`
- **Naming**: `[tema-principal].jpg` o `[slug-corto].jpg`

### Fuentes de Imágenes

1. **Unsplash** - Fotos libres de derechos
2. **Imágenes oficiales** - De los organismos públicos
3. **Generación IA** - Para casos específicos

---

## Flujo de Procesamiento

### 1. Scraping del Boletín Oficial

```
boletinoficial.gob.ar → HTML → Extracción de:
  - Número de edición
  - Fecha
  - Lista de documentos por sección
  - Texto completo de cada documento
  - URL original
```

### 2. Clasificación Automática

```
Texto original → Análisis de:
  - Organismo emisor → tema principal
  - Palabras clave → tags
  - Tipo de documento → tipoDocumento
  - Jurisdicción → categoria
```

### 3. Generación de Contenido IA

```
Prompt al LLM:
  - Input: Texto original completo
  - Output: titulo, resumen, puntosClaves, aQuienAfecta

Validaciones:
  - Título < 100 caracteres
  - Resumen: 2-3 oraciones
  - Puntos clave: 3-4 items
  - Grupos afectados: 2-4 grupos
```

### 4. Asignación de Imagen

```
Si existe imagen específica del documento → usar esa
Si no → usar imagen genérica del tema
Si no → usar placeholder
```

### 5. Generación de JSONs

```
1. Crear/actualizar /data/articulos/[slug].json
2. Agregar entrada en /data/noticias/[fecha].json
3. Calcular tiempo de lectura (palabras / 200)
4. Asignar destacado (relevancia > umbral)
```

### 6. Validación

```
Verificar:
  ✓ URL original accesible
  ✓ Todos los campos requeridos presentes
  ✓ Imagen existe en /public
  ✓ Slug único
  ✓ Fecha correcta
```

---

## Ejemplos de Transformación

### Ejemplo 1: Resolución de Energía

**Original** (fragmento):
```
RESOLUCIÓN 119/2025

VISTO el Expediente N° EX-2025-12345678-APN-SE#MEC, la Ley N° 24.065,
el Decreto N° 134 de fecha 16 de diciembre de 2015...

CONSIDERANDO:
Que mediante la Ley N° 24.065 se estableció el Marco Regulatorio Eléctrico...

EL SECRETARIO DE ENERGÍA
RESUELVE:

ARTÍCULO 1°.- La energía generada a partir de fuentes renovables tendrá
prioridad de despacho en el Mercado Eléctrico Mayorista (MEM).
```

**Transformado**:
```json
{
  "titulo": "Secretaría de Energía actualizó normativa del mercado eléctrico",
  "resumen": "La Secretaría de Energía publicó la Resolución 119/2025 con actualizaciones para el funcionamiento del mercado eléctrico mayorista. Se modifican los mecanismos de despacho y se incorporan incentivos para energías renovables.",
  "puntosClaves": [
    {
      "titulo": "Prioridad renovable",
      "descripcion": "La energía de fuentes renovables tendrá prioridad de despacho sobre generación térmica convencional."
    }
  ]
}
```

---

## Consideraciones Legales

1. **Siempre linkear al original**: Cada artículo debe tener `urlOriginal` apuntando al Boletín Oficial
2. **No modificar texto legal**: La sección `textoOriginal` debe ser copia fiel
3. **Aclarar que es IA**: El banner "Contenido generado con IA" debe ser visible
4. **Derecho a rectificación**: Permitir reportar errores en la interpretación

---

## Métricas de Calidad

### Indicadores por Artículo

- **Precisión**: ¿El resumen refleja fielmente el documento?
- **Completitud**: ¿Se identificaron todos los grupos afectados?
- **Claridad**: ¿Es comprensible sin conocimiento legal?
- **Verificabilidad**: ¿El lector puede confirmar en el original?

### Feedback de Usuarios

El sistema de votación (positivo/neutral/negativo) permite:
- Identificar artículos mal procesados
- Mejorar los prompts de generación
- Priorizar temas de interés

---

## Mantenimiento

### Actualizaciones Diarias

1. **08:00**: Scraping del nuevo Boletín
2. **08:30**: Procesamiento con IA
3. **09:00**: Revisión manual (opcional)
4. **09:30**: Publicación

### Correcciones

Si se detecta un error:
1. Editar el JSON del artículo
2. Agregar nota en `contenidoIA.nota` si corresponde
3. No modificar `textoOriginal`

---

## Contacto

Para consultas sobre la metodología o reportar errores:
- Email: contacto@boletinai.ar
- GitHub: Issues en el repositorio
