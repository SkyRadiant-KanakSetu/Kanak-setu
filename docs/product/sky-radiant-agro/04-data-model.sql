-- Sky Radiant Agro: Core Data Model

create table if not exists commodities (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  category text not null check (category in ('fruit', 'vegetable')),
  default_shelf_life_days int not null,
  created_at timestamptz not null default now()
);

create table if not exists markets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text not null,
  type text not null check (type in ('mandi', 'wholesale', 'retail', 'export_hub')),
  created_at timestamptz not null default now()
);

create table if not exists mandi_prices (
  id uuid primary key default gen_random_uuid(),
  commodity_id uuid not null references commodities(id),
  market_id uuid not null references markets(id),
  price_min numeric(12,2) not null,
  price_max numeric(12,2) not null,
  price_modal numeric(12,2) not null,
  unit text not null default 'INR_PER_KG',
  observed_at timestamptz not null,
  source text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_mandi_prices_lookup
  on mandi_prices (commodity_id, market_id, observed_at desc);

create table if not exists weather_snapshots (
  id uuid primary key default gen_random_uuid(),
  region text not null,
  forecast_date date not null,
  max_temp_c numeric(5,2),
  min_temp_c numeric(5,2),
  humidity_pct numeric(5,2),
  rainfall_mm numeric(8,2),
  risk_level text not null check (risk_level in ('low', 'medium', 'high')),
  source text not null,
  created_at timestamptz not null default now()
);

create table if not exists quality_specs (
  id uuid primary key default gen_random_uuid(),
  commodity_id uuid not null references commodities(id),
  grade text not null check (grade in ('A', 'B', 'C')),
  parameter text not null,
  min_value text,
  max_value text,
  checklist_note text,
  created_at timestamptz not null default now()
);

create table if not exists storage_profiles (
  id uuid primary key default gen_random_uuid(),
  commodity_id uuid not null references commodities(id),
  mode text not null check (mode in ('cold', 'dry')),
  temp_range text,
  humidity_range text,
  max_days int not null,
  spoilage_risk_note text,
  created_at timestamptz not null default now()
);

create table if not exists logistics_quotes (
  id uuid primary key default gen_random_uuid(),
  source_region text not null,
  destination_region text not null,
  vehicle_type text not null,
  estimated_cost_inr numeric(12,2) not null,
  transit_hours int not null,
  cold_chain_supported boolean not null default false,
  observed_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  commodity_id uuid not null references commodities(id),
  source_region text not null,
  target_market text not null,
  action text not null check (action in ('BUY', 'SELL', 'HOLD')),
  confidence numeric(4,3) not null,
  expected_margin_min numeric(12,2),
  expected_margin_max numeric(12,2),
  risk_flags jsonb not null default '[]'::jsonb,
  assumptions jsonb not null default '[]'::jsonb,
  payload jsonb not null,
  valid_until timestamptz not null,
  created_by_agent text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_recommendations_valid
  on recommendations (commodity_id, created_at desc, valid_until);

create table if not exists recommendation_outcomes (
  id uuid primary key default gen_random_uuid(),
  recommendation_id uuid not null references recommendations(id) on delete cascade,
  executed boolean not null default false,
  executed_qty_tons numeric(12,3),
  realized_buy_avg numeric(12,2),
  realized_sell_avg numeric(12,2),
  realized_margin numeric(12,2),
  spoilage_pct numeric(5,2),
  notes text,
  recorded_at timestamptz not null default now()
);

create table if not exists seo_content_jobs (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  target_persona text not null,
  primary_keyword text not null,
  secondary_keywords jsonb not null default '[]'::jsonb,
  status text not null check (status in ('planned', 'drafted', 'published', 'measured')),
  url text,
  impressions int default 0,
  clicks int default 0,
  created_at timestamptz not null default now()
);
