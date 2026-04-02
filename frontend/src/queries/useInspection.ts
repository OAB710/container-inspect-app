import {useCallback, useEffect, useState} from 'react';
import inspectionApi, {SaveInspectionDraftPayload} from '../api/inspection';
import {Inspection} from '../types/inspection';

export const useInspectionList = () => {
  const [data, setData] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await inspectionApi.getList();
      setData(res || []);
    } catch (err: any) {
      setError(err.message || 'Không tải được danh sách giám định');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export const useInspectionDetail = (inspectionId?: number) => {
  const [data, setData] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    if (!inspectionId) return;

    try {
      setLoading(true);
      setError('');
      const res = await inspectionApi.getDetail(inspectionId);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Không tải được chi tiết giám định');
    } finally {
      setLoading(false);
    }
  }, [inspectionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export const useSaveInspectionDraft = () => {
  const [loading, setLoading] = useState(false);

  const submit = async (payload: SaveInspectionDraftPayload) => {
    try {
      setLoading(true);
      return await inspectionApi.saveDraft(payload);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submit,
  };
};

export const useCompleteInspection = () => {
  const [loading, setLoading] = useState(false);

  const submit = async (
    id: number,
    payload?: {expected_updated_at?: string},
  ) => {
    try {
      setLoading(true);
      return await inspectionApi.complete(id, payload);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submit,
  };
};
