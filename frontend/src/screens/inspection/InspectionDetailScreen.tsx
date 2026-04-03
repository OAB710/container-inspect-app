import React, {useEffect, useMemo, useRef} from 'react';
import {Alert, ScrollView, Text, View} from 'react-native';
import {useForm} from 'react-hook-form';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import MainLayout from '../../components/MainLayout';
import MButton from '../../components/MButton';
import MStatusBadge from '../../components/MStatusBadge';
import {InspectionFormValues, InspectionStatus} from '../../types/inspection';
import {InspectionStackParamList} from '../../types/navigations/inspection-navigation';
import {
  useInspectionDetail,
  useSaveInspectionDraft,
  useCompleteInspection,
} from '../../queries/useInspection';
import {useDamageDraftStore} from '../../stores/damageDraftStore';
import {useAuthStore} from '../../stores/authStore';
import imageApi from '../../api/image';
import {ApiError} from '../../api/apiInstance';
import {generateInspectionCode} from '../../utils/generateInspectionCode';
import inspectionDetailStyle from './styles/inspection-detail.style';
import InspectionInfoForm from './components/InspectionInfoForm';
import DamageListSection from './components/DamageListSection';

type Props = NativeStackScreenProps<
  InspectionStackParamList,
  'InspectionDetailScreen'
>;

