export type ColumnSchema = {
  name: string
  type: string
  sample: string
}

export type SchemaTable = {
  name: string
  columns: ColumnSchema[]
  sampleRows: string[][]
}

export type ResultTable = {
  columns: string[]
  rows: string[][]
}

export const LEVELS = ['Mudah', 'Sedang', 'Sulit'] as const

export type Level = (typeof LEVELS)[number]

export type Challenge = {
  slug: string
  title: string
  category: string
  level: Level
  tags: readonly string[]
  premium: boolean
  prompt: string
  tables: SchemaTable[]
  starterSql: string
  seedSql: string
  expected: ResultTable | null
  requiresOrder: boolean
  xpReward: number
}

export type CatalogQuery = {
  level: Level | null
  category: string | null
  status: 'belum' | 'selesai' | null
  tag: string | null
  q: string
}

export const PAGE_SIZE = 25

const PELANGGAN_SQL = `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (1, 'Sari Wulandari', 'Yogyakarta', 185000),
  (2, 'Budi Santoso', 'Jakarta', 420000),
  (3, 'Lina Kusuma', 'Surabaya', 95000),
  (4, 'Agus Pratama', 'Bandung', 310000),
  (5, 'Dewi Lestari', 'Semarang', 150000),
  (6, 'Raka Putra', 'Medan', 275000);`

const PELANGGAN_COLUMNS: ColumnSchema[] = [
  { name: 'id', type: 'INTEGER', sample: '1' },
  { name: 'nama', type: 'VARCHAR', sample: 'Sari Wulandari' },
  { name: 'kota', type: 'VARCHAR', sample: 'Yogyakarta' },
  { name: 'total_belanja', type: 'INTEGER', sample: '185000' },
]

const PELANGGAN_SAMPLE: string[][] = [
  ['1', 'Sari Wulandari', 'Yogyakarta', '185000'],
  ['2', 'Budi Santoso', 'Jakarta', '420000'],
  ['3', 'Lina Kusuma', 'Surabaya', '95000'],
]

const PRODUK_SQL = `CREATE OR REPLACE TABLE produk (
  id INTEGER,
  nama VARCHAR,
  harga INTEGER
);
INSERT INTO produk VALUES
  (1, 'Beras 5kg', 76000),
  (2, 'Gula 1kg', 16000),
  (3, 'Minyak goreng 1L', 22000),
  (4, 'Teh celup', 8500),
  (5, 'Kopi tubruk', NULL);`

const PRODUK_COLUMNS: ColumnSchema[] = [
  { name: 'id', type: 'INTEGER', sample: '1' },
  { name: 'nama', type: 'VARCHAR', sample: 'Beras 5kg' },
  { name: 'harga', type: 'INTEGER', sample: '76000' },
]

const PRODUK_SAMPLE: string[][] = [
  ['1', 'Beras 5kg', '76000'],
  ['2', 'Gula 1kg', '16000'],
  ['5', 'Kopi tubruk', 'NULL'],
]

const PELANGGAN_TABLE: SchemaTable = {
  name: 'pelanggan',
  columns: PELANGGAN_COLUMNS,
  sampleRows: PELANGGAN_SAMPLE,
}

const PRODUK_TABLE: SchemaTable = {
  name: 'produk',
  columns: PRODUK_COLUMNS,
  sampleRows: PRODUK_SAMPLE,
}

const PESANAN_COLUMNS: ColumnSchema[] = [
  { name: 'id', type: 'INTEGER', sample: '1' },
  { name: 'pelanggan_id', type: 'INTEGER', sample: '1' },
  { name: 'total', type: 'INTEGER', sample: '45000' },
]

const PELANGGAN_JAKARTA_SQL = `${PELANGGAN_SQL}
INSERT INTO pelanggan VALUES
  (7, 'Rina Hartati', 'Jakarta', 50000);`

const PELANGGAN_WATI_SQL = `${PELANGGAN_SQL}
INSERT INTO pelanggan VALUES
  (7, 'Nur Wati', 'Malang', 64000);`

const PRODUK_DI_BAWAH_SQL = `${PRODUK_SQL}
INSERT INTO produk VALUES
  (6, 'Garam 500g', 20000);`

const PRODUK_ANTARA_SQL = `${PRODUK_SQL}
INSERT INTO produk VALUES
  (6, 'Garam 500g', 15000),
  (7, 'Kecap 600ml', 25000);`

const PELANGGAN_ANTARA_SQL = `${PELANGGAN_SQL}
INSERT INTO pelanggan VALUES
  (7, 'Nina Sari', 'Solo', 300000);`

const PELANGGAN_ACAK_SQL = `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (6, 'Raka Putra', 'Medan', 275000),
  (3, 'Lina Kusuma', 'Surabaya', 95000),
  (5, 'Dewi Lestari', 'Semarang', 150000),
  (1, 'Sari Wulandari', 'Yogyakarta', 185000),
  (4, 'Agus Pratama', 'Bandung', 310000),
  (2, 'Budi Santoso', 'Jakarta', 420000);`

const PESANAN_JOIN_SQL = `${PELANGGAN_SQL}
CREATE OR REPLACE TABLE pesanan (
  id INTEGER,
  pelanggan_id INTEGER,
  total INTEGER
);
INSERT INTO pesanan VALUES
  (1, 1, 45000),
  (2, 2, 120000),
  (3, 4, 80000),
  (4, 1, 30000),
  (5, 99, 10000);`

const PESANAN_YOGYA_SQL = `${PELANGGAN_SQL}
CREATE OR REPLACE TABLE pesanan (
  id INTEGER,
  pelanggan_id INTEGER,
  total INTEGER
);
INSERT INTO pesanan VALUES
  (2, 1, 15000),
  (3, 2, 90000),
  (1, 1, 45000),
  (4, 3, 20000);`

const BARIS_PRODUK_SQL = `${PRODUK_SQL}
CREATE OR REPLACE TABLE baris_pesanan (
  id INTEGER,
  produk_id INTEGER,
  jumlah INTEGER
);
INSERT INTO baris_pesanan VALUES
  (1, 1, 2),
  (2, 2, 1),
  (3, 4, 3),
  (4, 9, 1);`

const DAFTAR_PESANAN_SQL = `CREATE OR REPLACE TABLE pesanan (
  id INTEGER,
  kota_tujuan VARCHAR,
  total INTEGER
);
INSERT INTO pesanan VALUES
  (1, 'Yogyakarta', 45000),
  (2, 'Jakarta', 120000),
  (3, 'Bandung', 80000);`

export const FIRST_CHALLENGE_SLUG = 'hari-pertama-di-tokokulwon'

export const FIRST_CHALLENGE: Challenge = {
  slug: FIRST_CHALLENGE_SLUG,
  title: 'Hari Pertama di TokoKulwon',
  category: 'SQL Dasar',
  level: 'Mudah',
  tags: ['SELECT', 'beginner', 'Dasar SQL'],
  premium: false,
  prompt:
    'Hari pertama kerja di TokoKulwon, toko kelontong di Yogyakarta. Sebelum buka, pemilik toko minta kamu menampilkan daftar pelanggan yang sudah tercatat.\n\nAmbil semua kolom dari tabel pelanggan. Urutkan dari id paling kecil ke paling besar.',
  tables: [PELANGGAN_TABLE],
  starterSql: `SELECT id
FROM pelanggan;`,
  expected: {
    columns: ['id', 'nama', 'kota', 'total_belanja'],
    rows: [
      ['1', 'Sari Wulandari', 'Yogyakarta', '185000'],
      ['2', 'Budi Santoso', 'Jakarta', '420000'],
      ['3', 'Lina Kusuma', 'Surabaya', '95000'],
      ['4', 'Agus Pratama', 'Bandung', '310000'],
      ['5', 'Dewi Lestari', 'Semarang', '150000'],
      ['6', 'Raka Putra', 'Medan', '275000'],
    ],
  },
  requiresOrder: true,
  xpReward: 50,
  seedSql: PELANGGAN_SQL,
}

