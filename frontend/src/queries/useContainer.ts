import { useCallback, useEffect, useMemo, useState } from 'react';
import containerApi, { ContainerItem } from '../api/container';
import { SelectOption } from '../types/common';

export const useContainerOptions = () => {
  const [data, setData] = useState<ContainerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await containerApi.getList();
      setData(res || []);
    } catch (err: any) {
      setError(err.message || 'Không tải được danh sách container');
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
      label: `${item.container_no} - ${item.container_type}${item.container_size} - ${item.status}`,
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