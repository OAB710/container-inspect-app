import { useCallback, useEffect, useMemo, useState } from 'react';
import surveyorApi, { SurveyorItem } from '../api/surveyor';
import { SelectOption } from '../types/common';

export const useSurveyorOptions = () => {
  const [data, setData] = useState<SurveyorItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await surveyorApi.getList();
      setData(res || []);
    } catch (err: any) {
      setError(err.message || 'Không tải được danh sách người giám định');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const options: SelectOption[] = useMemo(() => {
    return data.map(item => ({
      value: String(item.id),
      label: item.email ? `${item.full_name} - ${item.email}` : item.full_name,
    }));
  }, [data]);

  return {
    data,
    options,
    loading,
    error,
    refetch: fetchData,
  };
};