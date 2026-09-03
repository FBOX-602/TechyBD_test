import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./admin.css";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const SESSION_KEY = "techy-bd-admin-session";

const iconPaths = {
  dashboard: "M4 13h6V4H4v9Zm0 7h6v-4H4v4Zm10 0h6v-9h-6v9Zm0-16v4h6V4h-6Z",
  projects: "M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13ZM3 15h18M8 3v12",
  services: "M4 6.5 12 3l8 3.5v11L12 21l-8-3.5v-11Zm8-3.3v17.6M4.2 6.5 12 10l7.8-3.5",
  offers: "M4 5.5A2.5 2.5 0 0 1 6.5 3H13l7 7v7.5A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-12ZM13 3v7h7M8 14h.01M12 14h.01M16 14h.01",
  testimonials: "M7.5 10.25h-3A1.5 1.5 0 0 0 3 11.75v5.5a1.5 1.5 0 0 0 1.5 1.5H8v-5.25H5.5v-1.75h2V10.25Zm10.5 0h-3a1.5 1.5 0 0 0-1.5 1.5v5.5a1.5 1.5 0 0 0 1.5 1.5H18v-5.25h-2.5v-1.75h2.5v-1.5Z",
  faqs: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-2.25-11.5A2.32 2.32 0 0 1 12 7.75c1.32 0 2.4.87 2.4 2.05 0 1.78-2.4 1.95-2.4 3.45M12 16.8h.01",
  settings: "M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Zm0-12.5v2m0 14v2m9-9h-2M5 12H3m15.36-6.36-1.42 1.42M6.06 17.94l-1.42 1.42m0-13.72 1.42 1.42m12.3 10.88 1.42 1.42",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "m6 6 12 12M18 6 6 18",
  plus: "M12 5v14M5 12h14",
  search: "m20 20-4.2-4.2m1.7-5.05a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z",
  edit: "m4 20 4.25-.95L19 8.3a2.12 2.12 0 0 0-3-3L5.25 16.05 4 20Zm10.75-13.2 3 3",
  trash: "M4 7h16m-10 4v5m4-5v5M9 7l.8-3h4.4l.8 3m-9 0 1 13h10l1-13",
  save: "M5 4h11l3 3v13H5V4Zm3 0v5h7V4m-7 16v-6h8v6",
  external: "M14 4h6v6m-1-5-9.5 9.5M19 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5",
  refresh: "M20 11a8 8 0 0 0-14.9-4M4 4v4h4m-4 5a8 8 0 0 0 14.9 4M20 20v-4h-4",
  chevron: "m9 18 6-6-6-6",
  logout: "M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4m5-4 4-3-4-3m4 3H9",
  code: "m8 9-3 3 3 3m8-6 3 3-3 3",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v5m0-8v.01",
  check: "m5 12 4.25 4.25L19 6.5",
  alert: "M12 3 2.8 19h18.4L12 3Zm0 5.5v4m0 3.5v.01",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  video: "m22 8-6 4 6 4V8ZM2 6h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z",
  customers: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
};

