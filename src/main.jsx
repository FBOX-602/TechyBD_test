import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ClipboardList,
  Cloud,
  Code2,
  ExternalLink,
  Globe,
  Globe2,
  Headphones,
  Heart,
  Layers,
  Lightbulb,
  Mail,
  Menu,
  MessageCircle,
  MonitorSmartphone,
  PackageCheck,
  PenTool,
  PieChart,
  Quote,
  Rocket,
  Send,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import { ContentProvider, useSiteContent } from "./content";
import AdminApp from "./admin";
import CustomerApp, { addCustomerOrder, getCustomerSession } from "./customer";
import StudioFaq from "./components/StudioFaq";
import "./styles.css";
import "./studio-design.css";

function useRoute() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (to) => {
    if (to === window.location.pathname) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return { path, navigate };
}

function LocalLink({ to, navigate, children, className = "", onClick, ...props }) {
  return (
    <a
      href={to}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigate(to);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

function Eyebrow({ children, className = "" }) {
  return <span className={`eyebrow ${className}`}>{children}</span>;
}

function SectionHeading({ eyebrow, title, accent, copy, className = "", center = false }) {
  return (
    <div className={`section-heading ${center ? "narrow-center" : ""} ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="display-title">
        {title} {accent && <span className="gradient-text">{accent}</span>}
      </h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}

function IconForService({ name, size = 20 }) {
  const shared = { size, strokeWidth: 1.8 };
  if (name === "monitor" || name === "desktop") return <MonitorSmartphone {...shared} />;
  if (name === "code") return <Code2 {...shared} />;
  if (name === "shopping-cart" || name === "cart") return <ShoppingBag {...shared} />;
  if (name === "settings" || name === "gear") return <Settings {...shared} />;
  if (name === "user") return <User {...shared} />;
  if (name === "clipboard") return <ClipboardList {...shared} />;
  if (name === "pen" || name === "edit") return <PenTool {...shared} />;
  if (name === "target" || name === "focus") return <Target {...shared} />;
  if (name === "shopping-bag" || name === "shopping") return <ShoppingBag {...shared} />;
  if (name === "zap") return <Zap {...shared} />;
  if (name === "sparkles") return <Sparkles {...shared} />;
  if (name === "activity") return <Activity {...shared} />;
  if (name === "shield-check") return <ShieldCheck {...shared} />;
  if (name === "trending") return <TrendingUp {...shared} />;
  if (name === "mobile") return <MonitorSmartphone {...shared} />;
  if (name === "message") return <MessageCircle {...shared} />;
  if (name === "chart") return <BarChart3 {...shared} />;
  if (name === "lightbulb") return <Lightbulb {...shared} />;
  if (name === "rocket") return <Rocket {...shared} />;
  if (name === "package") return <PackageCheck {...shared} />;
  if (name === "layers") return <Layers {...shared} />;
  return <Cloud {...shared} />;
}

// Section 2: Global Sticky & Floating After-Scroll Navbar
function Header({ path, navigate }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { settings, assets } = useSiteContent();
  const { brand, nav } = settings;

  const customerSession = getCustomerSession();
  const ctaText = customerSession?.name ? "My Account" : "Login";
  const ctaLink = "/account";

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "header-scrolled" : ""}`}>
      <div className="header-wrapper">
        <div className="header-inner">
          {/* Brand Logo & Title */}
          <LocalLink to="/" navigate={navigate} className="brand" aria-label={`${brand.name} home`}>
            <span className="brand-mark">
              <img src={brand.logoUrl || assets.logo} alt={brand.name} />
              {scrolled && <span className="scrolled-live-dot" />}
            </span>
            {!scrolled && (
              <span className="brand-copy">
                <strong>{brand.name}</strong>
                <small>{brand.tagline || "Building Digital Experiences"}</small>
              </span>
            )}
          </LocalLink>

          {/* Desktop Nav Items */}
          <nav className="desktop-nav" aria-label="Primary navigation">
            {nav.map(({ label, path: to }) => {
              const isActive = path === to || (to === "/work" && path.startsWith("/work/"));
              return (
                <div key={to} className="nav-item-wrapper">
                  <LocalLink
                    to={to}
                    navigate={navigate}
                    className={isActive ? "active" : ""}
                  >
                    {label}
                  </LocalLink>
                  {isActive && (
                    <span className={scrolled ? "active-nav-dot" : "active-nav-bar"} />
                  )}
                </div>
              );
            })}
          </nav>

          {/* CTA Button */}
          <LocalLink
            to={ctaLink}
            navigate={navigate}
            className={`header-cta ${scrolled ? "header-cta-scrolled" : "header-cta-top"}`}
          >
            <span className="cta-circle-icon">
              <span className="cta-arrow">→</span>
            </span>
            <span className="cta-text">{ctaText}</span>
          </LocalLink>

          {/* Mobile Menu Toggle Button */}
          <button
            className="menu-button"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-menu">
          {nav.map(({ label, path: to }) => (
            <LocalLink
              key={to}
              to={to}
              navigate={navigate}
              className={path === to ? "active" : ""}
            >
              {label}
              <ChevronRight size={17} />
            </LocalLink>
          ))}
          <LocalLink to={ctaLink} navigate={navigate} className="header-cta-top mobile-menu-cta-item">
            <span className="cta-circle-icon">
              <span className="cta-arrow">→</span>
            </span>
            <span className="cta-text">{ctaText}</span>
          </LocalLink>
        </div>
      )}
    </header>
  );
}

