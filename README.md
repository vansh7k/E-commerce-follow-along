# MAVERICK by Antigravity — Unapologetic Streetwear E-Commerce

A hands-on, high-end MERN stack streetwear e-commerce platform featuring a brutalist-minimalist design. 

## 🔗 Live Deployments

* **🖥️ Live Frontend (Netlify)**: [glistening-capybara-a5e62f.netlify.app](https://glistening-capybara-a5e62f.netlify.app/)

---

## 🎯 About the Project

**MAVERICK** is a full-stack clothing e-commerce website designed and engineered from scratch to serve as a premium shopping experience. Instead of building a generic online storefront, **MAVERICK** adopts a dry, raw, and high-fashion editorial aesthetic inspired by modern street archives. 

### Why was it built this way?
1. **Raw Brutalist Aesthetics**: Modern web templates often feel repetitive. MAVERICK uses a stark dark void background (`#0A0A0A`), bone-white contrasts (`#E8E2D9`), and industrial ember orange highlights (`#C9440E`) to command immediate attention.
2. **Zero Border-Radius Reset**: Every layout card, button, input, and overlay is designed with zero border-radius (`border-radius: 0 !important`) to maintain a sharp, grid-aligned, structured brutalist silhouette.
3. **No UI Component Libraries**: Built using vanilla CSS and CSS custom properties rather than Tailwind, Bootstrap, or component UI libraries (like MUI or Shadcn). This ensures absolute control over layouts, transition curves, hover card translation offsets, and sliding marquees.
4. **Cinematic Micro-Animations**: Features custom marquees, custom skeleton shimmers, grayscaled product card hovers that transition smoothly into full color, and a sliding sliding cart drawer.

---

## ⚙️ Core Technical Features

### Backend (Node.js + Express + MongoDB)
* **6 Custom Mongoose Models**: User (with addresses array), Product (slugs, SKUs, inventory logs), Category, Order (stock auto-deductions), Review (star ratings), and Wishlist.
* **Security & Auth**: User login/registration using bcrypt password hashing and JWT token authorization headers.
* **Stripe Gateway Simulation**: PaymentIntent processing mapped to standard Indian Rupee (INR) transactions.
* **Secure Webhook Routing**: A dedicated raw body `/webhook` receiver mounted BEFORE `express.json()` to prevent signature validation crashes.
* **Cloudinary Storage**: File uploads integrated directly with Cloudinary API and a local server fallback buffer.

### Frontend (React + Vite + Zustand)
* **Zustand State Cart**: Optimized client-side cart operations with localStorage persistence.
* **Axios Auth Interceptors**: Automatically appends the Bearer token to headers on every request.
* **Auth Route Guards**: Custom `<ProtectedRoute>` and `<AdminRoute>` guards that lock dashboards and checkout portals from unauthenticated access.
* **Admin Control Center**: KPI indicators showing live stats, low stock warnings, inline order status toggling, and customer registries.

---

## 📂 Project Structure

```
E-commerce-follow-along/
├── Backend/
│   ├── config/          # DB connections
│   ├── controller/      # Auth, products, cart, order logic
│   ├── middleware/      # Auth validation, Cloudinary uploads
│   ├── model/           # User, product, category mongoose schemas
│   ├── routes/          # Express API route endpoints
│   ├── seed.js          # DB seeder script (12 default streetwear items)
│   └── index.js         # Express entry point
└── Frontend/
    ├── src/
    │   ├── api/         # Axios interceptor
    │   ├── components/  # Navbar, Footer, ProductCard, CartDrawer, etc.
    │   ├── pages/       # Home, Shop, Detail, Account, Admin panels
    │   ├── store/       # Zustand cart and toast states
    │   ├── index.css    # Plain CSS variables and global theme
    │   ├── App.jsx      # React Router map
    │   └── main.jsx     # App mounting
```

---

## 🚀 Development Milestones Tracker

This repository documents a step-by-step milestone progression building up to the final launch:

### Milestone 1 to 5: Base Repository & Initial Authentication
- Established project folder hierarchies for client and server.
- Built backend database configurations and connection controllers.
- Created registration forms with validation checks and password encryption using `bcrypt`.

### Milestone 6 to 10: Product Management Foundations
- Implemented JWT token authorization controllers.
- Defined Mongoose schema architectures for product management (name, description, prices, and upload handles).
- Designed interactive product uploading forms with server validation.

### Milestone 11 to 15: Catalog Rendering & CRUD Overrides
- Fetched and displayed products dynamically in standard grids.
- Added product edit overlays, pre-filled forms, and database update actions.
- Built product deletions with confirmation prompts.
- Created navigation bars and integrated responsive design layouts.
