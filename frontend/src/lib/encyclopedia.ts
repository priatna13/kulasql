export const POSTGRES_PATH = '/functions/sql/postgresql'

export const DIALECTS = [
  { id: 'postgresql', label: 'PostgreSQL', path: POSTGRES_PATH },
  { id: 'mysql', label: 'MySQL', path: '/functions/sql/mysql' },
  { id: 'bigquery', label: 'BigQuery', path: '/functions/sql/bigquery' },
  { id: 'snowflake', label: 'Snowflake', path: '/functions/sql/snowflake' },
  { id: 'duckdb', label: 'DuckDB', path: '/functions/sql/duckdb' },
] as const

export type DialectId = (typeof DIALECTS)[number]['id']

export type Dialect = (typeof DIALECTS)[number]

export const PG_CATEGORIES = ['Agregasi', 'Angka', 'Teks', 'Tanggal', 'Ubah nilai'] as const

export type PgCategory = (typeof PG_CATEGORIES)[number]

export type PgParam = {
  name: string
  type: string
  note: string
}

export type PgFunction = {
  slug: string
  name: string
  category: PgCategory
  description: string
  resultType: string
  syntax: string
  parameters: readonly PgParam[]
  example: {
    columns: readonly string[]
    rows: readonly (readonly string[])[]
  }
  faq: readonly { q: string; a: string }[]
}

export const PG_FUNCTIONS: readonly PgFunction[] = [
  {
    slug: 'count',
    name: 'COUNT',
    category: 'Agregasi',
    description:
      'Menghitung baris. Bintang menghitung semua baris, termasuk yang kolomnya kosong. Kalau yang dihitung satu kolom, baris kosong pada kolom itu dilewati.',
    resultType: 'bigint',
    syntax: `SELECT COUNT(*) AS jumlah
FROM (VALUES (1), (2), (3), (4), (5), (6)) AS pelanggan(id);`,
    parameters: [
      {
        name: 'ekspresi',
        type: 'apa pun',
        note: 'Kolom yang dihitung, atau bintang untuk semua baris.',
      },
    ],
    example: { columns: ['jumlah'], rows: [['6']] },
    faq: [
      {
        q: 'Kenapa COUNT(harga) bisa lebih kecil dari jumlah baris?',
        a: 'Harga yang belum diisi tidak masuk hitungan. COUNT(*) tetap menghitung barisnya.',
      },
    ],
  },
  {
    slug: 'sum',
    name: 'SUM',
    category: 'Agregasi',
    description:
      'Menjumlahkan angka pada satu kolom. Nilai kosong dilewati, bukan dianggap nol. Kalau tidak ada angka sama sekali, hasilnya kosong.',
    resultType: 'bigint',
    syntax: `SELECT SUM(total_belanja) AS jumlah
FROM (VALUES (185000), (420000), (95000)) AS pelanggan(total_belanja);`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Kolom angka yang dijumlahkan. Kosong tidak ikut.',
      },
    ],
    example: { columns: ['jumlah'], rows: [['700000']] },
    faq: [
      {
        q: 'Kenapa hasilnya kosong, bukan nol?',
        a: 'SUM tidak mengubah kosong menjadi nol. Bungkus dengan COALESCE kalau penggantinya harus nol.',
      },
    ],
  },
  {
    slug: 'avg',
    name: 'AVG',
    category: 'Agregasi',
    description:
      'Rata-rata angka pada satu kolom. Kosong dilewati, jadi pembaginya jumlah angka yang terisi, bukan jumlah baris. Contoh di bawah memotong hasilnya jadi bilangan bulat.',
    resultType: 'numeric',
    syntax: `SELECT AVG(nilai)::integer AS rata
FROM (VALUES (100000), (300000)) AS pelanggan(nilai);`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Kolom angka yang dirata-rata. Kosong tidak ikut.',
      },
    ],
    example: { columns: ['rata'], rows: [['200000']] },
    faq: [
      {
        q: 'Kenapa rata-rata mentah sering berupa desimal panjang?',
        a: 'PostgreSQL menyimpan AVG sebagai numeric. Cast ke integer dipakai di contoh ini supaya hasilnya satu angka utuh.',
      },
    ],
  },
  {
    slug: 'min',
    name: 'MIN',
    category: 'Agregasi',
    description: 'Nilai paling kecil pada satu kolom, dari banyak baris. Kosong dilewati.',
    resultType: 'sama dengan tipe kolomnya',
    syntax: `SELECT MIN(total_belanja) AS terkecil
FROM (VALUES (185000), (420000), (95000)) AS pelanggan(total_belanja);`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Kolom yang dicari nilai paling kecilnya.',
      },
    ],
    example: { columns: ['terkecil'], rows: [['95000']] },
    faq: [
      {
        q: 'Apa bedanya dengan LEAST?',
        a: 'MIN membandingkan banyak baris pada satu kolom. LEAST membandingkan beberapa nilai pada baris yang sama.',
      },
    ],
  },
  {
    slug: 'max',
    name: 'MAX',
    category: 'Agregasi',
    description: 'Nilai paling besar pada satu kolom, dari banyak baris. Kosong dilewati.',
    resultType: 'sama dengan tipe kolomnya',
    syntax: `SELECT MAX(total_belanja) AS terbesar
FROM (VALUES (185000), (420000), (95000)) AS pelanggan(total_belanja);`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Kolom yang dicari nilai paling besarnya.',
      },
    ],
    example: { columns: ['terbesar'], rows: [['420000']] },
    faq: [
      {
        q: 'Apa bedanya dengan GREATEST?',
        a: 'MAX membandingkan banyak baris pada satu kolom. GREATEST membandingkan beberapa nilai pada baris yang sama.',
      },
    ],
  },
  {
    slug: 'string_agg',
    name: 'STRING_AGG',
    category: 'Agregasi',
    description:
      'Menggabungkan teks dari banyak baris jadi satu, dengan pemisah yang kamu tulis. Urutan di dalam fungsi yang menentukan susunan, bukan urutan tabel mentah.',
    resultType: 'text',
    syntax: `SELECT STRING_AGG(kota, ', ' ORDER BY kota) AS daftar
FROM (VALUES ('Jakarta'), ('Bandung'), ('Medan')) AS pelanggan(kota);`,
    parameters: [
      {
        name: 'nilai',
        type: 'text',
        note: 'Teks yang digabung. Kosong dilewati.',
      },
      {
        name: 'pemisah',
        type: 'text',
        note: 'Karakter di antara potongan. ORDER BY di dalam fungsi mengatur urutannya.',
      },
    ],
    example: { columns: ['daftar'], rows: [['Bandung, Jakarta, Medan']] },
    faq: [
      {
        q: 'Apa bedanya dengan CONCAT?',
        a: 'CONCAT menyambung beberapa kolom pada satu baris. STRING_AGG menyambung satu kolom dari banyak baris.',
      },
    ],
  },
  {
    slug: 'abs',
    name: 'ABS',
    category: 'Angka',
    description: 'Membuang tanda minus. Selisih yang negatif jadi angka positif.',
    resultType: 'sama dengan tipe masukannya',
    syntax: `SELECT ABS(-185000) AS nilai;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang tanda minusnya dibuang.',
      },
    ],
    example: { columns: ['nilai'], rows: [['185000']] },
    faq: [
      {
        q: 'Apa hasilnya kalau angkanya sudah positif?',
        a: 'Tetap angka itu. ABS hanya mengubah yang negatif.',
      },
    ],
  },
  {
    slug: 'round',
    name: 'ROUND',
    category: 'Angka',
    description:
      'Membulatkan ke bilangan terdekat. Pada numeric, angka .5 menjauh dari nol.',
    resultType: 'numeric',
    syntax: `SELECT ROUND(185000.4) AS bulat;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang dibulatkan. Argumen kedua, kalau ada, adalah jumlah digit desimal.',
      },
    ],
    example: { columns: ['bulat'], rows: [['185000']] },
    faq: [
      {
        q: 'Kenapa ROUND(10.5) bisa jadi 11?',
        a: 'Untuk numeric, PostgreSQL membulatkan .5 menjauh dari nol, bukan ke bilangan genap.',
      },
    ],
  },
  {
    slug: 'ceil',
    name: 'CEIL',
    category: 'Angka',
    description: 'Membulatkan ke atas, ke bilangan bulat yang tidak lebih kecil dari angkanya.',
    resultType: 'numeric',
    syntax: `SELECT CEIL(10.2) AS naik;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang dibulatkan ke atas.',
      },
    ],
    example: { columns: ['naik'], rows: [['11']] },
    faq: [
      {
        q: 'Apa bedanya dengan ROUND?',
        a: 'ROUND ke yang terdekat. CEIL selalu naik, jadi 10.2 jadi 11, bukan 10.',
      },
    ],
  },
  {
    slug: 'floor',
    name: 'FLOOR',
    category: 'Angka',
    description: 'Membulatkan ke bawah, ke bilangan bulat yang tidak lebih besar dari angkanya.',
    resultType: 'numeric',
    syntax: `SELECT FLOOR(10.8) AS turun;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang dibulatkan ke bawah.',
      },
    ],
    example: { columns: ['turun'], rows: [['10']] },
    faq: [
      {
        q: 'Apa hasil FLOOR pada angka negatif?',
        a: 'Tetap ke arah yang lebih kecil. FLOOR(-1.2) adalah -2, bukan -1.',
      },
    ],
  },
  {
    slug: 'trunc',
    name: 'TRUNC',
    category: 'Angka',
    description: 'Memotong desimal tanpa membulatkan. 10.8 tetap 10, bukan 11.',
    resultType: 'numeric',
    syntax: `SELECT TRUNC(10.8) AS potong;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang desimalnya dipotong. Argumen kedua mengatur digit yang disisakan.',
      },
    ],
    example: { columns: ['potong'], rows: [['10']] },
    faq: [
      {
        q: 'Apa bedanya dengan FLOOR?',
        a: 'Pada angka positif hasilnya sama. Pada angka negatif, TRUNC mendekati nol dan FLOOR menjauh dari nol.',
      },
    ],
  },
  {
    slug: 'mod',
    name: 'MOD',
    category: 'Angka',
    description: 'Sisa pembagian. 10 dibagi 3 menyisakan 1.',
    resultType: 'numeric',
    syntax: `SELECT MOD(10, 3) AS sisa;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang dibagi.',
      },
      {
        name: 'pembagi',
        type: 'numeric',
        note: 'Pembaginya. Pembagi nol membuat query gagal.',
      },
    ],
    example: { columns: ['sisa'], rows: [['1']] },
    faq: [
      {
        q: 'Kapan sisanya nol?',
        a: 'Kalau angkanya habis dibagi. MOD(9, 3) hasilnya 0.',
      },
    ],
  },
  {
    slug: 'power',
    name: 'POWER',
    category: 'Angka',
    description: 'Pangkat. 2 pangkat 3 hasilnya 8.',
    resultType: 'double precision',
    syntax: `SELECT POWER(2, 3) AS hasil;`,
    parameters: [
      {
        name: 'angka',
        type: 'double precision',
        note: 'Angka pokok.',
      },
      {
        name: 'pangkat',
        type: 'double precision',
        note: 'Berapa kali angka itu dikalikan dengan dirinya.',
      },
    ],
    example: { columns: ['hasil'], rows: [['8']] },
    faq: [
      {
        q: 'Apa hasilnya kalau pangkatnya nol?',
        a: 'Satu, termasuk POWER(0, 0). POWER(5, 0) juga 1.',
      },
    ],
  },
  {
    slug: 'sign',
    name: 'SIGN',
    category: 'Angka',
    description: 'Tanda angka: -1 kalau negatif, 0 kalau nol, 1 kalau positif.',
    resultType: 'numeric',
    syntax: `SELECT SIGN(-12) AS tanda;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang tandanya dibaca.',
      },
    ],
    example: { columns: ['tanda'], rows: [['-1']] },
    faq: [
      {
        q: 'Apa bedanya dengan ABS?',
        a: 'ABS mengembalikan besar angkanya. SIGN hanya mengembalikan tandanya.',
      },
    ],
  },
  {
    slug: 'lower',
    name: 'LOWER',
    category: 'Teks',
    description: 'Semua huruf jadi kecil. Dipakai sebelum membandingkan nama yang penulisannya campur.',
    resultType: 'text',
    syntax: `SELECT LOWER('TokoKulwon') AS huruf;`,
    parameters: [
      {
        name: 'teks',
        type: 'text',
        note: 'Teks yang hurufnya dikecilkan.',
      },
    ],
    example: { columns: ['huruf'], rows: [['tokokulwon']] },
    faq: [
      {
        q: 'Apakah spasi ikut berubah?',
        a: 'Tidak. Hanya huruf yang berubah. Angka dan spasi tetap.',
      },
    ],
  },
  {
    slug: 'upper',
    name: 'UPPER',
    category: 'Teks',
    description: 'Semua huruf jadi besar.',
    resultType: 'text',
    syntax: `SELECT UPPER('medan') AS huruf;`,
    parameters: [
      {
        name: 'teks',
        type: 'text',
        note: 'Teks yang hurufnya dibesarkan.',
      },
    ],
    example: { columns: ['huruf'], rows: [['MEDAN']] },
    faq: [
      {
        q: 'Apakah ini mengubah data di tabel?',
        a: 'Tidak. UPPER hanya mengubah nilai pada hasil query, kecuali kamu menulis UPDATE.',
      },
    ],
  },
  {
    slug: 'length',
    name: 'LENGTH',
    category: 'Teks',
    description: 'Banyaknya karakter, bukan byte. Spasi ikut terhitung.',
    resultType: 'integer',
    syntax: `SELECT LENGTH('Sari') AS panjang;`,
    parameters: [
      {
        name: 'teks',
        type: 'text',
        note: 'Teks yang dihitung karakternya.',
      },
    ],
    example: { columns: ['panjang'], rows: [['4']] },
    faq: [
      {
        q: 'Apakah spasi di ujung ikut?',
        a: 'Ikut. LENGTH(\'Sari \') hasilnya 5. Buang spasi itu dulu dengan TRIM kalau tidak diinginkan.',
      },
    ],
  },
  {
    slug: 'trim',
    name: 'TRIM',
    category: 'Teks',
    description: 'Membuang spasi di awal dan di akhir. Spasi di tengah nama tetap.',
    resultType: 'text',
    syntax: `SELECT TRIM('  Sari  ') AS nama;`,
    parameters: [
      {
        name: 'teks',
        type: 'text',
        note: 'Teks yang spasinya di ujung dibuang. Karakter lain bisa disebut setelah BOTH.',
      },
    ],
    example: { columns: ['nama'], rows: [['Sari']] },
    faq: [
      {
        q: 'Apakah spasi di antara dua kata ikut hilang?',
        a: 'Tidak. TRIM(\'Sari Wulandari\') tetap punya satu spasi di tengah.',
      },
    ],
  },
  {
    slug: 'substring',
    name: 'SUBSTRING',
    category: 'Teks',
    description: 'Mengambil potongan teks dari posisi tertentu. Posisi dimulai dari 1, bukan 0.',
    resultType: 'text',
    syntax: `SELECT SUBSTRING('Yogyakarta' FROM 5 FOR 6) AS potongan;`,
    parameters: [
      {
        name: 'teks',
        type: 'text',
        note: 'Teks sumber.',
      },
      {
        name: 'mulai',
        type: 'integer',
        note: 'Posisi karakter pertama yang diambil. Nomor 1 adalah karakter paling kiri.',
      },
      {
        name: 'panjang',
        type: 'integer',
        note: 'Berapa karakter yang diambil. Boleh dikosongkan kalau sisanya ikut semua.',
      },
    ],
    example: { columns: ['potongan'], rows: [['akarta']] },
    faq: [
      {
        q: 'Kenapa posisi pertama bukan nol?',
        a: 'Di SQL, karakter pertama bernomor 1. SUBSTRING dari 1 mengambil dari huruf paling kiri.',
      },
    ],
  },
  {
    slug: 'concat',
    name: 'CONCAT',
    category: 'Teks',
    description: 'Menyambung beberapa teks. Nilai kosong dilewati, tidak membuat seluruh hasil jadi kosong.',
    resultType: 'text',
    syntax: `SELECT CONCAT('Sari', ' ', 'Wulandari') AS nama;`,
    parameters: [
      {
        name: 'teks',
        type: 'text',
        note: 'Potongan yang disambung. Boleh lebih dari dua. Kosong dilewati.',
      },
    ],
    example: { columns: ['nama'], rows: [['Sari Wulandari']] },
    faq: [
      {
        q: 'Apa bedanya dengan operator ||?',
        a: 'Kalau salah satu sisi || kosong, hasilnya kosong. CONCAT melewati yang kosong dan tetap menyambung sisanya.',
      },
    ],
  },
  {
    slug: 'replace',
    name: 'REPLACE',
    category: 'Teks',
    description: 'Mengganti semua kemunculan satu teks dengan teks lain.',
    resultType: 'text',
    syntax: `SELECT REPLACE('Rp 20.000', '.', '') AS teks;`,
    parameters: [
      {
        name: 'teks',
        type: 'text',
        note: 'Teks sumber.',
      },
      {
        name: 'cari',
        type: 'text',
        note: 'Bagian yang diganti. Setiap kemunculan ikut.',
      },
      {
        name: 'ganti',
        type: 'text',
        note: 'Teks pengganti. Teks kosong berarti bagian itu dihapus.',
      },
    ],
    example: { columns: ['teks'], rows: [['Rp 20000']] },
    faq: [
      {
        q: 'Apakah penggantiannya peka huruf besar?',
        a: 'Ya. REPLACE membedakan Sari dan sari. Samakan dulu dengan LOWER kalau mau longgar.',
      },
    ],
  },
  {
    slug: 'left',
    name: 'LEFT',
    category: 'Teks',
    description: 'Mengambil beberapa karakter dari kiri.',
    resultType: 'text',
    syntax: `SELECT LEFT('Yogyakarta', 4) AS potongan;`,
    parameters: [
      {
        name: 'teks',
        type: 'text',
        note: 'Teks sumber.',
      },
      {
        name: 'panjang',
        type: 'integer',
        note: 'Berapa karakter dari kiri yang diambil.',
      },
    ],
    example: { columns: ['potongan'], rows: [['Yogy']] },
    faq: [
      {
        q: 'Apa yang terjadi kalau panjangnya melebihi teks?',
        a: 'Seluruh teks yang dikembalikan, tidak ditambah spasi.',
      },
    ],
  },
  {
    slug: 'right',
    name: 'RIGHT',
    category: 'Teks',
    description: 'Mengambil beberapa karakter dari kanan.',
    resultType: 'text',
    syntax: `SELECT RIGHT('Wulandari', 4) AS akhir;`,
    parameters: [
      {
        name: 'teks',
        type: 'text',
        note: 'Teks sumber.',
      },
      {
        name: 'panjang',
        type: 'integer',
        note: 'Berapa karakter dari kanan yang diambil.',
      },
    ],
    example: { columns: ['akhir'], rows: [['dari']] },
    faq: [
      {
        q: 'Apa bedanya dengan LIKE \'%dari\'?',
        a: 'LIKE menyaring baris. RIGHT mengambil potongan teksnya, tanpa membuang baris.',
      },
    ],
  },
  {
    slug: 'initcap',
    name: 'INITCAP',
    category: 'Teks',
    description: 'Huruf pertama tiap kata jadi besar, sisanya kecil.',
    resultType: 'text',
    syntax: `SELECT INITCAP('sari wulandari') AS nama;`,
    parameters: [
      {
        name: 'teks',
        type: 'text',
        note: 'Teks yang huruf awal tiap katanya dibesarkan.',
      },
    ],
    example: { columns: ['nama'], rows: [['Sari Wulandari']] },
    faq: [
      {
        q: 'Apa yang dianggap pemisah kata?',
        a: 'Selain huruf dan angka. Spasi memecah kata, jadi tiap nama dapat huruf besar.',
      },
    ],
  },
  {
    slug: 'position',
    name: 'POSITION',
    category: 'Teks',
    description:
      'Posisi awal sebuah teks di dalam teks lain. Nomor dimulai dari 1. Kalau tidak ketemu, hasilnya 0.',
    resultType: 'integer',
    syntax: `SELECT POSITION('Kul' IN 'TokoKulwon') AS posisi;`,
    parameters: [
      {
        name: 'cari',
        type: 'text',
        note: 'Teks yang dicari. Huruf besar dan kecil dibedakan.',
      },
      {
        name: 'teks',
        type: 'text',
        note: 'Teks tempat mencari.',
      },
    ],
    example: { columns: ['posisi'], rows: [['5']] },
    faq: [
      {
        q: 'Kenapa hasilnya nol, bukan kosong?',
        a: 'Nol artinya tidak ketemu. Kosong hanya muncul kalau salah satu teksnya memang kosong.',
      },
    ],
  },
  {
    slug: 'split_part',
    name: 'SPLIT_PART',
    category: 'Teks',
    description: 'Memecah teks pada pemisah, lalu mengambil potongan ke-n. Potongan pertama nomornya 1.',
    resultType: 'text',
    syntax: `SELECT SPLIT_PART('Sari Wulandari', ' ', 1) AS depan;`,
    parameters: [
      {
        name: 'teks',
        type: 'text',
        note: 'Teks yang dipecah.',
      },
      {
        name: 'pemisah',
        type: 'text',
        note: 'Karakter pemisah. Tidak ikut di hasil.',
      },
      {
        name: 'nomor',
        type: 'integer',
        note: 'Potongan yang diambil, mulai dari 1.',
      },
    ],
    example: { columns: ['depan'], rows: [['Sari']] },
    faq: [
      {
        q: 'Apa hasilnya kalau nomornya melebihi jumlah potongan?',
        a: 'Teks kosong, bukan error. SPLIT_PART(\'Sari\', \' \', 2) hasilnya teks tanpa karakter.',
      },
    ],
  },
  {
    slug: 'date_trunc',
    name: 'DATE_TRUNC',
    category: 'Tanggal',
    description:
      'Memotong tanggal ke awal periode. Awal bulan adalah tanggal 1 pada jam 00:00:00.',
    resultType: 'timestamp',
    syntax: `SELECT DATE_TRUNC('month', DATE '2026-10-06') AS awal;`,
    parameters: [
      {
        name: 'bagian',
        type: 'text',
        note: 'Periode yang disisakan, misalnya day, month, atau year.',
      },
      {
        name: 'nilai',
        type: 'timestamp',
        note: 'Tanggal atau waktu yang dipotong.',
      },
    ],
    example: { columns: ['awal'], rows: [['2026-10-01 00:00:00']] },
    faq: [
      {
        q: 'Kenapa jamnya ikut padahal masukannya tanggal?',
        a: 'DATE_TRUNC mengembalikan timestamp. Tanggal tanpa jam diubah dulu menjadi 00:00:00.',
      },
    ],
  },
  {
    slug: 'extract',
    name: 'EXTRACT',
    category: 'Tanggal',
    description: 'Mengambil satu bagian dari tanggal, misalnya bulan atau tahun, sebagai angka.',
    resultType: 'numeric',
    syntax: `SELECT EXTRACT(MONTH FROM DATE '2026-10-06') AS bulan;`,
    parameters: [
      {
        name: 'bagian',
        type: 'kata kunci',
        note: 'Bagian yang diambil, misalnya YEAR, MONTH, atau DAY. Bukan teks dalam kutip.',
      },
      {
        name: 'nilai',
        type: 'tanggal',
        note: 'Tanggal sumber, ditulis setelah FROM.',
      },
    ],
    example: { columns: ['bulan'], rows: [['10']] },
    faq: [
      {
        q: 'Apa bedanya dengan DATE_PART?',
        a: 'Hasilnya sama. DATE_PART menulis nama bagian sebagai teks, EXTRACT menulisnya sebagai kata kunci.',
      },
    ],
  },
  {
    slug: 'age',
    name: 'AGE',
    category: 'Tanggal',
    description:
      'Selisih dua tanggal sebagai interval. Mesin menulis interval dalam bahasa Inggris, misalnya 5 days.',
    resultType: 'interval',
    syntax: `SELECT AGE(DATE '2026-10-06', DATE '2026-10-01') AS selisih;`,
    parameters: [
      {
        name: 'akhir',
        type: 'tanggal',
        note: 'Tanggal yang lebih akhir. Argumen pertama.',
      },
      {
        name: 'awal',
        type: 'tanggal',
        note: 'Tanggal yang dikurangi. Kalau dikosongkan, yang dipakai waktu sekarang.',
      },
    ],
    example: { columns: ['selisih'], rows: [['5 days']] },
    faq: [
      {
        q: 'Kenapa tulisannya 5 days, bukan 5 hari?',
        a: 'Interval PostgreSQL ditampilkan dalam bahasa Inggris. Angkanya tetap selisih tanggal yang diminta.',
      },
    ],
  },
  {
    slug: 'date_part',
    name: 'DATE_PART',
    category: 'Tanggal',
    description: 'Mengambil satu bagian tanggal sebagai angka. Nama bagian ditulis sebagai teks.',
    resultType: 'double precision',
    syntax: `SELECT DATE_PART('month', DATE '2026-10-06') AS bulan;`,
    parameters: [
      {
        name: 'bagian',
        type: 'text',
        note: 'Nama bagian dalam kutip, misalnya \'month\' atau \'year\'.',
      },
      {
        name: 'nilai',
        type: 'tanggal',
        note: 'Tanggal sumber.',
      },
    ],
    example: { columns: ['bulan'], rows: [['10']] },
    faq: [
      {
        q: 'Kenapa \'month\' harus dalam kutip?',
        a: 'DATE_PART menerima nama bagian sebagai teks. Tanpa kutip, mesin menganggapnya nama kolom.',
      },
    ],
  },
  {
    slug: 'to_char',
    name: 'TO_CHAR',
    category: 'Tanggal',
    description: 'Mengubah tanggal atau angka menjadi teks menurut pola. Pola YYYY-MM-DD tidak tergantung bahasa.',
    resultType: 'text',
    syntax: `SELECT TO_CHAR(DATE '2026-10-06', 'YYYY-MM-DD') AS teks;`,
    parameters: [
      {
        name: 'nilai',
        type: 'tanggal atau numeric',
        note: 'Nilai yang diubah jadi teks.',
      },
      {
        name: 'pola',
        type: 'text',
        note: 'Bentuk hasilnya. YYYY tahun, MM bulan, DD tanggal.',
      },
    ],
    example: { columns: ['teks'], rows: [['2026-10-06']] },
    faq: [
      {
        q: 'Kenapa tidak memakai nama bulan?',
        a: 'Nama bulan mengikuti bahasa mesin. Pola angka tetap sama di mana pun.',
      },
    ],
  },
  {
    slug: 'coalesce',
    name: 'COALESCE',
    category: 'Ubah nilai',
    description:
      'Mengambil nilai pertama yang tidak kosong. Dipakai kalau kota belum tercatat dan hasilnya harus ada tulisan pengganti.',
    resultType: 'sama dengan nilai yang terpilih',
    syntax: `SELECT COALESCE(NULL, 'belum diisi') AS kota;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Daftar nilai, dari kiri ke kanan. Yang pertama tidak kosong yang dipakai.',
      },
    ],
    example: { columns: ['kota'], rows: [['belum diisi']] },
    faq: [
      {
        q: 'Apa bedanya kosong dengan teks kosong?',
        a: 'NULL belum terisi. Teks \'\' sudah terisi, meski tidak ada karakternya, jadi COALESCE tidak melewatinya.',
      },
    ],
  },
  {
    slug: 'nullif',
    name: 'NULLIF',
    category: 'Ubah nilai',
    description: 'Mengembalikan kosong kalau dua nilai sama. Kalau beda, nilai pertama yang dipakai.',
    resultType: 'sama dengan nilai pertama',
    syntax: `SELECT NULLIF('Medan', 'Medan') AS kota;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Nilai yang dikembalikan kalau tidak sama dengan pembanding.',
      },
      {
        name: 'pembanding',
        type: 'ekspresi',
        note: 'Kalau sama dengan nilai, hasilnya kosong.',
      },
    ],
    example: { columns: ['kota'], rows: [['NULL']] },
    faq: [
      {
        q: 'Kapan NULLIF berguna?',
        a: 'Untuk mengubah angka nol atau teks penanda menjadi kosong sebelum dibagi atau dihitung.',
      },
    ],
  },
  {
    slug: 'greatest',
    name: 'GREATEST',
    category: 'Ubah nilai',
    description:
      'Nilai paling besar dari beberapa angka pada baris yang sama. Untuk banyak baris, pakai MAX.',
    resultType: 'sama dengan tipe bersama',
    syntax: `SELECT GREATEST(95000, 420000, 150000) AS terbesar;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Dua nilai atau lebih pada baris yang sama. Kosong diabaikan kalau masih ada nilai lain.',
      },
    ],
    example: { columns: ['terbesar'], rows: [['420000']] },
    faq: [
      {
        q: 'Apa bedanya dengan MAX?',
        a: 'GREATEST memilih di satu baris. MAX merangkum satu kolom dari banyak baris.',
      },
    ],
  },
  {
    slug: 'least',
    name: 'LEAST',
    category: 'Ubah nilai',
    description:
      'Nilai paling kecil dari beberapa angka pada baris yang sama. Untuk banyak baris, pakai MIN.',
    resultType: 'sama dengan tipe bersama',
    syntax: `SELECT LEAST(95000, 420000, 150000) AS terkecil;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Dua nilai atau lebih pada baris yang sama. Kosong diabaikan kalau masih ada nilai lain.',
      },
    ],
    example: { columns: ['terkecil'], rows: [['95000']] },
    faq: [
      {
        q: 'Apa bedanya dengan MIN?',
        a: 'LEAST memilih di satu baris. MIN merangkum satu kolom dari banyak baris.',
      },
    ],
  },
  {
    slug: 'cast',
    name: 'CAST',
    category: 'Ubah nilai',
    description:
      'Mengubah tipe. Teks \'76000\' jadi angka supaya bisa dijumlahkan. Kalau teksnya bukan angka, query gagal.',
    resultType: 'sesuai tipe yang diminta',
    syntax: `SELECT CAST('76000' AS INTEGER) AS harga;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Nilai yang diubah tipenya.',
      },
      {
        name: 'tipe',
        type: 'nama tipe',
        note: 'Tipe tujuan, ditulis setelah AS. Bukan teks dalam kutip.',
      },
    ],
    example: { columns: ['harga'], rows: [['76000']] },
    faq: [
      {
        q: 'Apa bedanya CAST(\'76000\' AS INTEGER) dengan angka 76000?',
        a: 'Tulisan dalam kutip masih teks. CAST mengubahnya menjadi integer supaya bisa dijumlah atau dibandingkan sebagai angka.',
      },
    ],
  },
]

