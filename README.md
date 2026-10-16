# ♻️ Trashline — Platform Edukasi & Aksi Sirkular Sampah Plastik 7 Kode (Pilot Cirebon)

Trashline adalah platform sirkular terpadu berbasis web yang menghubungkan edukasi identifikasi resin plastik, pemetaan titik daur ulang lapangan (Bank Sampah), partisipasi komunitas warga, dan pemantauan transparansi timbangan daerah oleh Dinas Lingkungan Hidup (DLH).

---

## 🌟 Fitur Utama

1. **📖 Kamus Interaktif 7 Resin Plastik (`/kamus`)**
   - Panduan visual mendalam untuk kode resin plastik 1 sampai 7 (PET, HDPE, PVC, LDPE, PP, PS, OTHER).
   - Dilengkapi identifikasi fisik, tingkat bahaya/keamanan pangan, titik leleh, dan panduan pemilahan rumah tangga.
2. **🗺️ Peta Bank Sampah Cirebon (`/peta`)**
   - Pemetaan interaktif berbasis Leaflet dengan titik kemitraan resmi di Cirebon (Dukupuntang, Sumber, Pekalipan).
   - Filter radius terdekat, jenis plastik yang diterima, jam operasional, dan kontak WhatsApp pengurus.
   - Form pendaftaran mandiri *"Daftarkan Bank Sampah"* untuk pengurus RT/RW.
3. **💬 Forum Komunitas & Up-cycling (`/forum`)**
   - Wadah kreasi daur ulang warga dengan filter kategori plastik.
   - Sistem **1 Warga = 1 Like (Toggle Upvote)** untuk transparansi apresiasi ide.
   - Login Guard untuk menjaga kualitas diskusi (hanya warga terdaftar yang dapat berkomentar).
   - **Moderasi Konten Komunitas (Trust & Safety)**: Hak hapus khusus untuk Admin Pengawas DLH atau pemilik ide asli.
4. **🏆 Papan Peringkat & Gamifikasi Wilayah (`/peringkat`)**
   - Skor daur ulang realtime per kecamatan yang dihitung otomatis dari agregasi timbangan fisik sah lapangan.
   - Sistem lencana capaian warga (*Pemula Hijau*, *Pejuang Daur Ulang*, dsb).
5. **🛡️ Dasbor Pengelola & Verifikasi Lapangan Multi-Role (`/admin`)**
   - **Role-Based Access Control (RBAC)**:
     - **Ibu Siti Aminah (Warga)**: Mode pratinjau edukatif.
     - **Kang Suryadi (Petugas Mitra Timbang)**: Input pencatatan timbangan sah lapangan yang mendongkrak skor wilayah.
     - **Bpk. Rahmat Hidayat (Admin Pengawas DLH)**: Wewenang penuh kurasi (ACC/Tolak) pendaftaran mitra baru, pencabutan kemitraan, dan audit timbangan.
   - **Simulator Peran Cepat (Quick Switcher)**: Evaluator dan juri dapat menguji seluruh alur multi-role secara instan dengan 1-klik tanpa perlu bolak-balik login.

---

## 🛠️ Arsitektur & Teknologi

- **Frontend Framework:** Next.js 16 (App Router) & React 19
- **Styling:** Tailwind CSS v4 & Lucide Icons
- **Language:** TypeScript
- **Database & Backend:** Supabase PostgreSQL with Row Level Security (RLS)
- **Map Engine:** Leaflet & OpenStreetMap

---

## 🚀 Panduan Memulai (Local Development)

### 1. Prasyarat
- Node.js versi 18+ (disarankan Node 20 LTS)
- npm atau yarn

### 2. Kloning Repositori & Instalasi Dependensi
```bash
git clone https://github.com/username/trashline.git
cd trashline
npm install
```

### 3. Konfigurasi Variabel Lingkungan
Salin berkas `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Isi konfigurasi Supabase (dapat menggunakan instance default yang sudah tersedia):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser pada [http://localhost:3000](http://localhost:3000).

### 5. Kompilasi Produksi (Production Build)
```bash
npm run build
npm run start
```

---

## 👥 Persona Akun Simulasi Evaluator & Juri

Tersedia simulasi instan pada halaman `/login` dan `/admin`:
- **Admin DLH**: `Bpk. Rahmat Hidayat (Pengawas DLH)` — Wewenang penuh kurasi, timbangan, moderasi forum, & cabut kemitraan.
- **Petugas Mitra**: `Kang Suryadi (Petugas BSI Dewi Sri)` — Input timbangan sah lapangan resmi.
- **Warga Cirebon**: `Ibu Siti Aminah (RW 03 Harjamukti)` — Interaksi warga, upvote ide, & cek peringkat.

---

Dikembangkan dengan penuh dedikasi untuk akselerasi ekonomi sirkular dan tata kelola sampah plastik berkelanjutan.
