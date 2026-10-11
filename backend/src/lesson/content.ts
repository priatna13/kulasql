export type Lesson = {
  hints: readonly string[]
  sql: string
  why: string
}

export const LESSONS: Record<string, Lesson> = {
  "hari-pertama-di-tokokulwon": {
    "hints": [
      "Konsepnya membaca seluruh kolom satu tabel, lalu menyusun urutan baris. Bukan memilih satu kolom saja.",
      "Bentuknya: semua kolom dari tabel pelanggan, diurutkan menurut id dari yang kecil ke yang besar.",
      "Jangan berhenti di kolom id. Bawa nama, kota, dan total belanja, dengan id paling kecil di baris pertama. Urutan yang dibalik tidak sama dengan permintaan."
    ],
    "sql": "SELECT *\nFROM pelanggan\nORDER BY id;",
    "why": "Soal minta daftar pelanggan yang sudah tercatat, semua kolom, dari id paling kecil ke paling besar. Mengambil setiap kolom membuat nama, kota, dan total belanja ikut terbawa, dan urutan id menaik meletakkan pelanggan pertama di atas. Soal ini menilai urutan, jadi isi yang sama dengan posisi terbalik tetap belum benar."
  },
  "laporan-untuk-tim-marketing": {
    "hints": [
      "Memilih kolom yang diminta dari satu tabel. Konteksnya: Tim marketing TokoKulwon butuh daftar singkat, bukan tabel penuh.",
      "Bentuk query: Kolom hasilnya nama, kota. Sumber utamanya tabel pelanggan.",
      "Ambil dua kolom itu dari tabel pelanggan."
    ],
    "sql": "SELECT nama, kota\nFROM pelanggan;",
    "why": "Kenapa ini benar: Ambil dua kolom itu dari tabel pelanggan. Memilih kolom yang diminta dari satu tabel. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "mencari-pelanggan-dari-jakarta": {
    "hints": [
      "Menyaring baris sebelum ditampilkan. Yang tidak lolos tidak ikut. Konteksnya: Besok ada pengiriman ke Jakarta.",
      "Bentuk query: Kolom hasilnya semua kolom. Sumber utamanya tabel pelanggan. Saringan membuang baris sebelum ringkasan atau urutan.",
      "Tampilkan semua kolom pelanggan yang kotanya Jakarta. Kota ditulis persis Jakarta. Pakai semua kolom, bukan sebagian."
    ],
    "sql": "SELECT *\nFROM pelanggan\nWHERE kota = 'Jakarta';",
    "why": "Kenapa ini benar: Tampilkan semua kolom pelanggan yang kotanya Jakarta. Kota ditulis persis Jakarta. Menyaring baris sebelum ditampilkan. Yang tidak lolos tidak ikut. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "produk-dengan-harga-terjangkau": {
    "hints": [
      "Menyaring baris sebelum ditampilkan. Yang tidak lolos tidak ikut. Konteksnya: Rak promo TokoKulwon diisi barang yang harganya paling tinggi Rp20.000.",
      "Bentuk query: Kolom hasilnya nama, harga. Sumber utamanya tabel produk. Saringan membuang baris sebelum ringkasan atau urutan.",
      "Ambil nama dan harga dari tabel produk. Saring harga yang terisi dan tidak lebih dari 20000."
    ],
    "sql": "SELECT nama, harga\nFROM produk\nWHERE harga <= 20000;",
    "why": "Kenapa ini benar: Ambil nama dan harga dari tabel produk. Saring harga yang terisi dan tidak lebih dari 20000. Menyaring baris sebelum ditampilkan. Yang tidak lolos tidak ikut. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "pelanggan-dari-jakarta-atau-bandung": {
    "hints": [
      "Menyaring baris sebelum ditampilkan. Yang tidak lolos tidak ikut. Konteksnya: Kurir TokoKulwon minggu ini hanya meliput Jakarta dan Bandung.",
      "Bentuk query: Kolom hasilnya nama, kota. Sumber utamanya tabel pelanggan. Saringan membuang baris sebelum ringkasan atau urutan.",
      "Ambil nama dan kota. Saring pelanggan dari Jakarta atau Bandung."
    ],
    "sql": "SELECT nama, kota\nFROM pelanggan\nWHERE kota = 'Jakarta' OR kota = 'Bandung';",
    "why": "Kenapa ini benar: Ambil nama dan kota. Saring pelanggan dari Jakarta atau Bandung. Menyaring baris sebelum ditampilkan. Yang tidak lolos tidak ikut. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "pelanggan-jakarta-belanja-besar": {
    "hints": [
      "Menyaring baris sebelum ditampilkan. Yang tidak lolos tidak ikut. Konteksnya: TokoKulwon ingin menyapa pelanggan Jakarta yang belanjanya sudah besar.",
      "Bentuk query: Kolom hasilnya nama, total_belanja. Sumber utamanya tabel pelanggan. Saringan membuang baris sebelum ringkasan atau urutan.",
      "Tampilkan nama dan total belanja pelanggan dari Jakarta yang total belanjanya lebih dari 300000."
    ],
    "sql": "SELECT nama, total_belanja\nFROM pelanggan\nWHERE kota = 'Jakarta' AND total_belanja > 300000;",
    "why": "Kenapa ini benar: Tampilkan nama dan total belanja pelanggan dari Jakarta yang total belanjanya lebih dari 300000. Menyaring baris sebelum ditampilkan. Yang tidak lolos tidak ikut. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "pelanggan-di-tiga-kota": {
    "hints": [
      "Menyaring baris sebelum ditampilkan. Yang tidak lolos tidak ikut. Konteksnya: TokoKulwon minggu ini hanya mengantar ke tiga kota.",
      "Bentuk query: Kolom hasilnya nama, kota. Sumber utamanya tabel pelanggan. Saringan membuang baris sebelum ringkasan atau urutan.",
      "Tampilkan nama dan kota pelanggan yang tinggal di Jakarta, Surabaya, atau Medan."
    ],
    "sql": "SELECT nama, kota\nFROM pelanggan\nWHERE kota IN ('Jakarta', 'Surabaya', 'Medan');",
    "why": "Kenapa ini benar: Tampilkan nama dan kota pelanggan yang tinggal di Jakarta, Surabaya, atau Medan. Menyaring baris sebelum ditampilkan. Yang tidak lolos tidak ikut. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "belanja-di-antara": {
    "hints": [
      "Menyaring rentang yang mencakup kedua batas. Konteksnya: Kasir TokoKulwon merapikan pelanggan dengan belanja sedang.",
      "Bentuk query: Kolom hasilnya nama, total_belanja. Sumber utamanya tabel pelanggan. Saringan membuang baris sebelum ringkasan atau urutan.",
      "Tampilkan nama dan total belanja pelanggan yang total belanjanya dari 150000 sampai 300000, termasuk kedua batas. Kedua batas rentang ikut, jangan digeser keluar dari batas."
    ],
    "sql": "SELECT nama, total_belanja\nFROM pelanggan\nWHERE total_belanja BETWEEN 150000 AND 300000;",
    "why": "Kenapa ini benar: Tampilkan nama dan total belanja pelanggan yang total belanjanya dari 150000 sampai 300000, termasuk kedua batas. Menyaring rentang yang mencakup kedua batas. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "nama-berawalan-de": {
    "hints": [
      "Mencocokkan pola teks. Tanda persen berarti sisa teks apa saja, dan letaknya membedakan awalan dari akhiran. Konteksnya: TokoKulwon mencari pelanggan yang namanya diawali De.",
      "Bentuk query: Kolom hasilnya nama. Sumber utamanya tabel pelanggan. Saringan membuang baris sebelum ringkasan atau urutan.",
      "Tampilkan nama pelanggan yang namanya diawali De. Pola diawali De. Akhiran tidak sama dengan awalan."
    ],
    "sql": "SELECT nama\nFROM pelanggan\nWHERE nama LIKE 'De%';",
    "why": "Kenapa ini benar: Tampilkan nama pelanggan yang namanya diawali De. Mencocokkan pola teks. Tanda persen berarti sisa teks apa saja, dan letaknya membedakan awalan dari akhiran. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "belanja-dari-yang-terbesar": {
    "hints": [
      "Menyusun urutan baris. Tanpa urutan, posisi baris tidak dijamin. Konteksnya: Pemilik TokoKulwon ingin melihat pelanggan dari yang paling banyak belanja.",
      "Bentuk query: Kolom hasilnya nama, total_belanja. Sumber utamanya tabel pelanggan. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama dan total belanja semua pelanggan. Urutkan dari total belanja yang paling besar. Jika total belanja sama, urutkan nama dari A ke Z. Arah dari besar ke kecil harus sesuai soal. Membalik arah mengubah siapa yang di atas."
    ],
    "sql": "SELECT nama, total_belanja\nFROM pelanggan\nORDER BY total_belanja DESC, nama ASC;",
    "why": "Kenapa ini benar: Tampilkan nama dan total belanja semua pelanggan. Urutkan dari total belanja yang paling besar. Jika total belanja sama, urutkan nama dari A ke Z. Menyusun urutan baris. Tanpa urutan, posisi baris tidak dijamin. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "dua-pelanggan-pertama": {
    "hints": [
      "Mengurutkan dulu, baru memotong sejumlah baris dari atas. Konteksnya: Buku tamu TokoKulwon dibuka dari pelanggan yang paling awal tercatat.",
      "Bentuk query: Kolom hasilnya id, nama. Sumber utamanya tabel pelanggan. Urutan menentukan posisi baris hasil. Potongan jumlah baris dipakai setelah urutan selesai.",
      "Tampilkan id dan nama dua pelanggan terawal. Urutkan id dari yang paling kecil, lalu ambil dua baris saja. Potong 2 baris hanya setelah urutan selesai."
    ],
    "sql": "SELECT id, nama\nFROM pelanggan\nORDER BY id ASC\nLIMIT 2;",
    "why": "Kenapa ini benar: Tampilkan id dan nama dua pelanggan terawal. Urutkan id dari yang paling kecil, lalu ambil dua baris saja. Mengurutkan dulu, baru memotong sejumlah baris dari atas. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "nama-sebagai-pelanggan": {
    "hints": [
      "Memilih kolom dan memberi nama pada hasilnya. Konteksnya: Daftar nama untuk papan toko butuh judul kolom yang berbeda.",
      "Bentuk query: Kolom hasilnya nama AS pelanggan. Sumber utamanya tabel pelanggan.",
      "Tampilkan nama setiap pelanggan. Judul kolom pada hasilnya pelanggan, bukan nama."
    ],
    "sql": "SELECT nama AS pelanggan\nFROM pelanggan;",
    "why": "Kenapa ini benar: Tampilkan nama setiap pelanggan. Judul kolom pada hasilnya pelanggan, bukan nama. Memilih kolom dan memberi nama pada hasilnya. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "jumlah-pelanggan-tercatat": {
    "hints": [
      "Merangkum seluruh tabel menjadi satu angka. Konteksnya: Pemilik TokoKulwon ingin tahu berapa pelanggan yang sudah tercatat.",
      "Bentuk query: Kolom hasilnya COUNT(*) AS jumlah. Sumber utamanya tabel pelanggan.",
      "Tampilkan satu kolom bernama jumlah dengan satu angka: banyaknya baris pelanggan."
    ],
    "sql": "SELECT COUNT(*) AS jumlah\nFROM pelanggan;",
    "why": "Kenapa ini benar: Tampilkan satu kolom bernama jumlah dengan satu angka: banyaknya baris pelanggan. Merangkum seluruh tabel menjadi satu angka. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "jumlah-seluruh-belanja": {
    "hints": [
      "Merangkum seluruh tabel menjadi satu angka. Konteksnya: Akhir hari, TokoKulwon menjumlahkan seluruh belanja pelanggan yang tercatat.",
      "Bentuk query: Kolom hasilnya SUM(total_belanja) AS jumlah. Sumber utamanya tabel pelanggan.",
      "Tampilkan satu kolom bernama jumlah dengan satu angka: jumlah seluruh total belanja."
    ],
    "sql": "SELECT SUM(total_belanja) AS jumlah\nFROM pelanggan;",
    "why": "Kenapa ini benar: Tampilkan satu kolom bernama jumlah dengan satu angka: jumlah seluruh total belanja. Merangkum seluruh tabel menjadi satu angka. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "belanja-paling-kecil": {
    "hints": [
      "Merangkum seluruh tabel menjadi satu angka. Konteksnya: TokoKulwon ingin melihat belanja pelanggan yang paling kecil.",
      "Bentuk query: Kolom hasilnya MIN(total_belanja) AS terkecil. Sumber utamanya tabel pelanggan.",
      "Tampilkan satu kolom bernama terkecil dengan satu angka: total belanja paling kecil."
    ],
    "sql": "SELECT MIN(total_belanja) AS terkecil\nFROM pelanggan;",
    "why": "Kenapa ini benar: Tampilkan satu kolom bernama terkecil dengan satu angka: total belanja paling kecil. Merangkum seluruh tabel menjadi satu angka. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "belanja-paling-besar": {
    "hints": [
      "Merangkum seluruh tabel menjadi satu angka. Konteksnya: TokoKulwon ingin melihat belanja pelanggan yang paling besar.",
      "Bentuk query: Kolom hasilnya MAX(total_belanja) AS terbesar. Sumber utamanya tabel pelanggan.",
      "Tampilkan satu kolom bernama terbesar dengan satu angka: total belanja paling besar."
    ],
    "sql": "SELECT MAX(total_belanja) AS terbesar\nFROM pelanggan;",
    "why": "Kenapa ini benar: Tampilkan satu kolom bernama terbesar dengan satu angka: total belanja paling besar. Merangkum seluruh tabel menjadi satu angka. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "pesanan-dan-nama-pelanggan": {
    "hints": [
      "Menggabungkan dua tabel hanya pada baris yang kuncinya cocok. Konteksnya: Setiap pesanan TokoKulwon perlu nama pelanggannya.",
      "Bentuk query: Kolom hasilnya pesanan.id, pelanggan.nama. Sumber utamanya tabel pesanan. Gabungkan tabel pada kunci yang cocok. Baris tanpa pasangan tidak ikut.",
      "Tampilkan nomor pesanan dan nama pelanggan untuk pesanan yang pelanggannya ada di daftar pelanggan."
    ],
    "sql": "SELECT pesanan.id, pelanggan.nama\nFROM pesanan\nJOIN pelanggan ON pelanggan.id = pesanan.pelanggan_id;",
    "why": "Kenapa ini benar: Tampilkan nomor pesanan dan nama pelanggan untuk pesanan yang pelanggannya ada di daftar pelanggan. Menggabungkan dua tabel hanya pada baris yang kuncinya cocok. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "produk-yang-ikut-terjual": {
    "hints": [
      "Menggabungkan dua tabel hanya pada baris yang kuncinya cocok. Konteksnya: Gudang TokoKulwon ingin tahu produk mana yang muncul pada baris pesanan.",
      "Bentuk query: Kolom hasilnya produk.nama. Sumber utamanya tabel baris_pesanan. Gabungkan tabel pada kunci yang cocok. Baris tanpa pasangan tidak ikut.",
      "Tampilkan nama produk yang tercatat pada baris pesanan. Abaikan baris yang produknya tidak ada di daftar produk."
    ],
    "sql": "SELECT produk.nama\nFROM baris_pesanan\nJOIN produk ON produk.id = baris_pesanan.produk_id;",
    "why": "Kenapa ini benar: Tampilkan nama produk yang tercatat pada baris pesanan. Abaikan baris yang produknya tidak ada di daftar produk. Menggabungkan dua tabel hanya pada baris yang kuncinya cocok. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "harga-di-bawah-dua-puluh-ribu": {
    "hints": [
      "Menyaring baris sebelum ditampilkan. Yang tidak lolos tidak ikut. Konteksnya: Etalase receh TokoKulwon hanya memuat barang di bawah Rp20.000.",
      "Bentuk query: Kolom hasilnya nama, harga. Sumber utamanya tabel produk. Saringan membuang baris sebelum ringkasan atau urutan.",
      "Tampilkan nama dan harga produk yang harganya di bawah 20000."
    ],
    "sql": "SELECT nama, harga\nFROM produk\nWHERE harga < 20000;",
    "why": "Kenapa ini benar: Tampilkan nama dan harga produk yang harganya di bawah 20000. Menyaring baris sebelum ditampilkan. Yang tidak lolos tidak ikut. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "pelanggan-bukan-dari-medan": {
    "hints": [
      "Menyaring baris sebelum ditampilkan. Yang tidak lolos tidak ikut. Konteksnya: Kurir Medan sedang libur.",
      "Bentuk query: Kolom hasilnya nama, kota. Sumber utamanya tabel pelanggan. Saringan membuang baris sebelum ringkasan atau urutan.",
      "Tampilkan nama dan kota pelanggan yang kotanya bukan Medan."
    ],
    "sql": "SELECT nama, kota\nFROM pelanggan\nWHERE kota <> 'Medan';",
    "why": "Kenapa ini benar: Tampilkan nama dan kota pelanggan yang kotanya bukan Medan. Menyaring baris sebelum ditampilkan. Yang tidak lolos tidak ikut. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "urut-berdasarkan-kota": {
    "hints": [
      "Menyusun urutan baris. Tanpa urutan, posisi baris tidak dijamin. Konteksnya: Daftar pelanggan TokoKulwon akan ditempel menurut kota.",
      "Bentuk query: Kolom hasilnya nama, kota. Sumber utamanya tabel pelanggan. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama dan kota semua pelanggan. Urutkan menurut kota dari A ke Z. Jika kota sama, urutkan nama dari A ke Z. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT nama, kota\nFROM pelanggan\nORDER BY kota ASC, nama ASC;",
    "why": "Kenapa ini benar: Tampilkan nama dan kota semua pelanggan. Urutkan menurut kota dari A ke Z. Jika kota sama, urutkan nama dari A ke Z. Menyusun urutan baris. Tanpa urutan, posisi baris tidak dijamin. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "nama-berakhiran-wati": {
    "hints": [
      "Mencocokkan pola teks. Tanda persen berarti sisa teks apa saja, dan letaknya membedakan awalan dari akhiran. Konteksnya: TokoKulwon mencari pelanggan yang namanya diakhiri Wati.",
      "Bentuk query: Kolom hasilnya nama. Sumber utamanya tabel pelanggan. Saringan membuang baris sebelum ringkasan atau urutan.",
      "Tampilkan nama pelanggan yang namanya diakhiri Wati. Pola diakhiri Wati. Awalan tidak sama dengan akhiran."
    ],
    "sql": "SELECT nama\nFROM pelanggan\nWHERE nama LIKE '%Wati';",
    "why": "Kenapa ini benar: Tampilkan nama pelanggan yang namanya diakhiri Wati. Mencocokkan pola teks. Tanda persen berarti sisa teks apa saja, dan letaknya membedakan awalan dari akhiran. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "tiga-produk-termurah": {
    "hints": [
      "Mengurutkan dulu, baru memotong sejumlah baris dari atas. Konteksnya: TokoKulwon ingin tiga barang dengan harga paling murah.",
      "Bentuk query: Kolom hasilnya nama, harga. Sumber utamanya tabel produk. Saringan membuang baris sebelum ringkasan atau urutan. Urutan menentukan posisi baris hasil. Potongan jumlah baris dipakai setelah urutan selesai.",
      "Tampilkan nama dan harga tiga produk berharga paling kecil. Urutkan dari harga paling kecil. Jika harga sama, urutkan nama dari A ke Z. Potong 3 baris hanya setelah urutan selesai."
    ],
    "sql": "SELECT nama, harga\nFROM produk\nWHERE harga > 0\nORDER BY harga ASC, nama ASC\nLIMIT 3;",
    "why": "Kenapa ini benar: Tampilkan nama dan harga tiga produk berharga paling kecil. Urutkan dari harga paling kecil. Jika harga sama, urutkan nama dari A ke Z. Mengurutkan dulu, baru memotong sejumlah baris dari atas. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "daftar-pesanan": {
    "hints": [
      "Memilih kolom yang diminta dari satu tabel. Konteksnya: Di meja kasir ada daftar pesanan TokoKulwon.",
      "Bentuk query: Kolom hasilnya id, total. Sumber utamanya tabel pesanan.",
      "Tampilkan nomor dan total setiap pesanan."
    ],
    "sql": "SELECT id, total\nFROM pesanan;",
    "why": "Kenapa ini benar: Tampilkan nomor dan total setiap pesanan. Memilih kolom yang diminta dari satu tabel. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "nama-dan-harga-produk": {
    "hints": [
      "Memilih kolom yang diminta dari satu tabel. Konteksnya: Label rak TokoKulwon butuh nama barang dan harganya, termasuk yang belum diisi.",
      "Bentuk query: Kolom hasilnya nama, harga. Sumber utamanya tabel produk.",
      "Tampilkan nama dan harga setiap produk."
    ],
    "sql": "SELECT nama, harga\nFROM produk;",
    "why": "Kenapa ini benar: Tampilkan nama dan harga setiap produk. Memilih kolom yang diminta dari satu tabel. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "pelanggan-bandung-atau-surabaya": {
    "hints": [
      "Menyaring baris sebelum ditampilkan. Yang tidak lolos tidak ikut. Konteksnya: Pengiriman besok hanya ke Bandung dan Surabaya.",
      "Bentuk query: Kolom hasilnya nama, kota. Sumber utamanya tabel pelanggan. Saringan membuang baris sebelum ringkasan atau urutan.",
      "Tampilkan nama dan kota pelanggan dari Bandung atau dari Surabaya."
    ],
    "sql": "SELECT nama, kota\nFROM pelanggan\nWHERE kota = 'Bandung' OR kota = 'Surabaya';",
    "why": "Kenapa ini benar: Tampilkan nama dan kota pelanggan dari Bandung atau dari Surabaya. Menyaring baris sebelum ditampilkan. Yang tidak lolos tidak ikut. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "harga-antara-dua-batas": {
    "hints": [
      "Menyaring baris sebelum ditampilkan. Yang tidak lolos tidak ikut. Konteksnya: TokoKulwon menyiapkan rak barang dengan harga di tengah, bukan yang paling murah atau paling mahal.",
      "Bentuk query: Kolom hasilnya nama, harga. Sumber utamanya tabel produk. Saringan membuang baris sebelum ringkasan atau urutan.",
      "Tampilkan nama dan harga produk yang harganya paling kecil 15000 dan paling besar 25000."
    ],
    "sql": "SELECT nama, harga\nFROM produk\nWHERE harga >= 15000 AND harga <= 25000;",
    "why": "Kenapa ini benar: Tampilkan nama dan harga produk yang harganya paling kecil 15000 dan paling besar 25000. Menyaring baris sebelum ditampilkan. Yang tidak lolos tidak ikut. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "urut-id-dari-belakang": {
    "hints": [
      "Menyusun urutan baris. Tanpa urutan, posisi baris tidak dijamin. Konteksnya: Buku pelanggan TokoKulwon dibaca dari catatan yang paling baru.",
      "Bentuk query: Kolom hasilnya id, nama. Sumber utamanya tabel pelanggan. Urutan menentukan posisi baris hasil.",
      "Tampilkan id dan nama semua pelanggan. Urutkan id dari yang paling besar. Arah dari besar ke kecil harus sesuai soal. Membalik arah mengubah siapa yang di atas."
    ],
    "sql": "SELECT id, nama\nFROM pelanggan\nORDER BY id DESC;",
    "why": "Kenapa ini benar: Tampilkan id dan nama semua pelanggan. Urutkan id dari yang paling besar. Menyusun urutan baris. Tanpa urutan, posisi baris tidak dijamin. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "alias-tabel-pelanggan": {
    "hints": [
      "Konsepnya nama singkat untuk tabel, bukan nama baru untuk kolom hasil. id, nama, dan kota tetap memakai nama aslinya.",
      "Bentuk query: Kolom hasilnya p.id, p.nama, p.kota. Sumber utamanya tabel pelanggan.",
      "Beri tabel pelanggan nama singkat p. Tampilkan id, nama, dan kota lewat nama singkat itu."
    ],
    "sql": "SELECT p.id, p.nama, p.kota\nFROM pelanggan AS p;",
    "why": "Kenapa ini benar: tabel pelanggan diberi nama singkat p, lalu id, nama, dan kota dibaca lewat nama itu. Nama kolom hasil tidak diganti. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "hitung-produk-berharga": {
    "hints": [
      "Menghitung isi kolom harga. Yang kosong tidak terhitung, berbeda dari menghitung seluruh baris. Konteksnya: TokoKulwon ingin tahu berapa produk yang sudah punya harga.",
      "Bentuk query: Kolom hasilnya COUNT(harga) AS jumlah. Sumber utamanya tabel produk.",
      "Tampilkan satu kolom bernama jumlah dengan satu angka: banyaknya produk yang harganya terisi. Hitung kolom harga, bukan seluruh baris, supaya yang kosong tidak terhitung."
    ],
    "sql": "SELECT COUNT(harga) AS jumlah\nFROM produk;",
    "why": "Kenapa ini benar: Tampilkan satu kolom bernama jumlah dengan satu angka: banyaknya produk yang harganya terisi. Menghitung isi kolom harga. Yang kosong tidak terhitung, berbeda dari menghitung seluruh baris. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "gabung-pelanggan-satu-kota": {
    "hints": [
      "Menggabungkan dua tabel hanya pada baris yang kuncinya cocok. Konteksnya: TokoKulwon ingin daftar pesanan milik pelanggan dari Yogyakarta saja.",
      "Bentuk query: Kolom hasilnya pesanan.id, pelanggan.nama, pesanan.total. Sumber utamanya tabel pesanan. Gabungkan tabel pada kunci yang cocok. Baris tanpa pasangan tidak ikut. Saringan membuang baris sebelum ringkasan atau urutan. Urutan menentukan posisi baris hasil.",
      "Tampilkan nomor pesanan, nama pelanggan, dan total pesanan untuk pelanggan dari Yogyakarta. Urutkan nomor pesanan dari yang paling kecil. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT pesanan.id, pelanggan.nama, pesanan.total\nFROM pesanan\nJOIN pelanggan ON pelanggan.id = pesanan.pelanggan_id\nWHERE pelanggan.kota = 'Yogyakarta'\nORDER BY pesanan.id ASC;",
    "why": "Kenapa ini benar: Tampilkan nomor pesanan, nama pelanggan, dan total pesanan untuk pelanggan dari Yogyakarta. Urutkan nomor pesanan dari yang paling kecil. Menggabungkan dua tabel hanya pada baris yang kuncinya cocok. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "pelanggan-vip-dari-surabaya": {
    "hints": [
      "Konsepnya menyaring baris dengan membandingkan ke satu angka yang dihitung dari seluruh tabel, yaitu rata-rata belanja.",
      "Bentuknya: nama, kota, dan total belanja dari pelanggan. Saring kota Surabaya, dan belanja yang lebih besar dari rata-rata seluruh pelanggan.",
      "Rata-rata dihitung dari semua pelanggan, bukan hanya Surabaya. Yang tepat sama dengan rata-rata tidak ikut. Jangan mengganti lebih besar menjadi lebih besar atau sama."
    ],
    "sql": "SELECT nama, kota, total_belanja\nFROM pelanggan\nWHERE kota = 'Surabaya'\n  AND total_belanja > (SELECT AVG(total_belanja) FROM pelanggan);",
    "why": "Soal minta pelanggan Surabaya yang belanjanya di atas rata-rata seluruh pelanggan. Kota membatasi siapa yang tampil, dan perbandingan yang ketat membuat yang tepat sama dengan rata-rata tidak ikut. Kolom yang diminta adalah nama, kota, dan total belanja."
  },
  "daftar-produk-termahal": {
    "hints": [
      "Menyusun urutan baris. Tanpa urutan, posisi baris tidak dijamin. Konteksnya: Pemilik TokoKulwon ingin melihat barang dari yang paling mahal.",
      "Bentuk query: Kolom hasilnya nama, harga. Sumber utamanya tabel produk. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama dan harga. Nilai kosong diletakkan paling bawah pada urutan itu. Arah dari besar ke kecil harus sesuai soal. Membalik arah mengubah siapa yang di atas."
    ],
    "sql": "SELECT nama, harga\nFROM produk\nORDER BY harga DESC NULLS LAST, nama ASC;",
    "why": "Kenapa ini benar: Tampilkan nama dan harga. Menyusun urutan baris. Tanpa urutan, posisi baris tidak dijamin. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "total-belanja-per-kota": {
    "hints": [
      "Merangkum banyak baris menjadi satu baris per kelompok. Konteksnya: Akhir pekan, TokoKulwon merangkum omzet pelanggan per kota.",
      "Bentuk query: Kolom hasilnya kota, SUM(total_belanja) AS total. Sumber utamanya tabel pelanggan. Kelompokkan supaya satu kelompok menjadi satu baris. Urutan menentukan posisi baris hasil.",
      "Tampilkan kota dan kolom total berisi jumlah belanja. Urutkan menurut nama kota dari A ke Z. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT kota, SUM(total_belanja) AS total\nFROM pelanggan\nGROUP BY kota\nORDER BY kota;",
    "why": "Kenapa ini benar: Tampilkan kota dan kolom total berisi jumlah belanja. Urutkan menurut nama kota dari A ke Z. Merangkum banyak baris menjadi satu baris per kelompok. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "produk-tanpa-harga": {
    "hints": [
      "Kosong di SQL bukan sama dengan nol. Yang dicari adalah nilai yang memang tidak terisi. Konteksnya: Ada barang di rak TokoKulwon yang harganya belum tercatat.",
      "Bentuk query: Kolom hasilnya nama. Sumber utamanya tabel produk. Saringan membuang baris sebelum ringkasan atau urutan.",
      "Tampilkan nama produk yang harganya kosong. Kosong artinya nilai yang tidak terisi, bukan angka nol."
    ],
    "sql": "SELECT nama\nFROM produk\nWHERE harga IS NULL;",
    "why": "Kenapa ini benar: Tampilkan nama produk yang harganya kosong. Kosong di SQL bukan sama dengan nol. Yang dicari adalah nilai yang memang tidak terisi. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "kota-minimal-dua-pelanggan": {
    "hints": [
      "Mengelompokkan baris dulu, lalu menyaring kelompoknya, bukan menyaring baris satu per satu. Konteksnya: TokoKulwon ingin kota yang sudah punya sedikitnya dua pelanggan.",
      "Bentuk query: Kolom hasilnya kota, COUNT(*) AS jumlah. Sumber utamanya tabel pelanggan. Kelompokkan supaya satu kelompok menjadi satu baris. Ambang jumlah diletakkan setelah ringkasan, bukan pada baris mentah. Urutan menentukan posisi baris hasil.",
      "Tampilkan kota dan kolom jumlah berisi banyaknya pelanggan. Urutkan menurut nama kota dari A ke Z. Syarat jumlah berlaku pada kelompok, bukan pada tiap baris sebelum diringkas."
    ],
    "sql": "SELECT kota, COUNT(*) AS jumlah\nFROM pelanggan\nGROUP BY kota\nHAVING COUNT(*) >= 2\nORDER BY kota;",
    "why": "Kenapa ini benar: Tampilkan kota dan kolom jumlah berisi banyaknya pelanggan. Urutkan menurut nama kota dari A ke Z. Mengelompokkan baris dulu, lalu menyaring kelompoknya, bukan menyaring baris satu per satu. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "omzet-kota-ambang": {
    "hints": [
      "Mengelompokkan baris dulu, lalu menyaring kelompoknya, bukan menyaring baris satu per satu. Konteksnya: TokoKulwon menandai kota yang jumlah belanja pelanggannya mencapai 300000.",
      "Bentuk query: Kolom hasilnya kota, SUM(total_belanja) AS omzet. Sumber utamanya tabel pelanggan. Kelompokkan supaya satu kelompok menjadi satu baris. Ambang jumlah diletakkan setelah ringkasan, bukan pada baris mentah. Urutan menentukan posisi baris hasil.",
      "Tampilkan kota dan kolom omzet berisi jumlah belanja. Urutkan menurut nama kota dari A ke Z. Syarat jumlah berlaku pada kelompok, bukan pada tiap baris sebelum diringkas."
    ],
    "sql": "SELECT kota, SUM(total_belanja) AS omzet\nFROM pelanggan\nGROUP BY kota\nHAVING SUM(total_belanja) >= 300000\nORDER BY kota;",
    "why": "Kenapa ini benar: Tampilkan kota dan kolom omzet berisi jumlah belanja. Urutkan menurut nama kota dari A ke Z. Mengelompokkan baris dulu, lalu menyaring kelompoknya, bukan menyaring baris satu per satu. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "kota-tepat-dua-pelanggan": {
    "hints": [
      "Mengelompokkan baris dulu, lalu menyaring kelompoknya, bukan menyaring baris satu per satu. Konteksnya: Cabang TokoKulwon ingin kota yang pelanggannya tepat dua orang.",
      "Bentuk query: Kolom hasilnya kota, COUNT(*) AS jumlah. Sumber utamanya tabel pelanggan. Kelompokkan supaya satu kelompok menjadi satu baris. Ambang jumlah diletakkan setelah ringkasan, bukan pada baris mentah. Urutan menentukan posisi baris hasil.",
      "Tampilkan kota dan kolom jumlah. Urutkan menurut nama kota dari A ke Z. Syarat jumlah berlaku pada kelompok, bukan pada tiap baris sebelum diringkas."
    ],
    "sql": "SELECT kota, COUNT(*) AS jumlah\nFROM pelanggan\nGROUP BY kota\nHAVING COUNT(*) = 2\nORDER BY kota;",
    "why": "Kenapa ini benar: Tampilkan kota dan kolom jumlah. Urutkan menurut nama kota dari A ke Z. Mengelompokkan baris dulu, lalu menyaring kelompoknya, bukan menyaring baris satu per satu. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "rata-rata-belanja-tiap-kota": {
    "hints": [
      "Merangkum banyak baris menjadi satu baris per kelompok. Konteksnya: Tiap kota punya rata-rata belanja pelanggan sendiri.",
      "Bentuk query: Kolom hasilnya kota, AVG(total_belanja) AS rata_rata. Sumber utamanya tabel pelanggan. Kelompokkan supaya satu kelompok menjadi satu baris. Urutan menentukan posisi baris hasil.",
      "Tampilkan kota dan kolom rata_rata. Urutkan menurut nama kota dari A ke Z. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT kota, AVG(total_belanja) AS rata_rata\nFROM pelanggan\nGROUP BY kota\nORDER BY kota;",
    "why": "Kenapa ini benar: Tampilkan kota dan kolom rata_rata. Urutkan menurut nama kota dari A ke Z. Merangkum banyak baris menjadi satu baris per kelompok. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "rentang-belanja-tiap-kota": {
    "hints": [
      "Merangkum banyak baris menjadi satu baris per kelompok. Konteksnya: TokoKulwon ingin belanja terkecil dan terbesar di tiap kota.",
      "Bentuk query: Kolom hasilnya kota, MIN(total_belanja) AS terkecil, MAX(total_belanja) AS terbesar. Sumber utamanya tabel pelanggan. Kelompokkan supaya satu kelompok menjadi satu baris. Urutan menentukan posisi baris hasil.",
      "Tampilkan kota, kolom terkecil, dan kolom terbesar. Urutkan menurut nama kota dari A ke Z. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT kota, MIN(total_belanja) AS terkecil, MAX(total_belanja) AS terbesar\nFROM pelanggan\nGROUP BY kota\nORDER BY kota;",
    "why": "Kenapa ini benar: Tampilkan kota, kolom terkecil, dan kolom terbesar. Urutkan menurut nama kota dari A ke Z. Merangkum banyak baris menjadi satu baris per kelompok. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "pesanan-tiap-pelanggan": {
    "hints": [
      "Menggabungkan tabel, lalu merangkum jadi satu baris per kelompok. Konteksnya: TokoKulwon menghitung berapa kali tiap pelanggan memesan.",
      "Bentuk query: Kolom hasilnya pelanggan.nama, COUNT(*) AS jumlah_pesanan. Sumber utamanya tabel pelanggan. Gabungkan tabel pada kunci yang cocok. Baris tanpa pasangan tidak ikut. Kelompokkan supaya satu kelompok menjadi satu baris. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama dan kolom jumlah_pesanan. Urutkan menurut nama dari A ke Z. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT pelanggan.nama, COUNT(*) AS jumlah_pesanan\nFROM pelanggan\nJOIN pesanan ON pesanan.pelanggan_id = pelanggan.id\nGROUP BY pelanggan.nama\nORDER BY pelanggan.nama;",
    "why": "Kenapa ini benar: Tampilkan nama dan kolom jumlah_pesanan. Urutkan menurut nama dari A ke Z. Menggabungkan tabel, lalu merangkum jadi satu baris per kelompok. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "berapa-kota-tercatat": {
    "hints": [
      "Menghitung nilai yang berbeda, bukan banyaknya baris. Konteksnya: Berapa kota yang benar-benar tercatat di buku pelanggan TokoKulwon? Kota yang sama dihitung sekali.",
      "Bentuk query: Kolom hasilnya COUNT(DISTINCT kota) AS jumlah_kota. Sumber utamanya tabel pelanggan.",
      "Tampilkan satu kolom jumlah_kota dengan satu angka."
    ],
    "sql": "SELECT COUNT(DISTINCT kota) AS jumlah_kota\nFROM pelanggan;",
    "why": "Kenapa ini benar: Tampilkan satu kolom jumlah_kota dengan satu angka. Menghitung nilai yang berbeda, bukan banyaknya baris. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "nama-pelanggan-yang-berulang": {
    "hints": [
      "Mengelompokkan baris dulu, lalu menyaring kelompoknya, bukan menyaring baris satu per satu. Konteksnya: Ada nama pelanggan yang tertulis lebih dari sekali.",
      "Bentuk query: Kolom hasilnya nama, COUNT(*) AS jumlah. Sumber utamanya tabel pelanggan. Kelompokkan supaya satu kelompok menjadi satu baris. Ambang jumlah diletakkan setelah ringkasan, bukan pada baris mentah. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama dan kolom jumlah. Urutkan menurut nama dari A ke Z. Syarat jumlah berlaku pada kelompok, bukan pada tiap baris sebelum diringkas."
    ],
    "sql": "SELECT nama, COUNT(*) AS jumlah\nFROM pelanggan\nGROUP BY nama\nHAVING COUNT(*) > 1\nORDER BY nama;",
    "why": "Kenapa ini benar: Tampilkan nama dan kolom jumlah. Urutkan menurut nama dari A ke Z. Mengelompokkan baris dulu, lalu menyaring kelompoknya, bukan menyaring baris satu per satu. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "lebih-mahal-dari-yang-termurah": {
    "hints": [
      "Membandingkan tiap baris dengan hasil hitungan atau daftar di dalam query. Konteksnya: TokoKulwon ingin barang yang lebih mahal daripada barang termurah.",
      "Bentuk query: Kolom hasilnya nama, harga. Sumber utamanya tabel produk. Saringan membuang baris sebelum ringkasan atau urutan.",
      "Tampilkan nama dan harga."
    ],
    "sql": "SELECT nama, harga\nFROM produk\nWHERE harga > (SELECT MIN(harga) FROM produk);",
    "why": "Kenapa ini benar: Tampilkan nama dan harga. Membandingkan tiap baris dengan hasil hitungan atau daftar di dalam query. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "produk-paling-mahal": {
    "hints": [
      "Membandingkan tiap baris dengan hasil hitungan atau daftar di dalam query. Konteksnya: Beberapa barang bisa sama-sama paling mahal.",
      "Bentuk query: Kolom hasilnya nama, harga. Sumber utamanya tabel produk. Saringan membuang baris sebelum ringkasan atau urutan. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama dan harga barang yang harganya sama dengan harga tertinggi. Urutkan menurut nama dari A ke Z. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT nama, harga\nFROM produk\nWHERE harga = (SELECT MAX(harga) FROM produk)\nORDER BY nama;",
    "why": "Kenapa ini benar: Tampilkan nama dan harga barang yang harganya sama dengan harga tertinggi. Urutkan menurut nama dari A ke Z. Membandingkan tiap baris dengan hasil hitungan atau daftar di dalam query. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "barang-tak-terjual": {
    "hints": [
      "Menyisakan baris yang tidak punya pasangan di tabel lain. Konteksnya: TokoKulwon mencari barang yang belum pernah terjual.",
      "Bentuk query: Kolom hasilnya nama. Sumber utamanya tabel produk. Saringan membuang baris sebelum ringkasan atau urutan.",
      "Tampilkan nama barang yang tidak punya penjualan. Yang lolos adalah yang tidak menemukan pasangan."
    ],
    "sql": "SELECT nama\nFROM produk\nWHERE NOT EXISTS (\n  SELECT 1\n  FROM penjualan\n  WHERE penjualan.produk_id = produk.id\n);",
    "why": "Kenapa ini benar: Tampilkan nama barang yang tidak punya penjualan. Menyisakan baris yang tidak punya pasangan di tabel lain. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "pelanggan-yang-sudah-memesan": {
    "hints": [
      "Menggabungkan tabel, lalu merangkum jadi satu baris per kelompok. Konteksnya: Tampilkan pelanggan TokoKulwon yang sudah punya pesanan.",
      "Bentuk query: Kolom hasilnya pelanggan.nama. Sumber utamanya tabel pelanggan. Gabungkan tabel pada kunci yang cocok. Baris tanpa pasangan tidak ikut. Kelompokkan supaya satu kelompok menjadi satu baris. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama. Urutkan menurut nama dari A ke Z. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT pelanggan.nama\nFROM pelanggan\nJOIN pesanan ON pesanan.pelanggan_id = pelanggan.id\nGROUP BY pelanggan.nama\nORDER BY pelanggan.nama;",
    "why": "Kenapa ini benar: Tampilkan nama. Urutkan menurut nama dari A ke Z. Menggabungkan tabel, lalu merangkum jadi satu baris per kelompok. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "pelanggan-yang-belum-memesan": {
    "hints": [
      "Menyisakan baris yang tidak punya pasangan di tabel lain. Konteksnya: TokoKulwon ingin pelanggan yang belum pernah memesan.",
      "Bentuk query: Kolom hasilnya nama. Sumber utamanya tabel pelanggan. Saringan membuang baris sebelum ringkasan atau urutan. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama. Urutkan menurut nama dari A ke Z. Yang lolos adalah yang tidak menemukan pasangan."
    ],
    "sql": "SELECT nama\nFROM pelanggan\nWHERE NOT EXISTS (\n  SELECT 1 FROM pesanan WHERE pesanan.pelanggan_id = pelanggan.id\n)\nORDER BY nama;",
    "why": "Kenapa ini benar: Tampilkan nama. Urutkan menurut nama dari A ke Z. Menyisakan baris yang tidak punya pasangan di tabel lain. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "pelanggan-di-kota-gudang": {
    "hints": [
      "Membandingkan tiap baris dengan hasil hitungan atau daftar di dalam query. Konteksnya: TokoKulwon hanya mengantar ke kota yang punya gudang.",
      "Bentuk query: Kolom hasilnya nama, kota. Sumber utamanya tabel pelanggan. Saringan membuang baris sebelum ringkasan atau urutan. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama dan kota pelanggan yang kotanya ada di daftar gudang. Urutkan menurut nama dari A ke Z. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT nama, kota\nFROM pelanggan\nWHERE kota IN (SELECT kota FROM gudang)\nORDER BY nama;",
    "why": "Kenapa ini benar: Tampilkan nama dan kota pelanggan yang kotanya ada di daftar gudang. Urutkan menurut nama dari A ke Z. Membandingkan tiap baris dengan hasil hitungan atau daftar di dalam query. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "omzet-kota-lewat-ringkasan": {
    "hints": [
      "Menyusun langkah terpisah dulu, baru mengambil hasil langkah itu. Konteksnya: Ringkas dulu belanja per kota, lalu simpan kota yang omzetnya mencapai 300000.",
      "Bentuk query: Langkah awal menjumlahkan belanja per kota. Query utama baru menyaring omzet yang sudah diringkas, lalu mengurutkan kota.",
      "Tampilkan kota dan kolom omzet. Urutkan menurut nama kota dari A ke Z. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "WITH ringkasan AS (\n  SELECT kota, SUM(total_belanja) AS omzet\n  FROM pelanggan\n  GROUP BY kota\n)\nSELECT kota, omzet\nFROM ringkasan\nWHERE omzet >= 300000\nORDER BY kota;",
    "why": "Kenapa ini benar: Tampilkan kota dan kolom omzet. Urutkan menurut nama kota dari A ke Z. Menyusun langkah terpisah dulu, baru mengambil hasil langkah itu. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "pelanggan-medan-lewat-daftar": {
    "hints": [
      "Menyusun langkah terpisah dulu, baru mengambil hasil langkah itu. Konteksnya: Tim Medan butuh nama pelanggan di kotanya saja.",
      "Bentuk query: Ada langkah awal yang dihitung dulu, lalu dibaca oleh query utama. Saringan membuang baris sebelum ringkasan atau urutan. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama pelanggan dari Medan. Urutkan menurut nama dari A ke Z. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "WITH daftar AS (\n  SELECT nama\n  FROM pelanggan\n  WHERE kota = 'Medan'\n)\nSELECT nama\nFROM daftar\nORDER BY nama;",
    "why": "Kenapa ini benar: Tampilkan nama pelanggan dari Medan. Urutkan menurut nama dari A ke Z. Menyusun langkah terpisah dulu, baru mengambil hasil langkah itu. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "label-harga-barang": {
    "hints": [
      "Memberi label lewat percabangan, bukan lewat saringan yang membuang baris. Konteksnya: Beri label harga barang TokoKulwon.",
      "Bentuk query: Sumber utamanya tabel produk. Urutan menentukan posisi baris hasil. Percabangan memberi label tanpa membuang baris.",
      "Tampilkan nama dan kolom label. Urutkan menurut nama dari A ke Z. Kosong artinya nilai yang tidak terisi, bukan angka nol."
    ],
    "sql": "SELECT nama,\n  CASE\n    WHEN harga IS NULL THEN 'belum diisi'\n    WHEN harga >= 5000 AND harga <= 15000 THEN 'hemat'\n    WHEN harga >= 15001 AND harga <= 30000 THEN 'biasa'\n    WHEN harga >= 30001 AND harga <= 80000 THEN 'mahal'\n    ELSE 'lainnya'\n  END AS label\nFROM produk\nORDER BY nama;",
    "why": "Kenapa ini benar: Tampilkan nama dan kolom label. Urutkan menurut nama dari A ke Z. Memberi label lewat percabangan, bukan lewat saringan yang membuang baris. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "vip-dan-biasa-sekaligus": {
    "hints": [
      "Memberi label lewat percabangan, bukan lewat saringan yang membuang baris. Konteksnya: TokoKulwon menghitung dua kelompok sekaligus.",
      "Bentuk query: Sumber utamanya tabel pelanggan. Percabangan memberi label tanpa membuang baris.",
      "Tampilkan satu baris dengan kolom jumlah_vip dan jumlah_biasa."
    ],
    "sql": "SELECT\n  SUM(CASE WHEN total_belanja >= 300000 THEN 1 ELSE 0 END) AS jumlah_vip,\n  SUM(CASE WHEN total_belanja < 300000 THEN 1 ELSE 0 END) AS jumlah_biasa\nFROM pelanggan;",
    "why": "Kenapa ini benar: Tampilkan satu baris dengan kolom jumlah_vip dan jumlah_biasa. Memberi label lewat percabangan, bukan lewat saringan yang membuang baris. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "urutan-status-stok": {
    "hints": [
      "Memberi label lewat percabangan, bukan lewat saringan yang membuang baris. Konteksnya: Susun barang TokoKulwon menurut status stok: habis dulu, lalu tipis, lalu aman.",
      "Bentuk query: Kolom hasilnya nama, status. Sumber utamanya tabel produk. Urutan menentukan posisi baris hasil. Percabangan memberi label tanpa membuang baris.",
      "Tampilkan nama dan status. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT nama, status\nFROM produk\nORDER BY CASE status\n  WHEN 'habis' THEN 1\n  WHEN 'tipis' THEN 2\n  WHEN 'aman' THEN 3\n  ELSE 4\nEND, nama;",
    "why": "Kenapa ini benar: Tampilkan nama dan status. Memberi label lewat percabangan, bukan lewat saringan yang membuang baris. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "harga-kosong-dianggap-nol": {
    "hints": [
      "Mengganti nilai kosong dengan pengganti yang diminta, tanpa membuang barisnya. Konteksnya: Label harga menganggap harga kosong sebagai nol.",
      "Bentuk query: Kolom hasilnya nama, COALESCE(harga, 0) AS harga_tampil. Sumber utamanya tabel produk. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama dan kolom harga_tampil. Urutkan menurut nama dari A ke Z. Ganti yang kosong di kolom hasil. Jangan buang barisnya."
    ],
    "sql": "SELECT nama, COALESCE(harga, 0) AS harga_tampil\nFROM produk\nORDER BY nama;",
    "why": "Kenapa ini benar: Tampilkan nama dan kolom harga_tampil. Urutkan menurut nama dari A ke Z. Mengganti nilai kosong dengan pengganti yang diminta, tanpa membuang barisnya. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "kota-belum-diisi": {
    "hints": [
      "Mengganti nilai kosong dengan pengganti yang diminta, tanpa membuang barisnya. Konteksnya: Kalau kota pelanggan belum tercatat, tulis belum diisi.",
      "Bentuk query: Kolom hasilnya nama, COALESCE(kota, 'belum diisi') AS kota. Sumber utamanya tabel pelanggan. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama dan kota. Urutkan menurut nama dari A ke Z. Ganti yang kosong di kolom hasil. Jangan buang barisnya."
    ],
    "sql": "SELECT nama, COALESCE(kota, 'belum diisi') AS kota\nFROM pelanggan\nORDER BY nama;",
    "why": "Kenapa ini benar: Tampilkan nama dan kota. Urutkan menurut nama dari A ke Z. Mengganti nilai kosong dengan pengganti yang diminta, tanpa membuang barisnya. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "email-tidak-bisa-dipakai": {
    "hints": [
      "Kosong di SQL bukan sama dengan nol. Yang dicari adalah nilai yang memang tidak terisi. Konteksnya: Email tidak bisa dipakai kalau belum tercatat atau tertulis tanpa huruf.",
      "Bentuk query: Kolom hasilnya nama, email. Sumber utamanya tabel pelanggan. Saringan membuang baris sebelum ringkasan atau urutan.",
      "Tampilkan nama dan email pelanggan yang emailnya tidak bisa dipakai. Kosong artinya nilai yang tidak terisi, bukan angka nol."
    ],
    "sql": "SELECT nama, email\nFROM pelanggan\nWHERE email IS NULL OR email = '';",
    "why": "Kenapa ini benar: Tampilkan nama dan email pelanggan yang emailnya tidak bisa dipakai. Kosong di SQL bukan sama dengan nol. Yang dicari adalah nilai yang memang tidak terisi. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "kota-tanpa-duplikat": {
    "hints": [
      "Membuang baris yang isinya sama persis. Konteksnya: Tampilkan tiap kota pelanggan TokoKulwon sekali.",
      "Bentuk query: Kolom hasilnya DISTINCT kota. Sumber utamanya tabel pelanggan. Urutan menentukan posisi baris hasil.",
      "Tampilkan kolom kota. Urutkan menurut nama kota dari A ke Z. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT DISTINCT kota\nFROM pelanggan\nORDER BY kota;",
    "why": "Kenapa ini benar: Tampilkan kolom kota. Urutkan menurut nama kota dari A ke Z. Membuang baris yang isinya sama persis. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "nama-dari-dua-daftar": {
    "hints": [
      "Menggabungkan dua daftar dan membuang baris yang dobel. Konteksnya: Gabungkan nama pelanggan dan nama pemasok TokoKulwon.",
      "Bentuk query: Kolom hasilnya nama. Dua daftar digabung dan baris kembar dibuang. Sumber utamanya tabel pelanggan. Urutan menentukan posisi baris hasil.",
      "Tampilkan kolom nama. Urutkan menurut nama dari A ke Z. Buang duplikat. Menumpuk mentah akan menulis nama yang sama dua kali."
    ],
    "sql": "SELECT nama FROM pelanggan\nUNION\nSELECT nama FROM pemasok\nORDER BY nama;",
    "why": "Kenapa ini benar: Tampilkan kolom nama. Urutkan menurut nama dari A ke Z. Menggabungkan dua daftar dan membuang baris yang dobel. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "kontak-dari-dua-meja": {
    "hints": [
      "Menumpuk dua daftar dan mempertahankan baris yang sama. Konteksnya: Gabungkan nama kasir dan kurir TokoKulwon.",
      "Bentuk query: Kolom hasilnya nama. Dua daftar ditumpuk dan baris kembar dipertahankan. Sumber utamanya tabel kasir.",
      "Tampilkan kolom nama. Pertahankan duplikat. Menggabung dengan buang-dobel akan mengurangi baris."
    ],
    "sql": "SELECT nama FROM kasir\nUNION ALL\nSELECT nama FROM kurir;",
    "why": "Kenapa ini benar: Tampilkan kolom nama. Menumpuk dua daftar dan mempertahankan baris yang sama. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "harga-tertulis-sebagai-teks": {
    "hints": [
      "Mengubah teks menjadi angka supaya perbandingan atau urutan mengikuti nilainya, bukan urutan huruf. Konteksnya: Harga di tabel ini tertulis sebagai teks.",
      "Bentuk query: Kolom hasilnya nama, CAST(harga AS INTEGER) AS harga. Sumber utamanya tabel produk. Saringan membuang baris sebelum ringkasan atau urutan.",
      "Tampilkan nama dan harga sebagai angka."
    ],
    "sql": "SELECT nama, CAST(harga AS INTEGER) AS harga\nFROM produk\nWHERE CAST(harga AS INTEGER) <= 20000;",
    "why": "Kenapa ini benar: Tampilkan nama dan harga sebagai angka. Mengubah teks menjadi angka supaya perbandingan atau urutan mengikuti nilainya, bukan urutan huruf. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "barang-dan-penjualan-kosong": {
    "hints": [
      "Tetap menampilkan baris kiri walaupun tidak ada pasangan di kanan. Konteksnya: Tampilkan setiap barang TokoKulwon, termasuk yang belum terjual.",
      "Bentuk query: Kolom hasilnya produk.nama, penjualan.qty. Sumber utamanya tabel produk. Gabungan kiri: baris kiri tetap ada bila kanan kosong. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama dan qty. Urutkan menurut nama dari A ke Z. Baris tanpa pasangan tetap muncul."
    ],
    "sql": "SELECT produk.nama, penjualan.qty\nFROM produk\nLEFT JOIN penjualan ON penjualan.produk_id = produk.id\nORDER BY produk.nama;",
    "why": "Kenapa ini benar: Tampilkan nama dan qty. Urutkan menurut nama dari A ke Z. Tetap menampilkan baris kiri walaupun tidak ada pasangan di kanan. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "pasangan-pelanggan-sekota": {
    "hints": [
      "Memasangkan baris pada tabel yang sama, dengan syarat supaya tidak berpasangan dengan dirinya. Konteksnya: Cari pasangan pelanggan TokoKulwon yang tinggal di kota yang sama.",
      "Bentuk query: Kolom hasilnya a.id AS id_a, a.nama AS nama_a, b.id AS id_b, b.nama AS nama_b. Sumber utamanya tabel pelanggan. Gabungkan tabel pada kunci yang cocok. Baris tanpa pasangan tidak ikut. Urutan menentukan posisi baris hasil.",
      "Tampilkan id_a, nama_a, id_b, dan nama_b. Urutkan menurut id_a lalu id_b, dari yang paling kecil. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT a.id AS id_a, a.nama AS nama_a, b.id AS id_b, b.nama AS nama_b\nFROM pelanggan AS a\nJOIN pelanggan AS b\n  ON a.kota = b.kota AND a.id < b.id\nORDER BY id_a, id_b;",
    "why": "Kenapa ini benar: Tampilkan id_a, nama_a, id_b, dan nama_b. Urutkan menurut id_a lalu id_b, dari yang paling kecil. Memasangkan baris pada tabel yang sama, dengan syarat supaya tidak berpasangan dengan dirinya. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "harga-di-toko-yang-tepat": {
    "hints": [
      "Menggabungkan dua tabel hanya pada baris yang kuncinya cocok. Konteksnya: Harga barang tergantung tokonya.",
      "Bentuk query: Kolom hasilnya baris.id, harga_toko.harga. Sumber utamanya tabel baris. Gabungkan tabel pada kunci yang cocok. Baris tanpa pasangan tidak ikut. Urutan menentukan posisi baris hasil.",
      "Tampilkan id baris dan harga. Urutkan menurut id dari yang paling kecil. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT baris.id, harga_toko.harga\nFROM baris\nJOIN harga_toko\n  ON harga_toko.toko_id = baris.toko_id\n AND harga_toko.produk_id = baris.produk_id\nORDER BY baris.id;",
    "why": "Kenapa ini benar: Tampilkan id baris dan harga. Urutkan menurut id dari yang paling kecil. Menggabungkan dua tabel hanya pada baris yang kuncinya cocok. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "barang-laku-minimal-sepuluh": {
    "hints": [
      "Mengelompokkan baris dulu, lalu menyaring kelompoknya, bukan menyaring baris satu per satu. Konteksnya: TokoKulwon menandai barang yang terjual sedikitnya 10 buah.",
      "Bentuk query: Kolom hasilnya produk.nama, SUM(penjualan.qty) AS total_qty. Sumber utamanya tabel produk. Gabungkan tabel pada kunci yang cocok. Baris tanpa pasangan tidak ikut. Kelompokkan supaya satu kelompok menjadi satu baris. Ambang jumlah diletakkan setelah ringkasan, bukan pada baris mentah. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama dan kolom total_qty. Urutkan menurut nama dari A ke Z. Syarat jumlah berlaku pada kelompok, bukan pada tiap baris sebelum diringkas."
    ],
    "sql": "SELECT produk.nama, SUM(penjualan.qty) AS total_qty\nFROM produk\nJOIN penjualan ON penjualan.produk_id = produk.id\nGROUP BY produk.nama\nHAVING SUM(penjualan.qty) >= 10\nORDER BY produk.nama;",
    "why": "Kenapa ini benar: Tampilkan nama dan kolom total_qty. Urutkan menurut nama dari A ke Z. Mengelompokkan baris dulu, lalu menyaring kelompoknya, bukan menyaring baris satu per satu. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "belanja-di-atas-rata-kota": {
    "hints": [
      "Membandingkan tiap baris dengan hasil hitungan atau daftar di dalam query. Konteksnya: Tampilkan pelanggan yang belanjanya lebih besar daripada rata-rata kota mereka sendiri.",
      "Bentuk query: Kolom hasilnya nama, kota, total_belanja. Sumber utamanya tabel pelanggan. Saringan membuang baris sebelum ringkasan atau urutan. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama, kota, dan total belanja. Urutkan menurut nama dari A ke Z. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT nama, kota, total_belanja\nFROM pelanggan AS p\nWHERE total_belanja > (\n  SELECT AVG(p2.total_belanja)\n  FROM pelanggan AS p2\n  WHERE p2.kota = p.kota\n)\nORDER BY nama;",
    "why": "Kenapa ini benar: Tampilkan nama, kota, dan total belanja. Urutkan menurut nama dari A ke Z. Membandingkan tiap baris dengan hasil hitungan atau daftar di dalam query. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "gudang-yang-sunyi": {
    "hints": [
      "Menyisakan baris yang tidak punya pasangan di tabel lain. Konteksnya: Tampilkan kota gudang TokoKulwon yang tidak punya pelanggan.",
      "Bentuk query: Kolom hasilnya kota. Sumber utamanya tabel gudang. Saringan membuang baris sebelum ringkasan atau urutan. Urutan menentukan posisi baris hasil.",
      "Tampilkan kolom kota. Urutkan menurut nama kota dari A ke Z. Yang lolos adalah yang tidak menemukan pasangan."
    ],
    "sql": "SELECT kota\nFROM gudang\nWHERE NOT EXISTS (\n  SELECT 1 FROM pelanggan WHERE pelanggan.kota = gudang.kota\n)\nORDER BY kota;",
    "why": "Kenapa ini benar: Tampilkan kolom kota. Urutkan menurut nama kota dari A ke Z. Menyisakan baris yang tidak punya pasangan di tabel lain. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "total-qty-per-nama": {
    "hints": [
      "Menggabungkan tabel, lalu merangkum jadi satu baris per kelompok. Konteksnya: Jumlahkan qty tiap nama barang TokoKulwon.",
      "Bentuk query: Kolom hasilnya produk.nama, SUM(penjualan.qty) AS total_qty. Sumber utamanya tabel produk. Gabungkan tabel pada kunci yang cocok. Baris tanpa pasangan tidak ikut. Kelompokkan supaya satu kelompok menjadi satu baris. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama dan kolom total_qty. Urutkan menurut nama dari A ke Z. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT produk.nama, SUM(penjualan.qty) AS total_qty\nFROM produk\nJOIN penjualan ON penjualan.produk_id = produk.id\nGROUP BY produk.nama\nORDER BY produk.nama;",
    "why": "Kenapa ini benar: Tampilkan nama dan kolom total_qty. Urutkan menurut nama dari A ke Z. Menggabungkan tabel, lalu merangkum jadi satu baris per kelompok. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "pembeli-beras": {
    "hints": [
      "Membandingkan tiap baris dengan hasil hitungan atau daftar di dalam query. Konteksnya: Tampilkan pelanggan yang memesan Beras 5kg.",
      "Bentuk query: Kolom hasilnya nama. Sumber utamanya tabel pelanggan. Saringan membuang baris sebelum ringkasan atau urutan. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama. Urutkan menurut nama dari A ke Z. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT nama\nFROM pelanggan\nWHERE id IN (\n  SELECT pelanggan_id\n  FROM pesanan\n  WHERE produk_id = (SELECT id FROM produk WHERE nama = 'Beras 5kg')\n)\nORDER BY nama;",
    "why": "Kenapa ini benar: Tampilkan nama. Urutkan menurut nama dari A ke Z. Membandingkan tiap baris dengan hasil hitungan atau daftar di dalam query. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "qty-kosong-jadi-nol": {
    "hints": [
      "Tetap menampilkan baris kiri walaupun tidak ada pasangan di kanan. Konteksnya: Tampilkan setiap barang TokoKulwon.",
      "Bentuk query: Kolom hasilnya produk.nama, COALESCE(penjualan.qty, 0) AS qty_tampil. Sumber utamanya tabel produk. Gabungan kiri: baris kiri tetap ada bila kanan kosong. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama dan kolom qty_tampil. Urutkan menurut nama dari A ke Z. Ganti yang kosong di kolom hasil. Jangan buang barisnya. Baris tanpa pasangan tetap muncul."
    ],
    "sql": "SELECT produk.nama, COALESCE(penjualan.qty, 0) AS qty_tampil\nFROM produk\nLEFT JOIN penjualan ON penjualan.produk_id = produk.id\nORDER BY produk.nama;",
    "why": "Kenapa ini benar: Tampilkan nama dan kolom qty_tampil. Urutkan menurut nama dari A ke Z. Tetap menampilkan baris kiri walaupun tidak ada pasangan di kanan. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "urut-kode-sebagai-angka": {
    "hints": [
      "Mengubah teks menjadi angka supaya perbandingan atau urutan mengikuti nilainya, bukan urutan huruf. Konteksnya: Kode barang TokoKulwon tertulis sebagai teks, tetapi urutannya mengikuti nilai angkanya.",
      "Bentuk query: Kolom hasilnya kode, nama. Sumber utamanya tabel produk. Urutan menentukan posisi baris hasil.",
      "Tampilkan kode dan nama. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT kode, nama\nFROM produk\nORDER BY CAST(kode AS INTEGER);",
    "why": "Kenapa ini benar: Tampilkan kode dan nama. Mengubah teks menjadi angka supaya perbandingan atau urutan mengikuti nilainya, bukan urutan huruf. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "pasangan-nama-kota-unik": {
    "hints": [
      "Membuang baris yang isinya sama persis. Konteksnya: Tampilkan pasangan nama dan kota yang unik.",
      "Bentuk query: Kolom hasilnya DISTINCT nama, kota. Sumber utamanya tabel pelanggan. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama dan kota. Urutkan menurut nama, lalu kota, dari A ke Z. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT DISTINCT nama, kota\nFROM pelanggan\nORDER BY nama, kota;",
    "why": "Kenapa ini benar: Tampilkan nama dan kota. Urutkan menurut nama, lalu kota, dari A ke Z. Membuang baris yang isinya sama persis. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "top-5-produk-terlaris": {
    "hints": [
      "Konsepnya menjumlahkan qty per nama barang, lalu mengambil peringkat teratas. Ini ringkasan, bukan daftar baris penjualan mentah.",
      "Bentuknya: gabungkan penjualan ke produk, kelompokkan menurut nama, jumlahkan qty, urutkan dari jumlah terbesar, lalu potong lima baris.",
      "Jika jumlahnya seri, nama dari A ke Z yang lebih dulu. Urutan harus selesai sebelum dipotong. Membalik arah jumlah akan mengangkat barang yang paling sedikit."
    ],
    "sql": "SELECT p.nama, SUM(j.qty) AS qty\nFROM penjualan AS j\nJOIN produk AS p ON p.id = j.produk_id\nGROUP BY p.nama\nORDER BY qty DESC, p.nama ASC\nLIMIT 5;",
    "why": "Soal minta lima barang dengan qty keluar paling banyak. Penjualan digabung ke nama produk supaya yang dijumlahkan adalah qty. Urutan dari jumlah terbesar, dengan nama sebagai pemecah seri, lalu lima baris teratas, menghasilkan papan atas yang diminta."
  },
  "kelas-pelanggan-dari-belanja": {
    "hints": [
      "Menomori baris di dalam kelompok tanpa menggabungkannya jadi satu baris. Konteksnya: TokoKulwon membagi pelanggan jadi dua kelas.",
      "Bentuk query: Sumber utamanya tabel pelanggan. Fungsi jendela menulis hitungan di tiap baris, tanpa menelan barisnya. Urutan menentukan posisi baris hasil. Percabangan memberi label tanpa membuang baris.",
      "Tampilkan nama, kelas, dan nomor_urut. Urutkan menurut kelas dari A ke Z, lalu nomor_urut dari kecil ke besar. Nomor baris tetap unik walaupun nilainya seri. Hitungan dipisah per kelompok. Jangan mencampur kelompok lain."
    ],
    "sql": "SELECT nama,\n  CASE WHEN total_belanja >= 300000 THEN 'VIP' ELSE 'Biasa' END AS kelas,\n  ROW_NUMBER() OVER (\n    PARTITION BY CASE WHEN total_belanja >= 300000 THEN 'VIP' ELSE 'Biasa' END\n    ORDER BY total_belanja DESC\n  ) AS nomor_urut\nFROM pelanggan\nORDER BY kelas, nomor_urut;",
    "why": "Kenapa ini benar: Tampilkan nama, kelas, dan nomor_urut. Urutkan menurut kelas dari A ke Z, lalu nomor_urut dari kecil ke besar. Menomori baris di dalam kelompok tanpa menggabungkannya jadi satu baris. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "email-pelanggan-yang-kosong": {
    "hints": [
      "Kosong di SQL bukan sama dengan nol. Yang dicari adalah nilai yang memang tidak terisi. Konteksnya: Catatan pelanggan TokoKulwon masih ada yang tanpa email.",
      "Bentuk query: Kolom hasilnya nama, email, kota. Sumber utamanya tabel pelanggan. Saringan membuang baris sebelum ringkasan atau urutan. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama, email, dan kota. Urutkan menurut nama dari A ke Z. Kosong artinya nilai yang tidak terisi, bukan angka nol."
    ],
    "sql": "SELECT nama, email, kota\nFROM pelanggan\nWHERE email IS NULL OR TRIM(email) = ''\nORDER BY nama;",
    "why": "Kenapa ini benar: Tampilkan nama, email, dan kota. Urutkan menurut nama dari A ke Z. Kosong di SQL bukan sama dengan nol. Yang dicari adalah nilai yang memang tidak terisi. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "nomor-baris-tiap-gudang": {
    "hints": [
      "Menomori baris di dalam kelompok tanpa menggabungkannya jadi satu baris. Konteksnya: Setiap gudang TokoKulwon punya daftar kiriman.",
      "Bentuk query: Sumber utamanya tabel kiriman. Fungsi jendela menulis hitungan di tiap baris, tanpa menelan barisnya. Urutan menentukan posisi baris hasil.",
      "Tampilkan gudang, hari, tujuan, dan nomor_baris. Urutkan menurut gudang dari A ke Z, lalu nomor_baris dari kecil ke besar. Nomor baris tetap unik walaupun nilainya seri. Hitungan dipisah per kelompok. Jangan mencampur kelompok lain."
    ],
    "sql": "SELECT gudang, hari, tujuan,\n  ROW_NUMBER() OVER (PARTITION BY gudang ORDER BY hari) AS nomor_baris\nFROM kiriman\nORDER BY gudang, nomor_baris;",
    "why": "Kenapa ini benar: Tampilkan gudang, hari, tujuan, dan nomor_baris. Urutkan menurut gudang dari A ke Z, lalu nomor_baris dari kecil ke besar. Menomori baris di dalam kelompok tanpa menggabungkannya jadi satu baris. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "peringkat-qty-yang-seri": {
    "hints": [
      "Peringkat yang mengikat: nilai yang sama seperingkat, lalu peringkat berikutnya melompat. Konteksnya: TokoKulwon memberi peringkat barang menurut qty.",
      "Bentuk query: Sumber utamanya tabel penjualan. Fungsi jendela menulis hitungan di tiap baris, tanpa menelan barisnya. Urutan menentukan posisi baris hasil.",
      "Tampilkan barang, qty, dan peringkat. Urutkan menurut peringkat dari kecil ke besar, lalu nama barang dari A ke Z. Seri membuat nomor berikutnya melompat. Arah dari besar ke kecil harus sesuai soal. Membalik arah mengubah siapa yang di atas."
    ],
    "sql": "SELECT barang, qty,\n  RANK() OVER (ORDER BY qty DESC) AS peringkat\nFROM penjualan\nORDER BY peringkat, barang;",
    "why": "Kenapa ini benar: Tampilkan barang, qty, dan peringkat. Urutkan menurut peringkat dari kecil ke besar, lalu nama barang dari A ke Z. Peringkat yang mengikat: nilai yang sama seperingkat, lalu peringkat berikutnya melompat. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "peringkat-rapat-isi-rak": {
    "hints": [
      "Peringkat rapat: nilai yang sama seperingkat, dan peringkat berikutnya tidak melompat. Konteksnya: Isi rak diurutkan dengan peringkat rapat menurut jumlah dus.",
      "Bentuk query: Sumber utamanya tabel rak. Fungsi jendela menulis hitungan di tiap baris, tanpa menelan barisnya. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama, dus, dan peringkat_rapat. Urutkan menurut peringkat_rapat dari kecil ke besar, lalu nama dari A ke Z. Seri tidak membuat nomor berikutnya melompat. Arah dari besar ke kecil harus sesuai soal. Membalik arah mengubah siapa yang di atas."
    ],
    "sql": "SELECT nama, dus,\n  DENSE_RANK() OVER (ORDER BY dus DESC) AS peringkat_rapat\nFROM rak\nORDER BY peringkat_rapat, nama;",
    "why": "Kenapa ini benar: Tampilkan nama, dus, dan peringkat_rapat. Urutkan menurut peringkat_rapat dari kecil ke besar, lalu nama dari A ke Z. Peringkat rapat: nilai yang sama seperingkat, dan peringkat berikutnya tidak melompat. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "tetangga-qty-harian": {
    "hints": [
      "Fungsi jendela: hitungan menempel di tiap baris, dan baris aslinya tidak dihilangkan. Konteksnya: Lihat qty pada baris tetangga menurut urutan hari.",
      "Bentuk query: Sumber utamanya tabel harian. Fungsi jendela menulis hitungan di tiap baris, tanpa menelan barisnya. Urutan menentukan posisi baris hasil.",
      "Tampilkan hari, qty, sebelumnya, dan sesudahnya. Urutkan menurut hari dari kecil ke besar. Baris pertama pada urutan itu belum punya nilai sebelumnya, jadi kosong."
    ],
    "sql": "SELECT hari, qty,\n  LAG(qty) OVER (ORDER BY hari) AS sebelumnya,\n  LEAD(qty) OVER (ORDER BY hari) AS sesudahnya\nFROM harian\nORDER BY hari;",
    "why": "Kenapa ini benar: Tampilkan hari, qty, sebelumnya, dan sesudahnya. Urutkan menurut hari dari kecil ke besar. Fungsi jendela: hitungan menempel di tiap baris, dan baris aslinya tidak dihilangkan. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "jumlah-berjalan-tiap-toko": {
    "hints": [
      "Fungsi jendela: hitungan menempel di tiap baris, dan baris aslinya tidak dihilangkan. Konteksnya: Jumlah berjalan menjumlahkan qty dari hari pertama sampai hari ini, terpisah untuk tiap toko.",
      "Bentuk query: Sumber utamanya tabel harian. Fungsi jendela menulis hitungan di tiap baris, tanpa menelan barisnya. Urutan menentukan posisi baris hasil.",
      "Tampilkan toko, hari, qty, dan jumlah_berjalan. Urutkan menurut toko dari A ke Z, lalu hari dari kecil ke besar. Hitungan dipisah per kelompok. Jangan mencampur kelompok lain."
    ],
    "sql": "SELECT toko, hari, qty,\n  SUM(qty) OVER (PARTITION BY toko ORDER BY hari) AS jumlah_berjalan\nFROM harian\nORDER BY toko, hari;",
    "why": "Kenapa ini benar: Tampilkan toko, hari, qty, dan jumlah_berjalan. Urutkan menurut toko dari A ke Z, lalu hari dari kecil ke besar. Fungsi jendela: hitungan menempel di tiap baris, dan baris aslinya tidak dihilangkan. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "bagian-qty-seluruh-barang": {
    "hints": [
      "Fungsi jendela: hitungan menempel di tiap baris, dan baris aslinya tidak dihilangkan. Konteksnya: Bagian tiap barang adalah bilangan bulat: qty dikali 100, dibagi jumlah qty seluruh barang, lalu sisa pembagian dibuang.",
      "Bentuk query: Sumber utamanya tabel barang. Fungsi jendela menulis hitungan di tiap baris, tanpa menelan barisnya. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama, qty, dan bagian. Urutkan menurut bagian dari besar ke kecil. Jika bagian sama, urutkan nama dari A ke Z. Arah dari besar ke kecil harus sesuai soal. Membalik arah mengubah siapa yang di atas."
    ],
    "sql": "SELECT nama, qty,\n  FLOOR(qty * 100 / SUM(qty) OVER ()) AS bagian\nFROM barang\nORDER BY bagian DESC, nama ASC;",
    "why": "Kenapa ini benar: Tampilkan nama, qty, dan bagian. Urutkan menurut bagian dari besar ke kecil. Jika bagian sama, urutkan nama dari A ke Z. Fungsi jendela: hitungan menempel di tiap baris, dan baris aslinya tidak dihilangkan. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "kota-di-atas-rata-omzet": {
    "hints": [
      "Menyusun langkah terpisah dulu, baru mengambil hasil langkah itu. Konteksnya: TokoKulwon membandingkan omzet kota dengan rata-rata omzet kota.",
      "Bentuk query: Ada langkah awal yang dihitung dulu, lalu dibaca oleh query utama. Gabungkan tabel pada kunci yang cocok. Baris tanpa pasangan tidak ikut. Saringan membuang baris sebelum ringkasan atau urutan. Kelompokkan supaya satu kelompok menjadi satu baris. Urutan menentukan posisi baris hasil.",
      "Tampilkan kota dan omzet. Hanya kota yang omzetnya di atas rata-rata itu. Urutkan menurut nama kota dari A ke Z. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "WITH omzet_kota AS (\n  SELECT kota, SUM(total_belanja) AS omzet\n  FROM pelanggan\n  GROUP BY kota\n),\nbatas AS (\n  SELECT AVG(omzet) AS rata_omzet\n  FROM omzet_kota\n)\nSELECT o.kota, o.omzet\nFROM omzet_kota AS o\nCROSS JOIN batas AS b\nWHERE o.omzet > b.rata_omzet\nORDER BY o.kota;",
    "why": "Kenapa ini benar: Tampilkan kota dan omzet. Hanya kota yang omzetnya di atas rata-rata itu. Urutkan menurut nama kota dari A ke Z. Menyusun langkah terpisah dulu, baru mengambil hasil langkah itu. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "qty-tanpa-lipat-harga": {
    "hints": [
      "Menggabungkan tabel, lalu merangkum jadi satu baris per kelompok. Konteksnya: Hitung jumlah qty penjualan tiap nama produk.",
      "Bentuk query: Kolom hasilnya p.nama, SUM(j.qty) AS qty. Sumber utamanya tabel penjualan. Gabungkan tabel pada kunci yang cocok. Baris tanpa pasangan tidak ikut. Kelompokkan supaya satu kelompok menjadi satu baris. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama dan qty. Urutkan menurut nama dari A ke Z. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT p.nama, SUM(j.qty) AS qty\nFROM penjualan AS j\nJOIN produk AS p ON p.id = j.produk_id\nGROUP BY p.nama\nORDER BY p.nama;",
    "why": "Kenapa ini benar: Tampilkan nama dan qty. Urutkan menurut nama dari A ke Z. Menggabungkan tabel, lalu merangkum jadi satu baris per kelompok. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "pemenang-belanja-tiap-kota": {
    "hints": [
      "Menomori baris di dalam kelompok tanpa menggabungkannya jadi satu baris. Konteksnya: Tiap kota punya satu pelanggan dengan belanja terbesar.",
      "Bentuk query: Kolom hasilnya kota, nama, total_belanja. Sumber utamanya tabel pelanggan. Saringan membuang baris sebelum ringkasan atau urutan. Fungsi jendela menulis hitungan di tiap baris, tanpa menelan barisnya. Urutan menentukan posisi baris hasil.",
      "Tampilkan kota, nama, dan total_belanja. Urutkan menurut nama kota dari A ke Z. Nomor baris tetap unik walaupun nilainya seri. Hitungan dipisah per kelompok. Jangan mencampur kelompok lain."
    ],
    "sql": "SELECT kota, nama, total_belanja\nFROM (\n  SELECT kota, nama, total_belanja,\n    ROW_NUMBER() OVER (PARTITION BY kota ORDER BY total_belanja DESC, nama ASC) AS nomor\n  FROM pelanggan\n) AS urut\nWHERE nomor = 1\nORDER BY kota;",
    "why": "Kenapa ini benar: Tampilkan kota, nama, dan total_belanja. Urutkan menurut nama kota dari A ke Z. Menomori baris di dalam kelompok tanpa menggabungkannya jadi satu baris. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "selisih-qty-hari-sebelum": {
    "hints": [
      "Fungsi jendela: hitungan menempel di tiap baris, dan baris aslinya tidak dihilangkan. Konteksnya: Selisih adalah qty hari ini dikurangi qty pada baris hari sebelumnya menurut urutan hari.",
      "Bentuk query: Sumber utamanya tabel harian. Fungsi jendela menulis hitungan di tiap baris, tanpa menelan barisnya. Urutan menentukan posisi baris hasil.",
      "Tampilkan hari, qty, dan selisih. Urutkan menurut hari dari kecil ke besar. Baris pertama pada urutan itu belum punya nilai sebelumnya, jadi kosong."
    ],
    "sql": "SELECT hari, qty,\n  qty - LAG(qty) OVER (ORDER BY hari) AS selisih\nFROM harian\nORDER BY hari;",
    "why": "Kenapa ini benar: Tampilkan hari, qty, dan selisih. Urutkan menurut hari dari kecil ke besar. Fungsi jendela: hitungan menempel di tiap baris, dan baris aslinya tidak dihilangkan. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "bagian-qty-di-dalam-kota": {
    "hints": [
      "Fungsi jendela: hitungan menempel di tiap baris, dan baris aslinya tidak dihilangkan. Konteksnya: Bagian dihitung di dalam kota, bukan untuk seluruh toko.",
      "Bentuk query: Sumber utamanya tabel penjualan. Fungsi jendela menulis hitungan di tiap baris, tanpa menelan barisnya. Urutan menentukan posisi baris hasil.",
      "Tampilkan kota, nama, qty, dan bagian. Urutkan menurut kota dari A ke Z, lalu nama dari A ke Z. Hitungan dipisah per kelompok. Jangan mencampur kelompok lain."
    ],
    "sql": "SELECT kota, nama, qty,\n  FLOOR(qty * 100 / SUM(qty) OVER (PARTITION BY kota)) AS bagian\nFROM penjualan\nORDER BY kota, nama;",
    "why": "Kenapa ini benar: Tampilkan kota, nama, qty, dan bagian. Urutkan menurut kota dari A ke Z, lalu nama dari A ke Z. Fungsi jendela: hitungan menempel di tiap baris, dan baris aslinya tidak dihilangkan. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "kode-ganda-atau-nama-kosong": {
    "hints": [
      "Mengelompokkan baris dulu, lalu menyaring kelompoknya, bukan menyaring baris satu per satu. Konteksnya: Tampilkan barang yang kodenya muncul lebih dari sekali, atau yang namanya kosong.",
      "Bentuk query: Kolom hasilnya kode, nama. Sumber utamanya tabel barang. Saringan membuang baris sebelum ringkasan atau urutan. Kelompokkan supaya satu kelompok menjadi satu baris. Ambang jumlah diletakkan setelah ringkasan, bukan pada baris mentah. Urutan menentukan posisi baris hasil.",
      "Tampilkan kode dan nama. Urutkan menurut kode dari A ke Z sebagai teks, lalu nama dari A ke Z. Kosong artinya nilai yang tidak terisi, bukan angka nol. Syarat jumlah berlaku pada kelompok, bukan pada tiap baris sebelum diringkas."
    ],
    "sql": "SELECT kode, nama\nFROM barang\nWHERE kode IN (\n  SELECT kode FROM barang GROUP BY kode HAVING COUNT(*) > 1\n)\nOR nama IS NULL\nOR nama = ''\nORDER BY kode, nama;",
    "why": "Kenapa ini benar: Tampilkan kode dan nama. Urutkan menurut kode dari A ke Z sebagai teks, lalu nama dari A ke Z. Mengelompokkan baris dulu, lalu menyaring kelompoknya, bukan menyaring baris satu per satu. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "barang-pada-urutan-kedua": {
    "hints": [
      "Menomori baris di dalam kelompok tanpa menggabungkannya jadi satu baris. Konteksnya: Ambil barang pada urutan kedua di tiap rak.",
      "Bentuk query: Kolom hasilnya rak, nama, harga. Sumber utamanya tabel isi_rak. Saringan membuang baris sebelum ringkasan atau urutan. Fungsi jendela menulis hitungan di tiap baris, tanpa menelan barisnya. Urutan menentukan posisi baris hasil.",
      "Tampilkan rak, nama, dan harga. Urutkan menurut rak dari A ke Z. Nomor baris tetap unik walaupun nilainya seri. Hitungan dipisah per kelompok. Jangan mencampur kelompok lain."
    ],
    "sql": "SELECT rak, nama, harga\nFROM (\n  SELECT rak, nama, harga,\n    ROW_NUMBER() OVER (PARTITION BY rak ORDER BY harga DESC) AS nomor\n  FROM isi_rak\n) AS urut\nWHERE nomor = 2\nORDER BY rak;",
    "why": "Kenapa ini benar: Tampilkan rak, nama, dan harga. Urutkan menurut rak dari A ke Z. Menomori baris di dalam kelompok tanpa menggabungkannya jadi satu baris. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "tiga-peringkat-tiap-kategori": {
    "hints": [
      "Peringkat yang mengikat: nilai yang sama seperingkat, lalu peringkat berikutnya melompat. Konteksnya: Di tiap kategori, beri peringkat menurut skor.",
      "Bentuk query: Kolom hasilnya kategori, nama, skor, peringkat. Sumber utamanya tabel skor_barang. Saringan membuang baris sebelum ringkasan atau urutan. Fungsi jendela menulis hitungan di tiap baris, tanpa menelan barisnya. Urutan menentukan posisi baris hasil.",
      "Tampilkan kategori, nama, skor, dan peringkat. Urutkan menurut kategori dari A ke Z, lalu peringkat dari kecil ke besar, lalu nama dari A ke Z. Seri membuat nomor berikutnya melompat. Hitungan dipisah per kelompok. Jangan mencampur kelompok lain."
    ],
    "sql": "SELECT kategori, nama, skor, peringkat\nFROM (\n  SELECT kategori, nama, skor,\n    RANK() OVER (PARTITION BY kategori ORDER BY skor DESC) AS peringkat\n  FROM skor_barang\n) AS urut\nWHERE peringkat <= 3\nORDER BY kategori, peringkat, nama;",
    "why": "Kenapa ini benar: Tampilkan kategori, nama, skor, dan peringkat. Urutkan menurut kategori dari A ke Z, lalu peringkat dari kecil ke besar, lalu nama dari A ke Z. Peringkat yang mengikat: nilai yang sama seperingkat, lalu peringkat berikutnya melompat. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "bagian-jumlah-berjalan": {
    "hints": [
      "Fungsi jendela: hitungan menempel di tiap baris, dan baris aslinya tidak dihilangkan. Konteksnya: Jumlah berjalan menjumlahkan qty dari urutan pertama sampai urutan ini.",
      "Bentuk query: Sumber utamanya tabel penjualan. Fungsi jendela menulis hitungan di tiap baris, tanpa menelan barisnya. Urutan menentukan posisi baris hasil.",
      "Tampilkan urutan, nama, qty, jumlah_berjalan, dan bagian. Urutkan menurut urutan dari kecil ke besar. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT urutan, nama, qty,\n  SUM(qty) OVER (ORDER BY urutan) AS jumlah_berjalan,\n  FLOOR(SUM(qty) OVER (ORDER BY urutan) * 100 / SUM(qty) OVER ()) AS bagian\nFROM penjualan\nORDER BY urutan;",
    "why": "Kenapa ini benar: Tampilkan urutan, nama, qty, jumlah_berjalan, dan bagian. Urutkan menurut urutan dari kecil ke besar. Fungsi jendela: hitungan menempel di tiap baris, dan baris aslinya tidak dihilangkan. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "jumlah-tiga-hari-terakhir": {
    "hints": [
      "Menjumlahkan jendela baris yang dibatasi, bukan seluruh tabel sekaligus. Konteksnya: Jumlah tiga hari adalah qty hari ini ditambah qty dua baris hari sebelumnya pada urutan hari.",
      "Bentuk query: Sumber utamanya tabel harian. Fungsi jendela menulis hitungan di tiap baris, tanpa menelan barisnya. Urutan menentukan posisi baris hasil.",
      "Tampilkan hari, qty, dan jumlah_tiga. Urutkan menurut hari dari kecil ke besar. Jumlahnya jendela baris: dua baris sebelum hari ini sampai baris ini, bukan rentang angka."
    ],
    "sql": "SELECT hari, qty,\n  SUM(qty) OVER (\n    ORDER BY hari\n    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n  ) AS jumlah_tiga\nFROM harian\nORDER BY hari;",
    "why": "Kenapa ini benar: Tampilkan hari, qty, dan jumlah_tiga. Urutkan menurut hari dari kecil ke besar. Menjumlahkan jendela baris yang dibatasi, bukan seluruh tabel sekaligus. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "email-sama-beda-tulisan": {
    "hints": [
      "Mengelompokkan baris dulu, lalu menyaring kelompoknya, bukan menyaring baris satu per satu. Konteksnya: Dua email dianggap sama bila huruf besar dan kecil diabaikan dan spasi di ujung dibuang.",
      "Bentuk query: Kolom hasilnya nama, email. Sumber utamanya tabel pelanggan. Saringan membuang baris sebelum ringkasan atau urutan. Kelompokkan supaya satu kelompok menjadi satu baris. Ambang jumlah diletakkan setelah ringkasan, bukan pada baris mentah. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama dan email apa adanya, tanpa diubah. Urutkan menurut nama dari A ke Z. Syarat jumlah berlaku pada kelompok, bukan pada tiap baris sebelum diringkas."
    ],
    "sql": "SELECT nama, email\nFROM pelanggan\nWHERE LOWER(TRIM(email)) IN (\n  SELECT LOWER(TRIM(email))\n  FROM pelanggan\n  WHERE email IS NOT NULL\n  GROUP BY LOWER(TRIM(email))\n  HAVING COUNT(*) > 1\n)\nORDER BY nama;",
    "why": "Kenapa ini benar: Tampilkan nama dan email apa adanya, tanpa diubah. Urutkan menurut nama dari A ke Z. Mengelompokkan baris dulu, lalu menyaring kelompoknya, bukan menyaring baris satu per satu. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "harga-toko-yang-bertentangan": {
    "hints": [
      "Mengelompokkan baris dulu, lalu menyaring kelompoknya, bukan menyaring baris satu per satu. Konteksnya: Satu nama barang bisa tercatat di beberapa toko.",
      "Bentuk query: Kolom hasilnya nama, toko, harga. Sumber utamanya tabel harga_toko. Saringan membuang baris sebelum ringkasan atau urutan. Kelompokkan supaya satu kelompok menjadi satu baris. Ambang jumlah diletakkan setelah ringkasan, bukan pada baris mentah. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama, toko, dan harga. Urutkan menurut nama dari A ke Z, lalu toko dari A ke Z. Syarat jumlah berlaku pada kelompok, bukan pada tiap baris sebelum diringkas."
    ],
    "sql": "SELECT nama, toko, harga\nFROM harga_toko\nWHERE nama IN (\n  SELECT nama\n  FROM harga_toko\n  GROUP BY nama\n  HAVING COUNT(DISTINCT harga) > 1\n)\nORDER BY nama, toko;",
    "why": "Kenapa ini benar: Tampilkan nama, toko, dan harga. Urutkan menurut nama dari A ke Z, lalu toko dari A ke Z. Mengelompokkan baris dulu, lalu menyaring kelompoknya, bukan menyaring baris satu per satu. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "ujung-qty-tiap-toko": {
    "hints": [
      "Mengambil nilai di ujung urutan tiap kelompok, lalu menempelkannya pada setiap baris kelompok itu. Konteksnya: Pada tiap toko, qty awal adalah qty pada hari paling kecil dan qty akhir adalah qty pada hari paling besar.",
      "Bentuk query: Sumber utamanya tabel harian. Fungsi jendela menulis hitungan di tiap baris, tanpa menelan barisnya. Urutan menentukan posisi baris hasil.",
      "Tampilkan toko, hari, qty, qty_awal, dan qty_akhir. Urutkan menurut toko dari A ke Z, lalu hari dari kecil ke besar. Qty akhir melihat dari baris pertama sampai baris terakhir di toko itu, bukan hanya sampai baris sekarang. Hitungan dipisah per toko."
    ],
    "sql": "SELECT toko, hari, qty,\n  FIRST_VALUE(qty) OVER (PARTITION BY toko ORDER BY hari) AS qty_awal,\n  LAST_VALUE(qty) OVER (\n    PARTITION BY toko ORDER BY hari\n    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING\n  ) AS qty_akhir\nFROM harian\nORDER BY toko, hari;",
    "why": "Kenapa ini benar: Tampilkan toko, hari, qty, qty_awal, dan qty_akhir. Urutkan menurut toko dari A ke Z, lalu hari dari kecil ke besar. Mengambil nilai di ujung urutan tiap kelompok, lalu menempelkannya pada setiap baris kelompok itu. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "selisih-dari-puncak-kota": {
    "hints": [
      "Fungsi jendela: hitungan menempel di tiap baris, dan baris aslinya tidak dihilangkan. Konteksnya: Selisih adalah belanja terbesar di kota yang sama dikurangi belanja pelanggan ini.",
      "Bentuk query: Sumber utamanya tabel pelanggan. Fungsi jendela menulis hitungan di tiap baris, tanpa menelan barisnya. Urutan menentukan posisi baris hasil.",
      "Tampilkan kota, nama, total_belanja, dan selisih. Urutkan menurut kota dari A ke Z, lalu nama dari A ke Z. Hitungan dipisah per kelompok. Jangan mencampur kelompok lain."
    ],
    "sql": "SELECT kota, nama, total_belanja,\n  MAX(total_belanja) OVER (PARTITION BY kota) - total_belanja AS selisih\nFROM pelanggan\nORDER BY kota, nama;",
    "why": "Kenapa ini benar: Tampilkan kota, nama, total_belanja, dan selisih. Urutkan menurut kota dari A ke Z, lalu nama dari A ke Z. Fungsi jendela: hitungan menempel di tiap baris, dan baris aslinya tidak dihilangkan. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "nomor-urut-setelah-saringan": {
    "hints": [
      "Menomori baris di dalam kelompok tanpa menggabungkannya jadi satu baris. Konteksnya: Hanya pelanggan dari Bandung dan Medan.",
      "Bentuk query: Sumber utamanya tabel pelanggan. Saringan membuang baris sebelum ringkasan atau urutan. Fungsi jendela menulis hitungan di tiap baris, tanpa menelan barisnya. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama, kota, total_belanja, dan nomor_urut. Urutkan menurut nomor_urut dari kecil ke besar. Nomor baris tetap unik walaupun nilainya seri. Arah dari besar ke kecil harus sesuai soal. Membalik arah mengubah siapa yang di atas."
    ],
    "sql": "SELECT nama, kota, total_belanja,\n  ROW_NUMBER() OVER (ORDER BY total_belanja DESC, nama ASC) AS nomor_urut\nFROM pelanggan\nWHERE kota IN ('Bandung', 'Medan')\nORDER BY nomor_urut;",
    "why": "Kenapa ini benar: Tampilkan nama, kota, total_belanja, dan nomor_urut. Urutkan menurut nomor_urut dari kecil ke besar. Menomori baris di dalam kelompok tanpa menggabungkannya jadi satu baris. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "pelanggan-dari-dua-meja": {
    "hints": [
      "Menyusun langkah terpisah dulu, baru mengambil hasil langkah itu. Konteksnya: TokoKulwon ingin pelanggan yang datang minimal dua kali dan total notanya minimal 100.",
      "Bentuk query: Ada langkah awal yang dihitung dulu, lalu dibaca oleh query utama. Gabungkan tabel pada kunci yang cocok. Baris tanpa pasangan tidak ikut. Saringan membuang baris sebelum ringkasan atau urutan. Kelompokkan supaya satu kelompok menjadi satu baris. Urutan menentukan posisi baris hasil.",
      "Tampilkan nama, jumlah_kunjungan, dan total_nota. Urutkan menurut nama dari A ke Z. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "WITH kunjungan_pelanggan AS (\n  SELECT pelanggan_id, COUNT(*) AS jumlah_kunjungan\n  FROM kunjungan\n  GROUP BY pelanggan_id\n),\nnota_pelanggan AS (\n  SELECT pelanggan_id, SUM(nilai) AS total_nota\n  FROM nota\n  GROUP BY pelanggan_id\n)\nSELECT p.nama, k.jumlah_kunjungan, n.total_nota\nFROM pelanggan AS p\nJOIN kunjungan_pelanggan AS k ON k.pelanggan_id = p.id\nJOIN nota_pelanggan AS n ON n.pelanggan_id = p.id\nWHERE k.jumlah_kunjungan >= 2\n  AND n.total_nota >= 100\nORDER BY p.nama;",
    "why": "Kenapa ini benar: Tampilkan nama, jumlah_kunjungan, dan total_nota. Urutkan menurut nama dari A ke Z. Menyusun langkah terpisah dulu, baru mengambil hasil langkah itu. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "stok-gudang-tak-wajar": {
    "hints": [
      "Mengelompokkan baris dulu, lalu menyaring kelompoknya, bukan menyaring baris satu per satu. Konteksnya: Baris stok bermasalah bila qty belum terisi, qty lebih kecil dari nol, atau pasangan barang dan gudang muncul lebih dari sekali.",
      "Bentuk query: Kolom hasilnya barang, gudang, qty. Sumber utamanya tabel stok. Saringan membuang baris sebelum ringkasan atau urutan. Kelompokkan supaya satu kelompok menjadi satu baris. Ambang jumlah diletakkan setelah ringkasan, bukan pada baris mentah. Urutan menentukan posisi baris hasil.",
      "Tampilkan barang, gudang, dan qty. Urutkan menurut barang dari A ke Z, lalu gudang dari A ke Z, lalu qty dari kecil ke besar. Kosong artinya nilai yang tidak terisi, bukan angka nol. Syarat jumlah berlaku pada kelompok, bukan pada tiap baris sebelum diringkas."
    ],
    "sql": "SELECT barang, gudang, qty\nFROM stok\nWHERE qty IS NULL\n  OR qty < 0\n  OR (barang, gudang) IN (\n    SELECT barang, gudang\n    FROM stok\n    GROUP BY barang, gudang\n    HAVING COUNT(*) > 1\n  )\nORDER BY barang, gudang, qty;",
    "why": "Kenapa ini benar: Tampilkan barang, gudang, dan qty. Urutkan menurut barang dari A ke Z, lalu gudang dari A ke Z, lalu qty dari kecil ke besar. Mengelompokkan baris dulu, lalu menyaring kelompoknya, bukan menyaring baris satu per satu. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "kode-nol-di-depan": {
    "hints": [
      "Mengubah teks menjadi angka supaya perbandingan atau urutan mengikuti nilainya, bukan urutan huruf. Konteksnya: Kode barang tertulis sebagai teks dan harus ditampilkan apa adanya, termasuk nol di depan.",
      "Bentuk query: Kolom hasilnya kode, nama. Sumber utamanya tabel produk. Urutan menentukan posisi baris hasil.",
      "Tampilkan kode dan nama. Urutan adalah bagian dari jawaban bila soal memintanya."
    ],
    "sql": "SELECT kode, nama\nFROM produk\nORDER BY CAST(kode AS INTEGER), kode;",
    "why": "Kenapa ini benar: Tampilkan kode dan nama. Mengubah teks menjadi angka supaya perbandingan atau urutan mengikuti nilainya, bukan urutan huruf. Yang dinilai adalah kolom dan baris hasilnya."
  },
  "gerak-qty-antar-hari": {
    "hints": [
      "Membandingkan baris ini dengan baris sebelumnya di kelompok yang sama, lalu memberi label. Konteksnya: Gerak membandingkan qty dengan qty hari sebelumnya di toko yang sama, pada urutan hari.",
      "Bentuk query: Sumber utamanya tabel harian. Fungsi jendela menulis hitungan di tiap baris, tanpa menelan barisnya. Urutan menentukan posisi baris hasil. Percabangan memberi label tanpa membuang baris.",
      "Tampilkan toko, hari, qty, dan gerak. Urutkan menurut toko dari A ke Z, lalu hari dari kecil ke besar. Kosong artinya nilai yang tidak terisi, bukan angka nol. Baris pertama pada urutan itu belum punya nilai sebelumnya, jadi kosong."
    ],
    "sql": "SELECT toko, hari, qty,\n  CASE\n    WHEN LAG(qty) OVER (PARTITION BY toko ORDER BY hari) IS NULL THEN 'awal'\n    WHEN qty > LAG(qty) OVER (PARTITION BY toko ORDER BY hari) THEN 'naik'\n    WHEN qty < LAG(qty) OVER (PARTITION BY toko ORDER BY hari) THEN 'turun'\n    ELSE 'tetap'\n  END AS gerak\nFROM harian\nORDER BY toko, hari;",
    "why": "Kenapa ini benar: Tampilkan toko, hari, qty, dan gerak. Urutkan menurut toko dari A ke Z, lalu hari dari kecil ke besar. Membandingkan baris ini dengan baris sebelumnya di kelompok yang sama, lalu memberi label. Yang dinilai adalah kolom dan baris hasilnya."
  }
}

export function lessonFor(slug: string): Lesson | undefined {
  return LESSONS[slug]
}
