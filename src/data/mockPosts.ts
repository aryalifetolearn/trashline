import { ForumPost } from '../types';

export const INITIAL_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    title: 'Cara Membuat Sistem Irigasi Tetes Otomatis dari Botol PET 1.5L',
    content: 'Halo teman-teman! Saya berhasil membuat sistem irigasi tetes untuk tanaman cabai di balkon menggunakan botol air mineral 1.5L bekas. Caranya cukup lubangi tutup botol dengan jarum panas, lalu tancapkan terbalik dekat akar tanaman. Air bisa bertahan hingga 3 hari!',
    author: {
      name: 'Andi Nugraha',
      badge: 'Eco Warrior',
    },
    plastic_tag: 'Kode 1 (PET)',
    upvotes: 64,
    comments_count: 8,
    created_at: '2 jam yang lalu',
    comments: [
      {
        id: 'c-1',
        post_id: 'post-1',
        author: { name: 'Siti Rahma', badge: 'Pemula Hijau' },
        content: 'Keren banget idenya kak! Lubang jarumnya perlu berapa titik biar airnya ga netes terlalu kencang?',
        created_at: '1 jam yang lalu'
      },
      {
        id: 'c-2',
        post_id: 'post-1',
        author: { name: 'Andi Nugraha', badge: 'Eco Warrior' },
        content: 'Cukup 1 lubang jarum kecil saja kak Siti di bagian tutup, plus 1 lubang udara kecil di dasar botol.',
        created_at: '45 menit yang lalu'
      }
    ]
  },
  {
    id: 'post-2',
    title: 'Eksperimen Lebur Tutup Galon (HDPE) Jadi Handle Pintu Lemari',
    content: 'Tutup galon air (HDPE Kode 2) adalah plastik terbaik untuk dilebur ulang karena titik lelehnya aman (~130°C) dan tidak berbau pekat. Saya mencacahnya kecil-kecil lalu dimasukkan ke cetakan aluminium dan dipanaskan oven listrik pada suhu 160°C. Hasilnya sangat padat seperti marmer sintetis!',
    author: {
      name: 'Rian Daur Ulang',
      badge: 'Master Sirkular',
    },
    plastic_tag: 'Kode 2 (HDPE)',
    upvotes: 112,
    comments_count: 14,
    created_at: '5 jam yang lalu',
    comments: [
      {
        id: 'c-3',
        post_id: 'post-2',
        author: { name: 'Fahri Pratama', badge: 'Pejuang Daur Ulang' },
        content: 'Wah keren! Pakai masker respirator kah kak saat proses pemanasan?',
        created_at: '3 jam yang lalu'
      }
    ]
  },
  {
    id: 'post-3',
    title: 'Paving Block dari Campuran Pasir & Lelehan Plastik Saset Kopi',
    content: 'Untuk sampah multilayer saset kopi yang biasanya tidak laku di bank sampah, komunitas kami di Bandung mencampurnya dengan pasir halus perbandingan 1:3. Dipanaskan di wajan besi lalu dipres ke cetakan paving block. Kekuatannya setara dengan batako semen!',
    author: {
      name: 'Komunitas ZeroWaste ID',
      badge: 'Master Sirkular',
    },
    plastic_tag: 'Kode 7 (OTHER)',
    upvotes: 156,
    comments_count: 21,
    created_at: '1 hari yang lalu',
    comments: []
  }
];
