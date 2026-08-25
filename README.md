# 🚀 Capacitor 7 Hybrid Starter Template (Android & iOS)

![Capacitor Version](https://img.shields.io/badge/Capacitor-7.0.0-blue?logo=capacitor)
![Platforms](https://img.shields.io/badge/platform-Android%20%7C%20iOS-green)
![Build](https://img.shields.io/badge/build-GitHub%20Actions-2088FF?logo=github-actions)
![License](https://img.shields.io/badge/license-MIT-yellow)

**Starter Template** berbasis **Capacitor 7** untuk membangun aplikasi mobile hybrid lintas platform (**Android** dan **iOS / iPhone**) dengan **Single Codebase (satu kode untuk semua OS)** dan **Otomatisasi Build Gratis via GitHub Actions**.

---

## 🌟 Konsep Utama: Single Codebase (Tulis 1x untuk Semua OS)

> **Sangat Mudah & Tidak Ribet!**  
> Anda **HANYA PERLU MENULIS KODE 1 KALI SAJA** di dalam folder `public/` (HTML, CSS, dan JavaScript).  
> Anda **TIDAK PERLU** menyalin atau memindahkan kode secara manual ke dalam direktori `android/` atau `ios/`.  
> 
> Saat Anda menjalankan perintah `npx cap sync` atau melakukan `git push` ke GitHub, sistem Capacitor secara otomatis menyalin seluruh file dari folder `public/` ke dalam direktori Android dan iOS!

---

## 📁 Struktur Direktori Projek

```text
capacitor-starter/
├── .github/
│   └── workflows/
│       └── build-all-platforms.yml   # Script GitHub Actions untuk build otomatis
├── android/                          # Folder native Android (Android Studio)
├── ios/                              # Folder native iOS (Xcode)
├── public/                           # ⭐ TEMPAT UTAMA KODING ANDA (Single Codebase)
│   ├── index.html                    # Halaman utama (UI)
│   ├── style.css                     # Styling tampilan
│   └── app.js                        # Logika JavaScript & Interaksi Plugin
├── capacitor.config.json             # Konfigurasi Nama Aplikasi & App ID
├── package.json                      # Daftar Dependency NPM
└── README.md                         # Panduan ini
```

---

📱 Panduan Penggunaan Lengkap

Langkah 1: Kloning Repository & Install Dependensi

```bash
git clone https://github.com/berusigma/capacitor-starter.git nama-aplikasi-kamu
cd nama-aplikasi-kamu
npm install
```

Langkah 2: Ubah Identitas Aplikasi (Nama & Package ID)

Buka file capacitor.config.json dan sesuaikan dengan data aplikasimu:

```json
{
  "appId": "com.namakamu.namaplikasi",
  "appName": "Nama Aplikasi Kamu",
  "webDir": "public"
}
```

Catatan App ID: Gunakan format domain terbalik (reverse domain) agar unik, contoh: com.perusahaan.namaapp.

Langkah 3: Mulai Koding Aplikasi (Folder public/)

Cukup edit 3 file utama ini:

· public/index.html → Tambahkan tombol, input, atau elemen UI lainnya.
· public/style.css → Ubah warna, font, layout, dan animasi.
· public/app.js → Tulis logika bisnis, panggil API, atau akses fitur HP.

Langkah 4: Sinkronkan Perubahan ke Folder Native

Setiap selesai mengubah file di public/, jalankan perintah sync:

```bash
npx cap sync
```

Perintah ini akan otomatis menyalin seluruh isi public/ ke folder android/ dan ios/ tanpa perlu copy manual.

Langkah 5: Push ke GitHub & Dapatkan APK/IPA Otomatis

Push kode ke repository GitHub:

```bash
git add .
git commit -m "feat: Tambah fitur aplikasi baru"
git push origin main
```

1. Buka tab Actions di repository GitHub-mu.
2. Pilih workflow Build Multi-Platform Apps.
3. GitHub akan menjalankan 2 server virtual sekaligus:
   · Ubuntu Server → Build APK Android Release (Signed).
   · macOS Xcode Server → Build proyek iOS untuk Xcode.
4. Jika status berhasil (centang hijau), klik hasil run dan unduh APK Android serta arsip iOS-nya! 🎉

---

🔑 Solusi Eror "Paket Tidak Valid" pada Android

Aplikasi ini sudah dilengkapi dengan Keystore Release Digital Signature bawaan di file android/app/build.gradle:

```groovy
signingConfigs {
    release {
        storeFile file('release.keystore')
        storePassword 'android123'
        keyAlias 'rysav'
        keyPassword 'android123'
    }
}
```

Dengan konfigurasi ini, APK Release yang dihasilkan oleh GitHub Actions sudah 100% bertanda tangan digital sehingga dapat diinstall langsung di semua HP Android tanpa eror "Paket tidak valid".

---

📚 Penjelasan Lengkap tentang Library Capacitor

Capacitor adalah runtime modern yang memungkinkan aplikasi web (HTML/CSS/JS) berjalan sebagai aplikasi native di Android dan iOS. Cara kerjanya:

1. WebView menampilkan UI yang kamu buat di public/.
2. Bridge (Jembatan) menghubungkan JavaScript dengan kode native (Java/Kotlin di Android, Swift/Obj-C di iOS) melalui Plugin.
3. Plugin adalah modul yang memberi akses ke fitur perangkat keras (kamera, GPS, getaran, dll.) atau fitur sistem (penyimpanan, jaringan, dll.).

Kapabilitas Capacitor terbagi menjadi 3 kategori library:

1. Capacitor Core (Wajib)

Merupakan fondasi utama yang mencakup runtime dan API dasar:

Library Fungsi
@capacitor/core Runtime utama dan API dasar.
@capacitor/cli Command Line Interface untuk menjalankan perintah sync, open, dll.
@capacitor/android Platform Android (Native Wrapper).
@capacitor/ios Platform iOS (Native Wrapper).

2. Official Plugins (Dikelola oleh Tim Capacitor)

Plugin resmi yang sangat stabil dan terawat untuk fitur HP paling umum:

Plugin Fungsi Instalasi
Camera Mengambil foto/video dari kamera atau galeri npm install @capacitor/camera
Geolocation Mendapatkan posisi GPS (latitude/longitude) npm install @capacitor/geolocation
Filesystem Membaca/menulis file di penyimpanan internal HP npm install @capacitor/filesystem
Storage Penyimpanan data key-value (mirip LocalStorage tapi persisten) npm install @capacitor/storage
Haptics Mengaktifkan getaran haptic (efek sentuh) npm install @capacitor/haptics
Device Mendapatkan info perangkat (model, OS, versi) npm install @capacitor/device
Network Mendeteksi status koneksi internet (WiFi/Seluler) npm install @capacitor/network
Share Membuka dialog berbagi (Share Sheet) ke aplikasi lain npm install @capacitor/share
SplashScreen Mengatur layar splash saat aplikasi dimuat npm install @capacitor/splash-screen
StatusBar Mengubah warna/tampilan status bar Android/iOS npm install @capacitor/status-bar
App Mengelola siklus hidup aplikasi (pause/resume) npm install @capacitor/app
Browser Membuka link di browser eksternal atau internal npm install @capacitor/browser
Clipboard Baca/tulis teks ke clipboard HP npm install @capacitor/clipboard
Keyboard Mengatur tampilan keyboard virtual (show/hide) npm install @capacitor/keyboard
Toast Menampilkan notifikasi pop-up singkat npm install @capacitor/toast

3. Community Plugins (Dikelola oleh Komunitas)

Plugin tambahan untuk kebutuhan lebih spesifik (Firebase, SQLite, Iklan, dll.). Contoh populer:

· @capacitor-community/sqlite → Database SQLite lokal.
· @capacitor-community/firebase-analytics → Google Analytics.
· @capacitor-community/facebook-login → Login dengan Facebook.
· @capacitor-community/admob → Menampilkan iklan AdMob.
· @capacitor-community/audio → Memutar/merekam audio.

---

🔗 Daftar Link Resmi Library Capacitor

Berikut tautan untuk menjelajahi semua plugin yang tersedia:

Sumber Link Keterangan
Daftar Resmi Plugin Capacitor capacitorjs.com/docs/plugins Direktori resmi semua plugin (Core + Official)
Capacitor Community GitHub github.com/capacitor-community Koleksi plugin buatan komunitas
Dokumentasi API Core capacitorjs.com/docs/apis Panduan lengkap setiap API plugin
Awesome Capacitor github.com/capacitor-community/awesome-capacitor Daftar kurasi plugin, boilerplate, dan tools

---

➕ Cara Menambahkan Plugin Native ke Proyek

Jika aplikasi butuh fitur tambahan (misal Kamera & GPS):

```bash
# 1. Install plugin yang diinginkan
npm install @capacitor/camera @capacitor/geolocation

# 2. Sinkronkan ke proyek Android & iOS
npx cap sync
```

Tips: Setelah sync, jika kamu menjalankan di Android Studio (npx cap open android), plugin akan otomatis terdeteksi. Di iOS, jalankan cd ios && pod install jika diperlukan.

---

⚠️ Catatan Penting untuk Scraping (Web Scrape)

Jika Anda berencana menggunakan aplikasi ini untuk web scraping:

· fetch atau axios di public/app.js akan terkena CORS karena berjalan di WebView.
· Solusi: Gunakan plugin @capacitor/core bawaan yaitu CapacitorHttp yang berjalan di layer native sehingga bebas CORS.
· Aktifkan di capacitor.config.json:
  ```json
  {
    "plugins": {
      "CapacitorHttp": { "enabled": true }
    }
  }
  ```
· Lalu panggil API via import { CapacitorHttp } from '@capacitor/core';

---

📄 Lisensi

MIT License © 2026 berusigma

---

Dibuat dengan ❤️ oleh berusigma — Selamat berkoding dan berkreasi!

```

---
