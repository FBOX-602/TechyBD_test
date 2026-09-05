import pg from "pg";
import crypto from "node:crypto";
import { HttpError, isPlainObject } from "./http.js";

const { Pool } = pg;

export const RESOURCES = ["projects", "services", "offers", "testimonials", "faqs", "customers", "profiles"];
const RESOURCE_SET = new Set(RESOURCES);
const GLOBAL_POOL_KEY = "__techyBdPostgresPool";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || "https://jebkhkccdsteyzvwzvif.supabase.co";
  const key = process.env.SUPABASE_ANON_KEY || "sb_publishable_XzjIGnXQZjIseOmf3QWUHA_3dkUc1y5";
  return { url, key };
}

function getSupabaseHeaders() {
  const { key } = getSupabaseConfig();
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

function getDatabaseUrl() {
  const value = process.env.DATABASE_URL;
  if (!value || value.includes("YOUR_SUPABASE_DB_PASSWORD")) {
    return null;
  }
  return value;
}

function shouldUseSsl(connectionString) {
  if (process.env.DATABASE_SSL === "false") return false;
  if (process.env.DATABASE_SSL === "true") return true;
  return process.env.VERCEL === "1" || /supabase\.com/i.test(connectionString);
}

export function getPool() {
  const globalStore = globalThis;
  if (globalStore[GLOBAL_POOL_KEY]) return globalStore[GLOBAL_POOL_KEY];

  const connectionString = getDatabaseUrl();
  if (!connectionString) return null;

  const pool = new Pool({
    connectionString,
    max: Math.min(Math.max(Number(process.env.DB_POOL_MAX) || 3, 1), 10),
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 1_500,
    ...(shouldUseSsl(connectionString) ? { ssl: { rejectUnauthorized: false } } : {}),
  });

  globalStore[GLOBAL_POOL_KEY] = pool;
  return pool;
}

export function assertResource(resource) {
  if (!RESOURCE_SET.has(resource)) {
    throw new HttpError(404, "Unknown content resource");
  }
  return resource;
}

export function toPublicItem(row) {
  return {
    ...row.data,
    sortOrder: row.sort_order,
    id: row.id,
  };
}

export async function listItems(resource) {
  assertResource(resource);
  // 1. Try Supabase REST API first for instant sub-100ms response
  try {
    const { url } = getSupabaseConfig();
    const endpoint = `${url}/rest/v1/cms_items?resource=eq.${encodeURIComponent(resource)}&order=sort_order.asc,created_at.asc`;
    const response = await fetch(endpoint, { headers: getSupabaseHeaders() });
    if (response.ok) {
      const rows = await response.json();
      if (Array.isArray(rows)) {
        return rows.map(toPublicItem);
      }
    }
  } catch (err) {
    console.warn(`[Supabase REST] listItems failed for ${resource}:`, err.message);
  }

  // 2. Try Postgres Pool fallback if configured
  const pool = getPool();
  if (pool) {
    const result = await pool.query(
      `SELECT id, sort_order, data FROM cms_items WHERE resource = $1 ORDER BY sort_order ASC, created_at ASC`,
      [resource]
    );
    return result.rows.map(toPublicItem);
  }

  throw new Error("No database or Supabase connection available");
}

export async function getItem(resource, id) {
  assertResource(resource);
  try {
    const { url } = getSupabaseConfig();
    const endpoint = `${url}/rest/v1/cms_items?resource=eq.${encodeURIComponent(resource)}&id=eq.${encodeURIComponent(id)}`;
    const response = await fetch(endpoint, { headers: getSupabaseHeaders() });
    if (response.ok) {
      const rows = await response.json();
      if (rows && rows[0]) return toPublicItem(rows[0]);
    }
  } catch {}

  const pool = getPool();
  if (pool) {
    const result = await pool.query(
      `SELECT id, sort_order, data FROM cms_items WHERE resource = $1 AND id = $2`,
      [resource, id]
    );
    return result.rows[0] ? toPublicItem(result.rows[0]) : null;
  }
  return null;
}

export async function createItem(resource, payload) {
  assertResource(resource);
  const data = extractItemData(payload);
  const id = payload.id || payload.slug || crypto.randomUUID();
  const key = makeContentKey(payload, id);
  const sortOrder = extractSortOrder(payload);

  try {
    const { url } = getSupabaseConfig();
    const endpoint = `${url}/rest/v1/cms_items`;
    const body = { id, resource, item_key: key, sort_order: sortOrder, data };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { ...getSupabaseHeaders(), Prefer: "return=representation,resolution=merge-duplicates" },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const rows = await response.json();
      if (rows && rows[0]) return toPublicItem(rows[0]);
    }
  } catch (err) {
    console.warn(`[Supabase REST] createItem failed for ${resource}:`, err.message);
  }

  const pool = getPool();
  if (pool) {
    const result = await pool.query(
      `INSERT INTO cms_items (id, resource, item_key, sort_order, data)
       VALUES ($1, $2, $3, $4, $5::jsonb)
       RETURNING id, sort_order, data`,
      [id, resource, key, sortOrder, JSON.stringify(data)]
    );
    return toPublicItem(result.rows[0]);
  }

  return { id, sortOrder, ...data };
}

