# Stoq — Project Foundation Document

## What Is Stoq

A personal household intelligence app. The core loop is simple — scan a grocery receipt, AI extracts the items, you review and confirm, they land in your pantry. Your pantry then powers recipe suggestions. You cook something, ingredients get marked down. Pantry runs low, you restock. Repeat.

The name Stoq comes from "stock" — pantry stock and keeping track of things. Layered meaning, modern spelling, works as a domain (`stoq.app` or `getstoq.com`).

---

## The Core Loop

```
Receipt Scan → AI Extraction → User Review → Pantry
      ↑                                         ↓
   Grocery List ← Ingredient Gaps ← Recipe Suggestions
```

Every feature feeds the next. Nothing is decorative.

---

## Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Auth**: Clerk
- **Database**: Drizzle ORM + Neon (PostgreSQL)
- **Vision AI**: Gemini 2.0 Flash (free tier, multimodal) — for receipt scanning
- **Recipe API**: TheMealDB (free, no key) or Spoonacular (free tier, more powerful)
- **Deployment**: Vercel

---

## App Structure (Pages / Tabs)

| Route | Purpose |
|---|---|
| `/` | Redirect to dashboard if logged in, else Clerk sign-in |
| `/dashboard` | Quick glance — low stock items, a recipe suggestion, activity |
| `/pantry` | Current inventory — all items, stock status, manual edit |
| `/groceries` | Receipt scanner + manual add |
| `/recipes` | Powered by pantry state — what you can cook right now |

No landing page for now. Build the product first.

---

## Data Model (Conceptual)

**User** — managed by Clerk, just store the Clerk `userId` in your DB to anchor everything.

**House** — one per user for now (solo app). Stores basic info the user provides on first login.

**PantryItem**
- `id`
- `houseId`
- `name`
- `quantity` (display only — e.g. "1kg", "2 bottles")
- `stockStatus` — enum: `IN_STOCK | LOW | OUT`
- `category` (optional — produce, dairy, dry goods)
- `createdAt`, `updatedAt`

**Receipt**
- `id`
- `houseId`
- `imageUrl`
- `scannedAt`
- `status` — enum: `PENDING | REVIEWED | SUBMITTED`

**ReceiptItem** (intermediate — what AI extracted, before user confirms)
- `id`
- `receiptId`
- `name`
- `quantity`
- `isConfirmed`

---

## The Receipt Scanner Flow

1. User uploads image in `/groceries`
2. Image sent to Gemini 2.0 Flash vision API
3. AI returns structured list — item name + quantity
4. App presents it as an editable review UI — each item is an inline form row (name + quantity side by side)
5. User corrects any wrong extractions
6. User hits Submit — items written to `PantryItem` table, status set to `IN_STOCK`

**Key rule**: Never skip the review step. AI gets receipts wrong. The correction layer is what keeps your pantry data trustworthy.

---

## Pantry Deduction — How Items Get Used

**Primary mechanism — Recipe-triggered deduction**
When user clicks "I cooked this" on a recipe, the app marks the used ingredients:
- `IN_STOCK` → `LOW`
- `LOW` → `OUT`

No exact quantity math. Stock tiers only. This avoids the unit mismatch nightmare (recipe says "2 cups rice", your pantry says "1kg").

**Secondary mechanism — Manual edit**
Always available as a fallback. User can tap any pantry item and adjust stock status or quantity directly.

**Safety net — Weekly quick check (future)**
App surfaces a simple prompt: "You bought X a week ago, still have some?" — Yes / Low / Out. Keeps data honest for items consumed outside of recipes (snacks, drinks, condiments).

**Important distinction**: Quantity on receipt is stored for *display* purposes. Deduction logic runs on *stock tier*, not the number. Two separate concerns.

---

## Recipe Integration

- Query TheMealDB or Spoonacular using current `IN_STOCK` pantry items as parameters
- Each recipe card shows: dish name, image, ingredients you have vs ingredients you're missing
- Missing ingredients → one-click add to grocery list
- "I cooked this" button → triggers deduction flow above

**Known problem — ingredient name mismatch**: Your pantry says "Basmati Rice", API says "rice". String matching is messy. For v1, fuzzy matching or a simple normalization step on ingredient names before querying is enough.

---

## Problems You Will Face

**Receipt parsing inconsistency** — Different stores format receipts differently. Vision AI extracts text fine but structuring it into name/quantity/category has edge cases. Always have the correction UI as a safety net.

**Pantry data going stale** — Items get consumed without the app knowing. Solved by the stock tier system + recipe-triggered deduction + optional weekly prompt.

**Recipe API ingredient mismatch** — API ingredient names won't always match your pantry names. Normalize ingredient strings before querying (lowercase, strip units, common aliases).

**Free tier limits** — Spoonacular free tier is ~150 points/day. Ingredient-based searches cost more than simple searches. Monitor usage, cache recipe results where possible.

**Image upload edge cases** — Users will upload huge HEIC files from iPhones. Set file size limits (max 5MB), validate format before sending to AI, handle errors gracefully.

**AI calls hanging** — Always set a timeout on vision API calls. A hanging fetch with no timeout silently kills UX.

---

## Production Checklist

- [ ] All API keys in environment variables, nothing hardcoded
- [ ] Drizzle migrations are version controlled and reproducible
- [ ] Error boundaries around all AI calls
- [ ] Image upload has size limit + format validation
- [ ] AI API calls have timeouts
- [ ] Graceful degradation when APIs fail (recipe API down → show cached or empty state, not crash)
- [ ] Neon DB connection pooling configured correctly for serverless (Vercel)

---

## Things to Keep in Mind While Building

- **Design the schema before the UI** — the relationship between receipt → items → pantry → recipes is the spine of the app. Wrong schema early = constant refactoring.
- **AI is unreliable by design** — every AI interaction needs a human correction path.
- **Scope discipline** — the moment you think "I could also add utility bills..." — stop. Finish the grocery loop completely first.
- **You are the primary user** — dogfood it immediately. You'll know what's broken within days.
- **Quantity stored for display, stock tier drives logic** — keep these two concerns separate in your schema and your UI.

---

## Starting Workflow

See the section below — where to take the first step.
