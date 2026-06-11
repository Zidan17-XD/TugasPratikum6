# Laporan Praktikum 6 - Product Catalog (Fake Store API)

## 1. Halaman Judul
**Nama :** (isi)

**NIM :** (isi)

**Kelas :** (isi)

**Judul Tugas :** Tugas 6 - Aplikasi Product Catalog dengan Fake Store API


## 2. Hasil dan Pembahasan
### 2.1 Deskripsi Singkat Aplikasi
Aplikasi ini menampilkan daftar produk dari Fake Store API dan menyediakan fitur pencarian, filter kategori, dan detail produk dalam modal.

### 2.2 Fitur Utama (Sesuai Implementasi)
1. **Product List**
   - Menampilkan kartu produk: gambar, judul, harga, dan rating.
   - Grid responsif (desktop 4 kolom, tablet 2 kolom, mobile 1 kolom).

2. **Loading Indicator**
   - Menampilkan indikator saat data sedang diambil dari API.

3. **Error Handling**
   - Menampilkan pesan error bila request gagal, termasuk tombol untuk memuat ulang.

4. **Category Filter**
   - Mengambil daftar kategori dari endpoint `/products/categories`.
   - Memfilter produk berdasarkan kategori melalui endpoint `/products/category/{category}`.

5. **Search**
   - Pencarian berdasarkan judul produk (client-side filtering).

6. **Product Detail Modal**
   - Klik produk menampilkan detail lengkap pada modal (gambar, kategori, deskripsi, harga, rating).

7. **Sorting (Tambahan #1)**
   - Urutkan berdasarkan:
     - Harga termurah ke termahal (`price-asc`)
     - Harga termahal ke termurah (`price-desc`)
     - Rating tertinggi (`rating`)
     - Nama A-Z (`name`)

8. **Pagination (Tambahan #2)**
   - Menampilkan produk per halaman (menggunakan konstanta `ITEMS_PER_PAGE`).

9. **Add to Cart (Tambahan #3 opsional jika diminta)**
   - Simulasi keranjang dengan state:
     - Tambah produk ke keranjang.
     - Terdapat toast notification saat item ditambahkan.
   - Tersedia sidebar keranjang untuk melihat item dan total harga.

10. **Price Range Filter (Tambahan #4 opsional)**
   - Filter harga min-max.

11. **Rating Filter (Tambahan #5 opsional)**
   - Filter berdasarkan minimal rating tertentu.

### 2.3 Screenshots
> Sertakan screenshot pada bagian ini.

- Screenshot 1: Halaman utama + daftar produk
- Screenshot 2: Loading dan error state
- Screenshot 3: Filter kategori
- Screenshot 4: Search
- Screenshot 5: Modal detail produk
- Screenshot 6: Sorting
- Screenshot 7: Pagination
- Screenshot 8: Add to Cart + toast
- Screenshot 9: Price range / Rating filter (jika digunakan)

### 2.4 Pembahasan Kode (Ringkas)
- **Fetch API** dilakukan menggunakan `axios`:
  - `/products` untuk semua produk.
  - `/products/categories` untuk daftar kategori.
  - `/products/category/{category}` untuk produk per kategori.
- **State management**:
  - `products`, `categories`, `loading`, `error`
  - `searchQuery`, `selectedCategory`
  - `sortBy`, `minRating`, `priceRange`
  - `currentPage`
  - `selectedProduct` untuk modal
  - `cartItems` dan `showCart` untuk simulasi keranjang

## 3. Kesimpulan
1. Aplikasi Product Catalog berhasil mengintegrasikan Fake Store API untuk menampilkan data produk dan kategori.
2. Fitur pencarian, filter kategori, sorting, dan pagination membuat pengguna lebih mudah menavigasi produk.
3. Modal produk dan simulasi keranjang (add to cart + toast) meningkatkan interaksi pengguna.

## 4. Lampiran
### 4.1 Link GitHub Repository
- (isi URL repository GitHub)

### 4.2 Isi README.md (yang disertakan di repository)
- Judul proyek
- Cara menjalankan aplikasi
- Fitur-fitur yang diimplementasikan


