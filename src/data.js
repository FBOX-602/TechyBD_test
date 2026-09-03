export const cloudinary = "https://res.cloudinary.com/dsbkkhpdq/image/upload";

export const assets = {
  logo: "/techy-bd-logo.png",
  heroCheckout: `${cloudinary}/v1786481754/hero/checkout/le3a1nkw3qqyqpgf940t.webp`,
  heroProductOne: `${cloudinary}/v1786481197/hero/products/edspmcegeuc22hexa8ky.webp`,
  heroProductTwo: `${cloudinary}/v1786481246/hero/products/zthaxnru0gagcjvwzo5c.webp`,
  heroProductThree: `${cloudinary}/v1786481251/hero/products/nz6dmd7wofgiff7crtr1.webp`,
  hosting: `${cloudinary}/v1780859871/free-hosting/jhfbqouqmxkpqywalau7.webp`,
  offerOne: `${cloudinary}/v1777832292/hot-offers/qveujpsesdafzchxsyzx.png`,
  offerTwo: `${cloudinary}/v1777832302/hot-offers/fcpxobpwtat68sd5et5m.png`,
  ecommerceService: `${cloudinary}/v1783785294/services/voqdj9mzwr7kizjhisie.png`,
  landingService: `${cloudinary}/v1783785305/services/jkxhphihblgoydcfacrm.png`,
  pixelService: `${cloudinary}/v1780858740/services/enx5dk0gehsip9vczwca.webp`,
  trackingService: `${cloudinary}/v1780858931/services/ijn39i9ryvyxiso4yqgx.webp`,
  maintenanceService: `${cloudinary}/v1781338799/services/e8teffl3cejksrguce6m.webp`,
};

