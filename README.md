# Notes App

A full-stack note-taking app with AI-powered chat, markdown support, and real-time auto-save. Built with Next.js 15, Supabase, and Google Gemini.


## Features

- **Note management** — Create, edit, delete, and pin notes
- **Auto-save** — Changes are saved automatically with a 1-second debounce
- **Markdown support** — Write in Markdown and toggle between edit and live preview
- **AI chat** — Ask questions about your notes using Google Gemini
- **Fuzzy search** — Find notes instantly by content
- **Dark / light mode** — Follows system preference with manual toggle
- **Authentication** — Email/password sign-up and login via Supabase Auth

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Server Actions) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, shadcn/ui, Radix UI |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 7 |
| Auth | Supabase Auth (SSR) |
| AI | Google Gemini (`@google/generative-ai`) |
| Markdown | react-markdown + remark-gfm |
| Search | Fuse.js |
| Package manager | pnpm |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A [Supabase](https://supabase.com) project with a PostgreSQL database
- A [Google AI Studio](https://aistudio.google.com) API key for Gemini

### Installation

```bash
git clone <repo-url>
cd notes-app
pnpm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL=<supabase-pooler-connection-url>
DIRECT_URL=<supabase-direct-connection-url>
SUPABASE_URL=<supabase-project-url>
SUPABASE_PUBLISHABLE_KEY=<supabase-anon-public-key>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
GEMINI_API_KEY=<google-gemini-api-key>
```

You can find `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in your Supabase project under **Settings → API**. The `DATABASE_URL` and `DIRECT_URL` are under **Settings → Database → Connection string**.

### Database Setup

Run the Prisma migrations to set up the database schema:

```bash
pnpm dlx prisma migrate deploy
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
src/
├── app/                   # Next.js App Router pages and API routes
│   ├── page.tsx           # Main note editor
│   ├── login/             # Login page
│   ├── sign-up/           # Registration page
│   └── api/               # REST API routes
├── actions/               # Next.js Server Actions (notes, auth)
├── auth/                  # Supabase session helpers
├── components/
│   ├── db/                # Prisma client and schema
│   └── ui/                # App UI components and shadcn primitives
├── hooks/                 # Custom React hooks
├── lib/                   # Shared utilities and constants
├── Providers/             # Theme and note context providers
└── middleware.ts          # Session refresh and redirect logic
```

## Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  notes     Note[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Note {
  id        String   @id @default(uuid())
  title     String   @default("")
  text      String
  isPinned  Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## What I Learned

This was my first time building a full-stack app from scratch, so pretty much everything was new to me.

The biggest thing was wrapping my head around the Next.js App Router. I kept reaching for patterns from the Pages Router and had to unlearn a lot. Server Actions in particular felt weird at first. Calling server-side code directly from a component seemed complicated at first but once it clicked it made the whole data flow way simpler.

Auth was harder than I expected. Getting Supabase to work correctly across server components, client components, and middleware took a lot of trial and error. I didn't really understand how cookies worked in Next.js until I had to debug a session that kept getting lost between page loads.

The Gemini integration also taught me a lot about working with external APIs. Specifically, managing API keys safely, keeping them out of the client, and making sure they never end up in version control. 

The auto-save debounce seems simple but I went through a few iterations. My first version was saving on every keystroke and hammering the database. Writing the debounce hook myself instead of reaching for a library helped me actually understand what's happening.

Overall I came away with a much better sense of how the server/client split works in modern React, and how all the pieces (auth, database, API) actually connect in a real project.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the development server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
