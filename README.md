# AIDOS Command Center

An interactive, presentation-ready MVP for FMCG distribution intelligence. AIDOS answers the operator's three daily questions: **What is happening? Why is it happening? What should I do next?**

## What is included

- Distribution command center with live KPI, demand, risk, and decision views.
- Inventory intelligence with search, filters, explainable risk signals, and SKU drill-down.
- Seven-day demand forecast with per-SKU drivers and reorder recommendation.
- Action center with evidence, value exposure, approval state, and a decision trail.
- Grounded AIDOS Copilot that only answers from deterministic workspace data.
- CSV Data Hub with validation, import, downloadable sample, and local persistence.
- Responsive UI for desktop, tablet, and mobile; keyboard shortcut `Ctrl/Cmd + K` opens the copilot.
- Unit tests for risk logic, calculations, and grounded copilot output.
- Vercel and Netlify configuration for free static deployment.

## Run locally

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. No API keys, login, or database are needed for the demo.

For a one-click presentation launch, run `./scripts/demo.sh` on macOS/Linux or `./scripts/demo.ps1` in PowerShell. You can also use `npm run demo`.

## Test and production build

```bash
npm test
npm run build
npm run preview
```

## Five-minute presentation

Use [DEMO_SCRIPT.md](./docs/DEMO_SCRIPT.md). The strongest path is:

1. Start on **Command center** and frame the decisions requiring attention.
2. Expand `Mango Burst Bar` under Priority signals to show the evidence and action.
3. Open **Ask AIDOS** and select “Why is SKU-104 at risk?”
4. Open **Forecast**, switch products, and explain forecast-to-reorder logic.
5. Open **Action center**, approve one decision, and show it in the decision trail.
6. Open **Data hub**, download and re-import the supplied sample CSV.

## Free deployment

### Vercel

1. Push this folder to a Git repository.
2. Import it in Vercel.
3. Framework preset: **Vite**; build command: `npm run build`; output: `dist`.
4. Deploy. `vercel.json` already handles SPA routes.

### Netlify

1. Import the repository in Netlify.
2. The included `netlify.toml` sets the build command, output folder, and SPA redirect.
3. Deploy.

## Current demo vs. production integration

The current build is intentionally static-first: it uses synthetic data and browser `localStorage`, making it safe, free, and reliable during a presentation. It does **not** claim that simulated authentication or enterprise integrations already exist.

For a real pilot:

- Replace the local state adapter with Supabase/PostgreSQL tables.
- Add Supabase Auth and Row Level Security using `workspace_id` on every business record.
- Perform CSV parsing and validation server-side for confidential data.
- Put the LLM call in a server/edge function; never expose an API key in client code.
- Retrieve deterministic metrics first, then let the LLM explain them. Require confirmation before executing purchase orders or transfers.
- Add role checks, audit logs, rate limits, backups, monitoring, and an explicit data-retention policy.

The decision logic lives in `src/lib/intelligence.ts`, deliberately separate from the UI, so it can move to a server function without rewriting screens.

## CSV schema

Use `public/demo/aidos_inventory_sample.csv`. Required columns are:

`sku`, `name`, `category`, `stock`, `daily_sales`, `sell_through`, `lead_time`, `safety_stock`, `expiry_days`, `unit_price`, `demand_change`.

The browser importer is appropriate for synthetic demonstration data only. Real distributor exports should be handled with authenticated upload, server validation, malware scanning, encrypted storage, and an import audit trail.
