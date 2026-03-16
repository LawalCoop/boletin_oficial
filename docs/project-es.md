# Propuesta Mozilla Democracy x AI -- Cooperativa Lawal

## Nombre de trabajo

**Boletin Abierto** (nombre provisorio, a definir)

## Qué es

Una herramienta open source que usa IA para leer los boletines oficiales del gobierno, entender qué cambia, y alertar a las comunidades sobre lo que les importa, en lenguaje simple.

## El problema

En Argentina (y en toda Latinoamérica), los gobiernos publican decretos, resoluciones, ordenanzas y leyes en boletines oficiales. Estos documentos:

- Están en PDFs hostiles, muchas veces escaneados
- Usan jerga legal inaccesible
- Se publican en sitios dispersos (nación, provincia, municipio) sin interconexión
- No hay forma de suscribirse a temas específicos
- Nadie puede leer todo lo que se publica cada día
- No existe un registro accesible de qué cambió respecto a la versión anterior de una norma

El resultado: las comunidades se enteran tarde (o nunca) de decisiones que afectan directamente su territorio, sus derechos y sus recursos. Los únicos que leen el boletín oficial todos los días son los estudios de abogados y las empresas con recursos para hacerlo.

### Caso concreto: Patagonia y los incendios forestales

En la Patagonia argentina, entre 2023 y 2026, el gobierno nacional:

- Derogó la Ley de Tierras que limitaba la compra de tierras por extranjeros (DNU 70/2023)
- Disolvió el fondo de protección ambiental de bosques (Decreto 888/2024)
- Redujo la ejecución presupuestaria de prevención de incendios de 96% a ~0%
- Dejó vencer contratos de brigadistas (30/dic/2024) -- incendios masivos comenzaron días después
- Anunció planes para eliminar la prohibición de 30-60 años de cambio de uso de suelo post-incendio (enero 2026)

Todo esto fue publicado en el Boletín Oficial. Las comunidades afectadas se enteraron por las noticias, semanas o meses después, cuando ya no podían actuar. Si hubieran tenido un sistema que les avisara el día que se publicó cada decreto, con una explicación de lo que significaba para su territorio, la respuesta tal vez hubiera sido otra.

Hay casos documentados del vínculo entre incendios y especulación inmobiliaria.


## Qué construimos

### 1. Motor de ingesta y procesamiento

Un sistema que todos los días:

- Scrapea los boletines oficiales (nacional, provinciales, municipales)
- Extrae texto de PDFs (incluyendo OCR para escaneados)
- Clasifica cada publicación por tópicos usando IA
- Genera resúmenes en lenguaje accesible
- Detecta qué cambió respecto a normativa anterior ("diff legal")
- Almacena todo en una base de datos estructurada y buscable ??

### 2. Sistema de alertas por tópicos

Los usuarios (personas u organizaciones) eligen tópicos de interés:
- Tierras y territorio
- Bosques y ambiente
- Agua y recursos hídricos
- Presupuesto y obra pública
- Educación
- Minería y extractivismo
- Derechos Pueblos originarios
- (cualquier otro)

Cuando se publica algo relevante, reciben una alerta por Telegram (y WhatsApp en una segunda fase) que incluye:
- Qué se publicó
- Qué significa en lenguaje simple
- Qué cambió respecto a lo anterior
- A quién afecta
- Link a la fuente original

### 3. Chat con RAG (Retrieval-Augmented Generation)

Un chat donde se puede preguntar en lenguaje natural:
- "Qué se publicó esta semana sobre tierras en Neuquén?"
- "Qué dice la ordenanza de VLA sobre permisos de obra en zona de bosque?"
- "Cómo cambió la Ley de Manejo del Fuego desde 2020?"
- "Qué diferencia hay entre lo que se aprobó hoy y lo que decía antes?"

Cada respuesta cita la fuente exacta (boletín, fecha, número de norma).

### 4. Diario de noticias

