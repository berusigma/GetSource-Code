<div align="center">

  <img src="https://raw.githubusercontent.com/berusigma/GetSource-Code/refs/heads/main/public/rsource_logo.jpg" alt="RSource Logo" width="140" style="border-radius: 20px; box-shadow: 0 10px 25px rgba(37,99,235,0.3);" />

  # ⚡ RSource — Website Source Code Extractor & Live Inspector

  <p align="center">
    <b>Aplikasi Ekstraktor Source Code Website Multi-Platform dengan Desain Ultra Premium (Putih & Biru)</b><br />
    Ekstrak HTML, JavaScript (.JS), Stylesheet (.CSS), Gambar, & Asset Media dengan Sekali Klik.
  </p>

  <p align="center">
    <a href="https://github.com/berusigma/GetSource-Code/actions"><img src="https://img.shields.io/github/actions/workflow/status/berusigma/GetSource-Code/build-and-release.yml?style=for-the-badge&logo=github&label=Build%20%26%20Release" alt="Build Status"></a>
    <a href="https://github.com/berusigma/GetSource-Code/releases"><img src="https://img.shields.io/github/v/release/berusigma/GetSource-Code?style=for-the-badge&color=00f2fe&label=Release" alt="Release Version"></a>
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License MIT">
    <img src="https://img.shields.io/badge/Platforms-Android%20%7C%20iOS%20%7C%20Windows%20%7C%20Web-blueviolet?style=for-the-badge" alt="Platform Support">
  </p>

</div>

---

## 🚀 Key Features (Fitur Utama)

* 🎨 **Desain Ultra Premium (Putih & Biru)**: Antarmuka modern, bersih, glassmorphism dengan mikro-animasi dan *dark-navy code inspector pane*.
* 🌐 **Full Source Code Extraction**:
  * 📄 **HTML Code**: Terformat rapi (*beautified*) dengan *syntax highlighting* PrismJS, pencarian baris kode, dan opsi *wrap lines*.
  * ⚡ **JavaScript (.JS)**: Mendeteksi *inline scripts* maupun file external `<script src="...">` secara otomatis.
  * 🎨 **Stylesheet (.CSS)**: Mendeteksi *inline styles* maupun file external `<link rel="stylesheet">`.
  * 🖼️ **Media & Assets**: Galeri grid visual untuk seluruh gambar (`<img>`), SVG, Favicon, dan gambar OpenGraph.
* 📥 **Auto-Download Direct to Download Folder**:
  * **Download Single File**: Simpan `index.html`, bundle `.js`, atau bundle `.css` sekali klik.
  * 📦 **Download Complete Package (.ZIP)**: Mengepak seluruh file HTML, skrip, stylesheet, metadata JSON report ke dalam 1 file `.zip` yang **tersimpan otomatis di folder Download Anda**.
* 👁️ **Live Responsive Web Preview**:
  * Pratinjau *iframe interactive real-time* dari website target.
  * Pilihan viewport responsif: **Desktop (100%)**, **Laptop (1024px)**, **Tablet (768px)**, dan **Mobile (375px)**.
* 🛡️ **Multi-Proxy CORS Bypass System**:
  * Mendukung auto fallback ke AllOrigins API, CorsProxy.io, CodeTabs, Direct Fetch, dan `CapacitorHttp` native proxy.
* 🤖 **Automated GitHub Actions CI/CD Release**:
  * Setiap kali ada update di repository, GitHub Actions akan otomatis melakukan kompilasi file **Android APK**, **iOS IPA**, dan **Windows EXE**, lalu mengunggahnya ke **GitHub Releases**.

---

## 🛠️ Tech Stack & Technologies

* **Frontend Engine**: HTML5, Vanilla JavaScript (ES6+), Modern CSS3 Design System.
* **Syntax Highlighting**: [PrismJS](https://prismjs.com/) (Tomorrow Theme).
* **Code Formatting**: [js-beautify](https://github.com/beautify-web/js-beautify).
* **Client-side Compression**: [JSZip](https://stuk.github.io/jszip/) & [FileSaver.js](https://github.com/eligrey/FileSaver.js).
* **Mobile Runtime**: [Capacitor 7](https://capacitorjs.com/) (`@capacitor/core`, `@capacitor/filesystem`, `@capacitor/haptics`, `@capacitor/clipboard`).
* **Desktop Runtime**: [Tauri v2](https://tauri.app/).
* **CI/CD**: GitHub Actions (`softprops/action-gh-release`).

---

## 📱 Cara Menggunakan (Usage)

1. **Jalankan Aplikasi** (via browser, Android APK, atau desktop).
2. **Masukkan URL Website Target** (misal: `https://github.com` atau `https://wikipedia.org`).
3. Tekan **Dapatkan Source Code** ⚡.
4. Pilih Tab Inspector yang Anda butuhkan:
   * 📊 **Overview**: Ringkasan ukuran file dan metadata SEO.
   * 📄 **HTML Code**: Melihat & menyalin kode HTML terformat.
   * ⚡ **Scripts JS**: Memeriksa seluruh skrip JavaScript target.
   * 🎨 **Styles CSS**: Memeriksa seluruh file CSS stylesheet target.
   * 🖼️ **Media**: Melihat daftar gambar & icon yang digunakan.
   * 👁️ **Live Preview**: Pratinjau responsif halaman website.
   * 📥 **Download Center**: Unduh file ZIP lengkap ke direktori Download.

---

## 📦 Download Compiled Binaries (APK / EXE)

Anda dapat mengunduh hasil build siap pakai (Android APK & Windows Setup) langsung di halaman **[GitHub Releases](https://github.com/berusigma/GetSource-Code/releases)**.

---

## 🔨 Development & Build Guide

```bash
# 1. Clone repository
git clone https://github.com/berusigma/GetSource-Code.git
cd GetSource-Code

# 2. Install dependencies
npm install

# 3. Jalankan web lokal
# Buka file public/index.html di browser atau gunakan server lokal:
npx serve public

# 4. Sync platform mobile (Capacitor)
npm run cap:sync

# 5. Build Desktop App (Tauri)
npm run tauri:build
```

---

## 📜 License

Project ini dilisensikan di bawah **MIT License**. Dibuat dan dikembangkan oleh **[berusigma](https://github.com/berusigma)**.
