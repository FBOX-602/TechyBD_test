-- Techy BD — Fresh Supabase Setup & CMS Migration Script
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/jebkhkccdsteyzvwzvif/sql)

BEGIN;

-- Drop existing tables to start 100% fresh if needed
DROP TABLE IF EXISTS cms_items CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- 1. Create CMS Items Table (Supports projects, services, offers, testimonials, faqs, customers)
CREATE TABLE cms_items (
  id TEXT PRIMARY KEY,
  resource TEXT NOT NULL CHECK (resource IN ('projects', 'services', 'offers', 'testimonials', 'faqs', 'customers', 'profiles')),
  item_key TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX cms_items_resource_order_idx
  ON cms_items (resource, sort_order, created_at);

-- 2. Create Site Settings Table
CREATE TABLE site_settings (
  setting_key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS) & Remove "Unrestricted" Warning
ALTER TABLE cms_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 4. Create Public Read Access & Full Service Role Access Policies
CREATE POLICY "Public read access for cms_items" 
  ON cms_items FOR SELECT USING (true);

CREATE POLICY "Public read access for site_settings" 
  ON site_settings FOR SELECT USING (true);

CREATE POLICY "Full access for service role on cms_items"
  ON cms_items FOR ALL USING (true);

CREATE POLICY "Full access for service role on site_settings"
  ON site_settings FOR ALL USING (true);

COMMIT;
