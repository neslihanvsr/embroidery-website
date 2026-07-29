# PROJECT.md — HoyThreads Embroidery Business Website

## 1. Project Overview

HoyThreads is a modern, minimalist portfolio and storefront website for a handmade embroidery business.

The website showcases handcrafted embroidery artwork, presents products in an organised catalogue, highlights custom embroidery services, and directs customers to the existing Shopier store for purchases.

The project is intentionally built as a lightweight static website using **HTML, CSS and vanilla JavaScript**, while maintaining an architecture that can later evolve into a backend-powered application with minimal frontend changes.

---

## 2. Project Objectives

The website is designed to:

- Showcase handmade embroidery in a modern and visually appealing way.
- Present products through a structured catalogue.
- Display completed embroidery work in a dedicated gallery.
- Explain the custom embroidery process.
- Strengthen the HoyThreads brand identity.
- Direct customers to Shopier for purchases.
- Provide an accessible and responsive browsing experience.
- Maintain a scalable codebase for future development.

---

## 3. Website Pages

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Introduces the brand, featured embroidery pieces and primary calls-to-action. |
| Products | `products.html` | Displays the product catalogue rendered from JSON data with Shopier purchase links. |
| Gallery | `gallery.html` | Presents the embroidery portfolio with category filtering and image lightbox. |
| About | `about.html` | Introduces the artist, creative process and brand story. |
| Custom Orders | `custom-orders.html` | Explains personalised embroidery services and ordering workflow. |
| Contact | `contact.html` | Provides contact information and social media links. |
| 404 | `404.html` | Displays a custom page for unavailable routes. |

### Products vs Gallery

The project intentionally separates commercial products from portfolio content.

**Products**

- Available for purchase
- Display pricing
- Include Shopier purchase links

**Gallery**

- Portfolio-focused
- Demonstrates craftsmanship
- May include commissions or artwork not currently for sale

---

## 4. Information Architecture

The website is organised around a simple navigation structure:

- Home
- Products
- Gallery
- About
- Custom Orders
- Contact

Navigation must remain consistent across all pages.

Desktop devices use a horizontal navigation bar.

Mobile devices use a responsive hamburger navigation.

---

## 5. Folder Structure

```
embroidery-website/
│
├── index.html
├── products.html
├── gallery.html
├── about.html
├── custom-orders.html
├── contact.html
├── 404.html
│
├── PROJECT.md
├── README.md
├── RULES.md
├── STATUS.md
│
├── assets/
│   ├── css/
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   └── pages/
│   │
│   ├── js/
│   │   ├── main.js
│   │   ├── products.js
│   │   ├── gallery.js
│   │   └── utils.js
│   │
│   └── images/
│       ├── branding/
│       ├── gallery/
│       ├── products/
│       └── icons/
│
└── content/
    ├── products.json
    └── categories.json
```

The project structure should remain modular and easy to extend.

---

## 6. Content Model

The website separates content from presentation.

### Products

Product information is stored in:

```
content/products.json
```

Each product should contain:

- id
- name
- category
- description
- price
- image
- shopierUrl
- featured

### Categories

Category information is stored in:

```
content/categories.json
```

Current categories include:

- Pop Culture
- Anime & Cartoons
- Flowers & Nature
- Animals
- Portraits
- Children's Drawings
- Original Designs
- Text Embroidery
- Custom Orders

The JSON files act as the single source of truth for website content.

---

## 7. Design System

### 7.1 Design Philosophy

HoyThreads follows a modern minimalist design language that places the embroidery itself at the centre of the user experience.

The interface should feel:

- Modern
- Warm
- Creative
- Clean
- Handmade
- Professional

The website should never feel cluttered or overly decorative. White space is considered a design element and should be used generously to improve readability and visual balance.

---

### 7.2 Colour Palette

#### Base Colours

| Name | Hex | Usage |
|------|------|------|
| White | `#FFFFFF` | Primary background |
| Cream | `#FAF6F0` | Alternate sections |
| Light Gray | `#E8E4DE` | Borders and subtle backgrounds |
| Charcoal | `#2B2B2B` | Primary text |
| Soft Gray | `#6E6A65` | Secondary text |

#### Accent Colours

| Colour | Usage |
|---------|------|
| Terracotta | Primary actions and buttons |
| Sage Green | Nature-related categories |
| Dusty Blue | Pop Culture categories |
| Mustard Yellow | Anime & Cartoons |
| Muted Plum | Portraits and Custom Orders |

Accent colours should be used sparingly to maintain a clean visual hierarchy.

---

### 7.3 Typography

#### Heading Font

Fraunces

#### Body Font

Inter

Typography priorities:

- readability
- consistency
- clear hierarchy
- generous spacing
- responsive scaling

Approximate scale:

| Token | Usage |
|------|------|
| Display | Hero headings |
| H1 | Page titles |
| H2 | Section titles |
| H3 | Card titles |
| Body | Paragraphs |
| Small | Metadata and captions |

---

### 7.4 Layout

The website follows a mobile-first responsive layout.

Breakpoints:

- Mobile: under 600px
- Tablet: 600px–900px
- Desktop: above 900px

Layout is built using CSS Grid and Flexbox.

Content is displayed inside centred containers with consistent spacing.

---

## 8. Component Library

The project uses reusable UI components.

### Navigation

- Desktop navigation
- Mobile hamburger navigation
- Active page indicator
- Sticky header

### Buttons

- Primary button
- Secondary button

Buttons should provide consistent hover, focus and active states.

### Product Cards

Each product card includes:

- image
- category badge
- title
- price
- Shopier button

### Gallery Cards

Each gallery card includes:

- image
- category
- title
- description

Gallery cards support lightbox interaction.

### Category Filters

Gallery categories are filtered through reusable filter buttons.

### Footer

The footer includes:

- copyright
- social media links
- secondary navigation (where applicable)

---

## 9. Responsive Strategy

The website is designed using a mobile-first approach.

Responsive behaviour includes:

- flexible layouts
- responsive navigation
- scalable typography
- responsive images
- adaptable spacing
- consistent card layouts

Desktop, tablet and mobile experiences should remain visually consistent while adapting to available screen space.

---

## 10. Accessibility Requirements

Accessibility is considered a core project requirement.

The website should follow modern accessibility practices including:

- semantic HTML5
- keyboard accessibility
- visible focus indicators
- descriptive alternative text
- ARIA attributes where appropriate
- accessible navigation
- sufficient colour contrast
- logical heading hierarchy
- skip navigation link
- responsive interaction targets

Accessibility improvements should coninue throughout future development.

---

## 11. SEO Requirements

The website should follow modern SEO best practices.

Requirements include:

- semantic HTML structure
- unique page titles
- descriptive meta descriptions
- descriptive image alt text
- clean URLs
- Open Graph metadata
- Twitter Card metadata
- favicon support
- robots.txt
- sitemap.xml

SEO should remain lightweight and suitable for a static website while allowing future backend expansion.

---