# Digital Scrapbook

A beautiful, nostalgic digital scrapbook application where colleagues can share their thoughts and memories.

## Features

- 🎨 Glassmorphic UI design with nostalgic feel
- 🔗 Shareable link for easy access
- 📝 Add notes with privacy controls
- 👁️ Public/Private note visibility
- 📱 Responsive design
- ✨ Beautiful animations and transitions
- 💭 Writing prompts to inspire meaningful messages

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- **Dashboard** (`/`): View all notes. Notes marked as "visible to others" are shown to everyone, while private notes are only visible to you.
- **Share Page** (`/share`): Share this link with colleagues so they can add their memories. Includes helpful writing prompts!

## Deployment

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions to Vercel.

Quick deploy:
1. Push to GitHub
2. Import to Vercel
3. Set up Vercel KV database
4. Deploy!

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Vercel KV (production) / File-based storage (local dev)

## Notes Storage

- **Local Development**: Notes stored in `data/notes.json`
- **Production (Vercel)**: Notes stored in Vercel KV (Redis)

