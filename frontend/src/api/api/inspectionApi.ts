import axios from "axios";
import { Inspection } from "../types/inspection.types";

const api = axios.create({
  baseURL: "http://YOUR_IP:3000",
  timeout: 10000,
});

export const getInspections = async (): Promise<Inspection[]> => {
  const response = await api.get("/giam-dinh");
  return response.data;
};

export const getInspectionDetail = async (id: number): Promise<Inspection> => {
  const response = await api.get(`/giam-dinh/${id}`);
  return response.data;
};

export const createInspection = async (payload: Partial<Inspection>) => {
  const response = await api.post("/giam-dinh", payload);
  return response.data;
};

export const updateInspection = async (
  id: number,
  payload: Partial<Inspection>,
) => {
  const response = await api.patch(`/giam-dinh/${id}`, payload);
  return response.data;
};

export const completeInspection = async (id: number) => {
  const response = await api.patch(`/giam-dinh/${id}/complete`);
  return response.data;
};

export default api;