Feed público diario con resúmenes de lo publicado, filtrable por:
- Jurisdicción (nación, provincia, municipio)
- Tópico
- Fecha
- Tipo de norma (ley, decreto, resolución, ordenanza)


### 5. Funcionalidades avanzadas (fases posteriores)

- **Memoria acumulativa**: líneas temporales de cómo fue cambiando una regulación ??
- **Datos abiertos**: los boletines procesados se publican como dataset estructurado (un bien público en sí mismo)
- **Comparación entre jurisdicciones**: detectar contradicciones entre niveles de gobierno
- **Simulador de impacto**: modelar qué pasaría si se modifica una norma (inspirado en OpenFisca)

## Relevamiento técnico: fuentes de datos

### Boletín Oficial de la República Argentina (BORA)

- **URL**: https://www.boletinoficial.gob.ar/
- **Estructura**: 3 secciones (primera: legislación y avisos oficiales; segunda: sociedades; tercera: contrataciones)
- **Formato**: HTML renderizado + PDFs descargables
- **Frecuencia**: diaria (días hábiles)
- **Volumen estimado**: ~50-200 publicaciones por día
- **Scraping**: factible, hay 2 scrapers open source existentes en GitHub:
  - `tommanzur/scraper_boletin_oficial` (Python + BeautifulSoup)
  - `dedio/bora-scraper` (Python + Scrapy)
- **Complemento**: InfoLeg (datos.gob.ar) tiene bulk download mensual en CSV/ZIP de toda la normativa nacional desde 1997, formato estructurado con metadata

### Boletín Oficial de Neuquén

- **URL**: https://boletinoficial.neuquen.gob.ar/ (verificar)
- **Formato**: probablemente PDF (como la mayoría de provincias)
- **Scraping**: a relevar -- las provincias varían mucho en accesibilidad
- **Prioridad**: alta (es nuestra jurisdicción inicial)
- [TODO: relevar estructura, formato, frecuencia y factibilidad de scraping]

### Boletines municipales (VLA y otros)

- **Estado**: muchos municipios patagónicos no tienen boletín digital
- **Alternativa**: ordenanzas y resoluciones publicadas en sitios web municipales, a veces en redes sociales
- **Prioridad**: fase 2
- [TODO: relevar qué publica el municipio de VLA digitalmente]

### InfoLeg (base normativa nacional)

- **URL**: https://datos.gob.ar/dataset/justicia-base-infoleg-normativa-nacional
- **Formato**: CSV dentro de ZIP, actualización mensual
- **Contenido**: todas las leyes, decretos, resoluciones y disposiciones desde mayo 1997
- **Campos**: tipo de norma, número, fecha, título, texto, estado (vigente/derogada), normas modificadas/modificatorias
- **Valor clave**: permite construir el grafo de modificaciones (qué norma modifica a cuál), esencial para el "diff legal"
- **Sin autenticación**

### Presupuesto Abierto Argentina

- **URL**: https://www.presupuestoabierto.gob.ar/
- **API REST**: sí (POST), con token gratuito
- **Endpoints**: crédito, recurso, ejecución física, análisis transversal
- **Bulk download**: CSV disponible en datos.gob.ar
- **Valor clave**: ejecución presupuestaria por programa (cuánto se asignó vs. cuánto se gastó)
- **Licencia**: Creative Commons 4.0

### Datos.gob.ar (portal nacional de datos abiertos)

- **URL**: https://www.datos.gob.ar/
- **Contenido**: 500+ datasets de 19 organizaciones
- **Relevantes**: normativa (InfoLeg), presupuesto, tierras rurales (parcial post-DNU), catastros
- **Formato**: CKAN, descarga libre

## Descripción técnica detallada - ACA HAY QUE RE HACER O CHEQUEAR TODO!!! 

### Pipeline de datos (ingesta diaria)