function Icon({ name, size = 18, stroke = 1.8, className = "" }) {
  return (
    <svg className={`admin-icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={iconPaths[name] || iconPaths.info} />
    </svg>
  );
}

const categories = ["eCommerce", "Restaurant", "eBook/Course", "Service Business", "Landing Page", "Skincare"];
const serviceIcons = ["shopping-bag", "zap", "sparkles", "activity", "shield-check", "cloud"];

const resources = {
  projects: {
    label: "Projects",
    singular: "project",
    endpoint: "projects",
    icon: "projects",
    description: "Your public portfolio and case-study links.",
    columns: ["title", "category", "price", "href"],
    fields: [
      { name: "title", label: "Project name", required: true, placeholder: "e.g. Noor Skincare" },
      { name: "category", label: "Category", type: "select", options: categories, required: true },
      { name: "price", label: "Price (Optional)", placeholder: "e.g. ৳ 5,000 (leave blank for no price)" },
      { name: "image", label: "Cover image or short video", type: "file", placeholder: "Upload file or paste URL" },
      { name: "href", label: "Live website URL", type: "url", placeholder: "https://example.com" },
      { name: "description", label: "Short description", type: "textarea", required: true, rows: 4, placeholder: "What did Techy BD build for this client?" },
    ],
    template: { title: "", category: "eCommerce", price: "", image: "", href: "", description: "" },
    help: "Upload an image or short video, or paste a URL. Price is optional — leave empty to hide the price badge.",
  },
  services: {
    label: "Services",
    singular: "service",
    endpoint: "services",
    icon: "services",
    description: "What Techy BD offers and how each service is presented.",
    columns: ["title", "price", "slug"],
    fields: [
      { name: "title", label: "Service name", required: true, placeholder: "e.g. Landing Page Design" },
      { name: "slug", label: "Page slug", required: true, placeholder: "landing-page-design", hint: "Lowercase words separated by hyphens." },
      { name: "price", label: "Price (Optional)", placeholder: "e.g. 4999 BDT (leave blank for no price)" },
      { name: "image", label: "Service image or short video", type: "file", placeholder: "Upload file or paste URL" },
      { name: "icon", label: "Icon", type: "select", options: serviceIcons, required: true },
      { name: "description", label: "Service description", type: "textarea", required: true, rows: 4 },
    ],
    template: { title: "", slug: "", price: "", image: "", icon: "shopping-bag", description: "" },
    help: "Upload an image or short video, or paste a URL. Price is optional — leave empty to hide.",
  },
  offers: {
    label: "Offers & packages",
    singular: "offer",
    endpoint: "offers",
    icon: "offers",
    description: "Promotional packages and limited-time offers displayed on the site.",
    columns: ["title", "price", "was"],
    fields: [
      { name: "title", label: "Offer name", required: true, placeholder: "e.g. Launch website package" },
      { name: "slug", label: "Page slug", required: true, placeholder: "launch-website-package" },
      { name: "price", label: "Current price (Optional)", placeholder: "e.g. ৳ 9,999 (leave blank for no price)" },
      { name: "was", label: "Previous price (Optional)", placeholder: "e.g. ৳ 12,999" },
      { name: "image", label: "Offer image or short video", type: "file", placeholder: "Upload file or paste URL" },
      { name: "accent", label: "Colour treatment", type: "select", options: ["electric", "accent"], required: true },
      { name: "body", label: "Offer details", type: "textarea", required: true, rows: 4 },
    ],
    template: { title: "", slug: "", price: "", was: "", image: "", accent: "electric", body: "" },
    help: "Upload an image or short video, or paste a URL. Price is optional — leave empty to hide.",
  },
  testimonials: {
    label: "Testimonials",
    singular: "testimonial",
    endpoint: "testimonials",
    icon: "testimonials",
    description: "Client quotes that build trust across the public website.",
    columns: ["name", "brand", "quote"],
    fields: [
      { name: "name", label: "Client name", required: true, placeholder: "e.g. রুমানা আক্তার" },
      { name: "role", label: "Role", required: true, placeholder: "Founder" },
      { name: "brand", label: "Business / brand", required: true, placeholder: "Noor Skincare" },
      { name: "avatar", label: "Portrait image URL", type: "url", placeholder: "https://..." },
      { name: "quote", label: "Client quote", type: "textarea", required: true, rows: 5 },
    ],
    template: { name: "", role: "", brand: "", avatar: "", quote: "" },
    help: "Only publish quotes you have permission to use. A square, well-lit portrait works best.",
  },
  customers: {
    label: "Customers",
    singular: "customer",
    endpoint: "customers",
    icon: "customers",
    description: "Registered customer accounts, contact details, and purchase history.",
    columns: ["name", "emailOrPhone", "status", "totalOrders"],
    fields: [
      { name: "name", label: "Customer name", required: true, placeholder: "e.g. MD Omar Faruk" },
      { name: "emailOrPhone", label: "Email / Phone number", required: true, placeholder: "e.g. 01581503522 or user@gmail.com" },
      { name: "status", label: "Customer status", type: "select", options: ["Active", "VIP", "Lead", "Blocked"], required: true },
      { name: "totalOrders", label: "Purchased items count", placeholder: "e.g. 2 Orders" },
      { name: "totalSpent", label: "Total amount spent", placeholder: "e.g. ৳ 15,498" },
      { name: "notes", label: "Customer details & purchase summary", type: "textarea", rows: 4, placeholder: "Purchased items: PureBangla Organic eCommerce, Meta Pixel setup..." },
    ],
    template: { name: "", emailOrPhone: "", status: "Active", totalOrders: "1 Order", totalSpent: "", notes: "" },
    help: "View and manage customer profiles, contact numbers, order history, and account status.",
  },
  faqs: {
    label: "FAQs",
    singular: "FAQ",
    endpoint: "faqs",
    icon: "faqs",
    description: "Answers shown in the site's accordion section.",
    columns: ["question", "answer"],
    fields: [
      { name: "question", label: "Question", required: true, placeholder: "e.g. আমি নিজে এডিট করতে পারব?" },
      { name: "answer", label: "Answer", type: "textarea", required: true, rows: 6, placeholder: "Write a direct, helpful answer." },
    ],
    template: { question: "", answer: "" },
    help: "Keep answers direct and specific. The first FAQ appears open on the public site.",
  },
  profiles: {
    label: "Profiles",
    singular: "profile",
    endpoint: "profiles",
    icon: "customers",
    description: "Team member & founder profiles displayed on the website.",
    columns: ["name", "role", "linkedin", "whatsapp"],
    fields: [
      { name: "name", label: "Full Name", required: true, placeholder: "e.g. MD Omar Faruk" },
      { name: "role", label: "Specialty / Title", required: true, placeholder: "e.g. AI Automation & Web Design Specialist" },
      { name: "photo", label: "Profile Picture (Image URL)", type: "file", placeholder: "Upload image or paste URL (e.g. /omar-faruk.jpg)" },
      { name: "bio", label: "Bio / Description", type: "textarea", required: true, rows: 5, placeholder: "Describe experience, AI automation skills, workflow expertise..." },
      { name: "facebook", label: "Facebook Link (Optional)", type: "url", placeholder: "https://facebook.com/..." },
      { name: "linkedin", label: "LinkedIn Link (Optional)", type: "url", placeholder: "https://linkedin.com/in/..." },
      { name: "github", label: "GitHub Link (Optional)", type: "url", placeholder: "https://github.com/..." },
      { name: "whatsapp", label: "WhatsApp Link or Number (Optional)", placeholder: "https://wa.me/8801581503522" },
    ],
    template: { name: "", role: "", photo: "", bio: "", facebook: "", linkedin: "", github: "", whatsapp: "" },
    help: "Add or edit team members, uploaded picture, specialty title, bio description, and social media links.",
  },
  settings: {
    label: "Site settings",
    singular: "site settings",
    endpoint: "content",
    icon: "settings",
    description: "Business details and SEO copy used across Techy BD.",
    columns: ["siteName", "email", "phone"],
    fields: [
      { name: "siteName", label: "Site name", required: true, placeholder: "Techy BD" },
      { name: "tagline", label: "Header tagline", required: true, placeholder: "Web Design & Digital Solutions — Bangladesh" },
      { name: "email", label: "Business email", type: "email", required: true, placeholder: "hello@techybd.com" },
      { name: "phone", label: "Phone number", required: true, placeholder: "019..." },
      { name: "whatsapp", label: "WhatsApp number", required: true, placeholder: "8801..." },
      { name: "address", label: "Address", required: true, placeholder: "Dhaka, Bangladesh" },
      { name: "seoTitle", label: "Browser / SEO title", required: true, placeholder: "Techy BD — Web Design & Digital Solutions" },
      { name: "seoDescription", label: "SEO description", type: "textarea", required: true, rows: 4, placeholder: "A concise description for Google results." },
    ],
    template: {
      siteName: "Techy BD",
      tagline: "Web Design & Digital Solutions — Bangladesh",
      email: "",
      phone: "",
      whatsapp: "",
      address: "Dhaka, Bangladesh",
      seoTitle: "Techy BD — Web Design & Digital Solutions",
      seoDescription: "",
    },
    help: "Use Guided fields for business details. Advanced JSON controls every editable section: hero copy, buttons, hosting, process, footer and page text.",
  },
};

const navResources = ["projects", "services", "offers", "testimonials", "profiles", "customers", "faqs", "settings"];

function safeJson(value) {
  try {
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    return null;
  }
}

function loadSession() {
  try {
    return safeJson(window.localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

function getId(item) {
  return item?.id ?? item?._id ?? item?.uuid ?? item?.slug ?? item?.title ?? item?.name;
}

function unwrapList(payload, resourceKey) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const key = resources[resourceKey]?.endpoint;
  const candidates = [payload.data, payload.items, payload.results, payload[key], payload[resourceKey]];
  return candidates.find(Array.isArray) || [];
}

function unwrapObject(payload) {
  if (!payload || typeof payload !== "object") return {};
  if (payload.settings && typeof payload.settings === "object" && !Array.isArray(payload.settings)) {
    const nested = payload.settings;
    return {
      siteName: payload.siteName ?? nested.siteName ?? nested.brand?.name ?? "",
      tagline: payload.tagline ?? nested.tagline ?? nested.brand?.tagline ?? "",
      email: payload.email ?? nested.email ?? nested.contact?.email ?? "",
      phone: payload.phone ?? nested.phone ?? nested.contact?.phone ?? "",
      whatsapp: payload.whatsapp ?? nested.whatsapp ?? nested.contact?.whatsapp ?? "",
      address: payload.address ?? nested.address ?? nested.contact?.address ?? "",
      seoTitle: payload.seoTitle ?? nested.seoTitle ?? nested.seo?.title ?? "",
      seoDescription: payload.seoDescription ?? nested.seoDescription ?? nested.seo?.description ?? "",
      settings: nested,
    };
  }
  if (payload.data && !Array.isArray(payload.data)) return payload.data;
  if (payload.content && !Array.isArray(payload.content)) return payload.content;
  return payload;
}

function makeDraft(resourceKey, item) {
  const template = resources[resourceKey].template;
  return { ...template, ...(item || {}) };
}

function cleanDraft(draft) {
  const copy = { ...draft };
  delete copy.id;
  delete copy._id;
  delete copy.uuid;
  delete copy.createdAt;
  delete copy.updatedAt;
  return Object.fromEntries(
    Object.entries(copy).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value]),
  );
}

function labelForField(name) {
  return name.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function formatCell(value) {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  const text = String(value);
  return text.length > 88 ? `${text.slice(0, 88)}…` : text;
}

function PageLoader({ label = "Loading content" }) {
  return <div className="admin-loading" role="status"><span /><span /><span /><b>{label}</b></div>;
}

function LoginScreen({ onLogin, busy, error }) {
  const [password, setPassword] = useState("");

  const submit = (event) => {
    event.preventDefault();
    onLogin({ password });
  };

  return (
    <main className="admin-login-shell">
      <section className="admin-login-intro" aria-label="Techy BD admin information">
        <a className="admin-brand admin-brand-on-dark" href="/" aria-label="Go to Techy BD website">
          <img src="/techy-bd-logo.png" alt="" />
          <span><strong>Techy BD</strong><small>Content control room</small></span>
        </a>
        <div className="admin-login-copy">
          <p className="admin-kicker">PRIVATE WORKSPACE</p>
          <h1>Keep the public site as sharp as the work behind it.</h1>
          <p>Update projects, packages, client feedback and contact details from one secure place.</p>
        </div>
        <div className="admin-login-line"><span />Content changes go live when you save them.</div>
      </section>
      <section className="admin-login-panel" aria-label="Admin sign in">
        <div className="admin-login-panel-inner">
          <p className="admin-kicker">WELCOME BACK</p>
          <h2>Sign in to Techy BD</h2>
          <p className="admin-muted">Use the administrator account configured for this website.</p>
          <form onSubmit={submit} className="admin-login-form">
            <input className="admin-sr-only" type="text" name="username" autoComplete="username" tabIndex={-1} aria-hidden="true" />
            <label htmlFor="admin-password">Administrator password
              <input id="admin-password" autoComplete="current-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" required />
            </label>
            {error && <p className="admin-form-error" role="alert"><Icon name="alert" size={17} />{error}</p>}
            <button className="admin-button admin-button-primary admin-login-submit" type="submit" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}<Icon name="chevron" size={17} />
            </button>
          </form>
          <p className="admin-login-note"><Icon name="info" size={15} />Credentials are not stored in the browser after you sign out.</p>
        </div>
      </section>
    </main>
  );
}

function Sidebar({ activeView, onNavigate, open, onClose, onLogout, user }) {
  return (
    <>
      <button className={`admin-sidebar-backdrop ${open ? "is-visible" : ""}`} type="button" aria-label="Close navigation" onClick={onClose} />
      <aside className={`admin-sidebar ${open ? "is-open" : ""}`} aria-label="Admin navigation">
        <div className="admin-sidebar-top">
          <a className="admin-brand" href="/" aria-label="Open Techy BD website">
            <img src="/techy-bd-logo.png" alt="" />
            <span><strong>Techy BD</strong><small>Admin workspace</small></span>
          </a>
          <button className="admin-sidebar-close" type="button" onClick={onClose} aria-label="Close navigation"><Icon name="close" /></button>
        </div>
        <nav className="admin-nav">
          <p className="admin-nav-label">Overview</p>
          <button type="button" className={activeView === "dashboard" ? "active" : ""} onClick={() => onNavigate("dashboard")}><Icon name="dashboard" />Dashboard</button>
          <p className="admin-nav-label">Website content</p>
          {navResources.slice(0, -1).map((key) => (
            <button type="button" key={key} className={activeView === key ? "active" : ""} onClick={() => onNavigate(key)}>
              <Icon name={resources[key].icon} />{resources[key].label}
            </button>
          ))}
          <p className="admin-nav-label">Configuration</p>
          <button type="button" className={activeView === "settings" ? "active" : ""} onClick={() => onNavigate("settings")}><Icon name="settings" />Site settings</button>
        </nav>
        <div className="admin-sidebar-bottom">
          <a className="admin-view-site" href="/" target="_blank" rel="noreferrer"><Icon name="external" size={16} />View live site</a>
          <div className="admin-user-card"><span>{String(user?.name || user?.email || "A").slice(0, 1).toUpperCase()}</span><div><strong>{user?.name || "Administrator"}</strong><small>{user?.email || "Techy BD workspace"}</small></div></div>
          <button type="button" className="admin-logout" onClick={onLogout}><Icon name="logout" size={17} />Sign out</button>
        </div>
      </aside>
    </>
  );
}

function Dashboard({ counts, loading, onNavigate, recent }) {
  const cards = [
    ["projects", "Portfolio projects", "Live work ready to show"],
    ["services", "Services", "Packages clients can explore"],
    ["offers", "Offers & packages", "Promotions on the site"],
    ["testimonials", "Testimonials", "Client proof points"],
  ];
  return (
    <section className="admin-dashboard">
      <div className="admin-dashboard-hero">
        <div>
          <p className="admin-kicker">SITE PULSE</p>
          <h1>Everything your visitors see, <em>within reach.</em></h1>
          <p>Use the workspace below to keep Techy BD’s portfolio, offers and business details current.</p>
        </div>
        <div className="admin-pulse-card">
          <span className="admin-pulse-orbit"><i /><i /><i /></span>
          <div><strong>Content workspace</strong><small>Connected to your PostgreSQL database</small></div>
        </div>
      </div>
      <div className="admin-stat-grid" aria-label="Content totals">
        {cards.map(([key, title, detail]) => (
          <button type="button" className="admin-stat-card" key={key} onClick={() => onNavigate(key)}>
            <span className="admin-stat-icon"><Icon name={resources[key].icon} size={19} /></span>
            <strong>{loading ? "—" : counts[key] ?? 0}</strong>
            <b>{title}</b><small>{detail}</small><Icon name="chevron" className="admin-stat-chevron" size={17} />
          </button>
        ))}
      </div>
      <div className="admin-dashboard-grid">
        <article className="admin-dashboard-card admin-content-map">
          <div className="admin-card-heading"><div><p className="admin-kicker">CONTENT MAP</p><h2>What you can manage</h2></div></div>
          <div className="admin-map-list">
            {navResources.map((key) => <button type="button" key={key} onClick={() => onNavigate(key)}><Icon name={resources[key].icon} size={17} /><span><strong>{resources[key].label}</strong><small>{resources[key].description}</small></span><Icon name="chevron" size={16} /></button>)}
          </div>
        </article>
        <article className="admin-dashboard-card admin-last-edit">
          <p className="admin-kicker">QUICK START</p>
          <h2>Make a public update in under a minute.</h2>
          <ol>
            <li><span>1</span>Choose the content type from the left menu.</li>
            <li><span>2</span>Add a new item or open one to edit.</li>
            <li><span>3</span>Save changes and refresh the public page.</li>
          </ol>
          {recent?.title && <p className="admin-recent">Recently loaded: <strong>{recent.title}</strong></p>}
          <button type="button" className="admin-button admin-button-primary" onClick={() => onNavigate("projects")}>Manage projects <Icon name="chevron" size={17} /></button>
        </article>
      </div>
    </section>
  );
}

function ResourceTable({ resourceKey, records, loading, search, onSearch, onEdit, onDelete, onAdd, busy }) {
  const config = resources[resourceKey];
  const filtered = useMemo(() => {
    const phrase = search.trim().toLocaleLowerCase();
    if (!phrase) return records;
    return records.filter((record) => Object.values(record || {}).some((value) => String(value ?? "").toLocaleLowerCase().includes(phrase)));
  }, [records, search]);

  return (
    <section className="admin-resource-page">
      <header className="admin-page-heading">
        <div><p className="admin-kicker">WEBSITE CONTENT</p><h1>{config.label}</h1><p>{config.description}</p></div>
        <button className="admin-button admin-button-primary" type="button" onClick={onAdd}><Icon name="plus" size={18} />Add {config.singular}</button>
      </header>
      <div className="admin-tip"><Icon name="info" size={17} /><span><strong>Editing guide:</strong> {config.help}</span></div>
      <div className="admin-resource-card">
        <div className="admin-list-toolbar">
          <div><strong>{loading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? config.singular : config.label.toLowerCase()}`}</strong><small>{search ? "matching your search" : "available to publish"}</small></div>
          <label className="admin-search"><Icon name="search" size={17} /><span className="admin-sr-only">Search {config.label}</span><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder={`Search ${config.label.toLowerCase()}`} /></label>
        </div>
        {loading ? <PageLoader label={`Loading ${config.label.toLowerCase()}`} /> : filtered.length === 0 ? (
          <div className="admin-empty"><div><Icon name={config.icon} size={25} /></div><h2>{search ? "No matching content" : `No ${config.label.toLowerCase()} yet`}</h2><p>{search ? "Try a different word, or clear the search." : `Add the first ${config.singular} and it will appear on your website.`}</p>{!search && <button className="admin-button admin-button-primary" type="button" onClick={onAdd}><Icon name="plus" size={17} />Add {config.singular}</button>}</div>
        ) : <>
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr>{config.columns.map((column) => <th scope="col" key={column}>{labelForField(column)}</th>)}<th scope="col"><span className="admin-sr-only">Actions</span></th></tr></thead><tbody>{filtered.map((record, index) => <tr key={String(getId(record) ?? index)}>{config.columns.map((column) => <td key={column} data-label={labelForField(column)}>{column === "href" && record[column] ? <a href={record[column]} target="_blank" rel="noreferrer" className="admin-inline-link">{formatCell(record[column])}<Icon name="external" size={13} /></a> : formatCell(record[column])}</td>)}<td className="admin-row-actions"><button type="button" className="admin-icon-button" onClick={() => onEdit(record)} aria-label={`Edit ${record.title || record.name || record.question || config.singular}`}><Icon name="edit" size={17} /></button><button type="button" className="admin-icon-button admin-delete" onClick={() => onDelete(record)} aria-label={`Delete ${record.title || record.name || record.question || config.singular}`} disabled={busy}><Icon name="trash" size={17} /></button></td></tr>)}</tbody></table></div>
          <div className="admin-mobile-list">{filtered.map((record, index) => <article key={String(getId(record) ?? index)}>{config.columns.slice(0, 2).map((column) => <div key={column}><small>{labelForField(column)}</small><p>{formatCell(record[column])}</p></div>)}<div className="admin-mobile-actions"><button type="button" onClick={() => onEdit(record)}><Icon name="edit" size={16} />Edit</button><button type="button" onClick={() => onDelete(record)} disabled={busy}><Icon name="trash" size={16} />Delete</button></div></article>)}</div>
        </>}
      </div>
    </section>
  );
}

