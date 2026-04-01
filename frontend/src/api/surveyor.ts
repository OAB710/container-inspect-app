import apiInstance from './apiInstance';

export interface SurveyorItem {
  id: number;
  full_name: string;
  email?: string;
  role?: string;
}

const surveyorApi = {
  getList: (search?: string): Promise<SurveyorItem[]> => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiInstance.get(`/user/surveyors${params}`);
  },
};

export default surveyorApi;