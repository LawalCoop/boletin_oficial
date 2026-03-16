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

BoletínAI transforma cada documento oficial en:

- **Título claro**: Qué hizo quién (verbo en pasado)
- **Resumen ejecutivo**: 2-3 oraciones explicando lo esencial
- **Puntos clave**: 3-4 bullets con lo más importante
- **Impacto por grupos**: A quién afecta y cómo
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

### Título

**Fórmula**: `[Organismo] + [verbo pasado] + [acción principal]`

❌ Malo: "RESOLUCIÓN 119/2025 - SECRETARÍA DE ENERGÍA"
✅ Bueno: "Secretaría de Energía actualizó normativa del mercado eléctrico"

**Verbos comunes**:
- Creó, estableció, actualizó, modificó, derogó
- Autorizó, aprobó, rechazó, suspendió
- Designó, removió, aceptó la renuncia de
- Convocó, prorrogó, extendió

### Resumen

2-3 oraciones que responden:
1. **Qué**: La acción principal
2. **Quién**: El organismo emisor
3. **Impacto**: Por qué importa

**Ejemplo**:
> La Secretaría de Energía publicó la Resolución 119/2025 con actualizaciones para el funcionamiento del mercado eléctrico mayorista. Se modifican los mecanismos de despacho y se incorporan incentivos para energías renovables.

### Puntos Clave

3-4 puntos con:
- **Título**: 2-4 palabras, concepto principal
- **Descripción**: 1-2 oraciones explicando el punto

**Criterios de selección**:
1. Cambios concretos (números, plazos, montos)
2. Nuevas obligaciones o derechos
3. Fechas de entrada en vigencia
4. Organismos o grupos afectados

### A Quién Afecta

Identificar 2-4 grupos impactados con:
- **Grupo**: Nombre del grupo (ej: "Empresas de energía")
- **Icono**: De Lucide React (ej: "building-2")
- **Descripción**: Cómo les afecta específicamente

**Grupos comunes**:
- Empresas/PyMEs/Autónomos
- Trabajadores/Empleados
- Jubilados/Pensionados
- Consumidores/Usuarios
- Profesionales de [sector]
- Organismos públicos
- Provincias/Municipios

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
