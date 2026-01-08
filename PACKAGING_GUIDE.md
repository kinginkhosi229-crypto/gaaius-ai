# GAAIUS AI - Multi-Platform Packaging Guide

This document provides instructions for packaging the GAAIUS AI application for different platforms.

## Prerequisites

Before packaging, ensure:
1. The application builds successfully: `yarn build`
2. All PWA assets are in place (manifest.json, service worker, icons)
3. The built files are in the `/build` directory

---

## 1. Web Deployment (Already Ready)

The application is already configured as a Progressive Web App (PWA).

### Features:
- Installable on desktop and mobile browsers
- Works offline (basic caching)
- App-like experience on mobile devices

### Deploy to:
- Any static hosting (Vercel, Netlify, GitHub Pages)
- Your own server with nginx/apache

```bash
# Build the production version
yarn build

# The /build folder contains all static files
```

---

## 2. Desktop Application (EXE/DMG/AppImage)

### Recommended Tool: **Tauri** or **Electron**

#### Option A: Tauri (Recommended - Smaller Bundle)

```bash
# Install Tauri CLI
npm install -g @tauri-apps/cli

# Initialize Tauri in your project
cd frontend
yarn add -D @tauri-apps/cli

# Configure Tauri (creates src-tauri folder)
yarn tauri init

# Build for your platform
yarn tauri build
```

**Tauri Configuration** (`src-tauri/tauri.conf.json`):
```json
{
  "productName": "GAAIUS AI",
  "version": "1.0.0",
  "identifier": "com.gaaius.ai",
  "build": {
    "distDir": "../build"
  },
  "windows": [{
    "title": "GAAIUS AI",
    "width": 1200,
    "height": 800,
    "resizable": true,
    "fullscreen": false
  }]
}
```

#### Option B: Electron (Larger but more compatible)

```bash
# Add Electron
yarn add -D electron electron-builder

# Add build script to package.json
# "electron:build": "electron-builder"
```

**Output:**
- Windows: `.exe` installer
- macOS: `.dmg` file
- Linux: `.AppImage` or `.deb`

---

## 3. Android (APK)

### Recommended Tool: **Capacitor**

```bash
# Install Capacitor
yarn add @capacitor/core @capacitor/cli
yarn add @capacitor/android

# Initialize Capacitor
npx cap init "GAAIUS AI" "com.gaaius.ai"

# Add Android platform
npx cap add android

# Build web assets
yarn build

# Copy build to native project
npx cap copy android

# Open in Android Studio
npx cap open android
```

**Build APK from Android Studio:**
1. Build > Build Bundle(s) / APK(s) > Build APK(s)
2. Output: `android/app/build/outputs/apk/debug/app-debug.apk`

For **Release APK**:
1. Generate a keystore for signing
2. Build > Generate Signed Bundle / APK

---

## 4. iOS (IPA)

### Requirements:
- macOS computer
- Xcode installed
- Apple Developer Account ($99/year)

### Using Capacitor:

```bash
# Add iOS platform
yarn add @capacitor/ios
npx cap add ios

# Build and copy
yarn build
npx cap copy ios

# Open in Xcode
npx cap open ios
```

**In Xcode:**
1. Set your Team in Signing & Capabilities
2. Product > Archive
3. Distribute to App Store or export for Ad-Hoc

---

## 5. PWA Install (No Store Required)

Users can install the PWA directly from the browser:

### Desktop (Chrome/Edge):
1. Visit the app URL
2. Click the install icon in the address bar
3. Or: Menu > "Install GAAIUS AI"

### Mobile (iOS Safari):
1. Visit the app URL
2. Tap Share button
3. Tap "Add to Home Screen"

### Mobile (Android Chrome):
1. Visit the app URL
2. Tap "Add to Home Screen" banner
3. Or: Menu > "Install App"

---

## Project Structure After Packaging Setup

```
/app/frontend/
├── build/                    # Production build (web)
├── src-tauri/                # Tauri config (desktop)
├── android/                  # Capacitor Android project
├── ios/                      # Capacitor iOS project
├── public/
│   ├── manifest.json         # PWA manifest ✓
│   ├── sw.js                 # Service worker ✓
│   ├── icon-192.png          # App icon 192px ✓
│   └── icon-512.png          # App icon 512px ✓
└── package.json
```

---

## Quick Commands Summary

| Platform | Tool | Build Command |
|----------|------|---------------|
| Web | - | `yarn build` |
| Windows | Tauri | `yarn tauri build --target windows` |
| macOS | Tauri | `yarn tauri build --target macos` |
| Linux | Tauri | `yarn tauri build --target linux` |
| Android | Capacitor | `npx cap build android` |
| iOS | Capacitor | `npx cap build ios` |

---

## Notes

1. **Backend URL**: For desktop/mobile apps, ensure the backend URL is correctly configured. The app currently uses the environment variable `REACT_APP_BACKEND_URL`.

2. **API Keys**: The GROQ API key and other secrets should remain server-side. The packaged app will call your hosted backend.

3. **Testing**: Always test the PWA install first before creating native packages, as PWA provides most of the benefits with minimal effort.

4. **Updates**: 
   - Web/PWA: Automatic (service worker updates)
   - Desktop/Mobile: Requires new release

---

*Generated for GAAIUS AI - Your Unified AI Assistant*
