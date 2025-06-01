# 🌱 GreenHope

GreenHope adalah platform digital donasi pohon yang menghubungkan masyarakat dengan komunitas lingkungan serta daerah yang membutuhkan penghijauan. Tujuannya adalah membangun ekosistem hijau yang berkelanjutan melalui kontribusi sederhana namun berdampak besar.

## 👥 Anggota Tim
- **Nisa Rianti** - 2208107010018  
- **Raihan Firyal** - 2208107010084

---

## 🧩 Latar Belakang

Banyak daerah, terutama di wilayah perkotaan dan lahan kritis, kekurangan ruang hijau. Meskipun masyarakat memiliki kepedulian terhadap lingkungan, sering kali mereka tidak memiliki akses atau wadah untuk berkontribusi secara langsung. Belum ada platform yang menghubungkan donatur dengan kebutuhan penghijauan secara mudah dan transparan.

GreenHope hadir sebagai solusi untuk:
- Memfasilitasi donasi pohon secara online.
- Mempertemukan donatur dengan komunitas penghijauan.
- Menyediakan informasi perkembangan pohon secara berkala.

---

## ⚙️ Teknologi yang Digunakan

| Bagian         | Teknologi Digunakan | Fungsi                                                                 |
|----------------|----------------------|------------------------------------------------------------------------|
| Frontend       | ReactJS              | Membuat UI (user interface) yang interaktif dan cepat                 |
| Styling        | CSS Minimalis        | Memberi tampilan yang bersih dan sesuai tema lingkungan               |
| Donasi Form    | Google Form          | Mengumpulkan data donasi dari pengguna                                |
| Admin Panel    | React                | Mengelola galeri dan laporan pohon                                    |
| Database       | **MongoDB**          | Menyimpan data donatur atau laporan kegiatan                          |

---

## 🌐 Fitur Utama

### 1. Halaman Donasi  
Menampilkan daftar lokasi penghijauan yang tersedia beserta deskripsi singkat untuk memudahkan pemilihan lokasi donasi.

### 2. Lokasi Penghijauan  
Pengguna dapat melihat detail berbagai lokasi yang membutuhkan penghijauan sebelum memutuskan untuk berdonasi.

### 3. Formulir Donasi  
Formulir berisi data diri, jumlah pohon yang ingin didonasikan, serta unggahan bukti transfer secara mudah dan praktis.

### 4. Galeri Perkembangan  
Dokumentasi berupa foto sebelum dan sesudah kegiatan penanaman pohon sebagai bentuk transparansi dan laporan kepada donatur.

### 5. Testimoni  
Menampilkan cerita inspiratif dari masyarakat atau komunitas di lokasi yang berhasil menghijau kembali berkat bantuan donatur.

---

## 🗃️ Struktur Database (MongoDB)

Struktur relasional (ERD) database terdiri dari tabel-tabel berikut:

- **USER**: Menyimpan informasi pengguna/donatur.
- **ADMIN**: Mengelola konten dan laporan pohon.
- **POHON**: Data pohon yang ditanam.
- **ADOPSI**: Informasi adopsi pohon (relasi antara USER dan POHON).
- **PAYMENT**: Detil pembayaran dari donatur.

Relasi utama:
- USER melakukan **adopsi** pohon.
- ADMIN memverifikasi dan mengelola **adopsi** serta laporan.
- ADOPSI memiliki relasi ke tabel **PAYMENT**

*(Lihat diagram ERD untuk detail visual relasi antar tabel.)*

---

## 🚀 Cara Kerja Sistem

1. Pengguna memilih lokasi penghijauan.
2. Mengisi form donasi dan mengunggah bukti transfer.
3. Admin memverifikasi pembayaran dan memproses adopsi pohon.
4. Dokumentasi penanaman pohon diunggah secara berkala.
5. Donatur menerima laporan dan sertifikat digital sebagai bentuk apresiasi.

---

## 📌 Catatan Tambahan

- Platform dikembangkan dengan fokus pada kemudahan penggunaan dan transparansi donasi.
- Data disimpan dengan aman menggunakan MongoDB.
- Formulir Google digunakan untuk kemudahan input awal data oleh donatur.