```
┌─────────────────────────────────────────────────────────┐
│                    FUENTES DE DATOS                      │
│  BORA  │  BO Neuquén  │  InfoLeg  │  Presupuesto  │ ... │
└────┬────────┬────────────┬───────────┬──────────────────┘
     │        │            │           │
     ▼        ▼            ▼           ▼
┌─────────────────────────────────────────────────────────┐
│              CAPA DE INGESTA (Scrapers)                   │
│                                                           │
│  Scrapy/BS4       PyMuPDF        Bulk CSV                │
│  (HTML→texto)     (PDF→texto)    (descarga directa)      │
│                   Tesseract                               │
│                   (PDF escaneado→texto via OCR)           │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              CAPA DE PROCESAMIENTO (IA)                   │
│                                                           │
│  1. Limpieza y normalización de texto                     │
│  2. Chunking por artículo/sección                         │
│  3. Clasificación por tópicos (LLM)                       │
│     → tierras, bosques, agua, presupuesto, etc.           │
│  4. Extracción de entidades (NER)                         │
│     → organismos, jurisdicciones, montos, plazos          │
│  5. Detección de norma modificada (regex + LLM)           │
│     → "modifícase el art. 22 de la Ley 26.815"           │
│  6. Generación de resumen en lenguaje simple (LLM)        │
│  7. Diff legal: comparación con versión anterior (LLM)    │
│  8. Generación de embeddings para RAG                     │
│                                                           │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              CAPA DE ALMACENAMIENTO                       │
│                                                           │
│  PostgreSQL                                               │
│  ├── publicaciones (metadata, texto, resumen, tópicos)    │
│  ├── normas (grafo de modificaciones entre normas)        │
│  ├── usuarios (tópicos de interés, canal de notif.)       │
│  ├── alertas_enviadas (log)                               │
│  └── embeddings (pgvector)                                │
│                                                           │
└────────┬──────────────┬──────────────┬──────────────────┘
         │              │              │
         ▼              ▼              ▼
┌──────────────┐ ┌─────────────┐ ┌──────────────────┐
│   ALERTAS    │ │    CHAT     │ │  DIARIO / FEED   │
│              │ │             │ │                   │
│  Telegram    │ │  RAG:       │ │  Web (FastAPI o   │
│  Bot que     │ │  pregunta → │ │  SvelteKit)       │
│  envía por   │ │  búsqueda   │ │                   │
│  tópico      │ │  en pgvector│ │  Resúmenes        │
│  cuando hay  │ │  → contexto │ │  diarios por      │
│  match       │ │  → LLM →   │ │  jurisdicción     │
│              │ │  respuesta  │ │  y tópico         │
│  WhatsApp    │ │  con citas  │ │                   │
│  (fase 2)    │ │             │ │  RSS feed         │
│              │ │  Interfaces:│ │                   │
│              │ │  - Telegram │ │  API pública      │
│              │ │  - Web chat │ │  (datos abiertos) │
└──────────────┘ └─────────────┘ └──────────────────┘
```

### Detalle del procesamiento con IA

#### Clasificación por tópicos

Cada publicación se clasifica en uno o más tópicos usando un LLM con prompt estructurado. Taxonomía inicial de tópicos:

| Tópico | Incluye |
|--------|---------|
| Tierras y territorio | Propiedad, catastro, tierras fiscales, extranjerización, zonificación |
| Bosques y ambiente | Ley de bosques, áreas protegidas, manejo del fuego, COFEMA |
| Agua y recursos hídricos | Concesiones, calidad, cuencas, riego, EPAS |
| Presupuesto y finanzas | Asignaciones, ejecución, transferencias, fondos fiduciarios |
| Obra pública | Licitaciones, adjudicaciones, infraestructura |
| Minería y extractivismo | Cateos, concesiones, EIA, hidrocarburos |
| Derechos indígenas | Comunidades, relevamiento territorial, personería |
| Educación | Designaciones, programas, infraestructura escolar |
| Salud | Programas, emergencias, habilitaciones |
| Trabajo y empleo | Convenios, salarios, registros |
| Seguridad | Fuerzas, emergencias, protocolos |

