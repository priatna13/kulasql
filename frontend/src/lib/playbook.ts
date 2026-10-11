export const PLAYBOOK_PATH = '/kulasql/playbook'

export const PLAYBOOK_STORE = 'TokoKulwon'

export const PLAYBOOK_JOBS = ['Laporan', 'Pelanggan', 'Penjualan', 'Stok'] as const

export type PlaybookJob = (typeof PLAYBOOK_JOBS)[number]

export type PlaybookItem = {
  id: string
  title: string
  scenario: string
  job: PlaybookJob
  sql: string
}

export const PLAYBOOK: readonly PlaybookItem[] = [
  {
    id: 'omzet-harian-bulan-ini',
    title: 'Omzet harian bulan ini',
    scenario: 'Laporan pagi: omzet lunas tiap hari di bulan berjalan.',
    job: 'Laporan',
    sql: `SELECT
  tanggal,
  COUNT(*) AS jumlah_nota,
  SUM(total) AS omzet
FROM pesanan
WHERE status = 'lunas'
  AND date_trunc('month', tanggal) = date_trunc('month', CURRENT_DATE)
GROUP BY tanggal
ORDER BY tanggal`,
  },
  {
    id: 'omzet-per-kota-bulan-ini',
    title: 'Omzet per kota bulan ini',
    scenario: 'Laporan penjualan per kota pelanggan untuk bulan berjalan.',
    job: 'Laporan',
    sql: `SELECT
  pl.kota,
  COUNT(*) AS jumlah_nota,
  SUM(p.total) AS omzet
FROM pesanan AS p
JOIN pelanggan AS pl ON pl.id = p.pelanggan_id
WHERE p.status = 'lunas'
  AND date_trunc('month', p.tanggal) = date_trunc('month', CURRENT_DATE)
GROUP BY pl.kota
ORDER BY omzet DESC`,
  },
  {
    id: 'omzet-per-kanal-minggu-ini',
    title: 'Omzet per kanal minggu ini',
    scenario: 'Bandingkan penjualan toko dan online sejak awal minggu.',
    job: 'Laporan',
    sql: `SELECT
  kanal,
  COUNT(*) AS jumlah_nota,
  SUM(total) AS omzet
FROM pesanan
WHERE status = 'lunas'
  AND tanggal >= date_trunc('week', CURRENT_DATE)
GROUP BY kanal
ORDER BY omzet DESC`,
  },
  {
    id: 'penjualan-tujuh-hari',
    title: 'Penjualan tujuh hari terakhir',
    scenario: 'Laporan singkat penjualan lunas seminggu ke belakang.',
    job: 'Laporan',
    sql: `SELECT
  tanggal,
  kanal,
  COUNT(*) AS jumlah_nota,
  SUM(total) AS omzet
FROM pesanan
WHERE status = 'lunas'
  AND tanggal >= CURRENT_DATE - INTERVAL '7' DAY
GROUP BY tanggal, kanal
ORDER BY tanggal, kanal`,
  },
  {
    id: 'omzet-bulan-ini-vs-lalu',
    title: 'Omzet bulan ini dibanding bulan lalu',
    scenario: 'Laporan banding omzet lunas dua bulan terakhir.',
    job: 'Laporan',
    sql: `SELECT
  date_trunc('month', tanggal) AS bulan,
  COUNT(*) AS jumlah_nota,
  SUM(total) AS omzet
FROM pesanan
WHERE status = 'lunas'
  AND tanggal >= date_trunc('month', CURRENT_DATE) - INTERVAL '1' MONTH
GROUP BY bulan
ORDER BY bulan`,
  },
  {
    id: 'nota-di-atas-rata-rata',
    title: 'Nota di atas rata-rata hari ini',
    scenario: 'Cari nota lunas hari ini yang nilainya di atas rata-rata nota hari yang sama.',
    job: 'Laporan',
    sql: `SELECT
  p.id,
  p.tanggal,
  p.total
FROM pesanan AS p
WHERE p.status = 'lunas'
  AND p.tanggal = CURRENT_DATE
  AND p.total > (
    SELECT AVG(h.total)
    FROM pesanan AS h
    WHERE h.status = 'lunas'
      AND h.tanggal = p.tanggal
  )
ORDER BY p.total DESC`,
  },
  {
    id: 'sepuluh-nota-terbesar',
    title: 'Sepuluh nota terbesar bulan ini',
    scenario: 'Siapkan sepuluh penjualan lunas paling besar untuk ditinjau pemilik.',
    job: 'Laporan',
    sql: `SELECT
  id,
  pelanggan_id,
  tanggal,
  kanal,
  total
FROM pesanan
WHERE status = 'lunas'
  AND date_trunc('month', tanggal) = date_trunc('month', CURRENT_DATE)
ORDER BY total DESC, id
LIMIT 10`,
  },
  {
    id: 'omzet-per-hari-dalam-minggu',
    title: 'Omzet menurut hari dalam minggu',
    scenario: 'Laporan pola penjualan lunas: hari mana yang ramai.',
    job: 'Laporan',
    sql: `SELECT
  CASE EXTRACT('dow' FROM tanggal)
    WHEN 0 THEN 'Minggu'
    WHEN 1 THEN 'Senin'
    WHEN 2 THEN 'Selasa'
    WHEN 3 THEN 'Rabu'
    WHEN 4 THEN 'Kamis'
    WHEN 5 THEN 'Jumat'
    ELSE 'Sabtu'
  END AS hari,
  COUNT(*) AS jumlah_nota,
  SUM(total) AS omzet
FROM pesanan
WHERE status = 'lunas'
  AND tanggal >= CURRENT_DATE - INTERVAL '84' DAY
GROUP BY hari, EXTRACT('dow' FROM tanggal)
ORDER BY EXTRACT('dow' FROM tanggal)`,
  },
  {
    id: 'nota-per-status',
    title: 'Jumlah nota per status',
    scenario: 'Laporan kasir: berapa nota lunas, menunggu, dan batal bulan ini.',
    job: 'Laporan',
    sql: `SELECT
  status,
  COUNT(*) AS jumlah_nota,
  SUM(total) AS nilai
FROM pesanan
WHERE date_trunc('month', tanggal) = date_trunc('month', CURRENT_DATE)
GROUP BY status
ORDER BY jumlah_nota DESC`,
  },
  {
    id: 'batal-versus-lunas',
    title: 'Batal dibanding lunas',
    scenario: 'Laporan mutu penjualan: porsi nota batal terhadap nota lunas.',
    job: 'Laporan',
    sql: `SELECT
  COUNT(*) FILTER (WHERE status = 'lunas') AS nota_lunas,
  COUNT(*) FILTER (WHERE status = 'batal') AS nota_batal,
  SUM(total) FILTER (WHERE status = 'lunas') AS omzet_lunas,
  SUM(total) FILTER (WHERE status = 'batal') AS nilai_batal
FROM pesanan
WHERE date_trunc('month', tanggal) = date_trunc('month', CURRENT_DATE)`,
  },
  {
    id: 'rata-rata-nota-per-kanal',
    title: 'Rata-rata nilai nota per kanal',
    scenario: 'Laporan kanal: rata-rata belanja lunas di toko dan online.',
    job: 'Laporan',
    sql: `SELECT
  kanal,
  COUNT(*) AS jumlah_nota,
  ROUND(AVG(total), 0) AS rata_rata_nota
FROM pesanan
WHERE status = 'lunas'
GROUP BY kanal
ORDER BY rata_rata_nota DESC`,
  },
  {
    id: 'omzet-kumulatif-bulan-ini',
    title: 'Omzet kumulatif bulan ini',
    scenario: 'Laporan berjalan: omzet lunas bertambah hari demi hari.',
    job: 'Laporan',
    sql: `SELECT
  tanggal,
  SUM(total) AS omzet_hari,
  SUM(SUM(total)) OVER (ORDER BY tanggal) AS omzet_kumulatif
FROM pesanan
WHERE status = 'lunas'
  AND date_trunc('month', tanggal) = date_trunc('month', CURRENT_DATE)
GROUP BY tanggal
ORDER BY tanggal`,
  },
  {
    id: 'hari-omzet-tertinggi',
    title: 'Hari dengan omzet tertinggi',
    scenario: 'Laporan bulan ini: hari penjualan lunas yang paling besar.',
    job: 'Laporan',
    sql: `SELECT
  tanggal,
  SUM(total) AS omzet
FROM pesanan
WHERE status = 'lunas'
  AND date_trunc('month', tanggal) = date_trunc('month', CURRENT_DATE)
GROUP BY tanggal
ORDER BY omzet DESC, tanggal
LIMIT 1`,
  },
  {
    id: 'pangsa-omzet-kanal',
    title: 'Pangsa omzet tiap kanal',
    scenario: 'Laporan komposisi penjualan lunas bulan ini per kanal.',
    job: 'Laporan',
    sql: `SELECT
  kanal,
  SUM(total) AS omzet,
  ROUND(100.0 * SUM(total) / SUM(SUM(total)) OVER (), 1) AS persen
FROM pesanan
WHERE status = 'lunas'
  AND date_trunc('month', tanggal) = date_trunc('month', CURRENT_DATE)
GROUP BY kanal
ORDER BY omzet DESC`,
  },
  {
    id: 'omzet-pelanggan-baru',
    title: 'Omzet dari pelanggan baru',
    scenario: 'Laporan akuisisi: omzet lunas dari pelanggan yang bergabung bulan ini.',
    job: 'Laporan',
    sql: `SELECT
  COUNT(DISTINCT pl.id) AS pelanggan_baru,
  COUNT(p.id) AS jumlah_nota,
  COALESCE(SUM(p.total), 0) AS omzet
FROM pelanggan AS pl
LEFT JOIN pesanan AS p
  ON p.pelanggan_id = pl.id
  AND p.status = 'lunas'
  AND date_trunc('month', p.tanggal) = date_trunc('month', CURRENT_DATE)
WHERE date_trunc('month', pl.bergabung) = date_trunc('month', CURRENT_DATE)`,
  },
  {
    id: 'nota-tanpa-baris',
    title: 'Nota tanpa baris produk',
    scenario: 'Laporan rekonsiliasi: nota lunas yang tidak punya baris penjualan.',
    job: 'Laporan',
    sql: `SELECT
  p.id,
  p.tanggal,
  p.total
FROM pesanan AS p
WHERE p.status = 'lunas'
  AND NOT EXISTS (
    SELECT 1
    FROM baris_pesanan AS b
    WHERE b.pesanan_id = p.id
  )
ORDER BY p.tanggal, p.id`,
  },
  {
    id: 'selisih-nota-dan-baris',
    title: 'Selisih total nota dan baris',
    scenario: 'Laporan kasir: nota yang jumlah barisnya tidak sama dengan total.',
    job: 'Laporan',
    sql: `SELECT
  p.id,
  p.tanggal,
  p.total,
  COALESCE(SUM(b.jumlah * b.harga_satuan), 0) AS nilai_baris
FROM pesanan AS p
LEFT JOIN baris_pesanan AS b ON b.pesanan_id = p.id
WHERE p.status = 'lunas'
GROUP BY p.id, p.tanggal, p.total
HAVING p.total <> COALESCE(SUM(b.jumlah * b.harga_satuan), 0)
ORDER BY p.tanggal, p.id`,
  },
  {
    id: 'omzet-per-kategori',
    title: 'Omzet per kategori produk',
    scenario: 'Laporan barang: nilai penjualan lunas tiap kategori bulan ini.',
    job: 'Laporan',
    sql: `SELECT
  pr.kategori,
  SUM(b.jumlah) AS qty,
  SUM(b.jumlah * b.harga_satuan) AS nilai
FROM baris_pesanan AS b
JOIN pesanan AS p ON p.id = b.pesanan_id
JOIN produk AS pr ON pr.id = b.produk_id
WHERE p.status = 'lunas'
  AND date_trunc('month', p.tanggal) = date_trunc('month', CURRENT_DATE)
GROUP BY pr.kategori
ORDER BY nilai DESC`,
  },
  {
    id: 'nilai-jual-vs-katalog',
    title: 'Nilai jual dibanding harga katalog',
    scenario: 'Laporan harga: selisih harga jual di nota terhadap harga produk.',
    job: 'Laporan',
    sql: `SELECT
  pr.nama,
  SUM(b.jumlah) AS qty,
  SUM(b.jumlah * b.harga_satuan) AS nilai_jual,
  SUM(b.jumlah * pr.harga) AS nilai_katalog,
  SUM(b.jumlah * b.harga_satuan) - SUM(b.jumlah * pr.harga) AS selisih
FROM baris_pesanan AS b
JOIN pesanan AS p ON p.id = b.pesanan_id
JOIN produk AS pr ON pr.id = b.produk_id
WHERE p.status = 'lunas'
  AND date_trunc('month', p.tanggal) = date_trunc('month', CURRENT_DATE)
GROUP BY pr.nama
ORDER BY selisih`,
  },
  {
    id: 'tiga-hari-nota-paling-sedikit',
    title: 'Tiga hari nota paling sedikit',
    scenario: 'Laporan sepi: hari dengan nota lunas paling sedikit dalam 30 hari.',
    job: 'Laporan',
    sql: `SELECT
  tanggal,
  COUNT(*) AS jumlah_nota,
  SUM(total) AS omzet
FROM pesanan
WHERE status = 'lunas'
  AND tanggal >= CURRENT_DATE - INTERVAL '30' DAY
GROUP BY tanggal
ORDER BY jumlah_nota, omzet, tanggal
LIMIT 3`,
  },
  {
    id: 'ringkasan-kuartal',
    title: 'Ringkasan kuartal berjalan',
    scenario: 'Laporan kuartal: jumlah nota dan omzet lunas sejak awal kuartal.',
    job: 'Laporan',
    sql: `SELECT
  COUNT(*) AS jumlah_nota,
  SUM(total) AS omzet,
  ROUND(AVG(total), 0) AS rata_rata_nota
FROM pesanan
WHERE status = 'lunas'
  AND tanggal >= date_trunc('quarter', CURRENT_DATE)`,
  },
  {
    id: 'omzet-per-minggu-tahun-ini',
    title: 'Omzet per minggu tahun ini',
    scenario: 'Laporan tahunan: omzet lunas dikelompokkan per minggu.',
    job: 'Laporan',
    sql: `SELECT
  date_trunc('week', tanggal) AS minggu,
  COUNT(*) AS jumlah_nota,
  SUM(total) AS omzet
FROM pesanan
WHERE status = 'lunas'
  AND date_trunc('year', tanggal) = date_trunc('year', CURRENT_DATE)
GROUP BY minggu
ORDER BY minggu`,
  },
  {
    id: 'nota-lunas-bernilai-nol',
    title: 'Nota lunas bernilai nol',
    scenario: 'Laporan anomali kasir: nota berstatus lunas tetapi totalnya nol.',
    job: 'Laporan',
    sql: `SELECT
  id,
  pelanggan_id,
  tanggal,
  kanal
FROM pesanan
WHERE status = 'lunas'
  AND total = 0
ORDER BY tanggal, id`,
  },
  {
    id: 'ringkasan-rapat-pagi',
    title: 'Ringkasan satu baris untuk rapat pagi',
    scenario: 'Laporan harian kemarin: nota, omzet, dan pelanggan unik.',
    job: 'Laporan',
    sql: `SELECT
  COUNT(*) AS jumlah_nota,
  COALESCE(SUM(total), 0) AS omzet,
  COUNT(DISTINCT pelanggan_id) AS pelanggan
FROM pesanan
WHERE status = 'lunas'
  AND tanggal = CURRENT_DATE - INTERVAL '1' DAY`,
  },
  {
    id: 'peringkat-kota-omzet',
    title: 'Peringkat kota menurut omzet',
    scenario: 'Laporan wilayah: urutkan kota dari omzet lunas bulan ini.',
    job: 'Laporan',
    sql: `SELECT
  pl.kota,
  SUM(p.total) AS omzet,
  RANK() OVER (ORDER BY SUM(p.total) DESC) AS peringkat
FROM pesanan AS p
JOIN pelanggan AS pl ON pl.id = p.pelanggan_id
WHERE p.status = 'lunas'
  AND date_trunc('month', p.tanggal) = date_trunc('month', CURRENT_DATE)
GROUP BY pl.kota
ORDER BY peringkat, pl.kota`,
  },
  {
    id: 'daftar-pelanggan-kota',
    title: 'Daftar pelanggan dan kota',
    scenario: 'Siapkan daftar pelanggan beserta kota untuk tim lapangan.',
    job: 'Pelanggan',
    sql: `SELECT id, nama, kota, email
FROM pelanggan
ORDER BY kota, nama`,
  },
  {
    id: 'pelanggan-tanpa-email',
    title: 'Pelanggan tanpa email',
    scenario: 'Daftar pelanggan yang emailnya kosong, untuk dilengkapi kasir.',
    job: 'Pelanggan',
    sql: `SELECT id, nama, kota
FROM pelanggan
WHERE email IS NULL OR trim(email) = ''
ORDER BY nama`,
  },
  {
    id: 'pelanggan-belum-pernah-pesan',
    title: 'Pelanggan yang belum pernah pesan',
    scenario: 'Cari pelanggan tercatat yang belum punya nota sama sekali.',
    job: 'Pelanggan',
    sql: `SELECT pl.id, pl.nama, pl.kota, pl.bergabung
FROM pelanggan AS pl
WHERE NOT EXISTS (
  SELECT 1
  FROM pesanan AS p
  WHERE p.pelanggan_id = pl.id
)
ORDER BY pl.bergabung, pl.id`,
  },
  {
    id: 'pelanggan-baru-30-hari',
    title: 'Pelanggan baru 30 hari',
    scenario: 'Daftar pelanggan yang bergabung dalam 30 hari terakhir.',
    job: 'Pelanggan',
    sql: `SELECT id, nama, kota, bergabung
FROM pelanggan
WHERE bergabung >= CURRENT_DATE - INTERVAL '30' DAY
ORDER BY bergabung DESC, id`,
  },
  {
    id: 'pelanggan-tidak-belanja-90-hari',
    title: 'Pelanggan tidak belanja 90 hari',
    scenario: 'Cari pelanggan yang nota lunas terakhirnya sudah lewat 90 hari.',
    job: 'Pelanggan',
    sql: `SELECT
  pl.id,
  pl.nama,
  pl.kota,
  MAX(p.tanggal) AS terakhir
FROM pelanggan AS pl
JOIN pesanan AS p ON p.pelanggan_id = pl.id AND p.status = 'lunas'
GROUP BY pl.id, pl.nama, pl.kota
HAVING MAX(p.tanggal) < CURRENT_DATE - INTERVAL '90' DAY
ORDER BY terakhir, pl.nama`,
  },
  {
    id: 'lima-pelanggan-omzet-terbesar',
    title: 'Lima pelanggan omzet terbesar',
    scenario: 'Siapkan lima pelanggan dengan omzet lunas terbesar untuk dijaga.',
    job: 'Pelanggan',
    sql: `SELECT
  pl.id,
  pl.nama,
  pl.kota,
  SUM(p.total) AS omzet
FROM pelanggan AS pl
JOIN pesanan AS p ON p.pelanggan_id = pl.id
WHERE p.status = 'lunas'
GROUP BY pl.id, pl.nama, pl.kota
ORDER BY omzet DESC, pl.id
LIMIT 5`,
  },
  {
    id: 'pelanggan-yogyakarta',
    title: 'Pelanggan di Yogyakarta',
    scenario: 'Daftar pelanggan kota Yogyakarta untuk kunjungan lapangan.',
    job: 'Pelanggan',
    sql: `SELECT id, nama, email, total_belanja
FROM pelanggan
WHERE kota = 'Yogyakarta'
ORDER BY nama`,
  },
  {
    id: 'jumlah-pelanggan-per-kota',
    title: 'Jumlah pelanggan per kota',
    scenario: 'Hitung pelanggan tercatat di tiap kota.',
    job: 'Pelanggan',
    sql: `SELECT kota, COUNT(*) AS jumlah
FROM pelanggan
GROUP BY kota
ORDER BY jumlah DESC, kota`,
  },
  {
    id: 'pelanggan-lebih-dari-satu-nota',
    title: 'Pelanggan dengan lebih dari satu nota',
    scenario: 'Cari pelanggan yang sudah punya lebih dari satu nota lunas.',
    job: 'Pelanggan',
    sql: `SELECT
  pl.id,
  pl.nama,
  COUNT(*) AS jumlah_nota,
  SUM(p.total) AS omzet
FROM pelanggan AS pl
JOIN pesanan AS p ON p.pelanggan_id = pl.id
WHERE p.status = 'lunas'
GROUP BY pl.id, pl.nama
HAVING COUNT(*) > 1
ORDER BY jumlah_nota DESC, pl.nama`,
  },
  {
    id: 'pelanggan-hanya-online',
    title: 'Pelanggan yang hanya belanja online',
    scenario: 'Daftar pelanggan yang nota lunasnya semua lewat kanal online.',
    job: 'Pelanggan',
    sql: `SELECT
  pl.id,
  pl.nama,
  pl.kota
FROM pelanggan AS pl
JOIN pesanan AS p ON p.pelanggan_id = pl.id AND p.status = 'lunas'
GROUP BY pl.id, pl.nama, pl.kota
HAVING COUNT(*) = COUNT(*) FILTER (WHERE p.kanal = 'online')
ORDER BY pl.nama`,
  },
  {
    id: 'pelanggan-hanya-toko',
    title: 'Pelanggan yang hanya belanja di toko',
    scenario: 'Daftar pelanggan yang nota lunasnya tidak pernah lewat online.',
    job: 'Pelanggan',
    sql: `SELECT
  pl.id,
  pl.nama,
  pl.kota
FROM pelanggan AS pl
JOIN pesanan AS p ON p.pelanggan_id = pl.id AND p.status = 'lunas'
GROUP BY pl.id, pl.nama, pl.kota
HAVING COUNT(*) FILTER (WHERE p.kanal = 'online') = 0
ORDER BY pl.nama`,
  },
  {
    id: 'rata-omzet-pelanggan-per-kota',
    title: 'Rata-rata omzet pelanggan per kota',
    scenario: 'Laporan kota: rata-rata omzet lunas tiap pelanggan.',
    job: 'Pelanggan',
    sql: `SELECT
  kota,
  COUNT(*) AS pelanggan,
  ROUND(AVG(omzet), 0) AS rata_omzet
FROM (
  SELECT
    pl.kota,
    pl.id,
    SUM(p.total) AS omzet
  FROM pelanggan AS pl
  JOIN pesanan AS p ON p.pelanggan_id = pl.id
  WHERE p.status = 'lunas'
  GROUP BY pl.kota, pl.id
) AS per_pelanggan
GROUP BY kota
ORDER BY rata_omzet DESC`,
  },
  {
    id: 'nota-terakhir-batal',
    title: 'Pelanggan yang nota terakhirnya batal',
    scenario: 'Cari pelanggan yang transaksi terbarunya berstatus batal.',
    job: 'Pelanggan',
    sql: `SELECT
  pl.id,
  pl.nama,
  terakhir.tanggal,
  terakhir.total
FROM pelanggan AS pl
JOIN pesanan AS terakhir ON terakhir.pelanggan_id = pl.id
WHERE terakhir.status = 'batal'
  AND NOT EXISTS (
    SELECT 1
    FROM pesanan AS lain
    WHERE lain.pelanggan_id = pl.id
      AND (
        lain.tanggal > terakhir.tanggal
        OR (lain.tanggal = terakhir.tanggal AND lain.id > terakhir.id)
      )
  )
ORDER BY terakhir.tanggal DESC, pl.nama`,
  },
  {
    id: 'pelanggan-lama-di-bawah-rata-rata',
    title: 'Pelanggan lama di bawah rata-rata',
    scenario: 'Cari pelanggan yang bergabung lebih dari setahun dan omzetnya di bawah rata-rata.',
    job: 'Pelanggan',
    sql: `WITH omzet_pelanggan AS (
  SELECT
    pl.id,
    pl.nama,
    pl.bergabung,
    COALESCE(SUM(p.total), 0) AS omzet
  FROM pelanggan AS pl
  LEFT JOIN pesanan AS p
    ON p.pelanggan_id = pl.id
    AND p.status = 'lunas'
  GROUP BY pl.id, pl.nama, pl.bergabung
)
SELECT id, nama, bergabung, omzet
FROM omzet_pelanggan
WHERE bergabung < CURRENT_DATE - INTERVAL '1' YEAR
  AND omzet < (SELECT AVG(omzet) FROM omzet_pelanggan)
ORDER BY omzet, nama`,
  },
  {
    id: 'email-ganda',
    title: 'Email pelanggan yang ganda',
    scenario: 'Bersihkan data pelanggan: email yang dipakai lebih dari satu orang.',
    job: 'Pelanggan',
    sql: `SELECT email, COUNT(*) AS jumlah
FROM pelanggan
WHERE email IS NOT NULL AND trim(email) <> ''
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY jumlah DESC, email`,
  },
  {
    id: 'pertama-kali-belanja-bulan-ini',
    title: 'Pelanggan pertama kali belanja bulan ini',
    scenario: 'Daftar pelanggan yang nota lunas pertamanya jatuh di bulan ini.',
    job: 'Pelanggan',
    sql: `SELECT
  pl.id,
  pl.nama,
  pl.kota,
  MIN(p.tanggal) AS pertama
FROM pelanggan AS pl
JOIN pesanan AS p ON p.pelanggan_id = pl.id AND p.status = 'lunas'
GROUP BY pl.id, pl.nama, pl.kota
HAVING date_trunc('month', MIN(p.tanggal)) = date_trunc('month', CURRENT_DATE)
ORDER BY pertama, pl.nama`,
  },
  {
    id: 'jarak-hari-sejak-belanja',
    title: 'Jarak hari sejak belanja terakhir',
    scenario: 'Lihat berapa hari sejak tiap pelanggan terakhir lunas.',
    job: 'Pelanggan',
    sql: `SELECT
  pl.id,
  pl.nama,
  MAX(p.tanggal) AS terakhir,
  date_diff('day', MAX(p.tanggal), CURRENT_DATE) AS hari
FROM pelanggan AS pl
JOIN pesanan AS p ON p.pelanggan_id = pl.id AND p.status = 'lunas'
GROUP BY pl.id, pl.nama
ORDER BY hari DESC, pl.nama`,
  },
  {
    id: 'total-belanja-tidak-cocok',
    title: 'Total belanja tidak cocok dengan nota',
    scenario: 'Rekonsiliasi pelanggan: total belanja beda dari jumlah nota lunas.',
    job: 'Pelanggan',
    sql: `SELECT
  pl.id,
  pl.nama,
  pl.total_belanja,
  COALESCE(SUM(p.total), 0) AS jumlah_nota
FROM pelanggan AS pl
LEFT JOIN pesanan AS p
  ON p.pelanggan_id = pl.id
  AND p.status = 'lunas'
GROUP BY pl.id, pl.nama, pl.total_belanja
HAVING pl.total_belanja IS DISTINCT FROM COALESCE(SUM(p.total), 0)
ORDER BY pl.nama`,
  },
  {
    id: 'pelanggan-teratas-per-kota',
    title: 'Pelanggan teratas per kota',
    scenario: 'Satu pelanggan dengan omzet lunas terbesar di tiap kota.',
    job: 'Pelanggan',
    sql: `SELECT kota, nama, omzet
FROM (
  SELECT
    pl.kota,
    pl.nama,
    SUM(p.total) AS omzet,
    ROW_NUMBER() OVER (
      PARTITION BY pl.kota
      ORDER BY SUM(p.total) DESC, pl.id
    ) AS peringkat
  FROM pelanggan AS pl
  JOIN pesanan AS p ON p.pelanggan_id = pl.id
  WHERE p.status = 'lunas'
  GROUP BY pl.kota, pl.nama, pl.id
) AS peringkat_kota
WHERE peringkat = 1
ORDER BY kota`,
  },
  {
    id: 'pelanggan-tanpa-kota',
    title: 'Pelanggan tanpa kota',
    scenario: 'Lengkapi data pelanggan yang kotanya kosong.',
    job: 'Pelanggan',
    sql: `SELECT id, nama, email
FROM pelanggan
WHERE kota IS NULL OR trim(kota) = ''
ORDER BY nama`,
  },
  {
    id: 'pelanggan-dua-kanal',
    title: 'Pelanggan yang belanja di dua kanal',
    scenario: 'Cari pelanggan yang punya nota lunas di toko dan online.',
    job: 'Pelanggan',
    sql: `SELECT
  pl.id,
  pl.nama,
  COUNT(DISTINCT p.kanal) AS kanal
FROM pelanggan AS pl
JOIN pesanan AS p ON p.pelanggan_id = pl.id AND p.status = 'lunas'
GROUP BY pl.id, pl.nama
HAVING COUNT(DISTINCT p.kanal) >= 2
ORDER BY pl.nama`,
  },
  {
    id: 'cohort-bulan-bergabung',
    title: 'Pelanggan per bulan bergabung',
    scenario: 'Laporan pelanggan: yang bergabung tiap bulan dan masih punya nota lunas.',
    job: 'Pelanggan',
    sql: `SELECT
  date_trunc('month', pl.bergabung) AS bulan_gabung,
  COUNT(DISTINCT pl.id) AS pelanggan,
  COUNT(DISTINCT p.pelanggan_id) AS masih_belanja
FROM pelanggan AS pl
LEFT JOIN pesanan AS p
  ON p.pelanggan_id = pl.id
  AND p.status = 'lunas'
GROUP BY bulan_gabung
ORDER BY bulan_gabung`,
  },
  {
    id: 'pelanggan-satu-nota',
    title: 'Pelanggan dengan satu nota saja',
    scenario: 'Cari pelanggan yang baru sekali nota lunas, untuk diajak kembali.',
    job: 'Pelanggan',
    sql: `SELECT
  pl.id,
  pl.nama,
  pl.kota,
  MIN(p.tanggal) AS tanggal,
  SUM(p.total) AS omzet
FROM pelanggan AS pl
JOIN pesanan AS p ON p.pelanggan_id = pl.id AND p.status = 'lunas'
GROUP BY pl.id, pl.nama, pl.kota
HAVING COUNT(*) = 1
ORDER BY tanggal DESC`,
  },
  {
    id: 'pelanggan-nota-menunggu',
    title: 'Pelanggan dengan nota menunggu',
    scenario: 'Daftar pelanggan yang masih punya pesanan berstatus menunggu.',
    job: 'Pelanggan',
    sql: `SELECT DISTINCT
  pl.id,
  pl.nama,
  pl.kota
FROM pelanggan AS pl
JOIN pesanan AS p ON p.pelanggan_id = pl.id
WHERE p.status = 'menunggu'
ORDER BY pl.nama`,
  },
  {
    id: 'pelanggan-yogyakarta-omzet-besar',
    title: 'Pelanggan Yogyakarta omzet besar',
    scenario: 'Siapkan kunjungan pelanggan Yogyakarta dengan omzet lunas di atas 500000.',
    job: 'Pelanggan',
    sql: `SELECT
  pl.id,
  pl.nama,
  SUM(p.total) AS omzet
FROM pelanggan AS pl
JOIN pesanan AS p ON p.pelanggan_id = pl.id
WHERE pl.kota = 'Yogyakarta'
  AND p.status = 'lunas'
GROUP BY pl.id, pl.nama
HAVING SUM(p.total) > 500000
ORDER BY omzet DESC`,
  },
  {
    id: 'detail-baris-bulan-ini',
    title: 'Detail baris penjualan bulan ini',
    scenario: 'Rincian barang terjual pada nota lunas bulan berjalan.',
    job: 'Penjualan',
    sql: `SELECT
  p.tanggal,
  p.id AS nota,
  pr.nama AS produk,
  b.jumlah,
  b.harga_satuan,
  b.jumlah * b.harga_satuan AS nilai
FROM baris_pesanan AS b
JOIN pesanan AS p ON p.id = b.pesanan_id
JOIN produk AS pr ON pr.id = b.produk_id
WHERE p.status = 'lunas'
  AND date_trunc('month', p.tanggal) = date_trunc('month', CURRENT_DATE)
ORDER BY p.tanggal, p.id, pr.nama`,
  },
  {
    id: 'produk-terlaris-qty',
    title: 'Produk terlaris menurut jumlah',
    scenario: 'Sepuluh produk dengan qty penjualan lunas terbanyak bulan ini.',
    job: 'Penjualan',
    sql: `SELECT
  pr.nama,
  SUM(b.jumlah) AS qty
FROM baris_pesanan AS b
JOIN pesanan AS p ON p.id = b.pesanan_id
JOIN produk AS pr ON pr.id = b.produk_id
WHERE p.status = 'lunas'
  AND date_trunc('month', p.tanggal) = date_trunc('month', CURRENT_DATE)
GROUP BY pr.nama
ORDER BY qty DESC, pr.nama
LIMIT 10`,
  },
  {
    id: 'produk-terlaris-nilai',
    title: 'Produk terlaris menurut nilai',
    scenario: 'Sepuluh produk dengan nilai penjualan lunas terbesar bulan ini.',
    job: 'Penjualan',
    sql: `SELECT
  pr.nama,
  SUM(b.jumlah * b.harga_satuan) AS nilai
FROM baris_pesanan AS b
JOIN pesanan AS p ON p.id = b.pesanan_id
JOIN produk AS pr ON pr.id = b.produk_id
WHERE p.status = 'lunas'
  AND date_trunc('month', p.tanggal) = date_trunc('month', CURRENT_DATE)
GROUP BY pr.nama
ORDER BY nilai DESC, pr.nama
LIMIT 10`,
  },
  {
    id: 'penjualan-per-kategori',
    title: 'Penjualan per kategori',
    scenario: 'Qty dan nilai penjualan lunas tiap kategori produk.',
    job: 'Penjualan',
    sql: `SELECT
  pr.kategori,
  SUM(b.jumlah) AS qty,
  SUM(b.jumlah * b.harga_satuan) AS nilai
FROM baris_pesanan AS b
JOIN pesanan AS p ON p.id = b.pesanan_id
JOIN produk AS pr ON pr.id = b.produk_id
WHERE p.status = 'lunas'
GROUP BY pr.kategori
ORDER BY nilai DESC`,
  },
  {
    id: 'nota-lunas-nama-pelanggan',
    title: 'Nota lunas beserta nama pelanggan',
    scenario: 'Daftar penjualan lunas hari ini lengkap dengan nama pelanggan.',
    job: 'Penjualan',
    sql: `SELECT
  p.id,
  p.tanggal,
  pl.nama,
  p.kanal,
  p.total
FROM pesanan AS p
JOIN pelanggan AS pl ON pl.id = p.pelanggan_id
WHERE p.status = 'lunas'
  AND p.tanggal = CURRENT_DATE
ORDER BY p.id`,
  },
  {
    id: 'jual-di-bawah-katalog',
    title: 'Jual di bawah harga katalog',
    scenario: 'Baris penjualan yang harga satuannya lebih rendah dari harga produk.',
    job: 'Penjualan',
    sql: `SELECT
  p.tanggal,
  p.id AS nota,
  pr.nama,
  b.harga_satuan,
  pr.harga AS harga_katalog
FROM baris_pesanan AS b
JOIN pesanan AS p ON p.id = b.pesanan_id
JOIN produk AS pr ON pr.id = b.produk_id
WHERE p.status = 'lunas'
  AND b.harga_satuan < pr.harga
ORDER BY p.tanggal, p.id`,
  },
  {
    id: 'jual-di-atas-katalog',
    title: 'Jual di atas harga katalog',
    scenario: 'Baris penjualan yang harga satuannya lebih tinggi dari harga produk.',
    job: 'Penjualan',
    sql: `SELECT
  p.tanggal,
  p.id AS nota,
  pr.nama,
  b.harga_satuan,
  pr.harga AS harga_katalog
FROM baris_pesanan AS b
JOIN pesanan AS p ON p.id = b.pesanan_id
JOIN produk AS pr ON pr.id = b.produk_id
WHERE p.status = 'lunas'
  AND b.harga_satuan > pr.harga
ORDER BY p.tanggal, p.id`,
  },
  {
    id: 'penjualan-online-hari-ini',
    title: 'Penjualan online hari ini',
    scenario: 'Nota lunas kanal online yang tanggalnya hari ini.',
    job: 'Penjualan',
    sql: `SELECT id, pelanggan_id, total
FROM pesanan
WHERE status = 'lunas'
  AND kanal = 'online'
  AND tanggal = CURRENT_DATE
ORDER BY id`,
  },
  {
    id: 'penjualan-toko-kemarin',
    title: 'Penjualan toko kemarin',
    scenario: 'Nota lunas di kanal toko untuk tanggal kemarin.',
    job: 'Penjualan',
    sql: `SELECT id, pelanggan_id, total
FROM pesanan
WHERE status = 'lunas'
  AND kanal = 'toko'
  AND tanggal = CURRENT_DATE - INTERVAL '1' DAY
ORDER BY id`,
  },
  {
    id: 'produk-tidak-laku-30-hari',
    title: 'Produk tidak laku 30 hari',
    scenario: 'Produk yang tidak muncul di nota lunas 30 hari terakhir.',
    job: 'Penjualan',
    sql: `SELECT pr.id, pr.nama, pr.kategori, pr.stok
FROM produk AS pr
WHERE NOT EXISTS (
  SELECT 1
  FROM baris_pesanan AS b
  JOIN pesanan AS p ON p.id = b.pesanan_id
  WHERE b.produk_id = pr.id
    AND p.status = 'lunas'
    AND p.tanggal >= CURRENT_DATE - INTERVAL '30' DAY
)
ORDER BY pr.kategori, pr.nama`,
  },
  {
    id: 'pasangan-produk-se-nota',
    title: 'Pasangan produk dalam satu nota',
    scenario: 'Cari dua produk yang sering muncul bersama di nota lunas.',
    job: 'Penjualan',
    sql: `SELECT
  pa.nama AS produk_a,
  pb.nama AS produk_b,
  COUNT(*) AS nota
FROM baris_pesanan AS a
JOIN baris_pesanan AS c
  ON c.pesanan_id = a.pesanan_id
  AND c.produk_id > a.produk_id
JOIN pesanan AS p ON p.id = a.pesanan_id
JOIN produk AS pa ON pa.id = a.produk_id
JOIN produk AS pb ON pb.id = c.produk_id
WHERE p.status = 'lunas'
GROUP BY pa.nama, pb.nama
ORDER BY nota DESC, produk_a, produk_b
LIMIT 20`,
  },
  {
    id: 'rata-item-per-nota',
    title: 'Rata-rata jumlah item per nota',
    scenario: 'Berapa qty barang rata-rata di tiap nota lunas bulan ini.',
    job: 'Penjualan',
    sql: `SELECT ROUND(AVG(qty), 1) AS rata_qty
FROM (
  SELECT p.id, SUM(b.jumlah) AS qty
  FROM pesanan AS p
  JOIN baris_pesanan AS b ON b.pesanan_id = p.id
  WHERE p.status = 'lunas'
    AND date_trunc('month', p.tanggal) = date_trunc('month', CURRENT_DATE)
  GROUP BY p.id
) AS per_nota`,
  },
  {
    id: 'nota-lebih-dari-lima-baris',
    title: 'Nota dengan lebih dari lima baris',
    scenario: 'Cari nota lunas yang baris produknya lebih dari lima.',
    job: 'Penjualan',
    sql: `SELECT
  p.id,
  p.tanggal,
  COUNT(*) AS baris,
  p.total
FROM pesanan AS p
JOIN baris_pesanan AS b ON b.pesanan_id = p.id
WHERE p.status = 'lunas'
GROUP BY p.id, p.tanggal, p.total
HAVING COUNT(*) > 5
ORDER BY baris DESC, p.tanggal`,
  },
  {
    id: 'selisih-harga-jual',
    title: 'Selisih harga jual terhadap katalog',
    scenario: 'Total selisih harga jual dan harga katalog pada nota lunas bulan ini.',
    job: 'Penjualan',
    sql: `SELECT
  SUM(b.jumlah * (pr.harga - b.harga_satuan)) AS selisih
FROM baris_pesanan AS b
JOIN pesanan AS p ON p.id = b.pesanan_id
JOIN produk AS pr ON pr.id = b.produk_id
WHERE p.status = 'lunas'
  AND date_trunc('month', p.tanggal) = date_trunc('month', CURRENT_DATE)`,
  },
  {
    id: 'nilai-penjualan-batal',
    title: 'Nilai penjualan yang batal',
    scenario: 'Berapa nilai nota batal dalam bulan berjalan.',
    job: 'Penjualan',
    sql: `SELECT
  COUNT(*) AS jumlah_nota,
  COALESCE(SUM(total), 0) AS nilai
FROM pesanan
WHERE status = 'batal'
  AND date_trunc('month', tanggal) = date_trunc('month', CURRENT_DATE)`,
  },
  {
    id: 'produk-hanya-laku-online',
    title: 'Produk yang hanya laku online',
    scenario: 'Produk yang penjualannya cuma lewat kanal online.',
    job: 'Penjualan',
    sql: `SELECT
  pr.nama,
  SUM(b.jumlah) AS qty
FROM produk AS pr
JOIN baris_pesanan AS b ON b.produk_id = pr.id
JOIN pesanan AS p ON p.id = b.pesanan_id AND p.status = 'lunas'
GROUP BY pr.nama
HAVING COUNT(*) FILTER (WHERE p.kanal <> 'online') = 0
ORDER BY qty DESC, pr.nama`,
  },
  {
    id: 'produk-hanya-laku-toko',
    title: 'Produk yang hanya laku di toko',
    scenario: 'Produk yang penjualannya tidak pernah lewat online.',
    job: 'Penjualan',
    sql: `SELECT
  pr.nama,
  SUM(b.jumlah) AS qty
FROM produk AS pr
JOIN baris_pesanan AS b ON b.produk_id = pr.id
JOIN pesanan AS p ON p.id = b.pesanan_id AND p.status = 'lunas'
GROUP BY pr.nama
HAVING COUNT(*) FILTER (WHERE p.kanal = 'online') = 0
ORDER BY qty DESC, pr.nama`,
  },
  {
    id: 'penjualan-kumulatif-produk',
    title: 'Penjualan kumulatif per produk',
    scenario: 'Qty lunas berjalan tiap produk, diurut dari tanggal nota bulan ini.',
    job: 'Penjualan',
    sql: `SELECT
  pr.nama,
  p.tanggal,
  SUM(b.jumlah) AS qty_hari,
  SUM(SUM(b.jumlah)) OVER (
    PARTITION BY pr.id
    ORDER BY p.tanggal
  ) AS qty_kumulatif
FROM baris_pesanan AS b
JOIN pesanan AS p ON p.id = b.pesanan_id
JOIN produk AS pr ON pr.id = b.produk_id
WHERE p.status = 'lunas'
  AND date_trunc('month', p.tanggal) = date_trunc('month', CURRENT_DATE)
GROUP BY pr.id, pr.nama, p.tanggal
ORDER BY pr.nama, p.tanggal`,
  },
  {
    id: 'pangsa-nilai-kategori',
    title: 'Pangsa nilai tiap kategori',
    scenario: 'Persen nilai penjualan lunas tiap kategori bulan ini.',
    job: 'Penjualan',
    sql: `SELECT
  pr.kategori,
  SUM(b.jumlah * b.harga_satuan) AS nilai,
  ROUND(
    100.0 * SUM(b.jumlah * b.harga_satuan)
      / SUM(SUM(b.jumlah * b.harga_satuan)) OVER (),
    1
  ) AS persen
FROM baris_pesanan AS b
JOIN pesanan AS p ON p.id = b.pesanan_id
JOIN produk AS pr ON pr.id = b.produk_id
WHERE p.status = 'lunas'
  AND date_trunc('month', p.tanggal) = date_trunc('month', CURRENT_DATE)
GROUP BY pr.kategori
ORDER BY nilai DESC`,
  },
  {
    id: 'nota-satu-kategori',
    title: 'Nota yang isinya satu kategori',
    scenario: 'Cari nota lunas yang semua barisnya dari kategori yang sama.',
    job: 'Penjualan',
    sql: `SELECT
  p.id,
  p.tanggal,
  MIN(pr.kategori) AS kategori,
  p.total
FROM pesanan AS p
JOIN baris_pesanan AS b ON b.pesanan_id = p.id
JOIN produk AS pr ON pr.id = b.produk_id
WHERE p.status = 'lunas'
GROUP BY p.id, p.tanggal, p.total
HAVING COUNT(DISTINCT pr.kategori) = 1
ORDER BY p.tanggal, p.id`,
  },
  {
    id: 'rata-harga-jual-kategori',
    title: 'Rata-rata harga jual per kategori',
    scenario: 'Harga satuan rata-rata tertimbang qty pada penjualan lunas.',
    job: 'Penjualan',
    sql: `SELECT
  pr.kategori,
  ROUND(SUM(b.jumlah * b.harga_satuan) / NULLIF(SUM(b.jumlah), 0), 0) AS rata_harga
FROM baris_pesanan AS b
JOIN pesanan AS p ON p.id = b.pesanan_id
JOIN produk AS pr ON pr.id = b.produk_id
WHERE p.status = 'lunas'
GROUP BY pr.kategori
ORDER BY rata_harga DESC`,
  },
  {
    id: 'penjualan-14-hari-banding',
    title: 'Penjualan 14 hari dibanding sebelumnya',
    scenario: 'Banding nilai penjualan lunas 14 hari ini dengan 14 hari sebelumnya.',
    job: 'Penjualan',
    sql: `SELECT periode, jumlah_nota, omzet
FROM (
  SELECT
    CASE
      WHEN tanggal > CURRENT_DATE - INTERVAL '14' DAY THEN '14 hari ini'
      ELSE '14 hari sebelumnya'
    END AS periode,
    CASE
      WHEN tanggal > CURRENT_DATE - INTERVAL '14' DAY THEN 1
      ELSE 0
    END AS urut,
    COUNT(*) AS jumlah_nota,
    SUM(total) AS omzet
  FROM pesanan
  WHERE status = 'lunas'
    AND tanggal > CURRENT_DATE - INTERVAL '28' DAY
  GROUP BY periode, urut
) AS banding
ORDER BY urut`,
  },
  {
    id: 'qty-tertinggi-satu-nota',
    title: 'Qty tertinggi dalam satu nota',
    scenario: 'Baris penjualan dengan jumlah barang paling besar pada satu nota.',
    job: 'Penjualan',
    sql: `SELECT
  p.id AS nota,
  p.tanggal,
  pr.nama,
  b.jumlah
FROM baris_pesanan AS b
JOIN pesanan AS p ON p.id = b.pesanan_id
JOIN produk AS pr ON pr.id = b.produk_id
WHERE p.status = 'lunas'
ORDER BY b.jumlah DESC, p.tanggal DESC
LIMIT 15`,
  },
  {
    id: 'nota-menunggu-lewat-tiga-hari',
    title: 'Nota menunggu lebih dari tiga hari',
    scenario: 'Pesanan status menunggu yang tanggalnya sudah lewat tiga hari.',
    job: 'Penjualan',
    sql: `SELECT
  id,
  pelanggan_id,
  tanggal,
  total
FROM pesanan
WHERE status = 'menunggu'
  AND tanggal < CURRENT_DATE - INTERVAL '3' DAY
ORDER BY tanggal, id`,
  },
  {
    id: 'penjualan-pelanggan-kategori',
    title: 'Penjualan per pelanggan dan kategori',
    scenario: 'Nilai belanja lunas tiap pelanggan, dipecah per kategori produk.',
    job: 'Penjualan',
    sql: `SELECT
  pl.nama,
  pr.kategori,
  SUM(b.jumlah * b.harga_satuan) AS nilai
FROM baris_pesanan AS b
JOIN pesanan AS p ON p.id = b.pesanan_id
JOIN pelanggan AS pl ON pl.id = p.pelanggan_id
JOIN produk AS pr ON pr.id = b.produk_id
WHERE p.status = 'lunas'
  AND date_trunc('month', p.tanggal) = date_trunc('month', CURRENT_DATE)
GROUP BY pl.nama, pr.kategori
ORDER BY pl.nama, nilai DESC`,
  },
  {
    id: 'stok-di-bawah-sepuluh',
    title: 'Produk dengan stok di bawah sepuluh',
    scenario: 'Daftar barang yang stoknya kurang dari 10 untuk dicek gudang.',
    job: 'Stok',
    sql: `SELECT id, nama, kategori, harga, stok
FROM produk
WHERE stok < 10
ORDER BY stok, nama`,
  },
  {
    id: 'stok-nol',
    title: 'Produk stok habis',
    scenario: 'Barang yang stoknya nol dan perlu diputuskan diisi lagi atau tidak.',
    job: 'Stok',
    sql: `SELECT id, nama, kategori, harga
FROM produk
WHERE stok = 0
ORDER BY kategori, nama`,
  },
  {
    id: 'nilai-persediaan-produk',
    title: 'Nilai persediaan per produk',
    scenario: 'Hitung nilai stok tiap barang dari stok kali harga.',
    job: 'Stok',
    sql: `SELECT
  nama,
  kategori,
  stok,
  harga,
  stok * harga AS nilai
FROM produk
WHERE stok > 0
ORDER BY nilai DESC, nama`,
  },
  {
    id: 'nilai-persediaan-kategori',
    title: 'Nilai persediaan per kategori',
    scenario: 'Ringkas nilai stok gudang per kategori produk.',
    job: 'Stok',
    sql: `SELECT
  kategori,
  SUM(stok) AS qty,
  SUM(stok * harga) AS nilai
FROM produk
GROUP BY kategori
ORDER BY nilai DESC`,
  },
  {
    id: 'stok-tinggi-tidak-laku',
    title: 'Stok tinggi tetapi tidak laku',
    scenario: 'Produk yang stoknya di atas 50 dan tidak ada penjualan lunas 30 hari.',
    job: 'Stok',
    sql: `SELECT pr.id, pr.nama, pr.stok, pr.harga
FROM produk AS pr
WHERE pr.stok > 50
  AND NOT EXISTS (
    SELECT 1
    FROM baris_pesanan AS b
    JOIN pesanan AS p ON p.id = b.pesanan_id
    WHERE b.produk_id = pr.id
      AND p.status = 'lunas'
      AND p.tanggal >= CURRENT_DATE - INTERVAL '30' DAY
  )
ORDER BY pr.stok DESC, pr.nama`,
  },
  {
    id: 'perkiraan-hari-stok',
    title: 'Perkiraan hari stok tersisa',
    scenario: 'Stok dibagi rata-rata qty harian dari penjualan lunas 30 hari.',
    job: 'Stok',
    sql: `SELECT
  pr.nama,
  pr.stok,
  SUM(b.jumlah) AS qty_30_hari,
  ROUND(pr.stok / NULLIF(SUM(b.jumlah) / 30.0, 0), 1) AS hari_stok
FROM produk AS pr
JOIN baris_pesanan AS b ON b.produk_id = pr.id
JOIN pesanan AS p ON p.id = b.pesanan_id
WHERE p.status = 'lunas'
  AND p.tanggal >= CURRENT_DATE - INTERVAL '30' DAY
GROUP BY pr.nama, pr.stok
ORDER BY hari_stok, pr.nama`,
  },
  {
    id: 'terlaris-stok-menipis',
    title: 'Terlaris yang stoknya menipis',
    scenario: 'Produk laku bulan ini dengan stok tersisa di bawah 10.',
    job: 'Stok',
    sql: `SELECT
  pr.nama,
  pr.stok,
  SUM(b.jumlah) AS qty
FROM produk AS pr
JOIN baris_pesanan AS b ON b.produk_id = pr.id
JOIN pesanan AS p ON p.id = b.pesanan_id
WHERE p.status = 'lunas'
  AND pr.stok < 10
  AND date_trunc('month', p.tanggal) = date_trunc('month', CURRENT_DATE)
GROUP BY pr.nama, pr.stok
ORDER BY qty DESC, pr.nama`,
  },
  {
    id: 'stok-tanpa-kategori',
    title: 'Produk tanpa kategori',
    scenario: 'Lengkapi data gudang: barang yang kategorinya kosong.',
    job: 'Stok',
    sql: `SELECT id, nama, harga, stok
FROM produk
WHERE kategori IS NULL OR trim(kategori) = ''
ORDER BY nama`,
  },
  {
    id: 'harga-kosong-atau-nol',
    title: 'Harga kosong atau nol',
    scenario: 'Cek produk yang harganya nol atau belum diisi.',
    job: 'Stok',
    sql: `SELECT id, nama, kategori, stok, harga
FROM produk
WHERE harga IS NULL OR harga = 0
ORDER BY nama`,
  },
  {
    id: 'produk-belum-pernah-terjual',
    title: 'Produk belum pernah terjual',
    scenario: 'Barang di stok yang tidak pernah masuk baris nota.',
    job: 'Stok',
    sql: `SELECT pr.id, pr.nama, pr.kategori, pr.stok
FROM produk AS pr
WHERE NOT EXISTS (
  SELECT 1
  FROM baris_pesanan AS b
  WHERE b.produk_id = pr.id
)
ORDER BY pr.kategori, pr.nama`,
  },
  {
    id: 'stok-versus-terjual',
    title: 'Stok versus qty terjual bulan ini',
    scenario: 'Bandingkan stok sekarang dengan qty lunas bulan berjalan.',
    job: 'Stok',
    sql: `SELECT
  pr.nama,
  pr.stok,
  COALESCE(SUM(terjual.jumlah), 0) AS qty_terjual
FROM produk AS pr
LEFT JOIN (
  SELECT b.produk_id, b.jumlah
  FROM baris_pesanan AS b
  JOIN pesanan AS p ON p.id = b.pesanan_id
  WHERE p.status = 'lunas'
    AND date_trunc('month', p.tanggal) = date_trunc('month', CURRENT_DATE)
) AS terjual ON terjual.produk_id = pr.id
GROUP BY pr.nama, pr.stok
ORDER BY qty_terjual DESC, pr.nama`,
  },
  {
    id: 'kategori-nilai-stok-terbesar',
    title: 'Kategori dengan nilai stok terbesar',
    scenario: 'Tiga kategori yang nilai persediaannya paling besar.',
    job: 'Stok',
    sql: `SELECT
  kategori,
  SUM(stok * harga) AS nilai
FROM produk
GROUP BY kategori
ORDER BY nilai DESC, kategori
LIMIT 3`,
  },
  {
    id: 'harga-di-atas-rata-kategori',
    title: 'Harga di atas rata-rata kategorinya',
    scenario: 'Produk yang harganya lebih tinggi dari rata-rata kategori yang sama.',
    job: 'Stok',
    sql: `SELECT nama, kategori, harga, rata
FROM (
  SELECT
    nama,
    kategori,
    harga,
    AVG(harga) OVER (PARTITION BY kategori) AS rata
  FROM produk
  WHERE harga IS NOT NULL
) AS bandingan
WHERE harga > rata
ORDER BY kategori, harga DESC`,
  },
  {
    id: 'stok-lebih-kecil-dari-terjual',
    title: 'Stok lebih kecil dari qty terjual',
    scenario: 'Barang yang stoknya sudah di bawah qty lunas bulan ini, untuk dihitung ulang.',
    job: 'Stok',
    sql: `SELECT
  pr.nama,
  pr.stok,
  SUM(b.jumlah) AS qty_terjual
FROM produk AS pr
JOIN baris_pesanan AS b ON b.produk_id = pr.id
JOIN pesanan AS p ON p.id = b.pesanan_id
WHERE p.status = 'lunas'
  AND date_trunc('month', p.tanggal) = date_trunc('month', CURRENT_DATE)
GROUP BY pr.nama, pr.stok
HAVING pr.stok < SUM(b.jumlah)
ORDER BY qty_terjual DESC`,
  },
  {
    id: 'nama-produk-ganda',
    title: 'Nama produk yang ganda',
    scenario: 'Bersihkan katalog barang: nama yang muncul lebih dari sekali.',
    job: 'Stok',
    sql: `SELECT nama, COUNT(*) AS jumlah
FROM produk
GROUP BY nama
HAVING COUNT(*) > 1
ORDER BY jumlah DESC, nama`,
  },
  {
    id: 'stok-negatif',
    title: 'Stok negatif',
    scenario: 'Cari produk yang stoknya di bawah nol sebelum tutup buku.',
    job: 'Stok',
    sql: `SELECT id, nama, kategori, stok
FROM produk
WHERE stok < 0
ORDER BY stok, nama`,
  },
  {
    id: 'sepuluh-termahal-masih-ada',
    title: 'Sepuluh produk termahal yang masih ada',
    scenario: 'Barang berharga dengan stok di atas nol, untuk prioritas pengamanan.',
    job: 'Stok',
    sql: `SELECT nama, kategori, harga, stok
FROM produk
WHERE stok > 0
  AND harga IS NOT NULL
ORDER BY harga DESC, nama
LIMIT 10`,
  },
  {
    id: 'barang-lambat-90-hari',
    title: 'Barang lambat 90 hari',
    scenario: 'Stok masih ada, tetapi tidak laku pada nota lunas 90 hari terakhir.',
    job: 'Stok',
    sql: `SELECT pr.id, pr.nama, pr.stok, pr.harga
FROM produk AS pr
WHERE pr.stok > 0
  AND NOT EXISTS (
    SELECT 1
    FROM baris_pesanan AS b
    JOIN pesanan AS p ON p.id = b.pesanan_id
    WHERE b.produk_id = pr.id
      AND p.status = 'lunas'
      AND p.tanggal >= CURRENT_DATE - INTERVAL '90' DAY
  )
ORDER BY pr.stok DESC, pr.nama`,
  },
  {
    id: 'ringkasan-stok-tutup-toko',
    title: 'Ringkasan stok untuk tutup toko',
    scenario: 'Satu baris sebelum tutup: jumlah barang, qty, dan nilai persediaan.',
    job: 'Stok',
    sql: `SELECT
  COUNT(*) AS jumlah_produk,
  COALESCE(SUM(stok), 0) AS qty,
  COALESCE(SUM(stok * harga), 0) AS nilai
FROM produk`,
  },
  {
    id: 'harga-jual-di-bawah-katalog',
    title: 'Harga jual rata-rata di bawah katalog',
    scenario: 'Produk yang rata-rata harga jual nota lunas lebih rendah dari harga katalog.',
    job: 'Stok',
    sql: `SELECT
  pr.nama,
  pr.harga AS harga_katalog,
  ROUND(SUM(b.jumlah * b.harga_satuan) / NULLIF(SUM(b.jumlah), 0), 0) AS rata_jual
FROM produk AS pr
JOIN baris_pesanan AS b ON b.produk_id = pr.id
JOIN pesanan AS p ON p.id = b.pesanan_id
WHERE p.status = 'lunas'
GROUP BY pr.nama, pr.harga
HAVING SUM(b.jumlah * b.harga_satuan) / NULLIF(SUM(b.jumlah), 0) < pr.harga
ORDER BY pr.nama`,
  },
  {
    id: 'kebutuhan-restok',
    title: 'Kebutuhan restok kasar',
    scenario: 'Untuk barang berstok di bawah 10, hitung kekurangan sampai 30 buah.',
    job: 'Stok',
    sql: `SELECT
  nama,
  kategori,
  stok,
  30 - stok AS kurang
FROM produk
WHERE stok < 10
ORDER BY kurang DESC, nama`,
  },
  {
    id: 'stok-per-kategori',
    title: 'Stok per kategori dalam satuan barang',
    scenario: 'Jumlah qty gudang tiap kategori, tanpa dikali harga.',
    job: 'Stok',
    sql: `SELECT
  kategori,
  COUNT(*) AS jumlah_produk,
  SUM(stok) AS qty
FROM produk
GROUP BY kategori
ORDER BY qty DESC, kategori`,
  },
  {
    id: 'laku-tetapi-stok-masih-tinggi',
    title: 'Laku tetapi stok masih tinggi',
    scenario: 'Produk yang terjual bulan ini dan stoknya masih di atas 100.',
    job: 'Stok',
    sql: `SELECT
  pr.nama,
  pr.stok,
  SUM(b.jumlah) AS qty
FROM produk AS pr
JOIN baris_pesanan AS b ON b.produk_id = pr.id
JOIN pesanan AS p ON p.id = b.pesanan_id
WHERE p.status = 'lunas'
  AND pr.stok > 100
  AND date_trunc('month', p.tanggal) = date_trunc('month', CURRENT_DATE)
GROUP BY pr.nama, pr.stok
ORDER BY pr.stok DESC, pr.nama`,
  },
  {
    id: 'stok-banyak-harga-rendah',
    title: 'Stok banyak dengan harga rendah',
    scenario: 'Barang stok di atas 100 dan harga di bawah 20000, untuk cek rak.',
    job: 'Stok',
    sql: `SELECT nama, kategori, harga, stok
FROM produk
WHERE stok > 100
  AND harga < 20000
ORDER BY stok DESC, nama`,
  },
  {
    id: 'daftar-label-rak',
    title: 'Daftar produk untuk label rak',
    scenario: 'Nama, harga, dan stok untuk dicetak sebagai label rak.',
    job: 'Stok',
    sql: `SELECT nama, harga, stok
FROM produk
ORDER BY kategori, nama`,
  },
]
