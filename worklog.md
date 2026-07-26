# HireNova — Worklog complet
> Projet : HireNova by E-Society 2050
> Dernière MAJ : 2025-07-25

---

## Phase 8 : HireNova Global + Mobilité + OCR/NLP + Chatbot 2.0

### Nouvelles fonctionnalités ajoutées

#### HireNova Global — Recrutement International
- **5 composants frontend** : global-market, global-job-detail, global-apply, global-employer-dashboard, global-post-job
- **4 routes API** : GET /api/global-jobs, GET /api/global-jobs/[id], POST /api/global-jobs/[id]/apply, GET /api/global-jobs/employer
- **Features** : Filtres par région (Europe, Asie, Afrique, Amériques, MENA), pays, mot-clé. Badges Visa/Relocation/Remote. Dashboard employeur avec stats.
- **DB** : Modèles GlobalJobListing (visaSponsorship, relocationPackage, region) + GlobalApplication

#### HireNova Mobilité — OCR + NLP Pipeline
- **4 composants frontend** : mobility-home, mobility-upload, mobility-profile, mobility-result
- **2 routes API** : POST /api/mobility/upload (OCR extraction), POST /api/mobility/format (reformulation pays cible)
- **Architecture 2 étapes** :
  1. OCR : extraction du texte depuis CV PDF/Image → profil structuré (skills, experience, education)
  2. IA (LLM + NLP) : reformulation CV/CL selon standards du pays cible, calcul score compatibilité, détection skills gap
- **12 pays supportés** : 🇫🇷🇬🇧🇺🇸🇨🇦🇩🇪🇦🇪🇨🇭🇧🇪🇪🇸🇮🇹🇯🇵🇦🇺
- **DB** : Modèle MobilityProfile (extractedText, structuredData, skills, formattedCV, formattedCL, matchScore)

#### Chatbot IA 2.0 — Knowledge Base Complète
- Système prompt enrichi avec TOUTES les fonctionnalités HireNova (CV, CL, ATS, Jobs, API, Global, Mobilité)
- Tarification détaillée
- Pipeline OCR/NLP expliqué
- Normes CV par pays
- Conseils carrière
- Mode Conseiller + Support technique

### Fichiers créés/modifiés (cette session)

**Nouveaux (18 fichiers)** :
1. `src/components/global/global-market.tsx` — Marketplace international
2. `src/components/global/global-job-detail.tsx` — Détail offre globale
3. `src/components/global/global-apply.tsx` — Candidature internationale
4. `src/components/global/global-employer-dashboard.tsx` — Dashboard recruteur global
5. `src/components/global/global-post-job.tsx` — Publication offre internationale
6. `src/components/mobility/mobility-home.tsx` — Landing Mobilité
7. `src/components/mobility/mobility-upload.tsx` — Upload OCR + extraction
8. `src/components/mobility/mobility-profile.tsx` — Profil structuré + analyse
9. `src/components/mobility/mobility-result.tsx` — CV/CL reformattés
10. `src/app/api/global-jobs/route.ts` — GET + POST offres internationales
11. `src/app/api/global-jobs/[id]/route.ts` — GET détail offre
12. `src/app/api/global-jobs/[id]/apply/route.ts` — POST candidature + AI matching
13. `src/app/api/global-jobs/employer/route.ts` — GET stats employeur
14. `src/app/api/mobility/upload/route.ts` — POST upload OCR
15. `src/app/api/mobility/format/route.ts` — POST reformulation pays

**Modifiés (4 fichiers)** :
1. `prisma/schema.prisma` — +3 modèles (GlobalJobListing, GlobalApplication, MobilityProfile) + relations User
2. `src/store/cv-store.ts` — +9 steps (global*, mobility*), +types (ExtractedProfile, MobilityResult), +state
3. `src/app/page.tsx` — +9 imports dynamiques + step mappings
4. `src/components/cv/landing.tsx` — +2 sections (HireNova Global, HireNova Mobilité)
5. `src/app/api/chatbot/route.ts` — Remplacé avec knowledge base complète

### Vérification navigateur ✅
- 31 boutons interactifs
- "HireNova Global" section visible avec boutons
- "HireNova Mobilité" section visible avec OCR/NLP pipeline
- 12 drapeaux de pays affichés
- Build réussi, lint clean

---

## Phase 9 : Diagnostic page blanche + Sauvegarde complète
> Date : $(date -u +"%Y-%m-%d %H:%M:%S UTC")

### Problème signalé
- Utilisateur : "la page n'est pas affichée" / "affiche la page mon CTO et faire la sauvegarde"

