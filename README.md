# Handmade Embroidery Website

A modern, minimalist static website (HTML, CSS, JavaScript only) showcasing a handmade embroidery business. The site functions as a portfolio and brand presence, linking out to an existing **Shopier** store for actual purchases.

See [`PROJECT.md`](./PROJECT.md) for the full project plan (design system, pages, phases) and [`RULES.md`](./RULES.md) for development rules followed throughout this project.

---

## 1. Project Overview

- **Type:** Static site — no backend, no database, no build step required.
- **Purpose:** Portfolio + brand website for a handmade embroidery business (flowers, movie/TV characters, anime-inspired designs, custom embroidery, seasonal items).
- **Purchases:** Handled externally via **Shopier**. Product cards include a "Buy on Shopier" button that links to the item's Shopier page.
- **Design:** Modern minimalist, generous white space, neutral base palette with thread-inspired accent colors. Full details in `PROJECT.md`.

---

## 2. Folder Structure

```
embroidery-website/
├── index.html              # Home page
├── products.html            # Shoppable product catalog
├── gallery.html             # Artistic portfolio/lookbook
├── about.html                # About the artist/brand
├── custom-orders.html        # Custom order process & info
├── contact.html               # Contact info, socials, FAQ
├── 404.html                    # Custom not-found page
├── PROJECT.md                  # Full project plan
├── README.md                    # This file
├── RULES.md                      # Project development rules
├── robots.txt                     # (future) search engine crawl rules
├── sitemap.xml                    # (future) sitemap for SEO
├── assets/
│   ├── css/                        # Stylesheets (base, layout, components, pages)
│   ├── js/                          # Vanilla JS (rendering, filtering, interactions)
│   ├── images/                       # Gallery, product, icon, and branding images
│   └── fonts/                         # Self-hosted fonts (if used)
└── content/
    ├── products.json                  # Product data (source of truth for products.js)
    └── categories.json                # Category metadata (source of truth for gallery/filters)
```

---

## 3. Local Development

No build tools or dependencies are required since this is a plain HTML/CSS/JS project. However, because pages fetch local JSON files (`content/products.json`, `content/categories.json`) via JavaScript, opening `index.html` directly via `file://` may be blocked by browser CORS restrictions. It's recommended to run a simple local server:

**Option A — VS Code Live Server extension**
1. Install the "Live Server" extension in VS Code.
2. Right-click `index.html` → "Open with Live Server".

**Option B — Node's `serve` package**
```bash
npx serve .
```

**Option C — Python's built-in server**
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

---

## 4. Deployment — GitHub Pages

1. Push this project to a GitHub repository (e.g., `embroidery-website`).
2. In the repository, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to `Deploy from a branch`.
4. Choose the branch (e.g., `main`) and root folder (`/`), then save.
5. GitHub will publish the site at `https://<username>.github.io/<repo-name>/`.
6. (Optional) Add a custom domain under the same Pages settings and configure your DNS provider with the required CNAME/A records.
7. Every push to the selected branch will automatically redeploy the site.

**Note:** If using a custom domain, add a `CNAME` file at the project root containing just the domain name (this can be done in a later phase, close to launch).

---

## 5. Content Editing Guide

All product and category data lives in the `content/` folder as JSON, making updates easy without touching HTML.

### Editing Products (`content/products.json`)
Each product entry should follow this shape:
```json
{
  "id": "flower-001",
  "name": "Wildflower Hoop Art",
  "category": "flowers",
  "price": "250 TRY",
  "image": "assets/images/products/flower-001.jpg",
  "shopierUrl": "https://www.shopier.com/your-store/product-link"
}
```
To add a new product: copy an existing entry, give it a unique `id`, update the fields, and add the corresponding image to `assets/images/products/`.

### Editing Categories (`content/categories.json`)
Each category entry should follow this shape:
```json
{
  "id": "flowers",
  "label": "Flowers",
  "accentColor": "#8FA68E",
  "description": "Botanical hoop art and floral embroidery pieces."
}
```
The `id` here must match the `category` field used in `products.json` and gallery image folder names (`assets/images/gallery/<category>/`).

### Editing Gallery Images
Add images to the relevant subfolder under `assets/images/gallery/` (e.g., `assets/images/gallery/anime/`). Gallery rendering logic (built in a later phase) will read from these folders/categories.

---

## 6. Future Flask Migration Notes

This static site is intentionally structured so it can be migrated to a Flask application later with minimal rework:

| Static Site (Now) | Flask Equivalent (Later) |
|---|---|
| `index.html`, `products.html`, etc. | Jinja2 templates in `/templates/` |
| `assets/css/`, `assets/js/`, `assets/images/` | `/static/css/`, `/static/js/`, `/static/images/` (served via Flask's `static` folder) |
| `content/products.json` | Seed data for a `Product` model in a database (SQLite/Postgres), or loaded via `Flask-JSON`/config initially |
| `content/categories.json` | Seed data for a `Category` model, or config-based category list |
| JS `fetch()` rendering product/gallery cards | Jinja2 `{% for product in products %}` loops rendering the same markup server-side |
| Repeating HTML card markup (product card, gallery item) | Directly convertible into Jinja2 `{% include %}` partials/macros |
| Static "Buy on Shopier" links | Can remain identical — no change needed unless full checkout is added later |

**Migration steps (high level, for later):**
1. Set up a Flask app with `/templates` and `/static` folders.
2. Move `assets/` contents into `/static/`, update path references.
3. Convert each `.html` page into a Jinja2 template, replacing JS-rendered loops with `{% for %}` loops fed by data from `products.json`/`categories.json` (or a database).
4. Optionally introduce SQLite/Postgres models mirroring the JSON structure, with a migration script to import existing JSON data.
5. Add Flask routes (`/`, `/products`, `/gallery`, `/about`, `/custom-orders`, `/contact`) matching the current page structure.

---

## 7. Roadmap / Future Features

See `PROJECT.md` Section 7 for the full list, including: contact/order inquiry form, Instagram feed embed, blog/journal, dark mode, newsletter signup, testimonials, multi-language support, and eventual Flask-based backend.

---

## 8. Project Documents

- [`PROJECT.md`](./PROJECT.md) — Full project plan: pages, folder structure, design system, SEO plan, phases.
- [`RULES.md`](./RULES.md) — Development rules to follow throughout the project.
