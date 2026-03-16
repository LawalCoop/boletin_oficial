# Mozilla Democracy x AI Proposal -- Cooperativa Lawal

## Working Name

**Boletin Abierto** (provisional name, to be defined)

## What It Is

An open source tool that uses AI to read official government bulletins, understand what changes, and alert communities about what matters to them, in plain language.

## The Problem

In Argentina (and across Latin America), governments publish decrees, resolutions, ordinances, and laws in official bulletins. These documents:

- Are in hostile PDFs, often scanned
- Use inaccessible legal jargon
- Are published on scattered websites (national, provincial, municipal) with no interconnection
- Offer no way to subscribe to specific topics
- No one can read everything published each day
- There is no accessible record of what changed compared to the previous version of a regulation

The result: communities learn too late (or never) about decisions that directly affect their territory, rights, and resources. The only ones who read the official bulletin every day are law firms and companies with the resources to do so.

### Concrete Case: Patagonia and the Forest Fires

In Argentine Patagonia, between 2023 and 2026, the national government:

- Repealed the Land Law that restricted foreign land purchases (DNU 70/2023)
- Dissolved the environmental forest protection fund (Decree 888/2024)
- Reduced fire prevention budget execution from 96% to ~0%
- Let firefighter contracts expire (Dec 30, 2024) -- massive fires began days later
- Announced plans to eliminate the 30-60 year ban on land use change after fires (January 2026)

All of this was published in the Official Bulletin. Affected communities found out through the news, weeks or months later, when they could no longer act. If they had had a system that notified them the day each decree was published, with an explanation of what it meant for their territory, the response might have been different.

There are documented cases linking fires to real estate speculation.


## What We're Building

### 1. Ingestion and Processing Engine

A system that every day:

- Scrapes official bulletins (national, provincial, municipal)
- Extracts text from PDFs (including OCR for scanned documents)
- Classifies each publication by topic using AI
- Generates summaries in accessible language
- Detects what changed compared to previous regulations ("legal diff")
- Stores everything in a structured, searchable database ??

### 2. Topic-Based Alert System

Users (individuals or organizations) choose topics of interest:
- Land and territory
- Forests and environment
- Water and water resources
- Budget and public works
- Education
- Mining and extractivism
- Indigenous peoples' rights
- (any other)

When something relevant is published, they receive an alert via Telegram (and WhatsApp in a second phase) that includes:
- What was published
- What it means in plain language
- What changed compared to the previous version
- Who it affects
- Link to the original source

### 3. RAG Chat (Retrieval-Augmented Generation)

A chat where you can ask in natural language:
- "What was published this week about land in Neuquen?"
- "What does the VLA ordinance say about building permits in forest zones?"
- "How has the Fire Management Law changed since 2020?"
- "What's the difference between what was approved today and what it said before?"

Each response cites the exact source (bulletin, date, regulation number).

### 4. News Feed

Public daily feed with summaries of what was published, filterable by:
- Jurisdiction (national, provincial, municipal)
- Topic
- Date
- Type of regulation (law, decree, resolution, ordinance)


### 5. Advanced Features (Later Phases)

- **Cumulative memory**: timelines of how a regulation has changed over time ??
- **Open data**: processed bulletins published as a structured dataset (a public good in itself)
- **Cross-jurisdiction comparison**: detect contradictions between levels of government
- **Impact simulator**: model what would happen if a regulation is modified (inspired by OpenFisca)

## Technical Survey: Data Sources

### Official Bulletin of the Argentine Republic (BORA)

- **URL**: https://www.boletinoficial.gob.ar/
- **Structure**: 3 sections (first: legislation and official notices; second: companies; third: contracts)
- **Format**: Rendered HTML + downloadable PDFs
- **Frequency**: daily (business days)
- **Estimated volume**: ~50-200 publications per day
- **Scraping**: feasible, there are 2 existing open source scrapers on GitHub:
  - `tommanzur/scraper_boletin_oficial` (Python + BeautifulSoup)
  - `dedio/bora-scraper` (Python + Scrapy)