const InspectionDetailScreen: React.FC<Props> = ({route, navigation}) => {
  const inspectionId = route.params?.inspectionId;
  const {data, loading, refetch} = useInspectionDetail(inspectionId);
  const scrollViewRef = useRef<ScrollView>(null);
  const currentUser = useAuthStore(state => state.user);
  const {damages, setDamages, resetDamages, removeDamage} =
    useDamageDraftStore();
  const saveDraftMutation = useSaveInspectionDraft();
  const completeMutation = useCompleteInspection();
  const isAdmin = currentUser?.role === 'admin';
  const currentUserId = currentUser?.id ? String(currentUser.id) : null;

  const {control, handleSubmit, reset} = useForm<InspectionFormValues>({
    defaultValues: {
      container_id: null,
      surveyor_id: isAdmin ? null : currentUserId,
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

  const showStaleDataAlert = () => {
    Alert.alert(
      'Dữ liệu đã thay đổi',
      'Dữ liệu giám định đã được cập nhật từ server. Vui lòng làm mới lại trang trước khi thao tác tiếp.',
      [
        {
          text: 'Làm mới',
          onPress: () => {
            refetch();
          },
        },
        {
          text: 'Đóng',
          style: 'cancel',
        },
      ],
    );
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({y: 0, animated: true});
  };

  const buildSavePayload = (
    values: InspectionFormValues,
    expectedUpdatedAt?: string,
  ) => {
    const containerId = values.container_id;
    const resolvedSurveyorId = isAdmin ? values.surveyor_id : currentUserId;

    if (!containerId) {
      throw new Error('Vui lòng chọn container');
    }

    if (!resolvedSurveyorId) {
      throw new Error('Không xác định được người giám định');
    }

    return {
      id: inspectionId,
      container_id: containerId,
      surveyor_id: resolvedSurveyorId,
      inspection_code: values.inspection_code,
      inspection_date: values.inspection_date,
      expected_updated_at: expectedUpdatedAt,
      result: values.result,
      note: values.note,
      damages: damages.map(damage => ({
        damagePosition: damage.damage_position,
        damageType: damage.damage_type,
        severity: damage.severity,
        description: damage.description,
        repairMethod: damage.repair_method,
        images: (damage.images || [])
          .map(img => img.image_url || '')
          .filter(url => !!url),
      })),
    };
  };

  const persistCurrentInspection = async (
    values: InspectionFormValues,
    options?: {showSuccessAlert?: boolean},
  ) => {
    if (!values.container_id) {
      Alert.alert('Lỗi', 'Vui lòng chọn container');
      return null;
    }

    console.log('🚀 [persistCurrentInspection] Starting save process...');
    console.log('🚀 [persistCurrentInspection] Damages count:', damages.length);
    console.log(
      '🚀 [persistCurrentInspection] Damages with images:',
      damages.map(d => ({
        position: d.damage_position,
        imageCount: d.images?.length || 0,
      })),
    );

    const damagesWithUploadedImages = await Promise.all(
      damages.map(async (damage, damageIndex) => {
        console.log(
          `📦 [persistCurrentInspection] Processing damage ${damageIndex + 1}...`,
        );

        const uploadedImages = await Promise.all(
          (damage.images || []).map(async (img, imgIndex) => {
            if (img.is_local && img.uri) {
              console.log(
                `📸 [persistCurrentInspection] Uploading image ${imgIndex + 1} for damage ${
                  damageIndex + 1
                }:`,
                img.fileName,
              );

              try {
                const cloudinaryUrl = await imageApi.uploadImageFile(
                  img.uri,
                  img.fileName || `image-${Date.now()}.jpg`,
                  img.type || 'image/jpeg',
                );

                console.log(
                  `✅ [persistCurrentInspection] Image ${imgIndex + 1} uploaded:`,
                  cloudinaryUrl,
                );

                return cloudinaryUrl;
              } catch (uploadError) {
                console.error(
                  `❌ [persistCurrentInspection] Failed to upload image ${imgIndex + 1}:`,
                  uploadError,
                );
                throw new Error(
                  `Không thể upload ảnh: ${img.fileName}. Vui lòng thử lại.`,
                );
              }
            }

            console.log(
              `⏭️  [persistCurrentInspection] Skipping already uploaded image ${
                imgIndex + 1
              }`,
            );
            return img.image_url || '';
          }),
        );

        return {
          ...damage,
          images: uploadedImages,
        };
      }),
    );

    const transformedDamages = damagesWithUploadedImages.map(damage => ({
      damagePosition: damage.damage_position,
      damageType: damage.damage_type,
      severity: damage.severity,
      description: damage.description,
      repairMethod: damage.repair_method,
      images: (damage.images || []).filter(url => !!url),
    }));

    const payload = buildSavePayload(values, data?.updated_at);
    payload.damages = transformedDamages;

    const savedInspection = await saveDraftMutation.submit(payload);

    if (options?.showSuccessAlert) {
      Alert.alert('Thành công', 'Lưu giám định thành công');
    }

    return savedInspection;
  };

  useEffect(() => {
    if (data) {
      reset({
        container_id: data.container_id ? String(data.container_id) : null,
        surveyor_id:
          data.surveyor_id && (isAdmin || data.surveyor_id === currentUser?.id)
            ? String(data.surveyor_id)
            : currentUserId,
        inspection_code: data.inspection_code || '',
        inspection_date: data.inspection_date || new Date().toISOString(),
        result: data.result || '',
        note: data.note || '',
      });

      setDamages(data.damages || []);
    } else {
      // Generate inspection code for new inspection
      const generatedCode = generateInspectionCode();
      reset({
        container_id: null,
        surveyor_id: isAdmin ? null : currentUserId,
        inspection_code: generatedCode,
        inspection_date: new Date().toISOString(),
        result: '',
        note: '',
      });
      resetDamages();
    }
  }, [
    data,
    reset,
    setDamages,
    resetDamages,
    currentUserId,
    currentUser?.id,
    isAdmin,
  ]);

  const onSubmit = async (values: InspectionFormValues) => {
    try {
      const res = await persistCurrentInspection(values, {
        showSuccessAlert: true,
      });

      if (!res) {
        return;
      }

      if (!inspectionId && res?.id) {
        navigation.replace('InspectionDetailScreen', {inspectionId: res.id});
      } else {
        refetch();
        scrollToTop();
      }
    } catch (error: any) {
      console.error('Save error:', error);

      if (
        error instanceof ApiError &&
        (error.status === 409 || error.code === 'INSPECTION_STALE')
      ) {
        showStaleDataAlert();
        return;
      }

      Alert.alert(
        'Lỗi',
        error.message || 'Không thể lưu giám định. Kiểm tra lại dữ liệu.',
      );
    }
  };

  const onComplete = async (values: InspectionFormValues) => {
    try {
      const savedInspection = await persistCurrentInspection(values, {
        showSuccessAlert: false,
      });

      if (!savedInspection?.id) {
        Alert.alert('Lỗi', 'Không thể hoàn tất giám định do thiếu mã giám định');
        return;
      }

      const completedInspection = await completeMutation.submit(
        savedInspection.id,
        {
          expected_updated_at: savedInspection.updated_at,
        },
      );

      Alert.alert('Thành công', 'Đã hoàn tất giám định');

      if (!inspectionId) {
        navigation.replace('InspectionDetailScreen', {
          inspectionId: completedInspection.id,
        });
      } else {
        refetch();
        scrollToTop();
      }
    } catch (error: any) {
      if (
        error instanceof ApiError &&
        (error.status === 409 || error.code === 'INSPECTION_STALE')
      ) {
        showStaleDataAlert();
        return;
      }

      Alert.alert('Lỗi', error.message || 'Không thể hoàn tất giám định');
    }
  };

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <MainLayout scrollViewRef={scrollViewRef}>
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
        canChooseSurveyor={isAdmin && !isReadonly}
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
            disabled={completeMutation.loading}
            onPress={handleSubmit(onSubmit)}
          />

          <View style={inspectionDetailStyle.gap12} />

          <MButton
            title="Hoàn tất giám định"
            variant="danger"
            loading={saveDraftMutation.loading || completeMutation.loading}
            onPress={handleSubmit(onComplete)}
          />
        </View>
      )}
    </MainLayout>
  );
};

export default InspectionDetailScreen;
