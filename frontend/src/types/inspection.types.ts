export type InspectionStatus = 'draft' | 'completed';

export interface Container {
  id: number;
  container_no: string;
  container_type: string;
  container_size: string;
  status: string;
}

export interface DamageImage {
  id?: number;
  image_url: string;
  image_name?: string;
}

export interface Damage {
  id?: number;
  giam_dinh_id?: number;
  damage_position: string;
  damage_type: string;
  severity: 'low' | 'medium' | 'high';
  description?: string;
  repair_method?: string;
  images: DamageImage[];
}

export interface Inspection {
  id: number;
  container_id: number;
  surveyor_id: number;
  inspection_code: string;
  inspection_date?: string;
  result?: string;
  note?: string;
  status: InspectionStatus;
  container?: Container;
  damages?: Damage[];
}