export const MYSQL_FUNCTIONS: readonly PgFunction[] = [
  {
    slug: 'count',
    name: 'COUNT',
    category: 'Agregasi',
    description:
      'Menghitung baris. Bintang menghitung semua baris, termasuk yang kolomnya kosong. Kalau yang dihitung satu kolom, baris kosong pada kolom itu dilewati.',
    resultType: 'BIGINT',
    syntax: `SELECT COUNT(*) AS jumlah
FROM (
  SELECT 1 AS id
  UNION ALL SELECT 2
  UNION ALL SELECT 3
  UNION ALL SELECT 4
  UNION ALL SELECT 5
  UNION ALL SELECT 6
) AS pelanggan;`,
    parameters: [
      {
        name: 'ekspresi',
        type: 'apa pun',
        note: 'Kolom yang dihitung, atau bintang untuk semua baris.',
      },
    ],
    example: { columns: ['jumlah'], rows: [['6']] },
    faq: [
      {
        q: 'Kenapa COUNT(kota) bisa lebih kecil dari jumlah baris?',
        a: 'Kota yang belum diisi tidak masuk hitungan. COUNT(*) tetap menghitung barisnya.',
      },
    ],
  },
  {
    slug: 'sum',
    name: 'SUM',
    category: 'Agregasi',
    description:
      'Menjumlahkan angka. Untuk angka utuh, MySQL mengembalikan desimal. Contoh ini mengubahnya jadi bilangan bulat supaya tabelnya satu angka utuh.',
    resultType: 'DECIMAL',
    syntax: `SELECT CAST(SUM(total_belanja) AS SIGNED) AS jumlah
FROM (
  SELECT 185000 AS total_belanja
  UNION ALL SELECT 420000
  UNION ALL SELECT 95000
) AS pelanggan;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Kolom angka yang dijumlahkan. Kosong tidak ikut.',
      },
    ],
    example: { columns: ['jumlah'], rows: [['700000']] },
    faq: [
      {
        q: 'Kenapa ada CAST di contoh?',
        a: 'SUM pada angka utuh di MySQL bertipe DECIMAL. CAST(... AS SIGNED) membuat hasil query ini 700000, bukan desimal.',
      },
    ],
  },
  {
    slug: 'avg',
    name: 'AVG',
    category: 'Agregasi',
    description:
      'Rata-rata angka. Kosong dilewati, jadi pembaginya jumlah angka yang terisi. AVG mengembalikan desimal. Contoh ini memotongnya jadi bilangan bulat.',
    resultType: 'DECIMAL',
    syntax: `SELECT CAST(AVG(nilai) AS SIGNED) AS rata
FROM (
  SELECT 100000 AS nilai
  UNION ALL SELECT 300000
) AS pelanggan;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Kolom angka yang dirata-rata. Kosong tidak ikut.',
      },
    ],
    example: { columns: ['rata'], rows: [['200000']] },
    faq: [
      {
        q: 'Kenapa tidak langsung 200000.0000?',
        a: 'Itu bentuk mentah AVG. CAST ke SIGNED pada contoh ini menghasilkan 200000 karena rata-ratanya memang habis.',
      },
    ],
  },
  {
    slug: 'min',
    name: 'MIN',
    category: 'Agregasi',
    description: 'Nilai paling kecil pada satu kolom, dari banyak baris. Kosong dilewati.',
    resultType: 'sama dengan tipe kolomnya',
    syntax: `SELECT MIN(total_belanja) AS terkecil
FROM (
  SELECT 185000 AS total_belanja
  UNION ALL SELECT 420000
  UNION ALL SELECT 95000
) AS pelanggan;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Kolom yang dicari nilai paling kecilnya.',
      },
    ],
    example: { columns: ['terkecil'], rows: [['95000']] },
    faq: [
      {
        q: 'Apa bedanya dengan LEAST?',
        a: 'MIN membandingkan banyak baris pada satu kolom. LEAST membandingkan beberapa nilai pada baris yang sama.',
      },
    ],
  },
  {
    slug: 'max',
    name: 'MAX',
    category: 'Agregasi',
    description: 'Nilai paling besar pada satu kolom, dari banyak baris. Kosong dilewati.',
    resultType: 'sama dengan tipe kolomnya',
    syntax: `SELECT MAX(total_belanja) AS terbesar
FROM (
  SELECT 185000 AS total_belanja
  UNION ALL SELECT 420000
  UNION ALL SELECT 95000
) AS pelanggan;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Kolom yang dicari nilai paling besarnya.',
      },
    ],
    example: { columns: ['terbesar'], rows: [['420000']] },
    faq: [
      {
        q: 'Apa bedanya dengan GREATEST?',
        a: 'MAX membandingkan banyak baris pada satu kolom. GREATEST membandingkan beberapa nilai pada baris yang sama.',
      },
    ],
  },
  {
    slug: 'group_concat',
    name: 'GROUP_CONCAT',
    category: 'Agregasi',
    description:
      'Menggabungkan teks dari banyak baris jadi satu. Di MySQL pemisahnya ditulis SEPARATOR, dan urutannya ORDER BY di dalam fungsi. Padanan PostgreSQL-nya STRING_AGG.',
    resultType: 'TEXT',
    syntax: `SELECT GROUP_CONCAT(kota ORDER BY kota SEPARATOR ', ') AS daftar
FROM (
  SELECT 'Jakarta' AS kota
  UNION ALL SELECT 'Bandung'
  UNION ALL SELECT 'Medan'
) AS pelanggan;`,
    parameters: [
      {
        name: 'nilai',
        type: 'text',
        note: 'Teks yang digabung. Kosong dilewati.',
      },
      {
        name: 'pemisah',
        type: 'text',
        note: 'Ditulis setelah SEPARATOR. ORDER BY di dalam fungsi mengatur urutan.',
      },
    ],
    example: { columns: ['daftar'], rows: [['Bandung, Jakarta, Medan']] },
    faq: [
      {
        q: 'Kenapa bukan STRING_AGG?',
        a: 'MySQL memakai GROUP_CONCAT. STRING_AGG adalah nama di PostgreSQL, BigQuery, dan DuckDB. Snowflake memakai LISTAGG.',
      },
    ],
  },
  {
    slug: 'abs',
    name: 'ABS',
    category: 'Angka',
    description: 'Membuang tanda minus. Selisih yang negatif jadi angka positif.',
    resultType: 'sama dengan tipe masukannya',
    syntax: `SELECT ABS(-185000) AS nilai;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang tanda minusnya dibuang.',
      },
    ],
    example: { columns: ['nilai'], rows: [['185000']] },
    faq: [
      {
        q: 'Apa hasilnya kalau angkanya sudah positif?',
        a: 'Tetap angka itu. ABS hanya mengubah yang negatif.',
      },
    ],
  },
  {
    slug: 'round',
    name: 'ROUND',
    category: 'Angka',
    description:
      'Membulatkan ke angka terdekat. Contoh ini memakai 185000.4, yang jatuh ke 185000, lalu CAST supaya hasil querynya bilangan bulat.',
    resultType: 'DECIMAL',
    syntax: `SELECT CAST(ROUND(185000.4) AS SIGNED) AS bulat;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang dibulatkan. Argumen kedua, kalau ada, adalah jumlah digit desimal.',
      },
    ],
    example: { columns: ['bulat'], rows: [['185000']] },
    faq: [
      {
        q: 'Kenapa contohnya tidak memakai .5?',
        a: 'Pembulatan .5 di MySQL tergantung tipe angkanya. 185000.4 tidak berada di tengah, jadi hasilnya 185000.',
      },
    ],
  },
  {
    slug: 'ceil',
    name: 'CEIL',
    category: 'Angka',
    description: 'Membulatkan ke atas, ke bilangan bulat yang tidak lebih kecil dari angkanya. CEILING adalah nama lain untuk fungsi yang sama.',
    resultType: 'DECIMAL',
    syntax: `SELECT CAST(CEIL(10.2) AS SIGNED) AS naik;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang dibulatkan ke atas.',
      },
    ],
    example: { columns: ['naik'], rows: [['11']] },
    faq: [
      {
        q: 'Apa bedanya dengan ROUND?',
        a: 'ROUND ke yang terdekat. CEIL selalu naik, jadi 10.2 jadi 11, bukan 10.',
      },
    ],
  },
  {
    slug: 'floor',
    name: 'FLOOR',
    category: 'Angka',
    description: 'Membulatkan ke bawah, ke bilangan bulat yang tidak lebih besar dari angkanya.',
    resultType: 'DECIMAL',
    syntax: `SELECT CAST(FLOOR(10.8) AS SIGNED) AS turun;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang dibulatkan ke bawah.',
      },
    ],
    example: { columns: ['turun'], rows: [['10']] },
    faq: [
      {
        q: 'Apa hasil FLOOR pada angka negatif?',
        a: 'Tetap ke arah yang lebih kecil. Contoh di halaman ini hanya angka positif 10.8, hasilnya 10.',
      },
    ],
  },
  {
    slug: 'lower',
    name: 'LOWER',
    category: 'Teks',
    description: 'Semua huruf jadi kecil. Dipakai sebelum membandingkan nama yang penulisannya campur.',
    resultType: 'VARCHAR',
    syntax: `SELECT LOWER('TokoKulwon') AS huruf;`,
    parameters: [
      {
        name: 'teks',
        type: 'text',
        note: 'Teks yang hurufnya dikecilkan.',
      },
    ],
    example: { columns: ['huruf'], rows: [['tokokulwon']] },
    faq: [
      {
        q: 'Apakah spasi ikut berubah?',
        a: 'Tidak. Hanya huruf yang berubah. Angka dan spasi tetap.',
      },
    ],
  },
  {
    slug: 'char_length',
    name: 'CHAR_LENGTH',
    category: 'Teks',
    description:
      'Banyaknya karakter, bukan byte. Ini padanan LENGTH di PostgreSQL. Spasi ikut terhitung.',
    resultType: 'BIGINT',
    syntax: `SELECT CHAR_LENGTH('Sari') AS panjang;`,
    parameters: [
      {
        name: 'teks',
        type: 'text',
        note: 'Teks yang dihitung karakternya.',
      },
    ],
    example: { columns: ['panjang'], rows: [['4']] },
    faq: [
      {
        q: 'Apa bedanya dengan LENGTH?',
        a: 'LENGTH di MySQL menghitung byte. CHAR_LENGTH menghitung karakter. Untuk Sari keduanya 4. Untuk huruf di luar Latin, keduanya bisa beda.',
      },
    ],
  },
  {
    slug: 'length',
    name: 'LENGTH',
    category: 'Teks',
    description:
      'Menghitung byte, bukan karakter. Pada utf8mb4, bawaan MySQL 8, huruf 你 memakan 3 byte dan tetap 1 karakter.',
    resultType: 'BIGINT',
    syntax: `SELECT LENGTH('你') AS byte_teks, CHAR_LENGTH('你') AS karakter;`,
    parameters: [
      {
        name: 'teks',
        type: 'text',
        note: 'Teks yang dihitung bytenya menurut charset koneksi. Contoh ini utf8mb4.',
      },
    ],
    example: { columns: ['byte_teks', 'karakter'], rows: [['3', '1']] },
    faq: [
      {
        q: 'Kenapa Sari tidak dipakai di contoh ini?',
        a: 'Sari hanya huruf Latin, jadi LENGTH dan CHAR_LENGTH sama-sama 4. Huruf 你 membuat bedanya kelihatan: 3 byte, 1 karakter.',
      },
    ],
  },
  {
    slug: 'substring',
    name: 'SUBSTRING',
    category: 'Teks',
    description:
      'Mengambil potongan teks. Posisi dimulai dari 1. Di MySQL panjang ditulis sebagai angka ketiga, bukan FROM ... FOR seperti PostgreSQL.',
    resultType: 'VARCHAR',
    syntax: `SELECT SUBSTRING('Yogyakarta', 5, 6) AS potongan;`,
    parameters: [
      {
        name: 'teks',
        type: 'text',
        note: 'Teks sumber.',
      },
      {
        name: 'mulai',
        type: 'integer',
        note: 'Posisi karakter pertama. Nomor 1 adalah karakter paling kiri.',
      },
      {
        name: 'panjang',
        type: 'integer',
        note: 'Berapa karakter yang diambil.',
      },
    ],
    example: { columns: ['potongan'], rows: [['akarta']] },
    faq: [
      {
        q: 'Apa bedanya dengan PostgreSQL?',
        a: 'Hasil potongannya sama untuk contoh ini, akarta. PostgreSQL menulis SUBSTRING(teks FROM 5 FOR 6). MySQL menulis SUBSTRING(teks, 5, 6).',
      },
    ],
  },
  {
    slug: 'concat',
    name: 'CONCAT',
    category: 'Teks',
    description: 'Menyambung beberapa teks pada satu baris. Kalau ada satu nilai kosong, seluruh hasil MySQL jadi kosong.',
    resultType: 'VARCHAR',
    syntax: `SELECT CONCAT('Sari', ' ', 'Wulandari') AS nama;`,
    parameters: [
      {
        name: 'teks',
        type: 'text',
        note: 'Potongan yang disambung. Boleh lebih dari dua.',
      },
    ],
    example: { columns: ['nama'], rows: [['Sari Wulandari']] },
    faq: [
      {
        q: 'Apa bedanya dengan CONCAT PostgreSQL?',
        a: 'Di MySQL, satu NULL membuat hasilnya NULL. Di PostgreSQL dan DuckDB, NULL dilewati dan sisa teksnya tetap disambung.',
      },
    ],
  },
  {
    slug: 'locate',
    name: 'LOCATE',
    category: 'Teks',
    description:
      'Posisi teks yang dicari, mulai dari 1. Argumen pertama adalah teks yang dicari, bukan teks sumber. Kalau tidak ketemu, hasilnya 0.',
    resultType: 'BIGINT',
    syntax: `SELECT LOCATE('Kul', 'TokoKulwon') AS posisi;`,
    parameters: [
      {
        name: 'cari',
        type: 'text',
        note: 'Teks yang dicari. Huruf besar dan kecil dibedakan.',
      },
      {
        name: 'teks',
        type: 'text',
        note: 'Teks tempat mencari. Ini argumen kedua.',
      },
    ],
    example: { columns: ['posisi'], rows: [['5']] },
    faq: [
      {
        q: 'Kenapa urutannya beda dengan STRPOS BigQuery?',
        a: 'LOCATE menulis yang dicari dulu: LOCATE(\'Kul\', \'TokoKulwon\') hasilnya 5. STRPOS BigQuery menulis sumber dulu: STRPOS(\'TokoKulwon\', \'Kul\').',
      },
    ],
  },
  {
    slug: 'datediff',
    name: 'DATEDIFF',
    category: 'Tanggal',
    description:
      'Selisih hari sebagai bilangan bulat. Tanggal pertama dikurangi tanggal kedua. Tidak menerima nama bagian, dan bukan interval seperti AGE di PostgreSQL.',
    resultType: 'INTEGER',
    syntax: `SELECT DATEDIFF('2026-10-06', '2026-10-01') AS selisih;`,
    parameters: [
      {
        name: 'akhir',
        type: 'tanggal',
        note: 'Tanggal yang dikurangi. Argumen pertama. Hanya bagian tanggalnya yang dipakai.',
      },
      {
        name: 'awal',
        type: 'tanggal',
        note: 'Tanggal pengurang. Argumen kedua.',
      },
    ],
    example: { columns: ['selisih'], rows: [['5']] },
    faq: [
      {
        q: 'Kenapa urutannya kebalikan dari Snowflake?',
        a: 'DATEDIFF MySQL hanya menghitung hari: tanggal pertama minus tanggal kedua, hasilnya 5. Snowflake menulis DATEDIFF(day, tanggal_awal, tanggal_akhir). Untuk satuan selain hari, MySQL memakai TIMESTAMPDIFF.',
      },
    ],
  },
  {
    slug: 'extract',
    name: 'EXTRACT',
    category: 'Tanggal',
    description: 'Mengambil satu bagian tanggal sebagai angka. Nama bagian adalah kata kunci, bukan teks dalam kutip.',
    resultType: 'INTEGER',
    syntax: `SELECT EXTRACT(MONTH FROM CAST('2026-10-06' AS DATE)) AS bulan;`,
    parameters: [
      {
        name: 'bagian',
        type: 'kata kunci',
        note: 'Misalnya YEAR, MONTH, atau DAY. Bukan teks dalam kutip.',
      },
      {
        name: 'nilai',
        type: 'tanggal',
        note: 'Tanggal sumber, ditulis setelah FROM.',
      },
    ],
    example: { columns: ['bulan'], rows: [['10']] },
    faq: [
      {
        q: 'Kenapa tanggalnya di-CAST dulu?',
        a: 'MySQL tidak memakai literal DATE \'2026-10-06\' seperti PostgreSQL. CAST(\'2026-10-06\' AS DATE) membuat nilainya bertipe tanggal.',
      },
    ],
  },
  {
    slug: 'date_format',
    name: 'DATE_FORMAT',
    category: 'Tanggal',
    description:
      'Mengubah tanggal jadi teks menurut pola. Polanya memakai persen, misalnya %Y tahun dan %m bulan. Bukan YYYY-MM-DD seperti TO_CHAR PostgreSQL.',
    resultType: 'VARCHAR',
    syntax: `SELECT DATE_FORMAT('2026-10-06', '%Y-%m-%d') AS teks;`,
    parameters: [
      {
        name: 'nilai',
        type: 'tanggal',
        note: 'Tanggal yang diubah jadi teks. Argumen pertama.',
      },
      {
        name: 'pola',
        type: 'text',
        note: '%Y tahun empat digit, %m bulan, %d tanggal.',
      },
    ],
    example: { columns: ['teks'], rows: [['2026-10-06']] },
    faq: [
      {
        q: 'Apa padanan polanya di dialek lain?',
        a: 'PostgreSQL dan Snowflake menulis YYYY-MM-DD pada TO_CHAR. BigQuery memakai FORMAT_DATE dengan %Y-%m-%d, dan polanya adalah argumen pertama.',
      },
    ],
  },
  {
    slug: 'coalesce',
    name: 'COALESCE',
    category: 'Ubah nilai',
    description: 'Mengambil nilai pertama yang tidak kosong. Boleh lebih dari dua nilai.',
    resultType: 'sama dengan nilai yang terpilih',
    syntax: `SELECT COALESCE(NULL, 'belum diisi') AS kota;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Daftar nilai, dari kiri ke kanan. Yang pertama tidak kosong yang dipakai.',
      },
    ],
    example: { columns: ['kota'], rows: [['belum diisi']] },
    faq: [
      {
        q: 'Apa bedanya dengan IFNULL?',
        a: 'IFNULL hanya dua nilai. COALESCE boleh lebih dari dua, dan namanya sama di dialek lain.',
      },
    ],
  },
  {
    slug: 'ifnull',
    name: 'IFNULL',
    category: 'Ubah nilai',
    description: 'Mengganti nilai kosong dengan satu nilai cadangan. Hanya dua argumen. Untuk lebih dari dua, pakai COALESCE.',
    resultType: 'sama dengan nilai yang terpilih',
    syntax: `SELECT IFNULL(NULL, 'belum diisi') AS kota;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Nilai yang dicek. Kalau kosong, cadangan yang dipakai.',
      },
      {
        name: 'cadangan',
        type: 'ekspresi',
        note: 'Nilai pengganti. Hanya satu.',
      },
    ],
    example: { columns: ['kota'], rows: [['belum diisi']] },
    faq: [
      {
        q: 'Apakah ini sama dengan COALESCE?',
        a: 'Untuk dua nilai, hasilnya sama. IFNULL tidak menerima nilai ketiga.',
      },
    ],
  },
  {
    slug: 'nullif',
    name: 'NULLIF',
    category: 'Ubah nilai',
    description: 'Mengembalikan kosong kalau dua nilai sama. Kalau beda, nilai pertama yang dipakai.',
    resultType: 'sama dengan nilai pertama',
    syntax: `SELECT NULLIF('Medan', 'Medan') AS kota;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Nilai yang dikembalikan kalau tidak sama dengan pembanding.',
      },
      {
        name: 'pembanding',
        type: 'ekspresi',
        note: 'Kalau sama dengan nilai, hasilnya kosong.',
      },
    ],
    example: { columns: ['kota'], rows: [['NULL']] },
    faq: [
      {
        q: 'Kenapa tabelnya menulis NULL?',
        a: 'Itu nilai kosong, bukan teks NULL. MySQL tidak mengembalikan empat huruf itu.',
      },
    ],
  },
  {
    slug: 'greatest',
    name: 'GREATEST',
    category: 'Ubah nilai',
    description: 'Nilai paling besar dari beberapa angka pada baris yang sama. Kalau ada satu nilai kosong, hasil MySQL ikut kosong.',
    resultType: 'sama dengan tipe bersama',
    syntax: `SELECT GREATEST(95000, 420000, 150000) AS terbesar;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Dua nilai atau lebih pada baris yang sama.',
      },
    ],
    example: { columns: ['terbesar'], rows: [['420000']] },
    faq: [
      {
        q: 'Apa bedanya dengan PostgreSQL?',
        a: 'Di MySQL, satu NULL membuat GREATEST NULL. Di PostgreSQL dan DuckDB, NULL dilewati kalau masih ada nilai lain.',
      },
    ],
  },
  {
    slug: 'least',
    name: 'LEAST',
    category: 'Ubah nilai',
    description: 'Nilai paling kecil dari beberapa angka pada baris yang sama. Kalau ada satu nilai kosong, hasil MySQL ikut kosong.',
    resultType: 'sama dengan tipe bersama',
    syntax: `SELECT LEAST(95000, 420000, 150000) AS terkecil;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Dua nilai atau lebih pada baris yang sama.',
      },
    ],
    example: { columns: ['terkecil'], rows: [['95000']] },
    faq: [
      {
        q: 'Apa bedanya dengan MIN?',
        a: 'LEAST memilih di satu baris. MIN merangkum satu kolom dari banyak baris.',
      },
    ],
  },
  {
    slug: 'cast',
    name: 'CAST',
    category: 'Ubah nilai',
    description:
      'Mengubah tipe. Untuk bilangan bulat, MySQL memakai SIGNED. INTEGER juga diterima di MySQL sekarang. Teks yang bukan angka membuat query gagal.',
    resultType: 'SIGNED',
    syntax: `SELECT CAST('76000' AS SIGNED) AS harga;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Nilai yang diubah tipenya.',
      },
      {
        name: 'tipe',
        type: 'nama tipe',
        note: 'SIGNED untuk bilangan bulat. Bukan teks dalam kutip.',
      },
    ],
    example: { columns: ['harga'], rows: [['76000']] },
    faq: [
      {
        q: 'Kenapa bukan CAST(... AS INTEGER)?',
        a: 'Bentuk yang sudah lama dipakai MySQL adalah SIGNED. INTEGER sebagai nama CAST baru diterima di MySQL yang lebih baru. SIGNED tetap jelas.',
      },
    ],
  },
]

