# Collaborative AI Editor — by Pratham Singh (B.Tech, LPU ’25)

A live collaborative editor built with Next.js, TipTap, and Yjs. Includes an AI chat sidebar, floating AI edit toolbar, and a lightweight web-search agent (Tavily).

## Demo

- Deployed on Vercel
- Try with `?room=demo` for live collab

## Deploy on Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Vercel, create a New Project and import the repo. Framework: Next.js.
3. Set Environment Variables (Project Settings → Environment Variables):
   - OPENAI_API_KEY (recommended) OR OPENROUTER_API_KEY
   - NEXT_PUBLIC_SITE_URL = https://YOUR_DOMAIN.vercel.app
   - NEXT_PUBLIC_SITE_NAME = Pratham Collab Editor (or your brand)
   - TAVILY_API_KEY (optional for Agent search)
   - NEXT_PUBLIC_COLLAB_WS_URL = wss://demos.yjs.dev (or your own y-websocket server)
4. Deploy. After deployment, if using OpenRouter, ensure YOUR_DOMAIN.vercel.app is allowed in OpenRouter Referer settings.
5. Visit your deployed URL and test chat + AI edits. If keys are missing, responses will indicate Demo mode.

## Local development

```bash
npm i
cp .env.local.example .env.local # fill in keys
npm run dev
```

If styles don’t refresh, delete the .next folder and restart dev.

## Stack

Next.js • Tailwind • TipTap + Yjs • OpenAI/OpenRouter • Tavily

## Run

npm i
cp .env.local.example .env.local # add API keys
npm run dev

— Pratham Singh