### Diagnostic
- **Cause racine** : Le serveur dev Next.js (`bun run dev`) n'était PAS en cours d'exécution. Le sandbox cloud nettoie agressivement tous les processus d'arrière-plan entre les appels Bash, y compris ceux lancés avec `nohup` + `disown` et même `setsid`.
- Le code du projet était intact (page.tsx, cv-store.ts, tous composants Global + Mobilité présents).
- Seul le runtime serveur manquait.

### Solution appliquée
- Démarrage du serveur dev + vérification agent-browser **dans le même appel Bash** (évite le nettoyage inter-appels).
- `keep-alive.sh` existant (boucle while true → bun run dev) pour redémarrage automatique.
- Serveur confirmé : `GET / 200` en 0.03s, PID actif.

### Vérification navigateur (agent-browser) ✅
Page entièrement rendue avec toutes les sections :
1. Header : sélecteurs FR/EN/AR/ES, bouton Connexion
2. Hero : "Générez un CV professionnel en 60 secondes" + 2 CTA
3. 6 Personas : Étudiant, Diplômé, Professionnel, Cadre, Freelance, Expatrié
4. Features : IA Avancée, Multilingue, Optimisé ATS, Lettre IA
5. Tarifs (EUR/USD/GBP, Pro/Annuel)
6. Écosystème : 9 modules HireNova (CV, ATS, Interview, LinkedIn, Recruiter, Career, Coach, Formation, Freelance)
7. FAQ (8 questions accordéon)
8. Trust section
9. HireNova Jobs (Marketplace + Publier offre)
10. HireNova API (3 endpoints, 3 plans, Doc + Clé API)
11. **HireNova Global** (40+ Pays, Visa, Relocation, Explorer, Dashboard)
12. **HireNova Mobilité** (Étape 1 OCR, Étape 2 IA, Adapter CV)
13. Footer + Chatbot widget (bouton flottant)

### État du projet
- **25 steps** dans cv-store.ts (AppStep)
- **25 composants** dynamiques dans page.tsx
- **~40 routes API** (auth, cv, cl, ats, jobs, global-jobs, mobility, chatbot, admin, api-portal, paymob, webhook)
- **Prisma models** : User, Resume, CoverLetter, JobListing, Application, ApiSubscriber, ApiUsageLog, SatisfactionRating, SecurityAlert, GlobalJobListing, GlobalApplication, MobilityProfile
- Lint : clean
- Build : OK (Turbopack)

### Artefacts de sauvegarde
- `worklog.md` — cet fichier (historique complet Phases 1-9)
- `ARCHITECTURE.md` — référence technique (stack, structure, SDK)
- `start-dev.sh` / `start-production.sh` / `keep-alive.sh` — scripts de démarrage
- `public/hirenova-backup.tar.gz` — snapshot projet précédent


---

## Phase 10 : Fix page blanche — middleware + next-auth
> Date : 2026-07-26

### Problème
Page blanche répétée dans le Preview Panel malgré serveur répondant HTTP 200.

### Diagnostic
1. **`src/middleware.ts` toujours présent** — était censé être supprimé (Phase précédente) car il cause un overhead Edge Runtime sur CHAQUE requête (matcher trop large: `/((?!_next/static|...).*)`). Le warning `⚠ The "middleware" file convention is deprecated` apparaissait dans dev.log.
2. **`.env` sans NEXTAUTH_SECRET ni NEXTAUTH_URL** — next-auth affichait warnings `NO_SECRET` et `NEXTAUTH_URL`, causant des `CLIENT_FETCH_ERROR` répétés sur `/api/auth/session` (7+ erreurs dans la console navigateur).
3. **`next.config.ts` sans headers de sécurité** — les headers étaient seulement dans le middleware (qui devait être supprimé).

### Correctifs appliqués
1. **Suppression de `src/middleware.ts`** — fini l'overhead Edge Runtime
2. **Ajout des security headers dans `next.config.ts`** (source: `/(.*)` ) :
   - X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
   - X-Frame-Options: ALLOWALL (pour iframe Preview Panel)
   - CSP permissive (frame-ancestors *)
3. **Ajout dans `.env`** :
   - `NEXTAUTH_SECRET=hirenova-dev-secret-2050-secure-key-zai-2026`
   - `NEXTAUTH_URL=http://localhost:3000`

### Résultat vérifié (agent-browser)
- HTTP 200 en 0.1s
- Page titre : "HireNova — Générateur de CV IA, Lettre de Motivation & Score ATS"
- Body : 9223px / 5984 chars (contenu complet)
- **Console errors : VIDE** ✅
- dev.log : propre, toutes réponses 200, plus de warnings next-auth

### Note stabilité
Le sandbox cloud tue les processus d'arrière-plan entre les appels Bash. Le serveur dev peut mourir. Solution : redémarrer avec `setsid bash -c 'cd /home/z/my-project && exec bun run dev'` à chaque fois que la page devient blanche.
