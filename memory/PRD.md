# GAAIUS AI - Product Requirements Document

## Original Problem Statement
Build an enhanced "GAAIUS AI" application - a unified AI assistant platform with:
- AI Chat powered by Groq
- AI Builder (Replit-like IDE for generating web apps from natural language)
- AI Document Studio (professional invoice, quote, receipt, spreadsheet generation)
- Multi-platform support (Web, Desktop EXE, Android APK, iOS)
- Monetization via PayPal subscriptions and ad system for free users

## User Personas
1. **Developers/Creators** - Use AI Builder to generate web applications
2. **Business Users** - Use Document Studio for professional invoices/receipts
3. **General Users** - Use AI Chat for general assistance

## Core Features

### Implemented ✅
1. **AI Chat** - General purpose chatbot powered by Groq (Llama 3.3 70B)
2. **AI Builder v2.0 - Blueprint-First Platform Assembler** ✅ (Jan 2025)
   - Monaco code editor with file tree
   - Multi-file project support (HTML, CSS, JS)
   - **Blueprint-First Architecture** - AI generates structured blueprints before code
   - **5 App Templates** - SaaS Dashboard, E-commerce, AI Chat, Crypto/Finance, Admin Panel
   - **Quality Gate v2** - Enhanced validation with detailed checks
   - **Full-screen preview mode**
   - Image generation via Pollinations AI
   - Terminal output with quality checks display
   - Export buttons (Web, EXE, APK, iOS)
3. **AI Document Studio**
   - Professional PDF generation (invoices, quotes, receipts)
   - XLSX spreadsheet generation
   - Editable preview
   - Auto-naming from conversation context
4. **Authentication**
   - JWT-based auth
   - Gmail-only email validation
5. **Monetization**
   - PayPal Pro subscriptions
   - Ad system (after 10 generations or 30 minutes for free users)
6. **PWA Support** ✅ (Jan 2025)
   - manifest.json configured
   - Service worker for offline support
   - App icons (192px, 512px)
   - **Mobile Install Banner** - Prompts users to install the app
   - iOS/Android installable
7. **GAAIUS UI Component Library** ✅ (Jan 2025)
   - Locked design tokens (colors, spacing, typography, shadows)
   - Pre-built components: GaaiusButton, GaaiusCard, GaaiusInput, GaaiusBadge, GaaiusModal, GaaiusTable, GaaiusStatsCard, GaaiusNav, GaaiusSidebar, GaaiusAvatar, GaaiusProgress

## Tech Stack
- **Frontend:** React 19, Tailwind CSS, shadcn/ui, Monaco Editor, Zustand
- **Backend:** FastAPI, Python
- **Database:** MongoDB
- **AI Services:** Groq (LLM), Pollinations AI (images)
- **Payments:** PayPal
- **PDF/Docs:** ReportLab, OpenPyXL

## Architecture
```
/app
├── backend/
│   ├── server.py           # FastAPI backend with all API endpoints
│   ├── gaaius_builder.py   # Blueprint-First builder with templates
│   ├── .env                # API keys (GROQ, etc.)
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.js                        # Main React app
    │   └── components/
    │       ├── gaaius-ui/index.jsx       # GAAIUS UI Component Library
    │       └── PWAInstallBanner.jsx      # Mobile install banner
    ├── public/
    │   ├── manifest.json                 # PWA manifest
    │   ├── sw.js                         # Service worker
    │   ├── icon-192.png                  # App icon
    │   └── icon-512.png                  # App icon
    └── package.json
```

## API Endpoints
- `/api/build/generate` - Generate web applications with Blueprint-First approach
- `/api/build/templates` - Get available app templates
- `/api/build/blueprint` - Generate structured blueprint from prompt
- `/api/document/generate_professional` - Generate documents
- `/api/chat` - Chat endpoint
- `/api/auth/signup` - Registration (Gmail only)
- `/api/auth/login` - Login
- `/api/payment/paypal/create` - PayPal payment

---

## Changelog

### January 2025
- ✅ Enhanced AI Builder to v2.0 with Blueprint-First architecture
- ✅ Added 5 app templates (SaaS Dashboard, E-commerce, Admin Panel, AI Tool, Crypto/Finance)
- ✅ Implemented Quality Gate v2 with detailed checks
- ✅ Created GAAIUS UI Component Library with design tokens
- ✅ Added PWA Mobile Install Banner
- ✅ Added Quick Templates section to AI Builder UI

### December 2025
- ✅ Added full-screen preview option to AI Builder
- ✅ Set up PWA (manifest.json, service worker, app icons)
- ✅ Created multi-platform packaging guide (PACKAGING_GUIDE.md)

### Previous Session
- ✅ Created AI Builder with Monaco Editor and file tree
- ✅ Implemented initial quality scoring
- ✅ Created AI Document Studio with professional PDF generation
- ✅ Implemented Gmail-only auth validation
- ✅ Added PayPal-only monetization (removed PayFast)
- ✅ Implemented ad system for free users
- ✅ UI fixes (logo removal, border line removal)

---

## Roadmap

### P1 - High Priority
- [ ] User verification of Document Studio output quality
- [ ] Refactor App.js into separate components
- [ ] Refactor server.py into FastAPI routers

### P2 - Medium Priority
- [ ] AI-driven error self-fixing in Builder
- [ ] Multi-file diffing in Builder
- [ ] LSP integration for autocomplete/go-to-definition

### P3 - Future/Vision (GAAIUS BUILD BRAIN Roadmap)
- [ ] Phase 2 – Emergent-level: AI error self-fixing, multi-file diffing
- [ ] Phase 3 – Replit-level: LSP integration, collaboration/multiplayer
- [ ] Phase 4 – GAAIUS-native: Ecosystem integration (Wallet, Cloud, App Store, DAO)
- [ ] Ultimate Goal: Independent runtime using Docker/Firecracker

---

## Refactoring Needed
1. **frontend/src/App.js (2,500+ lines)** - Split into:
   - `components/Builder.jsx`
   - `components/DocumentStudio.jsx`
   - `components/Chat.jsx`
   - `components/Auth.jsx`

2. **backend/server.py (2,000+ lines)** - Split into:
   - `routers/builder.py`
   - `routers/documents.py`
   - `routers/auth.py`
   - `routers/chat.py`
