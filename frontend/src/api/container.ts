import apiInstance from './apiInstance';

export interface ContainerItem {
  id: number;
  container_no: string;
  container_type: string;
  container_size: number;
  status: string;
}

const containerApi = {
  getList: (search?: string): Promise<ContainerItem[]> => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiInstance.get(`/container${params}`);
  },
};

export default containerApi;