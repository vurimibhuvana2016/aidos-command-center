# AIDOS Demo Script

## Presenter setup (2 minutes before)

```bash
npm install
npm run dev
```

Use a desktop browser at 1440 × 900 or larger. Open DevTools only if asked about responsiveness. In **Data hub**, click **Restore demo** if a previous run changed the data.

## 5-minute spoken walkthrough

### 0:00–0:35 — Frame the problem

> “A distributor does not need another dashboard full of charts. Every morning they need three answers: what changed, why it matters, and what to do next. AIDOS turns inventory and sales data into a controlled decision workflow.”

Show the top alert and four KPI cards. Point to at-risk value and forecast accuracy. Clarify that the values use synthetic demonstration data.

### 0:35–1:25 — From a signal to evidence

In **Priority signals**, expand **Mango Burst Bar**.

> “AIDOS ranks exceptions by operational impact. This SKU has only about three days of cover against a four-day supplier lead time, while demand is rising. The system shows the exact evidence and a concrete reorder—not a black-box warning.”

Click **Add to plan**.

### 1:25–2:15 — Explainable copilot

Click **Ask AIDOS**, then the suggestion **Why is SKU-104 at risk?**

> “The copilot does not invent business numbers. It selects the SKU from connected data, uses deterministic calculations, and then explains the result in plain language. The evidence section makes the answer auditable.”

Click **Review action** to demonstrate a human-controlled workflow.

### 2:15–3:00 — Inventory and forecast

Open **Inventory**. Filter to **critical**, then open a SKU row. Show the side panel. Next open **Forecast** and switch between SKUs.

> “The forecast is intentionally transparent for the MVP: recent daily velocity, trend, lead time, and safety stock generate the reorder quantity. More sophisticated forecasting can be added after pilot data proves it is needed.”

### 3:00–3:50 — Controlled action and audit trail

Open **Action center** and approve a decision.

> “AIDOS separates recommendation from execution. The manager reviews evidence and explicitly approves. In production, this event becomes an immutable audit record and can create a draft purchase order—never an uncontrolled purchase.”

Return to **Command center** and show the new entry in **Decision trail**.

### 3:50–4:40 — Data onboarding

Open **Data hub** and download the sample CSV. Drag the downloaded file into the upload area.

> “The pilot starts from the tools distributors already use: CSV and spreadsheet exports. Stable SKU codes connect the data. The production path swaps browser storage for an authenticated, row-secured Supabase workspace without changing the operator experience.”

### 4:40–5:00 — Close

> “This MVP proves one valuable workflow end to end: detect risk, explain why, recommend a specific action, obtain human approval, and record the decision. A pilot can measure stock-outs avoided, expiry value protected, forecast accuracy, and time-to-decision.”

## Prepared Q&A

**Is this using a live AI model?**  
The demo intentionally uses a deterministic grounded response layer, so it works free and cannot hallucinate figures. A production LLM can be added server-side to explain retrieved calculations; the numerical engine remains authoritative.

**Is the forecast production-grade?**  
It is an explainable baseline suited to MVP validation. Backtesting against pilot data determines whether a seasonal or probabilistic model adds meaningful value.

**Where is the data stored?**  
Demo data stays in the current browser. Production requires authenticated cloud storage, workspace isolation, encryption, validation, audit logs, backups, and retention controls.

**Can it connect to an ERP?**  
The Data Hub demonstrates the ingestion contract. API and scheduled-file adapters can map ERP exports into the same canonical schema during a pilot.

## 90-second fallback pitch

Show Command center → expand SKU-104 → open Copilot → show Data hub.

> “AIDOS turns fragmented FMCG data into explainable action. Here it identifies a likely stock-out, proves the signal with cover and lead-time data, calculates a reorder, and asks for human approval. The copilot uses only connected workspace evidence. The distributor can start with a CSV today and move to a secure cloud integration after the pilot. The outcome we measure is simple: fewer stock-outs, less expiry loss, and faster decisions.”
