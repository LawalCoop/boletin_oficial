# entrelinias

## Project Overview

A civic tech portal that democratizes access to Argentina's Official Gazette (Boletín Oficial) using AI to transform legal documents into accessible news for citizens.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **AI:** Google Gemini (document processing) + Groq/Llama 3.3 70B (chat)
- **Database:** PostgreSQL via Prisma
- **Auth:** NextAuth.js (Google OAuth) + custom admin auth

## Run Locally

```bash
# 1. Start Postgres
docker run --name boletin-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
docker exec boletin-db psql -U postgres -c "CREATE DATABASE boletin;"

# 2. Setup environment
cp .env.example .env
# Edit .env with your values (see .env.example for details)

# 3. Initialize database
npm install
npx prisma db push

# 4. Run dev server
npm run dev
```

Portal at http://localhost:3000. Admin panel at http://localhost:3000/admin.

## Dev Logs

Next.js dev server logs are written to `dev.log` (via `npm run dev`). Read this file to diagnose runtime errors, API issues, or build warnings.

## Key Directories

```
app/                    # Next.js pages and API routes
├── api/admin/trigger/  # Pipeline trigger endpoint (needs auth)
├── api/chat/           # Article chat endpoint (needs GROQ_API_KEY)
├── api/noticias/       # News feed endpoints
├── admin/              # Admin panel (needs ADMIN_* env vars)
└── articulo/[slug]/    # Article detail pages

lib/scraper/            # Ingestion pipeline
├── pipeline.ts         # Orchestrates scrape → AI → save
├── bora-client.ts      # Fetches from Official Gazette
├── bora-parser.ts      # Parses HTML with Cheerio
├── ai-processor.ts     # Calls Gemini for content transformation
└── json-writer.ts      # Saves to /data/ directory

data/                   # Article storage (JSON files)
├── articulos/          # Full article content
└── noticias/           # Daily news indices

prisma/schema.prisma    # Database schema (User, Vote, Subscription, SavedArticle)
```

## Required Environment Variables

| Variable | Required For |
|----------|--------------|
| `POSTGRES_PRISMA_URL` | Database (user features, votes) |
| `ADMIN_USERNAME/PASSWORD/SESSION_SECRET` | Admin panel access |
| `NEXTAUTH_SECRET` | User authentication |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Pipeline AI processing |
| `GROQ_API_KEY` | Article chat |

See `.env.example` for full list with instructions.

## Documentation

- `README.md` - Project overview and quick start
- `docs/setup.md` - Full setup guide, env vars, troubleshooting
- `docs/roadmap.md` - Feature roadmap (working / next / later)
- `docs/METODOLOGIA.md` - Editorial methodology and AI prompting guidelines
- `docs/documentation_index.md` - Documentation index and maintenance checklist

## Important Notes

- Articles are stored as JSON files in `/data/`, not in the database
- Database is only used for: users, votes, subscriptions, saved articles
- Admin panel has auth issues in dev branch - needs layout + API auth check
- Pipeline is rate-limited to 5 docs per run (Gemini free tier)
