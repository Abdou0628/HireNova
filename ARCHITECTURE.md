# HireNova — Project Architecture & Quick Reference
> Dernière mise à jour : 2025-07-25 | E-Society 2050

## Démarrage rapide

| Mode | Commande | RAM utilisée |
|------|----------|-------------|
| **Production** | `bash start-production.sh` | ~512 MB |
| **Développement** | `bash start-dev.sh` | ~2 GB (Turbopack) |

> ⚠️ En environnement sandbox (4 GB RAM), le serveur de production est recommandé.
> Caddy tourne sur le port 81 et proxy vers localhost:3000.

## Architecture du projet

```
src/
├── app/
│   ├── page.tsx                    # Route principale — routeur step-based avec next/dynamic
│   ├── layout.tsx                  # Layout racine (SessionProvider, Toaster, ThemeProvider)
│   ├── globals.css                 # Styles globaux Tailwind
│   └── api/
│       ├── auth/                   # NextAuth routes (register, login, reset, verify)
│       ├── jobs/                    # HireNova Jobs API
│       │   ├── route.ts            # GET /api/jobs (list + search)
│       │   ├── stats/route.ts      # GET /api/jobs/stats
│       │   └── [id]/
│       │       ├── route.ts        # GET /api/jobs/:id
│       │       └── apply/route.ts # POST /api/jobs/:id/apply
│       ├── employer/
│       │   └── dashboard/route.ts  # GET /api/employer/dashboard
│       ├── candidate/
│       │   └── applications/route.ts
│       ├── api-portal/
│       │   ├── register/route.ts   # POST inscription API
│       │   └── verify/route.ts     # POST vérification clé
│       ├── v1/
│       │   ├── cv/generate/route.ts   # POST génération CV (API)
│       │   ├── cl/generate/route.ts   # POST génération lettre (API)
│       │   ├── ats/analyze/route.ts   # POST analyse ATS (API)
│       │   └── usage/route.ts         # GET utilisation
│       ├── chatbot/route.ts        # POST chatbot IA
│       ├── generate-cv/            # POST génération CV (app)
│       ├── generate-cover-letter/  # POST génération CL (app)
│       ├── analyze-ats/            # POST analyse ATS (app)
│       ├── import-cv/              # POST import CV
│       ├── public-stats/           # GET stats publiques
│       ├── stats/                  # GET stats dashboard
│       ├── satisfaction/          # POST satisfaction
│       ├── checkout/               # POST LemonSqueezy checkout
│       ├── paymob/                 # POST Paymob checkout + webhook
│       ├── webhook/                # POST LemonSqueezy webhook
│       └── admin/                  # Admin config + security
│
├── components/
│   ├── cv/
│   │   ├── landing.tsx             # Page d'accueil principale (toutes sections)
│   │   ├── form.tsx                # Formulaire CV multi-étapes
│   │   ├── generating.tsx          # Écran de génération CV
│   │   ├── preview.tsx             # Aperçu + téléchargement CV
│   │   └── pdf-export.tsx          # Export PDF/Word
│   ├── cl/
│   │   ├── cover-letter-form.tsx
│   │   ├── cover-letter-generating.tsx
│   │   └── cover-letter-preview.tsx
│   ├── auth/
│   │   ├── auth-modal.tsx          # Modal login/register
│   │   └── profile-button.tsx      # Menu profil + rôle
│   ├── admin/
│   │   ├── admin-dashboard.tsx
│   │   └── security-alerts.tsx
│   ├── jobs/                       # HireNova Jobs (7 fichiers)
│   │   ├── job-market.tsx          # Marketplace offres d'emploi
│   │   ├── job-detail.tsx          # Détail d'une offre
│   │   ├── job-apply.tsx           # Formulaire de candidature
│   │   ├── employer-dashboard.tsx  # Dashboard recruteur
│   │   ├── employer-post-job.tsx   # Publication d'offre
│   │   └── candidate-applications.tsx
│   ├── api/                        # HireNova API Portal (3 fichiers)
│   │   ├── api-docs.tsx            # Documentation API
│   │   ├── api-register.tsx        # Inscription API
│   │   └── api-dashboard.tsx       # Dashboard API
│   ├── chatbot/
│   │   └── chatbot-widget.tsx      # Widget chat flottant
│   └── ui/                         # shadcn/ui components
│
├── store/
│   └── cv-store.ts                 # Zustand store — 16 steps
│
├── lib/
│   ├── db.ts                       # Prisma client (SQLite)
│   ├── auth.ts                     # NextAuth config
│   ├── i18n.ts                     # Traductions FR/EN/AR/ES
│   ├── api-auth.ts                 # Validation clés API
│   ├── rate-limit.ts               # Rate limiter mémoire
│   └── security.ts                 # Sécurité (XSS, SQLi)
│
└── middleware.ts                    # SUPPRIMÉ (causait OOM Edge Runtime)

prisma/
└── schema.prisma                   # User, JobListing, Application, ApiSubscriber, ApiUsageLog, etc.
```

## Store Steps (Zustand)

```ts
type AppStep =
  // Core CV
  | 'landing' | 'form' | 'generating' | 'preview'
  // Cover Letter
  | 'clForm' | 'clGenerating' | 'clPreview'
  // Jobs Marketplace
  | 'jobMarket' | 'jobDetail' | 'jobApply'
  | 'employerDashboard' | 'employerPostJob' | 'candidateApplications'
  // API Portal
  | 'apiDocs' | 'apiRegister' | 'apiDashboard'
```

## SDK Usage (Backend only — z-ai-web-dev-sdk)

```ts
import ZAI from 'z-ai-web-dev-sdk'  // DEFAULT import, not { ZAI }
const zai = ZAI.create()
const result = await zai.chat.completions.create({
  model: 'deepseek-chat',
  messages: [{ role: 'user', content: '...' }]
})
```

## Technologies

| Techno | Version | Usage |
|--------|---------|-------|
| Next.js | 16 | App Router + Turbopack |
| TypeScript | 5 | Typage strict |
| Tailwind CSS | 4 | Styles + shadcn/ui |
| Prisma | — | ORM SQLite |
| Zustand | — | State management client |
| NextAuth | v4 | Authentification |
| Framer Motion | — | Animations |
| z-ai-web-dev-sdk | — | LLM backend |

## Points critiques connus

1. **OOM en sandbox (4 GB)** : Le mode dev (Turbopack) consomme ~2 GB. Utiliser le mode production pour plus de stabilité.
2. **Middleware supprimé** : causait un doublon RAM via Edge Runtime. Headers déplacés dans `next.config.ts`.
3. **Processus instables** : Les processus background sont parfois nettoyés entre les appels bash dans le sandbox.
4. **Import ZAI** : Toujours `import ZAI from 'z-ai-web-dev-sdk'` (default), jamais `{ ZAI }` (named).