export const CHALLENGES: Challenge[] = [
  FIRST_CHALLENGE,
  {
    slug: 'laporan-untuk-tim-marketing',
    title: 'Laporan untuk Tim Marketing',
    category: 'SQL Dasar',
    level: 'Mudah',
    tags: ['SELECT', 'beginner'],
    premium: false,
    prompt:
      'Tim marketing TokoKulwon butuh daftar singkat, bukan tabel penuh. Mereka hanya ingin nama pelanggan dan kotanya.\n\nAmbil dua kolom itu dari tabel pelanggan.',
    tables: [PELANGGAN_TABLE],
    starterSql: `SELECT nama
FROM pelanggan;`,
    seedSql: PELANGGAN_SQL,
    expected: {
      columns: ['nama', 'kota'],
      rows: [
        ['Sari Wulandari', 'Yogyakarta'],
        ['Budi Santoso', 'Jakarta'],
        ['Lina Kusuma', 'Surabaya'],
        ['Agus Pratama', 'Bandung'],
        ['Dewi Lestari', 'Semarang'],
        ['Raka Putra', 'Medan'],
      ],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'mencari-pelanggan-dari-jakarta',
    title: 'Mencari Pelanggan dari Jakarta',
    category: 'Filter Data',
    level: 'Mudah',
    tags: ['filtering', 'SELECT', 'beginner'],
    premium: false,
    prompt:
      'Besok ada pengiriman ke Jakarta. Pemilik TokoKulwon minta pelanggan yang kotanya Jakarta saja.\n\nTampilkan semua kolom pelanggan yang kotanya Jakarta. Kota ditulis persis Jakarta.',
    tables: [PELANGGAN_TABLE],
    starterSql: `SELECT *
FROM pelanggan;`,
    seedSql: PELANGGAN_SQL,
    expected: {
      columns: ['id', 'nama', 'kota', 'total_belanja'],
      rows: [['2', 'Budi Santoso', 'Jakarta', '420000']],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'produk-dengan-harga-terjangkau',
    title: 'Produk dengan Harga Terjangkau',
    category: 'Filter Data',
    level: 'Mudah',
    tags: ['filtering', 'beginner'],
    premium: false,
    prompt:
      'Rak promo TokoKulwon diisi barang yang harganya paling tinggi Rp20.000. Harga kosong jangan ikut.\n\nAmbil nama dan harga dari tabel produk. Saring harga yang terisi dan tidak lebih dari 20000.',
    tables: [
      {
        ...PRODUK_TABLE,
        sampleRows: [
          ['2', 'Gula 1kg', '16000'],
          ['6', 'Garam 500g', '20000'],
          ['5', 'Kopi tubruk', 'NULL'],
        ],
      },
    ],
    starterSql: `SELECT nama, harga
FROM produk;`,
    seedSql: PRODUK_DI_BAWAH_SQL,
    expected: {
      columns: ['nama', 'harga'],
      rows: [
        ['Gula 1kg', '16000'],
        ['Teh celup', '8500'],
        ['Garam 500g', '20000'],
      ],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'pelanggan-dari-jakarta-atau-bandung',
    title: 'Pelanggan dari Jakarta atau Bandung',
    category: 'Filter Data',
    level: 'Mudah',
    tags: ['filtering', 'SELECT'],
    premium: false,
    prompt:
      'Kurir TokoKulwon minggu ini hanya meliput Jakarta dan Bandung. Daftar pelanggan di luar dua kota itu tidak dipakai.\n\nAmbil nama dan kota. Saring pelanggan dari Jakarta atau Bandung.',
    tables: [PELANGGAN_TABLE],
    starterSql: `SELECT nama, kota
FROM pelanggan;`,
    seedSql: PELANGGAN_SQL,
    expected: {
      columns: ['nama', 'kota'],
      rows: [
        ['Budi Santoso', 'Jakarta'],
        ['Agus Pratama', 'Bandung'],
      ],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'pelanggan-jakarta-belanja-besar',
    title: 'Pelanggan Jakarta yang Belanja Besar',
    category: 'Filter Data',
    level: 'Mudah',
    tags: ['filtering', 'beginner'],
    premium: false,
    prompt:
      'TokoKulwon ingin menyapa pelanggan Jakarta yang belanjanya sudah besar.\n\nTampilkan nama dan total belanja pelanggan dari Jakarta yang total belanjanya lebih dari 300000.',
    tables: [
      {
        ...PELANGGAN_TABLE,
        sampleRows: [
          ['2', 'Budi Santoso', 'Jakarta', '420000'],
          ['7', 'Rina Hartati', 'Jakarta', '50000'],
        ],
      },
    ],
    starterSql: `SELECT nama, total_belanja
FROM pelanggan;`,
    seedSql: PELANGGAN_JAKARTA_SQL,
    expected: {
      columns: ['nama', 'total_belanja'],
      rows: [['Budi Santoso', '420000']],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'pelanggan-di-tiga-kota',
    title: 'Pelanggan di Tiga Kota',
    category: 'Filter Data',
    level: 'Mudah',
    tags: ['filtering', 'beginner'],
    premium: false,
    prompt:
      'TokoKulwon minggu ini hanya mengantar ke tiga kota.\n\nTampilkan nama dan kota pelanggan yang tinggal di Jakarta, Surabaya, atau Medan.',
    tables: [PELANGGAN_TABLE],
    starterSql: `SELECT nama, kota
FROM pelanggan;`,
    seedSql: PELANGGAN_SQL,
    expected: {
      columns: ['nama', 'kota'],
      rows: [
        ['Budi Santoso', 'Jakarta'],
        ['Lina Kusuma', 'Surabaya'],
        ['Raka Putra', 'Medan'],
      ],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'belanja-di-antara',
    title: 'Belanja di Antara',
    category: 'Filter Data',
    level: 'Mudah',
    tags: ['filtering', 'beginner'],
    premium: false,
    prompt:
      'Kasir TokoKulwon merapikan pelanggan dengan belanja sedang.\n\nTampilkan nama dan total belanja pelanggan yang total belanjanya dari 150000 sampai 300000, termasuk kedua batas.',
    tables: [
      {
        ...PELANGGAN_TABLE,
        sampleRows: [
          ['5', 'Dewi Lestari', 'Semarang', '150000'],
          ['7', 'Nina Sari', 'Solo', '300000'],
          ['4', 'Agus Pratama', 'Bandung', '310000'],
        ],
      },
    ],
    starterSql: `SELECT nama, total_belanja
FROM pelanggan;`,
    seedSql: PELANGGAN_ANTARA_SQL,
    expected: {
      columns: ['nama', 'total_belanja'],
      rows: [
        ['Sari Wulandari', '185000'],
        ['Dewi Lestari', '150000'],
        ['Raka Putra', '275000'],
        ['Nina Sari', '300000'],
      ],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'nama-berawalan-de',
    title: 'Nama Berawalan De',
    category: 'Filter Data',
    level: 'Mudah',
    tags: ['filtering', 'beginner'],
    premium: false,
    prompt:
      'TokoKulwon mencari pelanggan yang namanya diawali De.\n\nTampilkan nama pelanggan yang namanya diawali De.',
    tables: [PELANGGAN_TABLE],
    starterSql: `SELECT nama
FROM pelanggan;`,
    seedSql: PELANGGAN_SQL,
    expected: {
      columns: ['nama'],
      rows: [['Dewi Lestari']],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'belanja-dari-yang-terbesar',
    title: 'Belanja dari yang Terbesar',
    category: 'SQL Dasar',
    level: 'Mudah',
    tags: ['SELECT', 'beginner'],
    premium: false,
    prompt:
      'Pemilik TokoKulwon ingin melihat pelanggan dari yang paling banyak belanja.\n\nTampilkan nama dan total belanja semua pelanggan. Urutkan dari total belanja yang paling besar. Jika total belanja sama, urutkan nama dari A ke Z.',
    tables: [PELANGGAN_TABLE],
    starterSql: `SELECT nama, total_belanja
FROM pelanggan;`,
    seedSql: PELANGGAN_SQL,
    expected: {
      columns: ['nama', 'total_belanja'],
      rows: [
        ['Budi Santoso', '420000'],
        ['Agus Pratama', '310000'],
        ['Raka Putra', '275000'],
        ['Sari Wulandari', '185000'],
        ['Dewi Lestari', '150000'],
        ['Lina Kusuma', '95000'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'dua-pelanggan-pertama',
    title: 'Dua Pelanggan Pertama',
    category: 'SQL Dasar',
    level: 'Mudah',
    tags: ['SELECT', 'beginner'],
    premium: false,
    prompt:
      'Buku tamu TokoKulwon dibuka dari pelanggan yang paling awal tercatat.\n\nTampilkan id dan nama dua pelanggan terawal. Urutkan id dari yang paling kecil, lalu ambil dua baris saja.',
    tables: [PELANGGAN_TABLE],
    starterSql: `SELECT id, nama
FROM pelanggan;`,
    seedSql: PELANGGAN_ACAK_SQL,
    expected: {
      columns: ['id', 'nama'],
      rows: [
        ['1', 'Sari Wulandari'],
        ['2', 'Budi Santoso'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'nama-sebagai-pelanggan',
    title: 'Nama sebagai Pelanggan',
    category: 'SQL Dasar',
    level: 'Mudah',
    tags: ['SELECT', 'beginner'],
    premium: false,
    prompt:
      'Daftar nama untuk papan toko butuh judul kolom yang berbeda.\n\nTampilkan nama setiap pelanggan. Judul kolom pada hasilnya pelanggan, bukan nama.',
    tables: [PELANGGAN_TABLE],
    starterSql: `SELECT nama
FROM pelanggan;`,
    seedSql: PELANGGAN_SQL,
    expected: {
      columns: ['pelanggan'],
      rows: [
        ['Sari Wulandari'],
        ['Budi Santoso'],
        ['Lina Kusuma'],
        ['Agus Pratama'],
        ['Dewi Lestari'],
        ['Raka Putra'],
      ],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'jumlah-pelanggan-tercatat',
    title: 'Jumlah Pelanggan Tercatat',
    category: 'Agregasi',
    level: 'Mudah',
    tags: ['aggregation', 'beginner'],
    premium: false,
    prompt:
      'Pemilik TokoKulwon ingin tahu berapa pelanggan yang sudah tercatat.\n\nTampilkan satu kolom bernama jumlah dengan satu angka: banyaknya baris pelanggan.',
    tables: [PELANGGAN_TABLE],
    starterSql: `SELECT id
FROM pelanggan;`,
    seedSql: PELANGGAN_SQL,
    expected: {
      columns: ['jumlah'],
      rows: [['6']],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'jumlah-seluruh-belanja',
    title: 'Jumlah Seluruh Belanja',
    category: 'Agregasi',
    level: 'Mudah',
    tags: ['aggregation', 'beginner'],
    premium: false,
    prompt:
      'Akhir hari, TokoKulwon menjumlahkan seluruh belanja pelanggan yang tercatat.\n\nTampilkan satu kolom bernama jumlah dengan satu angka: jumlah seluruh total belanja.',
    tables: [PELANGGAN_TABLE],
    starterSql: `SELECT total_belanja
FROM pelanggan;`,
    seedSql: PELANGGAN_SQL,
    expected: {
      columns: ['jumlah'],
      rows: [['1435000']],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'belanja-paling-kecil',
    title: 'Belanja Paling Kecil',
    category: 'Agregasi',
    level: 'Mudah',
    tags: ['aggregation', 'beginner'],
    premium: false,
    prompt:
      'TokoKulwon ingin melihat belanja pelanggan yang paling kecil.\n\nTampilkan satu kolom bernama terkecil dengan satu angka: total belanja paling kecil.',
    tables: [PELANGGAN_TABLE],
    starterSql: `SELECT total_belanja
FROM pelanggan;`,
    seedSql: PELANGGAN_SQL,
    expected: {
      columns: ['terkecil'],
      rows: [['95000']],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'belanja-paling-besar',
    title: 'Belanja Paling Besar',
    category: 'Agregasi',
    level: 'Mudah',
    tags: ['aggregation', 'beginner'],
    premium: false,
    prompt:
      'TokoKulwon ingin melihat belanja pelanggan yang paling besar.\n\nTampilkan satu kolom bernama terbesar dengan satu angka: total belanja paling besar.',
    tables: [PELANGGAN_TABLE],
    starterSql: `SELECT total_belanja
FROM pelanggan;`,
    seedSql: PELANGGAN_SQL,
    expected: {
      columns: ['terbesar'],
      rows: [['420000']],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'pesanan-dan-nama-pelanggan',
    title: 'Pesanan dan Nama Pelanggan',
    category: 'Menggabungkan Tabel',
    level: 'Mudah',
    tags: ['join', 'beginner'],
    premium: false,
    prompt:
      'Setiap pesanan TokoKulwon perlu nama pelanggannya. Pesanan yang pelanggannya tidak tercatat tidak dipakai.\n\nTampilkan nomor pesanan dan nama pelanggan untuk pesanan yang pelanggannya ada di daftar pelanggan.',
    tables: [
      {
        name: 'pesanan',
        columns: PESANAN_COLUMNS,
        sampleRows: [
          ['1', '1', '45000'],
          ['2', '2', '120000'],
          ['5', '99', '10000'],
        ],
      },
      PELANGGAN_TABLE,
    ],
    starterSql: `SELECT *
FROM pesanan;`,
    seedSql: PESANAN_JOIN_SQL,
    expected: {
      columns: ['id', 'nama'],
      rows: [
        ['1', 'Sari Wulandari'],
        ['2', 'Budi Santoso'],
        ['3', 'Agus Pratama'],
        ['4', 'Sari Wulandari'],
      ],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'produk-yang-ikut-terjual',
    title: 'Produk yang Ikut Terjual',
    category: 'Menggabungkan Tabel',
    level: 'Mudah',
    tags: ['join', 'beginner'],
    premium: false,
    prompt:
      'Gudang TokoKulwon ingin tahu produk mana yang muncul pada baris pesanan.\n\nTampilkan nama produk yang tercatat pada baris pesanan. Abaikan baris yang produknya tidak ada di daftar produk.',
    tables: [
      {
        name: 'baris_pesanan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'produk_id', type: 'INTEGER', sample: '1' },
          { name: 'jumlah', type: 'INTEGER', sample: '2' },
        ],
        sampleRows: [
          ['1', '1', '2'],
          ['3', '4', '3'],
          ['4', '9', '1'],
        ],
      },
      PRODUK_TABLE,
    ],
    starterSql: `SELECT nama
FROM produk;`,
    seedSql: BARIS_PRODUK_SQL,
    expected: {
      columns: ['nama'],
      rows: [['Beras 5kg'], ['Gula 1kg'], ['Teh celup']],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'harga-di-bawah-dua-puluh-ribu',
    title: 'Harga di Bawah Dua Puluh Ribu',
    category: 'Filter Data',
    level: 'Mudah',
    tags: ['filtering', 'beginner'],
    premium: false,
    prompt:
      'Etalase receh TokoKulwon hanya memuat barang di bawah Rp20.000. Harga kosong tidak ikut.\n\nTampilkan nama dan harga produk yang harganya di bawah 20000.',
    tables: [
      {
        ...PRODUK_TABLE,
        sampleRows: [
          ['2', 'Gula 1kg', '16000'],
          ['6', 'Garam 500g', '20000'],
          ['5', 'Kopi tubruk', 'NULL'],
        ],
      },
    ],
    starterSql: `SELECT nama, harga
FROM produk;`,
    seedSql: PRODUK_DI_BAWAH_SQL,
    expected: {
      columns: ['nama', 'harga'],
      rows: [
        ['Gula 1kg', '16000'],
        ['Teh celup', '8500'],
      ],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'pelanggan-bukan-dari-medan',
    title: 'Pelanggan Bukan dari Medan',
    category: 'Filter Data',
    level: 'Mudah',
    tags: ['filtering', 'beginner'],
    premium: false,
    prompt:
      'Kurir Medan sedang libur. Pelanggan dari kota itu tidak diantar minggu ini.\n\nTampilkan nama dan kota pelanggan yang kotanya bukan Medan.',
    tables: [PELANGGAN_TABLE],
    starterSql: `SELECT nama, kota
FROM pelanggan;`,
    seedSql: PELANGGAN_SQL,
    expected: {
      columns: ['nama', 'kota'],
      rows: [
        ['Sari Wulandari', 'Yogyakarta'],
        ['Budi Santoso', 'Jakarta'],
        ['Lina Kusuma', 'Surabaya'],
        ['Agus Pratama', 'Bandung'],
        ['Dewi Lestari', 'Semarang'],
      ],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'urut-berdasarkan-kota',
    title: 'Urut Berdasarkan Kota',
    category: 'SQL Dasar',
    level: 'Mudah',
    tags: ['SELECT', 'beginner'],
    premium: false,
    prompt:
      'Daftar pelanggan TokoKulwon akan ditempel menurut kota.\n\nTampilkan nama dan kota semua pelanggan. Urutkan menurut kota dari A ke Z. Jika kota sama, urutkan nama dari A ke Z.',
    tables: [PELANGGAN_TABLE],
    starterSql: `SELECT nama, kota
FROM pelanggan;`,
    seedSql: PELANGGAN_SQL,
    expected: {
      columns: ['nama', 'kota'],
      rows: [
        ['Agus Pratama', 'Bandung'],
        ['Budi Santoso', 'Jakarta'],
        ['Raka Putra', 'Medan'],
        ['Dewi Lestari', 'Semarang'],
        ['Lina Kusuma', 'Surabaya'],
        ['Sari Wulandari', 'Yogyakarta'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'nama-berakhiran-wati',
    title: 'Nama Berakhiran Wati',
    category: 'Filter Data',
    level: 'Mudah',
    tags: ['filtering', 'beginner'],
    premium: false,
    prompt:
      'TokoKulwon mencari pelanggan yang namanya diakhiri Wati.\n\nTampilkan nama pelanggan yang namanya diakhiri Wati.',
    tables: [
      {
        ...PELANGGAN_TABLE,
        sampleRows: [
          ['5', 'Dewi Lestari', 'Semarang', '150000'],
          ['7', 'Nur Wati', 'Malang', '64000'],
        ],
      },
    ],
    starterSql: `SELECT nama
FROM pelanggan;`,
    seedSql: PELANGGAN_WATI_SQL,
    expected: {
      columns: ['nama'],
      rows: [['Nur Wati']],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'tiga-produk-termurah',
    title: 'Tiga Produk Termurah',
    category: 'SQL Dasar',
    level: 'Mudah',
    tags: ['SELECT', 'beginner'],
    premium: false,
    prompt:
      'TokoKulwon ingin tiga barang dengan harga paling murah. Harga yang kosong jangan ikut.\n\nTampilkan nama dan harga tiga produk berharga paling kecil. Urutkan dari harga paling kecil. Jika harga sama, urutkan nama dari A ke Z.',
    tables: [PRODUK_TABLE],
    starterSql: `SELECT nama, harga
FROM produk;`,
    seedSql: PRODUK_SQL,
    expected: {
      columns: ['nama', 'harga'],
      rows: [
        ['Teh celup', '8500'],
        ['Gula 1kg', '16000'],
        ['Minyak goreng 1L', '22000'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'daftar-pesanan',
    title: 'Daftar Pesanan',
    category: 'SQL Dasar',
    level: 'Mudah',
    tags: ['SELECT', 'beginner'],
    premium: false,
    prompt:
      'Di meja kasir ada daftar pesanan TokoKulwon. Nama pelanggan tidak diminta.\n\nTampilkan nomor dan total setiap pesanan.',
    tables: [
      {
        name: 'pesanan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'kota_tujuan', type: 'VARCHAR', sample: 'Yogyakarta' },
          { name: 'total', type: 'INTEGER', sample: '45000' },
        ],
        sampleRows: [
          ['1', 'Yogyakarta', '45000'],
          ['2', 'Jakarta', '120000'],
        ],
      },
    ],
    starterSql: `SELECT *
FROM pesanan;`,
    seedSql: DAFTAR_PESANAN_SQL,
    expected: {
      columns: ['id', 'total'],
      rows: [
        ['1', '45000'],
        ['2', '120000'],
        ['3', '80000'],
      ],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'nama-dan-harga-produk',
    title: 'Nama dan Harga Produk',
    category: 'SQL Dasar',
    level: 'Mudah',
    tags: ['SELECT', 'beginner'],
    premium: false,
    prompt:
      'Label rak TokoKulwon butuh nama barang dan harganya, termasuk yang belum diisi.\n\nTampilkan nama dan harga setiap produk.',
    tables: [PRODUK_TABLE],
    starterSql: `SELECT nama
FROM produk;`,
    seedSql: PRODUK_SQL,
    expected: {
      columns: ['nama', 'harga'],
      rows: [
        ['Beras 5kg', '76000'],
        ['Gula 1kg', '16000'],
        ['Minyak goreng 1L', '22000'],
        ['Teh celup', '8500'],
        ['Kopi tubruk', 'NULL'],
      ],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'pelanggan-bandung-atau-surabaya',
    title: 'Pelanggan Bandung atau Surabaya',
    category: 'Filter Data',
    level: 'Mudah',
    tags: ['filtering', 'beginner'],
    premium: false,
    prompt:
      'Pengiriman besok hanya ke Bandung dan Surabaya.\n\nTampilkan nama dan kota pelanggan dari Bandung atau dari Surabaya.',
    tables: [PELANGGAN_TABLE],
    starterSql: `SELECT nama, kota
FROM pelanggan;`,
    seedSql: PELANGGAN_SQL,
    expected: {
      columns: ['nama', 'kota'],
      rows: [
        ['Lina Kusuma', 'Surabaya'],
        ['Agus Pratama', 'Bandung'],
      ],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'harga-antara-dua-batas',
    title: 'Harga antara Dua Batas',
    category: 'Filter Data',
    level: 'Mudah',
    tags: ['filtering', 'beginner'],
    premium: false,
    prompt:
      'TokoKulwon menyiapkan rak barang dengan harga di tengah, bukan yang paling murah atau paling mahal. Harga kosong tidak ikut.\n\nTampilkan nama dan harga produk yang harganya paling kecil 15000 dan paling besar 25000.',
    tables: [
      {
        ...PRODUK_TABLE,
        sampleRows: [
          ['6', 'Garam 500g', '15000'],
          ['3', 'Minyak goreng 1L', '22000'],
          ['7', 'Kecap 600ml', '25000'],
          ['5', 'Kopi tubruk', 'NULL'],
        ],
      },
    ],
    starterSql: `SELECT nama, harga
FROM produk;`,
    seedSql: PRODUK_ANTARA_SQL,
    expected: {
      columns: ['nama', 'harga'],
      rows: [
        ['Garam 500g', '15000'],
        ['Gula 1kg', '16000'],
        ['Minyak goreng 1L', '22000'],
        ['Kecap 600ml', '25000'],
      ],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'urut-id-dari-belakang',
    title: 'Urut Id dari Belakang',
    category: 'SQL Dasar',
    level: 'Mudah',
    tags: ['SELECT', 'beginner'],
    premium: false,
    prompt:
      'Buku pelanggan TokoKulwon dibaca dari catatan yang paling baru.\n\nTampilkan id dan nama semua pelanggan. Urutkan id dari yang paling besar.',
    tables: [PELANGGAN_TABLE],
    starterSql: `SELECT id, nama
FROM pelanggan;`,
    seedSql: PELANGGAN_SQL,
    expected: {
      columns: ['id', 'nama'],
      rows: [
        ['6', 'Raka Putra'],
        ['5', 'Dewi Lestari'],
        ['4', 'Agus Pratama'],
        ['3', 'Lina Kusuma'],
        ['2', 'Budi Santoso'],
        ['1', 'Sari Wulandari'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'alias-tabel-pelanggan',
    title: 'Alias Tabel Pelanggan',
    category: 'SQL Dasar',
    level: 'Mudah',
    tags: ['SELECT', 'beginner'],
    premium: false,
    prompt:
      'Daftar singkat TokoKulwon butuh id, nama, dan kota.\n\nBeri tabel pelanggan nama singkat p. Tampilkan id, nama, dan kota lewat nama singkat itu.',
    tables: [PELANGGAN_TABLE],
    starterSql: `SELECT nama
FROM pelanggan;`,
    seedSql: PELANGGAN_SQL,
    expected: {
      columns: ['id', 'nama', 'kota'],
      rows: [
        ['1', 'Sari Wulandari', 'Yogyakarta'],
        ['2', 'Budi Santoso', 'Jakarta'],
        ['3', 'Lina Kusuma', 'Surabaya'],
        ['4', 'Agus Pratama', 'Bandung'],
        ['5', 'Dewi Lestari', 'Semarang'],
        ['6', 'Raka Putra', 'Medan'],
      ],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'hitung-produk-berharga',
    title: 'Hitung Produk Berharga',
    category: 'Agregasi',
    level: 'Mudah',
    tags: ['aggregation', 'beginner'],
    premium: false,
    prompt:
      'TokoKulwon ingin tahu berapa produk yang sudah punya harga. Harga kosong tidak dihitung.\n\nTampilkan satu kolom bernama jumlah dengan satu angka: banyaknya produk yang harganya terisi.',
    tables: [PRODUK_TABLE],
    starterSql: `SELECT id
FROM produk;`,
    seedSql: PRODUK_SQL,
    expected: {
      columns: ['jumlah'],
      rows: [['4']],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'gabung-pelanggan-satu-kota',
    title: 'Pesanan Pelanggan dari Yogyakarta',
    category: 'Menggabungkan Tabel',
    level: 'Mudah',
    tags: ['join', 'beginner'],
    premium: false,
    prompt:
      'TokoKulwon ingin daftar pesanan milik pelanggan dari Yogyakarta saja.\n\nTampilkan nomor pesanan, nama pelanggan, dan total pesanan untuk pelanggan dari Yogyakarta. Urutkan nomor pesanan dari yang paling kecil.',
    tables: [
      {
        name: 'pesanan',
        columns: PESANAN_COLUMNS,
        sampleRows: [
          ['1', '1', '45000'],
          ['2', '1', '15000'],
          ['3', '2', '90000'],
        ],
      },
      PELANGGAN_TABLE,
    ],
    starterSql: `SELECT *
FROM pesanan;`,
    seedSql: PESANAN_YOGYA_SQL,
    expected: {
      columns: ['id', 'nama', 'total'],
      rows: [
        ['1', 'Sari Wulandari', '45000'],
        ['2', 'Sari Wulandari', '15000'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'pelanggan-vip-dari-surabaya',
    title: 'Pelanggan VIP dari Surabaya',
    category: 'Filter Data',
    level: 'Sedang',
    tags: ['subquery', 'intermediate'],
    premium: false,
    prompt:
      'TokoKulwon mau mengirim kartu ucapan ke pelanggan Surabaya yang belanjanya di atas rata-rata seluruh pelanggan. Yang tepat sama dengan rata-rata tidak dapat kartu.\n\nTampilkan nama, kota, dan total belanja.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Lina Kusuma' },
          { name: 'kota', type: 'VARCHAR', sample: 'Surabaya' },
          { name: 'total_belanja', type: 'INTEGER', sample: '200000' },
        ],
        sampleRows: [
          ['1', 'Lina Kusuma', 'Surabaya', '200000'],
          ['2', 'Maya Putri', 'Surabaya', '350000'],
          ['4', 'Budi Santoso', 'Jakarta', '250000'],
        ],
      },
    ],
    starterSql: `SELECT nama
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (1, 'Lina Kusuma', 'Surabaya', 200000),
  (2, 'Maya Putri', 'Surabaya', 350000),
  (3, 'Rina Hartati', 'Surabaya', 300000),
  (4, 'Budi Santoso', 'Jakarta', 250000),
  (5, 'Sari Wulandari', 'Yogyakarta', 50000),
  (6, 'Agus Pratama', 'Bandung', 50000);`,
    expected: {
      columns: ['nama', 'kota', 'total_belanja'],
      rows: [
        ['Maya Putri', 'Surabaya', '350000'],
        ['Rina Hartati', 'Surabaya', '300000'],
      ],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'daftar-produk-termahal',
    title: 'Daftar Produk Termahal',
    category: 'SQL Dasar',
    level: 'Sedang',
    tags: ['null', 'intermediate'],
    premium: false,
    prompt:
      'Pemilik TokoKulwon ingin melihat barang dari yang paling mahal. Harga yang belum diisi diletakkan paling bawah. Kalau harga sama, urutkan nama dari A ke Z.\n\nTampilkan nama dan harga.',
    tables: [
      {
        name: 'produk',
        columns: PRODUK_COLUMNS,
        sampleRows: [
          ['5', 'Minyak goreng 1L', '76000'],
          ['2', 'Kopi tubruk', 'NULL'],
          ['4', 'Garam dapur', '0'],
          ['3', 'Beras 5kg', '76000'],
        ],
      },
    ],
    starterSql: `SELECT nama
FROM produk;`,
    seedSql: `CREATE OR REPLACE TABLE produk (
  id INTEGER,
  nama VARCHAR,
  harga INTEGER
);
INSERT INTO produk VALUES
  (5, 'Minyak goreng 1L', 76000),
  (1, 'Teh celup', 8500),
  (6, 'Gula 1kg', 16000),
  (2, 'Kopi tubruk', NULL),
  (4, 'Garam dapur', 0),
  (3, 'Beras 5kg', 76000);`,
    expected: {
      columns: ['nama', 'harga'],
      rows: [
        ['Beras 5kg', '76000'],
        ['Minyak goreng 1L', '76000'],
        ['Gula 1kg', '16000'],
        ['Teh celup', '8500'],
        ['Garam dapur', '0'],
        ['Kopi tubruk', 'NULL'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'total-belanja-per-kota',
    title: 'Total Belanja per Kota',
    category: 'Agregasi',
    level: 'Sedang',
    tags: ['group_by', 'intermediate'],
    premium: false,
    prompt:
      'Akhir pekan, TokoKulwon merangkum omzet pelanggan per kota. Satu baris per kota sudah cukup, walaupun kota itu punya lebih dari satu pelanggan.\n\nTampilkan kota dan kolom total berisi jumlah belanja. Urutkan menurut nama kota dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '2' },
          { name: 'nama', type: 'VARCHAR', sample: 'Budi Santoso' },
          { name: 'kota', type: 'VARCHAR', sample: 'Jakarta' },
          { name: 'total_belanja', type: 'INTEGER', sample: '200000' },
        ],
        sampleRows: [
          ['2', 'Budi Santoso', 'Jakarta', '200000'],
          ['5', 'Dewi Lestari', 'Jakarta', '150000'],
          ['1', 'Sari Wulandari', 'Yogyakarta', '100000'],
        ],
      },
    ],
    starterSql: `SELECT kota
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (1, 'Sari Wulandari', 'Yogyakarta', 100000),
  (2, 'Budi Santoso', 'Jakarta', 200000),
  (3, 'Lina Kusuma', 'Surabaya', 50000),
  (4, 'Agus Pratama', 'Bandung', 80000),
  (5, 'Dewi Lestari', 'Jakarta', 150000),
  (6, 'Raka Putra', 'Medan', 70000);`,
    expected: {
      columns: ['kota', 'total'],
      rows: [
        ['Bandung', '80000'],
        ['Jakarta', '350000'],
        ['Medan', '70000'],
        ['Surabaya', '50000'],
        ['Yogyakarta', '100000'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'produk-tanpa-harga',
    title: 'Produk tanpa Harga',
    category: 'Kualitas Data',
    level: 'Sedang',
    tags: ['null', 'data_quality', 'intermediate'],
    premium: false,
    prompt:
      'Ada barang di rak TokoKulwon yang harganya belum tercatat. Harga nol tetap harga yang tertulis, jadi jangan ikut.\n\nTampilkan nama produk yang harganya kosong.',
    tables: [
      {
        name: 'produk',
        columns: PRODUK_COLUMNS,
        sampleRows: [
          ['2', 'Garam dapur', '0'],
          ['3', 'Kopi tubruk', 'NULL'],
          ['1', 'Beras 5kg', '76000'],
        ],
      },
    ],
    starterSql: `SELECT nama
FROM produk;`,
    seedSql: `CREATE OR REPLACE TABLE produk (
  id INTEGER,
  nama VARCHAR,
  harga INTEGER
);
INSERT INTO produk VALUES
  (1, 'Beras 5kg', 76000),
  (2, 'Garam dapur', 0),
  (3, 'Kopi tubruk', NULL),
  (4, 'Teh celup', NULL),
  (5, 'Gula 1kg', 16000);`,
    expected: {
      columns: ['nama'],
      rows: [
        ['Kopi tubruk'],
        ['Teh celup'],
      ],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'kota-minimal-dua-pelanggan',
    title: 'Kota dengan Minimal Dua Pelanggan',
    category: 'Agregasi',
    level: 'Sedang',
    tags: ['group_by', 'having', 'intermediate'],
    premium: false,
    prompt:
      'TokoKulwon ingin kota yang sudah punya sedikitnya dua pelanggan. Kota dengan tepat dua pelanggan tetap masuk. Kota dengan satu pelanggan tidak.\n\nTampilkan kota dan kolom jumlah berisi banyaknya pelanggan. Urutkan menurut nama kota dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Raka Putra' },
          { name: 'kota', type: 'VARCHAR', sample: 'Medan' },
          { name: 'total_belanja', type: 'INTEGER', sample: '70000' },
        ],
        sampleRows: [
          ['1', 'Raka Putra', 'Medan', '70000'],
          ['4', 'Agus Pratama', 'Bandung', '80000'],
          ['6', 'Dewi Lestari', 'Bandung', '90000'],
          ['3', 'Budi Santoso', 'Jakarta', '200000'],
        ],
      },
    ],
    starterSql: `SELECT kota
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (1, 'Raka Putra', 'Medan', 70000),
  (2, 'Sari Wulandari', 'Yogyakarta', 100000),
  (3, 'Budi Santoso', 'Jakarta', 200000),
  (4, 'Agus Pratama', 'Bandung', 80000),
  (5, 'Rina Hartati', 'Jakarta', 120000),
  (6, 'Dewi Lestari', 'Bandung', 90000),
  (7, 'Andi Saputra', 'Jakarta', 110000);`,
    expected: {
      columns: ['kota', 'jumlah'],
      rows: [
        ['Bandung', '2'],
        ['Jakarta', '3'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'omzet-kota-ambang',
    title: 'Omzet Kota di Atas Ambang',
    category: 'Agregasi',
    level: 'Sedang',
    tags: ['group_by', 'having', 'intermediate'],
    premium: false,
    prompt:
      'TokoKulwon menandai kota yang jumlah belanja pelanggannya mencapai 300000. Kota yang jumlahnya tepat 300000 tetap masuk.\n\nTampilkan kota dan kolom omzet berisi jumlah belanja. Urutkan menurut nama kota dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '2' },
          { name: 'nama', type: 'VARCHAR', sample: 'Sari Wulandari' },
          { name: 'kota', type: 'VARCHAR', sample: 'Yogyakarta' },
          { name: 'total_belanja', type: 'INTEGER', sample: '200000' },
        ],
        sampleRows: [
          ['2', 'Sari Wulandari', 'Yogyakarta', '200000'],
          ['3', 'Dewi Lestari', 'Yogyakarta', '250000'],
          ['5', 'Nina Sari', 'Semarang', '300000'],
          ['1', 'Lina Kusuma', 'Surabaya', '250000'],
        ],
      },
    ],
    starterSql: `SELECT kota, total_belanja
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (1, 'Lina Kusuma', 'Surabaya', 250000),
  (2, 'Sari Wulandari', 'Yogyakarta', 200000),
  (3, 'Dewi Lestari', 'Yogyakarta', 250000),
  (4, 'Raka Putra', 'Medan', 100000),
  (5, 'Nina Sari', 'Semarang', 300000);`,
    expected: {
      columns: ['kota', 'omzet'],
      rows: [
        ['Semarang', '300000'],
        ['Yogyakarta', '450000'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'kota-tepat-dua-pelanggan',
    title: 'Kota dengan Tepat Dua Pelanggan',
    category: 'Agregasi',
    level: 'Sedang',
    tags: ['group_by', 'having', 'intermediate'],
    premium: false,
    prompt:
      'Cabang TokoKulwon ingin kota yang pelanggannya tepat dua orang. Kota dengan tiga pelanggan tidak masuk. Kota dengan satu pelanggan juga tidak.\n\nTampilkan kota dan kolom jumlah. Urutkan menurut nama kota dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Maya Putri' },
          { name: 'kota', type: 'VARCHAR', sample: 'Malang' },
          { name: 'total_belanja', type: 'INTEGER', sample: '80000' },
        ],
        sampleRows: [
          ['1', 'Maya Putri', 'Malang', '80000'],
          ['2', 'Sari Wulandari', 'Solo', '90000'],
          ['4', 'Agus Pratama', 'Bogor', '60000'],
          ['3', 'Raka Putra', 'Depok', '70000'],
        ],
      },
    ],
    starterSql: `SELECT kota
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (1, 'Maya Putri', 'Malang', 80000),
  (2, 'Sari Wulandari', 'Solo', 90000),
  (3, 'Raka Putra', 'Depok', 70000),
  (4, 'Agus Pratama', 'Bogor', 60000),
  (5, 'Budi Santoso', 'Malang', 110000),
  (6, 'Dewi Lestari', 'Solo', 120000),
  (7, 'Lina Kusuma', 'Malang', 50000),
  (8, 'Rina Hartati', 'Bogor', 130000);`,
    expected: {
      columns: ['kota', 'jumlah'],
      rows: [
        ['Bogor', '2'],
        ['Solo', '2'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'rata-rata-belanja-tiap-kota',
    title: 'Rata-rata Belanja tiap Kota',
    category: 'Agregasi',
    level: 'Sedang',
    tags: ['group_by', 'intermediate'],
    premium: false,
    prompt:
      'Tiap kota punya rata-rata belanja pelanggan sendiri.\n\nTampilkan kota dan kolom rata_rata. Urutkan menurut nama kota dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Raka Putra' },
          { name: 'kota', type: 'VARCHAR', sample: 'Medan' },
          { name: 'total_belanja', type: 'INTEGER', sample: '150000' },
        ],
        sampleRows: [
          ['1', 'Raka Putra', 'Medan', '150000'],
          ['6', 'Lina Kusuma', 'Medan', '250000'],
          ['4', 'Budi Santoso', 'Jakarta', '400000'],
        ],
      },
    ],
    starterSql: `SELECT kota, total_belanja
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (1, 'Raka Putra', 'Medan', 150000),
  (2, 'Agus Pratama', 'Bandung', 100000),
  (3, 'Sari Wulandari', 'Yogyakarta', 180000),
  (4, 'Budi Santoso', 'Jakarta', 400000),
  (5, 'Dewi Lestari', 'Bandung', 300000),
  (6, 'Lina Kusuma', 'Medan', 250000);`,
    expected: {
      columns: ['kota', 'rata_rata'],
      rows: [
        ['Bandung', '200000'],
        ['Jakarta', '400000'],
        ['Medan', '200000'],
        ['Yogyakarta', '180000'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'rentang-belanja-tiap-kota',
    title: 'Rentang Belanja tiap Kota',
    category: 'Agregasi',
    level: 'Sedang',
    tags: ['group_by', 'intermediate'],
    premium: false,
    prompt:
      'TokoKulwon ingin belanja terkecil dan terbesar di tiap kota.\n\nTampilkan kota, kolom terkecil, dan kolom terbesar. Urutkan menurut nama kota dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Lina Kusuma' },
          { name: 'kota', type: 'VARCHAR', sample: 'Surabaya' },
          { name: 'total_belanja', type: 'INTEGER', sample: '80000' },
        ],
        sampleRows: [
          ['1', 'Lina Kusuma', 'Surabaya', '80000'],
          ['4', 'Rina Hartati', 'Surabaya', '500000'],
          ['3', 'Sari Wulandari', 'Yogyakarta', '120000'],
        ],
      },
    ],
    starterSql: `SELECT kota, total_belanja
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (1, 'Lina Kusuma', 'Surabaya', 80000),
  (2, 'Budi Santoso', 'Jakarta', 90000),
  (3, 'Sari Wulandari', 'Yogyakarta', 120000),
  (4, 'Rina Hartati', 'Surabaya', 500000),
  (5, 'Agus Pratama', 'Jakarta', 300000);`,
    expected: {
      columns: ['kota', 'terkecil', 'terbesar'],
      rows: [
        ['Jakarta', '90000', '300000'],
        ['Surabaya', '80000', '500000'],
        ['Yogyakarta', '120000', '120000'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'pesanan-tiap-pelanggan',
    title: 'Pesanan tiap Pelanggan',
    category: 'Menggabungkan Tabel',
    level: 'Sedang',
    tags: ['join', 'group_by', 'intermediate'],
    premium: false,
    prompt:
      'TokoKulwon menghitung berapa kali tiap pelanggan memesan. Pelanggan yang belum pernah memesan tidak ditampilkan. Dua pesanan tetap satu baris.\n\nTampilkan nama dan kolom jumlah_pesanan. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: PELANGGAN_COLUMNS,
        sampleRows: [
          ['1', 'Sari Wulandari', 'Yogyakarta', '185000'],
          ['3', 'Lina Kusuma', 'Surabaya', '95000'],
          ['2', 'Budi Santoso', 'Jakarta', '420000'],
        ],
      },
      {
        name: 'pesanan',
        columns: PESANAN_COLUMNS,
        sampleRows: [
          ['2', '1', '45000'],
          ['3', '1', '15000'],
          ['1', '2', '90000'],
        ],
      },
    ],
    starterSql: `SELECT *
FROM pesanan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (1, 'Sari Wulandari', 'Yogyakarta', 185000),
  (2, 'Budi Santoso', 'Jakarta', 420000),
  (3, 'Lina Kusuma', 'Surabaya', 95000),
  (4, 'Agus Pratama', 'Bandung', 310000);
CREATE OR REPLACE TABLE pesanan (
  id INTEGER,
  pelanggan_id INTEGER,
  total INTEGER
);
INSERT INTO pesanan VALUES
  (1, 2, 90000),
  (2, 1, 45000),
  (3, 1, 15000),
  (4, 4, 80000),
  (5, 99, 10000);`,
    expected: {
      columns: ['nama', 'jumlah_pesanan'],
      rows: [
        ['Agus Pratama', '1'],
        ['Budi Santoso', '1'],
        ['Sari Wulandari', '2'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'berapa-kota-tercatat',
    title: 'Berapa Kota Tercatat',
    category: 'Agregasi',
    level: 'Sedang',
    tags: ['distinct', 'intermediate'],
    premium: false,
    prompt:
      'Berapa kota yang benar-benar tercatat di buku pelanggan TokoKulwon? Kota yang sama dihitung sekali. Kota yang kosong tidak dihitung.\n\nTampilkan satu kolom jumlah_kota dengan satu angka.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Budi Santoso' },
          { name: 'kota', type: 'VARCHAR', sample: 'Jakarta' },
          { name: 'total_belanja', type: 'INTEGER', sample: '100000' },
        ],
        sampleRows: [
          ['1', 'Budi Santoso', 'Jakarta', '100000'],
          ['2', 'Rina Hartati', 'Jakarta', '120000'],
          ['4', 'Agus Pratama', 'NULL', '80000'],
        ],
      },
    ],
    starterSql: `SELECT kota
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (1, 'Budi Santoso', 'Jakarta', 100000),
  (2, 'Rina Hartati', 'Jakarta', 120000),
  (3, 'Lina Kusuma', 'Surabaya', 90000),
  (4, 'Agus Pratama', NULL, 80000),
  (5, 'Dewi Lestari', 'Bandung', 70000);`,
    expected: {
      columns: ['jumlah_kota'],
      rows: [['3']],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'nama-pelanggan-yang-berulang',
    title: 'Nama Pelanggan yang Berulang',
    category: 'Agregasi',
    level: 'Sedang',
    tags: ['group_by', 'having', 'intermediate'],
    premium: false,
    prompt:
      'Ada nama pelanggan yang tertulis lebih dari sekali. Nama yang muncul tepat dua kali tetap masuk. Nama yang hanya sekali tidak.\n\nTampilkan nama dan kolom jumlah. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Sari Wulandari' },
          { name: 'kota', type: 'VARCHAR', sample: 'Yogyakarta' },
          { name: 'total_belanja', type: 'INTEGER', sample: '100000' },
        ],
        sampleRows: [
          ['1', 'Sari Wulandari', 'Yogyakarta', '100000'],
          ['3', 'Sari Wulandari', 'Bandung', '90000'],
          ['4', 'Dewi Lestari', 'Semarang', '70000'],
          ['2', 'Budi Santoso', 'Jakarta', '80000'],
        ],
      },
    ],
    starterSql: `SELECT nama
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (1, 'Sari Wulandari', 'Yogyakarta', 100000),
  (2, 'Budi Santoso', 'Jakarta', 80000),
  (3, 'Sari Wulandari', 'Bandung', 90000),
  (4, 'Dewi Lestari', 'Semarang', 70000),
  (5, 'Sari Wulandari', 'Medan', 60000),
  (6, 'Dewi Lestari', 'Solo', 110000);`,
    expected: {
      columns: ['nama', 'jumlah'],
      rows: [
        ['Dewi Lestari', '2'],
        ['Sari Wulandari', '3'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'lebih-mahal-dari-yang-termurah',
    title: 'Lebih Mahal dari yang Termurah',
    category: 'Filter Data',
    level: 'Sedang',
    tags: ['subquery', 'intermediate'],
    premium: false,
    prompt:
      'TokoKulwon ingin barang yang lebih mahal daripada barang termurah. Barang termurah tidak ikut. Harga yang belum diisi diabaikan dan tidak ditampilkan.\n\nTampilkan nama dan harga.',
    tables: [
      {
        name: 'produk',
        columns: PRODUK_COLUMNS,
        sampleRows: [
          ['1', 'Garam dapur', '5000'],
          ['2', 'Teh celup', '8000'],
          ['5', 'Kopi tubruk', 'NULL'],
        ],
      },
    ],
    starterSql: `SELECT nama, harga
FROM produk;`,
    seedSql: `CREATE OR REPLACE TABLE produk (
  id INTEGER,
  nama VARCHAR,
  harga INTEGER
);
INSERT INTO produk VALUES
  (1, 'Garam dapur', 5000),
  (2, 'Teh celup', 8000),
  (3, 'Gula 1kg', 16000),
  (4, 'Beras 5kg', 76000),
  (5, 'Kopi tubruk', NULL);`,
    expected: {
      columns: ['nama', 'harga'],
      rows: [
        ['Teh celup', '8000'],
        ['Gula 1kg', '16000'],
        ['Beras 5kg', '76000'],
      ],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'produk-paling-mahal',
    title: 'Produk Paling Mahal',
    category: 'Filter Data',
    level: 'Sedang',
    tags: ['subquery', 'intermediate'],
    premium: false,
    prompt:
      'Beberapa barang bisa sama-sama paling mahal. Keduanya harus muncul, jangan hanya satu. Harga kosong bukan yang termahal.\n\nTampilkan nama dan harga barang yang harganya sama dengan harga tertinggi. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'produk',
        columns: PRODUK_COLUMNS,
        sampleRows: [
          ['1', 'Minyak goreng 1L', '76000'],
          ['4', 'Beras 5kg', '76000'],
          ['3', 'Kopi tubruk', 'NULL'],
        ],
      },
    ],
    starterSql: `SELECT nama, harga
FROM produk;`,
    seedSql: `CREATE OR REPLACE TABLE produk (
  id INTEGER,
  nama VARCHAR,
  harga INTEGER
);
INSERT INTO produk VALUES
  (1, 'Minyak goreng 1L', 76000),
  (2, 'Gula 1kg', 16000),
  (3, 'Kopi tubruk', NULL),
  (4, 'Beras 5kg', 76000),
  (5, 'Teh celup', 8500);`,
    expected: {
      columns: ['nama', 'harga'],
      rows: [
        ['Beras 5kg', '76000'],
        ['Minyak goreng 1L', '76000'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'barang-tak-terjual',
    title: 'Barang Tak Terjual',
    category: 'Menggabungkan Tabel',
    level: 'Sedang',
    tags: ['subquery', 'intermediate'],
    premium: false,
    prompt:
      'TokoKulwon mencari barang yang belum pernah terjual. Baris penjualan yang nomor barangnya kosong jangan membuat barang lain ikut hilang.\n\nTampilkan nama barang yang tidak punya penjualan.',
    tables: [
      {
        name: 'produk',
        columns: PRODUK_COLUMNS,
        sampleRows: [
          ['1', 'Beras 5kg', '76000'],
          ['2', 'Gula 1kg', '16000'],
          ['3', 'Teh celup', '8500'],
        ],
      },
      {
        name: 'penjualan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'produk_id', type: 'INTEGER', sample: '1' },
          { name: 'qty', type: 'INTEGER', sample: '4' },
        ],
        sampleRows: [
          ['1', '1', '4'],
          ['2', 'NULL', '2'],
          ['3', '2', '1'],
        ],
      },
    ],
    starterSql: `SELECT nama
FROM produk;`,
    seedSql: `CREATE OR REPLACE TABLE produk (
  id INTEGER,
  nama VARCHAR,
  harga INTEGER
);
INSERT INTO produk VALUES
  (1, 'Beras 5kg', 76000),
  (2, 'Gula 1kg', 16000),
  (3, 'Teh celup', 8500);
CREATE OR REPLACE TABLE penjualan (
  id INTEGER,
  produk_id INTEGER,
  qty INTEGER
);
INSERT INTO penjualan VALUES
  (1, 1, 4),
  (2, NULL, 2),
  (3, 2, 1);`,
    expected: {
      columns: ['nama'],
      rows: [['Teh celup']],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'pelanggan-yang-sudah-memesan',
    title: 'Pelanggan yang Sudah Memesan',
    category: 'Menggabungkan Tabel',
    level: 'Sedang',
    tags: ['join', 'distinct', 'intermediate'],
    premium: false,
    prompt:
      'Tampilkan pelanggan TokoKulwon yang sudah punya pesanan. Pelanggan dengan dua pesanan hanya muncul sekali.\n\nTampilkan nama. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: PELANGGAN_COLUMNS,
        sampleRows: [
          ['1', 'Raka Putra', 'Medan', '275000'],
          ['3', 'Dewi Lestari', 'Semarang', '150000'],
          ['2', 'Sari Wulandari', 'Yogyakarta', '185000'],
        ],
      },
      {
        name: 'pesanan',
        columns: PESANAN_COLUMNS,
        sampleRows: [
          ['1', '4', '20000'],
          ['2', '3', '15000'],
          ['4', '1', '30000'],
        ],
      },
    ],
    starterSql: `SELECT nama
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (1, 'Raka Putra', 'Medan', 275000),
  (2, 'Sari Wulandari', 'Yogyakarta', 185000),
  (3, 'Dewi Lestari', 'Semarang', 150000),
  (4, 'Lina Kusuma', 'Surabaya', 95000);
CREATE OR REPLACE TABLE pesanan (
  id INTEGER,
  pelanggan_id INTEGER,
  total INTEGER
);
INSERT INTO pesanan VALUES
  (1, 4, 20000),
  (2, 3, 15000),
  (3, 3, 45000),
  (4, 1, 30000);`,
    expected: {
      columns: ['nama'],
      rows: [
        ['Dewi Lestari'],
        ['Lina Kusuma'],
        ['Raka Putra'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'pelanggan-yang-belum-memesan',
    title: 'Pelanggan yang Belum Memesan',
    category: 'Menggabungkan Tabel',
    level: 'Sedang',
    tags: ['left_join', 'subquery', 'intermediate'],
    premium: false,
    prompt:
      'TokoKulwon ingin pelanggan yang belum pernah memesan. Pesanan yang nomor pelanggannya kosong jangan menyembunyikan pelanggan lain.\n\nTampilkan nama. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '3' },
          { name: 'nama', type: 'VARCHAR', sample: 'Maya Putri' },
          { name: 'kota', type: 'VARCHAR', sample: 'Surabaya' },
          { name: 'total_belanja', type: 'INTEGER', sample: '210000' },
        ],
        sampleRows: [
          ['3', 'Maya Putri', 'Surabaya', '210000'],
          ['1', 'Agus Pratama', 'Bandung', '310000'],
          ['2', 'Budi Santoso', 'Jakarta', '420000'],
        ],
      },
      {
        name: 'pesanan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'pelanggan_id', type: 'INTEGER', sample: '2' },
          { name: 'total', type: 'INTEGER', sample: '120000' },
        ],
        sampleRows: [
          ['1', '2', '120000'],
          ['2', '4', '30000'],
          ['5', 'NULL', '5000'],
        ],
      },
    ],
    starterSql: `SELECT nama
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (3, 'Maya Putri', 'Surabaya', 210000),
  (1, 'Agus Pratama', 'Bandung', 310000),
  (5, 'Rina Hartati', 'Jakarta', 90000),
  (2, 'Budi Santoso', 'Jakarta', 420000),
  (4, 'Nina Sari', 'Solo', 80000);
CREATE OR REPLACE TABLE pesanan (
  id INTEGER,
  pelanggan_id INTEGER,
  total INTEGER
);
INSERT INTO pesanan VALUES
  (1, 2, 120000),
  (2, 4, 30000),
  (3, 2, 15000),
  (5, NULL, 5000);`,
    expected: {
      columns: ['nama'],
      rows: [
        ['Agus Pratama'],
        ['Maya Putri'],
        ['Rina Hartati'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'pelanggan-di-kota-gudang',
    title: 'Pelanggan di Kota Gudang',
    category: 'Filter Data',
    level: 'Sedang',
    tags: ['subquery', 'intermediate'],
    premium: false,
    prompt:
      'TokoKulwon hanya mengantar ke kota yang punya gudang. Pelanggan di kota lain tidak masuk.\n\nTampilkan nama dan kota pelanggan yang kotanya ada di daftar gudang. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: PELANGGAN_COLUMNS,
        sampleRows: [
          ['1', 'Sari Wulandari', 'Yogyakarta', '185000'],
          ['2', 'Budi Santoso', 'Jakarta', '420000'],
          ['5', 'Maya Putri', 'Medan', '100000'],
        ],
      },
      {
        name: 'gudang',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'kota', type: 'VARCHAR', sample: 'Yogyakarta' },
        ],
        sampleRows: [
          ['1', 'Yogyakarta'],
          ['2', 'Surabaya'],
          ['3', 'Medan'],
        ],
      },
    ],
    starterSql: `SELECT nama, kota
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (1, 'Sari Wulandari', 'Yogyakarta', 185000),
  (2, 'Budi Santoso', 'Jakarta', 420000),
  (3, 'Lina Kusuma', 'Surabaya', 95000),
  (4, 'Agus Pratama', 'Bandung', 310000),
  (5, 'Maya Putri', 'Medan', 100000);
CREATE OR REPLACE TABLE gudang (
  id INTEGER,
  kota VARCHAR
);
INSERT INTO gudang VALUES
  (1, 'Yogyakarta'),
  (2, 'Surabaya'),
  (3, 'Medan');`,
    expected: {
      columns: ['nama', 'kota'],
      rows: [
        ['Lina Kusuma', 'Surabaya'],
        ['Maya Putri', 'Medan'],
        ['Sari Wulandari', 'Yogyakarta'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'omzet-kota-lewat-ringkasan',
    title: 'Omzet Kota lewat Ringkasan',
    category: 'Agregasi',
    level: 'Sedang',
    tags: ['cte', 'intermediate'],
    premium: false,
    prompt:
      'Ringkas dulu belanja per kota, lalu simpan kota yang omzetnya mencapai 300000. Kota yang tepat 300000 tetap masuk.\n\nTampilkan kota dan kolom omzet. Urutkan menurut nama kota dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Fajar Hadi' },
          { name: 'kota', type: 'VARCHAR', sample: 'Solo' },
          { name: 'total_belanja', type: 'INTEGER', sample: '300000' },
        ],
        sampleRows: [
          ['1', 'Fajar Hadi', 'Solo', '300000'],
          ['2', 'Eka Putra', 'Bogor', '450000'],
          ['3', 'Citra Ayu', 'Depok', '100000'],
        ],
      },
    ],
    starterSql: `SELECT kota, total_belanja
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (1, 'Fajar Hadi', 'Solo', 300000),
  (2, 'Eka Putra', 'Bogor', 450000),
  (3, 'Citra Ayu', 'Depok', 100000);`,
    expected: {
      columns: ['kota', 'omzet'],
      rows: [
        ['Bogor', '450000'],
        ['Solo', '300000'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'pelanggan-medan-lewat-daftar',
    title: 'Pelanggan Medan lewat Daftar',
    category: 'Filter Data',
    level: 'Sedang',
    tags: ['cte', 'intermediate'],
    premium: false,
    prompt:
      'Tim Medan butuh nama pelanggan di kotanya saja.\n\nTampilkan nama pelanggan dari Medan. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: PELANGGAN_COLUMNS,
        sampleRows: [
          ['2', 'Raka Putra', 'Medan', '275000'],
          ['4', 'Nina Sari', 'Medan', '90000'],
          ['1', 'Budi Santoso', 'Jakarta', '420000'],
        ],
      },
    ],
    starterSql: `SELECT id
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (1, 'Budi Santoso', 'Jakarta', 420000),
  (2, 'Raka Putra', 'Medan', 275000),
  (3, 'Sari Wulandari', 'Yogyakarta', 185000),
  (4, 'Nina Sari', 'Medan', 90000);`,
    expected: {
      columns: ['nama'],
      rows: [
        ['Nina Sari'],
        ['Raka Putra'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'label-harga-barang',
    title: 'Label Harga Barang',
    category: 'Kondisi',
    level: 'Sedang',
    tags: ['case_when', 'intermediate'],
    premium: false,
    prompt:
      'Beri label harga barang TokoKulwon. Harga kosong berlabel belum diisi. Harga 5000 sampai 15000 berlabel hemat. Harga 15001 sampai 30000 berlabel biasa. Harga 30001 sampai 80000 berlabel mahal. Batas bawah dan batas atas tiap label tetap masuk.\n\nTampilkan nama dan kolom label. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'produk',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '6' },
          { name: 'nama', type: 'VARCHAR', sample: 'Garam dapur' },
          { name: 'harga', type: 'INTEGER', sample: '5000' },
        ],
        sampleRows: [
          ['6', 'Garam dapur', '5000'],
          ['2', 'Teh celup', '15000'],
          ['7', 'Kecap 600ml', '30001'],
          ['1', 'Kopi tubruk', 'NULL'],
        ],
      },
    ],
    starterSql: `SELECT nama, harga
FROM produk;`,
    seedSql: `CREATE OR REPLACE TABLE produk (
  id INTEGER,
  nama VARCHAR,
  harga INTEGER
);
INSERT INTO produk VALUES
  (1, 'Kopi tubruk', NULL),
  (2, 'Teh celup', 15000),
  (3, 'Beras 5kg', 80000),
  (4, 'Minyak goreng 1L', 30000),
  (5, 'Gula 1kg', 15001),
  (6, 'Garam dapur', 5000),
  (7, 'Kecap 600ml', 30001);`,
    expected: {
      columns: ['nama', 'label'],
      rows: [
        ['Beras 5kg', 'mahal'],
        ['Garam dapur', 'hemat'],
        ['Gula 1kg', 'biasa'],
        ['Kecap 600ml', 'mahal'],
        ['Kopi tubruk', 'belum diisi'],
        ['Minyak goreng 1L', 'biasa'],
        ['Teh celup', 'hemat'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'vip-dan-biasa-sekaligus',
    title: 'VIP dan Biasa Sekaligus',
    category: 'Kondisi',
    level: 'Sedang',
    tags: ['case_when', 'intermediate'],
    premium: false,
    prompt:
      'TokoKulwon menghitung dua kelompok sekaligus. Belanja 300000 atau lebih adalah VIP. Di bawah itu biasa. Belanja yang kosong tidak masuk kelompok mana pun. Pelanggan yang tepat 300000 dihitung VIP.\n\nTampilkan satu baris dengan kolom jumlah_vip dan jumlah_biasa.',
    tables: [
      {
        name: 'pelanggan',
        columns: PELANGGAN_COLUMNS,
        sampleRows: [
          ['2', 'Agus Pratama', 'Bandung', '300000'],
          ['5', 'Dewi Lestari', 'Semarang', 'NULL'],
          ['3', 'Sari Wulandari', 'Yogyakarta', '185000'],
        ],
      },
    ],
    starterSql: `SELECT nama, total_belanja
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (1, 'Budi Santoso', 'Jakarta', 420000),
  (2, 'Agus Pratama', 'Bandung', 300000),
  (3, 'Sari Wulandari', 'Yogyakarta', 185000),
  (4, 'Lina Kusuma', 'Surabaya', 95000),
  (5, 'Dewi Lestari', 'Semarang', NULL),
  (6, 'Raka Putra', 'Medan', 275000);`,
    expected: {
      columns: ['jumlah_vip', 'jumlah_biasa'],
      rows: [['2', '3']],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'urutan-status-stok',
    title: 'Urutan Status Stok',
    category: 'SQL Dasar',
    level: 'Sedang',
    tags: ['case_when', 'intermediate'],
    premium: false,
    prompt:
      'Susun barang TokoKulwon menurut status stok: habis dulu, lalu tipis, lalu aman. Di dalam status yang sama, urutkan nama dari A ke Z.\n\nTampilkan nama dan status.',
    tables: [
      {
        name: 'produk',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '3' },
          { name: 'nama', type: 'VARCHAR', sample: 'Beras 5kg' },
          { name: 'status', type: 'VARCHAR', sample: 'habis' },
        ],
        sampleRows: [
          ['1', 'Teh celup', 'tipis'],
          ['3', 'Beras 5kg', 'habis'],
          ['2', 'Gula 1kg', 'aman'],
          ['6', 'Kopi tubruk', 'habis'],
        ],
      },
    ],
    starterSql: `SELECT nama, status
FROM produk;`,
    seedSql: `CREATE OR REPLACE TABLE produk (
  id INTEGER,
  nama VARCHAR,
  status VARCHAR
);
INSERT INTO produk VALUES
  (1, 'Teh celup', 'tipis'),
  (2, 'Gula 1kg', 'aman'),
  (3, 'Beras 5kg', 'habis'),
  (4, 'Garam dapur', 'aman'),
  (5, 'Minyak goreng 1L', 'tipis'),
  (6, 'Kopi tubruk', 'habis');`,
    expected: {
      columns: ['nama', 'status'],
      rows: [
        ['Beras 5kg', 'habis'],
        ['Kopi tubruk', 'habis'],
        ['Minyak goreng 1L', 'tipis'],
        ['Teh celup', 'tipis'],
        ['Garam dapur', 'aman'],
        ['Gula 1kg', 'aman'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'harga-kosong-dianggap-nol',
    title: 'Harga Kosong Dianggap Nol',
    category: 'Kualitas Data',
    level: 'Sedang',
    tags: ['coalesce', 'null', 'intermediate'],
    premium: false,
    prompt:
      'Label harga menganggap harga kosong sebagai nol. Harga nol yang sudah tertulis tetap nol.\n\nTampilkan nama dan kolom harga_tampil. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'produk',
        columns: PRODUK_COLUMNS,
        sampleRows: [
          ['1', 'Kopi tubruk', 'NULL'],
          ['2', 'Garam dapur', '0'],
          ['3', 'Beras 5kg', '76000'],
        ],
      },
    ],
    starterSql: `SELECT nama, harga
FROM produk;`,
    seedSql: `CREATE OR REPLACE TABLE produk (
  id INTEGER,
  nama VARCHAR,
  harga INTEGER
);
INSERT INTO produk VALUES
  (1, 'Kopi tubruk', NULL),
  (2, 'Garam dapur', 0),
  (3, 'Beras 5kg', 76000),
  (4, 'Teh celup', 8500);`,
    expected: {
      columns: ['nama', 'harga_tampil'],
      rows: [
        ['Beras 5kg', '76000'],
        ['Garam dapur', '0'],
        ['Kopi tubruk', '0'],
        ['Teh celup', '8500'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'kota-belum-diisi',
    title: 'Kota Belum Diisi',
    category: 'Kualitas Data',
    level: 'Sedang',
    tags: ['coalesce', 'null', 'intermediate'],
    premium: false,
    prompt:
      'Kalau kota pelanggan belum tercatat, tulis belum diisi. Kota yang tertulis sebagai teks kosong tetap kosong.\n\nTampilkan nama dan kota. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Lina Kusuma' },
          { name: 'kota', type: 'VARCHAR', sample: 'NULL' },
        ],
        sampleRows: [
          ['1', 'Lina Kusuma', 'NULL'],
          ['2', 'Agus Pratama', ''],
          ['4', 'Budi Santoso', 'Jakarta'],
        ],
      },
    ],
    starterSql: `SELECT nama
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR
);
INSERT INTO pelanggan VALUES
  (1, 'Lina Kusuma', NULL),
  (2, 'Agus Pratama', ''),
  (3, 'Dewi Lestari', 'Bandung'),
  (4, 'Budi Santoso', 'Jakarta');`,
    expected: {
      columns: ['nama', 'kota'],
      rows: [
        ['Agus Pratama', ''],
        ['Budi Santoso', 'Jakarta'],
        ['Dewi Lestari', 'Bandung'],
        ['Lina Kusuma', 'belum diisi'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'email-tidak-bisa-dipakai',
    title: 'Email Tidak Bisa Dipakai',
    category: 'Kualitas Data',
    level: 'Sedang',
    tags: ['null', 'data_quality', 'intermediate'],
    premium: false,
    prompt:
      'Email tidak bisa dipakai kalau belum tercatat atau tertulis tanpa huruf. Email yang hanya berisi spasi tetap bisa dipakai, jadi jangan ikut.\n\nTampilkan nama dan email pelanggan yang emailnya tidak bisa dipakai.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '2' },
          { name: 'nama', type: 'VARCHAR', sample: 'Lina Kusuma' },
          { name: 'email', type: 'VARCHAR', sample: 'NULL' },
        ],
        sampleRows: [
          ['2', 'Lina Kusuma', 'NULL'],
          ['3', 'Agus Pratama', ''],
          ['4', 'Sari Wulandari', ' '],
          ['1', 'Budi Santoso', 'budi@contoh.id'],
        ],
      },
    ],
    starterSql: `SELECT nama, email
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  email VARCHAR
);
INSERT INTO pelanggan VALUES
  (1, 'Budi Santoso', 'budi@contoh.id'),
  (2, 'Lina Kusuma', NULL),
  (3, 'Agus Pratama', ''),
  (4, 'Sari Wulandari', ' '),
  (5, 'Dewi Lestari', 'dewi@contoh.id');`,
    expected: {
      columns: ['nama', 'email'],
      rows: [
        ['Agus Pratama', ''],
        ['Lina Kusuma', 'NULL'],
      ],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'kota-tanpa-duplikat',
    title: 'Kota tanpa Duplikat',
    category: 'Kualitas Data',
    level: 'Sedang',
    tags: ['distinct', 'intermediate'],
    premium: false,
    prompt:
      'Tampilkan tiap kota pelanggan TokoKulwon sekali.\n\nTampilkan kolom kota. Urutkan menurut nama kota dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Lina Kusuma' },
          { name: 'kota', type: 'VARCHAR', sample: 'Surabaya' },
        ],
        sampleRows: [
          ['1', 'Lina Kusuma', 'Surabaya'],
          ['3', 'Maya Putri', 'Surabaya'],
          ['2', 'Budi Santoso', 'Jakarta'],
          ['6', 'Raka Putra', 'Medan'],
        ],
      },
    ],
    starterSql: `SELECT kota
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR
);
INSERT INTO pelanggan VALUES
  (1, 'Lina Kusuma', 'Surabaya'),
  (2, 'Budi Santoso', 'Jakarta'),
  (3, 'Maya Putri', 'Surabaya'),
  (4, 'Agus Pratama', 'Bandung'),
  (5, 'Rina Hartati', 'Jakarta'),
  (6, 'Raka Putra', 'Medan');`,
    expected: {
      columns: ['kota'],
      rows: [['Bandung'], ['Jakarta'], ['Medan'], ['Surabaya']],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'nama-dari-dua-daftar',
    title: 'Nama dari Dua Daftar',
    category: 'Menggabungkan Tabel',
    level: 'Sedang',
    tags: ['union', 'intermediate'],
    premium: false,
    prompt:
      'Gabungkan nama pelanggan dan nama pemasok TokoKulwon. Nama yang ada di kedua daftar hanya muncul sekali.\n\nTampilkan kolom nama. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Sari Wulandari' },
        ],
        sampleRows: [
          ['1', 'Sari Wulandari'],
          ['2', 'Budi Santoso'],
          ['3', 'Lina Kusuma'],
        ],
      },
      {
        name: 'pemasok',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Budi Santoso' },
        ],
        sampleRows: [
          ['1', 'Budi Santoso'],
          ['2', 'Agus Pratama'],
          ['3', 'Citra Ayu'],
        ],
      },
    ],
    starterSql: `SELECT nama
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR
);
INSERT INTO pelanggan VALUES
  (1, 'Sari Wulandari'),
  (2, 'Budi Santoso'),
  (3, 'Lina Kusuma');
CREATE OR REPLACE TABLE pemasok (
  id INTEGER,
  nama VARCHAR
);
INSERT INTO pemasok VALUES
  (1, 'Budi Santoso'),
  (2, 'Agus Pratama'),
  (3, 'Citra Ayu');`,
    expected: {
      columns: ['nama'],
      rows: [
        ['Agus Pratama'],
        ['Budi Santoso'],
        ['Citra Ayu'],
        ['Lina Kusuma'],
        ['Sari Wulandari'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'kontak-dari-dua-meja',
    title: 'Kontak dari Dua Meja',
    category: 'Menggabungkan Tabel',
    level: 'Sedang',
    tags: ['union', 'intermediate'],
    premium: false,
    prompt:
      'Gabungkan nama kasir dan kurir TokoKulwon. Nama yang sama di kedua meja tetap ditulis dua kali.\n\nTampilkan kolom nama.',
    tables: [
      {
        name: 'kasir',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Sari Wulandari' },
        ],
        sampleRows: [
          ['1', 'Sari Wulandari'],
          ['2', 'Budi Santoso'],
          ['3', 'Lina Kusuma'],
        ],
      },
      {
        name: 'kurir',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Budi Santoso' },
        ],
        sampleRows: [
          ['1', 'Budi Santoso'],
          ['2', 'Dewi Lestari'],
        ],
      },
    ],
    starterSql: `SELECT nama
FROM kasir;`,
    seedSql: `CREATE OR REPLACE TABLE kasir (
  id INTEGER,
  nama VARCHAR
);
INSERT INTO kasir VALUES
  (1, 'Sari Wulandari'),
  (2, 'Budi Santoso'),
  (3, 'Lina Kusuma');
CREATE OR REPLACE TABLE kurir (
  id INTEGER,
  nama VARCHAR
);
INSERT INTO kurir VALUES
  (1, 'Budi Santoso'),
  (2, 'Dewi Lestari');`,
    expected: {
      columns: ['nama'],
      rows: [
        ['Sari Wulandari'],
        ['Budi Santoso'],
        ['Lina Kusuma'],
        ['Budi Santoso'],
        ['Dewi Lestari'],
      ],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'harga-tertulis-sebagai-teks',
    title: 'Harga Tertulis sebagai Teks',
    category: 'Kualitas Data',
    level: 'Sedang',
    tags: ['cast', 'intermediate'],
    premium: false,
    prompt:
      'Harga di tabel ini tertulis sebagai teks. Ambil barang yang nilainya paling besar 20000, termasuk yang tertulis 20000 dan 9000.\n\nTampilkan nama dan harga sebagai angka.',
    tables: [
      {
        name: 'produk',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '4' },
          { name: 'nama', type: 'VARCHAR', sample: 'Garam dapur' },
          { name: 'harga', type: 'VARCHAR', sample: '20000' },
        ],
        sampleRows: [
          ['4', 'Garam dapur', '20000'],
          ['5', 'Minyak goreng 1L', '9000'],
          ['3', 'Teh celup', '8500'],
          ['1', 'Beras 5kg', '76000'],
        ],
      },
    ],
    starterSql: `SELECT nama
FROM produk;`,
    seedSql: `CREATE OR REPLACE TABLE produk (
  id INTEGER,
  nama VARCHAR,
  harga VARCHAR
);
INSERT INTO produk VALUES
  (1, 'Beras 5kg', '76000'),
  (2, 'Gula 1kg', '16000'),
  (3, 'Teh celup', '8500'),
  (4, 'Garam dapur', '20000'),
  (5, 'Minyak goreng 1L', '9000');`,
    expected: {
      columns: ['nama', 'harga'],
      rows: [
        ['Gula 1kg', '16000'],
        ['Teh celup', '8500'],
        ['Garam dapur', '20000'],
        ['Minyak goreng 1L', '9000'],
      ],
    },
    requiresOrder: false,
    xpReward: 50,
  },
  {
    slug: 'barang-dan-penjualan-kosong',
    title: 'Barang dan Penjualan Kosong',
    category: 'Menggabungkan Tabel',
    level: 'Sedang',
    tags: ['left_join', 'intermediate'],
    premium: false,
    prompt:
      'Tampilkan setiap barang TokoKulwon, termasuk yang belum terjual. Kalau belum ada penjualan, qty dibiarkan kosong, bukan nol.\n\nTampilkan nama dan qty. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'produk',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Teh celup' },
        ],
        sampleRows: [
          ['1', 'Teh celup'],
          ['2', 'Gula 1kg'],
          ['3', 'Beras 5kg'],
        ],
      },
      {
        name: 'penjualan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'produk_id', type: 'INTEGER', sample: '3' },
          { name: 'qty', type: 'INTEGER', sample: '4' },
        ],
        sampleRows: [
          ['1', '3', '4'],
          ['2', '1', '2'],
        ],
      },
    ],
    starterSql: `SELECT nama
FROM produk;`,
    seedSql: `CREATE OR REPLACE TABLE produk (
  id INTEGER,
  nama VARCHAR
);
INSERT INTO produk VALUES
  (1, 'Teh celup'),
  (2, 'Gula 1kg'),
  (3, 'Beras 5kg');
CREATE OR REPLACE TABLE penjualan (
  id INTEGER,
  produk_id INTEGER,
  qty INTEGER
);
INSERT INTO penjualan VALUES
  (1, 3, 4),
  (2, 1, 2);`,
    expected: {
      columns: ['nama', 'qty'],
      rows: [
        ['Beras 5kg', '4'],
        ['Gula 1kg', 'NULL'],
        ['Teh celup', '2'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'pasangan-pelanggan-sekota',
    title: 'Pasangan Pelanggan Sekota',
    category: 'Menggabungkan Tabel',
    level: 'Sedang',
    tags: ['self_join', 'join', 'intermediate'],
    premium: false,
    prompt:
      'Cari pasangan pelanggan TokoKulwon yang tinggal di kota yang sama. Satu orang tidak dipasangkan dengan dirinya. Tiap pasangan hanya sekali, dengan nomor yang lebih kecil di depan. Kota yang hanya punya satu pelanggan tidak menghasilkan pasangan.\n\nTampilkan id_a, nama_a, id_b, dan nama_b. Urutkan menurut id_a lalu id_b, dari yang paling kecil.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Sari Wulandari' },
          { name: 'kota', type: 'VARCHAR', sample: 'Jakarta' },
        ],
        sampleRows: [
          ['5', 'Dewi Lestari', 'Jakarta'],
          ['2', 'Lina Kusuma', 'Surabaya'],
          ['1', 'Sari Wulandari', 'Jakarta'],
          ['4', 'Agus Pratama', 'Bandung'],
        ],
      },
    ],
    starterSql: `SELECT id, nama
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR
);
INSERT INTO pelanggan VALUES
  (5, 'Dewi Lestari', 'Jakarta'),
  (2, 'Lina Kusuma', 'Surabaya'),
  (6, 'Raka Putra', 'Bandung'),
  (1, 'Sari Wulandari', 'Jakarta'),
  (4, 'Agus Pratama', 'Bandung'),
  (3, 'Budi Santoso', 'Jakarta');`,
    expected: {
      columns: ['id_a', 'nama_a', 'id_b', 'nama_b'],
      rows: [
        ['1', 'Sari Wulandari', '3', 'Budi Santoso'],
        ['1', 'Sari Wulandari', '5', 'Dewi Lestari'],
        ['3', 'Budi Santoso', '5', 'Dewi Lestari'],
        ['4', 'Agus Pratama', '6', 'Raka Putra'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'harga-di-toko-yang-tepat',
    title: 'Harga di Toko yang Tepat',
    category: 'Menggabungkan Tabel',
    level: 'Sedang',
    tags: ['join', 'intermediate'],
    premium: false,
    prompt:
      'Harga barang tergantung tokonya. Baris pesanan harus memakai harga toko yang sama dan barang yang sama.\n\nTampilkan id baris dan harga. Urutkan menurut id dari yang paling kecil.',
    tables: [
      {
        name: 'harga_toko',
        columns: [
          { name: 'toko_id', type: 'INTEGER', sample: '2' },
          { name: 'produk_id', type: 'INTEGER', sample: '1' },
          { name: 'harga', type: 'INTEGER', sample: '80000' },
        ],
        sampleRows: [
          ['2', '1', '80000'],
          ['1', '1', '76000'],
          ['2', '2', '15000'],
        ],
      },
      {
        name: 'baris',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'toko_id', type: 'INTEGER', sample: '2' },
          { name: 'produk_id', type: 'INTEGER', sample: '2' },
        ],
        sampleRows: [
          ['1', '2', '2'],
          ['2', '1', '1'],
          ['3', '2', '1'],
        ],
      },
    ],
    starterSql: `SELECT id
FROM baris;`,
    seedSql: `CREATE OR REPLACE TABLE harga_toko (
  toko_id INTEGER,
  produk_id INTEGER,
  harga INTEGER
);
INSERT INTO harga_toko VALUES
  (2, 1, 80000),
  (1, 1, 76000),
  (2, 2, 15000),
  (1, 2, 16000);
CREATE OR REPLACE TABLE baris (
  id INTEGER,
  toko_id INTEGER,
  produk_id INTEGER
);
INSERT INTO baris VALUES
  (1, 2, 2),
  (2, 1, 1),
  (3, 2, 1);`,
    expected: {
      columns: ['id', 'harga'],
      rows: [
        ['1', '15000'],
        ['2', '76000'],
        ['3', '80000'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'barang-laku-minimal-sepuluh',
    title: 'Barang Laku Minimal Sepuluh',
    category: 'Agregasi',
    level: 'Sedang',
    tags: ['group_by', 'having', 'intermediate'],
    premium: false,
    prompt:
      'TokoKulwon menandai barang yang terjual sedikitnya 10 buah. Barang yang jumlahnya tepat 10 tetap masuk. Yang di bawah 10 tidak.\n\nTampilkan nama dan kolom total_qty. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'produk',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '2' },
          { name: 'nama', type: 'VARCHAR', sample: 'Beras 5kg' },
        ],
        sampleRows: [
          ['1', 'Gula 1kg'],
          ['2', 'Beras 5kg'],
          ['3', 'Teh celup'],
          ['4', 'Kopi tubruk'],
        ],
      },
      {
        name: 'penjualan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'produk_id', type: 'INTEGER', sample: '3' },
          { name: 'qty', type: 'INTEGER', sample: '12' },
        ],
        sampleRows: [
          ['1', '4', '4'],
          ['3', '3', '12'],
          ['4', '1', '9'],
          ['5', '2', '6'],
        ],
      },
    ],
    starterSql: `SELECT nama
FROM produk;`,
    seedSql: `CREATE OR REPLACE TABLE produk (
  id INTEGER,
  nama VARCHAR
);
INSERT INTO produk VALUES
  (1, 'Gula 1kg'),
  (2, 'Beras 5kg'),
  (3, 'Teh celup'),
  (4, 'Kopi tubruk');
CREATE OR REPLACE TABLE penjualan (
  id INTEGER,
  produk_id INTEGER,
  qty INTEGER
);
INSERT INTO penjualan VALUES
  (1, 4, 4),
  (2, 4, 6),
  (3, 3, 12),
  (4, 1, 9),
  (5, 2, 6),
  (6, 2, 4);`,
    expected: {
      columns: ['nama', 'total_qty'],
      rows: [
        ['Beras 5kg', '10'],
        ['Kopi tubruk', '10'],
        ['Teh celup', '12'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'belanja-di-atas-rata-kota',
    title: 'Belanja di Atas Rata Kota',
    category: 'Filter Data',
    level: 'Sedang',
    tags: ['subquery', 'intermediate'],
    premium: false,
    prompt:
      'Tampilkan pelanggan yang belanjanya lebih besar daripada rata-rata kota mereka sendiri. Yang tepat sama dengan rata-rata kotanya tidak ikut, termasuk kota yang hanya punya satu pelanggan.\n\nTampilkan nama, kota, dan total belanja. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Andi Saputra' },
          { name: 'kota', type: 'VARCHAR', sample: 'Jakarta' },
          { name: 'total_belanja', type: 'INTEGER', sample: '200000' },
        ],
        sampleRows: [
          ['1', 'Andi Saputra', 'Jakarta', '200000'],
          ['3', 'Rina Hartati', 'Jakarta', '300000'],
          ['4', 'Lina Kusuma', 'Surabaya', '150000'],
          ['6', 'Dewi Lestari', 'Bandung', '300000'],
        ],
      },
    ],
    starterSql: `SELECT nama, total_belanja
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (1, 'Andi Saputra', 'Jakarta', 200000),
  (2, 'Budi Santoso', 'Jakarta', 100000),
  (3, 'Rina Hartati', 'Jakarta', 300000),
  (4, 'Lina Kusuma', 'Surabaya', 150000),
  (5, 'Agus Pratama', 'Bandung', 100000),
  (6, 'Dewi Lestari', 'Bandung', 300000);`,
    expected: {
      columns: ['nama', 'kota', 'total_belanja'],
      rows: [
        ['Dewi Lestari', 'Bandung', '300000'],
        ['Rina Hartati', 'Jakarta', '300000'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'gudang-yang-sunyi',
    title: 'Gudang yang Sunyi',
    category: 'Filter Data',
    level: 'Sedang',
    tags: ['subquery', 'intermediate'],
    premium: false,
    prompt:
      'Tampilkan kota gudang TokoKulwon yang tidak punya pelanggan. Kota pelanggan yang kosong jangan menyembunyikan gudang yang memang sepi.\n\nTampilkan kolom kota. Urutkan menurut nama kota dari A ke Z.',
    tables: [
      {
        name: 'gudang',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'kota', type: 'VARCHAR', sample: 'Pontianak' },
        ],
        sampleRows: [
          ['1', 'Pontianak'],
          ['3', 'Medan'],
          ['2', 'Yogyakarta'],
          ['4', 'Surabaya'],
        ],
      },
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Sari Wulandari' },
          { name: 'kota', type: 'VARCHAR', sample: 'Yogyakarta' },
        ],
        sampleRows: [
          ['1', 'Sari Wulandari', 'Yogyakarta'],
          ['2', 'Budi Santoso', 'Jakarta'],
          ['4', 'Agus Pratama', 'NULL'],
        ],
      },
    ],
    starterSql: `SELECT kota
FROM gudang;`,
    seedSql: `CREATE OR REPLACE TABLE gudang (
  id INTEGER,
  kota VARCHAR
);
INSERT INTO gudang VALUES
  (1, 'Pontianak'),
  (2, 'Yogyakarta'),
  (3, 'Medan'),
  (4, 'Surabaya');
CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR
);
INSERT INTO pelanggan VALUES
  (1, 'Sari Wulandari', 'Yogyakarta'),
  (2, 'Budi Santoso', 'Jakarta'),
  (3, 'Lina Kusuma', 'Surabaya'),
  (4, 'Agus Pratama', NULL);`,
    expected: {
      columns: ['kota'],
      rows: [['Medan'], ['Pontianak']],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'total-qty-per-nama',
    title: 'Total Qty per Nama',
    category: 'Agregasi',
    level: 'Sedang',
    tags: ['group_by', 'intermediate'],
    premium: false,
    prompt:
      'Jumlahkan qty tiap nama barang TokoKulwon. Dua baris penjualan untuk barang yang sama digabung. Jangan buang barang yang jumlahnya kecil.\n\nTampilkan nama dan kolom total_qty. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'produk',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '3' },
          { name: 'nama', type: 'VARCHAR', sample: 'Beras 5kg' },
        ],
        sampleRows: [
          ['1', 'Teh celup'],
          ['2', 'Gula 1kg'],
          ['3', 'Beras 5kg'],
        ],
      },
      {
        name: 'penjualan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'produk_id', type: 'INTEGER', sample: '1' },
          { name: 'qty', type: 'INTEGER', sample: '5' },
        ],
        sampleRows: [
          ['1', '1', '5'],
          ['2', '1', '1'],
          ['3', '3', '4'],
          ['5', '2', '2'],
        ],
      },
    ],
    starterSql: `SELECT nama
FROM produk;`,
    seedSql: `CREATE OR REPLACE TABLE produk (
  id INTEGER,
  nama VARCHAR
);
INSERT INTO produk VALUES
  (1, 'Teh celup'),
  (2, 'Gula 1kg'),
  (3, 'Beras 5kg');
CREATE OR REPLACE TABLE penjualan (
  id INTEGER,
  produk_id INTEGER,
  qty INTEGER
);
INSERT INTO penjualan VALUES
  (1, 1, 5),
  (2, 1, 1),
  (3, 3, 4),
  (4, 3, 3),
  (5, 2, 2);`,
    expected: {
      columns: ['nama', 'total_qty'],
      rows: [
        ['Beras 5kg', '7'],
        ['Gula 1kg', '2'],
        ['Teh celup', '6'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'pembeli-beras',
    title: 'Pembeli Beras',
    category: 'Menggabungkan Tabel',
    level: 'Sedang',
    tags: ['subquery', 'join', 'intermediate'],
    premium: false,
    prompt:
      'Tampilkan pelanggan yang memesan Beras 5kg. Pelanggan yang hanya memesan barang lain tidak ikut. Dua pesanan beras untuk orang yang sama tetap satu baris.\n\nTampilkan nama. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Sari Wulandari' },
        ],
        sampleRows: [
          ['1', 'Sari Wulandari'],
          ['2', 'Budi Santoso'],
          ['3', 'Lina Kusuma'],
        ],
      },
      {
        name: 'produk',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Beras 5kg' },
        ],
        sampleRows: [
          ['1', 'Beras 5kg'],
          ['2', 'Gula 1kg'],
        ],
      },
      {
        name: 'pesanan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'pelanggan_id', type: 'INTEGER', sample: '1' },
          { name: 'produk_id', type: 'INTEGER', sample: '1' },
        ],
        sampleRows: [
          ['1', '1', '1'],
          ['2', '1', '1'],
          ['3', '2', '2'],
          ['4', '3', '1'],
        ],
      },
    ],
    starterSql: `SELECT nama
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR
);
INSERT INTO pelanggan VALUES
  (1, 'Sari Wulandari'),
  (2, 'Budi Santoso'),
  (3, 'Lina Kusuma'),
  (4, 'Agus Pratama');
CREATE OR REPLACE TABLE produk (
  id INTEGER,
  nama VARCHAR
);
INSERT INTO produk VALUES
  (1, 'Beras 5kg'),
  (2, 'Gula 1kg');
CREATE OR REPLACE TABLE pesanan (
  id INTEGER,
  pelanggan_id INTEGER,
  produk_id INTEGER
);
INSERT INTO pesanan VALUES
  (1, 1, 1),
  (2, 1, 1),
  (3, 2, 2),
  (4, 3, 1);`,
    expected: {
      columns: ['nama'],
      rows: [['Lina Kusuma'], ['Sari Wulandari']],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'qty-kosong-jadi-nol',
    title: 'Qty Kosong Jadi Nol',
    category: 'Menggabungkan Tabel',
    level: 'Sedang',
    tags: ['left_join', 'coalesce', 'intermediate'],
    premium: false,
    prompt:
      'Tampilkan setiap barang TokoKulwon. Kalau belum ada penjualan, qty yang ditampilkan adalah nol, bukan kosong.\n\nTampilkan nama dan kolom qty_tampil. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'produk',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '2' },
          { name: 'nama', type: 'VARCHAR', sample: 'Garam dapur' },
        ],
        sampleRows: [
          ['1', 'Minyak goreng 1L'],
          ['2', 'Garam dapur'],
          ['3', 'Kopi tubruk'],
        ],
      },
      {
        name: 'penjualan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'produk_id', type: 'INTEGER', sample: '3' },
          { name: 'qty', type: 'INTEGER', sample: '5' },
        ],
        sampleRows: [
          ['1', '3', '5'],
          ['2', '1', '8'],
        ],
      },
    ],
    starterSql: `SELECT nama
FROM produk;`,
    seedSql: `CREATE OR REPLACE TABLE produk (
  id INTEGER,
  nama VARCHAR
);
INSERT INTO produk VALUES
  (1, 'Minyak goreng 1L'),
  (2, 'Garam dapur'),
  (3, 'Kopi tubruk');
CREATE OR REPLACE TABLE penjualan (
  id INTEGER,
  produk_id INTEGER,
  qty INTEGER
);
INSERT INTO penjualan VALUES
  (1, 3, 5),
  (2, 1, 8);`,
    expected: {
      columns: ['nama', 'qty_tampil'],
      rows: [
        ['Garam dapur', '0'],
        ['Kopi tubruk', '5'],
        ['Minyak goreng 1L', '8'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'urut-kode-sebagai-angka',
    title: 'Urut Kode sebagai Angka',
    category: 'SQL Dasar',
    level: 'Sedang',
    tags: ['cast', 'intermediate'],
    premium: false,
    prompt:
      'Kode barang TokoKulwon tertulis sebagai teks, tetapi urutannya mengikuti nilai angkanya. Jadi 1, lalu 2, lalu 10.\n\nTampilkan kode dan nama.',
    tables: [
      {
        name: 'produk',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '3' },
          { name: 'kode', type: 'VARCHAR', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Beras 5kg' },
        ],
        sampleRows: [
          ['1', '2', 'Gula 1kg'],
          ['2', '10', 'Minyak goreng 1L'],
          ['3', '1', 'Beras 5kg'],
        ],
      },
    ],
    starterSql: `SELECT kode, nama
FROM produk;`,
    seedSql: `CREATE OR REPLACE TABLE produk (
  id INTEGER,
  kode VARCHAR,
  nama VARCHAR
);
INSERT INTO produk VALUES
  (1, '2', 'Gula 1kg'),
  (2, '10', 'Minyak goreng 1L'),
  (3, '1', 'Beras 5kg');`,
    expected: {
      columns: ['kode', 'nama'],
      rows: [
        ['1', 'Beras 5kg'],
        ['2', 'Gula 1kg'],
        ['10', 'Minyak goreng 1L'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'pasangan-nama-kota-unik',
    title: 'Pasangan Nama Kota Unik',
    category: 'Kualitas Data',
    level: 'Sedang',
    tags: ['distinct', 'intermediate'],
    premium: false,
    prompt:
      'Tampilkan pasangan nama dan kota yang unik. Nama yang sama di dua kota tetap dua baris. Nama dan kota yang sama dua kali menjadi satu baris.\n\nTampilkan nama dan kota. Urutkan menurut nama, lalu kota, dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Sari Wulandari' },
          { name: 'kota', type: 'VARCHAR', sample: 'Jakarta' },
        ],
        sampleRows: [
          ['1', 'Sari Wulandari', 'Jakarta'],
          ['2', 'Sari Wulandari', 'Jakarta'],
          ['3', 'Sari Wulandari', 'Bandung'],
          ['4', 'Budi Santoso', 'Jakarta'],
        ],
      },
    ],
    starterSql: `SELECT nama, kota
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR
);
INSERT INTO pelanggan VALUES
  (1, 'Sari Wulandari', 'Jakarta'),
  (2, 'Sari Wulandari', 'Jakarta'),
  (3, 'Sari Wulandari', 'Bandung'),
  (4, 'Budi Santoso', 'Jakarta'),
  (5, 'Budi Santoso', 'Jakarta');`,
    expected: {
      columns: ['nama', 'kota'],
      rows: [
        ['Budi Santoso', 'Jakarta'],
        ['Sari Wulandari', 'Bandung'],
        ['Sari Wulandari', 'Jakarta'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'top-5-produk-terlaris',
    title: 'Top 5 Produk Terlaris',
    category: 'Agregasi',
    level: 'Sulit',
    tags: ['aggregation', 'group_by', 'advanced'],
    premium: true,
    tables: [
      {
        name: 'produk',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Beras 5kg' },
          { name: 'harga', type: 'INTEGER', sample: '76000' },
        ],
        sampleRows: [
          ['1', 'Beras 5kg', '76000'],
          ['4', 'Teh celup', '8500'],
          ['5', 'Kopi tubruk', '18000'],
        ],
      },
      {
        name: 'penjualan',
        columns: [
          { name: 'produk_id', type: 'INTEGER', sample: '1' },
          { name: 'qty', type: 'INTEGER', sample: '12' },
        ],
        sampleRows: [
          ['1', '12'],
          ['2', '30'],
          ['4', '40'],
        ],
      },
    ],
    prompt:
      'TokoKulwon mau tahu lima barang yang paling banyak keluar dari gudang minggu ini. Jumlah qty di penjualan, lalu sambungkan ke nama produk.\n\nTampilkan nama dan qty. qty adalah jumlah seluruh qty untuk nama itu. Urutkan dari qty terbesar ke terkecil. Jika qty sama, urutkan nama dari A ke Z. Ambil lima baris teratas.',
    starterSql: `SELECT p.nama, j.qty
FROM penjualan AS j
JOIN produk AS p ON p.id = j.produk_id;`,
    seedSql: `CREATE OR REPLACE TABLE produk (
  id INTEGER,
  nama VARCHAR,
  harga INTEGER
);
INSERT INTO produk VALUES
  (1, 'Beras 5kg', 76000),
  (2, 'Gula 1kg', 16000),
  (3, 'Minyak goreng 1L', 22000),
  (4, 'Teh celup', 8500),
  (5, 'Kopi tubruk', 18000),
  (6, 'Sabun batang', 5000);
CREATE OR REPLACE TABLE penjualan (
  produk_id INTEGER,
  qty INTEGER
);
INSERT INTO penjualan VALUES
  (5, 20),
  (1, 12),
  (1, 8),
  (2, 30),
  (3, 4),
  (4, 40),
  (4, 15),
  (6, 22);`,
    expected: {
      columns: ['nama', 'qty'],
      rows: [
        ['Teh celup', '55'],
        ['Gula 1kg', '30'],
        ['Sabun batang', '22'],
        ['Beras 5kg', '20'],
        ['Kopi tubruk', '20'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'kelas-pelanggan-dari-belanja',
    title: 'Kelas Pelanggan dari Belanja',
    category: 'Kondisi',
    level: 'Sulit',
    tags: ['case_when', 'window', 'advanced'],
    premium: false,
    prompt:
      'TokoKulwon membagi pelanggan jadi dua kelas. Total belanja 300000 atau lebih disebut VIP. Selain itu Biasa. Yang tepat 300000 tetap VIP. Di dalam tiap kelas, nomor urut 1 diberikan pada belanja terbesar.\n\nTampilkan nama, kelas, dan nomor_urut. Urutkan menurut kelas dari A ke Z, lalu nomor_urut dari kecil ke besar.',
    tables: [PELANGGAN_TABLE],
    starterSql: `SELECT nama,
  CASE
    WHEN total_belanja >= 300000 THEN 'VIP'
    ELSE 'Biasa'
  END AS kelas
FROM pelanggan;`,
    seedSql: `${PELANGGAN_SQL}
INSERT INTO pelanggan VALUES
  (7, 'Nina Sari', 'Solo', 300000);`,
    expected: {
      columns: ['nama', 'kelas', 'nomor_urut'],
      rows: [
        ['Raka Putra', 'Biasa', '1'],
        ['Sari Wulandari', 'Biasa', '2'],
        ['Dewi Lestari', 'Biasa', '3'],
        ['Lina Kusuma', 'Biasa', '4'],
        ['Budi Santoso', 'VIP', '1'],
        ['Agus Pratama', 'VIP', '2'],
        ['Nina Sari', 'VIP', '3'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'email-pelanggan-yang-kosong',
    title: 'Email Pelanggan yang Kosong',
    category: 'Kualitas Data',
    level: 'Sulit',
    tags: ['data_quality', 'advanced'],
    premium: false,
    prompt:
      'Catatan pelanggan TokoKulwon masih ada yang tanpa email. Mereka tidak bisa dapat struk digital. Email yang belum terisi, yang tertulis sebagai teks kosong, atau yang hanya berisi spasi, semuanya kosong. Email yang masih ada hurufnya tidak ikut, walaupun diawali atau diakhiri spasi.\n\nTampilkan nama, email, dan kota. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '3' },
          { name: 'nama', type: 'VARCHAR', sample: 'Lina Kusuma' },
          { name: 'email', type: 'VARCHAR', sample: 'NULL' },
          { name: 'kota', type: 'VARCHAR', sample: 'Surabaya' },
        ],
        sampleRows: [
          ['2', 'Budi Santoso', 'budi@contoh.id', 'Jakarta'],
          ['3', 'Lina Kusuma', 'NULL', 'Surabaya'],
          ['4', 'Agus Pratama', '', 'Bandung'],
          ['5', 'Dewi Lestari', '   ', 'Semarang'],
          ['6', 'Raka Putra', '  raka@contoh.id  ', 'Medan'],
        ],
      },
    ],
    starterSql: `SELECT nama, email
FROM pelanggan
WHERE email IS NULL;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  email VARCHAR,
  kota VARCHAR
);
INSERT INTO pelanggan VALUES
  (1, 'Sari Wulandari', 'sari@contoh.id', 'Yogyakarta'),
  (2, 'Budi Santoso', 'budi@contoh.id', 'Jakarta'),
  (3, 'Lina Kusuma', NULL, 'Surabaya'),
  (4, 'Agus Pratama', '', 'Bandung'),
  (5, 'Dewi Lestari', '   ', 'Semarang'),
  (6, 'Raka Putra', '  raka@contoh.id  ', 'Medan');`,
    expected: {
      columns: ['nama', 'email', 'kota'],
      rows: [
        ['Agus Pratama', '', 'Bandung'],
        ['Dewi Lestari', '   ', 'Semarang'],
        ['Lina Kusuma', 'NULL', 'Surabaya'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'nomor-baris-tiap-gudang',
    title: 'Nomor Baris tiap Gudang',
    category: 'Agregasi',
    level: 'Sulit',
    tags: ['window', 'advanced'],
    premium: false,
    prompt:
      'Setiap gudang TokoKulwon punya daftar kiriman. Nomor baris mulai dari 1 di dalam tiap gudang, mengikuti hari dari yang paling kecil.\n\nTampilkan gudang, hari, tujuan, dan nomor_baris. Urutkan menurut gudang dari A ke Z, lalu nomor_baris dari kecil ke besar.',
    tables: [
      {
        name: 'kiriman',
        columns: [
          { name: 'gudang', type: 'VARCHAR', sample: 'Utara' },
          { name: 'hari', type: 'INTEGER', sample: '1' },
          { name: 'tujuan', type: 'VARCHAR', sample: 'Jogja' },
          { name: 'dus', type: 'INTEGER', sample: '3' },
        ],
        sampleRows: [
          ['Utara', '1', 'Jogja', '3'],
          ['Selatan', '2', 'Malang', '5'],
          ['Utara', '3', 'Semarang', '8'],
        ],
      },
    ],
    starterSql: `SELECT gudang, hari, tujuan
FROM kiriman;`,
    seedSql: `CREATE OR REPLACE TABLE kiriman (
  gudang VARCHAR,
  hari INTEGER,
  tujuan VARCHAR,
  dus INTEGER
);
INSERT INTO kiriman VALUES
  ('Utara', 2, 'Solo', 4),
  ('Utara', 1, 'Jogja', 3),
  ('Utara', 3, 'Semarang', 8),
  ('Selatan', 2, 'Malang', 5),
  ('Selatan', 5, 'Bandung', 1),
  ('Selatan', 4, 'Surabaya', 6);`,
    expected: {
      columns: ['gudang', 'hari', 'tujuan', 'nomor_baris'],
      rows: [
        ['Selatan', '2', 'Malang', '1'],
        ['Selatan', '4', 'Surabaya', '2'],
        ['Selatan', '5', 'Bandung', '3'],
        ['Utara', '1', 'Jogja', '1'],
        ['Utara', '2', 'Solo', '2'],
        ['Utara', '3', 'Semarang', '3'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'peringkat-qty-yang-seri',
    title: 'Peringkat Qty yang Seri',
    category: 'Agregasi',
    level: 'Sulit',
    tags: ['window', 'advanced'],
    premium: false,
    prompt:
      'TokoKulwon memberi peringkat barang menurut qty. Qty yang sama mendapat peringkat yang sama, dan peringkat berikutnya melompat. Tidak ada peringkat 2 bila dua barang berbagi peringkat 1.\n\nTampilkan barang, qty, dan peringkat. Urutkan menurut peringkat dari kecil ke besar, lalu nama barang dari A ke Z.',
    tables: [
      {
        name: 'penjualan',
        columns: [
          { name: 'barang', type: 'VARCHAR', sample: 'Beras 5kg' },
          { name: 'qty', type: 'INTEGER', sample: '10' },
        ],
        sampleRows: [
          ['Beras 5kg', '10'],
          ['Gula 1kg', '10'],
          ['Sabun batang', '1'],
          ['Teh celup', '4'],
        ],
      },
    ],
    starterSql: `SELECT barang, qty
FROM penjualan;`,
    seedSql: `CREATE OR REPLACE TABLE penjualan (
  barang VARCHAR,
  qty INTEGER
);
INSERT INTO penjualan VALUES
  ('Beras 5kg', 10),
  ('Gula 1kg', 10),
  ('Teh celup', 4),
  ('Kopi tubruk', 4),
  ('Sabun batang', 1);`,
    expected: {
      columns: ['barang', 'qty', 'peringkat'],
      rows: [
        ['Beras 5kg', '10', '1'],
        ['Gula 1kg', '10', '1'],
        ['Kopi tubruk', '4', '3'],
        ['Teh celup', '4', '3'],
        ['Sabun batang', '1', '5'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'peringkat-rapat-isi-rak',
    title: 'Peringkat Rapat Isi Rak',
    category: 'Agregasi',
    level: 'Sulit',
    tags: ['window', 'advanced'],
    premium: false,
    prompt:
      'Isi rak diurutkan dengan peringkat rapat menurut jumlah dus. Dus yang sama mendapat peringkat yang sama, dan peringkat berikutnya tidak melompat.\n\nTampilkan nama, dus, dan peringkat_rapat. Urutkan menurut peringkat_rapat dari kecil ke besar, lalu nama dari A ke Z.',
    tables: [
      {
        name: 'rak',
        columns: [
          { name: 'nama', type: 'VARCHAR', sample: 'Kopi tubruk' },
          { name: 'dus', type: 'INTEGER', sample: '1' },
        ],
        sampleRows: [
          ['Beras 5kg', '8'],
          ['Gula 1kg', '8'],
          ['Kopi tubruk', '1'],
          ['Minyak goreng 1L', '3'],
        ],
      },
    ],
    starterSql: `SELECT nama, dus
FROM rak;`,
    seedSql: `CREATE OR REPLACE TABLE rak (
  nama VARCHAR,
  dus INTEGER
);
INSERT INTO rak VALUES
  ('Beras 5kg', 8),
  ('Gula 1kg', 8),
  ('Minyak goreng 1L', 3),
  ('Teh celup', 3),
  ('Kopi tubruk', 1);`,
    expected: {
      columns: ['nama', 'dus', 'peringkat_rapat'],
      rows: [
        ['Beras 5kg', '8', '1'],
        ['Gula 1kg', '8', '1'],
        ['Minyak goreng 1L', '3', '2'],
        ['Teh celup', '3', '2'],
        ['Kopi tubruk', '1', '3'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'tetangga-qty-harian',
    title: 'Tetangga Qty Harian',
    category: 'Agregasi',
    level: 'Sulit',
    tags: ['window', 'advanced'],
    premium: false,
    prompt:
      'Lihat qty pada baris tetangga menurut urutan hari. Sebelumnya adalah qty satu baris di belakang pada urutan itu. Sesudahnya adalah qty satu baris di depan. Baris pertama tidak punya sebelumnya. Baris terakhir tidak punya sesudahnya. Hari yang loncat tetap berurutan sebagai baris, bukan sebagai selisih angka hari.\n\nTampilkan hari, qty, sebelumnya, dan sesudahnya. Urutkan menurut hari dari kecil ke besar.',
    tables: [
      {
        name: 'harian',
        columns: [
          { name: 'hari', type: 'INTEGER', sample: '6' },
          { name: 'qty', type: 'INTEGER', sample: '10' },
        ],
        sampleRows: [
          ['1', '5'],
          ['3', '8'],
          ['6', '10'],
        ],
      },
    ],
    starterSql: `SELECT hari, qty
FROM harian;`,
    seedSql: `CREATE OR REPLACE TABLE harian (
  hari INTEGER,
  qty INTEGER
);
INSERT INTO harian VALUES
  (1, 5),
  (2, 8),
  (3, 8),
  (4, 3),
  (6, 10);`,
    expected: {
      columns: ['hari', 'qty', 'sebelumnya', 'sesudahnya'],
      rows: [
        ['1', '5', 'NULL', '8'],
        ['2', '8', '5', '8'],
        ['3', '8', '8', '3'],
        ['4', '3', '8', '10'],
        ['6', '10', '3', 'NULL'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'jumlah-berjalan-tiap-toko',
    title: 'Jumlah Berjalan tiap Toko',
    category: 'Agregasi',
    level: 'Sulit',
    tags: ['window', 'advanced'],
    premium: false,
    prompt:
      'Jumlah berjalan menjumlahkan qty dari hari pertama sampai hari ini, terpisah untuk tiap toko.\n\nTampilkan toko, hari, qty, dan jumlah_berjalan. Urutkan menurut toko dari A ke Z, lalu hari dari kecil ke besar.',
    tables: [
      {
        name: 'harian',
        columns: [
          { name: 'toko', type: 'VARCHAR', sample: 'Selatan' },
          { name: 'hari', type: 'INTEGER', sample: '4' },
          { name: 'qty', type: 'INTEGER', sample: '5' },
        ],
        sampleRows: [
          ['Selatan', '1', '10'],
          ['Selatan', '4', '5'],
          ['Utara', '2', '6'],
        ],
      },
    ],
    starterSql: `SELECT toko, hari, qty
FROM harian;`,
    seedSql: `CREATE OR REPLACE TABLE harian (
  toko VARCHAR,
  hari INTEGER,
  qty INTEGER
);
INSERT INTO harian VALUES
  ('Utara', 1, 4),
  ('Utara', 2, 6),
  ('Utara', 3, 1),
  ('Selatan', 1, 10),
  ('Selatan', 2, 5),
  ('Selatan', 4, 5);`,
    expected: {
      columns: ['toko', 'hari', 'qty', 'jumlah_berjalan'],
      rows: [
        ['Selatan', '1', '10', '10'],
        ['Selatan', '2', '5', '15'],
        ['Selatan', '4', '5', '20'],
        ['Utara', '1', '4', '4'],
        ['Utara', '2', '6', '10'],
        ['Utara', '3', '1', '11'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'bagian-qty-seluruh-barang',
    title: 'Bagian Qty Seluruh Barang',
    category: 'Agregasi',
    level: 'Sulit',
    tags: ['window', 'advanced'],
    premium: false,
    prompt:
      'Bagian tiap barang adalah bilangan bulat: qty dikali 100, dibagi jumlah qty seluruh barang, lalu sisa pembagian dibuang.\n\nTampilkan nama, qty, dan bagian. Urutkan menurut bagian dari besar ke kecil. Jika bagian sama, urutkan nama dari A ke Z.',
    tables: [
      {
        name: 'barang',
        columns: [
          { name: 'nama', type: 'VARCHAR', sample: 'Sabun batang' },
          { name: 'qty', type: 'INTEGER', sample: '4' },
        ],
        sampleRows: [
          ['Beras 5kg', '1'],
          ['Gula 1kg', '1'],
          ['Sabun batang', '4'],
        ],
      },
    ],
    starterSql: `SELECT nama, qty
FROM barang;`,
    seedSql: `CREATE OR REPLACE TABLE barang (
  nama VARCHAR,
  qty INTEGER
);
INSERT INTO barang VALUES
  ('Beras 5kg', 1),
  ('Gula 1kg', 1),
  ('Sabun batang', 4);`,
    expected: {
      columns: ['nama', 'qty', 'bagian'],
      rows: [
        ['Sabun batang', '4', '66'],
        ['Beras 5kg', '1', '16'],
        ['Gula 1kg', '1', '16'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'kota-di-atas-rata-omzet',
    title: 'Kota di Atas Rata-rata Omzet',
    category: 'Agregasi',
    level: 'Sulit',
    tags: ['cte', 'advanced'],
    premium: false,
    prompt:
      'TokoKulwon membandingkan omzet kota dengan rata-rata omzet kota. Omzet kota adalah jumlah belanja seluruh pelanggan di kota itu. Rata-rata dihitung dari omzet kota, bukan dari tiap pelanggan. Kota yang tepat sama dengan rata-rata tidak ikut.\n\nTampilkan kota dan omzet. Hanya kota yang omzetnya di atas rata-rata itu. Urutkan menurut nama kota dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '8' },
          { name: 'nama', type: 'VARCHAR', sample: 'Cici Putri' },
          { name: 'kota', type: 'VARCHAR', sample: 'Yogyakarta' },
          { name: 'total_belanja', type: 'INTEGER', sample: '350' },
        ],
        sampleRows: [
          ['3', 'Agus Pratama', 'Bandung', '400'],
          ['7', 'Nina Sari', 'Solo', '250'],
          ['8', 'Cici Putri', 'Yogyakarta', '350'],
          ['4', 'Raka Putra', 'Medan', '50'],
        ],
      },
    ],
    starterSql: `SELECT kota, total_belanja
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (1, 'Budi Santoso', 'Jakarta', 100),
  (2, 'Sari Wulandari', 'Jakarta', 500),
  (3, 'Agus Pratama', 'Bandung', 400),
  (4, 'Raka Putra', 'Medan', 50),
  (5, 'Lina Kusuma', 'Medan', 50),
  (6, 'Dewi Lestari', 'Medan', 50),
  (7, 'Nina Sari', 'Solo', 250),
  (8, 'Cici Putri', 'Yogyakarta', 350);`,
    expected: {
      columns: ['kota', 'omzet'],
      rows: [
        ['Bandung', '400'],
        ['Jakarta', '600'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'qty-tanpa-lipat-harga',
    title: 'Qty tanpa Lipat Harga',
    category: 'Menggabungkan Tabel',
    level: 'Sulit',
    tags: ['join', 'aggregation', 'advanced'],
    premium: false,
    prompt:
      'Hitung jumlah qty penjualan tiap nama produk. Satu produk bisa punya harga di lebih dari satu toko. Harga itu tidak boleh membuat qty terhitung dua kali.\n\nTampilkan nama dan qty. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'produk',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Beras 5kg' },
        ],
        sampleRows: [
          ['1', 'Beras 5kg'],
          ['2', 'Gula 1kg'],
          ['3', 'Teh celup'],
        ],
      },
      {
        name: 'penjualan',
        columns: [
          { name: 'produk_id', type: 'INTEGER', sample: '1' },
          { name: 'qty', type: 'INTEGER', sample: '5' },
        ],
        sampleRows: [
          ['1', '5'],
          ['2', '4'],
          ['3', '7'],
        ],
      },
      {
        name: 'harga_toko',
        columns: [
          { name: 'produk_id', type: 'INTEGER', sample: '1' },
          { name: 'toko', type: 'VARCHAR', sample: 'Utara' },
          { name: 'harga', type: 'INTEGER', sample: '75000' },
        ],
        sampleRows: [
          ['1', 'Pusat', '76000'],
          ['1', 'Utara', '75000'],
          ['3', 'Utara', '9000'],
        ],
      },
    ],
    starterSql: `SELECT p.nama
FROM produk AS p;`,
    seedSql: `CREATE OR REPLACE TABLE produk (
  id INTEGER,
  nama VARCHAR
);
INSERT INTO produk VALUES
  (1, 'Beras 5kg'),
  (2, 'Gula 1kg'),
  (3, 'Teh celup');
CREATE OR REPLACE TABLE penjualan (
  produk_id INTEGER,
  qty INTEGER
);
INSERT INTO penjualan VALUES
  (1, 5),
  (1, 5),
  (2, 4),
  (3, 7);
CREATE OR REPLACE TABLE harga_toko (
  produk_id INTEGER,
  toko VARCHAR,
  harga INTEGER
);
INSERT INTO harga_toko VALUES
  (1, 'Pusat', 76000),
  (1, 'Utara', 75000),
  (2, 'Pusat', 16000),
  (3, 'Pusat', 8500),
  (3, 'Utara', 9000);`,
    expected: {
      columns: ['nama', 'qty'],
      rows: [
        ['Beras 5kg', '10'],
        ['Gula 1kg', '4'],
        ['Teh celup', '7'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'pemenang-belanja-tiap-kota',
    title: 'Pemenang Belanja tiap Kota',
    category: 'Agregasi',
    level: 'Sulit',
    tags: ['window', 'advanced'],
    premium: false,
    prompt:
      'Tiap kota punya satu pelanggan dengan belanja terbesar. Jika belanja sama, nama dari A ke Z yang dipakai.\n\nTampilkan kota, nama, dan total_belanja. Urutkan menurut nama kota dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'nama', type: 'VARCHAR', sample: 'Lina Kusuma' },
          { name: 'kota', type: 'VARCHAR', sample: 'Medan' },
          { name: 'total_belanja', type: 'INTEGER', sample: '200' },
        ],
        sampleRows: [
          ['Budi Santoso', 'Jakarta', '500'],
          ['Sari Wulandari', 'Jakarta', '500'],
          ['Lina Kusuma', 'Medan', '200'],
          ['Raka Putra', 'Medan', '200'],
        ],
      },
    ],
    starterSql: `SELECT kota, nama, total_belanja
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  ('Budi Santoso', 'Jakarta', 500),
  ('Sari Wulandari', 'Jakarta', 500),
  ('Agus Pratama', 'Bandung', 300),
  ('Dewi Lestari', 'Bandung', 450),
  ('Raka Putra', 'Medan', 200),
  ('Lina Kusuma', 'Medan', 200);`,
    expected: {
      columns: ['kota', 'nama', 'total_belanja'],
      rows: [
        ['Bandung', 'Dewi Lestari', '450'],
        ['Jakarta', 'Budi Santoso', '500'],
        ['Medan', 'Lina Kusuma', '200'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'selisih-qty-hari-sebelum',
    title: 'Selisih Qty Hari Sebelum',
    category: 'Agregasi',
    level: 'Sulit',
    tags: ['window', 'advanced'],
    premium: false,
    prompt:
      'Selisih adalah qty hari ini dikurangi qty pada baris hari sebelumnya menurut urutan hari. Hari pertama belum punya selisih, jadi kosong, bukan nol. Selisih nol hanya muncul bila qty-nya memang sama dengan baris sebelumnya.\n\nTampilkan hari, qty, dan selisih. Urutkan menurut hari dari kecil ke besar.',
    tables: [
      {
        name: 'harian',
        columns: [
          { name: 'hari', type: 'INTEGER', sample: '3' },
          { name: 'qty', type: 'INTEGER', sample: '15' },
        ],
        sampleRows: [
          ['1', '10'],
          ['3', '15'],
          ['4', '12'],
        ],
      },
    ],
    starterSql: `SELECT hari, qty
FROM harian;`,
    seedSql: `CREATE OR REPLACE TABLE harian (
  hari INTEGER,
  qty INTEGER
);
INSERT INTO harian VALUES
  (1, 10),
  (2, 15),
  (3, 15),
  (4, 12);`,
    expected: {
      columns: ['hari', 'qty', 'selisih'],
      rows: [
        ['1', '10', 'NULL'],
        ['2', '15', '5'],
        ['3', '15', '0'],
        ['4', '12', '-3'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'bagian-qty-di-dalam-kota',
    title: 'Bagian Qty di Dalam Kota',
    category: 'Agregasi',
    level: 'Sulit',
    tags: ['window', 'advanced'],
    premium: false,
    prompt:
      'Bagian dihitung di dalam kota, bukan untuk seluruh toko. Bagian adalah bilangan bulat: qty dikali 100, dibagi jumlah qty kota itu, lalu sisa pembagian dibuang.\n\nTampilkan kota, nama, qty, dan bagian. Urutkan menurut kota dari A ke Z, lalu nama dari A ke Z.',
    tables: [
      {
        name: 'penjualan',
        columns: [
          { name: 'kota', type: 'VARCHAR', sample: 'Jakarta' },
          { name: 'nama', type: 'VARCHAR', sample: 'Sari Wulandari' },
          { name: 'qty', type: 'INTEGER', sample: '2' },
        ],
        sampleRows: [
          ['Jakarta', 'Budi Santoso', '1'],
          ['Jakarta', 'Sari Wulandari', '2'],
          ['Medan', 'Lina Kusuma', '5'],
          ['Bandung', 'Agus Pratama', '1'],
        ],
      },
    ],
    starterSql: `SELECT kota, nama, qty
FROM penjualan;`,
    seedSql: `CREATE OR REPLACE TABLE penjualan (
  kota VARCHAR,
  nama VARCHAR,
  qty INTEGER
);
INSERT INTO penjualan VALUES
  ('Jakarta', 'Budi Santoso', 1),
  ('Jakarta', 'Sari Wulandari', 2),
  ('Bandung', 'Agus Pratama', 1),
  ('Bandung', 'Dewi Lestari', 1),
  ('Medan', 'Lina Kusuma', 5),
  ('Medan', 'Raka Putra', 1);`,
    expected: {
      columns: ['kota', 'nama', 'qty', 'bagian'],
      rows: [
        ['Bandung', 'Agus Pratama', '1', '50'],
        ['Bandung', 'Dewi Lestari', '1', '50'],
        ['Jakarta', 'Budi Santoso', '1', '33'],
        ['Jakarta', 'Sari Wulandari', '2', '66'],
        ['Medan', 'Lina Kusuma', '5', '83'],
        ['Medan', 'Raka Putra', '1', '16'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'kode-ganda-atau-nama-kosong',
    title: 'Kode Ganda atau Nama Kosong',
    category: 'Kualitas Data',
    level: 'Sulit',
    tags: ['data_quality', 'advanced'],
    premium: false,
    prompt:
      'Tampilkan barang yang kodenya muncul lebih dari sekali, atau yang namanya kosong. Nama kosong berarti belum terisi atau tertulis sebagai teks kosong. Kode tetap teks, jadi 01 tidak menjadi 1.\n\nTampilkan kode dan nama. Urutkan menurut kode dari A ke Z sebagai teks, lalu nama dari A ke Z.',
    tables: [
      {
        name: 'barang',
        columns: [
          { name: 'kode', type: 'VARCHAR', sample: '01' },
          { name: 'nama', type: 'VARCHAR', sample: 'NULL' },
        ],
        sampleRows: [
          ['01', 'Beras 5kg'],
          ['01', 'Beras lima kilo'],
          ['3', 'NULL'],
          ['4', ''],
          ['A2', 'Teh celup'],
        ],
      },
    ],
    starterSql: `SELECT kode, nama
FROM barang;`,
    seedSql: `CREATE OR REPLACE TABLE barang (
  id INTEGER,
  kode VARCHAR,
  nama VARCHAR
);
INSERT INTO barang VALUES
  (1, '01', 'Beras 5kg'),
  (2, '01', 'Beras lima kilo'),
  (3, '2', 'Gula 1kg'),
  (4, '10', 'Minyak goreng 1L'),
  (5, '3', NULL),
  (6, '4', ''),
  (7, 'A2', 'Teh celup');`,
    expected: {
      columns: ['kode', 'nama'],
      rows: [
        ['01', 'Beras 5kg'],
        ['01', 'Beras lima kilo'],
        ['3', 'NULL'],
        ['4', ''],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'barang-pada-urutan-kedua',
    title: 'Barang pada Urutan Kedua',
    category: 'Agregasi',
    level: 'Sulit',
    tags: ['window', 'advanced'],
    premium: false,
    prompt:
      'Ambil barang pada urutan kedua di tiap rak. Urutan 1 adalah harga terbesar. Rak yang hanya punya satu barang tidak punya urutan kedua. Rak yang tepat punya dua barang tetap menyumbang urutan keduanya.\n\nTampilkan rak, nama, dan harga. Urutkan menurut rak dari A ke Z.',
    tables: [
      {
        name: 'isi_rak',
        columns: [
          { name: 'rak', type: 'VARCHAR', sample: 'C' },
          { name: 'nama', type: 'VARCHAR', sample: 'Garam dapur' },
          { name: 'harga', type: 'INTEGER', sample: '4000' },
        ],
        sampleRows: [
          ['A', 'Beras 5kg', '70000'],
          ['A', 'Gula 1kg', '40000'],
          ['B', 'Kopi tubruk', '15000'],
          ['B', 'Sabun batang', '5000'],
          ['C', 'Garam dapur', '4000'],
        ],
      },
    ],
    starterSql: `SELECT rak, nama, harga
FROM isi_rak;`,
    seedSql: `CREATE OR REPLACE TABLE isi_rak (
  rak VARCHAR,
  nama VARCHAR,
  harga INTEGER
);
INSERT INTO isi_rak VALUES
  ('A', 'Beras 5kg', 70000),
  ('A', 'Gula 1kg', 40000),
  ('A', 'Teh celup', 8000),
  ('B', 'Kopi tubruk', 15000),
  ('B', 'Sabun batang', 5000),
  ('C', 'Garam dapur', 4000);`,
    expected: {
      columns: ['rak', 'nama', 'harga'],
      rows: [
        ['A', 'Gula 1kg', '40000'],
        ['B', 'Sabun batang', '5000'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'tiga-peringkat-tiap-kategori',
    title: 'Tiga Peringkat tiap Kategori',
    category: 'Agregasi',
    level: 'Sulit',
    tags: ['window', 'advanced'],
    premium: false,
    prompt:
      'Di tiap kategori, beri peringkat menurut skor. Skor yang sama mendapat peringkat yang sama, dan peringkat berikutnya melompat. Ambil semua baris yang peringkatnya 3 atau lebih baik, termasuk yang berbagi peringkat 3.\n\nTampilkan kategori, nama, skor, dan peringkat. Urutkan menurut kategori dari A ke Z, lalu peringkat dari kecil ke besar, lalu nama dari A ke Z.',
    tables: [
      {
        name: 'skor_barang',
        columns: [
          { name: 'kategori', type: 'VARCHAR', sample: 'Makanan' },
          { name: 'nama', type: 'VARCHAR', sample: 'Tepung' },
          { name: 'skor', type: 'INTEGER', sample: '2' },
        ],
        sampleRows: [
          ['Minuman', 'Air mineral', '7'],
          ['Minuman', 'Sirup', '7'],
          ['Minuman', 'Susu', '4'],
          ['Makanan', 'Tepung', '2'],
          ['Makanan', 'Mie', '5'],
        ],
      },
    ],
    starterSql: `SELECT kategori, nama, skor
FROM skor_barang;`,
    seedSql: `CREATE OR REPLACE TABLE skor_barang (
  kategori VARCHAR,
  nama VARCHAR,
  skor INTEGER
);
INSERT INTO skor_barang VALUES
  ('Minuman', 'Teh celup', 10),
  ('Minuman', 'Kopi tubruk', 9),
  ('Minuman', 'Sirup', 7),
  ('Minuman', 'Air mineral', 7),
  ('Minuman', 'Susu', 4),
  ('Makanan', 'Beras 5kg', 5),
  ('Makanan', 'Gula 1kg', 5),
  ('Makanan', 'Mie', 5),
  ('Makanan', 'Tepung', 2);`,
    expected: {
      columns: ['kategori', 'nama', 'skor', 'peringkat'],
      rows: [
        ['Makanan', 'Beras 5kg', '5', '1'],
        ['Makanan', 'Gula 1kg', '5', '1'],
        ['Makanan', 'Mie', '5', '1'],
        ['Minuman', 'Teh celup', '10', '1'],
        ['Minuman', 'Kopi tubruk', '9', '2'],
        ['Minuman', 'Air mineral', '7', '3'],
        ['Minuman', 'Sirup', '7', '3'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'bagian-jumlah-berjalan',
    title: 'Bagian dari Jumlah Berjalan',
    category: 'Agregasi',
    level: 'Sulit',
    tags: ['window', 'advanced'],
    premium: false,
    prompt:
      'Jumlah berjalan menjumlahkan qty dari urutan pertama sampai urutan ini. Bagian adalah bilangan bulat: jumlah berjalan dikali 100, dibagi jumlah qty seluruh barang, lalu sisa pembagian dibuang.\n\nTampilkan urutan, nama, qty, jumlah_berjalan, dan bagian. Urutkan menurut urutan dari kecil ke besar.',
    tables: [
      {
        name: 'penjualan',
        columns: [
          { name: 'urutan', type: 'INTEGER', sample: '4' },
          { name: 'nama', type: 'VARCHAR', sample: 'Sabun batang' },
          { name: 'qty', type: 'INTEGER', sample: '3' },
        ],
        sampleRows: [
          ['1', 'Beras 5kg', '1'],
          ['3', 'Teh celup', '1'],
          ['4', 'Sabun batang', '3'],
        ],
      },
    ],
    starterSql: `SELECT urutan, nama, qty
FROM penjualan;`,
    seedSql: `CREATE OR REPLACE TABLE penjualan (
  urutan INTEGER,
  nama VARCHAR,
  qty INTEGER
);
INSERT INTO penjualan VALUES
  (1, 'Beras 5kg', 1),
  (2, 'Gula 1kg', 1),
  (3, 'Teh celup', 1),
  (4, 'Sabun batang', 3);`,
    expected: {
      columns: ['urutan', 'nama', 'qty', 'jumlah_berjalan', 'bagian'],
      rows: [
        ['1', 'Beras 5kg', '1', '1', '16'],
        ['2', 'Gula 1kg', '1', '2', '33'],
        ['3', 'Teh celup', '1', '3', '50'],
        ['4', 'Sabun batang', '3', '6', '100'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'jumlah-tiga-hari-terakhir',
    title: 'Jumlah Tiga Hari Terakhir',
    category: 'Agregasi',
    level: 'Sulit',
    tags: ['window', 'advanced'],
    premium: false,
    prompt:
      'Jumlah tiga hari adalah qty hari ini ditambah qty dua baris hari sebelumnya pada urutan hari. Jika baris sebelumnya kurang dari dua, jumlahkan yang ada saja.\n\nTampilkan hari, qty, dan jumlah_tiga. Urutkan menurut hari dari kecil ke besar.',
    tables: [
      {
        name: 'harian',
        columns: [
          { name: 'hari', type: 'INTEGER', sample: '5' },
          { name: 'qty', type: 'INTEGER', sample: '10' },
        ],
        sampleRows: [
          ['1', '4'],
          ['4', '1'],
          ['5', '10'],
        ],
      },
    ],
    starterSql: `SELECT hari, qty
FROM harian;`,
    seedSql: `CREATE OR REPLACE TABLE harian (
  hari INTEGER,
  qty INTEGER
);
INSERT INTO harian VALUES
  (1, 4),
  (2, 5),
  (3, 6),
  (4, 1),
  (5, 10);`,
    expected: {
      columns: ['hari', 'qty', 'jumlah_tiga'],
      rows: [
        ['1', '4', '4'],
        ['2', '5', '9'],
        ['3', '6', '15'],
        ['4', '1', '12'],
        ['5', '10', '17'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'email-sama-beda-tulisan',
    title: 'Email Sama Beda Tulisan',
    category: 'Kualitas Data',
    level: 'Sulit',
    tags: ['data_quality', 'advanced'],
    premium: false,
    prompt:
      'Dua email dianggap sama bila huruf besar dan kecil diabaikan dan spasi di ujung dibuang. Tampilkan pelanggan yang emailnya, setelah aturan itu, dipakai lebih dari satu orang. Email yang belum terisi tidak ikut.\n\nTampilkan nama dan email apa adanya, tanpa diubah. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '6' },
          { name: 'nama', type: 'VARCHAR', sample: 'Raka Putra' },
          { name: 'email', type: 'VARCHAR', sample: 'NULL' },
        ],
        sampleRows: [
          ['1', 'Budi Santoso', 'Budi@Contoh.id'],
          ['2', 'Sari Wulandari', '  budi@contoh.id  '],
          ['4', 'Agus Pratama', 'LINA@contoh.id'],
          ['6', 'Raka Putra', 'NULL'],
        ],
      },
    ],
    starterSql: `SELECT nama, email
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  email VARCHAR
);
INSERT INTO pelanggan VALUES
  (1, 'Budi Santoso', 'Budi@Contoh.id'),
  (2, 'Sari Wulandari', '  budi@contoh.id  '),
  (3, 'Lina Kusuma', 'lina@contoh.id'),
  (4, 'Agus Pratama', 'LINA@contoh.id'),
  (5, 'Dewi Lestari', 'dewi@contoh.id'),
  (6, 'Raka Putra', NULL);`,
    expected: {
      columns: ['nama', 'email'],
      rows: [
        ['Agus Pratama', 'LINA@contoh.id'],
        ['Budi Santoso', 'Budi@Contoh.id'],
        ['Lina Kusuma', 'lina@contoh.id'],
        ['Sari Wulandari', '  budi@contoh.id  '],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'harga-toko-yang-bertentangan',
    title: 'Harga Toko yang Bertentangan',
    category: 'Kualitas Data',
    level: 'Sulit',
    tags: ['data_quality', 'advanced'],
    premium: false,
    prompt:
      'Satu nama barang bisa tercatat di beberapa toko. Tampilkan semua baris nama yang punya lebih dari satu harga terisi. Harga yang belum terisi tidak dihitung sebagai harga. Harga yang sama di dua toko bukan pertentangan.\n\nTampilkan nama, toko, dan harga. Urutkan menurut nama dari A ke Z, lalu toko dari A ke Z.',
    tables: [
      {
        name: 'harga_toko',
        columns: [
          { name: 'nama', type: 'VARCHAR', sample: 'Gula 1kg' },
          { name: 'toko', type: 'VARCHAR', sample: 'Utara' },
          { name: 'harga', type: 'INTEGER', sample: '15000' },
        ],
        sampleRows: [
          ['Beras 5kg', 'Pusat', '76000'],
          ['Beras 5kg', 'Utara', '76000'],
          ['Gula 1kg', 'Utara', '15000'],
          ['Kopi tubruk', 'Utara', 'NULL'],
          ['Sabun batang', 'Pusat', 'NULL'],
        ],
      },
    ],
    starterSql: `SELECT nama, toko, harga
FROM harga_toko;`,
    seedSql: `CREATE OR REPLACE TABLE harga_toko (
  nama VARCHAR,
  toko VARCHAR,
  harga INTEGER
);
INSERT INTO harga_toko VALUES
  ('Beras 5kg', 'Pusat', 76000),
  ('Beras 5kg', 'Utara', 76000),
  ('Gula 1kg', 'Pusat', 16000),
  ('Gula 1kg', 'Utara', 15000),
  ('Teh celup', 'Pusat', 8500),
  ('Kopi tubruk', 'Pusat', 18000),
  ('Kopi tubruk', 'Utara', NULL),
  ('Minyak goreng 1L', 'Pusat', 22000),
  ('Minyak goreng 1L', 'Selatan', 20000),
  ('Minyak goreng 1L', 'Utara', 22000),
  ('Sabun batang', 'Pusat', NULL),
  ('Sabun batang', 'Utara', NULL);`,
    expected: {
      columns: ['nama', 'toko', 'harga'],
      rows: [
        ['Gula 1kg', 'Pusat', '16000'],
        ['Gula 1kg', 'Utara', '15000'],
        ['Minyak goreng 1L', 'Pusat', '22000'],
        ['Minyak goreng 1L', 'Selatan', '20000'],
        ['Minyak goreng 1L', 'Utara', '22000'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'ujung-qty-tiap-toko',
    title: 'Ujung Qty tiap Toko',
    category: 'Agregasi',
    level: 'Sulit',
    tags: ['window', 'advanced'],
    premium: false,
    prompt:
      'Pada tiap toko, qty awal adalah qty pada hari paling kecil dan qty akhir adalah qty pada hari paling besar. Kedua nilai itu sama pada setiap baris toko tersebut.\n\nTampilkan toko, hari, qty, qty_awal, dan qty_akhir. Urutkan menurut toko dari A ke Z, lalu hari dari kecil ke besar.',
    tables: [
      {
        name: 'harian',
        columns: [
          { name: 'toko', type: 'VARCHAR', sample: 'Utara' },
          { name: 'hari', type: 'INTEGER', sample: '3' },
          { name: 'qty', type: 'INTEGER', sample: '9' },
        ],
        sampleRows: [
          ['Utara', '1', '4'],
          ['Utara', '3', '9'],
          ['Selatan', '5', '2'],
          ['Selatan', '4', '8'],
        ],
      },
    ],
    starterSql: `SELECT toko, hari, qty
FROM harian;`,
    seedSql: `CREATE OR REPLACE TABLE harian (
  toko VARCHAR,
  hari INTEGER,
  qty INTEGER
);
INSERT INTO harian VALUES
  ('Utara', 1, 4),
  ('Utara', 3, 9),
  ('Utara', 2, 6),
  ('Selatan', 5, 2),
  ('Selatan', 4, 8);`,
    expected: {
      columns: ['toko', 'hari', 'qty', 'qty_awal', 'qty_akhir'],
      rows: [
        ['Selatan', '4', '8', '8', '2'],
        ['Selatan', '5', '2', '8', '2'],
        ['Utara', '1', '4', '4', '9'],
        ['Utara', '2', '6', '4', '9'],
        ['Utara', '3', '9', '4', '9'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'selisih-dari-puncak-kota',
    title: 'Selisih dari Puncak Kota',
    category: 'Agregasi',
    level: 'Sulit',
    tags: ['window', 'advanced'],
    premium: false,
    prompt:
      'Selisih adalah belanja terbesar di kota yang sama dikurangi belanja pelanggan ini. Pelanggan yang belanjanya terbesar di kotanya punya selisih 0, termasuk bila ada dua pelanggan yang sama-sama terbesar.\n\nTampilkan kota, nama, total_belanja, dan selisih. Urutkan menurut kota dari A ke Z, lalu nama dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'kota', type: 'VARCHAR', sample: 'Jakarta' },
          { name: 'nama', type: 'VARCHAR', sample: 'Agus Pratama' },
          { name: 'total_belanja', type: 'INTEGER', sample: '500' },
        ],
        sampleRows: [
          ['Jakarta', 'Budi Santoso', '500'],
          ['Jakarta', 'Agus Pratama', '500'],
          ['Jakarta', 'Sari Wulandari', '200'],
          ['Bandung', 'Dewi Lestari', '100'],
        ],
      },
    ],
    starterSql: `SELECT kota, nama, total_belanja
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  kota VARCHAR,
  nama VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  ('Jakarta', 'Budi Santoso', 500),
  ('Jakarta', 'Sari Wulandari', 200),
  ('Jakarta', 'Agus Pratama', 500),
  ('Bandung', 'Dewi Lestari', 100),
  ('Bandung', 'Lina Kusuma', 80);`,
    expected: {
      columns: ['kota', 'nama', 'total_belanja', 'selisih'],
      rows: [
        ['Bandung', 'Dewi Lestari', '100', '0'],
        ['Bandung', 'Lina Kusuma', '80', '20'],
        ['Jakarta', 'Agus Pratama', '500', '0'],
        ['Jakarta', 'Budi Santoso', '500', '0'],
        ['Jakarta', 'Sari Wulandari', '200', '300'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'nomor-urut-setelah-saringan',
    title: 'Nomor Urut setelah Saringan',
    category: 'Agregasi',
    level: 'Sulit',
    tags: ['window', 'advanced'],
    premium: false,
    prompt:
      'Hanya pelanggan dari Bandung dan Medan. Di antara pelanggan yang lolos saringan itu, nomor urut mulai dari 1 menurut total belanja terbesar. Jika belanja sama, nama dari A ke Z lebih dulu. Nomor tidak boleh menghitung pelanggan kota lain.\n\nTampilkan nama, kota, total_belanja, dan nomor_urut. Urutkan menurut nomor_urut dari kecil ke besar.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '7' },
          { name: 'nama', type: 'VARCHAR', sample: 'Nina Sari' },
          { name: 'kota', type: 'VARCHAR', sample: 'Solo' },
          { name: 'total_belanja', type: 'INTEGER', sample: '10' },
        ],
        sampleRows: [
          ['2', 'Sari Wulandari', 'Jakarta', '400'],
          ['6', 'Lina Kusuma', 'Medan', '300'],
          ['5', 'Raka Putra', 'Medan', '300'],
          ['7', 'Nina Sari', 'Solo', '10'],
          ['3', 'Agus Pratama', 'Bandung', '250'],
        ],
      },
    ],
    starterSql: `SELECT nama, kota, total_belanja
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR,
  kota VARCHAR,
  total_belanja INTEGER
);
INSERT INTO pelanggan VALUES
  (1, 'Budi Santoso', 'Jakarta', 100),
  (2, 'Sari Wulandari', 'Jakarta', 400),
  (3, 'Agus Pratama', 'Bandung', 250),
  (4, 'Dewi Lestari', 'Bandung', 50),
  (5, 'Raka Putra', 'Medan', 300),
  (6, 'Lina Kusuma', 'Medan', 300),
  (7, 'Nina Sari', 'Solo', 10);`,
    expected: {
      columns: ['nama', 'kota', 'total_belanja', 'nomor_urut'],
      rows: [
        ['Lina Kusuma', 'Medan', '300', '1'],
        ['Raka Putra', 'Medan', '300', '2'],
        ['Agus Pratama', 'Bandung', '250', '3'],
        ['Dewi Lestari', 'Bandung', '50', '4'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'pelanggan-dari-dua-meja',
    title: 'Pelanggan dari Dua Meja',
    category: 'Menggabungkan Tabel',
    level: 'Sulit',
    tags: ['cte', 'join', 'advanced'],
    premium: false,
    prompt:
      'TokoKulwon ingin pelanggan yang datang minimal dua kali dan total notanya minimal 100. Jumlah kunjungan dihitung dari meja kunjungan. Total nota dihitung dari meja nota. Yang tepat dua kali datang tetap ikut. Yang total notanya tepat 100 tetap ikut. Jangan menjumlahkan setelah kedua meja digabung, karena baris akan berlipat.\n\nTampilkan nama, jumlah_kunjungan, dan total_nota. Urutkan menurut nama dari A ke Z.',
    tables: [
      {
        name: 'pelanggan',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '1' },
          { name: 'nama', type: 'VARCHAR', sample: 'Budi Santoso' },
        ],
        sampleRows: [
          ['1', 'Budi Santoso'],
          ['4', 'Dewi Lestari'],
          ['6', 'Raka Putra'],
        ],
      },
      {
        name: 'kunjungan',
        columns: [
          { name: 'pelanggan_id', type: 'INTEGER', sample: '1' },
          { name: 'hari', type: 'INTEGER', sample: '2' },
        ],
        sampleRows: [
          ['1', '1'],
          ['1', '2'],
          ['5', '1'],
        ],
      },
      {
        name: 'nota',
        columns: [
          { name: 'pelanggan_id', type: 'INTEGER', sample: '1' },
          { name: 'nilai', type: 'INTEGER', sample: '50' },
        ],
        sampleRows: [
          ['1', '50'],
          ['4', '200'],
          ['5', '60'],
          ['6', '100'],
        ],
      },
    ],
    starterSql: `SELECT nama
FROM pelanggan;`,
    seedSql: `CREATE OR REPLACE TABLE pelanggan (
  id INTEGER,
  nama VARCHAR
);
INSERT INTO pelanggan VALUES
  (1, 'Budi Santoso'),
  (2, 'Sari Wulandari'),
  (3, 'Agus Pratama'),
  (4, 'Dewi Lestari'),
  (5, 'Lina Kusuma'),
  (6, 'Raka Putra');
CREATE OR REPLACE TABLE kunjungan (
  pelanggan_id INTEGER,
  hari INTEGER
);
INSERT INTO kunjungan VALUES
  (1, 1),
  (1, 2),
  (2, 1),
  (3, 1),
  (3, 2),
  (3, 3),
  (4, 1),
  (4, 2),
  (5, 1);
CREATE OR REPLACE TABLE nota (
  pelanggan_id INTEGER,
  nilai INTEGER
);
INSERT INTO nota VALUES
  (1, 50),
  (1, 50),
  (2, 500),
  (3, 30),
  (4, 200),
  (5, 60),
  (5, 60),
  (6, 100);`,
    expected: {
      columns: ['nama', 'jumlah_kunjungan', 'total_nota'],
      rows: [
        ['Budi Santoso', '2', '100'],
        ['Dewi Lestari', '2', '200'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'stok-gudang-tak-wajar',
    title: 'Stok Gudang yang Tak Wajar',
    category: 'Kualitas Data',
    level: 'Sulit',
    tags: ['data_quality', 'advanced'],
    premium: false,
    prompt:
      'Baris stok bermasalah bila qty belum terisi, qty lebih kecil dari nol, atau pasangan barang dan gudang muncul lebih dari sekali. Qty nol masih wajar.\n\nTampilkan barang, gudang, dan qty. Urutkan menurut barang dari A ke Z, lalu gudang dari A ke Z, lalu qty dari kecil ke besar.',
    tables: [
      {
        name: 'stok',
        columns: [
          { name: 'barang', type: 'VARCHAR', sample: 'Gula 1kg' },
          { name: 'gudang', type: 'VARCHAR', sample: 'Selatan' },
          { name: 'qty', type: 'INTEGER', sample: '0' },
        ],
        sampleRows: [
          ['Beras 5kg', 'Utara', '4'],
          ['Beras 5kg', 'Utara', '5'],
          ['Gula 1kg', 'Selatan', '0'],
          ['Gula 1kg', 'Utara', '-1'],
          ['Teh celup', 'Utara', 'NULL'],
        ],
      },
    ],
    starterSql: `SELECT barang, gudang, qty
FROM stok;`,
    seedSql: `CREATE OR REPLACE TABLE stok (
  barang VARCHAR,
  gudang VARCHAR,
  qty INTEGER
);
INSERT INTO stok VALUES
  ('Beras 5kg', 'Utara', 5),
  ('Beras 5kg', 'Utara', 4),
  ('Gula 1kg', 'Utara', -1),
  ('Gula 1kg', 'Selatan', 0),
  ('Teh celup', 'Utara', NULL),
  ('Kopi tubruk', 'Utara', 3),
  ('Sabun batang', 'Selatan', 0);`,
    expected: {
      columns: ['barang', 'gudang', 'qty'],
      rows: [
        ['Beras 5kg', 'Utara', '4'],
        ['Beras 5kg', 'Utara', '5'],
        ['Gula 1kg', 'Utara', '-1'],
        ['Teh celup', 'Utara', 'NULL'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'kode-nol-di-depan',
    title: 'Kode Nol di Depan',
    category: 'Kualitas Data',
    level: 'Sulit',
    tags: ['data_quality', 'advanced'],
    premium: false,
    prompt:
      'Kode barang tertulis sebagai teks dan harus ditampilkan apa adanya, termasuk nol di depan. Urutan mengikuti nilai angkanya. Jika nilai angkanya sama, urutkan kode sebagai teks dari A ke Z.\n\nTampilkan kode dan nama.',
    tables: [
      {
        name: 'produk',
        columns: [
          { name: 'id', type: 'INTEGER', sample: '3' },
          { name: 'kode', type: 'VARCHAR', sample: '01' },
          { name: 'nama', type: 'VARCHAR', sample: 'Beras 5kg' },
        ],
        sampleRows: [
          ['1', '2', 'Gula 1kg'],
          ['2', '10', 'Minyak goreng 1L'],
          ['3', '01', 'Beras 5kg'],
          ['4', '02', 'Teh celup'],
        ],
      },
    ],
    starterSql: `SELECT nama
FROM produk;`,
    seedSql: `CREATE OR REPLACE TABLE produk (
  id INTEGER,
  kode VARCHAR,
  nama VARCHAR
);
INSERT INTO produk VALUES
  (1, '2', 'Gula 1kg'),
  (2, '10', 'Minyak goreng 1L'),
  (3, '01', 'Beras 5kg'),
  (4, '02', 'Teh celup');`,
    expected: {
      columns: ['kode', 'nama'],
      rows: [
        ['01', 'Beras 5kg'],
        ['02', 'Teh celup'],
        ['2', 'Gula 1kg'],
        ['10', 'Minyak goreng 1L'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
  {
    slug: 'gerak-qty-antar-hari',
    title: 'Gerak Qty antar Hari',
    category: 'Agregasi',
    level: 'Sulit',
    tags: ['window', 'advanced'],
    premium: false,
    prompt:
      'Gerak membandingkan qty dengan qty hari sebelumnya di toko yang sama, pada urutan hari. Baris pertama tiap toko berlabel awal. Qty yang lebih besar dari sebelumnya berlabel naik. Yang lebih kecil berlabel turun. Yang sama berlabel tetap.\n\nTampilkan toko, hari, qty, dan gerak. Urutkan menurut toko dari A ke Z, lalu hari dari kecil ke besar.',
    tables: [
      {
        name: 'harian',
        columns: [
          { name: 'toko', type: 'VARCHAR', sample: 'Selatan' },
          { name: 'hari', type: 'INTEGER', sample: '2' },
          { name: 'qty', type: 'INTEGER', sample: '4' },
        ],
        sampleRows: [
          ['Selatan', '1', '4'],
          ['Selatan', '2', '4'],
          ['Utara', '2', '8'],
          ['Utara', '4', '3'],
        ],
      },
    ],
    starterSql: `SELECT toko, hari, qty
FROM harian;`,
    seedSql: `CREATE OR REPLACE TABLE harian (
  toko VARCHAR,
  hari INTEGER,
  qty INTEGER
);
INSERT INTO harian VALUES
  ('Selatan', 1, 4),
  ('Selatan', 2, 4),
  ('Utara', 1, 5),
  ('Utara', 2, 8),
  ('Utara', 3, 8),
  ('Utara', 4, 3);`,
    expected: {
      columns: ['toko', 'hari', 'qty', 'gerak'],
      rows: [
        ['Selatan', '1', '4', 'awal'],
        ['Selatan', '2', '4', 'tetap'],
        ['Utara', '1', '5', 'awal'],
        ['Utara', '2', '8', 'naik'],
        ['Utara', '3', '8', 'tetap'],
        ['Utara', '4', '3', 'turun'],
      ],
    },
    requiresOrder: true,
    xpReward: 50,
  },
]

export const CATALOG_PATH = '/kulasql/challenges'

export const CHALLENGE_PATH = `${CATALOG_PATH}/${FIRST_CHALLENGE_SLUG}`

export function challengeBySlug(slug: string): Challenge | undefined {
  return CHALLENGES.find((item) => item.slug === slug)
}

export function listChallenges(
  query: CatalogQuery,
  completed: ReadonlySet<string>,
): Challenge[] {
  const q = query.q.trim().toLocaleLowerCase('id-ID')
  return CHALLENGES.filter((item) => {
    if (query.level && item.level !== query.level) return false
    if (query.category && item.category !== query.category) return false
    if (query.tag && !item.tags.includes(query.tag)) return false
    const done = completed.has(item.slug)
    if (query.status === 'selesai' && !done) return false
    if (query.status === 'belum' && done) return false
    if (q && !item.title.toLocaleLowerCase('id-ID').includes(q)) return false
    return true
  })
}

export function pageOf<T>(items: readonly T[], page: number): T[] {
  const start = (page - 1) * PAGE_SIZE
  return items.slice(start, start + PAGE_SIZE)
}

const CATEGORY_NAMES = new Set(CHALLENGES.map((item) => item.category))
const TAG_NAMES = new Set(CHALLENGES.flatMap((item) => item.tags))

export function catalogQuery(raw: {
  tingkat: string | null
  kategori: string | null
  status: string | null
  tag: string | null
  q: string | null
}): CatalogQuery {
  const tingkat = raw.tingkat?.trim() || null
  const kategori = raw.kategori?.trim() || null
  const status = raw.status?.trim() || null
  const tag = raw.tag?.trim() || null
  return {
    level: LEVELS.find((item) => item === tingkat) ?? null,
    category: kategori !== null && CATEGORY_NAMES.has(kategori) ? kategori : null,
    status: status === 'belum' || status === 'selesai' ? status : null,
    tag: tag !== null && TAG_NAMES.has(tag) ? tag : null,
    q: raw.q ?? '',
  }
}

export function seedStatements(existingTables: readonly string[], seedSql: string): string[] {
  const drops = existingTables
    .filter((name) => name.length > 0)
    .map((name) => `DROP TABLE IF EXISTS "${name.replaceAll('"', '""')}"`)
  const body = seedSql
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
  return [...drops, ...body]
}
