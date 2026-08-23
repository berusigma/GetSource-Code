# 🚀 Capacitor 7 Starter Template (Android + GitHub Actions)

Template starter kosongan berbasis **Capacitor 7** untuk membangun aplikasi Hybrid Mobile (Android) dengan sistem otomatisasi kompilasi APK berbasis **GitHub Actions**.

---

## 📁 Struktur Direktori

```text
capacitor-starter/
├── .github/
│   └── workflows/
│       └── build-android.yml   # Workflow GitHub Actions untuk build APK otomatis
├── android/                     # Folder projek native Android (Gradle)
├── public/                      # Web frontend (HTML, CSS, JS)
│   ├── index.html
│   ├── style.css
│   └── app.js
├── capacitor.config.json        # Konfigurasi App ID & nama aplikasi
├── package.json                 # Dependency & skrip npm
└── README.md
```

---

## ⚡ Cara Menggunakan Template Ini

### 1. Ubah Nama & App ID Aplikasi
Buka `capacitor.config.json` dan sesuaikan dengan identitas aplikasi Anda:
```json
{
  "appId": "com.namaanda.namanapp",
  "appName": "Nama Aplikasi Anda",
  "webDir": "public"
}
```

### 2. Tambah Kode / Fitur Web Anda
Edit file di folder `public/`:
- `public/index.html` — Struktur halaman web
- `public/style.css` — Gaya CSS
- `public/app.js` — Logika JavaScript & interaksi plugin Capacitor

### 3. Sync Web ke Folder Android
Setiap kali selesai mengedit file di folder `public/`, sinkronkan ke Android:
```bash
npx cap sync android
```

---

## 📦 Otomatisasi Build APK via GitHub Actions

1. Buat repository baru di GitHub.
2. Push seluruh folder ini ke repository GitHub Anda:
   ```bash
   git init
   git add .
   git commit -m "feat: Initial commit Capacitor 7 starter"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO-NAME.git
   git push -u origin main
   ```
3. Buka tab **Actions** di repository GitHub Anda. Workflow `Build Android APK` akan otomatis berjalan dan menghasilkan file APK siap download! 📲

---

## 🔌 Menginstall Plugin Capacitor Tambahan

Jika aplikasi Anda membutuhkan fitur HP native lainnya:
```bash
# Contoh: Install Kamera atau Geolocation
npm install @capacitor/camera @capacitor/geolocation

# Wajib jalankan sync setelah install plugin baru
npx cap sync android
```

---

## 📄 Lisensi
MIT License © 2026 berusigma
