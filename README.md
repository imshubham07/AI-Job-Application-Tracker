# AI Job Application Tracker

A full-stack app to track job applications with an AI-assisted workflow.

## Tech Stack
- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Database: MongoDB

## 1) Prerequisites (on the new machine)
Install these first:
- Node.js `20.x` (or newer LTS)
- npm `10.x` (comes with Node)
- Docker Desktop / Docker Engine (recommended for MongoDB)

Check versions:

```bash
node -v
npm -v
docker --version
```

## 2) Clone and open

```bash
git clone https://github.com/imshubham07/AI-Job-Application-Tracker.git
cd "AI Assistent"
```

## 3) Configure environment variables
Create `server/.env` from the template:

```bash
cp .env.example server/.env
```

Then edit `server/.env`:

```env
MONGO_URI=mongodb://localhost:27017/ai-job-tracker
JWT_SECRET=replace-with-a-strong-secret
GROQ_API_KEY=your-groq-api-key
OPENAI_API_KEY=your-openai-api-key
PORT=5000
```

Notes:
- `JWT_SECRET` must be a strong random string.
- For AI features, set at least one key:
  - `GROQ_API_KEY` (preferred by current backend), or
  - `OPENAI_API_KEY`.
- If no AI key is set, core app still runs but AI suggestions/parsing will fail.

## 4) Start MongoDB

### Option A (Recommended): Docker

```bash
docker run -d \
  --name ai-job-tracker-mongo \
  -p 27017:27017 \
  -v ai-job-tracker-mongo-data:/data/db \
  mongo:7
```

If container already exists:

```bash
docker start ai-job-tracker-mongo
```

### Option B: Local MongoDB service
Use your OS package manager/service manager and ensure it listens on `mongodb://localhost:27017`.

## 5) Install dependencies
Install server and client packages:

```bash
cd server && npm install
cd ../client && npm install
cd ..
```

## 6) Run the app (development)
Use two terminals.

### Terminal 1: Backend

```bash
cd server
npm run dev
```

Expected log:
- `Server running on port 5000`

### Terminal 2: Frontend

```bash
cd client
npm run dev -- --host
```

Open:
- `http://localhost:5173`

## 7) Health check
Backend health endpoint:

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{"status":"ok"}
```

## 8) Production build (optional)

### Client

```bash
cd client
npm run build
```

### Server

```bash
cd server
npm run build
npm start
```

## 9) Common issues

### MongoDB connection failed
- Ensure container/service is running.
- Verify `MONGO_URI` in `server/.env`.
- Check port conflict on `27017`.

### `JWT_SECRET is not configured`
- Add `JWT_SECRET` to `server/.env`.

### AI route errors (`GROQ_API_KEY is not configured`)
- Set `GROQ_API_KEY` (or `OPENAI_API_KEY`) in `server/.env`.

### Frontend cannot call backend
- Ensure backend runs on `http://localhost:5000`.
- Verify `server` started successfully before using frontend.

## Project Structure
- `server/` → Express API
- `client/` → React app
- `.env.example` → Environment variable template

---
If you want, I can also add a `docker-compose.yml` so a new machine can start MongoDB + server + client with one command.
