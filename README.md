# 🚀 Capacitor 7 Hybrid Starter Template (Android & iOS / iPhone)

Template starter kosongan berbasis **Capacitor 7** untuk membuat aplikasi mobile lintas platform (**Android** dan **iOS / iPhone**) dengan **Single Codebase** dan **Otomatisasi Build Gratis via GitHub Actions**.

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
│       └── build-all-platforms.yml   # Script GitHub Actions untuk build APK Android & iOS otomatis
├── android/                           # Folder native Android (Android Studio / Gradle)
├── ios/                               # Folder native iOS (Xcode / CocoaPods)
├── public/                            # tempat utama koding aplikasi Anda (Single Codebase)
│   ├── index.html                     # Halaman web/UI utama
│   ├── style.css                      # Styling CSS
│   └── app.js                         # Logika JavaScript & interaksi plugin HP
├── capacitor.config.json              # Konfigurasi Nama Aplikasi & App ID (Package Name)
├── package.json                       # Daftar dependency & plugin npm
└── README.md                          # Panduan penggunaan ini
```

---

## 📱 Panduan Penggunaan Langkah demi Langkah

### Langkah 1: Kloning / Download Repository Ini
```bash
git clone https://github.com/berusigma/capacitor-starter.git nama-aplikasi-kamu
cd nama-aplikasi-kamu
npm install
```

---

### Langkah 2: Ubah Nama Aplikasi & Package ID (App ID)
Buka file `capacitor.config.json` dan sesuaikan dengan identitas aplikasi baru Anda:
```json
{
  "appId": "com.namakamu.namaplikasi",
  "appName": "Nama Aplikasi Kamu",
  "webDir": "public"
}
```
> **Catatan App ID**: `appId` harus unik menggunakan format domain terbalik, contoh: `com.perusahaan.namaapp`.

---

### Langkah 3: Mulai Koding Aplikasi Anda (Folder `public/`)
Cukup edit file yang ada di dalam folder `public/`:
* Edit `public/index.html` untuk menambahkan tombol, input, dan elemen UI.
* Edit `public/style.css` untuk mengubah warna, font, dan animasi tampilan.
* Edit `public/app.js` untuk menambahkan logika JavaScript dan fitur native.

---

### Langkah 4: Sinkronkan Perubahan ke Folder Native Android & iOS
Setiap kali Anda selesai menambah/mengubah kode di folder `public/`, jalankan perintah sync di terminal:
```bash
npx cap sync
```
*Perintah di atas akan otomatis menyalin seluruh isi `public/` ke folder `android/` dan `ios/` tanpa perlu memindahkan file manual.*

---

### Langkah 5: Push ke GitHub & Otomatis Build APK Android & iOS App

Push seluruh kode Anda ke repository GitHub Anda:
```bash
git add .
git commit -m "feat: Tambah fitur aplikasi baru"
git push origin main
```

1. Buka halaman repository Anda di GitHub, lalu klik tab **Actions**.
2. Pilih workflow **Build Multi-Platform Apps**.
3. GitHub Actions akan otomatis menyalakan 2 server virtual secara bersamaan:
   * **Ubuntu Server**: Mengompilasi APK Android Release bertanda tangan digital (Signed).
   * **macOS Xcode Server**: Mengompilasi projek iOS / iPhone untuk Xcode.
4. Setelah proses build selesai (berwarna hijau centang), klik pada hasil run untuk mengunduh **APK Android** dan **iOS Archive**! 🎁

---

## 🛠️ Solusi Eror "Paket Tampaknya Tidak Valid" pada Android

Aplikasi ini sudah dilengkapi dengan **Keystore Release Digital Signature** bawaan di file `android/app/build.gradle`:

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

Sehingga APK Release yang dihasilkan oleh GitHub Actions **sudah 100% bertanda tangan digital valid** dan **dapat diinstall langsung di semua HP Android tanpa mengalami kendala "Paket tidak valid"**.

---

## 🔌 Cara Menambahkan Plugin Native HP Tambahan

Jika aplikasi Anda membutuhkan fitur HP seperti Kamera, GPS, Getaran, Penyimpanan, dll:

```bash
# 1. Contoh: Install plugin Kamera dan Geolocation
npm install @capacitor/camera @capacitor/geolocation

# 2. Sinkronkan plugin ke Android & iOS
npx cap sync
```

---

## 📄 Lisensi
MIT License © 2026 berusigma
