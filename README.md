<h1 align="center">entrelín[IA]s</h1>

<p align="center"><strong>Reading between the lines of the law — with AI.</strong></p>

<p align="center">
Every day, Argentina's government publishes dozens of decrees, resolutions, and regulations in its Official Gazette. They're public by law — but written in legal jargon that makes them invisible to the people they affect most.<br><br>
entrelín[IA]s uses AI to turn that wall of legalese into a news feed anyone can read, understand, and act on.
</p>

<p align="center">
  <a href="https://lawal.coop"><img src="public/images/lawal-logo.png" alt="Cooperativa Lawal" height="40"></a>
</p>

<p align="center">
Built by <a href="https://lawal.coop"><strong>Cooperativa Lawal</strong></a>, a worker-owned technology cooperative from Patagonia, Argentina.<br>
</p>

---

## The problem

Access to the law shouldn't require a law degree.

In Argentina, every decree, resolution, and regulation is published in the [Boletin Oficial](https://www.boletinoficial.gob.ar/) — 50 to 200+ documents every business day. These documents shape people's rights, land, water, budgets, and livelihoods. But they're written in dense legal language, buried in hostile formats, and scattered across jurisdictions with no way to search, filter, or subscribe.

The result is a **structural asymmetry of information**: the only ones reading the gazette daily are corporate law firms and lobbyists. Communities, grassroots organizations, journalists, and citizens find out about decisions that affect them weeks or months later — through the news, if at all.

This isn't a technology problem. It's a **democracy problem**.

---

## What it does

entrelín[IA]s **democratizes access** to government decisions by transforming legal documents into civic knowledge:

- **Reads** Argentina's Official Gazette daily — all 4 sections, every document
- **Translates** legal jargon into plain language using AI — clear headlines, accessible summaries, key takeaways, and who is affected
- **Classifies** each document by topic (energy, health, labor, environment, land, education — 21 categories) so communities can follow what matters to them
- **Publishes** everything as an open, searchable news portal — filterable by category, topic, and date
- **Preserves** the original legal text and always links back to the official source — transparency over convenience
- **Enables dialogue** through a contextual AI chat where anyone can ask questions about any document in natural language

> entrelín[IA]s doesn't replace the source. It adds a layer of civic understanding on top — so the law stops being a wall and becomes a window.

---

## Screenshots

<!-- TODO: add portal screenshots -->

---

## About Cooperativa Lawal

**Cooperativa de Trabajo Lawal Ltda.** is a worker-owned technology cooperative based in Villa La Angostura, in the Andean Patagonia region of Argentina. We are members of [FACTTIC](https://facttic.org.ar/) (Argentine Federation of Technology, Innovation, and Knowledge Worker Cooperatives), a network of 40+ tech cooperatives building technology for the commons.

We build tools for social impact — not for profit extraction. Our cooperative model means:

- **No shareholders, no investors.** Every member has an equal voice.
- **Rooted in territory.** We live in the communities this tool serves. The fires that motivated this project burned our neighbors' forests.
- **Open source by conviction.** We believe civic infrastructure should be a public good.
- **Part of a network.** Through FACTTIC and local organizations like [Biblioteca Popular Osvaldo Bayer](https://www.instagram.com/bibliobayer/) and Asociación Mutual La Correntosa, we are woven into the civic fabric of Patagonia.

---

## Current status

This is a **working MVP** — a functional prototype demonstrating the full concept end-to-end with real data from Argentina's Official Gazette.

### What works today

| Capability | Status |
|------------|--------|
| Gazette ingestion (BORA — all 4 sections) | Working |
| AI-powered document transformation (Google Gemini) | Working |
| Civic news portal with daily feed | Working |
| Filtering by jurisdiction, topic, and date | Working |
| Full article view: summary, key points, affected groups, original text | Working |
| Contextual AI chat — ask questions about any document | Working |
| Admin panel for pipeline management | Working |
| Mobile-first responsive design | Working |
| 36 real gazette articles processed and published | Available |

### Roadmap

| Next step | Why it matters |
|-----------|----------------|
| **Topic-based alerts** (Telegram / WhatsApp) | Meet communities where they already are — proactive, not passive |
| **User accounts and subscriptions** | Let organizations follow the topics that affect them |
| **Automated daily ingestion** | From manual trigger to civic infrastructure that runs every morning |
| **"Legal diff"** — what changed vs. previous law | Show not just what was published, but what it undoes |
| **Provincial gazette scrapers** (starting with Neuquen) | Expand beyond federal — most land and environmental policy is provincial |
| **RAG-powered cross-document search** | "What changed about land rights this month?" — answers across documents |
| **Open data exports** | Publish structured gazette data as a public good |

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI | React 19 · TypeScript 5 · [Tailwind CSS 4](https://tailwindcss.com/) |
| AI | [Google Gemini](https://ai.google.dev/) via [Vercel AI SDK](https://sdk.vercel.ai/) |
| Scraping | [Cheerio](https://cheerio.js.org/) |
| Validation | [Zod](https://zod.dev/) |
| Storage | JSON files (database migration planned) |

---

## Run it locally

### Requirements

- Node.js 18+
- A Google Generative AI API key ([get one free](https://aistudio.google.com/apikey))

### Setup

```bash
git clone https://github.com/LawalCoop/boletin_oficial.git
cd boletin_oficial
npm install

cp .env.example .env.local
# Add your key: GOOGLE_GENERATIVE_AI_API_KEY=your-key-here

npm run dev
```

Open http://localhost:3000

> The repo includes 36 real articles already processed — you can explore the full portal without running the scraper.

---

## Project structure

```
entrelinias/
├── app/                    # Next.js App Router
│   ├── api/                # REST API (news, chat, admin trigger)
│   ├── articulo/[slug]/    # Article detail page
│   ├── tema/[tema]/        # Topic page
│   └── admin/              # Pipeline admin panel
├── components/
│   ├── article/            # Article view (summary, chat, impact, original text)
│   ├── feed/               # News feed (cards, date navigation)
│   ├── layout/             # Header, sidebar, mobile navigation
│   └── shared/             # Shared components
├── data/
│   ├── articulos/          # Processed articles (JSON)
│   └── noticias/           # Daily news indices (JSON)
├── docs/                   # Documentation, methodology, proposals
├── lib/
│   ├── constants.ts        # Topics, categories, utilities
│   ├── types.ts            # TypeScript definitions
│   └── scraper/            # Ingestion + AI processing pipeline
└── public/                 # Static assets
```

---
## License

Open source. License details to be added.

---

## Contact

**Cooperativa de Trabajo Lawal Ltda.**<br>
Villa La Angostura, Patagonia, Argentina<br>
Member of [FACTTIC](https://facttic.org.ar/)

---

<p align="center">
  <em>The law belongs to everyone. We're just making it readable.</em>
</p>
