# PROJECT.md — Handmade Embroidery Business Website

## 1. Overview

A modern, minimalist static website (HTML, CSS, JavaScript only — no backend/database) to showcase a handmade embroidery business. The site serves as a **portfolio + brand website**. Actual purchases happen on the existing **Shopier** store; the website links out to Shopier via "Buy on Shopier" buttons.

Product categories include: **Flowers, Movie & TV characters, Anime-inspired designs, Custom embroidery, Seasonal items.**

The project is intentionally structured so it can be **migrated to a Flask (Python) application later with minimal rework** (see Section 8).

---

## 2. Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero section, featured products, category teasers, about teaser, call-to-action |
| Products | `products.html` | Full shoppable catalog rendered from `content/products.json`, each item has a "Buy on Shopier" button |
| Gallery | `gallery.html` | Artistic portfolio/lookbook, filterable by category (Flowers, Movie/TV, Anime, Custom, Seasonal); may include process shots and non-for-sale pieces |
| About | `about.html` | Artist story, process/behind-the-scenes, brand values |
| Custom Orders | `custom-orders.html` | Explains custom order process/steps, links to Shopier or contact for inquiries |
| Contact | `contact.html` | Contact info, social links, FAQ |
| 404 | `404.html` | Custom not-found page |

**Products vs. Gallery distinction:** Products = shoppable catalog with prices and Buy buttons. Gallery = artistic showcase/portfolio (craftsmanship-focused, may not all be for sale).

---

## 3. Folder Structure

```
embroidery-website/
├── index.html
├── products.html
├── gallery.html
├── about.html
├── custom-orders.html
├── contact.html
├── 404.html
├── PROJECT.md
├── README.md
├── RULES.md
├── robots.txt          (future task — placeholder near launch)
├── sitemap.xml         (future task — placeholder near launch)
├── assets/
│   ├── css/
│   │   ├── base.css        (reset, CSS variables, typography)
│   │   ├── layout.css      (header, footer, grid, containers)
│   │   ├── components.css  (buttons, cards, nav, modals, tags)
│   │   └── pages/           (page-specific overrides if needed)
│   ├── js/
│   │   ├── main.js          (nav toggle, shared interactions)
│   │   ├── products.js      (renders products.json, Buy on Shopier links)
│   │   ├── gallery.js       (category filtering, lightbox)
│   │   └── utils.js         (shared helper functions, e.g., JSON fetch)
│   ├── images/
│   │   ├── gallery/
│   │   │   ├── flowers/
│   │   │   ├── movie-tv/
│   │   │   ├── anime/
│   │   │   ├── custom/
│   │   │   └── seasonal/
│   │   ├── products/
│   │   ├── icons/
│   │   └── branding/        (logo, favicon source files)
│   └── fonts/                (self-hosted fonts, if used)
└── content/
    ├── products.json         (product data: id, name, category, price, image, shopierUrl)
    └── categories.json       (category list/metadata)
```

---

## 4. Design System

### 4.1 Design Style
Modern minimalist with a creative, handmade feel. Generous white space, clean layout, product-first presentation. The design should feel modern, welcoming, and artistic — not luxurious or rustic — and should flexibly support many product styles (flowers, pop-culture characters, anime, custom, seasonal).

### 4.2 Color Palette

**Base / Neutral:**
| Name | Hex | Usage |
|---|---|---|
| White | `#FFFFFF` | Primary background |
| Cream | `#FAF6F0` | Secondary background, section alternation |
| Light Gray | `#E8E4DE` | Borders, dividers, subtle backgrounds |
| Charcoal | `#2B2B2B` | Primary text |
| Soft Gray | `#6E6A65` | Secondary text, captions |

**Thread-Inspired Accents** (used sparingly, e.g., category tags, hover states, buttons):
| Name | Hex | Suggested Use |
|---|---|---|
| Terracotta/Coral | `#D97757` | Primary accent / CTA buttons |
| Sage Green | `#8FA68E` | Flowers category tag |
| Dusty Blue | `#7C97A8` | Movie/TV category tag |
| Mustard Yellow | `#D9A441` | Anime category tag |
| Muted Plum | `#9B7E96` | Custom/Seasonal category tag |

Accent colors rotate per category badge/tag to visually differentiate product types while keeping the overall palette calm and neutral.

### 4.3 Typography

- **Headings:** A clean serif or hand-crafted display font for artistic warmth — e.g., **"Fraunces"** or **"Playfair Display"**.
- **Body:** A neutral, highly readable sans-serif — e.g., **"Inter"** or **"Work Sans"**.

