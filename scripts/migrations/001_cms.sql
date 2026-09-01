BEGIN;

CREATE TABLE IF NOT EXISTS cms_items (
  id UUID PRIMARY KEY,
  resource TEXT NOT NULL CHECK (resource IN ('projects', 'services', 'offers', 'testimonials', 'faqs')),
  item_key TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT cms_items_resource_key_unique UNIQUE (resource, item_key)
);

CREATE INDEX IF NOT EXISTS cms_items_resource_order_idx
  ON cms_items (resource, sort_order, created_at);

CREATE TABLE IF NOT EXISTS site_settings (
  setting_key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS) to remove UNRESTRICTED warning in Supabase
ALTER TABLE cms_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read-only access via Supabase API
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cms_items' AND policyname = 'Public read access for cms_items') THEN
    CREATE POLICY "Public read access for cms_items" ON cms_items FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Public read access for site_settings') THEN
    CREATE POLICY "Public read access for site_settings" ON site_settings FOR SELECT USING (true);
  END IF;
END $$;

COMMIT;
