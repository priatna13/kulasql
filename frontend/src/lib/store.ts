export const CHEATSHEET = {
  title: 'SQL Fundamental Cheatsheet',
  mark: 'Gratis',
  intro: 'Ringkasan singkat buat nulis query. Simpan atau salin. Bukan kursus, dan bukan buku.',
  sections: [
    {
      title: 'Pilih kolom',
      note: 'Sebutkan kolom yang kamu mau. Bintang mengambil semua kolom.',
      sql: 'SELECT nama, kota\nFROM pelanggan;',
    },
    {
      title: 'Saring baris',
      note: 'WHERE membuang baris yang tidak ikut.',
      sql: "SELECT nama\nFROM pelanggan\nWHERE kota = 'Jakarta';",
    },
    {
      title: 'Gabung tabel',
      note: 'JOIN menempel baris yang kuncinya sama.',
      sql: 'SELECT pelanggan.nama, pesanan.total\nFROM pelanggan\nJOIN pesanan ON pesanan.pelanggan_id = pelanggan.id;',
    },
    {
      title: 'Kelompokkan',
      note: 'GROUP BY merapatkan baris, lalu COUNT atau SUM menghitung kelompok itu.',
      sql: 'SELECT kota, COUNT(*) AS jumlah\nFROM pelanggan\nGROUP BY kota\nORDER BY jumlah DESC;',
    },
  ],
} as const
