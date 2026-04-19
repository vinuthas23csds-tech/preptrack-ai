# Changelog

All notable changes to this project will be documented in this file.

## [v1.0.0] - 2026-04-19

### Added
- Production deployment support with Render blueprint in `render.yaml`.
- Backend rate limiting middleware (`authLimiter`, `apiLimiter`).
- Global validation cleanup with deduplicated field errors.
- Safer global error handling for production.
- Testing support with Jest + Supertest.
- Health endpoint test and recommendation service tests.
- Deployment guide in `DEPLOYMENT.md`.
- Study/bookmark data model and routes for saved question notes.
- Custom checklist topic support per phase (add/remove).

### Changed
- Upgraded test generation to prioritize interview-style questions.
- Increased phase test size to 30 questions.
- Reattempt flow supports wrong-question retakes.
- Progress totals aligned to real checklist topic counts.
- Frontend UX refresh with softer palette, spacing polish, and improved responsiveness.
- Frontend API fallback switched to same-origin `/api` for production.
- Backend now serves frontend static assets with SPA fallback in production deploy flow.
- Build/start scripts adjusted for single-service deployment.

### Fixed
- Resolved stale legacy progress counts from old 6-item model.
- Fixed deployment root-path issues (`Cannot GET /`) with robust static fallback handling.
- Fixed production `Failed to fetch` by removing localhost API default for deployed frontend.
- Fixed Render deployment build/runtime issues via updated build/start commands and env guidance.

### Security
- Added API throttling to reduce abuse risk.
- Added request body size limit (`1mb`) for JSON payloads.
- Added proxy-aware server config (`trust proxy`) for hosted environments.
- Improved CORS allowlist handling with comma-separated origins.
