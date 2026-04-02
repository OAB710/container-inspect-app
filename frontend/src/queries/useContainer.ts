import {useCallback, useEffect, useMemo, useState} from 'react';
import containerApi, {ContainerItem} from '../api/container';
import {SelectOption} from '../types/common';
import {formatContainerStatusLabel} from '../utils/inspectionDisplay';

const resolveContainerDisabledReason = (status: string) => {
  const normalized = status.trim().toLowerCase();
  if (normalized !== 'inspected') {
    return null;
  }

  return 'Container đã giám định hoàn tất, không thể chọn để tạo giám định mới.';
};

export const useContainerOptions = (search?: string) => {
  const [data, setData] = useState<ContainerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await containerApi.getList(search);
      setData(res || []);
    } catch (err: any) {
      setError(err.message || 'Không tải được danh sách container');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const options: SelectOption[] = useMemo(() => {
    return data.map(item => ({
      disabled: item.status === 'inspected',
      disabledReason: resolveContainerDisabledReason(item.status) || undefined,
      value: String(item.id),
      label: item.container_no,
      subtitle: `${item.container_type} (${item.container_size}ft)`,
      meta: formatContainerStatusLabel(item.status),
      status: item.status,
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
