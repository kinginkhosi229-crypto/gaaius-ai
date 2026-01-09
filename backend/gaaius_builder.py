# GAAIUS BUILD BRAIN v2.0 - Blueprint-First Platform Assembler
# This module contains the enhanced AI builder with template system

import json
import re
from typing import Dict, List, Optional, Any
from datetime import datetime, timezone

# ============== APP TEMPLATES ==============
# Opinionated, production-ready templates that enforce quality

APP_TEMPLATES = {
    "saas_dashboard": {
        "name": "SaaS Dashboard",
        "description": "Admin dashboard with stats, charts, and data tables",
        "blueprint": {
            "app_type": "dashboard",
            "platform": ["web", "mobile"],
            "ui_framework": "gaaius-ui",
            "pages": [
                {"name": "Dashboard", "components": ["StatsGrid", "Chart", "ActivityFeed", "QuickActions"]},
                {"name": "Analytics", "components": ["LineChart", "BarChart", "DataTable", "Filters"]},
                {"name": "Users", "components": ["UserTable", "SearchBar", "Pagination", "UserModal"]},
                {"name": "Settings", "components": ["ProfileForm", "NotificationSettings", "BillingCard"]}
            ],
            "layout": {
                "type": "sidebar",
                "nav_items": ["Dashboard", "Analytics", "Users", "Settings"],
                "header": True,
                "footer": False
            },
            "features": ["auth", "search", "notifications", "export_data"],
            "theme": "dark-professional"
        },
        "code_template": '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{APP_NAME}} - Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  <style>
    * { font-family: 'Inter', sans-serif; }
    .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(12px); }
  </style>
</head>
<body class="bg-[#0a0a0a] text-white min-h-screen">
  <!-- Sidebar -->
  <aside class="fixed left-0 top-0 h-screen w-64 bg-[#111] border-r border-white/10 flex flex-col">
    <div class="p-6 border-b border-white/10">
      <h1 class="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">{{APP_NAME}}</h1>
    </div>
    <nav class="flex-1 p-4 space-y-2">
      {{NAV_ITEMS}}
    </nav>
    <div class="p-4 border-t border-white/10">
      <div class="flex items-center gap-3 p-3 rounded-xl bg-white/5">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-semibold">U</div>
        <div>
          <p class="text-sm font-medium">User Name</p>
          <p class="text-xs text-white/50">Pro Account</p>
        </div>
      </div>
    </div>
  </aside>
  
  <!-- Main Content -->
  <main class="ml-64 p-8">
    <header class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold">Dashboard</h2>
        <p class="text-white/50">Welcome back! Here's your overview.</p>
      </div>
      <div class="flex items-center gap-4">
        <button class="p-2 hover:bg-white/5 rounded-lg transition"><i data-lucide="bell" class="w-5 h-5"></i></button>
        <button class="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg font-medium transition">New Report</button>
      </div>
    </header>
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {{STATS_CARDS}}
    </div>
    
    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {{CHARTS}}
    </div>
    
    <!-- Activity & Table -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {{ACTIVITY_SECTION}}
    </div>
  </main>
  
  <script>lucide.createIcons();</script>
</body>
</html>'''
    },
    
    "ecommerce": {
        "name": "E-commerce Store",
        "description": "Online store with products, cart, and checkout",
        "blueprint": {
            "app_type": "ecommerce",
            "platform": ["web", "mobile"],
            "ui_framework": "gaaius-ui",
            "pages": [
                {"name": "Home", "components": ["HeroBanner", "FeaturedProducts", "Categories", "Testimonials"]},
                {"name": "Products", "components": ["ProductGrid", "Filters", "SearchBar", "Pagination"]},
                {"name": "ProductDetail", "components": ["ProductGallery", "ProductInfo", "AddToCart", "Reviews"]},
                {"name": "Cart", "components": ["CartItems", "CartSummary", "PromoCode"]},
                {"name": "Checkout", "components": ["AddressForm", "PaymentForm", "OrderSummary"]}
            ],
            "layout": {
                "type": "navbar",
                "nav_items": ["Home", "Shop", "Categories", "Sale"],
                "header": True,
                "footer": True
            },
            "features": ["auth", "cart", "search", "wishlist", "payment"],
            "theme": "light-modern"
        },
        "code_template": '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{APP_NAME}} - Shop</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  <style>* { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-gray-50 text-gray-900 min-h-screen">
  <!-- Navigation -->
  <nav class="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <h1 class="text-xl font-bold">{{APP_NAME}}</h1>
        <div class="hidden md:flex items-center gap-8">
          {{NAV_ITEMS}}
        </div>
        <div class="flex items-center gap-4">
          <button class="p-2 hover:bg-gray-100 rounded-lg"><i data-lucide="search" class="w-5 h-5"></i></button>
          <button class="p-2 hover:bg-gray-100 rounded-lg"><i data-lucide="heart" class="w-5 h-5"></i></button>
          <button class="p-2 hover:bg-gray-100 rounded-lg relative">
            <i data-lucide="shopping-bag" class="w-5 h-5"></i>
            <span class="absolute -top-1 -right-1 w-5 h-5 bg-violet-600 text-white text-xs rounded-full flex items-center justify-center">3</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
  
  <main class="pt-16">
    <!-- Hero -->
    {{HERO_SECTION}}
    
    <!-- Featured Products -->
    <section class="max-w-7xl mx-auto px-4 py-16">
      <h2 class="text-2xl font-bold mb-8">Featured Products</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {{PRODUCT_CARDS}}
      </div>
    </section>
    
    <!-- Categories -->
    {{CATEGORIES_SECTION}}
  </main>
  
  <!-- Footer -->
  {{FOOTER}}
  
  <script>lucide.createIcons();</script>
</body>
</html>'''
    },
    
    "admin_panel": {
        "name": "Admin Panel",
        "description": "Backend management interface with CRUD operations",
        "blueprint": {
            "app_type": "admin",
            "platform": ["web"],
            "ui_framework": "gaaius-ui",
            "pages": [
                {"name": "Overview", "components": ["StatsRow", "RecentActivity", "QuickActions"]},
                {"name": "Content", "components": ["DataTable", "CRUD_Modal", "Filters", "BulkActions"]},
                {"name": "Users", "components": ["UserList", "RoleManager", "InviteModal"]},
                {"name": "Settings", "components": ["GeneralSettings", "SecuritySettings", "APIKeys"]}
            ],
            "layout": {
                "type": "sidebar-compact",
                "nav_items": ["Overview", "Content", "Users", "Media", "Settings"],
                "header": True,
                "footer": False
            },
            "features": ["auth", "roles", "crud", "audit_log", "export"],
            "theme": "dark-admin"
        }
    },
    
    "ai_tool": {
        "name": "AI Tool Interface",
        "description": "Chat-based AI application with modern UI",
        "blueprint": {
            "app_type": "ai_tool",
            "platform": ["web", "mobile"],
            "ui_framework": "gaaius-ui",
            "pages": [
                {"name": "Chat", "components": ["MessageList", "InputBar", "ModelSelector", "HistorySidebar"]},
                {"name": "History", "components": ["ConversationList", "SearchBar", "Filters"]},
                {"name": "Settings", "components": ["APISettings", "ModelPreferences", "ThemeToggle"]}
            ],
            "layout": {
                "type": "split-panel",
                "nav_items": ["Chat", "History", "Settings"],
                "header": True,
                "footer": False
            },
            "features": ["streaming", "markdown", "code_highlight", "export"],
            "theme": "dark-ai"
        },
        "code_template": '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{APP_NAME}} - AI Assistant</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  <style>
    * { font-family: 'Inter', sans-serif; }
    .chat-gradient { background: linear-gradient(180deg, #0a0a0a 0%, #111 100%); }
  </style>
</head>
<body class="bg-[#0a0a0a] text-white min-h-screen flex">
  <!-- Sidebar -->
  <aside class="w-64 bg-[#111] border-r border-white/10 flex flex-col">
    <div class="p-4 border-b border-white/10">
      <button class="w-full px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl flex items-center gap-2 transition">
        <i data-lucide="plus" class="w-4 h-4"></i>
        <span class="text-sm font-medium">New Chat</span>
      </button>
    </div>
    <div class="flex-1 p-2 space-y-1 overflow-auto">
      {{CHAT_HISTORY}}
    </div>
    <div class="p-4 border-t border-white/10">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500"></div>
        <span class="text-sm font-medium">User</span>
      </div>
    </div>
  </aside>
  
  <!-- Main Chat -->
  <main class="flex-1 flex flex-col">
    <header class="h-14 border-b border-white/10 flex items-center justify-between px-6">
      <div class="flex items-center gap-2">
        <i data-lucide="bot" class="w-5 h-5 text-violet-400"></i>
        <span class="font-medium">{{APP_NAME}}</span>
      </div>
      <select class="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm">
        <option>GPT-4</option>
        <option>Claude</option>
        <option>Llama</option>
      </select>
    </header>
    
    <div class="flex-1 overflow-auto p-6">
      {{MESSAGES}}
    </div>
    
    <div class="p-4 border-t border-white/10">
      <div class="max-w-3xl mx-auto flex items-end gap-3">
        <div class="flex-1 bg-white/5 border border-white/10 rounded-2xl p-3 focus-within:border-violet-500">
          <textarea placeholder="Message {{APP_NAME}}..." class="w-full bg-transparent resize-none outline-none text-sm" rows="1"></textarea>
        </div>
        <button class="p-3 bg-violet-600 hover:bg-violet-700 rounded-xl transition">
          <i data-lucide="send" class="w-5 h-5"></i>
        </button>
      </div>
    </div>
  </main>
  
  <script>lucide.createIcons();</script>
</body>
</html>'''
    },
    
    "crypto_finance": {
        "name": "Crypto/Finance App",
        "description": "Trading dashboard with portfolio and transactions",
        "blueprint": {
            "app_type": "finance",
            "platform": ["web", "mobile"],
            "ui_framework": "gaaius-ui",
            "pages": [
                {"name": "Portfolio", "components": ["BalanceCard", "AssetList", "PriceChart", "QuickTrade"]},
                {"name": "Trade", "components": ["OrderBook", "TradingChart", "OrderForm", "OpenOrders"]},
                {"name": "Wallet", "components": ["WalletBalance", "TransactionHistory", "SendReceive"]},
                {"name": "Markets", "components": ["MarketTable", "TrendingCoins", "NewsWidget"]}
            ],
            "layout": {
                "type": "sidebar",
                "nav_items": ["Portfolio", "Trade", "Wallet", "Markets", "Settings"],
                "header": True,
                "footer": False
            },
            "features": ["auth", "2fa", "live_prices", "charts", "notifications"],
            "theme": "dark-crypto"
        },
        "code_template": '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{APP_NAME}} - Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  <style>
    * { font-family: 'Inter', sans-serif; }
    .glow-green { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
    .glow-red { box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }
  </style>
</head>
<body class="bg-[#0a0a0a] text-white min-h-screen">
  <!-- Sidebar -->
  <aside class="fixed left-0 top-0 h-screen w-20 bg-[#111] border-r border-white/10 flex flex-col items-center py-6">
    <div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center font-bold mb-8">G</div>
    <nav class="flex-1 flex flex-col gap-4">
      {{ICON_NAV}}
    </nav>
    <button class="p-3 hover:bg-white/5 rounded-xl">
      <i data-lucide="settings" class="w-5 h-5 text-white/50"></i>
    </button>
  </aside>
  
  <!-- Main -->
  <main class="ml-20 p-8">
    <header class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold">Portfolio</h1>
        <p class="text-white/50">Track your investments</p>
      </div>
      <div class="flex items-center gap-4">
        <button class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-medium flex items-center gap-2">
          <i data-lucide="plus" class="w-4 h-4"></i> Buy
        </button>
        <button class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-medium flex items-center gap-2">
          <i data-lucide="arrow-up" class="w-4 h-4"></i> Send
        </button>
      </div>
    </header>
    
    <!-- Balance Card -->
    {{BALANCE_SECTION}}
    
    <!-- Assets -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {{ASSETS_AND_CHART}}
    </div>
  </main>
  
  <script>lucide.createIcons();</script>
</body>
</html>'''
    }
}

# ============== BLUEPRINT GENERATOR ==============

def generate_blueprint(prompt: str, template_key: Optional[str] = None) -> Dict[str, Any]:
    """
    Generate a structured blueprint from user prompt.
    If template_key is provided, uses that template as base.
    """
    prompt_lower = prompt.lower()
    
    # Auto-detect template if not specified
    # Order matters - more specific keywords should be checked first
    if not template_key:
        # Check crypto/finance first (before dashboard catches it)
        if any(kw in prompt_lower for kw in ['crypto', 'trading', 'wallet', 'finance', 'coinbase', 'binance', 'portfolio', 'token', 'blockchain']):
            template_key = 'crypto_finance'
        elif any(kw in prompt_lower for kw in ['shop', 'store', 'ecommerce', 'e-commerce', 'product', 'cart', 'checkout', 'buy']):
            template_key = 'ecommerce'
        elif any(kw in prompt_lower for kw in ['ai', 'chat', 'assistant', 'gpt', 'llm', 'chatbot', 'bot']):
            template_key = 'ai_tool'
        elif any(kw in prompt_lower for kw in ['admin panel', 'cms', 'backend', 'manage content', 'crud']):
            template_key = 'admin_panel'
        elif any(kw in prompt_lower for kw in ['dashboard', 'admin', 'analytics', 'stats', 'metrics']):
            template_key = 'saas_dashboard'
    
    # Get base template or create custom blueprint
    if template_key and template_key in APP_TEMPLATES:
        template = APP_TEMPLATES[template_key]
        blueprint = template['blueprint'].copy()
        blueprint['template_used'] = template_key
        blueprint['template_name'] = template['name']
    else:
        # Custom blueprint for non-template apps
        blueprint = {
            "app_type": "custom",
            "platform": ["web"],
            "ui_framework": "gaaius-ui",
            "pages": [
                {"name": "Home", "components": ["Hero", "Features", "CTA"]},
                {"name": "About", "components": ["Content", "Team", "Contact"]}
            ],
            "layout": {
                "type": "navbar",
                "nav_items": ["Home", "About", "Contact"],
                "header": True,
                "footer": True
            },
            "features": ["responsive", "animations"],
            "theme": "dark-modern",
            "template_used": None,
            "template_name": "Custom Build"
        }
    
    # Extract app name from prompt
    name_patterns = [
        r'(?:called?|named?)\s+["\']?([^"\']+)["\']?',
        r'(?:build|create|make)\s+(?:a\s+)?([A-Z][a-zA-Z]+)',
    ]
    app_name = "MyApp"
    for pattern in name_patterns:
        match = re.search(pattern, prompt, re.IGNORECASE)
        if match:
            app_name = match.group(1).strip()
            break
    
    blueprint['app_name'] = app_name
    blueprint['original_prompt'] = prompt
    blueprint['generated_at'] = datetime.now(timezone.utc).isoformat()
    
    return blueprint


# ============== QUALITY GATE v2 ==============

def quality_gate_v2(html_code: str, blueprint: Dict[str, Any]) -> Dict[str, Any]:
    """
    Enhanced quality gate that validates code against blueprint and design standards.
    Returns score, issues, and whether it passed.
    """
    issues = []
    score = 100
    checks_passed = []
    
    # 1. Structural checks
    if "<!doctype" not in html_code.lower():
        issues.append({"type": "critical", "msg": "Missing DOCTYPE declaration"})
        score -= 15
    else:
        checks_passed.append("DOCTYPE present")
    
    if "tailwindcss" not in html_code.lower():
        issues.append({"type": "critical", "msg": "Missing Tailwind CSS"})
        score -= 20
    else:
        checks_passed.append("Tailwind CSS included")
    
    # 2. Responsive design
    responsive_patterns = ["md:", "lg:", "sm:", "xl:", "max-w-", "mx-auto"]
    responsive_found = sum(1 for p in responsive_patterns if p in html_code)
    if responsive_found < 2:
        issues.append({"type": "warning", "msg": "Limited responsive design classes"})
        score -= 10
    else:
        checks_passed.append(f"Responsive design ({responsive_found} patterns)")
    
    # 3. Layout structure
    layout_elements = ["<nav", "<header", "<main", "<footer", "<aside"]
    layout_found = sum(1 for el in layout_elements if el in html_code.lower())
    if layout_found < 2:
        issues.append({"type": "warning", "msg": "Missing semantic layout elements"})
        score -= 10
    else:
        checks_passed.append(f"Semantic layout ({layout_found} elements)")
    
    # 4. Interactivity
    interactive_patterns = ["hover:", "transition", "onclick", "addEventListener"]
    interactive_found = sum(1 for p in interactive_patterns if p.lower() in html_code.lower())
    if interactive_found < 2:
        issues.append({"type": "minor", "msg": "Limited interactivity"})
        score -= 5
    else:
        checks_passed.append(f"Interactivity ({interactive_found} patterns)")
    
    # 5. Icons
    icon_patterns = ["lucide", "heroicon", "font-awesome", "<svg", "data-lucide"]
    has_icons = any(p.lower() in html_code.lower() for p in icon_patterns)
    if not has_icons:
        issues.append({"type": "minor", "msg": "Missing icons"})
        score -= 5
    else:
        checks_passed.append("Icons included")
    
    # 6. Typography
    font_patterns = ["font-bold", "font-semibold", "font-medium", "text-sm", "text-lg", "text-xl"]
    typography_found = sum(1 for p in font_patterns if p in html_code)
    if typography_found < 3:
        issues.append({"type": "minor", "msg": "Limited typography hierarchy"})
        score -= 5
    else:
        checks_passed.append(f"Typography hierarchy ({typography_found} classes)")
    
    # 7. Color consistency
    color_patterns = ["bg-", "text-", "border-"]
    color_found = sum(1 for p in color_patterns if p in html_code)
    if color_found < 10:
        issues.append({"type": "minor", "msg": "Limited color usage"})
        score -= 5
    else:
        checks_passed.append(f"Color system ({color_found} classes)")
    
    # 8. Spacing
    spacing_patterns = ["p-", "px-", "py-", "m-", "mx-", "my-", "gap-", "space-"]
    spacing_found = sum(1 for p in spacing_patterns if p in html_code)
    if spacing_found < 10:
        issues.append({"type": "warning", "msg": "Insufficient spacing"})
        score -= 10
    else:
        checks_passed.append(f"Proper spacing ({spacing_found} classes)")
    
    # 9. Accessibility basics
    has_alt = 'alt="' in html_code
    has_aria = 'aria-' in html_code
    if not has_alt and '<img' in html_code:
        issues.append({"type": "minor", "msg": "Images missing alt attributes"})
        score -= 3
    
    # 10. Code quality
    code_length = len(html_code)
    if code_length < 2000:
        issues.append({"type": "warning", "msg": "Code seems too minimal"})
        score -= 10
    
    return {
        "score": max(0, score),
        "passed": score >= 70,
        "issues": issues,
        "checks_passed": checks_passed,
        "blueprint_match": blueprint.get('template_used', 'custom'),
        "code_length": code_length
    }


# ============== SYSTEM PROMPTS ==============

BLUEPRINT_SYSTEM_PROMPT = '''You are GAAIUS BUILD BRAIN - a production-grade application builder.

ROLE: You generate structured blueprints for applications before any code is written.

OUTPUT FORMAT: Return ONLY valid JSON with this structure:
{
  "app_name": "string",
  "app_type": "dashboard|ecommerce|admin|ai_tool|crypto|landing|custom",
  "platform": ["web", "mobile", "desktop"],
  "pages": [
    {
      "name": "string",
      "components": ["string"],
      "layout": "string"
    }
  ],
  "features": ["string"],
  "theme": "string",
  "data_models": [{"name": "string", "fields": ["string"]}]
}

RULES:
1. Always suggest complete, production-ready feature sets
2. Include proper navigation and user flows
3. Suggest appropriate components for each page
4. Consider mobile responsiveness in layout
5. Include authentication if the app needs user data'''


GAAIUS_BUILD_PROMPT_V2 = '''SYSTEM: GAAIUS AI BUILDER v2.0 - PLATFORM ASSEMBLER

You are NOT generating demos. You are building PRODUCTION-READY applications.

DESIGN SYSTEM (MANDATORY):
1. Layout: Use consistent spacing (p-4, p-6, p-8), proper margins (m-auto, max-w-7xl)
2. Colors: Use cohesive palette (violet-500, cyan-500 for accents, white/10 for borders)
3. Typography: Clear hierarchy (text-2xl font-bold for headings, text-sm text-white/60 for meta)
4. Components: Cards with rounded-xl bg-white/5 border border-white/10
5. Icons: Always include Lucide icons (add script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js")
6. Responsive: ALWAYS use md: lg: xl: prefixes for responsive design

QUALITY STANDARDS:
- Minimum 3000 characters of code
- At least 3 different sections/components
- Working navigation with hover states
- Proper semantic HTML (nav, header, main, aside, footer)
- Smooth transitions (transition, hover:)
- Professional color scheme
- Real content (not lorem ipsum)

OUTPUT: Return ONLY complete HTML. No markdown. No explanations. No code blocks.
Start with <!DOCTYPE html> and end with </html>.'''


# ============== TEMPLATE CODE GENERATORS ==============

def get_template_code(template_key: str, app_name: str, customizations: Dict = None) -> str:
    """Generate code from a template with customizations."""
    
    if template_key not in APP_TEMPLATES:
        return None
    
    template = APP_TEMPLATES[template_key]
    if 'code_template' not in template:
        return None
    
    code = template['code_template']
    
    # Replace placeholders
    code = code.replace('{{APP_NAME}}', app_name)
    
    # Generate nav items based on template
    nav_html = ""
    for item in template['blueprint']['layout']['nav_items']:
        nav_html += f'''<a href="#" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition">
          <i data-lucide="{get_icon_for_nav(item)}" class="w-5 h-5"></i>
          <span class="text-sm font-medium">{item}</span>
        </a>\n'''
    code = code.replace('{{NAV_ITEMS}}', nav_html)
    
    # Generate stats cards if needed
    if '{{STATS_CARDS}}' in code:
        stats_html = generate_stats_cards()
        code = code.replace('{{STATS_CARDS}}', stats_html)
    
    return code


def get_icon_for_nav(item: str) -> str:
    """Get appropriate Lucide icon name for navigation item."""
    icons = {
        'dashboard': 'layout-dashboard',
        'analytics': 'bar-chart-2',
        'users': 'users',
        'settings': 'settings',
        'home': 'home',
        'shop': 'shopping-bag',
        'products': 'package',
        'orders': 'clipboard-list',
        'content': 'file-text',
        'media': 'image',
        'chat': 'message-square',
        'history': 'clock',
        'portfolio': 'briefcase',
        'trade': 'trending-up',
        'wallet': 'wallet',
        'markets': 'activity',
        'categories': 'grid',
        'sale': 'tag'
    }
    return icons.get(item.lower(), 'circle')


def generate_stats_cards() -> str:
    """Generate sample stats cards HTML."""
    return '''
      <div class="p-6 bg-white/5 border border-white/10 rounded-2xl">
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm font-medium text-white/60">Total Revenue</p>
          <div class="p-2 bg-emerald-500/20 rounded-lg"><i data-lucide="dollar-sign" class="w-4 h-4 text-emerald-400"></i></div>
        </div>
        <p class="text-3xl font-bold">$45,231</p>
        <p class="text-sm text-emerald-400 mt-1">↑ 12.5% from last month</p>
      </div>
      <div class="p-6 bg-white/5 border border-white/10 rounded-2xl">
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm font-medium text-white/60">Active Users</p>
          <div class="p-2 bg-violet-500/20 rounded-lg"><i data-lucide="users" class="w-4 h-4 text-violet-400"></i></div>
        </div>
        <p class="text-3xl font-bold">2,338</p>
        <p class="text-sm text-emerald-400 mt-1">↑ 8.2% from last month</p>
      </div>
      <div class="p-6 bg-white/5 border border-white/10 rounded-2xl">
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm font-medium text-white/60">Total Orders</p>
          <div class="p-2 bg-cyan-500/20 rounded-lg"><i data-lucide="shopping-cart" class="w-4 h-4 text-cyan-400"></i></div>
        </div>
        <p class="text-3xl font-bold">1,893</p>
        <p class="text-sm text-emerald-400 mt-1">↑ 5.7% from last month</p>
      </div>
      <div class="p-6 bg-white/5 border border-white/10 rounded-2xl">
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm font-medium text-white/60">Conversion Rate</p>
          <div class="p-2 bg-amber-500/20 rounded-lg"><i data-lucide="percent" class="w-4 h-4 text-amber-400"></i></div>
        </div>
        <p class="text-3xl font-bold">3.24%</p>
        <p class="text-sm text-red-400 mt-1">↓ 0.8% from last month</p>
      </div>
    '''


# ============== AVAILABLE TEMPLATES LIST ==============

def get_available_templates() -> List[Dict]:
    """Return list of available templates for frontend."""
    return [
        {
            "key": key,
            "name": template["name"],
            "description": template["description"],
            "features": template["blueprint"].get("features", [])
        }
        for key, template in APP_TEMPLATES.items()
    ]
