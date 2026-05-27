# 🚗 WheelsDrive — Modern Used Car Platform

**Status:** ✅ Production Ready | **Build:** Passing | **Deploy:** Vercel | **Database:** Supabase

---

## 📋 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/wheelsdrive.git
cd wheelsdrive
npm install
```

### 2. Setup Environment
Copy `.env.example` to `.env.local`:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these from: https://app.supabase.com → Project Settings → API

### 3. Setup Database
1. Go to Supabase SQL Editor
2. Copy SQL from `src/pages/admin/Settings.tsx` → "Supabase SQL Setup"
3. Paste and run (creates all tables + RLS policies)
4. Create Storage bucket: `car-images` (public access)

### 4. Create Admin User
In Supabase:
1. **Authentication → Users → Add new user**
2. Email: `admin@wheelsdrive.com`
3. Password: Strong password
4. Email confirmed: ✅

### 5. Run Locally
```bash
npm run dev
```
Open http://localhost:5173

---

## 🎯 Features

### Customer Features
- ✅ Browse 100% verified cars
- ✅ Advanced filtering (price, year, KM, fuel, etc)
- ✅ Car comparison (up to 2 cars)
- ✅ AI-powered valuation for selling
- ✅ WhatsApp inquiry directly from app
- ✅ Responsive on all devices

### Admin Features
- 🔐 Secure login
- ➕ Add/Edit cars with images
- 📊 Real-time dashboard with stats
- 💬 Manage customer inquiries
- 💰 Review car valuations
- 🔥 Mark hot deals & featured cars
- 📥 Bulk import cars via CSV
- ⚙️ Settings management

---

## 🏗️ Architecture

```
wheelsdrive/
├── src/
│   ├── pages/               # Route pages
│   │   ├── Home.tsx         # Homepage (hero + car grid)
│   │   ├── CarDetail.tsx    # Single car detail view
│   │   ├── SellCar.tsx      # AI valuation form
│   │   ├── admin/           # Admin panel
│   │   │   ├── Dashboard.tsx     # Admin home
│   │   │   ├── Cars.tsx          # Manage cars
│   │   │   ├── AddEditCar.tsx    # Add/edit form
│   │   │   ├── Inquiries.tsx     # Customer messages
│   │   │   ├── Valuations.tsx    # Valuation requests
│   │   │   ├── Settings.tsx      # Dealership config
│   │   │   └── Layout.tsx        # Admin sidebar + topbar
│   ├── components/          # Reusable components
│   │   ├── CarCard.tsx      # Car listing card
│   │   ├── FilterPanel.tsx  # Search/filter
│   │   ├── Navbar.tsx       # Top navigation
│   │   ├── ImageUpload.tsx  # Image uploader
│   │   ├── CompareView.tsx  # Compare 2 cars
│   │   └── ...
│   ├── lib/
│   │   ├── supabase.ts      # Supabase client
│   │   ├── queries.ts       # Database queries
│   │   ├── utils.ts         # Helpers (fmt, etc)
│   │   └── whatsapp.ts      # WhatsApp integration
│   └── types/               # TypeScript types
├── .github/workflows/
│   └── deploy.yml           # CI/CD pipeline
├── vercel.json              # Vercel config (SPA rewrite)
├── vite.config.ts           # Vite build config
├── tailwind.config.cjs      # Tailwind (optional)
└── package.json
```

---

## 🎨 Design System

### Colors
- **Primary:** `#E8520A` (Modern Orange)
- **Success:** `#059669` (Green)
- **Error:** `#DC2626` (Red)
- **Purple:** `#7C3AED` (Accent)
- **Background:** `#F4F5F7` (Light Gray)

### Typography
- **Headings:** Nunito 800-900, letter-spacing -1px
- **Body:** DM Sans 400-600
- **Code:** Monospace

### Components
- Buttons: Rounded 10-12px, gradient primary, hover lift
- Cards: 1px border, subtle shadow, hover elevation
- Forms: 1.5px border, focus ring on primary color
- Animations: Smooth 200-300ms transitions

---

## 🚀 Deployment

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
# Select project, confirm settings, done!
```

### Option 2: GitHub Actions (Auto)
1. Push to `main` branch
2. GitHub Actions builds automatically
3. Deploys to Vercel via workflow
4. Check **Actions** tab for status

See `GITHUB_SETUP.md` for secrets setup.

### Option 3: Manual
```bash
npm run build
# Dist folder ready to deploy anywhere
```

---

## 📱 Testing

### Local
```bash
npm run dev
```

### Build
```bash
npm run build
npm run preview
```

### Type Check
```bash
npx tsc --noEmit
```

### Responsive
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1920px (Full HD)

---

## 🔐 Security

- ✅ Row-level security (RLS) on all tables
- ✅ Auth required for admin panel
- ✅ API keys in environment variables
- ✅ No hardcoded credentials
- ✅ HTTPS enforced on production
- ✅ CORS configured

---

## 📊 Database Schema

### cars
```sql
id, title, brand, model, year, price, km_driven,
fuel, transmission, condition, color, owners, segment,
is_hot_deal, is_sold, is_featured, description, features,
images, views, created_at, updated_at
```

### inquiries
```sql
id, car_id, car_title, customer_name, phone, message,
is_read, created_at
```

### car_valuations
```sql
id, customer_name, customer_phone, email, brand, model,
variant, year, fuel, transmission, km_driven, owners,
registration_city, insurance_valid, accident_history,
exterior_condition, interior_condition, status,
admin_override_price, report, created_at
```

### settings
```sql
id, dealer_name, address, whatsapp, about, logo_url
```

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build:** Vite 5
- **Styling:** Inline styles + CSS variables
- **State:** TanStack Query (React Query)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Routing:** React Router v6
- **Deploy:** Vercel (SPA with rewrites)
- **Icons:** Lucide React

---

## 📝 Environment Variables

**Required** (for both local & production):
```
VITE_SUPABASE_URL=         # Your Supabase project URL
VITE_SUPABASE_ANON_KEY=    # Anon/Public API key
```

**Optional:**
```
VITE_API_URL=              # API endpoint (if using one)
```

---

## 🐛 Common Issues

### "Can't find module @/lib/queries"
→ Check path alias in `vite.config.ts` and `tsconfig.json`

### Admin login always fails
→ Check Supabase auth is enabled in Settings → Auth

### Car images not uploading
→ Check `car-images` bucket exists with public access

### Database tables missing
→ Run SQL from Settings page in admin panel

### Build fails with types
→ Run `npm install` again, check tsconfig paths

---

## 📞 Support

- **Docs:** See files in project root
- **Database:** https://app.supabase.com
- **Deployment:** https://vercel.com/dashboard
- **Issues:** Check GitHub Actions logs

---

## 🎉 You're Ready!

1. ✅ Install dependencies
2. ✅ Setup Supabase
3. ✅ Create admin user
4. ✅ Run locally
5. ✅ Deploy to Vercel

**Happy coding! 🚀**

---

**Version:** 1.0 | **Last Updated:** May 2026
