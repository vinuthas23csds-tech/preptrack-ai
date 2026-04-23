# Deployment Guide (PrepTrack AI)

This project can be deployed as a single service:
- Backend (Express) serves API routes at `/api/*`
- In production, backend also serves built frontend static files from `frontend/dist`

## 1. Required Environment Variables

Set these variables in your hosting platform:

- `NODE_ENV=production`
- `PORT=<platform-provided-port>` (do not hardcode on Render)
- `MONGO_URI=<your-mongodb-connection-string>`
- `JWT_SECRET=<strong-random-secret>`
- `JWT_EXPIRES_IN=7d`
- `CLIENT_URL=<frontend-origin>` (comma-separated if multiple origins)

Example:

```env
NODE_ENV=production
PORT=<set by host>
MONGO_URI=mongodb://vinuthas23csds_db_user:abc-1721@ac-b5vi6wo-shard-00-00.sgervhg.mongodb.net:27017,ac-b5vi6wo-shard-00-01.sgervhg.mongodb.net:27017,ac-b5vi6wo-shard-00-02.sgervhg.mongodb.net:27017/preptrack_ai?ssl=true&replicaSet=atlas-twj77j-shard-0&authSource=admin&retryWrites=true&w=majority
JWT_SECRET=<random-64-char-secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-app-domain.com
```

## 2. Frontend API Base

For same-origin deployment, set frontend API base to relative path:

```env
VITE_API_BASE_URL=/api
```

## 3. Build Steps

From repository root:

```bash
npm install --include=dev
npm --prefix frontend install --include=dev
npm run build
```

`npm run build` generates `frontend/dist`.

## 4. Start Command

Use backend start command:

```bash
npm start
```

When `NODE_ENV=production` and `frontend/dist` exists, backend serves frontend automatically.

## 5. Health Check

Use:

```text
GET /api/health
```

Expected response:

```json
{ "status": "ok", "service": "PrepTrack AI Backend" }
```

## 6. One-time Seed (Optional)

If you need initial questions in a new database:

```bash
npm run seed
```

Current seed inserts 180 interview-style questions.

## 7. Recommended Hosting

- Render / Railway / Fly.io / Azure App Service / EC2
- MongoDB Atlas for database

## 8. Render Quick Deploy

This repo includes `render.yaml` for a Blueprint-based deploy.

1. Push this repository to GitHub.
2. In Render, click New -> Blueprint.
3. Select your repository.
4. Set `MONGO_URI` to your MongoDB Atlas URI.
5. Set `CLIENT_URL` to your frontend URL. If your frontend is same-origin on this backend service, this can be left empty.

Render uses:

- Build command: `npm install --include=dev && npm --prefix frontend install --include=dev && npm run build`
- Start command: `npm start`
- Health check: `/api/health`

If your final Render URL changes, update `CLIENT_URL` in Render environment variables.

## 9. Post-deploy Checks

- Register/login works
- Checklist save + reset works
- Test generation + submit works
- Analytics endpoint works
- Custom checklist add/remove works
- `/api/health` returns 200