// Offline fallback and initial CMS seed.
export const siteSettings = {
  brand: {
    name: "Techy BD",
    logoUrl: "/techy-bd-logo.png",
    tagline: "Premium Websites for Growing Bangladeshi Businesses",
    description: "We design and build high-quality eCommerce, business websites, landing pages and digital experiences for growing brands in Bangladesh.",
    footerCopy: "We design and build premium websites and digital experiences for growing businesses in Bangladesh.",
    copyright: "© 2026 Techy BD. All rights reserved.",
  },
  nav: [
    { label: "Home", path: "/" },
    { label: "Project", path: "/work" },
    { label: "Services", path: "/services" },
    // { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ],
  contact: {
    email: "info@techybd.com",
    phone: "01581503522",
    whatsapp: "01581503522",
    whatsappUrl: "https://wa.me/8801581503522?text=Hi%20Techy%20BD%2C%20I%27d%20like%20to%20discuss%20a%20website%20project.",
    availability: "All Days",
    address: "196/D, Amtola, Khilkhet Namapara, Dhaka-1229",
    socials: {
      facebook: "https://www.facebook.com/share/18Jr82howW/",
      instagram: "https://www.instagram.com/iambadolskofficial",
      linkedin: "https://www.linkedin.com/in/badol-sk",
    },
  },
  seo: {
    title: "Techy BD — Premium Websites for Bangladeshi Businesses",
    description: "Techy BD designs and builds premium eCommerce, business websites, landing pages and digital experiences for growing businesses in Bangladesh.",
  },
  assets: { ...assets },
  home: {
    hero: {
      trustLabel: "● Helping Bangladeshi businesses grow online",
      overline: "Websites that make",
      title: "Bangladeshi businesses look premium.",
      copy: "We design and build high-quality eCommerce, business websites, landing pages and digital experiences for growing brands in Bangladesh.",
      primaryCtaLabel: "View Our Work →",
      secondaryCtaLabel: "Start a Project →",
      supportingLine: "eCommerce • Business Websites • Landing Pages",
    },
    trust: {
      heading: "Trusted by growing businesses",
      statement: "Websites designed for ambitious Bangladeshi businesses.",
      pillars: [
        { title: "Mobile-First", copy: "Optimized for seamless phone browsing and fast 4G connections." },
        { title: "Conversion-Focused", copy: "Structured layouts and clear calls to action to drive real sales." },
        { title: "Fast & Responsive", copy: "Ultra-clean code ensuring instant page load times." },
        { title: "Bangladesh-Focused", copy: "Native bKash, Nagad, Cash on Delivery, and WhatsApp integration." },
      ],
      rails: ["bKash", "Nagad", "Rocket", "Cash on Delivery", "Pathao", "Steadfast", "Shopify", "WooCommerce", "Next.js"],
    },
    work: {
      eyebrow: "Selected Work",
      title: "Selected Work",
      copy: "A selection of websites we've designed and built for businesses and brands in Bangladesh.",
      allLinkLabel: "View All Projects →",
      featuredLimit: 6,
      pageEyebrow: "Portfolio",
      pageTitle: "Digital experiences made to stand out.",
      pageCopy: "Explore our complete showcase of eCommerce stores, business sites, landing pages, and web apps.",
    },
    services: {
      eyebrow: "What we build",
      title: "What we build",
      copy: "From business websites to high-converting landing pages, we build digital experiences designed around your business goals.",
      pageEyebrow: "Services",
      pageTitle: "Services designed to grow your business online.",
      pageCopy: "Clean code, mobile-first design, and seamless local payment workflows.",
    },
    why: {
      eyebrow: "Why Techy BD",
      title: "Why Techy BD",
      copy: "Five clear standards that set our work apart.",
      items: [
        { icon: "sparkles", title: "Premium Design", copy: "Clean, modern and professional interfaces that elevate your brand identity." },
        { icon: "mobile", title: "Mobile First", copy: "Designed to work properly across phones, tablets and desktops." },
        { icon: "trending", title: "Conversion Focused", copy: "Layouts and content structured around clear business goals and orders." },
        { icon: "zap", title: "Fast & Responsive", copy: "Optimized for real-world browsing speeds on local networks." },
        { icon: "shopping", title: "Built for Bangladesh", copy: "Designed with Bangladeshi businesses and customers in mind." },
      ],
    },
    process: {
      eyebrow: "How we work",
      title: "How we work",
      copy: "A simple, transparent four-step process for launch readiness.",
      items: [
        ["01", "Discover", "We understand your business, audience, products, and growth goals."],
        ["02", "Plan", "We define the layout structure, conversion path, and user journey."],
        ["03", "Design & Build", "We design and develop the website with responsive behavior."],
        ["04", "Launch", "We test on real devices, polish details, and prepare the site for launch."],
      ],
    },
    testimonials: {
      eyebrow: "Testimonials",
      title: "What our clients say",
      copy: "Built for businesses that want to look better online.",
    },
    finalCta: {
      eyebrow: "Have a business idea?",
      title: "Let's turn it into a website that works for your business.",
      copy: "Tell us what you're building. We'll help you choose the right website structure and next steps.",
      primaryLabel: "Start a Project →",
      secondaryLabel: "Chat on WhatsApp →",
    },
  },
};

export const projects = [
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

export const services = [
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

export const offers = [];

export const testimonials = [
  {
    name: "Nowsin Zara",
    gender: "female",
    role: "School Management System",
    brand: "School Client",
    quote: "আমাদের স্কুলের সমস্যাগুলো সমাধান করার জন্য আপনাকে আন্তরিক ধন্যবাদ। আপনার মূল্যবান সময় দিয়ে ধীরে ধীরে আমাদের সিস্টেমকে আরও উন্নত করা, সমস্যাগুলো চিহ্নিত করে সমাধান করা এবং একটি কার্যকর ও সুন্দর সিস্টেম তৈরি করে দেওয়ার জন্য আমরা সত্যিই কৃতজ্ঞ। আপনার সহযোগিতা ও আন্তরিক প্রচেষ্টার জন্য অসংখ্য ধন্যবাদ। ❤️",
    avatar: "",
  },
  {
    name: "Ibrahim Ahmed",
    gender: "male",
    role: "Business Client",
    brand: "Landing Page",
    quote: "আমাদের ব্যবসার জন্য অসাধারণ একটি Landing Page তৈরি করে দিয়েছে। Design, responsiveness এবং overall presentation—সবকিছুই অনেক professional। কাজের মান সত্যিই প্রশংসনীয়। ❤️",
    avatar: "",
  },
  {
    name: "Ahad Molla",
    gender: "male",
    role: "Website Client",
    brand: "Business Client",
    quote: "একটি সুন্দর ও professional Website দরকার ছিল, আর ঠিক আমাদের চাহিদা অনুযায়ী তৈরি করে দিয়েছে। Communication থেকে শুরু করে final delivery—পুরো process-টাই ছিল খুব smooth। Highly recommended!",
    avatar: "",
  },
  {
    name: "Adnan Islam",
    gender: "male",
    role: "Digital Client",
    brand: "Online Business Client",
    quote: "শুধু Website তৈরি নয়, আমাদের business কীভাবে আরও professionalভাবে online-এ present করা যায়—সেটাও সুন্দরভাবে বুঝিয়ে দিয়েছে। Design quality এবং attention to detail দুটোই অসাধারণ।",
    avatar: "",
  },
];

export const faqItems = [
  ["পেমেন্ট কীভাবে নেবেন — অ্যাডভান্স কত?", "প্রজেক্টের scope ঠিক হওয়ার পর কাজ শুরু করার জন্য advance নেওয়া হয়। বাকি অংশ milestone অনুযায়ী পরিষ্কারভাবে জানানো থাকে।"],
  ["লঞ্চের পর কোনো সাপোর্ট পাব?", "হ্যাঁ। লঞ্চের পর handover support এবং প্রয়োজন অনুযায়ী monthly maintenance support রাখা যায়।"],
  ["bKash, Nagad, COD সেটআপ সব দিয়ে দেবেন?", "আপনার ব্যবসার flow অনুযায়ী bKash, Nagad, COD এবং WhatsApp ordering option সাজিয়ে দেওয়া হয়।"],
  ["আমি নিজে এডিট করতে পারব?", "হ্যাঁ, প্রয়োজন অনুযায়ী সহজ admin workflow এবং handover guide দেওয়া হয়।"],
  ["প্রজেক্ট দেরি হলে কী হবে?", "শুরুর আগে একটি পরিষ্কার timeline দেওয়া হয়। কোনো পরিবর্তন হলে আগে থেকেই জানিয়ে দেওয়া হয়।"],
];

export const customers = [
  {
    id: "cust-1",
    name: "MD Omar Faruk",
    emailOrPhone: "01581503522",
    status: "Active",
    totalOrders: "2 Orders",
    totalSpent: "৳ 15,498",
    notes: "Purchased PureBangla Organic eCommerce Site & Meta Pixel Setup.",
  },
  {
    id: "cust-2",
    name: "রুমানা আক্তার",
    emailOrPhone: "01712345678",
    status: "VIP",
    totalOrders: "3 Orders",
    totalSpent: "৳ 28,997",
    notes: "Noor Skincare brand owner. Requested monthly maintenance support.",
  },
  {
    id: "cust-3",
    name: "সায়েদ হোসেন",
    emailOrPhone: "sayed@maatirsaaj.com",
    status: "Active",
    totalOrders: "1 Order",
    totalSpent: "৳ 12,499",
    notes: "Maatir Saaj Product Store.",
  },
];

export const profiles = [
  {
    id: "profile-1",
    name: "MD Omar Faruk",
    role: "AI Automation & Web Design Specialist",
    bio: "I design and build AI-powered automation systems, modern websites, and intelligent dashboard experiences that help businesses work smarter and more efficiently. I combine thoughtful design with AI and automation to create practical digital solutions that simplify workflows, improve user experiences, and support business growth.",
    photo: "/omar-faruk.jpg",
    facebook: "https://www.facebook.com/share/18Jr82howW/",
    linkedin: "https://www.linkedin.com/in/badol-sk",
    whatsapp: "https://wa.me/8801581503522",
    github: "",
  },
  {
    id: "profile-2",
    name: "Jisune",
    role: "AI Systems & Integration Lead",
    bio: "I design and build AI-powered automation systems, intelligent agents, and custom API integrations that help businesses reduce manual work, streamline operations, and scale efficiently. From n8n workflows and CRM automation to AI products and browser extensions, I turn complex ideas into practical, reliable solutions.",
    photo: "/jisune.jpg",
    facebook: "",
    linkedin: "https://www.linkedin.com/in/badol-sk",
    whatsapp: "https://wa.me/8801581503522",
    github: "https://github.com/",
  },
];
