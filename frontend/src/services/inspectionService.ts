import axiosInstance from '../api/axios';
import {
  CreateInspectionPayload,
  DamagePayload,
  Inspection,
  UpdateInspectionPayload,
} from '../types/inspection.types';

export const getInspections = async (): Promise<Inspection[]> => {
  const response = await axiosInstance.get('/giam-dinh');
  return response.data;
};

export const getInspectionDetail = async (id: number): Promise<Inspection> => {
  const response = await axiosInstance.get(`/giam-dinh/${id}`);
  return response.data;
};

export const createInspection = async (
  payload: CreateInspectionPayload,
): Promise<Inspection> => {
  const response = await axiosInstance.post('/giam-dinh', payload);
  return response.data;
};

export const updateInspection = async (
  id: number,
  payload: UpdateInspectionPayload,
): Promise<Inspection> => {
  const response = await axiosInstance.patch(`/giam-dinh/${id}`, payload);
  return response.data;
};

export const completeInspection = async (id: number): Promise<Inspection> => {
  const response = await axiosInstance.patch(`/giam-dinh/${id}/complete`);
  return response.data;
};

export const createDamage = async (
  inspectionId: number,
  payload: DamagePayload,
) => {
  const response = await axiosInstance.post(
    `/giam-dinh/${inspectionId}/damages`,
    payload,
  );
  return response.data;
};

export const updateDamage = async (
  damageId: number,
  payload: DamagePayload,
) => {
  const response = await axiosInstance.patch(`/damages/${damageId}`, payload);
  return response.data;
};

export const deleteDamage = async (damageId: number): Promise<void> => {
  await axiosInstance.delete(`/damages/${damageId}`);
};

export const uploadDamageImage = async (
  damageId: number,
  fileUri: string,
  fileName: string,
  mimeType: string = 'image/jpeg',
) => {
  const formData = new FormData();

  formData.append('file', {
    uri: fileUri,
    name: fileName,
    type: mimeType,
  } as never);

  const response = await axiosInstance.post(
    `/damages/${damageId}/images/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
};

export const deleteImage = async (imageId: number): Promise<void> => {
  await axiosInstance.delete(`/images/${imageId}`);
};
