import apiInstance from './apiInstance';

export interface ContainerItem {
  id: number;
  container_no: string;
  container_type: string;
  container_size: number;
  status: string;
}

const containerApi = {
  getList: (): Promise<ContainerItem[]> => {
    return apiInstance.get('/container');
  },
};

export default containerApi;