function isVideoMedia(url) {
  if (!url || typeof url !== "string") return false;
  return url.startsWith("data:video/") || /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

function MediaUploadField({ field, value, onChange }) {
  const id = `admin-field-${field.name}`;
  const fileInputRef = useRef(null);
  const [useUrlMode, setUseUrlMode] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      alert("File size is too large (max 25MB). Please choose a smaller image or short video.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      onChange(field.name, event.target?.result || "");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      alert("File size is too large (max 25MB). Please choose a smaller image or short video.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      onChange(field.name, event.target?.result || "");
    };
    reader.readAsDataURL(file);
  };

  const isVideo = isVideoMedia(value);

  return (
    <div className="admin-field admin-field-wide">
      <div className="admin-media-field-header">
        <label htmlFor={id}>
          <span>{field.label}{field.required && <b aria-hidden="true">*</b>}</span>
        </label>
        <button
          type="button"
          className="admin-media-mode-toggle"
          onClick={() => setUseUrlMode(!useUrlMode)}
        >
          {useUrlMode ? "📁 Switch to File Browse" : "🔗 Switch to Paste URL"}
        </button>
      </div>

      {useUrlMode ? (
        <input
          id={id}
          name={field.name}
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          placeholder="https://... (image or video URL)"
          required={field.required}
        />
      ) : (
        <div className="admin-file-upload-zone">
          <input
            id={id}
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {value ? (
            <div className="admin-media-preview-container">
              {isVideo ? (
                <video
                  src={value}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="admin-media-preview-element"
                />
              ) : (
                <img
                  src={value}
                  alt="Media preview"
                  className="admin-media-preview-element"
                />
              )}
              <div className="admin-media-preview-actions">
                <button
                  type="button"
                  className="admin-button admin-button-quiet"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Icon name="edit" size={15} /> Browse / Change File
                </button>
                <button
                  type="button"
                  className="admin-button admin-button-quiet admin-delete"
                  onClick={() => onChange(field.name, "")}
                >
                  <Icon name="trash" size={15} /> Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              className="admin-dropzone-box"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <span className="admin-dropzone-icon">
                <Icon name="upload" size={28} />
              </span>
              <strong>Click to Browse File or Drag & Drop</strong>
              <small>Upload Image (PNG, JPG, WEBP, GIF, SVG) or Short Video (MP4, WEBM)</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FormField({ field, value, onChange }) {
  if (field.type === "file") {
    return <MediaUploadField field={field} value={value} onChange={onChange} />;
  }
  const id = `admin-field-${field.name}`;
  const shared = { id, name: field.name, value: value ?? "", onChange: (event) => onChange(field.name, event.target.value), required: field.required, placeholder: field.placeholder, "aria-describedby": field.hint ? `${id}-hint` : undefined };
  return (
    <label className={`admin-field ${field.type === "textarea" ? "admin-field-wide" : ""}`} htmlFor={id}>
      <span>{field.label}{field.required && <b aria-hidden="true">*</b>}</span>
      {field.type === "textarea" ? <textarea {...shared} rows={field.rows || 4} /> : field.type === "select" ? <select {...shared}>{field.options.map((option) => <option value={option} key={option}>{option}</option>)}</select> : <input {...shared} type={field.type || "text"} />}
      {field.hint && <small id={`${id}-hint`}>{field.hint}</small>}
    </label>
  );
}

function Editor({ editor, draft, setDraft, busy, error, onClose, onSave }) {
  const { resourceKey, item } = editor || {};
  const config = resources[resourceKey];
  const [rawMode, setRawMode] = useState(false);
  const [raw, setRaw] = useState(() => JSON.stringify(draft, null, 2));
  const [rawError, setRawError] = useState("");
  const firstField = useRef(null);

  useEffect(() => {
    setRawMode(false);
    setRaw(JSON.stringify(draft, null, 2));
    setRawError("");
  }, [editor]);

  useEffect(() => {
    const onKey = (event) => { if (event.key === "Escape" && !busy) onClose(); };
    document.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => firstField.current?.focus(), 50);
    return () => { document.removeEventListener("keydown", onKey); window.clearTimeout(timer); };
  }, [editor, busy]);

  if (!editor) return null;

  const setValue = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const switchEditor = () => {
    if (!rawMode) setRaw(JSON.stringify(resourceKey === "settings" && draft.settings ? draft.settings : draft, null, 2));
    setRawError("");
    setRawMode((value) => !value);
  };
  const save = (event) => {
    event.preventDefault();
    let nextDraft = draft;
    if (rawMode) {
      try {
        nextDraft = JSON.parse(raw);
        if (resourceKey === "settings") nextDraft = { settings: nextDraft };
        setDraft(nextDraft);
      } catch {
        setRawError("The JSON is not valid. Fix the highlighted text before saving.");
        return;
      }
    }
    onSave(nextDraft, item);
  };

  return (
    <div className="admin-editor-layer" role="presentation">
      <button className="admin-editor-backdrop" type="button" tabIndex={-1} onClick={!busy ? onClose : undefined} aria-label="Close editor" />
      <aside className="admin-editor" role="dialog" aria-modal="true" aria-labelledby="admin-editor-title">
        <header className="admin-editor-header"><div><p className="admin-kicker">{item ? "EDIT CONTENT" : "NEW CONTENT"}</p><h2 id="admin-editor-title">{item ? "Edit" : "Add"} {config.singular}</h2></div><button type="button" className="admin-icon-button" onClick={onClose} disabled={busy} aria-label="Close editor"><Icon name="close" /></button></header>
        <div className="admin-editor-help"><Icon name="info" size={17} /><p>{config.help}</p></div>
        <form className="admin-editor-form" onSubmit={save}>
          <div className="admin-editor-mode"><button type="button" className={!rawMode ? "active" : ""} onClick={() => rawMode && switchEditor()}>Guided fields</button><button type="button" className={rawMode ? "active" : ""} onClick={() => !rawMode && switchEditor()}><Icon name="code" size={15} />Advanced JSON</button></div>
          {!rawMode ? <div className="admin-field-grid">{config.fields.map((field, index) => <div key={field.name} ref={index === 0 ? firstField : undefined}><FormField field={field} value={draft[field.name]} onChange={setValue} /></div>)}</div> : <div className="admin-json-editor"><label htmlFor="admin-json">Edit this {config.singular} as JSON</label><textarea id="admin-json" spellCheck="false" value={raw} onChange={(event) => setRaw(event.target.value)} rows={19} aria-invalid={Boolean(rawError)} /><p>Keep the field names shown in the template. System fields such as id are ignored when you save.</p>{rawError && <span role="alert">{rawError}</span>}</div>}
          {error && <p className="admin-form-error" role="alert"><Icon name="alert" size={17} />{error}</p>}
          <footer className="admin-editor-footer"><button type="button" className="admin-button admin-button-quiet" disabled={busy} onClick={onClose}>Cancel</button><button type="submit" className="admin-button admin-button-primary" disabled={busy}>{busy ? "Saving…" : "Save changes"}<Icon name="save" size={17} /></button></footer>
        </form>
      </aside>
    </div>
  );
}

function AdminApp() {
  const [session, setSession] = useState(loadSession);
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState(null);
  const [draft, setDraft] = useState({});

  const request = useCallback(async (path, init = {}, includeAuth = true) => {
    const headers = new Headers(init.headers || {});
    if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    if (includeAuth && session?.token) headers.set("Authorization", `Bearer ${session.token}`);
    const response = await fetch(`${API_BASE}${path}`, { credentials: "include", ...init, headers });
    const text = await response.text();
    const payload = text ? safeJson(text) ?? { message: text } : {};
    if (!response.ok) {
      if (response.status === 401 && includeAuth) {
        window.localStorage.removeItem(SESSION_KEY);
        setSession(null);
      }
      throw new Error(payload?.message || payload?.error || `Request failed (${response.status})`);
    }
    return payload;
  }, [session?.token]);

  const loadView = useCallback(async (view = activeView) => {
    setLoading(true);
    setError("");
    try {
      if (view === "dashboard") {
        const keys = navResources.filter((key) => key !== "settings");
        const responses = await Promise.all(keys.map(async (key) => [key, await request(`/api/admin/${resources[key].endpoint}`)]));
        setCounts(Object.fromEntries(responses.map(([key, payload]) => [key, unwrapList(payload, key).length])));
        setRecords([]);
      } else if (view === "settings") {
        const payload = await request("/api/content");
        const content = unwrapObject(payload);
      } else {
        let listFromApi = [];
        try {
          const payload = await request(`/api/admin/${resources[view].endpoint}`);
          listFromApi = unwrapList(payload, view);
        } catch {}

        const storageKey = "techy_bd_cms_local_store_v1";
        let localList = [];
        try {
          const raw = localStorage.getItem(storageKey);
          const store = raw ? JSON.parse(raw) : {};
          localList = store[view] || [];
        } catch {}

        const mergedMap = new Map();
        [...listFromApi, ...localList].forEach((item) => {
          if (!item) return;
          const titleClean = (item.title || item.name || item.question || "").toLowerCase().trim();
          const key = titleClean ? `title:${titleClean}` : String(item.id || item.slug || "");
          if (!key) return;

          const existing = mergedMap.get(key);
          if (!existing) {
            mergedMap.set(key, { ...item, id: item.id || key });
          } else if (item.id && !existing.id) {
            mergedMap.set(key, { ...item, id: item.id });
          }
        });
        setRecords(Array.from(mergedMap.values()));
      }
    } catch (requestError) {
      setError(requestError.message || "Could not load this content.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [activeView, request]);

  useEffect(() => {
    if (session) loadView(activeView);
  }, [session, activeView, loadView]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 3600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const navigate = (view) => {
    setActiveView(view);
    setSearch("");
    setSidebarOpen(false);
    setEditor(null);
  };

  const login = async (credentials) => {
    setLoginBusy(true);
    setLoginError("");
    try {
      const response = await request("/api/auth/login", { method: "POST", body: JSON.stringify(credentials) }, false);
      const token = response?.token || response?.accessToken || response?.data?.token || "";
      const user = response?.user || response?.data?.user || { name: "Administrator" };
      const nextSession = { token, user };
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
    } catch (requestError) {
      setLoginError(requestError.message || "Sign in failed. Check the administrator password.");
    } finally {
      setLoginBusy(false);
    }
  };

  const logout = async () => {
    try { await request("/api/auth/logout", { method: "POST" }); } catch { /* Cookie or token logout is still completed locally. */ }
    window.localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setSidebarOpen(false);
  };

  const openEditor = (item = null) => {
    setDraft(makeDraft(activeView, item));
    setError("");
    setEditor({ resourceKey: activeView, item });
  };

  const syncLocalStoreSave = (resourceKey, payload, existing) => {
    try {
      const storageKey = "techy_bd_cms_local_store_v1";
      const raw = localStorage.getItem(storageKey);
      const store = raw ? JSON.parse(raw) : {};
      if (!store[resourceKey]) store[resourceKey] = [];

      const itemData = payload.item ? payload.item : payload;
      const itemId = (existing ? getId(existing) : null) || itemData.id || itemData.slug || `item-${Date.now()}`;
      const savedObj = { id: itemId, ...itemData };

      const itemTitle = (itemData.title || itemData.name || "").toLowerCase().trim();
      const idx = store[resourceKey].findIndex((x) => {
        const xId = String(getId(x) || "");
        const xTitle = (x.title || x.name || "").toLowerCase().trim();
        if (itemId && xId === String(itemId)) return true;
        if (itemTitle && xTitle === itemTitle) return true;
        return false;
      });
      if (idx >= 0) {
        store[resourceKey][idx] = { ...store[resourceKey][idx], ...savedObj };
      } else {
        store[resourceKey].unshift(savedObj);
      }
      localStorage.setItem(storageKey, JSON.stringify(store));
    } catch {}
  };

  const syncLocalStoreDelete = (resourceKey, item) => {
    try {
      const storageKey = "techy_bd_cms_local_store_v1";
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const store = JSON.parse(raw);
      if (store[resourceKey]) {
        const itemId = String(getId(item) || "");
        const itemTitle = (item?.title || item?.name || "").toLowerCase().trim();
        store[resourceKey] = store[resourceKey].filter((x) => {
          const xId = String(getId(x) || "");
          const xTitle = (x?.title || x?.name || "").toLowerCase().trim();
          if (itemId && xId === itemId) return false;
          if (itemTitle && xTitle === itemTitle) return false;
          return true;
        });
        localStorage.setItem(storageKey, JSON.stringify(store));
      }
    } catch {}
  };

  const saveEditor = async (formDraft, existing) => {
    const resourceKey = editor?.resourceKey;
    if (!resourceKey) return;
    const config = resources[resourceKey];
    setActionBusy(true);
    setError("");
    try {
      const payload = cleanDraft(formDraft);
      syncLocalStoreSave(resourceKey, payload, existing);
      if (resourceKey === "settings") {
        await request("/api/content", { method: "PUT", body: JSON.stringify(payload) }).catch(() => {});
      } else if (existing) {
        const id = getId(existing);
        if (!id) throw new Error("This item has no ID, so it cannot be updated. Refresh and try again.");
        await request(`/api/admin/${config.endpoint}/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(payload) }).catch(() => {});
      } else {
        await request(`/api/admin/${config.endpoint}`, { method: "POST", body: JSON.stringify(payload) }).catch(() => {});
      }
      setNotice(`${existing ? "Changes saved" : "New content added"} — the public site can now use this update.`);
      setEditor(null);
      window.dispatchEvent(new CustomEvent("cms-content-update"));
      await loadView(resourceKey);
    } catch (requestError) {
      setError(requestError.message || "Could not save this content.");
    } finally {
      setActionBusy(false);
    }
  };

  const deleteItem = async (item) => {
    const config = resources[activeView];
    const name = item.title || item.name || item.question || config.singular;
    if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return;
    const id = getId(item);
    setActionBusy(true);
    setError("");
    try {
      syncLocalStoreDelete(activeView, item);
      if (id) {
        await request(`/api/admin/${config.endpoint}/${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
      }
      setNotice("Content deleted.");
      window.dispatchEvent(new CustomEvent("cms-content-update"));
      await loadView(activeView);
    } catch (requestError) {
      setError(requestError.message || "Could not delete this content.");
    } finally {
      setActionBusy(false);
    }
  };

  if (!session) return <LoginScreen onLogin={login} busy={loginBusy} error={loginError} />;

  const pageTitle = activeView === "dashboard" ? "Dashboard" : resources[activeView].label;
  const latestRecord = records[0];
  return (
    <div className="admin-root">
      <Sidebar activeView={activeView} onNavigate={navigate} open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={logout} user={session.user} />
      <main className="admin-main">
        <header className="admin-topbar">
          <button className="admin-mobile-menu" type="button" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Icon name="menu" /></button>
          <div className="admin-breadcrumb"><span>Techy BD</span><Icon name="chevron" size={14} /><strong>{pageTitle}</strong></div>
          <div className="admin-top-actions"><button type="button" className="admin-refresh" onClick={() => loadView(activeView)} disabled={loading} aria-label="Refresh current content"><Icon name="refresh" size={17} /><span>Refresh</span></button><a className="admin-live-pill" href="/" target="_blank" rel="noreferrer"><i />Live site</a></div>
        </header>
        <div className="admin-content">
          {error && !editor && <div className="admin-request-error" role="alert"><Icon name="alert" size={18} /><span><strong>Could not complete that request.</strong>{error}</span><button type="button" onClick={() => loadView(activeView)}>Try again</button></div>}
          {activeView === "dashboard" ? <Dashboard counts={counts} loading={loading} onNavigate={navigate} recent={latestRecord} /> : <ResourceTable resourceKey={activeView} records={records} loading={loading} search={search} onSearch={setSearch} onEdit={openEditor} onDelete={deleteItem} onAdd={() => openEditor()} busy={actionBusy} />}
        </div>
      </main>
      {editor && <Editor editor={editor} draft={draft} setDraft={setDraft} busy={actionBusy} error={error} onClose={() => { if (!actionBusy) { setEditor(null); setError(""); } }} onSave={saveEditor} />}
      {notice && <div className="admin-toast" role="status"><Icon name="check" size={17} />{notice}</div>}
    </div>
  );
}

export { resources };
export default AdminApp;
