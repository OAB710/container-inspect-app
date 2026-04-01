export type InspectionStatus = 'draft' | 'completed';
export type DamageSeverity = 'low' | 'medium' | 'high';

export interface Container {
  id: number;
  container_no: string;
  container_type: string;
  container_size: number;
  status: string;
}

export interface Surveyor {
  id: number;
  full_name: string;
  email?: string;
}

export interface DamageImage {
  id?: number;
  image_url?: string;
  image_name?: string;

  // local image on mobile
  uri?: string;
  type?: string;
  fileName?: string;
  is_local?: boolean;
}

export interface DamageItem {
  id?: number;
  damage_position: string;
  damage_type: string;
  severity: DamageSeverity;
  description: string;
  repair_method: string;
  images: DamageImage[];
}

export interface Inspection {
  id: number;
  container_id: number;
  surveyor_id: number;
  inspection_code: string;
  inspection_date: string;
  status: InspectionStatus;
  result: string;
  note: string;
  created_at: string;
  updated_at: string;
  container?: Container;
  surveyor?: Surveyor;
  damages?: DamageItem[];
}

export interface InspectionFormValues {
  container_id: string | null;
  surveyor_id: string | null;
  inspection_code: string;
  inspection_date: string;
  result: string;
  note: string;
}

export interface DamageFormValues {
  damage_position: string;
  damage_type: string;
  severity: DamageSeverity;
  description: string;
  repair_method: string;
}
