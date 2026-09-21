# VELOMETRIC™ Style Guide & Design System

## 1. Palette & Colors
- **Carbon Base**: `#0D0F12` (Primary Dark), `#14171C` (Secondary Dark), `#1A1D21` (Card Surface)
- **Primary Accent (Volt)**: `#FF5A1F` (Electric Volt Orange)
- **Secondary Accent (Teal)**: `#00D9C0` (Performance Cyan / Medical Teal)
- **Telemetry Highlight (Lime)**: `#D4FF00` (Signal Green / Wattage highlight)
- **Metal Accent**: `#C9CDD3` (Titanium Silver)

## 2. Typography
- **Headings & Display**: `Syne` (Bold uppercase hero display) and `Outfit` (Headings, subtitles, metric numbers)
- **Body & Telemetry**: `Inter` (Optimized legibility, data tables, clinical notes)

## 3. Component Standards
- **Cards**: All service and feature cards use center-aligned icons and text, with 3D mouse perspective tilt and dynamic specular reflection glare overlays.
- **Micro-Animations**: Hover elevations (`translateY(-2px)`), glow halos (`box-shadow: 0 0 25px rgba(...)`), and smooth skeleton shimmers.
- **RTL Support**: Built-in bidirectional support via `dir="rtl"` with comprehensive CSS overrides in `assets/css/rtl.css`.
- **Theme Modes**: Default performance carbon dark mode with auto-detecting high-contrast light mode in `assets/css/dark-mode.css`.