export const BIGQUERY_FUNCTIONS: readonly PgFunction[] = [
  {
    slug: 'count',
    name: 'COUNT',
    category: 'Agregasi',
    description:
      'Menghitung baris. Bintang menghitung semua baris, termasuk yang kolomnya kosong. Kalau yang dihitung satu kolom, baris kosong pada kolom itu dilewati.',
    resultType: 'INT64',
    syntax: `SELECT COUNT(*) AS jumlah
FROM UNNEST([1, 2, 3, 4, 5, 6]) AS id;`,
    parameters: [
      {
        name: 'ekspresi',
        type: 'apa pun',
        note: 'Kolom yang dihitung, atau bintang untuk semua baris.',
      },
    ],
    example: { columns: ['jumlah'], rows: [['6']] },
    faq: [
      {
        q: 'Kenapa COUNT(kota) bisa lebih kecil dari jumlah baris?',
        a: 'Kota yang belum diisi tidak masuk hitungan. COUNT(*) tetap menghitung barisnya.',
      },
    ],
  },
  {
    slug: 'sum',
    name: 'SUM',
    category: 'Agregasi',
    description: 'Menjumlahkan angka INT64 dan mengembalikan INT64. Kosong dilewati, bukan dianggap nol.',
    resultType: 'INT64',
    syntax: `SELECT SUM(total_belanja) AS jumlah
FROM UNNEST([185000, 420000, 95000]) AS total_belanja;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Kolom angka yang dijumlahkan. Kosong tidak ikut.',
      },
    ],
    example: { columns: ['jumlah'], rows: [['700000']] },
    faq: [
      {
        q: 'Kenapa hasilnya kosong, bukan nol, kalau tidak ada angka?',
        a: 'SUM tidak mengubah kosong menjadi nol. Bungkus dengan COALESCE kalau penggantinya harus nol.',
      },
    ],
  },
  {
    slug: 'avg',
    name: 'AVG',
    category: 'Agregasi',
    description:
      'Rata-rata angka. Kosong dilewati. AVG pada INT64 mengembalikan FLOAT64. Contoh ini mengubahnya jadi INT64 karena rata-ratanya habis.',
    resultType: 'FLOAT64',
    syntax: `SELECT CAST(AVG(nilai) AS INT64) AS rata
FROM UNNEST([100000, 300000]) AS nilai;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Kolom angka yang dirata-rata. Kosong tidak ikut.',
      },
    ],
    example: { columns: ['rata'], rows: [['200000']] },
    faq: [
      {
        q: 'Kenapa ada CAST?',
        a: 'AVG mengembalikan FLOAT64. CAST ke INT64 pada rata-rata yang habis menghasilkan 200000.',
      },
    ],
  },
  {
    slug: 'min',
    name: 'MIN',
    category: 'Agregasi',
    description: 'Nilai paling kecil pada satu kolom, dari banyak baris. Kosong dilewati.',
    resultType: 'sama dengan tipe kolomnya',
    syntax: `SELECT MIN(total_belanja) AS terkecil
FROM UNNEST([185000, 420000, 95000]) AS total_belanja;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Kolom yang dicari nilai paling kecilnya.',
      },
    ],
    example: { columns: ['terkecil'], rows: [['95000']] },
    faq: [
      {
        q: 'Apa bedanya dengan LEAST?',
        a: 'MIN membandingkan banyak baris pada satu kolom. LEAST membandingkan beberapa nilai pada baris yang sama.',
      },
    ],
  },
  {
    slug: 'max',
    name: 'MAX',
    category: 'Agregasi',
    description: 'Nilai paling besar pada satu kolom, dari banyak baris. Kosong dilewati.',
    resultType: 'sama dengan tipe kolomnya',
    syntax: `SELECT MAX(total_belanja) AS terbesar
FROM UNNEST([185000, 420000, 95000]) AS total_belanja;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Kolom yang dicari nilai paling besarnya.',
      },
    ],
    example: { columns: ['terbesar'], rows: [['420000']] },
    faq: [
      {
        q: 'Apa bedanya dengan GREATEST?',
        a: 'MAX membandingkan banyak baris pada satu kolom. GREATEST membandingkan beberapa nilai pada baris yang sama.',
      },
    ],
  },
  {
    slug: 'string_agg',
    name: 'STRING_AGG',
    category: 'Agregasi',
    description:
      'Menggabungkan teks dari banyak baris. Pemisah adalah argumen kedua. ORDER BY di dalam fungsi menentukan urutan, bukan urutan array mentah.',
    resultType: 'STRING',
    syntax: `SELECT STRING_AGG(kota, ', ' ORDER BY kota) AS daftar
FROM UNNEST(['Jakarta', 'Bandung', 'Medan']) AS kota;`,
    parameters: [
      {
        name: 'nilai',
        type: 'STRING',
        note: 'Teks yang digabung. Kosong dilewati.',
      },
      {
        name: 'pemisah',
        type: 'STRING',
        note: 'Teks di antara potongan. ORDER BY di dalam fungsi mengatur urutan.',
      },
    ],
    example: { columns: ['daftar'], rows: [['Bandung, Jakarta, Medan']] },
    faq: [
      {
        q: 'Apa bedanya dengan GROUP_CONCAT MySQL?',
        a: 'Pekerjaannya sama. MySQL menulis GROUP_CONCAT(kota ORDER BY kota SEPARATOR \', \'). BigQuery menulis STRING_AGG(kota, \', \' ORDER BY kota).',
      },
    ],
  },
  {
    slug: 'approx_quantiles',
    name: 'APPROX_QUANTILES',
    category: 'Agregasi',
    description:
      'Perkiraan batas kuantil, bukan kuantil pasti. Angka kedua adalah jumlah kuantil. Hasilnya array sepanjang angka itu ditambah satu: elemen pertama perkiraan nilai terkecil, elemen terakhir perkiraan nilai terbesar.',
    resultType: 'ARRAY',
    syntax: `SELECT APPROX_QUANTILES(x, 2) AS approx_quantiles
FROM UNNEST([1, 1, 1, 4, 5, 6, 7, 8, 9, 10]) AS x;`,
    parameters: [
      {
        name: 'ekspresi',
        type: 'angka',
        note: 'Nilai yang dikelompokkan. Kosong diabaikan, kecuali RESPECT NULLS ditulis.',
      },
      {
        name: 'jumlah',
        type: 'INT64',
        note: 'Jumlah kuantil. Hasilnya berisi jumlah + 1 batas.',
      },
    ],
    example: { columns: ['approx_quantiles'], rows: [['[1, 5, 10]']] },
    faq: [
      {
        q: 'Kenapa ada tiga angka padahal yang diminta 2?',
        a: 'Dokumen BigQuery untuk query ini menuliskan [1, 5, 10]. Dua kuantil menghasilkan tiga batas: perkiraan minimum, tengah, dan maksimum.',
      },
      {
        q: 'Bisakah ini dijalankan di workspace tantangan?',
        a: 'Tidak. Workspace tantangan tetap DuckDB. Halaman ini dokumentasi BigQuery.',
      },
    ],
  },
  {
    slug: 'abs',
    name: 'ABS',
    category: 'Angka',
    description: 'Membuang tanda minus. Selisih yang negatif jadi angka positif.',
    resultType: 'sama dengan tipe masukannya',
    syntax: `SELECT ABS(-185000) AS nilai;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang tanda minusnya dibuang.',
      },
    ],
    example: { columns: ['nilai'], rows: [['185000']] },
    faq: [
      {
        q: 'Apa hasilnya kalau angkanya sudah positif?',
        a: 'Tetap angka itu. ABS hanya mengubah yang negatif.',
      },
    ],
  },
  {
    slug: 'round',
    name: 'ROUND',
    category: 'Angka',
    description:
      'Membulatkan ke angka terdekat. ROUND pada FLOAT64 mengembalikan FLOAT64. Contoh ini mengubah 185000.4 yang sudah dibulatkan jadi INT64.',
    resultType: 'FLOAT64',
    syntax: `SELECT CAST(ROUND(185000.4) AS INT64) AS bulat;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang dibulatkan. Argumen kedua, kalau ada, adalah jumlah digit desimal.',
      },
    ],
    example: { columns: ['bulat'], rows: [['185000']] },
    faq: [
      {
        q: 'Kenapa ada CAST?',
        a: 'Literal 185000.4 di BigQuery bertipe FLOAT64, jadi ROUND mengembalikan FLOAT64. CAST ke INT64 membuat sel contoh ini 185000.',
      },
    ],
  },
  {
    slug: 'ceil',
    name: 'CEIL',
    category: 'Angka',
    description: 'Membulatkan ke atas. Pada FLOAT64 hasilnya tetap FLOAT64. Contoh ini mengubahnya jadi INT64.',
    resultType: 'FLOAT64',
    syntax: `SELECT CAST(CEIL(10.2) AS INT64) AS naik;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang dibulatkan ke atas.',
      },
    ],
    example: { columns: ['naik'], rows: [['11']] },
    faq: [
      {
        q: 'Apa bedanya dengan ROUND?',
        a: 'ROUND ke yang terdekat. CEIL selalu naik, jadi 10.2 jadi 11, bukan 10.',
      },
    ],
  },
  {
    slug: 'floor',
    name: 'FLOOR',
    category: 'Angka',
    description: 'Membulatkan ke bawah. Pada FLOAT64 hasilnya tetap FLOAT64. Contoh ini mengubahnya jadi INT64.',
    resultType: 'FLOAT64',
    syntax: `SELECT CAST(FLOOR(10.8) AS INT64) AS turun;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang dibulatkan ke bawah.',
      },
    ],
    example: { columns: ['turun'], rows: [['10']] },
    faq: [
      {
        q: 'Apa hasil FLOOR pada angka negatif?',
        a: 'Tetap ke arah yang lebih kecil. Contoh di halaman ini hanya 10.8, hasil setelah CAST adalah 10.',
      },
    ],
  },
  {
    slug: 'lower',
    name: 'LOWER',
    category: 'Teks',
    description: 'Semua huruf jadi kecil. Dipakai sebelum membandingkan nama yang penulisannya campur.',
    resultType: 'STRING',
    syntax: `SELECT LOWER('TokoKulwon') AS huruf;`,
    parameters: [
      {
        name: 'teks',
        type: 'STRING',
        note: 'Teks yang hurufnya dikecilkan.',
      },
    ],
    example: { columns: ['huruf'], rows: [['tokokulwon']] },
    faq: [
      {
        q: 'Apakah spasi ikut berubah?',
        a: 'Tidak. Hanya huruf yang berubah. Angka dan spasi tetap.',
      },
    ],
  },
  {
    slug: 'length',
    name: 'LENGTH',
    category: 'Teks',
    description: 'Banyaknya karakter, bukan byte. Spasi ikut terhitung. Ini beda dari LENGTH MySQL, yang menghitung byte.',
    resultType: 'INT64',
    syntax: `SELECT LENGTH('Sari') AS panjang;`,
    parameters: [
      {
        name: 'teks',
        type: 'STRING',
        note: 'Teks yang dihitung karakternya.',
      },
    ],
    example: { columns: ['panjang'], rows: [['4']] },
    faq: [
      {
        q: 'Apakah spasi di ujung ikut?',
        a: 'Ikut. LENGTH(\'Sari \') hasilnya 5. Buang spasi itu dulu dengan TRIM kalau tidak diinginkan.',
      },
    ],
  },
  {
    slug: 'substr',
    name: 'SUBSTR',
    category: 'Teks',
    description: 'Mengambil potongan teks. Posisi dimulai dari 1. Panjang adalah argumen ketiga.',
    resultType: 'STRING',
    syntax: `SELECT SUBSTR('Yogyakarta', 5, 6) AS potongan;`,
    parameters: [
      {
        name: 'teks',
        type: 'STRING',
        note: 'Teks sumber.',
      },
      {
        name: 'mulai',
        type: 'INT64',
        note: 'Posisi karakter pertama. Nomor 1 adalah karakter paling kiri.',
      },
      {
        name: 'panjang',
        type: 'INT64',
        note: 'Berapa karakter yang diambil.',
      },
    ],
    example: { columns: ['potongan'], rows: [['akarta']] },
    faq: [
      {
        q: 'Apa bedanya dengan SUBSTRING PostgreSQL?',
        a: 'Hasil contoh ini sama, akarta. PostgreSQL menulis SUBSTRING(teks FROM 5 FOR 6). BigQuery menulis SUBSTR(teks, 5, 6).',
      },
    ],
  },
  {
    slug: 'concat',
    name: 'CONCAT',
    category: 'Teks',
    description: 'Menyambung beberapa teks. Kalau ada satu nilai kosong, seluruh hasilnya kosong.',
    resultType: 'STRING',
    syntax: `SELECT CONCAT('Sari', ' ', 'Wulandari') AS nama;`,
    parameters: [
      {
        name: 'teks',
        type: 'STRING',
        note: 'Potongan yang disambung. Boleh lebih dari dua.',
      },
    ],
    example: { columns: ['nama'], rows: [['Sari Wulandari']] },
    faq: [
      {
        q: 'Apa yang terjadi kalau ada NULL?',
        a: 'CONCAT BigQuery mengembalikan NULL. PostgreSQL dan DuckDB melewati NULL dan tetap menyambung sisanya.',
      },
    ],
  },
  {
    slug: 'strpos',
    name: 'STRPOS',
    category: 'Teks',
    description:
      'Posisi teks yang dicari, mulai dari 1. Argumen pertama adalah teks sumber, baru teks yang dicari. Kalau tidak ketemu, hasilnya 0.',
    resultType: 'INT64',
    syntax: `SELECT STRPOS('TokoKulwon', 'Kul') AS posisi;`,
    parameters: [
      {
        name: 'teks',
        type: 'STRING',
        note: 'Teks tempat mencari. Ini argumen pertama.',
      },
      {
        name: 'cari',
        type: 'STRING',
        note: 'Teks yang dicari. Huruf besar dan kecil dibedakan.',
      },
    ],
    example: { columns: ['posisi'], rows: [['5']] },
    faq: [
      {
        q: 'Kenapa urutannya terbalik dari LOCATE MySQL?',
        a: 'STRPOS(\'TokoKulwon\', \'Kul\') hasilnya 5. LOCATE MySQL menulis yang dicari dulu: LOCATE(\'Kul\', \'TokoKulwon\').',
      },
    ],
  },
  {
    slug: 'date_diff',
    name: 'DATE_DIFF',
    category: 'Tanggal',
    description:
      'Selisih dua tanggal sebagai bilangan bulat untuk satu bagian. Tanggal akhir ditulis dulu, lalu tanggal awal, lalu bagian seperti DAY. Bukan interval seperti AGE PostgreSQL.',
    resultType: 'INT64',
    syntax: `SELECT DATE_DIFF(DATE '2026-10-06', DATE '2026-10-01', DAY) AS selisih;`,
    parameters: [
      {
        name: 'akhir',
        type: 'DATE',
        note: 'Tanggal yang dikurangi. Argumen pertama.',
      },
      {
        name: 'awal',
        type: 'DATE',
        note: 'Tanggal pengurang. Argumen kedua.',
      },
      {
        name: 'bagian',
        type: 'kata kunci',
        note: 'Misalnya DAY, MONTH, atau YEAR. Bukan teks dalam kutip.',
      },
    ],
    example: { columns: ['selisih'], rows: [['5']] },
    faq: [
      {
        q: 'Kenapa urutannya beda dengan Snowflake?',
        a: 'BigQuery menulis tanggal akhir, tanggal awal, lalu DAY. Hasilnya 5. Snowflake menulis DATEDIFF(day, tanggal_awal, tanggal_akhir). MySQL DATEDIFF hanya menghitung hari dan memakai urutan akhir lalu awal.',
      },
    ],
  },
  {
    slug: 'extract',
    name: 'EXTRACT',
    category: 'Tanggal',
    description: 'Mengambil satu bagian tanggal sebagai angka. Nama bagian adalah kata kunci, bukan teks dalam kutip.',
    resultType: 'INT64',
    syntax: `SELECT EXTRACT(MONTH FROM DATE '2026-10-06') AS bulan;`,
    parameters: [
      {
        name: 'bagian',
        type: 'kata kunci',
        note: 'Misalnya YEAR, MONTH, atau DAY.',
      },
      {
        name: 'nilai',
        type: 'DATE',
        note: 'Tanggal sumber, ditulis setelah FROM.',
      },
    ],
    example: { columns: ['bulan'], rows: [['10']] },
    faq: [
      {
        q: 'Kenapa MONTH tidak dalam kutip?',
        a: 'EXTRACT memakai kata kunci. DATE_DIFF juga begitu. strftime DuckDB dan DATE_FORMAT MySQL yang memakai teks pola.',
      },
    ],
  },
  {
    slug: 'format_date',
    name: 'FORMAT_DATE',
    category: 'Tanggal',
    description:
      'Mengubah tanggal jadi teks. Polanya argumen pertama, tanggalnya argumen kedua. Polanya memakai persen, misalnya %Y dan %m.',
    resultType: 'STRING',
    syntax: `SELECT FORMAT_DATE('%Y-%m-%d', DATE '2026-10-06') AS teks;`,
    parameters: [
      {
        name: 'pola',
        type: 'STRING',
        note: 'Argumen pertama. %Y tahun, %m bulan, %d tanggal.',
      },
      {
        name: 'nilai',
        type: 'DATE',
        note: 'Tanggal yang diubah jadi teks. Argumen kedua.',
      },
    ],
    example: { columns: ['teks'], rows: [['2026-10-06']] },
    faq: [
      {
        q: 'Kenapa polanya di depan?',
        a: 'FORMAT_DATE menulis pola dulu. TO_CHAR PostgreSQL dan Snowflake menulis tanggal dulu, lalu pola YYYY-MM-DD.',
      },
    ],
  },
  {
    slug: 'coalesce',
    name: 'COALESCE',
    category: 'Ubah nilai',
    description: 'Mengambil nilai pertama yang tidak kosong. Boleh lebih dari dua nilai.',
    resultType: 'sama dengan nilai yang terpilih',
    syntax: `SELECT COALESCE(NULL, 'belum diisi') AS kota;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Daftar nilai, dari kiri ke kanan. Yang pertama tidak kosong yang dipakai.',
      },
    ],
    example: { columns: ['kota'], rows: [['belum diisi']] },
    faq: [
      {
        q: 'Apa bedanya kosong dengan teks kosong?',
        a: 'NULL belum terisi. Teks \'\' sudah terisi, meski tidak ada karakternya, jadi COALESCE tidak melewatinya.',
      },
    ],
  },
  {
    slug: 'nullif',
    name: 'NULLIF',
    category: 'Ubah nilai',
    description: 'Mengembalikan kosong kalau dua nilai sama. Kalau beda, nilai pertama yang dipakai.',
    resultType: 'sama dengan nilai pertama',
    syntax: `SELECT NULLIF('Medan', 'Medan') AS kota;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Nilai yang dikembalikan kalau tidak sama dengan pembanding.',
      },
      {
        name: 'pembanding',
        type: 'ekspresi',
        note: 'Kalau sama dengan nilai, hasilnya kosong.',
      },
    ],
    example: { columns: ['kota'], rows: [['NULL']] },
    faq: [
      {
        q: 'Kenapa tabelnya menulis NULL?',
        a: 'Itu nilai kosong, bukan teks empat huruf. BigQuery tidak mengembalikan tulisan NULL.',
      },
    ],
  },
  {
    slug: 'greatest',
    name: 'GREATEST',
    category: 'Ubah nilai',
    description: 'Nilai paling besar dari beberapa angka pada baris yang sama. Kalau ada satu nilai kosong, hasilnya kosong.',
    resultType: 'sama dengan tipe bersama',
    syntax: `SELECT GREATEST(95000, 420000, 150000) AS terbesar;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Dua nilai atau lebih pada baris yang sama.',
      },
    ],
    example: { columns: ['terbesar'], rows: [['420000']] },
    faq: [
      {
        q: 'Apa bedanya dengan DuckDB?',
        a: 'Di BigQuery, satu NULL membuat GREATEST NULL. DuckDB dan PostgreSQL melewati NULL kalau masih ada nilai lain.',
      },
    ],
  },
  {
    slug: 'least',
    name: 'LEAST',
    category: 'Ubah nilai',
    description: 'Nilai paling kecil dari beberapa angka pada baris yang sama. Kalau ada satu nilai kosong, hasilnya kosong.',
    resultType: 'sama dengan tipe bersama',
    syntax: `SELECT LEAST(95000, 420000, 150000) AS terkecil;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Dua nilai atau lebih pada baris yang sama.',
      },
    ],
    example: { columns: ['terkecil'], rows: [['95000']] },
    faq: [
      {
        q: 'Apa bedanya dengan MIN?',
        a: 'LEAST memilih di satu baris. MIN merangkum satu kolom dari banyak baris.',
      },
    ],
  },
  {
    slug: 'cast',
    name: 'CAST',
    category: 'Ubah nilai',
    description: 'Mengubah tipe. Bilangan bulat 64-bit ditulis INT64. Teks yang bukan angka membuat query gagal.',
    resultType: 'INT64',
    syntax: `SELECT CAST('76000' AS INT64) AS harga;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Nilai yang diubah tipenya.',
      },
      {
        name: 'tipe',
        type: 'nama tipe',
        note: 'Misalnya INT64, FLOAT64, atau DATE. Bukan teks dalam kutip.',
      },
    ],
    example: { columns: ['harga'], rows: [['76000']] },
    faq: [
      {
        q: 'Kenapa bukan INTEGER?',
        a: 'INT64 nama kanonik bilangan bulat di BigQuery. INTEGER adalah alias, jadi CAST(\'76000\' AS INTEGER) juga sah dan hasilnya sama, 76000. Contoh memakai INT64.',
      },
    ],
  },
]

export const SNOWFLAKE_FUNCTIONS: readonly PgFunction[] = [
  {
    slug: 'count',
    name: 'COUNT',
    category: 'Agregasi',
    description:
      'Menghitung baris. Bintang menghitung semua baris, termasuk yang kolomnya kosong. Kalau yang dihitung satu kolom, baris kosong pada kolom itu dilewati.',
    resultType: 'NUMBER',
    syntax: `SELECT COUNT(*) AS jumlah
FROM (VALUES (1), (2), (3), (4), (5), (6)) AS pelanggan(id);`,
    parameters: [
      {
        name: 'ekspresi',
        type: 'apa pun',
        note: 'Kolom yang dihitung, atau bintang untuk semua baris.',
      },
    ],
    example: { columns: ['jumlah'], rows: [['6']] },
    faq: [
      {
        q: 'Kenapa COUNT(kota) bisa lebih kecil dari jumlah baris?',
        a: 'Kota yang belum diisi tidak masuk hitungan. COUNT(*) tetap menghitung barisnya.',
      },
    ],
  },
  {
    slug: 'sum',
    name: 'SUM',
    category: 'Agregasi',
    description: 'Menjumlahkan angka. Kosong dilewati, bukan dianggap nol. Contoh bilangan bulat ini hasilnya 700000.',
    resultType: 'NUMBER',
    syntax: `SELECT SUM(total_belanja) AS jumlah
FROM (VALUES (185000), (420000), (95000)) AS pelanggan(total_belanja);`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Kolom angka yang dijumlahkan. Kosong tidak ikut.',
      },
    ],
    example: { columns: ['jumlah'], rows: [['700000']] },
    faq: [
      {
        q: 'Kenapa hasilnya kosong, bukan nol, kalau tidak ada angka?',
        a: 'SUM tidak mengubah kosong menjadi nol. Bungkus dengan COALESCE kalau penggantinya harus nol.',
      },
    ],
  },
  {
    slug: 'avg',
    name: 'AVG',
    category: 'Agregasi',
    description:
      'Rata-rata angka. Kosong dilewati. Contoh ini mengubah hasilnya jadi INTEGER karena rata-ratanya habis.',
    resultType: 'NUMBER',
    syntax: `SELECT CAST(AVG(nilai) AS INTEGER) AS rata
FROM (VALUES (100000), (300000)) AS pelanggan(nilai);`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Kolom angka yang dirata-rata. Kosong tidak ikut.',
      },
    ],
    example: { columns: ['rata'], rows: [['200000']] },
    faq: [
      {
        q: 'Kenapa ada CAST?',
        a: 'AVG bisa mengembalikan desimal. CAST ke INTEGER pada rata-rata yang habis menghasilkan 200000.',
      },
    ],
  },
  {
    slug: 'min',
    name: 'MIN',
    category: 'Agregasi',
    description: 'Nilai paling kecil pada satu kolom, dari banyak baris. Kosong dilewati.',
    resultType: 'sama dengan tipe kolomnya',
    syntax: `SELECT MIN(total_belanja) AS terkecil
FROM (VALUES (185000), (420000), (95000)) AS pelanggan(total_belanja);`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Kolom yang dicari nilai paling kecilnya.',
      },
    ],
    example: { columns: ['terkecil'], rows: [['95000']] },
    faq: [
      {
        q: 'Apa bedanya dengan LEAST?',
        a: 'MIN membandingkan banyak baris pada satu kolom. LEAST membandingkan beberapa nilai pada baris yang sama.',
      },
    ],
  },
  {
    slug: 'max',
    name: 'MAX',
    category: 'Agregasi',
    description: 'Nilai paling besar pada satu kolom, dari banyak baris. Kosong dilewati.',
    resultType: 'sama dengan tipe kolomnya',
    syntax: `SELECT MAX(total_belanja) AS terbesar
FROM (VALUES (185000), (420000), (95000)) AS pelanggan(total_belanja);`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Kolom yang dicari nilai paling besarnya.',
      },
    ],
    example: { columns: ['terbesar'], rows: [['420000']] },
    faq: [
      {
        q: 'Apa bedanya dengan GREATEST?',
        a: 'MAX membandingkan banyak baris pada satu kolom. GREATEST membandingkan beberapa nilai pada baris yang sama.',
      },
    ],
  },
  {
    slug: 'listagg',
    name: 'LISTAGG',
    category: 'Agregasi',
    description:
      'Menggabungkan teks dari banyak baris. Pemisah adalah argumen kedua. Urutan ditulis WITHIN GROUP (ORDER BY ...), bukan ORDER BY di dalam tanda kurung pertama.',
    resultType: 'VARCHAR',
    syntax: `SELECT LISTAGG(kota, ', ') WITHIN GROUP (ORDER BY kota) AS daftar
FROM (VALUES ('Jakarta'), ('Bandung'), ('Medan')) AS pelanggan(kota);`,
    parameters: [
      {
        name: 'nilai',
        type: 'teks',
        note: 'Teks yang digabung. Kosong dilewati.',
      },
      {
        name: 'pemisah',
        type: 'teks',
        note: 'Teks di antara potongan.',
      },
    ],
    example: { columns: ['daftar'], rows: [['Bandung, Jakarta, Medan']] },
    faq: [
      {
        q: 'Apa bedanya dengan STRING_AGG?',
        a: 'Pekerjaannya sama. PostgreSQL menulis STRING_AGG(kota, \', \' ORDER BY kota). Snowflake menulis LISTAGG plus WITHIN GROUP.',
      },
    ],
  },
  {
    slug: 'boolor_agg',
    name: 'BOOLOR_AGG',
    category: 'Agregasi',
    description:
      'Benar kalau ada satu nilai boolean yang benar di grup itu. Kalau semua nilai kosong, atau grupnya tidak punya baris, hasilnya kosong. Bukan fungsi ANSI.',
    resultType: 'BOOLEAN',
    syntax: `SELECT BOOLOR_AGG(lunas) AS ada_lunas
FROM (
  SELECT TRUE AS lunas
  UNION ALL
  SELECT FALSE
) AS pesanan;`,
    parameters: [
      {
        name: 'nilai',
        type: 'boolean',
        note: 'Ekspresi yang bisa jadi boolean. Angka bukan nol dianggap benar. Teks tidak bisa.',
      },
    ],
    example: { columns: ['ada_lunas'], rows: [['True']] },
    faq: [
      {
        q: 'Kenapa tulisannya True, bukan 1?',
        a: 'BOOLOR_AGG mengembalikan boolean. Dokumen Snowflake menampilkan nilai itu sebagai True atau False. Satu TRUE di grup membuat hasilnya True.',
      },
      {
        q: 'Apa hasilnya kalau semua FALSE?',
        a: 'False. Kalau semua nilai NULL, atau tidak ada baris, hasilnya NULL, bukan False.',
      },
      {
        q: 'Bisakah ini dijalankan di workspace tantangan?',
        a: 'Tidak. Workspace tantangan tetap DuckDB. Halaman ini dokumentasi Snowflake.',
      },
    ],
  },
  {
    slug: 'abs',
    name: 'ABS',
    category: 'Angka',
    description: 'Membuang tanda minus. Selisih yang negatif jadi angka positif.',
    resultType: 'sama dengan tipe masukannya',
    syntax: `SELECT ABS(-185000) AS nilai;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang tanda minusnya dibuang.',
      },
    ],
    example: { columns: ['nilai'], rows: [['185000']] },
    faq: [
      {
        q: 'Apa hasilnya kalau angkanya sudah positif?',
        a: 'Tetap angka itu. ABS hanya mengubah yang negatif.',
      },
    ],
  },
  {
    slug: 'round',
    name: 'ROUND',
    category: 'Angka',
    description: 'Membulatkan ke angka terdekat. Contoh 185000.4 jatuh ke 185000. CAST membuat selnya bilangan bulat.',
    resultType: 'NUMBER',
    syntax: `SELECT CAST(ROUND(185000.4) AS INTEGER) AS bulat;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang dibulatkan. Argumen kedua, kalau ada, adalah jumlah digit desimal.',
      },
    ],
    example: { columns: ['bulat'], rows: [['185000']] },
    faq: [
      {
        q: 'Kenapa contohnya tidak memakai .5?',
        a: '185000.4 tidak berada di tengah, jadi hasilnya 185000. Pembulatan tepat .5 tidak dipakai di contoh ini.',
      },
    ],
  },
  {
    slug: 'ceil',
    name: 'CEIL',
    category: 'Angka',
    description: 'Membulatkan ke atas, ke bilangan bulat yang tidak lebih kecil dari angkanya.',
    resultType: 'NUMBER',
    syntax: `SELECT CAST(CEIL(10.2) AS INTEGER) AS naik;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang dibulatkan ke atas.',
      },
    ],
    example: { columns: ['naik'], rows: [['11']] },
    faq: [
      {
        q: 'Apa bedanya dengan ROUND?',
        a: 'ROUND ke yang terdekat. CEIL selalu naik, jadi 10.2 jadi 11, bukan 10.',
      },
    ],
  },
  {
    slug: 'floor',
    name: 'FLOOR',
    category: 'Angka',
    description: 'Membulatkan ke bawah, ke bilangan bulat yang tidak lebih besar dari angkanya.',
    resultType: 'NUMBER',
    syntax: `SELECT CAST(FLOOR(10.8) AS INTEGER) AS turun;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang dibulatkan ke bawah.',
      },
    ],
    example: { columns: ['turun'], rows: [['10']] },
    faq: [
      {
        q: 'Apa hasil FLOOR pada angka negatif?',
        a: 'Tetap ke arah yang lebih kecil. Contoh di halaman ini hanya 10.8, hasil setelah CAST adalah 10.',
      },
    ],
  },
  {
    slug: 'lower',
    name: 'LOWER',
    category: 'Teks',
    description: 'Semua huruf jadi kecil. Dipakai sebelum membandingkan nama yang penulisannya campur.',
    resultType: 'VARCHAR',
    syntax: `SELECT LOWER('TokoKulwon') AS huruf;`,
    parameters: [
      {
        name: 'teks',
        type: 'teks',
        note: 'Teks yang hurufnya dikecilkan.',
      },
    ],
    example: { columns: ['huruf'], rows: [['tokokulwon']] },
    faq: [
      {
        q: 'Apakah spasi ikut berubah?',
        a: 'Tidak. Hanya huruf yang berubah. Angka dan spasi tetap.',
      },
    ],
  },
  {
    slug: 'length',
    name: 'LENGTH',
    category: 'Teks',
    description: 'Banyaknya karakter, bukan byte. Spasi ikut terhitung.',
    resultType: 'NUMBER',
    syntax: `SELECT LENGTH('Sari') AS panjang;`,
    parameters: [
      {
        name: 'teks',
        type: 'teks',
        note: 'Teks yang dihitung karakternya.',
      },
    ],
    example: { columns: ['panjang'], rows: [['4']] },
    faq: [
      {
        q: 'Apa bedanya dengan LENGTH MySQL?',
        a: 'Di Snowflake ini jumlah karakter. LENGTH MySQL menghitung byte. Untuk Sari keduanya 4.',
      },
    ],
  },
  {
    slug: 'substr',
    name: 'SUBSTR',
    category: 'Teks',
    description: 'Mengambil potongan teks. Posisi dimulai dari 1. SUBSTRING adalah nama lain untuk fungsi yang sama.',
    resultType: 'VARCHAR',
    syntax: `SELECT SUBSTR('Yogyakarta', 5, 6) AS potongan;`,
    parameters: [
      {
        name: 'teks',
        type: 'teks',
        note: 'Teks sumber.',
      },
      {
        name: 'mulai',
        type: 'integer',
        note: 'Posisi karakter pertama. Nomor 1 adalah karakter paling kiri.',
      },
      {
        name: 'panjang',
        type: 'integer',
        note: 'Berapa karakter yang diambil.',
      },
    ],
    example: { columns: ['potongan'], rows: [['akarta']] },
    faq: [
      {
        q: 'Apa bedanya dengan PostgreSQL?',
        a: 'Hasil contoh ini sama, akarta. PostgreSQL menulis SUBSTRING(teks FROM 5 FOR 6). Snowflake menulis SUBSTR(teks, 5, 6).',
      },
    ],
  },
  {
    slug: 'concat',
    name: 'CONCAT',
    category: 'Teks',
    description: 'Menyambung beberapa teks. Kalau ada satu nilai kosong, seluruh hasilnya kosong.',
    resultType: 'VARCHAR',
    syntax: `SELECT CONCAT('Sari', ' ', 'Wulandari') AS nama;`,
    parameters: [
      {
        name: 'teks',
        type: 'teks',
        note: 'Potongan yang disambung. Boleh lebih dari dua.',
      },
    ],
    example: { columns: ['nama'], rows: [['Sari Wulandari']] },
    faq: [
      {
        q: 'Apa yang terjadi kalau ada NULL?',
        a: 'CONCAT Snowflake mengembalikan NULL. PostgreSQL dan DuckDB melewati NULL dan tetap menyambung sisanya.',
      },
    ],
  },
  {
    slug: 'position',
    name: 'POSITION',
    category: 'Teks',
    description:
      'Posisi awal sebuah teks di dalam teks lain. Nomor dimulai dari 1. Kalau tidak ketemu, hasilnya 0.',
    resultType: 'NUMBER',
    syntax: `SELECT POSITION('Kul' IN 'TokoKulwon') AS posisi;`,
    parameters: [
      {
        name: 'cari',
        type: 'teks',
        note: 'Teks yang dicari, ditulis sebelum IN. Huruf besar dan kecil dibedakan.',
      },
      {
        name: 'teks',
        type: 'teks',
        note: 'Teks tempat mencari.',
      },
    ],
    example: { columns: ['posisi'], rows: [['5']] },
    faq: [
      {
        q: 'Apa bedanya dengan STRPOS BigQuery?',
        a: 'POSITION Snowflake memakai bentuk cari IN sumber, hasilnya 5 untuk Kul di dalam TokoKulwon. STRPOS menulis sumber dulu, baru yang dicari.',
      },
    ],
  },
  {
    slug: 'datediff',
    name: 'DATEDIFF',
    category: 'Tanggal',
    description:
      'Selisih dua tanggal sebagai bilangan bulat. Bagian waktu ditulis dulu, lalu tanggal awal, lalu tanggal akhir. Urutan ini kebalikan dari DATEDIFF MySQL.',
    resultType: 'NUMBER',
    syntax: `SELECT DATEDIFF(day, DATE '2026-10-01', DATE '2026-10-06') AS selisih;`,
    parameters: [
      {
        name: 'bagian',
        type: 'kata kunci',
        note: 'Misalnya day, month, atau year. Bukan teks dalam kutip.',
      },
      {
        name: 'awal',
        type: 'tanggal',
        note: 'Tanggal awal. Argumen kedua.',
      },
      {
        name: 'akhir',
        type: 'tanggal',
        note: 'Tanggal akhir. Argumen ketiga. Hasilnya akhir dikurangi awal.',
      },
    ],
    example: { columns: ['selisih'], rows: [['5']] },
    faq: [
      {
        q: 'Kenapa bukan DATEDIFF(akhir, awal) seperti MySQL?',
        a: 'Di Snowflake bagian waktunya di depan. DATEDIFF(day, DATE \'2026-10-01\', DATE \'2026-10-06\') hasilnya 5. MySQL hanya menghitung hari dan mengurangi argumen kedua dari argumen pertama. AGE PostgreSQL mengembalikan interval, misalnya 5 days, bukan angka 5.',
      },
    ],
  },
  {
    slug: 'extract',
    name: 'EXTRACT',
    category: 'Tanggal',
    description: 'Mengambil satu bagian tanggal sebagai angka. Nama bagian adalah kata kunci, bukan teks dalam kutip.',
    resultType: 'NUMBER',
    syntax: `SELECT EXTRACT(MONTH FROM DATE '2026-10-06') AS bulan;`,
    parameters: [
      {
        name: 'bagian',
        type: 'kata kunci',
        note: 'Misalnya YEAR, MONTH, atau DAY.',
      },
      {
        name: 'nilai',
        type: 'tanggal',
        note: 'Tanggal sumber, ditulis setelah FROM.',
      },
    ],
    example: { columns: ['bulan'], rows: [['10']] },
    faq: [
      {
        q: 'Kenapa MONTH tidak dalam kutip?',
        a: 'EXTRACT memakai kata kunci. DATEDIFF Snowflake juga begitu. DATE_FORMAT MySQL yang memakai teks pola.',
      },
    ],
  },
  {
    slug: 'to_char',
    name: 'TO_CHAR',
    category: 'Tanggal',
    description: 'Mengubah tanggal jadi teks menurut pola. Pola YYYY-MM-DD tidak memakai tanda persen.',
    resultType: 'VARCHAR',
    syntax: `SELECT TO_CHAR(DATE '2026-10-06', 'YYYY-MM-DD') AS teks;`,
    parameters: [
      {
        name: 'nilai',
        type: 'tanggal',
        note: 'Tanggal yang diubah jadi teks. Argumen pertama.',
      },
      {
        name: 'pola',
        type: 'teks',
        note: 'YYYY tahun, MM bulan, DD tanggal.',
      },
    ],
    example: { columns: ['teks'], rows: [['2026-10-06']] },
    faq: [
      {
        q: 'Apa bedanya dengan FORMAT_DATE BigQuery?',
        a: 'TO_CHAR menulis tanggal dulu, lalu pola YYYY-MM-DD. FORMAT_DATE menulis pola %Y-%m-%d dulu, baru tanggalnya.',
      },
    ],
  },
  {
    slug: 'coalesce',
    name: 'COALESCE',
    category: 'Ubah nilai',
    description: 'Mengambil nilai pertama yang tidak kosong. Boleh lebih dari dua nilai.',
    resultType: 'sama dengan nilai yang terpilih',
    syntax: `SELECT COALESCE(NULL, 'belum diisi') AS kota;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Daftar nilai, dari kiri ke kanan. Yang pertama tidak kosong yang dipakai.',
      },
    ],
    example: { columns: ['kota'], rows: [['belum diisi']] },
    faq: [
      {
        q: 'Apa bedanya kosong dengan teks kosong?',
        a: 'NULL belum terisi. Teks \'\' sudah terisi, meski tidak ada karakternya, jadi COALESCE tidak melewatinya.',
      },
    ],
  },
  {
    slug: 'nullif',
    name: 'NULLIF',
    category: 'Ubah nilai',
    description: 'Mengembalikan kosong kalau dua nilai sama. Kalau beda, nilai pertama yang dipakai.',
    resultType: 'sama dengan nilai pertama',
    syntax: `SELECT NULLIF('Medan', 'Medan') AS kota;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Nilai yang dikembalikan kalau tidak sama dengan pembanding.',
      },
      {
        name: 'pembanding',
        type: 'ekspresi',
        note: 'Kalau sama dengan nilai, hasilnya kosong.',
      },
    ],
    example: { columns: ['kota'], rows: [['NULL']] },
    faq: [
      {
        q: 'Kenapa tabelnya menulis NULL?',
        a: 'Itu nilai kosong, bukan teks empat huruf.',
      },
    ],
  },
  {
    slug: 'greatest',
    name: 'GREATEST',
    category: 'Ubah nilai',
    description: 'Nilai paling besar dari beberapa angka pada baris yang sama. Kalau ada satu nilai kosong, hasilnya kosong.',
    resultType: 'sama dengan tipe bersama',
    syntax: `SELECT GREATEST(95000, 420000, 150000) AS terbesar;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Dua nilai atau lebih pada baris yang sama.',
      },
    ],
    example: { columns: ['terbesar'], rows: [['420000']] },
    faq: [
      {
        q: 'Bagaimana kalau ada NULL?',
        a: 'GREATEST Snowflake mengembalikan NULL. Ada varian GREATEST_IGNORE_NULLS kalau NULL harus dilewati, seperti perilaku PostgreSQL.',
      },
    ],
  },
  {
    slug: 'least',
    name: 'LEAST',
    category: 'Ubah nilai',
    description: 'Nilai paling kecil dari beberapa angka pada baris yang sama. Kalau ada satu nilai kosong, hasilnya kosong.',
    resultType: 'sama dengan tipe bersama',
    syntax: `SELECT LEAST(95000, 420000, 150000) AS terkecil;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Dua nilai atau lebih pada baris yang sama.',
      },
    ],
    example: { columns: ['terkecil'], rows: [['95000']] },
    faq: [
      {
        q: 'Apa bedanya dengan MIN?',
        a: 'LEAST memilih di satu baris. MIN merangkum satu kolom dari banyak baris.',
      },
    ],
  },
  {
    slug: 'cast',
    name: 'CAST',
    category: 'Ubah nilai',
    description: 'Mengubah tipe. Teks yang bukan angka membuat query gagal.',
    resultType: 'INTEGER',
    syntax: `SELECT CAST('76000' AS INTEGER) AS harga;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Nilai yang diubah tipenya.',
      },
      {
        name: 'tipe',
        type: 'nama tipe',
        note: 'Tipe tujuan, ditulis setelah AS. Bukan teks dalam kutip.',
      },
    ],
    example: { columns: ['harga'], rows: [['76000']] },
    faq: [
      {
        q: 'Apa bedanya dengan teks 76000?',
        a: 'Tulisan dalam kutip masih teks. CAST mengubahnya menjadi angka supaya bisa dijumlah.',
      },
    ],
  },
  {
    slug: 'ai_embed',
    name: 'AI_EMBED',
    category: 'Teks',
    description:
      'Fungsi embedding Cortex yang sekarang dipakai. Mengubah teks jadi vektor. Model snowflake-arctic-embed-m-v1.5 menghasilkan 768 angka. Contoh di bawah tidak menuliskan vektornya, hanya menghitung panjangnya.',
    resultType: 'VECTOR',
    syntax: `SELECT ARRAY_SIZE(TO_ARRAY(AI_EMBED('snowflake-arctic-embed-m-v1.5', 'hello world'))) AS dimensi;`,
    parameters: [
      {
        name: 'model',
        type: 'teks',
        note: 'Nama model. Contoh ini snowflake-arctic-embed-m-v1.5. Dokumen Snowflake juga menyebut model lain, termasuk yang 1024 dimensi.',
      },
      {
        name: 'input',
        type: 'teks atau gambar',
        note: 'Teks yang diubah jadi vektor. Untuk gambar, dokumen Snowflake memakai objek FILE dan model voyage-multimodal-3.',
      },
    ],
    example: { columns: ['dimensi'], rows: [['768']] },
    faq: [
      {
        q: 'Kenapa hasilnya 768, bukan deretan desimal?',
        a: 'AI_EMBED mengembalikan VECTOR, dan angkanya panjang. TO_ARRAY mengubah vektor jadi array. ARRAY_SIZE menghitung elemennya. Dokumen Snowflake mencatat model snowflake-arctic-embed-m-v1.5 sebanyak 768 dimensi.',
      },
      {
        q: 'Apa nama Cortex yang lebih lama?',
        a: 'SNOWFLAKE.CORTEX.EMBED_TEXT_768(model, teks). Dokumen Snowflake masih menuliskan tanda tangan itu untuk teks bahasa Inggris dan hasil 768 dimensi, lalu menandai fungsi itu usang pada akhir 2026. Untuk kode baru, pakai AI_EMBED.',
      },
      {
        q: 'Bisakah ini dijalankan di workspace tantangan?',
        a: 'Tidak. Workspace tantangan tetap DuckDB. Halaman ini dokumentasi Snowflake Cortex.',
      },
    ],
  },
]

