import {useCallback, useEffect, useMemo, useState} from 'react';
import surveyorApi, {SurveyorItem} from '../api/surveyor';
import {SelectOption} from '../types/common';

export const useSurveyorOptions = (search?: string, enabled = true) => {
  const [data, setData] = useState<SurveyorItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setData([]);
      setError('');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await surveyorApi.getList(search);
      setData(res || []);
    } catch (err: any) {
      setError(err.message || 'Không tải được danh sách người giám định');
    } finally {
      setLoading(false);
    }
  }, [search, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const options: SelectOption[] = useMemo(() => {
    return data.map(item => ({
      value: String(item.id),
      label: item.full_name,
      subtitle: item.email || undefined,
      meta: item.role === 'admin' ? 'Giám đốc' : 'Người giám định',
      status: item.role || 'surveyor',
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
