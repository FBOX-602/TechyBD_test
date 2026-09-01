import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Globe,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  Package,
  Phone,
  PlusCircle,
  ShieldCheck,
  ShoppingBag,
  User,
  Zap,
} from "lucide-react";
import "./customer.css";

const CUSTOMER_SESSION_KEY = "techy-bd-customer-session";
const CUSTOMER_ORDERS_KEY = "techy-bd-customer-orders";

const sampleInitialOrders = [
  {
    id: "ORD-98421",
    title: "PureBangla — Organic eCommerce Website",
    category: "eCommerce",
    price: "৳ 12,499",
    date: "2026-08-20",
    status: "Completed",
    image: "https://res.cloudinary.com/dsbkkhpdq/image/upload/v1785708445/projects/mrt8uk4pf7k30tako4rx.png",
    link: "https://organik.skitsolutionsbd.com",
    notes: "Full eCommerce setup with bKash/COD checkout & Admin panel.",
  },
  {
    id: "ORD-87104",
    title: "Facebook Meta Pixel & Conversion API Setup",
    category: "Service",
    price: "৳ 2,999",
    date: "2026-08-25",
    status: "Active",
    image: "https://res.cloudinary.com/dsbkkhpdq/image/upload/v1780858740/services/enx5dk0gehsip9vczwca.webp",
    link: "",
    notes: "Server-side tracking & custom event configuration.",
  },
];

