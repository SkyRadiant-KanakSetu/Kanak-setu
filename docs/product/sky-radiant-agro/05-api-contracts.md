# API Contracts

Base URL: `/api/v1/agro`

## 1) Reference and Master Data

### `GET /commodities`

Returns supported commodities and metadata.

### `GET /markets`

Query params:
- `region`
- `type` (`mandi`, `wholesale`, `retail`, `export_hub`)

## 2) Ingestion APIs

### `POST /ingest/mandi-prices`

Payload:

```json
{
  "commodityCode": "TOMATO",
  "marketName": "Azadpur",
  "priceMin": 10.0,
  "priceMax": 13.5,
  "priceModal": 11.7,
  "observedAt": "2026-04-27T15:00:00Z",
  "source": "agmarknet"
}
```

### `POST /ingest/weather`

Payload:

```json
{
  "region": "Nashik",
  "forecastDate": "2026-04-28",
  "maxTempC": 37.2,
  "minTempC": 24.1,
  "humidityPct": 74.0,
  "rainfallMm": 6.2,
  "riskLevel": "medium",
  "source": "openweather"
}
```

## 3) Intelligence APIs

### `GET /intelligence/procurement-window`

Query:
- `commodityCode`
- `sourceRegion`

Returns:
- harvest timing recommendation
- quality risk
- best procurement slots

### `GET /intelligence/storage-plan`

Query:
- `commodityCode`
- `quantityTons`
- `region`

Returns:
- cold vs dry recommendation
- max holding days
- spoilage risk

### `GET /intelligence/market-signal`

Query:
- `commodityCode`
- `sourceRegion`
- `targetMarket`

Returns:
- action (`BUY|SELL|HOLD`)
- confidence
- expected margin range

## 4) Recommendation APIs

### `POST /recommendations/generate`

Payload:

```json
{
  "commodityCode": "ONION",
  "sourceRegion": "Nashik",
  "targetMarket": "Delhi",
  "quantityTons": 20
}
```

Returns full recommendation packet.

### `GET /recommendations/latest`

Query:
- `commodityCode`
- `limit` (default 20)

## 5) Outcome and Learning APIs

### `POST /recommendations/{id}/outcome`

Payload:

```json
{
  "executed": true,
  "executedQtyTons": 18.5,
  "realizedBuyAvg": 12.1,
  "realizedSellAvg": 15.4,
  "realizedMargin": 3.3,
  "spoilagePct": 1.9,
  "notes": "Dispatch delayed by 4 hours due to traffic"
}
```

## 6) SEO Agent APIs

### `POST /seo/jobs`

Create content generation task.

### `GET /seo/jobs`

List SEO content pipeline and metrics.

## Response Envelope

All endpoints return:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```
