import { PlasticType } from '../types';

export const PLASTIC_DATA: PlasticType[] = [
  {
    id: 1,
    code: 'PET / PETE',
    name: 'Polyethylene Terephthalate',
    fullName: 'Kode 1: PET / PETE',
    chemicalName: 'Polietilena Tereftalat',
    recyclability: 'Tinggi',
    recyclabilityScore: 9,
    color: '#0284c7', // Sky blue
    bgLight: 'bg-sky-50 dark:bg-sky-950/40',
    borderColor: 'border-sky-500',
    tagColor: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
    description: 'Plastik jernih, kuat, dan ringan yang paling umum ditemukan pada botol minuman sekali pakai. Sangat mudah didaur ulang menjadi serat tekstil (polyester), karpet, atau botol baru.',
    commonProducts: [
      'Botol air mineral & soda',
      'Botol minyak goreng kemasan',
      'Wadah selai kacang & saus',
      'Kemasan baki blister obat/makanan'
    ],
    safeForFood: true,
    hazardNote: 'Hanya dirancang untuk SATU KALI PAKAI. Penggunaan berulang terutama dengan air panas dapat melarutkan bahan kimia antimony trioxide dan memicu pertumbuhan bakteri di pori-porinya.',
    preparationSteps: [
      'Buka tutup botol dan pisahkan segel plastik leher botol.',
      'Bilas bersih bagian dalam dari sisa cairan atau gula.',
      'Keringkan, lalu remas/pipihkan botol untuk menghemat volume tempat penyimpanan.',
      'Lepas label plastik merek jika memungkinkan untuk nilai jual daur ulang yang lebih tinggi.'
    ],
    recyclingValue: 'Tinggi (Sangat dicari oleh bank sampah dan pabrik daur ulang)',
    imagePlaceholder: '/assets/plastics/pet.svg'
  },
  {
    id: 2,
    code: 'HDPE',
    name: 'High-Density Polyethylene',
    fullName: 'Kode 2: HDPE',
    chemicalName: 'Polietilena Berdensitas Tinggi',
    recyclability: 'Tinggi',
    recyclabilityScore: 9,
    color: '#16a34a', // Green
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-500',
    tagColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
    description: 'Plastik tebal, kaku, dan buram/putih susu yang tahan terhadap bahan kimia dan kelembapan. Sangat aman dan merupakan salah satu jenis plastik paling ramah daur ulang.',
    commonProducts: [
      'Botol sampo, sabun cair, & deterjen',
      'Jeriken minyak dan cairan pembersih',
      'Botol susu cair segar',
      'Tutup galon air dan botol minuman keras',
      'Pipa air HDPE dan mainan anak'
    ],
    safeForFood: true,
    hazardNote: 'Sangat stabil dan aman untuk kontak makanan. Tidak mudah melepaskan bahan kimia berbahaya serta tahan suhu hingga 60°C.',
    preparationSteps: [
      'Kuras sisa cairan deterjen atau sampo hingga bersih.',
      'Bilas dengan air hangat agar tidak meninggalkan residu sabun lengket.',
      'Buka pompa dispenser (*pump*) jika ada per logam di dalamnya (pisahkan pompa mekanis).',
      'Keringkan dan simpan dalam karung khusus plastik keras.'
    ],
    recyclingValue: 'Sangat Tinggi (Bahan baku utama pipa daur ulang, bangku taman, tempat sampah)',
    imagePlaceholder: '/assets/plastics/hdpe.svg'
  },
  {
    id: 3,
    code: 'PVC',
    name: 'Polyvinyl Chloride',
    fullName: 'Kode 3: PVC / V',
    chemicalName: 'Polivinil Klorida',
    recyclability: 'Rendah / Khusus',
    recyclabilityScore: 3,
    color: '#ea580c', // Orange
    bgLight: 'bg-orange-50 dark:bg-orange-950/40',
    borderColor: 'border-orange-500',
    tagColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    description: 'Plastik yang kuat, tahan cuaca, dan tahan api. Sering disebut plastik "beracun" jika dibakar karena mengandung klorin dan plasticizer (phthalates).',
    commonProducts: [
      'Pipa saluran air / paralon',
      'Kabel listrik dan isolasi',
      'Tirai kamar mandi & jas hujan vinil',
      'Lantai vinil & bingkai jendela',
      'Kemasan blister pembungkus perkakas'
    ],
    safeForFood: false,
    hazardNote: 'HINDARI untuk wadah makanan panas atau berminyak. Pembakaran PVC menghasilkan racun dioksin yang sangat berbahaya bagi paru-paru dan lingkungan.',
    preparationSteps: [
      'Jangan pernah membakar sampah PVC.',
      'Potong pipa bekas menjadi bagian yang rapi jika berukuran panjang.',
      'Kumpulkan terpisah dan serahkan ke pengepul limbah bangunan atau bank sampah yang memiliki jaringan pengolahan industri PVC.'
    ],
    recyclingValue: 'Sedang / Spesifik (Umumnya diterima oleh pengepul material konstruksi)',
    imagePlaceholder: '/assets/plastics/pvc.svg'
  },
  {
    id: 4,
    code: 'LDPE',
    name: 'Low-Density Polyethylene',
    fullName: 'Kode 4: LDPE',
    chemicalName: 'Polietilena Berdensitas Rendah',
    recyclability: 'Sedang',
    recyclabilityScore: 6,
    color: '#0d9488', // Teal
    bgLight: 'bg-teal-50 dark:bg-teal-950/40',
    borderColor: 'border-teal-500',
    tagColor: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
    description: 'Plastik elastis, fleksibel, dan transparan atau semi-buram. Tahan air dan relatif aman, tetapi sering terbuang sembarangan karena bentuknya yang tipis.',
    commonProducts: [
      'Kantong kresek belanjaan',
      'Plastik pembungkus (*cling wrap* / *stretch film*)',
      'Bubble wrap pembungkus paket',
      'Botol saus mustard/kecap yang bisa dipencet (*squeeze bottles*)',
      'Lapisan dalam karton susu UHT'
    ],
    safeForFood: true,
    hazardNote: 'Cukup aman untuk makanan pada suhu ruang. Kelemahannya mudah terbang dan tersangkut di mesin pencacah jika tidak diikat/dipadatkan bersama.',
    preparationSteps: [
      'Pastikan kantong kresek bebas dari sisa kuah makanan berminyak.',
      'Kumpulkan puluhan kantong plastik dan masukkan ke dalam 1 kantong besar (*metode bag-in-bag*).',
      'Timbang bersama kelompok plastik lembaran (film).'
    ],
    recyclingValue: 'Sedang (Didaur ulang menjadi kantong sampah hitam, papan kayu sintetis, atau genteng plastik)',
    imagePlaceholder: '/assets/plastics/ldpe.svg'
  },
  {
    id: 5,
    code: 'PP',
    name: 'Polypropylene',
    fullName: 'Kode 5: PP',
    chemicalName: 'Polipropilena',
    recyclability: 'Tinggi',
    recyclabilityScore: 8,
    color: '#6366f1', // Indigo
    bgLight: 'bg-indigo-50 dark:bg-indigo-950/40',
    borderColor: 'border-indigo-500',
    tagColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
    description: 'Plastik yang kuat, tahan panas tinggi (titik leleh >130°C), dan tahan lemak. Menjadi pilihan terbaik untuk wadah makanan yang dapat digunakan berulang kali (*reusable*).',
    commonProducts: [
      'Kotak makan / Tupperware & wadah thinwall',
      'Cup minuman boba / es kopi susu',
      'Sedotan plastik & tutup botol ulir',
      'Wadah yoghurt dan margarin',
      'Komponen interior mobil dan tali rafia'
    ],
    safeForFood: true,
    hazardNote: 'Paling aman untuk makanan panas dan microwave (food grade). Memiliki masa pakai yang lama jika dirawat dengan baik.',
    preparationSteps: [
      'Untuk cup minuman boba, sobek dan buang lapisan plastik segel penutup di bibir cup (karena beda material).',
      'Cuci bersih dari sisa boba, susu, atau santan berlemak.',
      'Tumpuk cup sejenis agar hemat tempat.'
    ],
    recyclingValue: 'Tinggi (Bahan incaran industri untuk diolah kembali menjadi wadah baru, serat karpet, dan baterai aki)',
    imagePlaceholder: '/assets/plastics/pp.svg'
  },
  {
    id: 6,
    code: 'PS',
    name: 'Polystyrene',
    fullName: 'Kode 6: PS',
    chemicalName: 'Polistirena',
    recyclability: 'Sangat Sulit',
    recyclabilityScore: 2,
    color: '#e11d48', // Rose/Red
    bgLight: 'bg-rose-50 dark:bg-rose-950/40',
    borderColor: 'border-rose-500',
    tagColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
    description: 'Plastik kaku yang getas atau busa ringan (Expanded Polystyrene / Styrofoam). Sangat lambat terurai dan berisiko tinggi mencemari lautan menjadi mikroplastik.',
    commonProducts: [
      'Styrofoam kotak makanan seblak/bubur',
      'Sendok & garpu plastik putih sekali pakai',
      'Cup mi instan seduh',
      'Kotak kaset CD lama & gantungan baju bening'
    ],
    safeForFood: false,
    hazardNote: 'BAHAYA: Melepaskan monomer styrene (karsinogenik) saat terkena panas, minyak goreng, atau alkohol. Sangat tidak disarankan untuk wadah kuah panas.',
    preparationSteps: [
      'Usahakan kurangi penggunaannya sedari awal (bawa misting sendiri).',
      'Jika sudah terlanjur ada, bersihkan sisa kuah/nasi.',
      'Sebagian bank sampah menolak styrofoam karena volumenya besar namun bobotnya sangat ringan, cari bank sampah dengan mesin pelebur EPS.'
    ],
    recyclingValue: 'Rendah (Biaya logistik pengiriman seringkali lebih mahal daripada nilai bahan)',
    imagePlaceholder: '/assets/plastics/ps.svg'
  },
  {
    id: 7,
    code: 'OTHER / O',
    name: 'Other / Polycarbonate / Multi-Layer',
    fullName: 'Kode 7: OTHER (Campuran / Lainnya)',
    chemicalName: 'Campuran Polimer, SAN, ABS, PC, Bio-plastik',
    recyclability: 'Rendah / Khusus',
    recyclabilityScore: 4,
    color: '#71717a', // Zinc
    bgLight: 'bg-zinc-100 dark:bg-zinc-900/60',
    borderColor: 'border-zinc-500',
    tagColor: 'bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300',
    description: 'Kategori untuk semua jenis plastik yang tidak masuk ke dalam kode 1-6, termasuk plastik multi-layer (lapisan alumunium foil) dan bahan modern seperti PLA bioplastik.',
    commonProducts: [
      'Bungkus saset kopi, mi instan, & snack ciki (metallized film)',
      'Galon air polikarbonat (PC keras)',
      'Botol minum olahraga Tritan / casing handphone',
      'Sikat gigi & komposit alat medis'
    ],
    safeForFood: true,
    hazardNote: 'Bervariasi: Untuk bahan Polycarbonate (PC) lama bisa mengandung BPA. Untuk kemasan saset sachet sangat sulit dipisahkan antara lapisan plastik dan foilnya.',
    preparationSteps: [
      'Untuk saset kopi/snack, potong dan bersihkan sisa remahan makanan.',
      'Dapat dikumpulkan untuk pembuatan **Ecobrick** atau dikirim ke pengolah sampah residu RDF (Refuse Derived Fuel).',
      'Untuk galon PC bekas, serahkan langsung ke depo air isi ulang.'
    ],
    recyclingValue: 'Khusus (Saset dibuat kerajinan ecobrick/paving block plastik, galon PC bernilai tinggi)',
    imagePlaceholder: '/assets/plastics/other.svg'
  }
];