La taxonomía es extensible: los usuarios pueden proponer nuevos tópicos.

#### Diff legal (comparación con versión anterior)

Cuando una publicación modifica una norma existente:

1. Se detecta la referencia ("modifícase el artículo X de la Ley N") via regex + NER
2. Se busca en la base de datos la versión anterior de esa norma (vía InfoLeg o publicaciones previas)
3. Se le pide al LLM que compare ambas versiones y genere:
   - Qué decía antes
   - Qué dice ahora
   - Qué significa el cambio en lenguaje simple
   - A quién afecta

Ejemplo de salida:
```
ANTES: La Ley 26.815 art. 22bis prohibía el cambio de uso de suelo
en zonas quemadas por 60 años (bosque nativo) o 30 años (pastizales).

AHORA: El Decreto XXX/2026 elimina esta prohibición.

QUÉ SIGNIFICA: Las tierras que se quemaron pueden ahora ser vendidas
y usadas para emprendimientos inmobiliarios sin plazo de espera.
Esto afecta directamente a las 3.800 ha quemadas en Confluencia (2025)
y las 1.800 ha de El Hoyo (2026).

FUENTE: Boletín Oficial N.o XXXX, 15/03/2026, Sección Primera.
```

#### RAG (Retrieval-Augmented Generation)

Flujo de una consulta del usuario:

1. **Pregunta**: "Qué cambió sobre tierras en Neuquén este mes?"
2. **Embedding**: se genera embedding de la pregunta
3. **Búsqueda**: se buscan los chunks más relevantes en pgvector, filtrados por:
   - Tópico: tierras y territorio
   - Jurisdicción: Neuquén (nacional + provincial)
   - Fecha: último mes
4. **Contexto**: los chunks relevantes se arman como contexto para el LLM
5. **Respuesta**: el LLM genera una respuesta citando cada fuente:
   - Número de boletín, fecha, sección
   - Número de norma (ley, decreto, resolución)
   - Link directo al documento original
6. **Validación**: si no hay resultados relevantes, el sistema lo dice explícitamente (no inventa)

#### Generación de alertas

Flujo diario automatizado:

1. Se ejecutan los scrapers (cron, ~6 AM)
2. Se procesan las nuevas publicaciones (clasificación, resumen, diff)
3. Para cada publicación procesada, se buscan usuarios suscritos a esos tópicos
4. Se genera una alerta personalizada por usuario:
   - Si tiene 1-3 publicaciones relevantes: una alerta por publicación
   - Si tiene más: un resumen diario agrupado por tópico
5. Se envía via Telegram Bot API
6. Se loguea en la base de datos (para no repetir)

### Modelo de datos (PostgreSQL)

```sql
-- Publicaciones scrapeadas y procesadas
publicaciones (
    id,
    fuente,              -- 'bora', 'bo_neuquen', 'infoleg', etc.
    seccion,             -- 'primera', 'segunda', 'tercera'
    fecha_publicacion,
    titulo,
    texto_completo,
    texto_limpio,        -- post-procesamiento
    resumen,             -- generado por LLM
    tipo_norma,          -- 'ley', 'decreto', 'resolución', 'ordenanza'
    numero_norma,
    organismo_emisor,
    jurisdiccion,        -- 'nacional', 'neuquen', 'vla', etc.
    url_original,
    pdf_url,
    created_at
)

-- Clasificación por tópicos (muchos a muchos)
publicacion_topicos (
    publicacion_id,
    topico,              -- 'tierras', 'bosques', 'agua', etc.
    relevancia            -- 0.0 a 1.0 (confianza de la clasificación)
)

-- Grafo de modificaciones entre normas
modificaciones (
    publicacion_nueva_id,    -- la que modifica
    norma_modificada,        -- "Ley 26.815 art. 22bis"
    tipo_cambio,             -- 'modifica', 'deroga', 'sustituye', 'agrega'
    texto_anterior,
    texto_nuevo,
    diff_simple              -- explicación en lenguaje simple (LLM)
)

-- Embeddings para RAG
chunks (
    id,
    publicacion_id,
    texto_chunk,
    embedding,               -- vector (pgvector)
    metadata                 -- jsonb (tópicos, jurisdicción, fecha)
)

-- Usuarios y suscripciones
usuarios (
    id,
    telegram_chat_id,
    nombre,
    organizacion,           -- opcional
    jurisdicciones,         -- array: ['nacional', 'neuquen']
    created_at
)

-- Tópicos de interés por usuario
suscripciones (
    usuario_id,
    topico,
    activa
)

-- Log de alertas enviadas
alertas (
    id,
    usuario_id,
    publicacion_id,
    texto_alerta,
    enviada_at,
    canal                   -- 'telegram', 'whatsapp'
)
```

