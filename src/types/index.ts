export interface PlasticType {
  id: number;
  code: string;
  name: string;
  fullName: string;
  chemicalName: string;
  recyclability: 'Tinggi' | 'Sedang' | 'Rendah / Khusus' | 'Sangat Sulit';
  recyclabilityScore: number; // 1 - 10
  color: string;
  bgLight: string;
  borderColor: string;
  tagColor: string;
  description: string;
  commonProducts: string[];
  safeForFood: boolean;
  hazardNote: string;
  preparationSteps: string[];
  recyclingValue: string; // e.g. "Tinggi (Banyak dicari pengepul/bank sampah)"
  imagePlaceholder: string;
}

export interface WasteBank {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  acceptedPlastics: number[]; // e.g. [1, 2, 4, 5] (plastic IDs)
  operatingHours: string;
  phone?: string;
  whatsapp?: string;
  notes?: string;
  rewardType: 'Poin' | 'Tunai' | 'Sembako' | 'Emas Digital' | 'SHU Koperasi' | string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar_url?: string;
  badge: 'Pemula Hijau' | 'Pejuang Daur Ulang' | 'Eco Warrior' | 'Master Sirkular';
  points: number;
  totalRecycledKg: number;
  joinedDate: string;
}

export interface ForumComment {
  id: string;
  post_id: string;
  author: {
    name: string;
    badge: string;
    avatar?: string;
  };
  content: string;
  created_at: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    badge: string;
    avatar?: string;
  };
  plastic_tag: string;
  upvotes: number;
  comments_count: number;
  created_at: string;
  image_url?: string;
  comments?: ForumComment[];
}

export interface WeighingLog {
  id: string;
  bank_name: string;
  district: string;
  plastic_code: string;
  weight_kg: number;
  officer_name: string;
  citizen_name: string;
  created_at: string;
}
