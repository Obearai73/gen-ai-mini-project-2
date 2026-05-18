# gen-ai-mini-project-2

AI Study Chatbot with backend and frontend.

## Structure

- `backend/` — Node.js + Express API proxy to OpenAI Chat Completions.
- `frontend/` — Vite + React chat UI.

## Setup

1. Install the backend dependencies:

   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

2. Open `backend/.env` and add your OpenAI API key, or ensure an environment variable is already available:

   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

   If your environment already supplies an OpenAI key automatically, the backend will also accept:
   - `OPENAI_KEY`
   - `OPENAI_APIKEY`
   - `OPENAI`

   If you do not have an API key, get one from https://platform.openai.com/

3. Start the backend:

   ```bash
   npm start
   ```

4. Install the frontend dependencies and run the UI:

   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

5. Open the chatbot in your browser at `http://localhost:5173`.

## Notes

- The backend listens on `http://localhost:4000`.
- The frontend sends chat requests to `/api/chat` on the backend.
- Update the system prompt in `frontend/src/App.jsx` to customize the chatbot tone and study focus.
