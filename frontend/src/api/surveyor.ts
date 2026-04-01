import apiInstance from './apiInstance';

export interface SurveyorItem {
  id: number;
  full_name: string;
  email?: string;
  role?: string;
}

const surveyorApi = {
  getList: (): Promise<SurveyorItem[]> => {
    return apiInstance.get('/user/surveyors');
  },
};

export default surveyorApi;