import * as defaults from "../../src/data.js";

const GLOBAL_STORE_KEY = "__techyBdMemoryStore";

function getInitialStore() {
  const globalStore = globalThis;
  if (!globalStore[GLOBAL_STORE_KEY]) {
    const faqList = (defaults.faqItems || []).map((item, idx) => ({
      id: `faq-${idx}`,
      question: Array.isArray(item) ? item[0] : item.question,
      answer: Array.isArray(item) ? item[1] : item.answer,
    }));

    globalStore[GLOBAL_STORE_KEY] = {
      projects: (defaults.projects || []).map((p, idx) => ({ id: p.id || p.slug || `proj-${idx}`, ...p })),
      services: (defaults.services || []).map((s, idx) => ({ id: s.id || s.slug || `serv-${idx}`, ...s })),
      offers: (defaults.offers || []).map((o, idx) => ({ id: o.id || o.slug || `off-${idx}`, ...o })),
      testimonials: (defaults.testimonials || []).map((t, idx) => ({ id: t.id || `test-${idx}`, ...t })),
      customers: (defaults.customers || []).map((c, idx) => ({ id: c.id || `cust-${idx}`, ...c })),
      profiles: (defaults.profiles || []).map((pr, idx) => ({ id: pr.id || `profile-${idx}`, ...pr })),
      faqs: faqList,
    };
  }
  return globalStore[GLOBAL_STORE_KEY];
}

export function getMemoryItems(resource) {
  const store = getInitialStore();
  return store[resource] || [];
}

export function addMemoryItem(resource, item) {
  const store = getInitialStore();
  if (!store[resource]) store[resource] = [];
  const newItem = { id: item.id || `item-${Date.now()}`, ...item };
  store[resource] = [newItem, ...store[resource]];
  return newItem;
}

export function updateMemoryItem(resource, id, payload) {
  const store = getInitialStore();
  if (!store[resource]) store[resource] = [];
  const index = store[resource].findIndex(
    (item) => String(item.id) === String(id) || String(item.slug) === String(id)
  );
  const dataToUpdate = payload.item ? payload.item : payload;
  if (index >= 0) {
    const updated = { ...store[resource][index], ...dataToUpdate, id };
    store[resource][index] = updated;
    return updated;
  }
  const newItem = { id, ...dataToUpdate };
  store[resource].unshift(newItem);
  return newItem;
}

export function deleteMemoryItem(resource, id) {
  const store = getInitialStore();
  if (!store[resource]) return true;
  store[resource] = store[resource].filter(
    (item) => String(item.id) !== String(id) && String(item.slug) !== String(id)
  );
  return true;
}