- **Complement**: InfoLeg (datos.gob.ar) has monthly bulk download in CSV/ZIP of all national regulations since 1997, structured format with metadata

### Official Bulletin of Neuquen

- **URL**: https://boletinoficial.neuquen.gob.ar/ (to verify)
- **Format**: likely PDF (like most provinces)
- **Scraping**: to be assessed -- provinces vary widely in accessibility
- **Priority**: high (it's our initial jurisdiction)
- [TODO: assess structure, format, frequency, and scraping feasibility]

### Municipal Bulletins (VLA and others)

- **Status**: many Patagonian municipalities don't have a digital bulletin
- **Alternative**: ordinances and resolutions published on municipal websites, sometimes on social media
- **Priority**: phase 2
- [TODO: assess what the municipality of VLA publishes digitally]

### InfoLeg (National Regulatory Database)

- **URL**: https://datos.gob.ar/dataset/justicia-base-infoleg-normativa-nacional
- **Format**: CSV within ZIP, monthly updates
- **Content**: all laws, decrees, resolutions, and provisions since May 1997
- **Fields**: type of regulation, number, date, title, text, status (active/repealed), modified/modifying regulations
- **Key value**: allows building the modification graph (which regulation modifies which), essential for the "legal diff"
- **No authentication required**

### Open Budget Argentina

- **URL**: https://www.presupuestoabierto.gob.ar/
- **REST API**: yes (POST), with free token
- **Endpoints**: credit, revenue, physical execution, cross-cutting analysis
- **Bulk download**: CSV available on datos.gob.ar
- **Key value**: budget execution by program (how much was allocated vs. how much was spent)
- **License**: Creative Commons 4.0

### Datos.gob.ar (National Open Data Portal)

- **URL**: https://www.datos.gob.ar/
- **Content**: 500+ datasets from 19 organizations
- **Relevant**: regulations (InfoLeg), budget, rural land (partial post-DNU), cadastres
- **Format**: CKAN, free download

## Detailed Technical Description - THIS NEEDS TO BE REDONE OR FULLY REVIEWED!!!

### Data Pipeline (Daily Ingestion)

```
+---------------------------------------------------------+
|                    DATA SOURCES                          |
|  BORA  |  BO Neuquen  |  InfoLeg  |  Budget  |   ...   |
+----+--------+------------+-----------+-----------------+
     |        |            |           |
     v        v            v           v
+---------------------------------------------------------+
|              INGESTION LAYER (Scrapers)                  |
|                                                          |
|  Scrapy/BS4       PyMuPDF        Bulk CSV               |
|  (HTML->text)     (PDF->text)    (direct download)      |
|                   Tesseract                              |
|                   (scanned PDF->text via OCR)            |
+--------------------------+------------------------------+
                           |
                           v
+---------------------------------------------------------+
|              PROCESSING LAYER (AI)                       |
|                                                          |
|  1. Text cleaning and normalization                      |
|  2. Chunking by article/section                          |
|  3. Topic classification (LLM)                           |
|     -> land, forests, water, budget, etc.                |
|  4. Entity extraction (NER)                              |
|     -> agencies, jurisdictions, amounts, deadlines       |
|  5. Modified regulation detection (regex + LLM)          |
|     -> "article 22 of Law 26,815 is hereby modified"    |
|  6. Plain language summary generation (LLM)              |
|  7. Legal diff: comparison with previous version (LLM)   |
|  8. Embedding generation for RAG                         |
|                                                          |
+--------------------------+------------------------------+
                           |
                           v
+---------------------------------------------------------+
|              STORAGE LAYER                               |
|                                                          |
|  PostgreSQL                                              |
|  +-- publications (metadata, text, summary, topics)      |
|  +-- regulations (modification graph between norms)      |
|  +-- users (topics of interest, notification channel)    |
|  +-- sent_alerts (log)                                   |
|  +-- embeddings (pgvector)                               |
|                                                          |
+--------+--------------+--------------+-----------------+
         |              |              |
         v              v              v
+--------------+ +-------------+ +------------------+
|    ALERTS    | |    CHAT     | |  NEWS FEED       |
|              | |             | |                   |
|  Telegram    | |  RAG:       | |  Web (FastAPI or  |
|  Bot that    | |  question ->| |  SvelteKit)       |
|  sends by    | |  pgvector   | |                   |
|  topic       | |  search ->  | |  Daily summaries  |
|  when there  | |  context -> | |  by jurisdiction  |
|  is a match  | |  LLM ->     | |  and topic        |
|              | |  response   | |                   |
|  WhatsApp    | |  with       | |  RSS feed         |
|  (phase 2)   | |  citations  | |                   |
|              | |             | |  Public API       |
|              | |  Interfaces:| |  (open data)      |
|              | |  - Telegram | |                   |
|              | |  - Web chat | |                   |
+--------------+ +-------------+ +------------------+
```

### AI Processing Details

#### Topic Classification

Each publication is classified into one or more topics using an LLM with a structured prompt. Initial topic taxonomy:

| Topic | Includes |
|-------|----------|
| Land and territory | Property, cadastre, public land, foreign ownership, zoning |
| Forests and environment | Forest law, protected areas, fire management, COFEMA |
| Water and water resources | Concessions, quality, watersheds, irrigation, EPAS |
| Budget and finance | Allocations, execution, transfers, trust funds |
| Public works | Tenders, awards, infrastructure |
| Mining and extractivism | Exploration permits, concessions, EIA, hydrocarbons |
| Indigenous rights | Communities, territorial survey, legal status |
| Education | Appointments, programs, school infrastructure |
| Health | Programs, emergencies, authorizations |
| Labor and employment | Agreements, wages, registries |
| Security | Forces, emergencies, protocols |

The taxonomy is extensible: users can propose new topics.

#### Legal Diff (Comparison with Previous Version)

When a publication modifies an existing regulation:

1. The reference is detected ("article X of Law N is hereby modified") via regex + NER
2. The previous version of that regulation is searched in the database (via InfoLeg or previous publications)
3. The LLM is asked to compare both versions and generate:
   - What it said before
   - What it says now
   - What the change means in plain language
   - Who it affects

Output example:
```
BEFORE: Law 26,815 art. 22bis prohibited land use change
in burned areas for 60 years (native forest) or 30 years (grasslands).

NOW: Decree XXX/2026 eliminates this prohibition.

WHAT IT MEANS: Land that burned can now be sold
and used for real estate developments with no waiting period.
This directly affects the 3,800 ha burned in Confluencia (2025)
and the 1,800 ha in El Hoyo (2026).

SOURCE: Official Bulletin No. XXXX, 03/15/2026, First Section.
```

#### RAG (Retrieval-Augmented Generation)

User query flow:

1. **Question**: "What changed about land in Neuquen this month?"
2. **Embedding**: an embedding of the question is generated
3. **Search**: the most relevant chunks are searched in pgvector, filtered by:
   - Topic: land and territory
   - Jurisdiction: Neuquen (national + provincial)
   - Date: last month
4. **Context**: relevant chunks are assembled as context for the LLM
5. **Response**: the LLM generates a response citing each source:
   - Bulletin number, date, section
   - Regulation number (law, decree, resolution)
   - Direct link to the original document
6. **Validation**: if there are no relevant results, the system says so explicitly (no fabrication)

#### Alert Generation

Automated daily flow:

1. Scrapers run (cron, ~6 AM)
2. New publications are processed (classification, summary, diff)
3. For each processed publication, users subscribed to those topics are found
4. A personalized alert is generated per user:
   - If they have 1-3 relevant publications: one alert per publication
   - If they have more: a daily summary grouped by topic
5. Sent via Telegram Bot API
6. Logged in the database (to avoid repeats)

### Data Model (PostgreSQL)

```sql
-- Scraped and processed publications
publications (
    id,
    source,              -- 'bora', 'bo_neuquen', 'infoleg', etc.
    section,             -- 'first', 'second', 'third'
    publication_date,
    title,
    full_text,
    clean_text,          -- post-processing
    summary,             -- generated by LLM
    regulation_type,     -- 'law', 'decree', 'resolution', 'ordinance'
    regulation_number,
    issuing_agency,
    jurisdiction,        -- 'national', 'neuquen', 'vla', etc.
    original_url,
    pdf_url,
    created_at
)

-- Topic classification (many to many)
publication_topics (
    publication_id,
    topic,               -- 'land', 'forests', 'water', etc.
    relevance            -- 0.0 to 1.0 (classification confidence)
)

-- Modification graph between regulations
modifications (
    new_publication_id,      -- the one that modifies
    modified_regulation,     -- "Law 26,815 art. 22bis"
    change_type,             -- 'modifies', 'repeals', 'replaces', 'adds'
    previous_text,
    new_text,
    simple_diff              -- plain language explanation (LLM)
)

-- Embeddings for RAG
chunks (
    id,
    publication_id,
    chunk_text,
    embedding,               -- vector (pgvector)
    metadata                 -- jsonb (topics, jurisdiction, date)
)

-- Users and subscriptions
users (
    id,
    telegram_chat_id,
    name,
    organization,           -- optional
    jurisdictions,          -- array: ['national', 'neuquen']
    created_at
)

-- Topics of interest per user
subscriptions (
    user_id,
    topic,
    active
)

-- Sent alerts log
alerts (
    id,
    user_id,
    publication_id,
    alert_text,
    sent_at,
    channel                 -- 'telegram', 'whatsapp'
)
```

### Technical Decisions to Define with the Team

| Decision | Options | Trade-offs |
|----------|---------|------------|
| **LLM** | Claude Haiku / GPT-4o-mini / Llama 3 local | API = simpler but dependency + cost. Local = zero cost but more server and maintenance |
| **Embeddings** | text-embedding-3-small (OpenAI) / nomic-embed-text (local) | Same API vs local trade-off. For Spanish, evaluate quality |
| **Vector store** | pgvector (integrated in PG) / ChromaDB / Qdrant | pgvector = less infra, single DB. Chroma/Qdrant = more features but another service |
| **Web interface** | FastAPI + Jinja / SvelteKit / Streamlit | FastAPI = simple. SvelteKit = team already knows it but more work. Streamlit = quick prototype |
| **Chat** | Telegram bot only / Telegram + web / web only | Telegram = where people already are. Web = more visual control. Both = more work |
| **OCR** | Tesseract / EasyOCR / cloud service | Tesseract = free and sufficient. EasyOCR = better for Spanish. Cloud = better quality but cost |
| **Deploy** | VPS (DO/Hetzner) / containers (Docker) / serverless | VPS + Docker is the most reasonable for the volume |
| **Cron/scheduler** | system cron / Celery / APScheduler | cron = simple. Celery = if queues and retries are needed |

### Data Volume Estimate

| Source | Publications/day | Pages/day | Storage/month |
|--------|-----------------|-----------|---------------|
| BORA | 50-200 | 100-500 | ~500 MB text |
| BO Neuquen | 5-20 | 10-50 | ~50 MB |
| InfoLeg (bulk) | N/A (monthly) | N/A | ~2 GB total historical |
| Budget | N/A (quarterly) | N/A | ~100 MB |
| **Estimated total** | | | **~1 GB/month new + 2 GB historical** |

With pgvector, embeddings add ~30% to text storage. A VPS with 50 GB of disk is more than enough for years of operation.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Language | Python |
| Scraping | Scrapy / BeautifulSoup |
| Text extraction | PyMuPDF + Tesseract (OCR) |
| Embeddings | text-embedding-3-small (OpenAI) or nomic-embed-text (open source) |
| Vector store | PostgreSQL + pgvector |
| LLM | Claude Haiku / GPT-4o-mini / Llama 3 local |
| Alerts | Telegram Bot API |
| Chat | Telegram bot + web (Chainlit or Streamlit) |
| News feed | FastAPI + Jinja or SvelteKit |
| Database | PostgreSQL |
| Deploy | VPS (DigitalOcean / Hetzner) |

### Estimated Operating Costs

| Component | USD/month |
|-----------|-----------|
| VPS server | 5-15 |
| LLM API | 5-20 |
| Telegram Bot | 0 |
| PostgreSQL | included in VPS |
| **Total** | **10-35** |

## Background and Reference Projects

| Project | Country | What it does | Relation to our proposal |
|---------|---------|-------------|--------------------------|
| Querido Diario | Brazil | Scrapes municipal official bulletins, 200K+ docs indexed | Does the ingestion but has no AI, alerts, or chat |
| Serenata de Amor / Rosie | Brazil | AI that audits congress member expenses, 8,000+ irregularities detected | Proved that AI + public data + transparency works |
| Jugalbandi / OpenNyAI | India | WhatsApp chatbot that explains 171 government programs in 10 languages | Same concept: making government info accessible via chat |
| BudgIT + Bimi | Nigeria | Budget monitoring + AI chatbot | Alerts + chat about budget, 1,500 community leaders |
| TheyWorkForYou | UK | Alerts about parliamentary activity by email | Topic-based alert system |
| OpenFisca | France + others | Law impact simulator | Inspiration for advanced phase |

## What Makes It Different

1. **Nothing exists for official bulletins**: Querido Diario scrapes but has no AI or alerts. There is nothing equivalent in Argentina or in Spanish.
2. **It's not a generic chatbot**: ChatGPT doesn't scrape the official bulletin, has no memory of what changed, doesn't send proactive alerts.
3. **It generates a public good**: converts hostile PDFs into structured, open data.
4. **It's modular and replicable**: starts with one bulletin, expands to all. Starts in Argentina, works for any country with official gazettes.
5. **The "legal diff"**: doesn't just show what was published but what changed and what it means.

## Who We Are

**Cooperativa de Trabajo Lawal Ltda.** -- technology cooperative based in Villa La Angostura, Argentine Patagonia. Part of FACTTIC (Argentine Federation of Technology, Innovation, and Knowledge Worker Cooperatives). TO BE COMPLETED!!

[TODO: complete with team members, technical profiles, relevant experience]

## Why Us

- We are from the territory
- We participate in local organizations (Biblioteca Popular Osvaldo Bayer, FACTTIC, La Correntosa)
- Open source by conviction
- Technical capacity to execute: Python, AI, scraping, web development


## Estimated Budget (USD 50,000 / 12 months)

| Category | USD |
|----------|-----|
| Development (Lawal team) | 35,000 |
| Infrastructure (servers, APIs) | 3,000 |
| Testing and community engagement | 5,000 |
| xxxxxxxxxxxxxxxx | 4,000 |
| Contingency | 3,000 |
| **Total** | **50,000** |

## Relevant Links

- Call for proposals: https://www.mozillafoundation.org/en/what-we-do/grantmaking/incubator/democracy-ai-cohort/
- Querido Diario: https://queridodiario.ok.org.br/
- Serenata de Amor: https://serenata.ai/
- OpenFisca: https://openfisca.org/
- Patagonia en Llamas Investigation: [link to site when published]

## TODO before March 16

- [ ] Define project name
- [ ] Define the project
- [ ] Define proposed MVP architecture
- [ ] Build MVP
- [ ] Complete team profiles
- [ ] Review initial proposal form (what exactly they ask for)
- [ ] Translate proposal to English
