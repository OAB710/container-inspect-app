export type InspectionStatus = 'draft' | 'completed';
export type DamageSeverity = 'low' | 'medium' | 'high';

export interface Container {
  id: number;
  container_no?: string;
  container_type?: string;
  container_size?: string;
  status?: string;
}

export interface Surveyor {
  id: number;
  full_name?: string;
  username?: string;
  email?: string;
}

export interface DamageImage {
  id?: number;
  image_url: string;
  image_name?: string;
  local_uri?: string;
  is_new?: boolean;
}

export interface Damage {
  id?: number;
  giam_dinh_id?: number;
  damage_position: string;
  damage_type: string;
  severity: DamageSeverity;
  description?: string;
  repair_method?: string;
  images: DamageImage[];
}

export interface Inspection {
  id: number;
  container_id?: number;
  surveyor_id?: number;
  inspection_code?: string;
  inspection_date?: string;
  result?: string;
  note?: string;
  status: InspectionStatus;
  container?: Container;
  surveyor?: Surveyor;
  damages?: Damage[];
}

export interface CreateInspectionPayload {
  container_id: number;
  surveyor_id: number;
  inspection_code: string;
  inspection_date: string;
  result?: string;
  note?: string;
}

export interface UpdateInspectionPayload extends CreateInspectionPayload {}

export interface DamagePayload {
  damage_type: string;
  severity: DamageSeverity;
  damage_position: string;
  description?: string;
  repair_method?: string;
}

export interface EditableDamage extends Damage {
  temp_id: string;
}