**Type Scale (approximate, mobile-first, to be defined precisely in CSS variables):**
| Token | Size | Usage |
|---|---|---|
| `--fs-display` | 2.5–3.5rem | Hero headline |
| `--fs-h1` | 2rem | Page titles |
| `--fs-h2` | 1.5rem | Section titles |
| `--fs-h3` | 1.25rem | Card/product titles |
| `--fs-body` | 1rem | Paragraph text |
| `--fs-small` | 0.875rem | Captions, meta info |

**Weights:** Regular (400) for body, Medium/Semibold (500–600) for headings and emphasis.
**Line-height:** ~1.5 for body text, ~1.2 for headings.

### 4.4 Spacing & Grid
- **Base spacing unit:** 8px (`--space-1: 8px`, `--space-2: 16px`, `--space-3: 24px`, etc.)
- **Breakpoints (mobile-first):**
  - Mobile: `< 600px`
  - Tablet: `600px – 900px`
  - Desktop: `> 900px`
- **Layout:** CSS Grid/Flexbox based responsive product/gallery grids (2 columns tablet, 3–4 columns desktop, 1 column mobile).

### 4.5 Components (documented, built in Phase 2)
- Navigation bar (with mobile hamburger menu)
- Footer (social links, quick nav, copyright)
- Product card (image, title, category tag, price, "Buy on Shopier" button)
- Gallery item card (image, category tag, optional caption)
- Category filter chips
- Buttons (primary, secondary, outline — default/hover/active/focus states)
- Lightbox/modal for enlarged gallery images
- FAQ accordion (Contact page)

---

## 5. SEO Planning

- **Semantic HTML5** structure across all pages: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- **Meta tags** per page: unique `<title>`, `<meta name="description">`, relevant keywords.
- **Open Graph & Twitter Card tags** for rich social sharing previews (title, description, image).
- **Favicon set:** multiple sizes + `apple-touch-icon`.
- **Descriptive `alt` text** convention for all images (especially product/gallery images).
- **Clean, readable URLs** — already satisfied via static, descriptive filenames.
- **Future tasks (near launch):** `robots.txt` and `sitemap.xml` generation.

---

## 6. Shopier Integration

- Each product entry in `content/products.json` includes a `shopierUrl` field.
- `products.js` renders product cards with a **"Buy on Shopier"** button linking to that product's specific Shopier page (opens in new tab).
- The Custom Orders page also links to the Shopier store and/or the Contact page for custom inquiries.

---

## 7. Future Features (not built yet, documented for roadmap)

- Contact/order inquiry form (e.g., via Formspree, no backend needed)
- Instagram feed embed
- Blog/journal for behind-the-scenes posts
- Dark mode toggle
- Newsletter signup
- Reviews/testimonials section
- Multi-language support
- Full Flask-based e-commerce backend (see migration notes below)

---

## 8. Future Flask Migration Notes

The static site is structured to minimize rework if migrated to Flask later:

- `content/products.json` and `content/categories.json` act as the single source of truth for product/category data now; in Flask, these can seed a database (SQLite/Postgres) or continue to be loaded as config.
- HTML markup uses consistent, componentized/repeating patterns (product cards, gallery items) that map cleanly onto Jinja2 templates and `{% for %}` loops.
- JavaScript fetches and renders JSON data client-side now — this mirrors how Flask/Jinja2 will render the same data server-side later, so the rendering logic/structure carries over conceptually.
- `assets/` folder (css/js/images) maps directly to Flask's conventional `/static/` folder.
- Page files (`index.html`, `products.html`, etc.) map directly to Flask's `/templates/` folder structure.
- Detailed mapping guide is maintained in `README.md` under "Future Flask Migration."

---

## 9. Development Phases

1. **Phase 1 – Planning & Setup:** `PROJECT.md`, `README.md`, `RULES.md`, folder scaffolding, placeholder `content/products.json` & `content/categories.json`. *(Current phase)*
2. **Phase 2 – Design System Foundation:** CSS variables, reset, typography, base components.
3. **Phase 3 – Core Pages:** Home, Products, Gallery.
4. **Phase 4 – Secondary Pages:** About, Custom Orders, Contact, 404.
5. **Phase 5 – Interactivity:** JSON-driven rendering, category filtering, lightbox, mobile nav.
6. **Phase 6 – Responsive Polish & Accessibility:** Cross-device testing, ARIA labels, performance checks.
7. **Phase 7 – SEO & Launch Prep:** Meta tags, Open Graph tags, favicon set; `robots.txt`/`sitemap.xml` as follow-up.
8. **Phase 8 – Deploy:** Publish via GitHub Pages.
9. **Phase 9 – Future Enhancements:** Roadmap items from Section 7 + Flask migration path.

---

## 10. Content Categories

- Flowers
- Movie & TV Characters
- Anime-Inspired
- Custom Embroidery
- Seasonal

(Full metadata for each category is stored in `content/categories.json`.)
