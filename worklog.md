# HireNova — Worklog complet
> Projet : HireNova by E-Society 2050
> Dernière MAJ : 2025-07-25

---

## Phase 1 : Infrastructure de base
- Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui
- Prisma ORM (SQLite), NextAuth v4, Zustand, Framer Motion
- 4 langues (FR, EN, AR, ES), 3 templates CV, export PDF/Word
- Système de pricing (Gratuit/Pro/Annuel/Lifetime)
- Architecture step-based routing via Zustand store

## Phase 2 : Sécurité
- Rate limiting (in-memory sliding-window)
- Détection XSS + SQL injection
- Headers de sécurité dans next.config.ts (middleware supprimé pour cause OOM)
- Admin dashboard + security alerts panel

## Phase 3 : API & Payment
- LemonSqueezy checkout + webhook
- Paymob checkout + webhook (Maroc/Afrique)
- Public stats API avec cache 30s
- Satisfaction rating system

## Phase 4 : HireNova Jobs Marketplace
- **Backend** : 5 routes API (jobs CRUD, stats, apply, employer dashboard, candidate applications)
- **Frontend** : 6 composants (market, detail, apply, employer dashboard, post job, candidate applications)
- **DB** : Modèles Prisma (JobListing, Application)
- Fonctionnalités : recherche, filtres, pagination, candidature IA, match scoring

## Phase 5 : HireNova API Portal
- **Backend** : 4 routes API (cv/generate, cl/generate, ats/analyze, usage)
- **Frontend** : 3 composants (docs, register, dashboard)
- **DB** : Modèles Prisma (ApiSubscriber, ApiUsageLog)
- Authentification par clé API, quotas, usage tracking

## Phase 6 : Chatbot IA
- **Backend** : 1 route API (chatbot)
- **Frontend** : 1 composant widget flottant (bottom-right)
- Réponses IA via z-ai-web-dev-sdk (deepseek-chat)

## Phase 7 : Corrections critiques (session actuelle)
- **Problème** : page.tsx manquait les mappings des nouveaux steps → boutons invisibles
- **Solution** : Ajouté 16 imports dynamiques next/dynamic + rendu step-based complet
- **5 fixes SDK** : `{ ZAI }` → `ZAI` (default import)
- **1 fix webhook** : signatureCheck LemonSqueezy remplacée par crypto.createHmac
- **Résultat** : 28 boutons interactifs confirmés, tous les éléments visibles

---

## État actuel — Tout fonctionnel ✅

| Fonctionnalité | Status | Boutons/UI |
|---------------|--------|------------|
| Génération CV IA | ✅ | Créer mon CV |
| Lettre de motivation IA | ✅ | Créer ma lettre |
| Score ATS | ✅ | Intégré dans preview |
| HireNova Jobs | ✅ | Voir offres + Publier offre |
| HireNova API | ✅ | Documentation API + Obtenir clé |
| Chatbot IA | ✅ | Widget flottant bottom-right |
| Auth (Login/Register) | ✅ | Connexion + Profile menu |
| Admin Dashboard | ✅ | Bouton Shield (admin only) |
| Pricing | ✅ | Pro / Annuel / Lifetime |
| i18n | ✅ | FR / EN / AR / ES |
| Sécurité | ✅ | Headers + Rate limit + XSS/SQLi |

## Scripts de démarrage

- **Production** : `bash start-production.sh` (~512 MB)
- **Dev** : `bash start-dev.sh` (~2 GB Turbopack)

## Architecture détaillée

Voir `ARCHITECTURE.md` pour la structure complète des fichiers, les routes API, et les références SDK.
