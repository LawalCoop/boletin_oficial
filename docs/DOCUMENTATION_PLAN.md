# Documentation Plan

This document outlines the documentation structure and what each file should contain. **Update this when code changes affect documentation.**

---

## Documentation Structure

```
boletin_oficial/
├── README.md                      # Public-facing project overview
├── CLAUDE.md                      # AI assistant context
├── docs/
│   ├── DOCUMENTATION_PLAN.md      # This file - documentation roadmap
│   ├── METODOLOGIA.md             # Editorial methodology (existing)
│   ├── setup.md                   # Detailed setup guide (TODO)
│   ├── architecture.md            # System architecture (TODO)
│   ├── api.md                     # API reference (TODO)
│   └── proposals/
│       ├── mozilla-es.md          # Grant proposal (Spanish)
│       └── mozilla-en.md          # Grant proposal (English)
```

---

## File Descriptions & Key Points

### README.md
**Audience:** New developers, contributors, users
**Status:** ✅ Updated

Key sections:
- [ ] Project description (what it does, why it matters)
- [x] Requirements (Node, Docker, API keys)
- [x] Quick start (6 steps to run locally)
- [x] Admin panel access
- [ ] Screenshots
- [ ] Tech stack table
- [ ] Project structure
- [ ] Roadmap
- [ ] License
- [ ] Contact

---

### CLAUDE.md
**Audience:** AI assistants (Claude, Copilot, etc.)
**Status:** ✅ Updated

Key sections:
- [x] Project overview (1-2 sentences)
- [x] Tech stack
- [x] Run locally (copy-paste commands)
- [x] Dev logs location
- [x] Key directories with descriptions
- [x] Required environment variables table
- [x] Documentation links
- [x] Important notes / gotchas

**Update when:**
- New env vars added
- Directory structure changes
- New major features added
- Known issues change

---

### docs/METODOLOGIA.md
**Audience:** Content editors, AI prompt engineers
**Status:** ✅ Complete

Key sections:
- [x] Editorial vision and principles
- [x] Data structure (noticias + articulos JSON format)
- [x] Section mapping (Boletín sections → categories)
- [x] 22 temas (topics) with disambiguation guide
- [x] AI content generation guidelines
- [x] Image selection criteria
- [x] Processing flow
- [x] Quality metrics

**Update when:**
- New temas added
- AI prompts change
- JSON schema changes
- Editorial guidelines change

---

### docs/setup.md (TODO)
**Audience:** Developers setting up the project
**Status:** ❌ Not created

Key sections to include:
- [ ] Prerequisites (Node version, Docker, etc.)
- [ ] Local development setup (detailed)
- [ ] Database setup (Docker vs Vercel Postgres vs other)
- [ ] Environment variables (detailed explanation of each)
- [ ] Running the pipeline manually
- [ ] Running tests
- [ ] Common issues and troubleshooting
- [ ] Production deployment (Vercel)

---

### docs/architecture.md (TODO)
**Audience:** Developers understanding the system
**Status:** ❌ Not created

Key sections to include:
- [ ] System overview diagram
- [ ] Data flow (scrape → process → store → display)
- [ ] Database schema explanation
- [ ] Authentication flows (user OAuth + admin auth)
- [ ] API routes overview
- [ ] Pipeline architecture
- [ ] Frontend components structure
- [ ] Caching and performance
- [ ] Security considerations

---

### docs/api.md (TODO)
**Audience:** Developers integrating with the API
**Status:** ❌ Not created

Key sections to include:
- [ ] Authentication
- [ ] Public endpoints
  - [ ] GET /api/noticias
  - [ ] GET /api/noticias/fechas
  - [ ] GET /api/noticias/tema/[tema]
  - [ ] GET /api/buscar
  - [ ] GET /api/votes/[slug]
  - [ ] GET /api/votes/top
- [ ] Authenticated endpoints
  - [ ] POST /api/chat
  - [ ] GET/POST /api/user/saved/[slug]
  - [ ] GET/POST /api/user/votes/[slug]
  - [ ] GET/POST /api/user/subscriptions/[tema]
- [ ] Admin endpoints
  - [ ] POST /api/admin/login
  - [ ] POST /api/admin/trigger
  - [ ] POST /api/admin/logout
- [ ] Response formats
- [ ] Error codes

---

### docs/proposals/ (move existing)
**Audience:** Historical reference
**Status:** ⚠️ Need to move

Files to move:
- `docs/project-es.md` → `docs/proposals/mozilla-es.md`
- `docs/project-en.md` → `docs/proposals/mozilla-en.md`

These are grant proposals, not technical docs. Keep for historical reference.

---

## Documentation Maintenance Checklist

When making code changes, check if you need to update:

| Change Type | Update |
|-------------|--------|
| New env variable | `.env.example`, `CLAUDE.md`, `README.md`, `docs/setup.md` |
| New API endpoint | `docs/api.md`, `CLAUDE.md` |
| Database schema change | `docs/architecture.md`, `METODOLOGIA.md` (if JSON format) |
| New tema/category | `docs/METODOLOGIA.md` |
| Directory structure change | `CLAUDE.md`, `README.md` |
| New feature | `README.md` (roadmap), `CLAUDE.md` |
| Bug fix affecting setup | `README.md`, `docs/setup.md` |
| Security fix | `docs/architecture.md`, `CLAUDE.md` (important notes) |

---

## Priority TODO

1. ~~Update CLAUDE.md~~ ✅
2. ~~Update README.md setup section~~ ✅
3. Move proposals to subfolder
4. Create `docs/setup.md` (extract detailed setup from README)
5. Create `docs/architecture.md`
6. Create `docs/api.md`

---

*Last updated: 2026-03-24*