// Section 3: Techy BD Premium Minimal Hero Section with Typewriter Effect
function Hero({ navigate }) {
  const prefixText = "Ideas into ";
  const accentText = "digital experiences.";
  const descText = "We design and build premium websites and digital experiences that help businesses stand out, build trust, and grow online.";

  const [typedPrefix, setTypedPrefix] = useState("");
  const [typedAccent, setTypedAccent] = useState("");
  const [typedDesc, setTypedDesc] = useState("");
  const [phase, setPhase] = useState(0); // 0: prefix, 1: accent, 2: desc, 3: done

  useEffect(() => {
    let timeoutId;

    if (phase === 0) {
      if (typedPrefix.length < prefixText.length) {
        timeoutId = setTimeout(() => {
          setTypedPrefix(prefixText.slice(0, typedPrefix.length + 1));
        }, 40);
      } else {
        timeoutId = setTimeout(() => setPhase(1), 80);
      }
    } else if (phase === 1) {
      if (typedAccent.length < accentText.length) {
        timeoutId = setTimeout(() => {
          setTypedAccent(accentText.slice(0, typedAccent.length + 1));
        }, 45);
      } else {
        timeoutId = setTimeout(() => setPhase(2), 150);
      }
    } else if (phase === 2) {
      if (typedDesc.length < descText.length) {
        timeoutId = setTimeout(() => {
          setTypedDesc(descText.slice(0, typedDesc.length + 1));
        }, 15);
      } else {
        setPhase(3);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [phase, typedPrefix, typedAccent, typedDesc]);

  return (
    <section className="hero-section-editorial">
      <div className="grid-backdrop" />
      <div className="container hero-editorial-container">
        {/* Brand Line */}
        <div className="hero-brand-pill hero-stagger-1">
          <span className="hero-brand-static">Think Tech, Think </span>
          <span className="hero-brand-accent">Techy BD.</span>
        </div>

        {/* Main Headline with Typewriter Effect */}
        <h1 className="hero-editorial-title hero-stagger-2">
          {typedPrefix}
          {typedAccent && (
            <span className="title-gradient-accent">{typedAccent}</span>
          )}
          {(phase === 0 || phase === 1) && <span className="typewriter-cursor" />}
        </h1>

        {/* Description with Typewriter Effect */}
        <p className="hero-editorial-copy hero-stagger-3">
          {typedDesc}
          {phase === 2 && <span className="typewriter-cursor" />}
        </p>

        {/* CTA Buttons */}
        <div className="hero-editorial-actions hero-stagger-4">
          <LocalLink to="/work" navigate={navigate} className="hero-btn-primary">
            <span>View Our Work</span>
            <span className="btn-arrow">→</span>
          </LocalLink>
          <LocalLink to="/contact" navigate={navigate} className="hero-btn-secondary">
            <span>Start a Project</span>
            <span className="btn-arrow">→</span>
          </LocalLink>
        </div>

        {/* Service Tags */}
        <div className="hero-service-tags hero-stagger-5">
          <span className="service-tag-item">ECOMMERCE</span>
          <span className="service-tag-dot">•</span>
          <span className="service-tag-item">BUSINESS WEBSITES</span>
          <span className="service-tag-dot">•</span>
          <span className="service-tag-item">LANDING PAGES</span>
          <span className="service-tag-dot">•</span>
          <span className="service-tag-item">AUTOMATION</span>
        </div>
      </div>
    </section>
  );
}



// Section 6 & 7: Premium Editorial / Framer Marketplace Project Card
function isVideoMedia(url) {
  if (!url || typeof url !== "string") return false;
  return url.startsWith("data:video/") || /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

function ProjectCard({ project, navigate }) {
  const shortName = project.title.split("—")[0]?.trim() || project.title;
  const categoryTitle = project.category || "eCommerce";

  return (
    <article className="product-item-card">
      <div className="card-mockup-wrap">
        <img src={project.image} alt={project.title} loading="lazy" className="card-mockup-img" />
      </div>

      <div className="card-body-content">
        <span className="card-category-label">{categoryTitle}</span>
        <h4 className="card-project-title">{shortName}</h4>
        <a
          href={project.href || `https://wa.me/8801581503522?text=Hi%20Techy%20BD%2C%20I%20am%20interested%20in%20${encodeURIComponent(project.title)}`}
          target="_blank"
          rel="noreferrer"
          className="card-view-link"
        >
          View Project →
        </a>
      </div>
    </article>
  );
}

// Section 5, 7, 8: Featured Work Section & Project Showcase (Same to Same as Reference Image)
function FeaturedWork({ full = false, navigate }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const { projects: cmsProjects, settings } = useSiteContent();

  const defaultProjectsList = [
    {
      id: "proj-1",
      isFeaturedSpotlight: true,
      number: "01",
      eyebrow: "FEATURED PROJECT",
      title: "GreenMart eCommerce",
      category: "eCommerce",
      description: "A modern eCommerce platform with advanced features, fast performance and beautiful UI/UX to boost online sales.",
      tags: ["eCommerce", "Web Design", "Development", "UI/UX"],
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop",
      mobileImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop",
      href: "https://wa.me/8801581503522?text=Hi%20Techy%20BD%2C%20I%20am%20interested%20in%20GreenMart%20eCommerce"
    },
    {
      id: "proj-2",
      title: "UrbanWear Store",
      category: "eCommerce",
      description: "Modern fashion eCommerce store designed for seamless shopping experience.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
      href: "https://wa.me/8801581503522?text=Hi%20Techy%20BD%2C%20I%20am%20interested%20in%20UrbanWear%20Store"
    },
    {
      id: "proj-3",
      title: "Spice Village Restaurant",
      category: "Restaurant",
      description: "Elegant restaurant website with digital menu and online reservation system.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
      href: "https://wa.me/8801581503522?text=Hi%20Techy%20BD%2C%20I%20am%20interested%20in%20Spice%20Village%20Restaurant"
    },
    {
      id: "proj-4",
      title: "Fixit Solutions",
      category: "Service",
      description: "Fast, reliable professional home services booking platform.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop",
      href: "https://wa.me/8801581503522?text=Hi%20Techy%20BD%2C%20I%20am%20interested%20in%20Fixit%20Solutions"
    },
    {
      id: "proj-5",
      title: "SaaS Landing Page",
      category: "Landing Pages",
      description: "High-converting SaaS app landing page with interactive dashboard preview.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      href: "https://wa.me/8801581503522?text=Hi%20Techy%20BD%2C%20I%20am%20interested%20in%20SaaS%20Landing%20Page"
    },
    {
      id: "proj-6",
      title: "Online Learning Platform",
      category: "Courses",
      description: "Interactive e-learning portal with video courses and student progress tracking.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
      href: "https://wa.me/8801581503522?text=Hi%20Techy%20BD%2C%20I%20am%20interested%20in%20Online%20Learning%20Platform"
    },
    {
      id: "proj-7",
      title: "GlowUp Skincare",
      category: "Beauty & Skincare",
      description: "Minimalist luxury beauty and skincare brand eCommerce store.",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
      href: "https://wa.me/8801581503522?text=Hi%20Techy%20BD%2C%20I%20am%20interested%20in%20GlowUp%20Skincare"
    }
  ];

  const projects = cmsProjects && cmsProjects.length > 0 ? cmsProjects : defaultProjectsList;

  const filterCategories = [
    "All",
    "eCommerce",
    "Restaurant",
    "Service",
    "Landing Pages",
    "Courses",
    "Beauty & Skincare",
  ];

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    const catClean = activeCategory.toLowerCase().replace(/s$/, "").trim();
    return projects.filter((project) => {
      const pCatClean = (project.category || "").toLowerCase().replace(/s$/, "").trim();
      return pCatClean.includes(catClean) || catClean.includes(pCatClean);
    });
  }, [projects, activeCategory]);

  const spotlightProject = useMemo(() => {
    return projects.find((p) => p.isFeaturedSpotlight) || projects[0];
  }, [projects]);

  const gridProjects = useMemo(() => {
    if (full) {
      if (activeCategory === "All" && spotlightProject) {
        return filteredProjects.filter((p) => (p.id || p.slug) !== (spotlightProject.id || spotlightProject.slug));
      }
      return filteredProjects;
    }
    // On Home Page (full === false), show top 3 projects cleanly!
    return projects.slice(0, 3);
  }, [full, filteredProjects, activeCategory, spotlightProject, projects]);

  return (
    <section className={`product-showcase-master-section ${!full ? "is-home-preview" : ""}`} id="selected-work">
      <div className="container">
        {/* Section Header */}
        <div className="product-showcase-header">
          <span className="product-eyebrow">SELECTED WORK</span>
          <h2 className="product-display-title">
            {full ? "Digital experiences made to stand out." : "Selected Work"}
          </h2>
          <p className="product-sub-copy">
            {full
              ? "Explore our complete showcase of eCommerce stores, business sites, landing pages, and web apps."
              : "A selection of websites we've designed and built for growing businesses."}
          </p>
        </div>

        {/* Category Filter Pills (Full Project Page only) */}
        {full && (
          <div className="product-filter-pills-row" role="tablist" aria-label="Project categories">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                className={`product-filter-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Featured Spotlight Showcase Card (#01 GreenMart eCommerce - Full Project Page only) */}
        {full && (activeCategory === "All" || activeCategory === "eCommerce") && spotlightProject && (
          <div className="featured-spotlight-card">
            <div className="spotlight-left-content">
              <div className="spotlight-number-row">
                <span className="spotlight-num">{spotlightProject.number || "01"}</span>
                <span className="spotlight-line" />
              </div>

              <span className="spotlight-eyebrow">{spotlightProject.eyebrow || "FEATURED PROJECT"}</span>
              <h3 className="spotlight-title">{spotlightProject.title}</h3>
              <p className="spotlight-desc">{spotlightProject.description}</p>

              <div className="spotlight-tags-row">
                {(spotlightProject.tags || ["eCommerce", "Web Design", "Development", "UI/UX"]).map((tag, tIdx) => (
                  <span key={tIdx} className={`spotlight-tag-pill ${tIdx === 0 ? "highlight" : ""}`}>
                    {tIdx === 0 && <ShoppingBag size={13} style={{ marginRight: 4 }} />}
                    {tIdx === 1 && <MonitorSmartphone size={13} style={{ marginRight: 4 }} />}
                    {tIdx === 2 && <Code2 size={13} style={{ marginRight: 4 }} />}
                    {tIdx === 3 && <Sparkles size={13} style={{ marginRight: 4 }} />}
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href={spotlightProject.href || `/contact`}
                target="_blank"
                rel="noreferrer"
                className="spotlight-cta-btn"
              >
                View Project →
              </a>
            </div>

            <div className="spotlight-right-media">
              <div className="device-desktop-mockup">
                <div className="browser-top-bar">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                  <span className="browser-url-pill">GreenMart</span>
                </div>
                <img src={spotlightProject.image} alt={spotlightProject.title} className="desktop-screen-img" />
              </div>
              {spotlightProject.mobileImage && (
                <div className="device-mobile-mockup">
                  <img src={spotlightProject.mobileImage} alt="Mobile App View" className="mobile-screen-img" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Project Cards Grid */}
        {gridProjects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#64748b" }}>
            <p>No projects under <strong>"{activeCategory}"</strong>. Select <strong>"All"</strong> to view all projects.</p>
          </div>
        ) : (
          <div className="product-cards-grid">
            {gridProjects.map((project) => (
              <ProjectCard key={project.slug || project.id} project={project} navigate={navigate} />
            ))}
          </div>
        )}

        {/* "See More" Button on Home Page (when full === false) */}
        {!full && (
          <div className="see-more-projects-container">
            <LocalLink to="/work" navigate={navigate} className="see-more-projects-btn">
              <span>See More Projects</span>
              <span className="btn-arrow">→</span>
            </LocalLink>
          </div>
        )}

        {/* Metrics Bar & Bottom Banner (Full Project Page only) */}
        {full && (
          <>
            <div className="product-metrics-bar">
              <div className="metric-box">
                <div className="metric-icon-circle color-orange">
                  <PackageCheck size={18} />
                </div>
                <div className="metric-text-group">
                  <span className="metric-val">50+</span>
                  <span className="metric-lbl">Projects Completed</span>
                </div>
              </div>
              <div className="metric-box">
                <div className="metric-icon-circle color-amber">
                  <BarChart3 size={18} />
                </div>
                <div className="metric-text-group">
                  <span className="metric-val">10+</span>
                  <span className="metric-lbl">Industries Served</span>
                </div>
              </div>
              <div className="metric-box">
                <div className="metric-icon-circle color-green">
                  <CheckCircle2 size={18} />
                </div>
                <div className="metric-text-group">
                  <span className="metric-val">100%</span>
                  <span className="metric-lbl">Client Satisfaction</span>
                </div>
              </div>
              <div className="metric-box">
                <div className="metric-icon-circle color-teal">
                  <Clock size={18} />
                </div>
                <div className="metric-text-group">
                  <span className="metric-val">24/7</span>
                  <span className="metric-lbl">Support Available</span>
                </div>
              </div>
            </div>

            <div className="product-bottom-cta-banner">
              <div className="cta-left-group">
                <div className="cta-rocket-badge">
                  <Rocket size={22} />
                </div>
                <div className="cta-text-group">
                  <h3>Have a project in mind?</h3>
                  <p>Let's build something amazing together.</p>
                </div>
              </div>
              <LocalLink to="/contact" navigate={navigate} className="cta-orange-button">
                Start a Project →
              </LocalLink>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// Section 9: Services Section ("Same to Same Design as Reference Image")
function ServicesSection({ navigate, isHomePage = false }) {
  const { services } = useSiteContent();
  const scrollRef = React.useRef(null);

  const defaultServicesList = [
    {
      id: "service-1",
      number: "01",
      title: "Web Design",
      slug: "web-design",
      icon: "monitor",
      color: "blue",
      description: "Beautiful, user-focused designs that reflect your brand and convert visitors into customers.",
      features: [
        "Custom UI/UX Design",
        "Responsive Design",
        "Brand-focused Layouts",
        "Interactive & Modern"
      ]
    },
    {
      id: "service-2",
      number: "02",
      title: "Web Development",
      slug: "web-development",
      icon: "code",
      color: "green",
      description: "Fast, secure and scalable websites built with clean code and the latest technologies.",
      features: [
        "Custom Website Development",
        "CMS Integration",
        "API & Third-party Integration",
        "Performance Optimized"
      ]
    },
    {
      id: "service-3",
      number: "03",
      title: "eCommerce",
      slug: "ecommerce",
      icon: "shopping-cart",
      color: "orange",
      description: "Powerful eCommerce solutions that help you sell more and manage everything effortlessly.",
      features: [
        "Custom eCommerce Development",
        "Secure Payment Integration",
        "Product & Inventory Management",
        "Order & Shipping System"
      ]
    },
    {
      id: "service-4",
      number: "04",
      title: "Landing Pages",
      slug: "landing-pages",
      icon: "rocket",
      color: "purple",
      description: "High-converting landing pages designed to capture leads and maximize conversions.",
      features: [
        "Conversion-focused Design",
        "Lead Generation Forms",
        "Fast Loading Speed",
        "A/B Test Ready"
      ]
    },
    {
      id: "service-5",
      number: "05",
      title: "Automation",
      slug: "automation",
      icon: "settings",
      color: "gold",
      description: "Smart automation systems that save time, reduce manual work and improve efficiency.",
      features: [
        "Business Process Automation",
        "Workflow & Task Automation",
        "AI Automation Solutions",
        "Integration & API Automation"
      ]
    }
  ];

  const displayServices = services && services.length > 0 ? services : defaultServicesList;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  const getFallbackFeatures = (title = "") => {
    const t = title.toLowerCase();
    if (t.includes("design")) return ["Custom UI/UX Design", "Responsive Design", "Brand-focused Layouts", "Interactive & Modern"];
    if (t.includes("dev") || t.includes("code")) return ["Custom Website Development", "CMS Integration", "API & Third-party Integration", "Performance Optimized"];
    if (t.includes("ecom") || t.includes("shop")) return ["Custom eCommerce Development", "Secure Payment Integration", "Product & Inventory Management", "Order & Shipping System"];
    if (t.includes("land") || t.includes("page")) return ["Conversion-focused Design", "Lead Generation Forms", "Fast Loading Speed", "A/B Test Ready"];
    return ["Business Process Automation", "Workflow & Task Automation", "AI Automation Solutions", "Integration & API Automation"];
  };

  return (
    <div className={`services-showcase-master-wrapper ${isHomePage ? "is-home-page" : ""}`}>
      {/* 1. TOP HERO / HEADER BANNER (Hidden on HomePage, visible on Services Page) */}
      {!isHomePage && (
        <section className="services-hero-banner">
          <div className="container">
            <div className="services-hero-grid">
              {/* Left Copy */}
              <div className="services-hero-left">
                <div className="eyebrow-pill-badge">
                  <span className="eyebrow-dot" />
                  <span className="eyebrow-text">OUR SERVICES</span>
                </div>
                <h1 className="services-hero-title">
                  Digital Solutions Designed<br />
                  to <span className="accent-orange-text">Grow Your Business.</span>
                </h1>
                <p className="services-hero-lead">
                  We build high-performance websites, eCommerce stores and automation systems that help businesses look better, work smarter and scale faster.
                </p>
                <div className="services-hero-cta-row">
                  <LocalLink to="/contact" navigate={navigate} className="btn-primary-orange-pill">
                    Start a Project <span className="btn-arrow">→</span>
                  </LocalLink>
                  <LocalLink to="/work" navigate={navigate} className="btn-secondary-glass-pill">
                    View Our Work <span className="btn-close-icon">✕</span>
                  </LocalLink>
                </div>
              </div>

              {/* Right Glass Stat Card */}
              <div className="services-hero-right">
                <div className="services-stats-glass-card">
                  <div className="glass-ambient-orange-arc" />
                  <div className="stats-row-grid">
                    <div className="stat-box-item">
                      <div className="stat-icon-wrapper color-orange">
                        <PieChart size={18} />
                      </div>
                      <div className="stat-text-box">
                        <span className="stat-number">10+</span>
                        <span className="stat-label">Services</span>
                      </div>
                    </div>
                    <div className="stat-box-item">
                      <div className="stat-icon-wrapper color-orange">
                        <Users size={18} />
                      </div>
                      <div className="stat-text-box">
                        <span className="stat-number">50+</span>
                        <span className="stat-label">Projects</span>
                      </div>
                    </div>
                    <div className="stat-box-item">
                      <div className="stat-icon-wrapper color-green">
                        <Globe size={18} />
                      </div>
                      <div className="stat-text-box">
                        <span className="stat-number">5+</span>
                        <span className="stat-label">Industries</span>
                      </div>
                    </div>
                    <div className="stat-box-item">
                      <div className="stat-icon-wrapper color-amber">
                        <Clock size={18} />
                      </div>
                      <div className="stat-text-box">
                        <span className="stat-number">24/7</span>
                        <span className="stat-label">Support</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card-divider" />
                  <p className="glass-card-trust-text">Trusted by growing businesses around the world.</p>

                  <div className="brand-logos-flex-row">
                    <span className="brand-logo-item"><Sparkles size={13} /> DataSoft</span>
                    <span className="brand-logo-item"><Layers size={13} /> GreenMart</span>
                    <span className="brand-logo-item"><BookOpen size={13} /> EduPrime</span>
                    <span className="brand-logo-item"><Globe size={13} /> Novus</span>
                    <span className="brand-logo-item"><Zap size={13} /> PixelCraft</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. MIDDLE SERVICES CAROUSEL SECTION */}
      <section className="services-main-carousel-section">
        <div className="container">
          {/* Centered Header */}
          <div className="services-carousel-header">
            <div className="eyebrow-pill-badge centered">
              <span className="eyebrow-dot" />
              <span className="eyebrow-text">WHAT WE DO</span>
            </div>
            <h2 className="services-section-display-title">
              Services That Drive <span className="accent-orange-text">Results</span>
            </h2>
            <p className="services-section-sub-copy">
              From modern websites to powerful automation, we deliver end-to-end digital solutions.
            </p>
          </div>

          {/* Carousel with Navigation Controls */}
          <div className="services-carousel-wrapper">
            <button onClick={scrollLeft} className="carousel-control-btn left" aria-label="Previous service">
              <ChevronLeft size={20} />
            </button>

            <div className="services-carousel-track" ref={scrollRef}>
              {displayServices.map((service, idx) => {
                const color = service.color || (idx === 0 ? "blue" : idx === 1 ? "green" : idx === 2 ? "orange" : idx === 3 ? "purple" : "gold");
                const numberStr = service.number || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`);
                const featuresList = service.features && service.features.length > 0 ? service.features : getFallbackFeatures(service.title);

                return (
                  <article key={service.id || service.slug || idx} className="service-card-modern">
                    <div className="card-top-header">
                      <span className="card-number-badge">{numberStr}</span>
                      <div className={`card-icon-box icon-bg-${color}`}>
                        <IconForService name={service.icon} size={22} />
                      </div>
                    </div>

                    <h3 className="service-card-title">{service.title}</h3>
                    <p className="service-card-desc">{service.description}</p>

                    <ul className="service-feature-checklist">
                      {featuresList.map((feat, fIdx) => (
                        <li key={fIdx}>
                          <span className={`check-icon color-${color}`}>✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <LocalLink to="/contact" navigate={navigate} className="service-explore-link">
                      Explore Service <span className="link-arrow">→</span>
                    </LocalLink>
                  </article>
                );
              })}
            </div>

            <button onClick={scrollRight} className="carousel-control-btn right" aria-label="Next service">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* 3. BOTTOM WHY BUSINESSES CHOOSE TECHY BD BANNER */}
      <section className="why-choose-techybd-banner-section">
        <div className="container">
          <div className="why-choose-banner-card">
            <div className="why-banner-grid">
              {/* Title Box */}
              <div className="why-title-col">
                <h3>
                  Why Businesses<br />
                  Choose <span className="accent-orange-text">Techy BD</span>
                </h3>
              </div>

              {/* Feature 1 */}
              <div className="why-feature-col">
                <div className="why-icon-badge color-blue">
                  <Zap size={18} />
                </div>
                <div className="why-feature-text">
                  <h4>Fast Delivery</h4>
                  <p>On-time delivery without compromising quality.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="why-feature-col">
                <div className="why-icon-badge color-green">
                  <ShieldCheck size={18} />
                </div>
                <div className="why-feature-text">
                  <h4>Premium Quality</h4>
                  <p>High-quality design and clean, scalable code.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="why-feature-col">
                <div className="why-icon-badge color-purple">
                  <Smartphone size={18} />
                </div>
                <div className="why-feature-text">
                  <h4>Mobile First</h4>
                  <p>Responsive and mobile-first design for every device.</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="why-feature-col">
                <div className="why-icon-badge color-orange">
                  <Target size={18} />
                </div>
                <div className="why-feature-text">
                  <h4>Conversion Focused</h4>
                  <p>Design and strategy focused on real results.</p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="why-feature-col">
                <div className="why-icon-badge color-teal">
                  <Headphones size={18} />
                </div>
                <div className="why-feature-text">
                  <h4>Dedicated Support</h4>
                  <p>24/7 support and ongoing assistance when you need.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Section 10: Why Techy BD Section ("Same Design as Reference Image")
function WhySection() {
  const { settings } = useSiteContent();
  const why = settings.home.why;

  const defaultWhyItems = [
    { icon: "pen", title: "Premium Design", copy: "Clean, modern interfaces designed to make your brand look credible and professional." },
    { icon: "mobile", title: "Mobile First", copy: "Designed to work beautifully across phones, tablets and desktops." },
    { icon: "target", title: "Conversion Focused", copy: "Every layout is structured to guide visitors toward meaningful actions." },
    { icon: "zap", title: "Fast & Responsive", copy: "Lightweight, responsive experiences built for smooth real-world performance." },
    { icon: "trending", title: "Smart & Scalable", copy: "Websites and digital systems built to grow with your business." },
  ];

  const whyItems = defaultWhyItems;

  return (
    <section className="section why-section-editorial">
      <div className="container">
        <div className="why-header-editorial">
          <div className="why-badge-pill">
            <span className="why-badge-dot" />
            <span className="why-badge-text">WHY TECHY BD</span>
          </div>

          <h2 className="why-display-title">
            Why <em className="accent-serif">Techy</em> BD
          </h2>

          <p className="why-lead-copy">
            {why.copy || "Five clear standards that set our work apart."}
          </p>
          <div className="why-header-underline" />
        </div>

        {/* 5-Card Grid: 3 cards top row, 2 cards bottom row centered */}
        <div className="why-editorial-grid">
          <div className="why-grid-top-row">
            {whyItems.slice(0, 3).map((item, index) => (
              <article className="why-card-editorial" key={item.title}>
                <div className="why-card-top">
                  <span className="why-icon-badge">
                    <IconForService name={item.icon} size={20} />
                  </span>
                  <span className="why-number-badge">0{index + 1}</span>
                </div>

                <h3 className="why-card-serif-title">{item.title}</h3>
                <div className="why-card-line" />
                <p className="why-card-desc">{item.copy}</p>
              </article>
            ))}
          </div>

          <div className="why-grid-bottom-row">
            {whyItems.slice(3, 5).map((item, index) => (
              <article className="why-card-editorial" key={item.title}>
                <div className="why-card-top">
                  <span className="why-icon-badge">
                    <IconForService name={item.icon} size={20} />
                  </span>
                  <span className="why-number-badge">0{index + 4}</span>
                </div>

                <h3 className="why-card-serif-title">{item.title}</h3>
                <div className="why-card-line" />
                <p className="why-card-desc">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Section 11: Process Section ("How we work" - Horizontal Connected Timeline Layout)
function ProcessSection() {
  const processSteps = [
    {
      num: "01",
      icon: "user",
      title: "Discover",
      copy: "We understand your business, audience, products, and growth goals.",
      benefit: "Deep understanding clear direction",
    },
    {
      num: "02",
      icon: "clipboard",
      title: "Plan",
      copy: "We define the layout structure, conversion path, and user journey.",
      benefit: "Strategy-first planning built for results",
    },
    {
      num: "03",
      icon: "pen",
      title: "Design & Build",
      copy: "We design and develop the website with clean design and responsive behavior.",
      benefit: "Pixel-perfect design clean, efficient code",
    },
    {
      num: "04",
      icon: "rocket",
      title: "Launch",
      copy: "We test on real devices, polish details, and prepare the site for launch.",
      benefit: "Tested, optimized and ready to grow",
    },
  ];

  return (
    <section className="section process-section-editorial">
      <div className="container">
        <div className="process-header-editorial">
          <div className="process-badge-pill">
            <span className="process-badge-dot" />
            <span className="process-badge-text">HOW WE WORK</span>
          </div>

          <h2 className="process-display-title">
            How we <em className="accent-serif">work</em>
          </h2>

          <p className="process-lead-copy">
            A <em>calm, transparent</em> four-step process.
          </p>
          <div className="process-header-underline" />
        </div>

        {/* 4 Connected Step Cards in 1 Row (Grid of 4) */}
        <div className="process-cards-container">
          <div className="process-connecting-line" />
          <div className="process-cards-grid-4">
            {processSteps.map((step) => (
              <article className="process-step-card-editorial" key={step.num}>
                <div className="step-circle-icon-wrap">
                  <IconForService name={step.icon} size={22} />
                </div>
                <span className="step-big-num">{step.num}</span>
                <h3 className="step-card-title">{step.title}</h3>
                <p className="step-card-desc">{step.copy}</p>

                <div className="step-card-divider" />

                <div className="step-benefit-badge">
                  <CheckCircle2 size={16} className="step-check-icon" />
                  <span>{step.benefit}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="process-bottom-banner">
          <div className="banner-left-info">
            <div className="banner-icon-box">
              <Sparkles size={22} />
            </div>
            <div>
              <h4 className="banner-title">Clear process. No confusion.</h4>
              <p className="banner-copy">
                You'll always know what's happening, what's next, and how your project is moving forward.
              </p>
            </div>
          </div>

          <div className="banner-right-pillars">
            <div className="pillar-item">
              <ShieldCheck size={18} className="pillar-icon" />
              <span>Transparent at every step</span>
            </div>
            <div className="pillar-item">
              <Clock size={18} className="pillar-icon" />
              <span>On time every time</span>
            </div>
            <div className="pillar-item">
              <MessageCircle size={18} className="pillar-icon" />
              <span>Always in the loop</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GenderAvatar({ item }) {
  if (item?.avatar && String(item.avatar).trim()) {
    return <img src={item.avatar} alt={item.name} loading="lazy" className="testimonial-avatar-img" />;
  }

  const isFemale = item?.gender === "female" || ["nowsin", "zara", "ফারিয়া", "সারমিন", "সাবরিনা", "রুমানা", "ফাতেমা", "জারা"].some((g) => (item?.name || "").toLowerCase().includes(g));

  return (
    <div className={`testimonial-gender-avatar ${isFemale ? "gender-female" : "gender-male"}`} title={isFemale ? "Female Client" : "Male Client"}>
      {isFemale ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="9" r="6" />
          <path d="M12 15v7" />
          <path d="M9 19h6" />
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="14" r="6" />
          <path d="M14.2 9.8L20 4" />
          <path d="M15 4h5v5" />
        </svg>
      )}
    </div>
  );
}

// Section 12: Testimonial Section (Editorial Creative Paper Cards Showcase)
function TestimonialSection() {
  const { testimonials } = useSiteContent();

  const defaultTestimonials = [
    {
      name: "Nowsin Zara",
      gender: "female",
      role: "School Management System",
      avatar: "",
      quote: "আমাদের স্কুলের সমস্যাগুলো সমাধান করার জন্য আপনাকে আন্তরিক ধন্যবাদ। আপনার মূল্যবান সময় দিয়ে ধীরে ধীরে আমাদের সিস্টেমকে আরও উন্নত করা, সমস্যাগুলো চিহ্নিত করে সমাধান করা এবং একটি কার্যকর ও সুন্দর সিস্টেম তৈরি করে দেওয়ার জন্য আমরা সত্যিই কৃতজ্ঞ। আপনার সহযোগিতা ও আন্তরিক প্রচেষ্টার জন্য অসংখ্য ধন্যবাদ। ❤️",
      tag: "Featured Review",
    },
    {
      name: "Ibrahim Ahmed",
      gender: "male",
      role: "Business Client • Landing Page",
      avatar: "",
      quote: "আমাদের ব্যবসার জন্য অসাধারণ একটি Landing Page তৈরি করে দিয়েছে। Design, responsiveness এবং overall presentation—সবকিছুই অনেক professional। কাজের মান সত্যিই প্রশংসনীয়। ❤️",
      tag: "Highly Recommended",
    },
    {
      name: "Ahad Molla",
      gender: "male",
      role: "Website Client • Business Client",
      avatar: "",
      quote: "একটি সুন্দর ও professional Website দরকার ছিল, আর ঠিক আমাদের চাহিদা অনুযায়ী তৈরি করে দিয়েছে। Communication থেকে শুরু করে final delivery—পুরো process-টাই ছিল খুব smooth। Highly recommended!",
      tag: "Highly Recommended",
    },
    {
      name: "Adnan Islam",
      gender: "male",
      role: "Digital Client • Online Business",
      avatar: "",
      quote: "শুধু Website তৈরি নয়, আমাদের business কীভাবে আরও professionalভাবে online-এ present করা যায়—সেটাও সুন্দরভাবে বুঝিয়ে দিয়েছে। Design quality এবং attention to detail দুটোই অসাধারণ।",
      tag: "Highly Recommended",
    },
  ];

  const clientReviews = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <section className="section testimonials-section-editorial">
      <div className="container">
        {/* Header Row: Left Title & Copy, Right Rating Card */}
        <div className="testimonials-header-editorial">
          <div className="testimonials-header-left">
            <div className="testimonials-badge-pill">
              <span className="testimonials-badge-dot" />
              <span className="testimonials-badge-text">WHAT OUR CLIENTS SAY</span>
            </div>

            <h2 className="testimonials-display-title">
              What our <em className="accent-serif">clients say</em>
            </h2>

            <p className="testimonials-lead-copy">
              Real feedback from real clients who trusted us to build their online presence.
            </p>
            <div className="testimonials-header-underline" />
          </div>

          {/* Rating Badge Top Right */}
          <div className="testimonials-rating-badge-card">
            <div className="rating-star-circle">
              <Star size={24} className="rating-star-icon" fill="currentColor" />
            </div>
            <div>
              <div className="rating-score">4.9/5</div>
              <div className="rating-sub">Average rating</div>
              <div className="rating-note">Based on 40+ reviews</div>
            </div>
          </div>
        </div>

        {/* 2x2 Grid of Testimonial Cards */}
        <div className="testimonials-cards-grid-2x2">
          {clientReviews.slice(0, 4).map((item, idx) => (
            <article className="testimonial-card-editorial" key={`${item.name}-${idx}`}>
              <div className="testimonial-card-top-row">
                <span className="testimonial-quote-mark">“</span>
                <span className="testimonial-heart-badge">❤️</span>
              </div>

              <div className="testimonial-author-box">
                <GenderAvatar item={item} />
                <div className="testimonial-author-info">
                  <h3 className="testimonial-author-name">{item.name}</h3>
                  <span className="testimonial-author-role">{item.role || `${item.title || "Client"} • ${item.brand || "Techy BD"}`}</span>
                </div>
              </div>

              <p className="testimonial-body-quote">{item.quote}</p>

              <div className="testimonial-card-bottom-row">
                <div className="testimonial-stars-group">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="star-purple-icon" fill="currentColor" />
                  ))}
                </div>

                <span className="testimonial-recommended-pill">{item.tag || "Highly Recommended"}</span>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Trust Line */}
        <div className="testimonials-bottom-trust-line">
          <span className="quote-mini-icon">”</span>
          <span>TRUSTED BY GROWING BUSINESSES ACROSS <strong className="accent-orange">BANGLADESH</strong></span>
        </div>
      </div>
    </section>
  );
}

// Section 13: Case Study Experience Page
function CaseStudyPage({ slug, navigate }) {
  const { projects } = useSiteContent();
  const project = projects.find((p) => p.slug === slug || p.id === slug);

  if (!project) {
    return (
      <div className="container section">
        <h2>Project Not Found</h2>
        <p>The requested case study could not be located.</p>
        <LocalLink to="/work" navigate={navigate} className="button button-primary">
          Back to Selected Work
        </LocalLink>
      </div>
    );
  }

  const statusClass = project.status === "LIVE" ? "status-live" : "status-concept";

  return (
    <div className="case-study-page">
      <div className="container">
        <div className="case-study-header">
          <LocalLink to="/work" navigate={navigate} className="back-link">
            <ArrowLeft size={16} /> Back to Work
          </LocalLink>
          <div className="case-study-meta-badges">
            <span className={`project-status-badge ${statusClass}`}>{project.status || "LIVE"}</span>
            <span className="project-category-badge">{project.category}</span>
          </div>
          <h1 className="case-study-title">{project.title}</h1>
          <p className="case-study-lead">{project.description}</p>

          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="button button-primary case-study-live-btn"
          >
            Visit Live Website <ArrowUpRight size={17} />
          </a>
        </div>

        <div className="case-study-hero-image">
          <img src={project.image} alt={project.title} />
        </div>

        <div className="case-study-grid-content">
          <div className="case-study-main-col">
            <section className="case-study-section">
              <h2>Overview</h2>
              <p>{project.overview || project.description}</p>
            </section>

            <section className="case-study-section">
              <h2>The Challenge</h2>
              <p>
                {project.challenge ||
                  "The client needed a mobile-optimized storefront that built instant buyer trust, loaded fast on local networks, and streamlined the order checkout process."}
              </p>
            </section>

            <section className="case-study-section">
              <h2>Our Approach</h2>
              <p>
                {project.approach ||
                  "We structured a clean hierarchy, designed a mobile-first catalog, integrated native bKash/COD payment options, and eliminated friction steps during order entry."}
              </p>
            </section>

            <section className="case-study-section">
              <h2>Design Direction</h2>
              <p>
                {project.designDirection ||
                  "Clean typography, comfortable spacing, high-contrast action buttons, and purposeful product imagery."}
              </p>
            </section>
          </div>

          <aside className="case-study-sidebar">
            <div className="sidebar-box">
              <h3>Key Features</h3>
              <ul>
                {(
                  project.keyFeatures || [
                    "Mobile-first responsive storefront",
                    "Direct Cash on Delivery & bKash checkout",
                    "Fast loading times",
                    "Clear product hierarchy",
                  ]
                ).map((feat, i) => (
                  <li key={i}><Check size={16} /> {feat}</li>
                ))}
              </ul>
            </div>

            <div className="sidebar-box">
              <h3>Results</h3>
              <ul>
                <li>Better product presentation</li>
                <li>Improved mobile experience</li>
                <li>Clearer navigation</li>
                <li>Stronger visual hierarchy</li>
              </ul>
            </div>

            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="button button-primary full-width-btn"
            >
              Visit Live Website ↗
            </a>
          </aside>
        </div>
      </div>
    </div>
  );
}

// Section 14: Final Call to Action Section (Removed per request)
function FinalCTA({ navigate }) {
  return null;
}

// Section 15: Footer
function Footer({ navigate }) {
  const { settings, assets } = useSiteContent();
  const { brand, contact, nav } = settings;

  return (
    <footer className="site-footer-redesign">
      <div className="container footer-top-grid">
        <div className="footer-brand-col">
          <div className="footer-logo-row">
            <img src={brand.logoUrl || assets.logo} alt={brand.name} className="footer-logo-img" />
            <span className="footer-brand-name">{brand.name}</span>
          </div>
          <p className="footer-desc">
            We design and build premium websites and digital experiences for growing businesses in Bangladesh.
          </p>
        </div>

        <div className="footer-links-col">
          <h4>Explore</h4>
          <ul>
            {nav.map(({ label, path: to }) => (
              <li key={to}>
                <LocalLink to={to} navigate={navigate}>{label}</LocalLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Services</h4>
          <ul>
            <li><LocalLink to="/services" navigate={navigate}>eCommerce Websites</LocalLink></li>
            <li><LocalLink to="/services" navigate={navigate}>Business Websites</LocalLink></li>
            <li><LocalLink to="/services" navigate={navigate}>Landing Pages</LocalLink></li>
            <li><LocalLink to="/services" navigate={navigate}>Course & eBook Websites</LocalLink></li>
            <li><LocalLink to="/services" navigate={navigate}>Website Automation</LocalLink></li>
          </ul>
        </div>

        <div className="footer-contact-col">
          <h4>Contact</h4>
          <p>Email: <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
          <p>WhatsApp: <a href={contact.whatsappUrl} target="_blank" rel="noreferrer">{contact.whatsapp}</a></p>
          <p>Location: {contact.address}</p>
        </div>
      </div>

      <div className="container footer-bottom-bar">
        <span>© 2026 Techy BD. All rights reserved.</span>
        <span>Built with care for Bangladeshi businesses.</span>
      </div>
    </footer>
  );
}

// Mobile Floating CTA bar
function MobileActions({ navigate }) {
  const { settings } = useSiteContent();
  return (
    <div className="mobile-actions-bar">
      <a href={settings.contact.whatsappUrl} target="_blank" rel="noreferrer" className="mobile-action-wa">
        <MessageCircle size={18} /> WhatsApp
      </a>
      <LocalLink to="/contact" navigate={navigate} className="mobile-action-cta">
        Start a Project →
      </LocalLink>
    </div>
  );
}

// Homepage layout (Section 25 Hierarchy)
function HomePage({ navigate, onBuyItem }) {
  return (
    <>
      <Hero navigate={navigate} />
      <FeaturedWork navigate={navigate} onBuyItem={onBuyItem} />
      <ServicesSection navigate={navigate} onBuyItem={onBuyItem} isHomePage={true} />
      <WhySection />
      <ProcessSection />
      <TestimonialSection />
      <FinalCTA navigate={navigate} />
    </>
  );
}

function WorkPage({ navigate, onBuyItem }) {
  const { settings } = useSiteContent();
  const work = settings.home.work;
  return (
    <>
      <FeaturedWork full navigate={navigate} onBuyItem={onBuyItem} />
      <FinalCTA navigate={navigate} />
    </>
  );
}

function ServicesPage({ navigate, onBuyItem }) {
  const { settings } = useSiteContent();
  const services = settings.home.services;
  return (
    <>
      <ServicesSection navigate={navigate} onBuyItem={onBuyItem} isHomePage={false} />
      <FinalCTA navigate={navigate} />
    </>
  );
}

function AboutHero() {
  return (
    <section className="about-hero-section">
      <div className="grid-backdrop" />
      <div className="container about-hero-container">
        <span className="eyebrow-badge">ABOUT TECHY BD</span>
        <h1 className="about-hero-title">
          We build digital experiences<br />
          for businesses ready to grow.
        </h1>
        <p className="about-hero-lead">
          Techy BD is a web design, development and automation studio helping businesses turn ideas into premium digital experiences.
        </p>
        <p className="about-hero-sub">
          Based in Bangladesh. Working with clients worldwide.
        </p>
      </div>
    </section>
  );
}

function AboutApproach() {
  return (
    <section className="about-approach-section">
      <div className="container about-approach-container">
        <div className="approach-left">
          <span className="section-label">OUR APPROACH</span>
          <h2 className="approach-title">More than just a website.</h2>
        </div>
        <div className="approach-right">
          <p className="approach-text-primary">
            We believe a website should do more than look good. It should communicate your brand, build trust, make your business easier to understand, and help people take action.
          </p>
          <p className="approach-text-secondary">
            From eCommerce stores and landing pages to custom business websites and automation systems, we design and build digital solutions around real business needs.
          </p>
        </div>
      </div>
    </section>
  );
}

function AboutWhatWeDo() {
  const services = [
    {
      num: "01",
      title: "Web Design",
      desc: "Premium interfaces designed around your brand, audience and business goals.",
    },
    {
      num: "02",
      title: "Web Development",
      desc: "Fast, responsive and scalable websites built for real-world use.",
    },
    {
      num: "03",
      title: "eCommerce",
      desc: "Modern online stores designed to make products easier to discover, trust and buy.",
    },
    {
      num: "04",
      title: "Automation",
      desc: "Digital systems and workflows that reduce repetitive work and make businesses more efficient.",
    },
    {
      num: "05",
      title: "Landing Pages",
      desc: "Focused pages designed around a specific campaign, product, service or conversion goal.",
    },
  ];

  return (
    <section className="about-what-we-do-section">
      <div className="container">
        <div className="what-we-do-header">
          <span className="section-label">WHAT WE DO</span>
          <h2 className="section-title">
            Design, technology and systems that move businesses forward.
          </h2>
        </div>

        <div className="what-we-do-list">
          {services.map((item) => (
            <div key={item.num} className="what-we-do-item">
              <span className="service-number">{item.num}</span>
              <div className="service-content">
                <h3 className="service-title">{item.title}</h3>
                <p className="service-desc">{item.desc}</p>
              </div>
              <span className="service-arrow">→</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutTeam() {
  const teamMembers = [
    {
      name: "MD Omar Faruk",
      role: "AI Automation & Web Design Specialist",
      bio: "I design and build AI-powered automation systems, modern websites, and intelligent dashboard experiences that help businesses work smarter and more efficiently. I combine thoughtful design with AI and automation to create practical digital solutions that simplify workflows, improve user experiences, and support business growth.",
      photo: "/omar-faruk.jpg",
    },
    {
      name: "Jisune",
      role: "AI Systems & Integration Lead",
      bio: "I design and build AI-powered automation systems, intelligent agents, and custom API integrations that help businesses reduce manual work, streamline operations, and scale efficiently. From n8n workflows and CRM automation to AI products and browser extensions, I turn complex ideas into practical, reliable solutions.",
      photo: "/jisune.jpg",
    },
  ];

  return (
    <section className="about-team-section">
      <div className="container">
        <div className="team-header">
          <span className="section-label">THE PEOPLE BEHIND TECHY BD</span>
          <h2 className="section-title">A small team with a big focus.</h2>
          <p className="section-lead">
            We combine design, technology and problem-solving to build digital experiences that work beautifully and serve a real purpose.
          </p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.name} className="team-card">
              <div className="team-photo-wrap">
                <img
                  src={member.photo}
                  alt={`${member.name} — ${member.role} at Techy BD`}
                  className="team-photo"
                />
              </div>
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p className="team-bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutGlobalPositioning() {
  return (
    <section className="about-global-section">
      <div className="container about-global-container">
        <div className="global-content">
          <h2 className="global-title">
            Based in Bangladesh.<br />
            Built for the world.
          </h2>
          <div className="global-divider" />
          <p className="global-text">
            We’re based in Bangladesh, but our work isn’t limited by borders. We’re open to working with businesses, founders and teams from anywhere in the world.
          </p>
        </div>
      </div>
    </section>
  );
}

function AboutCapabilities() {
  const capabilities = [
    "WEB DESIGN",
    "DEVELOPMENT",
    "eCOMMERCE",
    "AUTOMATION",
    "LANDING PAGES",
    "DIGITAL EXPERIENCES",
  ];

  return (
    <section className="about-capabilities-section">
      <div className="container">
        <span className="section-label">CAPABILITIES</span>
        <div className="capabilities-strip">
          {capabilities.map((cap, idx) => (
            <span key={cap} className="capability-wrapper">
              <span className="capability-item">{cap}</span>
              {idx < capabilities.length - 1 && <span className="capability-dot">•</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutFinalCTA({ navigate }) {
  return (
    <section className="about-cta-section">
      <div className="container about-cta-container">
        <span className="section-label">LET'S WORK TOGETHER</span>
        <h2 className="about-cta-title">Have something in mind?</h2>
        <p className="about-cta-copy">
          Let's turn your idea into a digital experience built for your business.
        </p>

        <div className="about-cta-buttons">
          <LocalLink to="/contact" navigate={navigate} className="button button-primary cta-btn-primary">
            Start a Project →
          </LocalLink>
          <LocalLink to="/contact" navigate={navigate} className="button button-secondary cta-btn-secondary">
            Contact Us →
          </LocalLink>
        </div>
      </div>
    </section>
  );
}

function AboutPage({ navigate }) {
  return (
    <div className="about-page-redesign">
      <AboutHero />
      <AboutApproach />
      <AboutWhatWeDo />
      <AboutTeam />
      <AboutGlobalPositioning />
      <AboutFinalCTA navigate={navigate} />
    </div>
  );
}

function ContactPage({ navigate }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { settings } = useSiteContent();

  const contact = settings?.contact || {
    email: "info@techybd.com",
    phone: "01581503522",
    whatsapp: "01581503522",
    whatsappUrl: "https://wa.me/8801581503522?text=Hi%20Techy%20BD%2C%20I%27d%20like%20to%20discuss%20a%20website%20project.",
    availability: "All Days",
    socials: {
      facebook: "https://www.facebook.com/share/18Jr82howW/",
      instagram: "https://www.instagram.com/iambadolskofficial",
      linkedin: "https://www.linkedin.com/in/badol-sk",
    },
  };

  const whatsappMessage = encodeURIComponent("Hi Techy BD, I'd like to discuss a website project.");
  const directWhatsappUrl = `https://wa.me/8801581503522?text=${whatsappMessage}`;

  const submit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    const formData = new FormData(event.currentTarget);
    const firstName = (formData.get("firstName") || "").trim();
    const lastName = (formData.get("lastName") || "").trim();
    const email = (formData.get("email") || "").trim();
    const projectNotes = (formData.get("notes") || "").trim();

    if (!firstName || !lastName || !email || !projectNotes) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const message = `Hi Techy BD,\n\nI'd like to discuss a website project:\n• Name: ${firstName} ${lastName}\n• Email: ${email}\n• Project Details: ${projectNotes}`;
      const userWaUrl = `https://wa.me/8801581503522?text=${encodeURIComponent(message)}`;
      
      setSubmitted(true);
      setIsSubmitting(false);
      window.open(userWaUrl, "_blank", "noopener,noreferrer");
      event.currentTarget.reset();
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg("Something went wrong. Please try again or chat on WhatsApp.");
    }
  };

  return (
    <div className="contact-page-redesign">
      <div className="container contact-container-redesign">
        {/* Left Column: Essential contact information */}
        <div className="contact-left-col">
          <h1 className="contact-display-title">
            Let's build something<br />
            great for your business.
          </h1>

          <p className="contact-lead-text">
            Have a website idea or need a better digital experience? Tell us what you're looking for and we'll get back to you.
          </p>

          <div className="contact-direct-info-group">
            {/* EMAIL */}
            <div className="contact-info-block">
              <span className="contact-info-label">
                <Mail size={13} className="info-icon" /> EMAIL
              </span>
              <a href={`mailto:${contact.email || "info@techybd.com"}`} className="contact-info-value-link">
                {contact.email || "info@techybd.com"}
              </a>
            </div>

            {/* PHONE / WHATSAPP */}
            <div className="contact-info-block">
              <span className="contact-info-label">
                <MessageCircle size={13} className="info-icon" /> PHONE / WHATSAPP
              </span>
              <div className="contact-info-phone-actions">
                <a href={`tel:${contact.phone || "01581503522"}`} className="contact-info-value-link">
                  {contact.phone || "01581503522"}
                </a>
              </div>
            </div>

            {/* AVAILABLE */}
            <div className="contact-info-block">
              <span className="contact-info-label">
                <Check size={13} className="info-icon" /> AVAILABLE
              </span>
              <span className="contact-info-value-text">
                {contact.availability || "All Days"}
              </span>
            </div>
          </div>

          {/* Optional Social Links */}
          {contact.socials && (
            <div className="contact-social-row">
              {contact.socials.facebook && (
                <a href={contact.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                  f
                </a>
              )}
              {contact.socials.instagram && (
                <a href={contact.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                  ◎
                </a>
              )}
              {contact.socials.linkedin && (
                <a href={contact.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  in
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Contact Form Card */}
        <div className="contact-right-col">
          <div className="contact-form-card">
            <form className="contact-form-inner" onSubmit={submit} noValidate>
              {/* Row 1: First Name & Last Name */}
              <div className="form-row-2col">
                <div className="form-field">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    required
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Enter your first name..."
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    required
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Enter your last name..."
                  />
                </div>
              </div>

              {/* Row 2: Email Address */}
              <div className="form-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address..."
                />
              </div>

              {/* Row 3: Tell us about your project */}
              <div className="form-field">
                <label htmlFor="notes">Tell us about your project</label>
                <textarea
                  id="notes"
                  required
                  name="notes"
                  rows="5"
                  placeholder="Tell us about your business, website idea, or what you'd like us to build..."
                />
              </div>

              {errorMsg && <p className="form-error-notice">{errorMsg}</p>}

              {/* Row 4: Primary Form Button & WhatsApp Action */}
              <div className="form-actions-stack">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="button button-primary form-cta-btn"
                >
                  {isSubmitting ? "Sending..." : "Send Message →"}
                </button>

                <a
                  href={directWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-secondary whatsapp-cta-btn"
                >
                  <MessageCircle size={16} /> Chat on WhatsApp →
                </a>
              </div>

              {submitted && (
                <p className="form-success-notice">
                  <Check size={18} /> Thanks! Your message has been sent. We'll get back to you soon.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { path, navigate } = useRoute();
  const { settings } = useSiteContent();
  const route = path.replace(/\/$/, "") || "/";

  useEffect(() => {
    document.body.classList.toggle("public-site-body", route !== "/admin");
  }, [route]);

  useEffect(() => {
    if (route === "/admin") return;
    if (route === "/contact") {
      document.title = "Contact Techy BD — Let's Build Your Website";
      const description = document.querySelector('meta[name="description"]');
      if (description) description.setAttribute("content", "Have a website idea? Contact Techy BD for premium web design, development and automation services for Bangladeshi businesses.");
      return;
    }
    const title = settings.seo?.title || `${settings.brand.name} — ${settings.brand.tagline}`;
    document.title = title;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", settings.seo?.description || settings.brand.description || "");
  }, [route, settings]);

  // Smooth Minimal Scroll Reveal & Stagger Animation
  useEffect(() => {
    if (route === "/admin") return;

    let observer;
    const timeoutId = setTimeout(() => {
      const observerCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer?.unobserve(entry.target);
          }
        });
      };

      observer = new IntersectionObserver(observerCallback, {
        root: null,
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.08,
      });

      const selectors = [
        ".hero-title",
        ".hero-copy",
        ".hero-badge",
        ".hero-actions",
        ".hero-supporting-line",
        ".team-header",
        ".team-card",
        ".work-section-header",
        ".project-filter-tabs-wrap",
        ".framer-portfolio-card",
        ".see-all-projects-interactive-cta",
        ".services-header-editorial",
        ".service-card-editorial",
        ".why-header-editorial",
        ".why-card-editorial",
        ".process-header-editorial",
        ".process-step-card-editorial",
        ".process-bottom-banner",
        ".testimonials-header-editorial",
        ".testimonial-card-editorial",
        ".testimonials-bottom-trust-line",
        ".contact-left-col",
        ".contact-form-card",
        ".about-hero-container > *",
        ".about-story-col",
        ".reveal-on-scroll"
      ];

      const elementsToObserve = document.querySelectorAll(selectors.join(", "));
      elementsToObserve.forEach((el) => {
        if (!el.classList.contains("is-revealed")) {
          el.classList.add("reveal-on-scroll");
          const parentGrid = el.closest(
            ".framer-marketplace-grid, .services-editorial-grid, .why-grid-top-row, .why-grid-bottom-row, .process-cards-track, .testimonials-cards-grid-2x2, .team-grid"
          );
          if (parentGrid) {
            const siblings = Array.from(parentGrid.children);
            const elIndex = siblings.indexOf(el);
            if (elIndex >= 0) {
              el.style.setProperty("--stagger-index", elIndex);
            }
          }
          observer.observe(el);
        }
      });
    }, 60);

    return () => {
      clearTimeout(timeoutId);
      observer?.disconnect();
    };
  }, [route]);

  if (route === "/admin") return <AdminApp />;
  if (route === "/account" || route === "/login") return <CustomerApp navigate={navigate} />;

  let page;
  if (route === "/") page = <HomePage navigate={navigate} />;
  else if (route === "/work") page = <WorkPage navigate={navigate} />;
  else if (route.startsWith("/work/")) {
    const slug = route.replace("/work/", "");
    page = <CaseStudyPage slug={slug} navigate={navigate} />;
  } else if (route === "/services") page = <ServicesPage navigate={navigate} />;
  // else if (route === "/about") page = <AboutPage navigate={navigate} />;
  else if (route === "/contact") page = <ContactPage navigate={navigate} />;
  else page = <HomePage navigate={navigate} />;

  return (
    <div className="public-site">
      <Header path={route} navigate={navigate} />
      <main>{page}</main>
      <Footer navigate={navigate} />
      <MobileActions navigate={navigate} />
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <ContentProvider>
    <App />
  </ContentProvider>
);
