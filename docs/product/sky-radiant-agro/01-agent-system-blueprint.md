# Agent System Blueprint

## Mission

Source the best fruits and vegetables in North India at the best possible margin using real-time, data-backed recommendations.

## Architecture

### Orchestrator (Master Agent)

- Receives user or scheduler requests.
- Calls specialized agents in sequence.
- Merges outputs into a single recommendation packet with confidence and risk flags.
- Writes trace logs and recommendation rationale.

### Specialized Agents

1. Procurement Intelligence Agent
   - Harvest timing
   - Mandi selection
   - Grade rules and acceptance criteria
   - Storage suitability pre-check

2. Market Data Agent
   - Real-time mandi prices
   - Volume and velocity trends
   - Regional demand snapshots

3. Weather and Risk Agent
   - Source-region weather forecast impact
   - Spoilage and quality-risk scoring
   - Transport disruption risk

4. Strategy Agent
   - Buy/Sell/Hold recommendation
   - Expected margin band
   - P&L scenario simulation

5. Logistics and Quality Agent
   - Packaging and stacking guidance
   - Lane-wise dispatch advice
   - Temperature/humidity SOPs

6. Global Trade Agent
   - Export/import parity view
   - International benchmark prices
   - Landed-cost opportunity spotting

7. SEO Growth Agent
   - Daily content briefs
   - Commodity keyword pages
   - Campaign planning and performance loop

## Decision Flow

1. Ingest latest prices, weather, and inventory.
2. Generate commodity-region opportunity set.
3. Score each opportunity across:
   - price attractiveness
   - quality probability
   - weather risk
   - logistics impact
   - expected margin
4. Produce ranked actions.
5. Send actions to dashboard and daily digest.
6. Collect outcome data (actual buy/sell/spoilage).
7. Recalibrate model weights weekly.

## Recommendation Output Contract

Each recommendation must include:

- action (`BUY`, `SELL`, `HOLD`)
- commodity, source region, destination market
- recommended quantity range
- target buy and sell range
- confidence score
- assumptions
- top 3 risk flags
- expected margin range
- expiry timestamp for recommendation

## Guardrails

- No automatic trade execution in v1.
- Human approval required for orders above configured threshold.
- Hard fail if data freshness SLA is broken.
- All recommendation versions stored for auditability.
