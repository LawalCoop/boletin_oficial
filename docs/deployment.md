# Deployment

The app is deployed on [Vercel](https://vercel.com) using the Vercel CLI.

## Vercel Account

- **Google account:** ai@lawal.com.ar
- **Vercel scope:** ai-3016s-projects
- **Production URL:** https://boletin-oficial-murex.vercel.app

## Prerequisites

Install the Vercel CLI globally:

```bash
npm i -g vercel
```

## First-Time Setup

### 1. Log in

```bash
vercel login
```

Select "Continue with Google" and authenticate with the ai@lawal.com.ar account.

### 2. Link the project

```bash
vercel link
```

When prompted:
- **Set up?** → Yes
- **Which scope?** → ai-3016s-projects

This creates a `.vercel/` directory locally linking to the Vercel project.

### 3. Configure environment variables

Set the required env vars in Vercel. You can do this via the [Vercel dashboard](https://vercel.com) (Settings → Environment Variables) or the CLI:

```bash
vercel env add POSTGRES_PRISMA_URL
vercel env add POSTGRES_URL_NON_POOLING
vercel env add AUTH_SECRET
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add GOOGLE_GENERATIVE_AI_API_KEY
vercel env add GROQ_API_KEY
vercel env add NEXTAUTH_URL
```

Each command will prompt you for the value and which environments to apply it to (Production, Preview, Development).

See `.env.example` for descriptions and where to obtain each value.

## Deploying

### Preview deployment

```bash
vercel
```

Creates a unique preview URL for testing before going to production.

### Production deployment

```bash
vercel --prod
```

Deploys to the production URL.

## Notes

- The `.vercel/` directory is gitignored and local to each machine. Each developer needs to run `vercel link` on their own.
- Environment variables only need to be configured once in Vercel — they persist across deployments.
- Google OAuth redirect URIs must be updated in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) to include the production URL: `https://boletin-oficial-murex.vercel.app/api/auth/callback/google`.