### Decisiones técnicas a definir con el equipo

| Decisión | Opciones | Trade-offs |
|----------|----------|------------|
| **LLM** | Claude Haiku / GPT-4o-mini / Llama 3 local | API = más simple pero dependencia + costo. Local = cero costo pero más servidor y mantenimiento |
| **Embeddings** | text-embedding-3-small (OpenAI) / nomic-embed-text (local) | Mismo trade-off API vs local. Para español, evaluar calidad |
| **Vector store** | pgvector (integrado en PG) / ChromaDB / Qdrant | pgvector = menos infra, una sola DB. Chroma/Qdrant = más features pero otro servicio |
| **Interfaz web** | FastAPI + Jinja / SvelteKit / Streamlit | FastAPI = simple. SvelteKit = ya lo manejan pero es más laburo. Streamlit = prototipo rápido |
| **Chat** | Telegram bot solo / Telegram + web / solo web | Telegram = donde ya está la gente. Web = más control visual. Ambos = más laburo |
| **OCR** | Tesseract / EasyOCR / servicio cloud | Tesseract = gratis y suficiente. EasyOCR = mejor para español. Cloud = mejor calidad pero costo |
| **Deploy** | VPS (DO/Hetzner) / contenedores (Docker) / serverless | VPS + Docker es lo más razonable para el volumen |
| **Cron/scheduler** | cron del sistema / Celery / APScheduler | cron = simple. Celery = si necesitan colas y reintentos |

### Estimación de volumen de datos

| Fuente | Publicaciones/día | Páginas/día | Almacenamiento/mes |
|--------|-------------------|-------------|---------------------|
| BORA | 50-200 | 100-500 | ~500 MB texto |
| BO Neuquén | 5-20 | 10-50 | ~50 MB |
| InfoLeg (bulk) | N/A (mensual) | N/A | ~2 GB total histórico |
| Presupuesto | N/A (trimestral) | N/A | ~100 MB |
| **Total estimado** | | | **~1 GB/mes nuevo + 2 GB histórico** |

Con pgvector los embeddings agregan ~30% al almacenamiento de texto. Un VPS con 50 GB de disco es más que suficiente para años de operación.

## Stack técnico

| Componente | Tecnología |
|------------|------------|
| Lenguaje | Python |
| Scraping | Scrapy / BeautifulSoup |
| Extracción de texto | PyMuPDF + Tesseract (OCR) |
| Embeddings | text-embedding-3-small (OpenAI) o nomic-embed-text (open source) |
| Vector store | PostgreSQL + pgvector |
| LLM | Claude Haiku / GPT-4o-mini / Llama 3 local |
| Alertas | Telegram Bot API |
| Chat | Bot de Telegram + web (Chainlit o Streamlit) |
| Diario/feed | FastAPI + Jinja o SvelteKit |
| Base de datos | PostgreSQL |
| Deploy | VPS (DigitalOcean / Hetzner) |

