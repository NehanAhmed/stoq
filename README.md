# Stoq

**Your pantry, finally organized.**

Stoq turns grocery chaos into kitchen clarity. Snap a receipt, let AI extract your items, and build a smart pantry that actually knows what you have. No more buying a third bottle of soy sauce because you forgot the first two.

## What It Does

1. **Scan receipts** — Upload any grocery receipt. Gemini AI reads it instantly.
2. **Review once** — Catch any AI mistakes in a clean, fast editing interface.
3. **Stock your pantry** — Confirmed items land in your digital pantry with stock levels.
4. **Cook smarter** — Get recipe suggestions based on what you actually have.
5. **Track usage** — Mark recipes as cooked; pantry updates automatically.

## Why Stoq Exists

Most pantry apps die from bad data. You forget to log things. Quantities get weird. The "inventory" becomes fiction.

Stoq solves this by:
- **Starting with receipts** — The source of truth for what entered your home.
- **Human-in-the-loop** — AI does the tedious work; you just verify.
- **Stock tiers, not math** — IN_STOCK / LOW / OUT beats wrestling with "2 cups vs 200g."

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **Styling**: Tailwind CSS + shadcn/ui
- **Auth**: better-auth
- **Database**: Drizzle ORM + Neon PostgreSQL
- **AI**: Gemini 2.0 Flash (vision)
- **Deployment**: Vercel

## Development

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Add your DATABASE_URL and BETTER_AUTH_SECRET

# Push database schema
npx drizzle-kit push

# Run dev server
pnpm dev
```

---

Built for people who cook, shop, and forget — in that order.
