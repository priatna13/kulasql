type CourseLesson = {
  topic: string
  slug: string
  lead: string
}

type CourseStep = {
  slug: string
  bagian: string
  lead: string
}

export const COURSE_PATH = '/kulasql/belajar'

export const JENJANG: readonly {
  materi: 1 | 2 | 3
  topics: readonly string[]
  lessons: readonly CourseLesson[]
}[] = [
  {
    materi: 1,
    topics: ['SELECT', 'WHERE', 'JOIN', 'agregasi'],
    lessons: [
      {
        topic: 'SELECT',
        slug: 'hari-pertama-di-tokokulwon',
        lead: 'Tampilkan semua kolom pelanggan, urut dari id kecil.',
      },
      {
        topic: 'SELECT',
        slug: 'laporan-untuk-tim-marketing',
        lead: 'Ambil nama dan kota saja, untuk tim marketing.',
      },
      {
        topic: 'WHERE',
        slug: 'mencari-pelanggan-dari-jakarta',
        lead: 'Saring pelanggan yang kotanya Jakarta.',
      },
      {
        topic: 'WHERE',
        slug: 'produk-dengan-harga-terjangkau',
        lead: 'Ambil nama dan harga yang terisi, paling tinggi Rp20.000.',
      },
      {
        topic: 'JOIN',
        slug: 'pesanan-dan-nama-pelanggan',
        lead: 'Sambungkan pesanan ke nama pelanggan yang tercatat.',
      },
      {
        topic: 'JOIN',
        slug: 'produk-yang-ikut-terjual',
        lead: 'Sambungkan baris pesanan ke produk yang ada di daftar.',
      },
      {
        topic: 'agregasi',
        slug: 'jumlah-pelanggan-tercatat',
        lead: 'Hitung berapa pelanggan yang tercatat.',
      },
      {
        topic: 'agregasi',
        slug: 'jumlah-seluruh-belanja',
        lead: 'Jumlahkan seluruh total belanja.',
      },
    ],
  },
  {
    materi: 2,
    topics: ['GROUP BY', 'subquery', 'CASE'],
    lessons: [
      {
        topic: 'GROUP BY',
        slug: 'total-belanja-per-kota',
        lead: 'Satu baris per kota, berisi jumlah belanjanya.',
      },
      {
        topic: 'GROUP BY',
        slug: 'rata-rata-belanja-tiap-kota',
        lead: 'Rata-rata belanja pelanggan di tiap kota.',
      },
      {
        topic: 'subquery',
        slug: 'lebih-mahal-dari-yang-termurah',
        lead: 'Barang yang lebih mahal daripada yang termurah.',
      },
      {
        topic: 'subquery',
        slug: 'produk-paling-mahal',
        lead: 'Semua barang yang harganya sama dengan yang tertinggi.',
      },
      {
        topic: 'CASE',
        slug: 'label-harga-barang',
        lead: 'Beri label hemat, biasa, atau mahal.',
      },
      {
        topic: 'CASE',
        slug: 'vip-dan-biasa-sekaligus',
        lead: 'Hitung jumlah VIP dan biasa dalam satu baris.',
      },
    ],
  },
  {
    materi: 3,
    topics: ['window', 'CTE', 'optimasi'],
    lessons: [
      {
        topic: 'window',
        slug: 'nomor-baris-tiap-gudang',
        lead: 'Nomor baris mulai dari 1 di dalam tiap gudang.',
      },
      {
        topic: 'window',
        slug: 'jumlah-berjalan-tiap-toko',
        lead: 'Jumlah qty berjalan, terpisah untuk tiap toko.',
      },
      {
        topic: 'CTE',
        slug: 'omzet-kota-lewat-ringkasan',
        lead: 'Ringkas omzet per kota dulu, lalu simpan yang mencapai batas.',
      },
      {
        topic: 'CTE',
        slug: 'kota-di-atas-rata-omzet',
        lead: 'Bandingkan omzet kota dengan rata-rata omzet kota.',
      },
      {
        topic: 'optimasi',
        slug: 'qty-tanpa-lipat-harga',
        lead: 'Jumlah qty per produk. Harga di banyak toko tidak boleh menggandakan qty.',
      },
      {
        topic: 'optimasi',
        slug: 'pelanggan-dari-dua-meja',
        lead: 'Jumlahkan tiap meja dulu. Jangan jumlahkan setelah dua meja digabung.',
      },
    ],
  },
]

export const CAPSTONE: {
  title: string
  steps: readonly CourseStep[]
} = {
  title: 'Laporan kasir TokoKulwon',
  steps: [
    {
      slug: 'hari-pertama-di-tokokulwon',
      bagian: 'Siapa yang tercatat',
      lead: 'Daftar pelanggan yang membuka laporan.',
    },
    {
      slug: 'jumlah-seluruh-belanja',
      bagian: 'Omzet di kasir',
      lead: 'Satu angka seluruh total belanja.',
    },
    {
      slug: 'pesanan-dan-nama-pelanggan',
      bagian: 'Nota yang punya nama',
      lead: 'Pesanan yang pelanggannya ada di daftar.',
    },
    {
      slug: 'total-belanja-per-kota',
      bagian: 'Omzet per kota',
      lead: 'Satu baris per kota, bukan satu baris per pelanggan.',
    },
    {
      slug: 'qty-tanpa-lipat-harga',
      bagian: 'Qty yang tidak terlipat',
      lead: 'Angka penjualan yang tidak dobel gara-gara harga.',
    },
  ],
}
