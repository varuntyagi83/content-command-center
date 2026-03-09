# ⚡ Content Command Center

Shared content strategy Kanban board for **Voltic**, **AdForge**, and **AI Catalyst**.

Built for Varun & Renuka to organize, discuss, and track content ideas across LinkedIn, Twitter/X, Medium, Product Hunt, and Indie Hackers.

## Features

- **Kanban Board** — 5 columns: Idea → Drafting → Review → Scheduled → Published
- **Drag & Drop** — Move cards between columns
- **Bulk Actions** — Select multiple ideas to Keep (→ Drafting) or Reject
- **List View** — Toggle between Board and List views
- **Comments** — Threaded discussion per card (toggle between Varun/Renuka)
- **Filters** — Filter by product, platform, content pillar, or search
- **Quick Add** — Rapid idea capture from the top bar
- **50 Pre-loaded Ideas** — Organized by 6 content pillars with SEO/AEO tags
- **Persistent Storage** — Data saved to localStorage

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state management with localStorage persistence)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: GitHub → Vercel
1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repo
4. Click Deploy — no environment variables needed

### Option 3: Direct from terminal
```bash
git init
git add .
git commit -m "Content Command Center v1"
gh repo create content-command-center --public --push
# Then import on Vercel
```

## Project Structure

```
src/
├── app/
│   ├── globals.css       # Tailwind + custom styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page (client component)
├── components/
│   ├── Header.tsx        # Top bar with stats, author toggle, view toggle
│   ├── QuickAdd.tsx      # Quick idea input
│   ├── FilterBar.tsx     # Filters + bulk actions
│   ├── KanbanBoard.tsx   # Board view with drag & drop
│   ├── ListView.tsx      # List view
│   ├── CardForm.tsx      # Add/Edit modal
│   ├── CardDetail.tsx    # Card detail with comments
│   ├── Modal.tsx         # Modal overlay wrapper
│   └── Tags.tsx          # Product/Platform tag components
└── lib/
    ├── types.ts          # TypeScript types + constants
    ├── seed-data.ts      # 50 pre-loaded content ideas
    └── store.ts          # Zustand store with localStorage persistence
```

## Future Enhancements

- Supabase backend for real-time sync between Varun & Renuka
- n8n webhook to auto-publish scheduled items
- AI-powered content brief generation per card
