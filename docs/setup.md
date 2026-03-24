# Setup

## Requirements

- Node.js 18+
- Docker (for PostgreSQL)
- Google Generative AI API key — https://aistudio.google.com/apikey (free)
- Groq API key — https://console.groq.com/keys (free)

## 1. Install

```bash
git clone https://github.com/LawalCoop/boletin_oficial.git
cd boletin_oficial
npm install
```

## 2. Database

```bash
docker run --name boletin-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
docker exec boletin-db psql -U postgres -c "CREATE DATABASE boletin;"
```

## 3. Environment

```bash
cp .env.example .env
```

Edit `.env`:

| Variable | Purpose | Default / Notes |
|----------|---------|-----------------|
| POSTGRES_PRISMA_URL | Database connection (pooled) | `postgresql://postgres:postgres@localhost:5432/boletin` |
| POSTGRES_URL_NON_POOLING | Database connection (direct) | Same as above for local |
| NEXTAUTH_URL | App base URL | `http://localhost:3000` |
| AUTH_SECRET | JWT encryption (Auth.js v5) | `openssl rand -base64 32` |
| GOOGLE_GENERATIVE_AI_API_KEY | Gemini — pipeline processing | Required for scraper |
| GROQ_API_KEY | Llama 3.3 70B — article chat | Required for chat |
| GOOGLE_CLIENT_ID | Google OAuth | For user login + admin access |
| GOOGLE_CLIENT_SECRET | Google OAuth | For user login + admin access |

### Google OAuth Credentials

Google OAuth is used for both user login and admin panel access. The admin panel (`/admin`) is restricted to specific admin accounts.

**Lawal team:**
1. Open Bitwarden vault (Lawal organization)
2. Find the note: `entrelinias auth cli`
3. Copy `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to your `.env`

**External contributors:**
1. Create your own OAuth credentials at https://console.cloud.google.com/apis/credentials
2. Add redirect URI: `http://localhost:3000/api/auth/callback/google`

## 4. Initialize database

```bash
npx prisma db push
```

## 5. Run

```bash
npm run dev
```

- Portal: http://localhost:3000
- Admin: http://localhost:3000/admin

The repo includes 50+ pre-processed articles — no API keys needed to browse.

## Without database

The portal works for browsing articles without Postgres. You will see `PrismaClientInitializationError` in logs for vote/user features — these are non-blocking.

## Troubleshooting

- `Can't reach database server at ...:5432` — Docker container not running. Check `docker ps` and start with `docker start boletin-db`.
- `MissingSecret` — Copy `.env.example` to `.env` and set `AUTH_SECRET`.
- Pipeline rate-limited — Gemini free tier allows ~5 docs per run. The admin panel respects this limit.
