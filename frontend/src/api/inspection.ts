import apiInstance from './apiInstance';
import {
  Inspection,
  InspectionFormValues,
  DamageItem,
} from '../types/inspection';

export interface SaveInspectionDraftPayload extends InspectionFormValues {
  id?: number;
  damages: DamageItem[];
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
      return apiInstance.post(`/giam-dinh/${payload.id}/save-draft`, payload);
    }
    return apiInstance.post('/giam-dinh/save-draft', payload);
  },

  complete: (id: number): Promise<Inspection> => {
    return apiInstance.patch(`/giam-dinh/${id}/complete`);
  },
};

export default inspectionApi;
