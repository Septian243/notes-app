# Notes App Starter Project with Webpack

Notes App Starter Project with Webpack adalah template dasar untuk membangun aplikasi web catatan (notes) berbasis Web Components. Proyek ini menggunakan Webpack sebagai module bundler, Babel untuk transpile JavaScript modern, serta konfigurasi yang mendukung environment development maupun production.

Struktur proyek dibangun secara modular, mencakup komponen UI (header, form, daftar catatan), utilitas seperti API handler dan loading indicator, serta file CSS terpisah untuk styling. Setup ini memungkinkan pengembangan aplikasi catatan yang ringan, cepat, dan mudah diperluas.

## Table of Contents

- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Project Structure](#project-structure)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (disarankan versi 12 atau lebih tinggi)
- [npm](https://www.npmjs.com/) (Node package manager)

### Installation

1. Download starter project [di sini](https://codeload.github.com/Septian243/notes-app/zip/refs/heads/main).
2. Lakukan unzip file.
3. Pasang seluruh dependencies dengan perintah berikut.

```shell
   npm install
```

## Scripts

- Build for Production:

```shell
  npm run build
```

Script ini menjalankan webpack dalam mode production menggunakan konfigurasi `webpack.prod.js` dan menghasilkan sejumlah file build ke direktori `dist`.

- Start Development Server:

```shell
  npm run start-dev
```

Script ini menjalankan server pengembangan webpack dengan fitur live reload dan mode development sesuai konfigurasi di `webpack.dev.js`.

- Serve:

```shell
  npm run serve
```

Script ini menggunakan [`http-server`](https://www.npmjs.com/package/http-server) untuk menyajikan konten dari direktori `dist`.

## Project Structure

Proyek starter ini dirancang agar kode tetap modular dan terorganisir.

```text
Notes-App/
├── dist/                          # Compiled files for production
├── src/                           # Source project files
│   ├── script/                    # Source JavaScript files
│   │   ├── components/            # Web Components
│   │   │   ├── app-header.js      # Header component
│   │   │   ├── note-form.js       # Form component for adding notes
│   │   │   ├── note-item.js       # Individual note item component
│   │   │   └── note-list.js       # Note list container component
│   │   └── utils/                 # Utility functions
│   │       ├── api.js             # API communication
│   │       └── loading-indicator.js # Loading state handler
│   ├── style/                     # Source CSS files
│   │   └── style.css              # Main CSS file
│   └── main.js                    # Main JavaScript entry file
├── index.html                     # Main HTML file
├── package.json                   # Project metadata and dependencies
├── package-lock.json              # Dependency lock file
├── webpack.common.js              # Webpack common configuration
├── webpack.dev.js                 # Webpack development configuration
└── webpack.prod.js                # Webpack production configuration
```
