# Architecture and Integration Notes

## Demo architecture

```text
Synthetic CSV / bundled data
          ↓
Browser import + schema validation
          ↓
Deterministic intelligence engine
  (cover, exposure, reorder, risk)
          ↓
React views + grounded copilot
          ↓
localStorage persistence
```

This architecture has zero operating cost and zero secret management, which makes it dependable for evaluation and portfolio presentation.

## Pilot architecture

```text
ERP / CSV → authenticated import function → PostgreSQL/Supabase
                                             ↓
                                  metrics + forecast service
                                             ↓
                                  authorized retrieval API
                                             ↓
                                LLM explanation (server-side)
                                             ↓
                             human approval → action API → audit log
```

Numerical outputs remain deterministic. The language model explains retrieved results; it does not calculate or invent operational figures. Every table includes `workspace_id`, and database Row Level Security ensures users can access only their distributor workspace.

## Suggested production entities

- `workspaces`, `profiles`, `workspace_members`
- `skus`, `inventory_snapshots`, `sales_daily`
- `suppliers`, `retailers`, `orders`, `deliveries`, `pod_records`
- `forecasts`, `insights`, `recommendations`
- `approvals`, `action_executions`, `audit_events`, `imports`

## Environment variables for a later integration

Only add these when the corresponding server-side integration exists:

```text
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server only
LLM_API_KEY=                 # server only
```

Do not use service-role or LLM credentials in Vite client variables, since values compiled into the browser are public.