export function getCustomerSession() {
  try {
    const raw = localStorage.getItem(CUSTOMER_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCustomerSession(user) {
  try {
    localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("Failed to save customer session", e);
  }
}

export function clearCustomerSession() {
  try {
    localStorage.removeItem(CUSTOMER_SESSION_KEY);
  } catch (e) {
    console.error("Failed to clear customer session", e);
  }
}

export function getCustomerOrders() {
  try {
    const raw = localStorage.getItem(CUSTOMER_ORDERS_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(CUSTOMER_ORDERS_KEY, JSON.stringify(sampleInitialOrders));
    return sampleInitialOrders;
  } catch {
    return sampleInitialOrders;
  }
}

export function addCustomerOrder(orderItem) {
  try {
    const existing = getCustomerOrders();
    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      title: orderItem.title,
      category: orderItem.category || "Website Purchase",
      price: orderItem.price || "Contact for Price",
      date: new Date().toISOString().split("T")[0],
      status: "Processing",
      image: orderItem.image || "",
      link: orderItem.href || "",
      notes: orderItem.notes || "Order received. Our team will contact you shortly.",
    };
    const updated = [newOrder, ...existing];
    localStorage.setItem(CUSTOMER_ORDERS_KEY, JSON.stringify(updated));
    return newOrder;
  } catch (e) {
    console.error("Failed to save order", e);
    return null;
  }
}

function CustomerLoginScreen({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;
    const user = {
      name: name.trim() || emailOrPhone.split("@")[0] || "Customer",
      emailOrPhone: emailOrPhone.trim(),
      memberSince: new Date().getFullYear(),
    };
    saveCustomerSession(user);
    onLogin(user);
  };

  const handleDemoLogin = () => {
    const demoUser = {
      name: "MD Omar Faruk",
      emailOrPhone: "01581503522",
      memberSince: 2026,
    };
    saveCustomerSession(demoUser);
    onLogin(demoUser);
  };

  return (
    <div className="customer-portal-shell">
      <div className="customer-auth-card">
        <div className="auth-brand-badge">
          <img src="/techy-bd-logo.png" alt="Techy BD" className="auth-brand-logo" />
          <span>Techy BD Customer Portal</span>
        </div>

        <h1 className="customer-auth-title">
          {isRegister ? "Create Customer Account" : "Sign In to Your Account"}
        </h1>
        <p className="customer-auth-desc">
          {isRegister
            ? "Register to track your website purchases, packages, and service orders."
            : "View your purchased websites, download resources, and manage orders."}
        </p>

        <form onSubmit={handleSubmit} className="customer-auth-form">
          {isRegister && (
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <div className="input-with-icon">
                <User size={18} />
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. MD Omar Faruk"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isRegister}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="emailOrPhone">Email or Mobile Number</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input
                id="emailOrPhone"
                type="text"
                placeholder="e.g. 01712345678 or user@gmail.com"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="customer-btn-primary">
            {isRegister ? "Create Account & Sign In" : "Sign In"}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button type="button" className="customer-btn-demo" onClick={handleDemoLogin}>
          <Zap size={18} /> 1-Click Instant Demo Login
        </button>

        <div className="auth-footer-toggle">
          {isRegister ? (
            <p>
              Already have an account?{" "}
              <button type="button" onClick={() => setIsRegister(false)}>
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to Techy BD?{" "}
              <button type="button" onClick={() => setIsRegister(true)}>
                Create Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomerApp({ navigate }) {
  const [session, setSession] = useState(getCustomerSession);
  const [orders, setOrders] = useState(getCustomerOrders);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    setOrders(getCustomerOrders());
  }, []);

  const handleLogout = () => {
    clearCustomerSession();
    setSession(null);
  };

  if (!session) {
    return <CustomerLoginScreen onLogin={(user) => setSession(user)} />;
  }

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "completed") return order.status === "Completed";
    if (activeTab === "processing") return order.status === "Processing" || order.status === "Active";
    return true;
  });

  return (
    <div className="customer-dashboard-container">
      {/* Header Profile Bar */}
      <header className="customer-header-bar">
        <div className="container header-bar-inner">
          <div className="customer-profile-info">
            <div className="profile-avatar">
              {session.name ? session.name.charAt(0).toUpperCase() : "C"}
            </div>
            <div>
              <h2 className="customer-greeting">Welcome back, {session.name}!</h2>
              <p className="customer-subtext">
                <Phone size={14} /> {session.emailOrPhone} • Customer Portal
              </p>
            </div>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="action-btn back-site-btn"
              onClick={() => navigate?.("/")}
            >
              <Globe size={16} /> Public Site
            </button>
            <button type="button" className="action-btn logout-btn" onClick={handleLogout}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="container customer-main-content">
        {/* Section Heading & Stat Overview */}
        <div className="dashboard-top-section">
          <div>
            <span className="section-eyebrow">CUSTOMER DASHBOARD</span>
            <h1 className="dashboard-title">My Purchased Items & Orders</h1>
            <p className="dashboard-desc">
              All website projects, packages, and service orders purchased under your account.
            </p>
          </div>

          <button
            type="button"
            className="browse-more-btn"
            onClick={() => navigate?.("/work")}
          >
            <ShoppingBag size={18} /> Browse Work & Services →
          </button>
        </div>

        {/* Orders Summary Cards */}
        <div className="orders-summary-grid">
          <div className="summary-card">
            <div className="summary-icon icon-total">
              <Package size={22} />
            </div>
            <div>
              <span className="summary-number">{orders.length}</span>
              <span className="summary-label">Total Purchased Items</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon icon-completed">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span className="summary-number">
                {orders.filter((o) => o.status === "Completed").length}
              </span>
              <span className="summary-label">Completed & Live</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon icon-processing">
              <Clock size={22} />
            </div>
            <div>
              <span className="summary-number">
                {orders.filter((o) => o.status === "Processing" || o.status === "Active").length}
              </span>
              <span className="summary-label">In Setup / Processing</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="orders-tab-row">
          <button
            type="button"
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Items ({orders.length})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "processing" ? "active" : ""}`}
            onClick={() => setActiveTab("processing")}
          >
            Processing & Active
          </button>
        </div>

        {/* Purchased Orders Grid / List */}
        {filteredOrders.length === 0 ? (
          <div className="empty-orders-card">
            <div className="empty-icon-wrap">
              <ShoppingBag size={40} />
            </div>
            <h3>No Purchased Items Found</h3>
            <p>You haven't ordered any website or service packages under this view yet.</p>
            <button
              type="button"
              className="customer-btn-primary"
              onClick={() => navigate?.("/work")}
            >
              Explore Portfolio & Order Now →
            </button>
          </div>
        ) : (
          <div className="orders-cards-grid">
            {filteredOrders.map((order) => {
              const isVideo =
                order.image?.startsWith("data:video/") ||
                /\.(mp4|webm)(\?.*)?$/i.test(order.image || "");

              return (
                <article className="order-item-card" key={order.id}>
                  <div className="order-card-media">
                    {order.image ? (
                      isVideo ? (
                        <video src={order.image} autoPlay loop muted playsInline />
                      ) : (
                        <img src={order.image} alt={order.title} />
                      )
                    ) : (
                      <div className="no-media-placeholder">
                        <Package size={32} />
                      </div>
                    )}
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="order-card-body">
                    <div className="order-meta-header">
                      <span className="order-id-code">{order.id}</span>
                      <span className="order-purchase-date">{order.date}</span>
                    </div>

                    <h3 className="order-title">{order.title}</h3>
                    <span className="order-category-tag">{order.category}</span>

                    <p className="order-notes">{order.notes}</p>

                    <div className="order-card-footer">
                      <div className="price-tag-wrap">
                        <small>Price Paid</small>
                        <strong className="order-price">{order.price}</strong>
                      </div>

                      <div className="order-actions-group">
                        {order.link ? (
                          <a
                            href={order.link}
                            target="_blank"
                            rel="noreferrer"
                            className="order-btn btn-view-live"
                          >
                            <ExternalLink size={15} /> Visit Website
                          </a>
                        ) : null}
                        <a
                          href={`https://wa.me/8801581503522?text=Hi%20Techy%20BD%2C%20I%20have%20a%20question%20about%20my%20order%20${order.id}%20(${encodeURIComponent(
                            order.title
                          )})`}
                          target="_blank"
                          rel="noreferrer"
                          className="order-btn btn-support"
                        >
                          <MessageCircle size={15} /> Support
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