### Costos operativos estimados

| Componente | USD/mes |
|------------|---------|
| Servidor VPS | 5-15 |
| LLM API | 5-20 |
| Telegram Bot | 0 |
| PostgreSQL | incluido en VPS |
| **Total** | **10-35** |

## Antecedentes y proyectos de referencia

| Proyecto | País | Qué hace | Relación con nuestra propuesta |
|----------|------|----------|-------------------------------|
| Querido Diário | Brasil | Scrapea diarios oficiales municipales, 200K+ docs indexados | Hace la ingesta pero no tiene IA, alertas ni chat |
| Serenata de Amor / Rosie | Brasil | IA que audita gastos de diputados, 8.000+ irregularidades detectadas | Demostró que IA + datos públicos + transparencia funciona |
| Jugalbandi / OpenNyAI | India | Chatbot WhatsApp que explica 171 programas de gobierno en 10 idiomas | Mismo concepto: hacer accesible info gubernamental via chat |
| BudgIT + Bimi | Nigeria | Monitoreo presupuestario + chatbot IA | Alertas + chat sobre presupuesto, 1.500 líderes comunitarios |
| TheyWorkForYou | UK | Alertas sobre actividad parlamentaria por email | Sistema de alertas por tópicos |
| OpenFisca | Francia + otros | Simulador de impacto de leyes | Inspiración para fase avanzada |

## Qué lo hace distinto

1. **No existe para boletines oficiales**: Querido Diário scrapea pero no tiene IA ni alertas. No hay nada equivalente en Argentina ni en español.
2. **No es un chatbot genérico**: ChatGPT no scrapea el boletín oficial, no tiene memoria de qué cambió, no te manda alertas proactivas.
3. **Genera un bien público**: convierte PDFs hostiles en datos estructurados y abiertos.
4. **Es modular y replicable**: arranca con un boletín, se expande a todos. Arranca en Argentina, sirve para cualquier país con gacetas oficiales.
5. **El "diff legal"**: no solo muestra qué se publicó sino qué cambió y qué significa.

## Quiénes somos

**Cooperativa de Trabajo Lawal Ltda.** -- cooperativa de tecnología con base en Villa La Angostura, Patagonia argentina. Parte de FACTTIC (Federación Argentina de Cooperativas de Trabajo de Tecnología, Innovación y Conocimiento). COMPLETAR!!

[TODO: completar con integrantes, perfiles técnicos, experiencia relevante]

## Por qué nosotros

- Somos del territorio
- Participamos en organizaciones locales (Biblioteca Popular Osvaldo Bayer, FACTTIC, La Correntosa)
- Open source por convicción
- Capacidad técnica para ejecutar: Python, IA, scraping, desarrollo web


## Presupuesto estimado (USD 50.000 / 12 meses)

| Rubro | USD |
|-------|-----|
| Desarrollo (equipo Lawal) | 35.000 |
| Infraestructura (servidores, APIs) | 3.000 |
| Testeo y trabajo con comunidades | 5.000 |
| xxxxxxxxxxxxxxxx | 4.000 |
| Contingencia | 3.000 |
| **Total** | **50.000** |

## Links relevantes

- Convocatoria: https://www.mozillafoundation.org/en/what-we-do/grantmaking/incubator/democracy-ai-cohort/
- Querido Diário: https://queridodiario.ok.org.br/
- Serenata de Amor: https://serenata.ai/
- OpenFisca: https://openfisca.org/
- Investigación Patagonia en Llamas: [link al sitio cuando esté publicado]

## TODO antes del 16 de marzo

- [ ] Definir nombre del proyecto
- [ ] Definir proyecto
- [ ] DEfinir arquitectura propuesta del mvp
- [ ] Encarar MVP
- [ ] Completar perfiles del equipo
- [ ] Revisar formulario de propuesta inicial (qué piden exactamente)
- [ ] Traducir propuesta al inglés
