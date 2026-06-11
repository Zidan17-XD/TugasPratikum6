# Product Mall (Product Catalog)

## Cara Menjalankan Aplikasi
1. Install dependency:
   ```bash
   npm install
   ```
2. Jalankan development server:
   ```bash
   npm run dev
   ```
3. Buka URL yang muncul di terminal (biasanya):
   - http://localhost:5173

## Fitur-fitur yang Diimplementasikan
- Mengambil data **produk** dan **kategori** dari API (FakeStore API).
- Menampilkan produk dalam bentuk **grid**.
- **Search** produk berdasarkan nama/title.
- **Filter kategori**.
- **Filter rating minimum**.
- **Filter rentang harga** (min–max).
- **Sorting** produk (default, harga termurah/termahal, rating tertinggi, nama A-Z).
- **Pagination** untuk membagi produk per halaman.
- **Modal detail produk** saat produk diklik (menampilkan deskripsi, harga, rating).
- **Keranjang belanja (Cart sidebar)**:
  - Tambah produk ke keranjang
  - Hapus item dari keranjang
  - Kosongkan keranjang
  - Checkout simulasi
- **Toast notification** saat produk ditambahkan ke keranjang.
- State UI **loading** saat fetch data dan **error** saat request gagal.
