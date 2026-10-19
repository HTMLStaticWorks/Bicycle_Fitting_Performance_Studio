# VELOMETRIC™ — Bicycle Fitting & Performance Studio Website

A state-of-the-art, athletic-engineering hybrid multi-page website built for elite bicycle fitting, biomechanical gait analysis, and aerodynamic performance testing.

---

## 🌟 Key Features

1. **Strict 5-Link Athletic Navbar**:
   - `Home | Services | Pricing | About | Contact`
   - `[Login]` and `[Dashboard]` quick-access buttons.
   - Discreet Dark/Light theme toggle and RTL layout switch.

2. **10 Complete Multi-Page Views**:
   - **`index.html` (Home 1)**: Fitting Technology focus with 6 sections (Clean modern studio hero background with high typographic clarity, Why Fitting Matters tech overview, Core Services 3D tilt cards, 5-stage biomechanical protocol, Before/After interactive slider, and Instant Scheduler teaser).
   - **`home2.html` (Home 2)**: Athlete/Rider-Journey focus with 7 sections (Panoramic athlete theater hero with discipline pills & 4-metric impact strip, featured athlete case studies, specialized 2x2 athlete fitting protocols matrix, precision atelier narrative, zero-horizontal-scroll diagnostic contrast table, community clinics & masterclasses, and collective membership CTA).
   - **`services.html`**: 4 comprehensive sections (Methodology overview, Deep-dive 6-pillar specialized protocol matrix with dedicated clinical photography, diagnostic equipment gallery, prep checklist & FAQ).
   - **`pricing.html`**: 4 sections (Transparent pricing philosophy, 3D tilt tiered plans with popular badge, inclusion matrix, 100% fit guarantee).
   - **`about.html`**: 8 comprehensive sections (Genesis & scientific origin, 4-phase clinical fitting methodology, 6 types of fittings offered, 6 categories of bicycles handled with active studio test bay photography, quantifiable performance improvements (+15-30W FTP, CdA aero drag savings, injury eradication), IBFI Level 4 master fitters team, 4,500 sq.ft studio facility tour, official accreditations).
   - **`contact.html`**: 4 sections (Concierge details, validated client reservation form, interactive styled map with bike valet directions, 24-hour response guarantee).
   - **`login.html`**: 4 sections (Security header, tabbed login/register + **Instant One-Click Demo Login**, connected device sync, support).
   - **`dashboard.html`**: Complete post-login Rider Portal with 7 sub-modules (Overview, Book/Manage fits, Measurement History with Chart.js timeline, Performance reports with CdA chart, 60-day adjuster, Invoices, Bike garage manager, and Logout).
   - **`404.html`**: "Cadence Dropped to 0 RPM — Off Route" recovery page.
   - **`coming-soon.html`**: Wind Tunnel expansion countdown & VIP waitlist.

3. **Visual Effects & 3D Tilt Cards**:
   - Clean, uncluttered studio backdrop with ambient lighting for superior contrast and readability.
   - Custom pure JS 3D mouse tilt cards with dynamic specular glare highlights.
   - Center-aligned card layouts with SVG engineering icons.

4. **Performance & Compliance**:
   - WCAG 2.1 AA compliant contrast and keyboard accessibility.
   - Zero external CDN image dependencies — all 8 high-resolution photos saved locally in `assets/images/`.
   - Full RTL support with `assets/css/rtl.css`.
   - Production `robots.txt` and `sitemap.xml`.

---

## 🚀 Running Locally

You can serve the static files with any local HTTP server:

```bash
# Using Python
python -m http.server 8080

# Using Node.js npx serve
npx serve .
```

Then navigate to `http://localhost:8080/index.html` in your browser.
