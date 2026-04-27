# Dashboard Product Spec

## Goal

Give procurement, trading, and operations teams one real-time view to decide what to buy, where to buy, how long to store, and when to sell.

## Roles

- Super Admin
- Procurement Manager
- Trader
- Quality Inspector
- Logistics Coordinator

## Main Sections

1. Command Center
   - Top opportunities today
   - Risk alerts
   - Pending approvals
   - Margin tracker

2. Commodity Intelligence
   - Price chart (market-wise)
   - Quality score trend
   - Weather risk heatmap
   - Buy/Sell/Hold panel

3. Procurement Planner
   - Recommended source markets
   - Quantity suggestions
   - Grade rules checklist
   - Last mile dispatch window

4. Storage and Shelf-Life
   - Current inventory
   - Cold/dry utilization
   - Days-to-expiry visualization
   - Spoilage risk monitor

5. Logistics and Dispatch
   - Route recommendations
   - Lane cost comparison
   - Delays and SLA status

6. SEO Growth Console
   - Planned articles
   - Published content
   - Impressions/clicks trend
   - Keyword ranking movement

## Critical Widgets

- `Action Board`: ranked recommendations with confidence and expected margin
- `Risk Board`: weather/logistics quality risk flags
- `Execution Outcome`: forecast vs realized margin
- `Recommendation Audit`: why a recommendation was generated

## UX Rules

- Every recommendation card shows:
  - action
  - confidence
  - valid until
  - top risks
- Red state appears when:
  - confidence < threshold
  - stale data
  - storage overflow risk

## Alerts

- Price spike > configured threshold
- Rain risk high in source region
- Spoilage risk > configured threshold
- Transport lane disruption
- Recommendation expiring in < 2 hours

## Exports

- Daily procurement plan (CSV/PDF)
- Weekly P&L by commodity
- Recommendation accuracy report
