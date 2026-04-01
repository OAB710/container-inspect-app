import apiInstance from './apiInstance';
import {
  Inspection,
  InspectionFormValues,
  DamageItem,
} from '../types/inspection';

export interface SendDamageItem {
  damagePosition: string;
  damageType: string;
  severity: string;
  description: string;
  repairMethod: string;
  images: string[];
}

export interface SaveInspectionDraftPayload {
  id?: number;
  container_id: string;
  surveyor_id: string;
  inspection_code: string;
  inspection_date: string;
  result: string;
  note: string;
  damages: SendDamageItem[];
}

const inspectionApi = {
  getList: (): Promise<Inspection[]> => {
    return apiInstance.get('/giam-dinh');
  },

  getDetail: (id: number): Promise<Inspection> => {
    return apiInstance.get(`/giam-dinh/${id}`);
  },

  saveDraft: (payload: SaveInspectionDraftPayload): Promise<Inspection> => {
    if (payload.id) {
      return apiInstance.post(`/giam-dinh/${payload.id}/save-draft`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    return apiInstance.post('/giam-dinh/save-draft', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  complete: (id: number): Promise<Inspection> => {
    return apiInstance.patch(`/giam-dinh/${id}/complete`);
  },
};

export default inspectionApi;
