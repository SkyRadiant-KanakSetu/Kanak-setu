# Sky Radiant Agro: AI Agent Pack

This folder contains a complete, implementation-ready package for building and operating the Sky Radiant Agro multi-agent platform.

## Included Files

- `01-agent-system-blueprint.md`: Full multi-agent architecture, goals, responsibilities, and execution flow.
- `02-master-agent-system-prompt.md`: Production-grade system prompt for the orchestrator/master agent.
- `03-tooling-contracts.json`: Tool schema definitions for all agent capabilities.
- `04-data-model.sql`: Database schema for commodities, markets, forecasts, recommendations, and execution logs.
- `05-api-contracts.md`: REST API design for ingestion, intelligence, recommendations, and operations.
- `06-dashboard-spec.md`: Admin and operations dashboard product specification.
- `07-seo-agent-pipeline.md`: SEO automation workflow for digital growth.
- `08-agent-training-content.md`: Structured training manual content (PDF-ready) with commodity decision tables.
- `09-landing-page-copy.md`: Conversion-focused website copy for farmers, buyers, and partners.
- `10-investor-pitch-outline.md`: Investor deck structure highlighting data advantage and defensibility.

## Deployment Order (Recommended)

1. Implement schema from `04-data-model.sql`.
2. Build data ingest + intelligence APIs from `05-api-contracts.md`.
3. Wire orchestrator with `02-master-agent-system-prompt.md` + `03-tooling-contracts.json`.
4. Ship dashboard from `06-dashboard-spec.md`.
5. Activate SEO and training rollout (`07`, `08`, `09`, `10`).

## Operating Principle

The platform is decision-support first: all AI outputs provide confidence, assumptions, and risk flags before execution.
