import assert from 'node:assert/strict'
import { test } from 'node:test'
import { decideXpGrant, levelFromXp, REWARDS } from './grant.ts'

const MUDAH_SLUGS = [
  'hari-pertama-di-tokokulwon',
  'laporan-untuk-tim-marketing',
  'mencari-pelanggan-dari-jakarta',
  'produk-dengan-harga-terjangkau',
  'pelanggan-dari-jakarta-atau-bandung',
  'pelanggan-jakarta-belanja-besar',
  'pelanggan-di-tiga-kota',
  'belanja-di-antara',
  'nama-berawalan-de',
  'belanja-dari-yang-terbesar',
  'dua-pelanggan-pertama',
  'nama-sebagai-pelanggan',
  'jumlah-pelanggan-tercatat',
  'jumlah-seluruh-belanja',
  'belanja-paling-kecil',
  'belanja-paling-besar',
  'pesanan-dan-nama-pelanggan',
  'produk-yang-ikut-terjual',
  'harga-di-bawah-dua-puluh-ribu',
  'pelanggan-bukan-dari-medan',
  'urut-berdasarkan-kota',
  'nama-berakhiran-wati',
  'tiga-produk-termurah',
  'daftar-pesanan',
  'nama-dan-harga-produk',
  'pelanggan-bandung-atau-surabaya',
  'harga-antara-dua-batas',
  'urut-id-dari-belakang',
  'alias-tabel-pelanggan',
  'hitung-produk-berharga',
  'gabung-pelanggan-satu-kota',
]

const SEDANG_SLUGS = [
  'pelanggan-vip-dari-surabaya',
  'daftar-produk-termahal',
  'total-belanja-per-kota',
  'produk-tanpa-harga',
  'kota-minimal-dua-pelanggan',
  'omzet-kota-ambang',
  'kota-tepat-dua-pelanggan',
  'rata-rata-belanja-tiap-kota',
  'rentang-belanja-tiap-kota',
  'pesanan-tiap-pelanggan',
  'berapa-kota-tercatat',
  'nama-pelanggan-yang-berulang',
  'lebih-mahal-dari-yang-termurah',
  'produk-paling-mahal',
  'barang-tak-terjual',
  'pelanggan-yang-sudah-memesan',
  'pelanggan-yang-belum-memesan',
  'pelanggan-di-kota-gudang',
  'omzet-kota-lewat-ringkasan',
  'pelanggan-medan-lewat-daftar',
  'label-harga-barang',
  'vip-dan-biasa-sekaligus',
  'urutan-status-stok',
  'harga-kosong-dianggap-nol',
  'kota-belum-diisi',
  'email-tidak-bisa-dipakai',
  'kota-tanpa-duplikat',
  'nama-dari-dua-daftar',
  'kontak-dari-dua-meja',
  'harga-tertulis-sebagai-teks',
  'barang-dan-penjualan-kosong',
  'pasangan-pelanggan-sekota',
  'harga-di-toko-yang-tepat',
  'barang-laku-minimal-sepuluh',
  'belanja-di-atas-rata-kota',
  'gudang-yang-sunyi',
  'total-qty-per-nama',
  'pembeli-beras',
  'qty-kosong-jadi-nol',
  'urut-kode-sebagai-angka',
  'pasangan-nama-kota-unik',
]

const SULIT_SLUGS = [
  'top-5-produk-terlaris',
  'kelas-pelanggan-dari-belanja',
  'email-pelanggan-yang-kosong',
  'nomor-baris-tiap-gudang',
  'peringkat-qty-yang-seri',
  'peringkat-rapat-isi-rak',
  'tetangga-qty-harian',
  'jumlah-berjalan-tiap-toko',
  'bagian-qty-seluruh-barang',
  'kota-di-atas-rata-omzet',
  'qty-tanpa-lipat-harga',
  'pemenang-belanja-tiap-kota',
  'selisih-qty-hari-sebelum',
  'bagian-qty-di-dalam-kota',
  'kode-ganda-atau-nama-kosong',
  'barang-pada-urutan-kedua',
  'tiga-peringkat-tiap-kategori',
  'bagian-jumlah-berjalan',
  'jumlah-tiga-hari-terakhir',
  'email-sama-beda-tulisan',
  'harga-toko-yang-bertentangan',
  'ujung-qty-tiap-toko',
  'selisih-dari-puncak-kota',
  'nomor-urut-setelah-saringan',
  'pelanggan-dari-dua-meja',
  'stok-gudang-tak-wajar',
  'kode-nol-di-depan',
  'gerak-qty-antar-hari',
]

test('level is one plus floor of xp over 250', () => {
  assert.equal(levelFromXp(0), 1)
  assert.equal(levelFromXp(50), 1)
  assert.equal(levelFromXp(249), 1)
  assert.equal(levelFromXp(250), 2)
  assert.equal(levelFromXp(499), 2)
  assert.equal(levelFromXp(500), 3)
})

test('first pass grants the reward', () => {
  assert.equal(decideXpGrant(false, 50), 50)
})

test('same user and slug twice grants 0 and stays completed', () => {
  assert.equal(decideXpGrant(false, 50), 50)
  assert.equal(decideXpGrant(true, 50), 0)
})

test('one hundred slugs grant 50 and a repeat grants 0', () => {
  assert.deepEqual(Object.keys(REWARDS), [...MUDAH_SLUGS, ...SEDANG_SLUGS, ...SULIT_SLUGS])
  for (const slug of [...MUDAH_SLUGS, ...SEDANG_SLUGS, ...SULIT_SLUGS]) assert.equal(REWARDS[slug], 50)
  assert.equal(Object.keys(REWARDS).length, 100)
  assert.equal(REWARDS['hari-pertama-di-tokokulwon'], 50)
  assert.equal(REWARDS['pelanggan-vip-dari-surabaya'], 50)
  assert.equal(REWARDS['top-5-produk-terlaris'], 50)
  assert.equal(REWARDS['bukan-soal'], undefined)
  assert.equal(decideXpGrant(true, 50), 0)
})