export const DUCKDB_FUNCTIONS: readonly PgFunction[] = [
  {
    slug: 'count',
    name: 'COUNT',
    category: 'Agregasi',
    description:
      'Menghitung baris. Bintang menghitung semua baris, termasuk yang kolomnya kosong. Kalau yang dihitung satu kolom, baris kosong pada kolom itu dilewati.',
    resultType: 'BIGINT',
    syntax: `SELECT COUNT(*) AS jumlah
FROM (VALUES (1), (2), (3), (4), (5), (6)) AS pelanggan(id);`,
    parameters: [
      {
        name: 'ekspresi',
        type: 'apa pun',
        note: 'Kolom yang dihitung, atau bintang untuk semua baris.',
      },
    ],
    example: { columns: ['jumlah'], rows: [['6']] },
    faq: [
      {
        q: 'Kenapa COUNT(kota) bisa lebih kecil dari jumlah baris?',
        a: 'Kota yang belum diisi tidak masuk hitungan. COUNT(*) tetap menghitung barisnya.',
      },
    ],
  },
  {
    slug: 'sum',
    name: 'SUM',
    category: 'Agregasi',
    description: 'Menjumlahkan angka. Kosong dilewati. Untuk tiga bilangan bulat di contoh ini, hasilnya 700000 dan tipenya HUGEINT.',
    resultType: 'HUGEINT',
    syntax: `SELECT SUM(total_belanja) AS jumlah
FROM (VALUES (185000), (420000), (95000)) AS pelanggan(total_belanja);`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Kolom angka yang dijumlahkan. Kosong tidak ikut.',
      },
    ],
    example: { columns: ['jumlah'], rows: [['700000']] },
    faq: [
      {
        q: 'Kenapa tipenya HUGEINT, bukan INTEGER?',
        a: 'SUM DuckDB melebar supaya jumlah yang besar tidak terpotong. Nilainya untuk contoh ini tetap 700000.',
      },
    ],
  },
  {
    slug: 'avg',
    name: 'AVG',
    category: 'Agregasi',
    description:
      'Rata-rata angka. Kosong dilewati. Contoh ini mengubah hasilnya jadi INTEGER karena rata-ratanya habis.',
    resultType: 'DOUBLE',
    syntax: `SELECT CAST(AVG(nilai) AS INTEGER) AS rata
FROM (VALUES (100000), (300000)) AS pelanggan(nilai);`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Kolom angka yang dirata-rata. Kosong tidak ikut.',
      },
    ],
    example: { columns: ['rata'], rows: [['200000']] },
    faq: [
      {
        q: 'Kenapa ada CAST?',
        a: 'AVG bisa mengembalikan desimal. CAST ke INTEGER pada rata-rata yang habis menghasilkan 200000.',
      },
    ],
  },
  {
    slug: 'min',
    name: 'MIN',
    category: 'Agregasi',
    description: 'Nilai paling kecil pada satu kolom, dari banyak baris. Kosong dilewati.',
    resultType: 'INTEGER',
    syntax: `SELECT MIN(total_belanja) AS terkecil
FROM (VALUES (185000), (420000), (95000)) AS pelanggan(total_belanja);`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Kolom yang dicari nilai paling kecilnya.',
      },
    ],
    example: { columns: ['terkecil'], rows: [['95000']] },
    faq: [
      {
        q: 'Apa bedanya dengan LEAST?',
        a: 'MIN membandingkan banyak baris pada satu kolom. LEAST membandingkan beberapa nilai pada baris yang sama.',
      },
    ],
  },
  {
    slug: 'max',
    name: 'MAX',
    category: 'Agregasi',
    description: 'Nilai paling besar pada satu kolom, dari banyak baris. Kosong dilewati.',
    resultType: 'INTEGER',
    syntax: `SELECT MAX(total_belanja) AS terbesar
FROM (VALUES (185000), (420000), (95000)) AS pelanggan(total_belanja);`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Kolom yang dicari nilai paling besarnya.',
      },
    ],
    example: { columns: ['terbesar'], rows: [['420000']] },
    faq: [
      {
        q: 'Apa bedanya dengan GREATEST?',
        a: 'MAX membandingkan banyak baris pada satu kolom. GREATEST membandingkan beberapa nilai pada baris yang sama.',
      },
    ],
  },
  {
    slug: 'string_agg',
    name: 'STRING_AGG',
    category: 'Agregasi',
    description:
      'Menggabungkan teks dari banyak baris. Urutan di dalam fungsi yang menentukan susunan, bukan urutan VALUES mentah.',
    resultType: 'VARCHAR',
    syntax: `SELECT STRING_AGG(kota, ', ' ORDER BY kota) AS daftar
FROM (VALUES ('Jakarta'), ('Bandung'), ('Medan')) AS pelanggan(kota);`,
    parameters: [
      {
        name: 'nilai',
        type: 'teks',
        note: 'Teks yang digabung. Kosong dilewati.',
      },
      {
        name: 'pemisah',
        type: 'teks',
        note: 'Teks di antara potongan. ORDER BY di dalam fungsi mengatur urutan.',
      },
    ],
    example: { columns: ['daftar'], rows: [['Bandung, Jakarta, Medan']] },
    faq: [
      {
        q: 'Apa bedanya dengan LISTAGG Snowflake?',
        a: 'Hasil contoh ini sama. Snowflake menulis LISTAGG(kota, \', \') WITHIN GROUP (ORDER BY kota). DuckDB menulis ORDER BY di dalam STRING_AGG.',
      },
    ],
  },
  {
    slug: 'abs',
    name: 'ABS',
    category: 'Angka',
    description: 'Membuang tanda minus. Selisih yang negatif jadi angka positif.',
    resultType: 'INTEGER',
    syntax: `SELECT ABS(-185000) AS nilai;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang tanda minusnya dibuang.',
      },
    ],
    example: { columns: ['nilai'], rows: [['185000']] },
    faq: [
      {
        q: 'Apa hasilnya kalau angkanya sudah positif?',
        a: 'Tetap angka itu. ABS hanya mengubah yang negatif.',
      },
    ],
  },
  {
    slug: 'round',
    name: 'ROUND',
    category: 'Angka',
    description: 'Membulatkan ke angka terdekat. Contoh 185000.4 menjadi 185000 setelah CAST ke INTEGER.',
    resultType: 'sama dengan tipe masukannya',
    syntax: `SELECT CAST(ROUND(185000.4) AS INTEGER) AS bulat;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang dibulatkan. Argumen kedua, kalau ada, adalah jumlah digit desimal.',
      },
    ],
    example: { columns: ['bulat'], rows: [['185000']] },
    faq: [
      {
        q: 'Kenapa ada CAST?',
        a: 'ROUND pada desimal bisa tetap bertipe desimal. CAST ke INTEGER membuat sel contoh ini 185000.',
      },
    ],
  },
  {
    slug: 'ceil',
    name: 'CEIL',
    category: 'Angka',
    description: 'Membulatkan ke atas. Contoh ini mengubah hasilnya jadi INTEGER.',
    resultType: 'sama dengan tipe masukannya',
    syntax: `SELECT CAST(CEIL(10.2) AS INTEGER) AS naik;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang dibulatkan ke atas.',
      },
    ],
    example: { columns: ['naik'], rows: [['11']] },
    faq: [
      {
        q: 'Apa bedanya dengan ROUND?',
        a: 'ROUND ke yang terdekat. CEIL selalu naik, jadi 10.2 jadi 11, bukan 10.',
      },
    ],
  },
  {
    slug: 'floor',
    name: 'FLOOR',
    category: 'Angka',
    description: 'Membulatkan ke bawah. Contoh ini mengubah hasilnya jadi INTEGER.',
    resultType: 'sama dengan tipe masukannya',
    syntax: `SELECT CAST(FLOOR(10.8) AS INTEGER) AS turun;`,
    parameters: [
      {
        name: 'angka',
        type: 'numeric',
        note: 'Angka yang dibulatkan ke bawah.',
      },
    ],
    example: { columns: ['turun'], rows: [['10']] },
    faq: [
      {
        q: 'Apa hasil FLOOR pada angka negatif?',
        a: 'Tetap ke arah yang lebih kecil. Contoh di halaman ini hanya 10.8, hasil setelah CAST adalah 10.',
      },
    ],
  },
  {
    slug: 'lower',
    name: 'LOWER',
    category: 'Teks',
    description: 'Semua huruf jadi kecil. Dipakai sebelum membandingkan nama yang penulisannya campur.',
    resultType: 'VARCHAR',
    syntax: `SELECT LOWER('TokoKulwon') AS huruf;`,
    parameters: [
      {
        name: 'teks',
        type: 'teks',
        note: 'Teks yang hurufnya dikecilkan.',
      },
    ],
    example: { columns: ['huruf'], rows: [['tokokulwon']] },
    faq: [
      {
        q: 'Apakah spasi ikut berubah?',
        a: 'Tidak. Hanya huruf yang berubah. Angka dan spasi tetap.',
      },
    ],
  },
  {
    slug: 'length',
    name: 'LENGTH',
    category: 'Teks',
    description: 'Banyaknya karakter, bukan byte. Spasi ikut terhitung.',
    resultType: 'BIGINT',
    syntax: `SELECT LENGTH('Sari') AS panjang;`,
    parameters: [
      {
        name: 'teks',
        type: 'teks',
        note: 'Teks yang dihitung karakternya.',
      },
    ],
    example: { columns: ['panjang'], rows: [['4']] },
    faq: [
      {
        q: 'Apa bedanya dengan LENGTH MySQL?',
        a: 'DuckDB menghitung karakter, sama seperti PostgreSQL. LENGTH MySQL menghitung byte.',
      },
    ],
  },
  {
    slug: 'substring',
    name: 'SUBSTRING',
    category: 'Teks',
    description: 'Mengambil potongan teks dari posisi tertentu. Posisi dimulai dari 1, bukan 0.',
    resultType: 'VARCHAR',
    syntax: `SELECT SUBSTRING('Yogyakarta' FROM 5 FOR 6) AS potongan;`,
    parameters: [
      {
        name: 'teks',
        type: 'teks',
        note: 'Teks sumber.',
      },
      {
        name: 'mulai',
        type: 'integer',
        note: 'Posisi karakter pertama. Nomor 1 adalah karakter paling kiri.',
      },
      {
        name: 'panjang',
        type: 'integer',
        note: 'Berapa karakter yang diambil.',
      },
    ],
    example: { columns: ['potongan'], rows: [['akarta']] },
    faq: [
      {
        q: 'Apa bedanya dengan SUBSTR BigQuery?',
        a: 'Hasil contoh ini sama, akarta. BigQuery menulis SUBSTR(\'Yogyakarta\', 5, 6). DuckDB menerima bentuk FROM ... FOR.',
      },
    ],
  },
  {
    slug: 'concat',
    name: 'CONCAT',
    category: 'Teks',
    description: 'Menyambung beberapa teks. Nilai kosong dilewati, tidak membuat seluruh hasil jadi kosong.',
    resultType: 'VARCHAR',
    syntax: `SELECT CONCAT('Sari', ' ', 'Wulandari') AS nama;`,
    parameters: [
      {
        name: 'teks',
        type: 'teks',
        note: 'Potongan yang disambung. Boleh lebih dari dua. Kosong dilewati.',
      },
    ],
    example: { columns: ['nama'], rows: [['Sari Wulandari']] },
    faq: [
      {
        q: 'Apa bedanya dengan CONCAT MySQL?',
        a: 'DuckDB melewati NULL. CONCAT(\'Sari\', NULL, \'Wulandari\') hasilnya SariWulandari. Di MySQL, BigQuery, dan Snowflake, satu NULL membuat seluruh hasil NULL.',
      },
    ],
  },
  {
    slug: 'position',
    name: 'POSITION',
    category: 'Teks',
    description:
      'Posisi awal sebuah teks di dalam teks lain. Nomor dimulai dari 1. Kalau tidak ketemu, hasilnya 0.',
    resultType: 'BIGINT',
    syntax: `SELECT POSITION('Kul' IN 'TokoKulwon') AS posisi;`,
    parameters: [
      {
        name: 'cari',
        type: 'teks',
        note: 'Teks yang dicari, ditulis sebelum IN. Huruf besar dan kecil dibedakan.',
      },
      {
        name: 'teks',
        type: 'teks',
        note: 'Teks tempat mencari.',
      },
    ],
    example: { columns: ['posisi'], rows: [['5']] },
    faq: [
      {
        q: 'Apa bedanya dengan STRPOS BigQuery?',
        a: 'POSITION menulis yang dicari dulu, lalu IN, lalu sumbernya. STRPOS menulis sumber dulu. Keduanya mengembalikan 5 untuk Kul di dalam TokoKulwon, dan 0 kalau tidak ketemu.',
      },
    ],
  },
  {
    slug: 'date_diff',
    name: 'DATE_DIFF',
    category: 'Tanggal',
    description:
      'Selisih dua tanggal sebagai bilangan bulat untuk satu bagian. Bagian ditulis sebagai teks, lalu tanggal awal, lalu tanggal akhir. Bukan interval seperti AGE PostgreSQL. datediff adalah nama lain untuk fungsi yang sama.',
    resultType: 'BIGINT',
    syntax: `SELECT DATE_DIFF('day', DATE '2026-10-01', DATE '2026-10-06') AS selisih;`,
    parameters: [
      {
        name: 'bagian',
        type: 'teks',
        note: 'Misalnya \'day\', \'month\', atau \'year\'. Dalam kutip.',
      },
      {
        name: 'awal',
        type: 'tanggal',
        note: 'Tanggal awal. Argumen kedua.',
      },
      {
        name: 'akhir',
        type: 'tanggal',
        note: 'Tanggal akhir. Argumen ketiga.',
      },
    ],
    example: { columns: ['selisih'], rows: [['5']] },
    faq: [
      {
        q: 'Apa bedanya dengan AGE PostgreSQL dan DATEDIFF MySQL?',
        a: 'DATE_DIFF mengembalikan angka 5 untuk hari. AGE PostgreSQL mengembalikan interval, misalnya 5 days. DATEDIFF MySQL hanya menghitung hari dan menulis tanggal akhir dulu. Di DuckDB tanggal awal yang ditulis lebih dulu.',
      },
    ],
  },
  {
    slug: 'date_sub',
    name: 'DATE_SUB',
    category: 'Tanggal',
    description:
      'Jumlah bagian yang utuh di antara dua tanggal, bukan jumlah batas bagian. Untuk bulan, ini bisa lebih kecil dari DATE_DIFF.',
    resultType: 'BIGINT',
    syntax: `SELECT DATE_SUB('month', DATE '1992-09-15', DATE '1992-11-14') AS penuh;`,
    parameters: [
      {
        name: 'bagian',
        type: 'teks',
        note: 'Misalnya \'month\' atau \'day\'. Dalam kutip.',
      },
      {
        name: 'awal',
        type: 'tanggal',
        note: 'Tanggal awal.',
      },
      {
        name: 'akhir',
        type: 'tanggal',
        note: 'Tanggal akhir.',
      },
    ],
    example: { columns: ['penuh'], rows: [['1']] },
    faq: [
      {
        q: 'Kenapa DATE_DIFF untuk tanggal yang sama hasilnya 2?',
        a: 'DATE_DIFF(\'month\', DATE \'1992-09-15\', DATE \'1992-11-14\') menghitung batas bulan, hasilnya 2. DATE_SUB menghitung bulan yang utuh, hasilnya 1. Untuk \'day\' pada 1 Oktober sampai 6 Oktober, keduanya 5.',
      },
    ],
  },
  {
    slug: 'extract',
    name: 'EXTRACT',
    category: 'Tanggal',
    description: 'Mengambil satu bagian tanggal sebagai bilangan bulat. Nama bagian adalah kata kunci, bukan teks dalam kutip.',
    resultType: 'BIGINT',
    syntax: `SELECT EXTRACT(MONTH FROM DATE '2026-10-06') AS bulan;`,
    parameters: [
      {
        name: 'bagian',
        type: 'kata kunci',
        note: 'Misalnya YEAR, MONTH, atau DAY.',
      },
      {
        name: 'nilai',
        type: 'tanggal',
        note: 'Tanggal sumber, ditulis setelah FROM.',
      },
    ],
    example: { columns: ['bulan'], rows: [['10']] },
    faq: [
      {
        q: 'Kenapa MONTH tidak dalam kutip?',
        a: 'EXTRACT memakai kata kunci. DATE_DIFF DuckDB yang menulis nama bagian sebagai teks, misalnya \'day\'.',
      },
    ],
  },
  {
    slug: 'strftime',
    name: 'STRFTIME',
    category: 'Tanggal',
    description:
      'Mengubah tanggal jadi teks menurut pola. Polanya memakai persen dan ditulis setelah tanggalnya.',
    resultType: 'VARCHAR',
    syntax: `SELECT STRFTIME(DATE '2026-10-06', '%Y-%m-%d') AS teks;`,
    parameters: [
      {
        name: 'nilai',
        type: 'tanggal',
        note: 'Tanggal yang diubah jadi teks. Argumen pertama.',
      },
      {
        name: 'pola',
        type: 'teks',
        note: '%Y tahun, %m bulan, %d tanggal.',
      },
    ],
    example: { columns: ['teks'], rows: [['2026-10-06']] },
    faq: [
      {
        q: 'Apa bedanya dengan TO_CHAR PostgreSQL?',
        a: 'STRFTIME memakai %Y-%m-%d. TO_CHAR memakai YYYY-MM-DD. Keduanya menulis tanggal dulu, baru polanya. FORMAT_DATE BigQuery membalik urutan itu.',
      },
    ],
  },
  {
    slug: 'coalesce',
    name: 'COALESCE',
    category: 'Ubah nilai',
    description: 'Mengambil nilai pertama yang tidak kosong. Boleh lebih dari dua nilai.',
    resultType: 'sama dengan nilai yang terpilih',
    syntax: `SELECT COALESCE(NULL, 'belum diisi') AS kota;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Daftar nilai, dari kiri ke kanan. Yang pertama tidak kosong yang dipakai.',
      },
    ],
    example: { columns: ['kota'], rows: [['belum diisi']] },
    faq: [
      {
        q: 'Apa bedanya kosong dengan teks kosong?',
        a: 'NULL belum terisi. Teks \'\' sudah terisi, meski tidak ada karakternya, jadi COALESCE tidak melewatinya.',
      },
    ],
  },
  {
    slug: 'nullif',
    name: 'NULLIF',
    category: 'Ubah nilai',
    description: 'Mengembalikan kosong kalau dua nilai sama. Kalau beda, nilai pertama yang dipakai.',
    resultType: 'sama dengan nilai pertama',
    syntax: `SELECT NULLIF('Medan', 'Medan') AS kota;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Nilai yang dikembalikan kalau tidak sama dengan pembanding.',
      },
      {
        name: 'pembanding',
        type: 'ekspresi',
        note: 'Kalau sama dengan nilai, hasilnya kosong.',
      },
    ],
    example: { columns: ['kota'], rows: [['NULL']] },
    faq: [
      {
        q: 'Kenapa tabelnya menulis NULL?',
        a: 'Itu nilai kosong, bukan teks empat huruf.',
      },
    ],
  },
  {
    slug: 'greatest',
    name: 'GREATEST',
    category: 'Ubah nilai',
    description: 'Nilai paling besar dari beberapa angka pada baris yang sama. Kosong dilewati kalau masih ada nilai lain.',
    resultType: 'INTEGER',
    syntax: `SELECT GREATEST(95000, 420000, 150000) AS terbesar;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Dua nilai atau lebih pada baris yang sama. Kosong diabaikan kalau masih ada nilai lain.',
      },
    ],
    example: { columns: ['terbesar'], rows: [['420000']] },
    faq: [
      {
        q: 'Apa bedanya dengan MySQL?',
        a: 'DuckDB melewati NULL. GREATEST(1, NULL, 3) hasilnya 3. Di MySQL, BigQuery, dan Snowflake, satu NULL membuat hasilnya NULL.',
      },
    ],
  },
  {
    slug: 'least',
    name: 'LEAST',
    category: 'Ubah nilai',
    description: 'Nilai paling kecil dari beberapa angka pada baris yang sama. Kosong dilewati kalau masih ada nilai lain.',
    resultType: 'INTEGER',
    syntax: `SELECT LEAST(95000, 420000, 150000) AS terkecil;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Dua nilai atau lebih pada baris yang sama. Kosong diabaikan kalau masih ada nilai lain.',
      },
    ],
    example: { columns: ['terkecil'], rows: [['95000']] },
    faq: [
      {
        q: 'Apa bedanya dengan MIN?',
        a: 'LEAST memilih di satu baris. MIN merangkum satu kolom dari banyak baris.',
      },
    ],
  },
  {
    slug: 'cast',
    name: 'CAST',
    category: 'Ubah nilai',
    description: 'Mengubah tipe. Teks yang bukan angka membuat query gagal.',
    resultType: 'INTEGER',
    syntax: `SELECT CAST('76000' AS INTEGER) AS harga;`,
    parameters: [
      {
        name: 'nilai',
        type: 'ekspresi',
        note: 'Nilai yang diubah tipenya.',
      },
      {
        name: 'tipe',
        type: 'nama tipe',
        note: 'Tipe tujuan, ditulis setelah AS. Bukan teks dalam kutip.',
      },
    ],
    example: { columns: ['harga'], rows: [['76000']] },
    faq: [
      {
        q: 'Apa bedanya dengan teks 76000?',
        a: 'Tulisan dalam kutip masih teks. CAST mengubahnya menjadi INTEGER supaya bisa dijumlah.',
      },
    ],
  },
]

const FUNCTIONS: Record<DialectId, readonly PgFunction[]> = {
  postgresql: PG_FUNCTIONS,
  mysql: MYSQL_FUNCTIONS,
  bigquery: BIGQUERY_FUNCTIONS,
  snowflake: SNOWFLAKE_FUNCTIONS,
  duckdb: DUCKDB_FUNCTIONS,
}

export function resolveDialect(raw: string | undefined): Dialect | null {
  return DIALECTS.find((item) => item.id === raw) ?? null
}

export function pgCategory(raw: string | null): PgCategory | null {
  const value = raw?.trim() ?? ''
  return PG_CATEGORIES.find((item) => item === value) ?? null
}

export function listFunctions(dialect: DialectId, category: string | null): readonly PgFunction[] {
  const rows = FUNCTIONS[dialect]
  const known = pgCategory(category)
  if (!known) return rows
  return rows.filter((item) => item.category === known)
}

export function functionBySlug(dialect: DialectId, slug: string): PgFunction | undefined {
  return FUNCTIONS[dialect].find((item) => item.slug === slug)
}

export type EquivalentRef = {
  dialect: DialectId
  label: string
  slug: string
  name: string
  path: string
}

const EQUIVALENT_GROUPS: readonly (readonly { dialect: DialectId; slug: string }[])[] = [
  [
    { dialect: 'postgresql', slug: 'count' },
    { dialect: 'mysql', slug: 'count' },
    { dialect: 'bigquery', slug: 'count' },
    { dialect: 'snowflake', slug: 'count' },
    { dialect: 'duckdb', slug: 'count' },
  ],
  [
    { dialect: 'postgresql', slug: 'sum' },
    { dialect: 'mysql', slug: 'sum' },
    { dialect: 'bigquery', slug: 'sum' },
    { dialect: 'snowflake', slug: 'sum' },
    { dialect: 'duckdb', slug: 'sum' },
  ],
  [
    { dialect: 'postgresql', slug: 'avg' },
    { dialect: 'mysql', slug: 'avg' },
    { dialect: 'bigquery', slug: 'avg' },
    { dialect: 'snowflake', slug: 'avg' },
    { dialect: 'duckdb', slug: 'avg' },
  ],
  [
    { dialect: 'postgresql', slug: 'min' },
    { dialect: 'mysql', slug: 'min' },
    { dialect: 'bigquery', slug: 'min' },
    { dialect: 'snowflake', slug: 'min' },
    { dialect: 'duckdb', slug: 'min' },
  ],
  [
    { dialect: 'postgresql', slug: 'max' },
    { dialect: 'mysql', slug: 'max' },
    { dialect: 'bigquery', slug: 'max' },
    { dialect: 'snowflake', slug: 'max' },
    { dialect: 'duckdb', slug: 'max' },
  ],
  [
    { dialect: 'postgresql', slug: 'string_agg' },
    { dialect: 'mysql', slug: 'group_concat' },
    { dialect: 'bigquery', slug: 'string_agg' },
    { dialect: 'snowflake', slug: 'listagg' },
    { dialect: 'duckdb', slug: 'string_agg' },
  ],
  [
    { dialect: 'postgresql', slug: 'abs' },
    { dialect: 'mysql', slug: 'abs' },
    { dialect: 'bigquery', slug: 'abs' },
    { dialect: 'snowflake', slug: 'abs' },
    { dialect: 'duckdb', slug: 'abs' },
  ],
  [
    { dialect: 'postgresql', slug: 'round' },
    { dialect: 'mysql', slug: 'round' },
    { dialect: 'bigquery', slug: 'round' },
    { dialect: 'snowflake', slug: 'round' },
    { dialect: 'duckdb', slug: 'round' },
  ],
  [
    { dialect: 'postgresql', slug: 'ceil' },
    { dialect: 'mysql', slug: 'ceil' },
    { dialect: 'bigquery', slug: 'ceil' },
    { dialect: 'snowflake', slug: 'ceil' },
    { dialect: 'duckdb', slug: 'ceil' },
  ],
  [
    { dialect: 'postgresql', slug: 'floor' },
    { dialect: 'mysql', slug: 'floor' },
    { dialect: 'bigquery', slug: 'floor' },
    { dialect: 'snowflake', slug: 'floor' },
    { dialect: 'duckdb', slug: 'floor' },
  ],
  [
    { dialect: 'postgresql', slug: 'lower' },
    { dialect: 'mysql', slug: 'lower' },
    { dialect: 'bigquery', slug: 'lower' },
    { dialect: 'snowflake', slug: 'lower' },
    { dialect: 'duckdb', slug: 'lower' },
  ],
  [
    { dialect: 'postgresql', slug: 'length' },
    { dialect: 'mysql', slug: 'char_length' },
    { dialect: 'bigquery', slug: 'length' },
    { dialect: 'snowflake', slug: 'length' },
    { dialect: 'duckdb', slug: 'length' },
  ],
  [
    { dialect: 'postgresql', slug: 'substring' },
    { dialect: 'mysql', slug: 'substring' },
    { dialect: 'bigquery', slug: 'substr' },
    { dialect: 'snowflake', slug: 'substr' },
    { dialect: 'duckdb', slug: 'substring' },
  ],
  [
    { dialect: 'postgresql', slug: 'concat' },
    { dialect: 'mysql', slug: 'concat' },
    { dialect: 'bigquery', slug: 'concat' },
    { dialect: 'snowflake', slug: 'concat' },
    { dialect: 'duckdb', slug: 'concat' },
  ],
  [
    { dialect: 'postgresql', slug: 'position' },
    { dialect: 'mysql', slug: 'locate' },
    { dialect: 'bigquery', slug: 'strpos' },
    { dialect: 'snowflake', slug: 'position' },
    { dialect: 'duckdb', slug: 'position' },
  ],
  [
    { dialect: 'postgresql', slug: 'age' },
    { dialect: 'mysql', slug: 'datediff' },
    { dialect: 'bigquery', slug: 'date_diff' },
    { dialect: 'snowflake', slug: 'datediff' },
    { dialect: 'duckdb', slug: 'date_diff' },
  ],
  [
    { dialect: 'postgresql', slug: 'extract' },
    { dialect: 'mysql', slug: 'extract' },
    { dialect: 'bigquery', slug: 'extract' },
    { dialect: 'snowflake', slug: 'extract' },
    { dialect: 'duckdb', slug: 'extract' },
  ],
  [
    { dialect: 'postgresql', slug: 'to_char' },
    { dialect: 'mysql', slug: 'date_format' },
    { dialect: 'bigquery', slug: 'format_date' },
    { dialect: 'snowflake', slug: 'to_char' },
    { dialect: 'duckdb', slug: 'strftime' },
  ],
  [
    { dialect: 'postgresql', slug: 'coalesce' },
    { dialect: 'mysql', slug: 'coalesce' },
    { dialect: 'bigquery', slug: 'coalesce' },
    { dialect: 'snowflake', slug: 'coalesce' },
    { dialect: 'duckdb', slug: 'coalesce' },
  ],
  [
    { dialect: 'postgresql', slug: 'nullif' },
    { dialect: 'mysql', slug: 'nullif' },
    { dialect: 'bigquery', slug: 'nullif' },
    { dialect: 'snowflake', slug: 'nullif' },
    { dialect: 'duckdb', slug: 'nullif' },
  ],
  [
    { dialect: 'postgresql', slug: 'greatest' },
    { dialect: 'mysql', slug: 'greatest' },
    { dialect: 'bigquery', slug: 'greatest' },
    { dialect: 'snowflake', slug: 'greatest' },
    { dialect: 'duckdb', slug: 'greatest' },
  ],
  [
    { dialect: 'postgresql', slug: 'least' },
    { dialect: 'mysql', slug: 'least' },
    { dialect: 'bigquery', slug: 'least' },
    { dialect: 'snowflake', slug: 'least' },
    { dialect: 'duckdb', slug: 'least' },
  ],
  [
    { dialect: 'postgresql', slug: 'cast' },
    { dialect: 'mysql', slug: 'cast' },
    { dialect: 'bigquery', slug: 'cast' },
    { dialect: 'snowflake', slug: 'cast' },
    { dialect: 'duckdb', slug: 'cast' },
  ],
]

export function equivalentsFor(dialect: DialectId, slug: string): EquivalentRef[] {
  const group = EQUIVALENT_GROUPS.find((items) =>
    items.some((item) => item.dialect === dialect && item.slug === slug),
  )
  if (!group) return []
  const links: EquivalentRef[] = []
  for (const item of group) {
    if (item.dialect === dialect && item.slug === slug) continue
    const meta = DIALECTS.find((entry) => entry.id === item.dialect)
    const fn = meta ? functionBySlug(item.dialect, item.slug) : undefined
    if (!meta || !fn) continue
    links.push({
      dialect: item.dialect,
      label: meta.label,
      slug: fn.slug,
      name: fn.name,
      path: `${meta.path}/${fn.slug}`,
    })
  }
  return links
}

