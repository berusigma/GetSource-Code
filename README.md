# 🚀 Multi-Platform Starter Template (Android, iOS & Windows)

Template starter kosongan berbasis **Capacitor 7** & **Tauri** untuk membangun aplikasi lintas platform (**Android**, **iOS/iPhone**, dan **Windows Desktop**) dengan otomatisasi build gratis berbasis **GitHub Actions**.

---

## 📁 Struktur Direktori

```text
capacitor-starter/
├── .github/
│   └── workflows/
│       └── build-all-platforms.yml   # Workflow GitHub Actions untuk Android, iOS, & Windows
├── android/                           # Folder native Android (Gradle)
├── ios/                               # Folder native iOS (Xcode)
├── src-tauri/                         # Folder native Windows (Rust + Tauri)
├── public/                            # Frontend Web utama (HTML, CSS, JS)
│   ├── index.html
│   ├── style.css
│   └── app.js
├── capacitor.config.json              # Konfigurasi Capacitor
├── package.json                       # Dependency & skrip npm
└── README.md
```

---

## 🌐 Dukungan Multi-Platform

| Platform | Teknologi | Runner GitHub Actions | Output Build |
|---|---|---|---|
| **Android** | Capacitor 7 + Gradle | `ubuntu-latest` | `.apk` (Android Package) |
| **iOS / iPhone** | Capacitor 7 + Xcode | `macos-latest` | `.app` / `.ipa` (Xcode Build) |
| **Windows** | Tauri 2.0 + Rust | `windows-latest` | `.exe` / `.msi` (Windows Installer) |

---

## ⚡ Cara Menggunakan Template Ini

### 1. Edit Kode Frontend Web Anda
Cukup ubah file di folder `public/`:
- `public/index.html` — Struktur Halaman
- `public/style.css` — Styling & Theme
- `public/app.js` — Logika Aplikasi & Plugin Native

### 2. Sinkronkan Perubahan
```bash
# Sync ke Android & iOS
node node_modules/@capacitor/cli/bin/capacitor sync
```

### 3. Push ke GitHub & Otomatis Build 3 OS
Push kode Anda ke GitHub:
```bash
git add .
git commit -m "feat: Update multi-platform starter app"
git push origin main
```

Buka tab **Actions** di repository GitHub Anda. GitHub Actions akan secara otomatis menjalankan 3 server bersamaan (Ubuntu, macOS, Windows) dan menghasilkan installer untuk ketiga OS tersebut! 📱💻🚀

---

## 📄 Lisensi
MIT License © 2026 berusigma