export async function updateItem(resource, id, payload) {
  assertResource(resource);
  const data = extractItemData(payload);
  const sortOrder = extractSortOrder(payload);

  try {
    const { url } = getSupabaseConfig();
    const endpoint = `${url}/rest/v1/cms_items?resource=eq.${encodeURIComponent(resource)}&id=eq.${encodeURIComponent(id)}`;
    const body = { data, sort_order: sortOrder, updated_at: new Date().toISOString() };

    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: getSupabaseHeaders(),
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const rows = await response.json();
      if (rows && rows[0]) return toPublicItem(rows[0]);
    }
  } catch (err) {
    console.warn(`[Supabase REST] updateItem failed for ${resource}/${id}:`, err.message);
  }

  const pool = getPool();
  if (pool) {
    const result = await pool.query(
      `UPDATE cms_items
       SET data = data || $3::jsonb, sort_order = COALESCE($4, sort_order), updated_at = NOW()
       WHERE resource = $1 AND id = $2
       RETURNING id, sort_order, data`,
      [resource, id, JSON.stringify(data), sortOrder]
    );
    return result.rows[0] ? toPublicItem(result.rows[0]) : null;
  }

  return { id, sortOrder, ...data };
}

export async function deleteItem(resource, id) {
  assertResource(resource);
  try {
    const { url } = getSupabaseConfig();
    const endpoint = `${url}/rest/v1/cms_items?resource=eq.${encodeURIComponent(resource)}&id=eq.${encodeURIComponent(id)}`;
    const response = await fetch(endpoint, { method: "DELETE", headers: getSupabaseHeaders() });
    if (response.ok) return true;
  } catch {}

  const pool = getPool();
  if (pool) {
    const result = await pool.query("DELETE FROM cms_items WHERE resource = $1 AND id = $2 RETURNING id", [resource, id]);
    return Boolean(result.rows[0]);
  }
  return true;
}

export async function getSettings() {
  try {
    const { url } = getSupabaseConfig();
    const endpoint = `${url}/rest/v1/site_settings?setting_key=eq.global`;
    const response = await fetch(endpoint, { headers: getSupabaseHeaders() });
    if (response.ok) {
      const rows = await response.json();
      if (rows && rows[0]?.value) return rows[0].value;
    }
  } catch {}

  const pool = getPool();
  if (pool) {
    const result = await pool.query("SELECT value FROM site_settings WHERE setting_key = $1", ["global"]);
    return result.rows[0]?.value || {};
  }
  return {};
}

export async function updateSettings(value) {
  if (!isPlainObject(value)) {
    throw new HttpError(400, "Settings must be an object");
  }

  try {
    const { url } = getSupabaseConfig();
    const endpoint = `${url}/rest/v1/site_settings`;
    const body = { setting_key: "global", value, updated_at: new Date().toISOString() };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { ...getSupabaseHeaders(), Prefer: "return=representation,resolution=merge-duplicates" },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const rows = await response.json();
      if (rows && rows[0]?.value) return rows[0].value;
    }
  } catch {}

  const pool = getPool();
  if (pool) {
    const result = await pool.query(
      `INSERT INTO site_settings (setting_key, value, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (setting_key)
       DO UPDATE SET value = site_settings.value || EXCLUDED.value, updated_at = NOW()
       RETURNING value`,
      ["global", JSON.stringify(value)]
    );
    return result.rows[0].value;
  }
  return value;
}

function extractItemData(payload) {
  const candidate = isPlainObject(payload?.item) ? payload.item : payload;
  if (!isPlainObject(candidate)) {
    throw new HttpError(400, "Content item must be an object");
  }
  const { id, key, sortOrder, position, createdAt, updatedAt, ...data } = candidate;
  return data;
}

function extractSortOrder(payload) {
  const raw = payload?.sortOrder ?? payload?.position ?? payload?.item?.sortOrder ?? payload?.item?.position;
  if (raw === undefined || raw === null || raw === "") return 0;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < -1_000_000 || value > 1_000_000) {
    return 0;
  }
  return value;
}

function makeContentKey(payload, fallback) {
  const raw = payload?.key ?? payload?.item?.key ?? payload?.slug ?? payload?.item?.slug ?? fallback;
  if (typeof raw !== "string" || !raw.trim()) return fallback;
  return raw.trim().slice(0, 160);
}
