import { WasteBank } from '../types';

export const MOCK_WASTE_BANKS: WasteBank[] = [
  {
    id: 'bsi-dewi-sri-girinata',
    name: 'BANK SAMPAH INDUK DEWI SRI GIRINATA',
    address: 'Girinata, Kec. Dukupuntang, Kabupaten Cirebon, Jawa Barat 45652',
    city: 'Dukupuntang',
    province: 'Jawa Barat',
    latitude: -6.7638573,
    longitude: 108.4056585,
    acceptedPlastics: [1, 2, 4, 5],
    operatingHours: 'Senin - Sabtu: 07.30 – 18.00 WIB (Minggu Tutup)',
    phone: '082115811060',
    whatsapp: '6282115811060',
    notes: 'Menerima botol plastik, kresek, kaleng, kardus, duplek, besi/logam, botol beling, elektronik, dan tray telur. Pembayaran tunai langsung sesuai berat timbangan.',
    rewardType: 'Uang Tunai'
  },
  {
    id: 'wsm-rumah-diskusi-sampah',
    name: 'WSM Rumah Diskusi Sampah',
    address: 'Perumahan Mutiara Jl. Mutiara 2 No.10 Blok A, Pasalakan, Kec. Sumber, Kabupaten Cirebon, Jawa Barat 45611',
    city: 'Sumber',
    province: 'Jawa Barat',
    latitude: -6.7381387,
    longitude: 108.4791223,
    acceptedPlastics: [1, 2, 5],
    operatingHours: 'Senin - Jumat: 08.00 – 16.00 WIB (Sabtu - Minggu Tutup)',
    phone: '081909898929',
    whatsapp: '6281909898929',
    notes: 'Konsep koperasi: hasil setoran masuk sebagai simpanan wajib/sukarela yang dikelola ke unit usaha, dengan pembagian SHU (Sisa Hasil Usaha) tahunan bagi nasabah/anggota. Menerima kardus, kertas, botol/cup mineral, emberan, besi, kaleng, dan rongsok lainnya.',
    rewardType: 'SHU Koperasi / Simpanan'
  },
  {
    id: 'bs-mawar-merah-rw07',
    name: 'Bank Sampah Mawar Merah RW 07 Pulobaru Selatan',
    address: 'Jl. Pulobaru No.Gang 7, RT.01/RW.07, Pulasaren, Kec. Pekalipan, Kota Cirebon, Jawa Barat 45116',
    city: 'Pekalipan (Kota Cirebon)',
    province: 'Jawa Barat',
    latitude: -6.7289317,
    longitude: 108.5619035,
    acceptedPlastics: [1, 5],
    operatingHours: 'Sabtu - Minggu: 10.00 – 15.00 WIB (Senin - Jumat Tutup)',
    phone: '082127421309',
    whatsapp: '6282127421309',
    notes: 'Menerima botol plastik, cup/gelas air mineral, kardus, duplek, botol kaca/beling, dan anorganik daur ulang lainnya. Fleksibel: dapat dihargai sebagai uang tunai hasil timbang atau disedekahkan/donasi sampah untuk kas warga.',
    rewardType: 'Tunai / Sedekah Sampah'
  }
];
