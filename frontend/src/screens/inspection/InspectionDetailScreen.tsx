import React, { useEffect, useMemo } from 'react';
import { Alert, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MainLayout from '../../components/MainLayout';
import MButton from '../../components/MButton';
import MStatusBadge from '../../components/MStatusBadge';
import {
  InspectionFormValues,
  InspectionStatus,
} from '../../types/inspection';
import { InspectionStackParamList } from '../../types/navigations/inspection-navigation';
import {
  useInspectionDetail,
  useSaveInspectionDraft,
  useCompleteInspection,
} from '../../queries/useInspection';
import { useDamageDraftStore } from '../../stores/damageDraftStore';
import inspectionDetailStyle from './styles/inspection-detail.style';
import InspectionInfoForm from './components/InspectionInfoForm';
import DamageListSection from './components/DamageListSection';

type Props = NativeStackScreenProps<InspectionStackParamList, 'InspectionDetailScreen'>;

const InspectionDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const inspectionId = route.params?.inspectionId;
  const { data, loading, refetch } = useInspectionDetail(inspectionId);
  const { damages, setDamages, resetDamages, removeDamage } = useDamageDraftStore();
  const saveDraftMutation = useSaveInspectionDraft();
  const completeMutation = useCompleteInspection();

  const { control, handleSubmit, reset } = useForm<InspectionFormValues>({
    defaultValues: {
      container_id: null,
      surveyor_id: null,
      inspection_code: '',
      inspection_date: new Date().toISOString(),
      result: '',
      note: '',
    },
  });

  const status: InspectionStatus = useMemo(() => {
    return data?.status || 'draft';
  }, [data]);

  const isReadonly = status === 'completed';

  useEffect(() => {
    if (data) {
      reset({
        container_id: data.container_id ? String(data.container_id) : null,
        surveyor_id: data.surveyor_id ? String(data.surveyor_id) : null,
        inspection_code: data.inspection_code || '',
        inspection_date: data.inspection_date || new Date().toISOString(),
        result: data.result || '',
        note: data.note || '',
      });

      setDamages(data.damages || []);
    } else {
      reset({
        container_id: null,
        surveyor_id: null,
        inspection_code: '',
        inspection_date: new Date().toISOString(),
        result: '',
        note: '',
      });
      resetDamages();
    }
  }, [data, reset, setDamages, resetDamages]);

  const onSubmit = async (values: InspectionFormValues) => {
    try {
      const payload = {
        id: inspectionId,
        ...values,
        damages,
      };

      const res = await saveDraftMutation.submit(payload);

      Alert.alert('Thành công', 'Lưu giám định thành công');

      if (!inspectionId && res?.id) {
        navigation.replace('InspectionDetailScreen', { inspectionId: res.id });
      } else {
        refetch();
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể lưu giám định');
    }
  };

  const onComplete = async () => {
    if (!inspectionId) {
      Alert.alert('Thông báo', 'Bạn cần lưu giám định trước khi hoàn tất');
      return;
    }

    try {
      await completeMutation.submit(inspectionId);
      Alert.alert('Thành công', 'Đã hoàn tất giám định');
      refetch();
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể hoàn tất giám định');
    }
  };

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <MainLayout>
      <View style={inspectionDetailStyle.headerWrap}>
        <Text style={inspectionDetailStyle.headerTitle}>
          {inspectionId ? 'Chi tiết giám định' : 'Tạo mới giám định'}
        </Text>

        <MStatusBadge status={status} />

        <Text style={inspectionDetailStyle.headerDesc}>
          {loading
            ? 'Đang tải dữ liệu...'
            : isReadonly
            ? 'Giám định đã hoàn tất. Bạn chỉ có thể xem chi tiết.'
            : 'Bạn có thể chỉnh sửa thông tin, thêm hư hỏng và lưu ở trạng thái nháp.'}
        </Text>

        {data?.created_at && (
          <Text style={inspectionDetailStyle.timestamp}>
            Tạo: {formatDate(data.created_at)}
          </Text>
        )}

        {data?.updated_at && (
          <Text style={inspectionDetailStyle.timestamp}>
            Cập nhật: {formatDate(data.updated_at)}
          </Text>
        )}
      </View>

      <InspectionInfoForm
        control={control}
        readonly={isReadonly}
        container={data?.container}
        surveyor={data?.surveyor}
      />

      <DamageListSection
        damages={damages}
        readonly={isReadonly}
        navigation={navigation}
        onDeleteDamage={removeDamage}
      />

      {!isReadonly && (
        <View style={inspectionDetailStyle.footerActions}>
          <MButton
            title="Lưu giám định"
            loading={saveDraftMutation.loading}
            onPress={handleSubmit(onSubmit)}
          />

          <View style={inspectionDetailStyle.gap12} />

          <MButton
            title="Hoàn tất giám định"
            variant="danger"
            loading={completeMutation.loading}
            onPress={onComplete}
          />
        </View>
      )}
    </MainLayout>
  );
};

export default InspectionDetailScreen;