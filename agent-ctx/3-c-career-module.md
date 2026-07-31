# Task 3-c: HireNova Career Module

## Summary
Built the complete HireNova Career module with 4 pages, 3 API routes, Prisma model, and i18n support in FR/EN/AR/ES.

## Files Created
### Components (4)
1. `src/components/career/career-home.tsx` — Overview with career paths (Tech/Marketing/Finance/Design/Data), 3-step preview, CTA to assessment, recent assessments list
2. `src/components/career/career-assessment.tsx` — 12-question multi-step quiz with progress bar, question dots, radio selection, animated transitions
3. `src/components/career/career-roadmap.tsx` — AI-generated 3-phase timeline (short/medium/long term) with skills, certifications, milestones, circular score gauge
4. `src/components/career/career-skills.tsx` — Skills gap analysis with SVG radar chart, current vs required progress bars, recommended courses grid

### API Routes (3)
1. `src/app/api/career/assessment/route.ts` — POST: save assessment answers + compute score; GET: list assessments or get by ID
2. `src/app/api/career/roadmap/route.ts` — POST: generate AI roadmap via LLM (deepseek-chat, temp 0.7), save to DB
3. `src/app/api/career/skills/route.ts` — POST: generate AI skills gap analysis via LLM, save to DB

### Database
- Added `CareerAssessment` model to `prisma/schema.prisma` (id, userId, answers JSON, targetRole, currentLevel, roadmap JSON, skillsGap JSON, score 0-100, language, createdAt)
- Added relation to User model
- Ran `bun run db:push` successfully

### i18n
- Added ~90 new translation keys (careerHomeTitle, careerQ1-12, careerQ1O1-4 through careerQ12O1-4, careerRoadmapTitle, careerSkillsTitle, etc.)
- All 4 languages: FR, EN, AR, ES
- RTL support for Arabic in all career components

### Integration
- Registered 4 career routes in `page-client.tsx` (dynamic imports)
- Activated HireNova Career card in `landing.tsx` ecosystem section (active: true, step: 'careerHome')

## Key Design Decisions
- Rose/pink color scheme for Career module (distinct from emerald/teal used by other modules)
- SVG-based radar chart for skills visualization (no external chart library)
- Framer Motion animations for card reveals and question transitions
- Assessment score computed client-side from answer patterns, stored in DB
- Roadmap and skills analysis generated server-side via LLM, persisted to DB for re-viewing
