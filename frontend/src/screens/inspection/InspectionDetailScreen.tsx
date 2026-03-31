import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, SafeAreaView, ScrollView, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AppEmptyState from '../../components/common/AppEmptyState';
import AppErrorState from '../../components/common/AppErrorState';
import AppLoader from '../../components/common/AppLoader';
import DamageItemCard from '../../components/inspection/DamageItemCard';
import FormField from '../../components/inspection/FormField';
import PrimaryButton from '../../components/inspection/PrimaryButton';
import SectionCard from '../../components/inspection/SectionCard';
import {RootStackParamList} from '../../navigations/AppNavigator';
import {
  completeInspection,
  createDamage,
  createInspection,
  deleteDamage,
  deleteImage,
  getInspectionDetail,
  updateDamage,
  updateInspection,
  uploadDamageImage,
} from '../../services/inspectionService';
import {
  Damage,
  DamageImage,
  DamageSeverity,
  EditableDamage,
  Inspection,
} from '../../types/inspection.types';
import styles from './InspectionDetailScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'InspectionDetail'>;
type Snapshot = Record<number, number[]>;
type EditableDamageField =
  | 'damage_position'
  | 'damage_type'
  | 'severity'
  | 'description'
  | 'repair_method';

const DEFAULT_DAMAGE: Omit<EditableDamage, 'temp_id'> = {
  damage_position: '',
  damage_type: '',
  severity: 'medium',
  description: '',
  repair_method: '',
  images: [],
};

const SEVERITY_VALUES: DamageSeverity[] = ['low', 'medium', 'high'];

const createTempId = () =>
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const getFileNameFromUri = (uri: string) => {
  const parts = uri.split('/');
  return parts[parts.length - 1] || `damage-${Date.now()}.jpg`;
};

const normalizeInspectionDate = (value?: string) => {
  if (!value) {
    return '';
  }

  if (value.includes('T')) {
    return value.split('T')[0];
  }

  return value;
};

const buildEditableDamages = (damages: Damage[] = []): EditableDamage[] =>
  damages.map(damage => ({
    ...damage,
    temp_id: createTempId(),
    images: (damage.images || []).map(image => ({
      ...image,
      is_new: false,
      local_uri: undefined,
    })),
  }));

const buildSnapshot = (damages: Damage[] = []): Snapshot => {
  return damages.reduce<Snapshot>((acc, damage) => {
    if (damage.id) {
      acc[damage.id] = (damage.images || [])
        .map(image => image.id)
        .filter((id): id is number => typeof id === 'number');
    }
    return acc;
  }, {});
};

const validateInspection = ({
  containerId,
  surveyorId,
  inspectionCode,
  inspectionDate,
}: {
  containerId: string;
  surveyorId: string;
  inspectionCode: string;
  inspectionDate: string;
}): string | null => {
  if (!containerId.trim() || Number.isNaN(Number(containerId))) {
    return 'Mã container là bắt buộc và phải là số hợp lệ';
  }

  if (!surveyorId.trim() || Number.isNaN(Number(surveyorId))) {
    return 'Mã người giám định là bắt buộc và phải là số hợp lệ';
  }

  if (!inspectionCode.trim()) {
    return 'Mã phiếu giám định là bắt buộc';
  }

  if (!inspectionDate.trim()) {
    return 'Ngày giám định là bắt buộc';
  }

  return null;
};

const validateDamages = (damages: EditableDamage[]): string | null => {
  for (let i = 0; i < damages.length; i += 1) {
    const item = damages[i];

    if (!item.damage_position.trim()) {
      return `Hư hỏng #${i + 1} thiếu vị trí hư hỏng`;
    }

    if (!item.damage_type.trim()) {
      return `Hư hỏng #${i + 1} thiếu loại hư hỏng`;
    }

    if (!SEVERITY_VALUES.includes(item.severity)) {
      return `Hư hỏng #${i + 1} có mức độ không hợp lệ`;
    }
  }

  return null;
};

function InspectionDetailScreen({navigation, route}: Props): JSX.Element {
  const inspectionId = route.params?.inspectionId;
  const isExistingInspection = Boolean(inspectionId);

  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState<boolean>(isExistingInspection);
  const [saving, setSaving] = useState<boolean>(false);
  const [completing, setCompleting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [infoMessage, setInfoMessage] = useState<string>('');

  const [containerId, setContainerId] = useState<string>('');
  const [surveyorId, setSurveyorId] = useState<string>('');
  const [inspectionCode, setInspectionCode] = useState<string>('');
  const [inspectionDate, setInspectionDate] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [damages, setDamages] = useState<EditableDamage[]>([]);

  const snapshotRef = useRef<Snapshot>({});

  const isCompleted = inspection?.status === 'completed';
  const isReadOnly = isCompleted;

  const ensureSeedForCreate = useCallback(() => {
    if (isExistingInspection) {
      return;
    }

    if (!inspectionCode) {
      const now = new Date();
      const code = `GD${now
        .toISOString()
        .replace(/[-:TZ.]/g, '')
        .slice(0, 14)}`;
      setInspectionCode(code);
    }

    if (!inspectionDate) {
      setInspectionDate(new Date().toISOString().slice(0, 10));
    }
  }, [inspectionCode, inspectionDate, isExistingInspection]);

  const fetchInspectionDetail = useCallback(async () => {
    if (!inspectionId) {
      ensureSeedForCreate();
      return;
    }

    try {
      setLoading(true);
      setError('');

      const data = await getInspectionDetail(inspectionId);
      setInspection(data);
      setContainerId(data.container_id ? String(data.container_id) : '');
      setSurveyorId(data.surveyor_id ? String(data.surveyor_id) : '');
      setInspectionCode(data.inspection_code || '');
      setInspectionDate(normalizeInspectionDate(data.inspection_date));
      setResult(data.result || '');
      setNote(data.note || '');
      setDamages(buildEditableDamages(data.damages || []));
      snapshotRef.current = buildSnapshot(data.damages || []);
    } catch (err) {
      console.log('Lỗi tải chi tiết giám định:', err);
      setError('Không thể tải chi tiết giám định');
    } finally {
      setLoading(false);
    }
  }, [ensureSeedForCreate, inspectionId]);

  useEffect(() => {
    fetchInspectionDetail();
  }, [fetchInspectionDetail]);

  const title = useMemo(() => {
    if (!isExistingInspection) {
      return 'Tạo mới giám định';
    }

    return inspectionCode || `GD-${inspectionId}`;
  }, [inspectionCode, inspectionId, isExistingInspection]);

  const updateDamageField = (
    tempId: string,
    field: EditableDamageField,
    value: string,
  ) => {
    setDamages(prev =>
      prev.map(item => {
        if (item.temp_id !== tempId) {
          return item;
        }

        if (field === 'severity') {
          const normalized = value.trim().toLowerCase() as DamageSeverity;
          return {
            ...item,
            severity: normalized || item.severity,
          };
        }

        return {
          ...item,
          [field]: value,
        };
      }),
    );
  };

  const addDamage = () => {
    setDamages(prev => [...prev, {...DEFAULT_DAMAGE, temp_id: createTempId()}]);
  };

  const removeDamageByTempId = (tempId: string) => {
    setDamages(prev => prev.filter(item => item.temp_id !== tempId));
  };

  const addImageToDamage = (tempId: string, localUri: string) => {
    const imageName = getFileNameFromUri(localUri);

    setDamages(prev =>
      prev.map(item =>
        item.temp_id === tempId
          ? {
              ...item,
              images: [
                ...item.images,
                {
                  image_name: imageName,
                  image_url: localUri,
                  local_uri: localUri,
                  is_new: true,
                },
              ],
            }
          : item,
      ),
    );
  };

  const removeImageFromDamage = (tempId: string, image: DamageImage) => {
    setDamages(prev =>
      prev.map(item => {
        if (item.temp_id !== tempId) {
          return item;
        }

        return {
          ...item,
          images: item.images.filter(current => {
            if (image.id && current.id) {
              return current.id !== image.id;
            }

            return current.local_uri !== image.local_uri;
          }),
        };
      }),
    );
  };

  const syncDamages = async (targetInspectionId: number) => {
    const initialSnapshot = snapshotRef.current;
    const initialDamageIds = Object.keys(initialSnapshot).map(Number);
    const currentDamageIds = damages
      .map(item => item.id)
      .filter((id): id is number => typeof id === 'number');

    const removedDamageIds = initialDamageIds.filter(
      damageId => !currentDamageIds.includes(damageId),
    );

    for (const removedDamageId of removedDamageIds) {
      await deleteDamage(removedDamageId);
    }

    for (const damage of damages) {
      const payload = {
        damage_type: damage.damage_type.trim(),
        severity: damage.severity,
        damage_position: damage.damage_position.trim(),
        description: damage.description?.trim() || undefined,
        repair_method: damage.repair_method?.trim() || undefined,
      };

      let targetDamageId = damage.id;

      if (targetDamageId) {
        await updateDamage(targetDamageId, payload);
      } else {
        const createdDamage = await createDamage(targetInspectionId, payload);
        targetDamageId = createdDamage.id;
      }

      const currentExistingImageIds = damage.images
        .map(image => image.id)
        .filter((id): id is number => typeof id === 'number');
      const initialImageIds = damage.id ? initialSnapshot[damage.id] || [] : [];
      const removedImageIds = initialImageIds.filter(
        imageId => !currentExistingImageIds.includes(imageId),
      );

      for (const removedImageId of removedImageIds) {
        await deleteImage(removedImageId);
      }

      const newImages = damage.images.filter(
        image => image.is_new && Boolean(image.local_uri),
      );

      for (const image of newImages) {
        const localUri = image.local_uri || '';
        const fileName = image.image_name || getFileNameFromUri(localUri);
        await uploadDamageImage(targetDamageId as number, localUri, fileName);
      }
    }
  };

  const handleSaveInspection = async () => {
    if (isReadOnly) {
      return;
    }

    const inspectionValidation = validateInspection({
      containerId,
      surveyorId,
      inspectionCode,
      inspectionDate,
    });

    if (inspectionValidation) {
      Alert.alert('Thiếu thông tin', inspectionValidation);
      return;
    }

    const damageValidation = validateDamages(damages);
    if (damageValidation) {
      Alert.alert('Dữ liệu hư hỏng chưa hợp lệ', damageValidation);
      return;
    }

    try {
      setSaving(true);
      setError('');
      setInfoMessage('');

      const payload = {
        container_id: Number(containerId),
        surveyor_id: Number(surveyorId),
        inspection_code: inspectionCode.trim(),
        inspection_date: inspectionDate.trim(),
        result: result.trim() || undefined,
        note: note.trim() || undefined,
      };

      let targetInspectionId = inspectionId;

      if (targetInspectionId) {
        await updateInspection(targetInspectionId, payload);
      } else {
        const created = await createInspection(payload);
        targetInspectionId = created.id;
      }

      await syncDamages(targetInspectionId as number);

      if (!inspectionId) {
        navigation.replace('InspectionDetail', {
          inspectionId: targetInspectionId,
        });
      } else {
        await fetchInspectionDetail();
      }

      setInfoMessage('Lưu giám định thành công');
    } catch (err) {
      console.log('Lỗi lưu giám định:', err);
      setError(
        'Không thể lưu giám định. Vui lòng kiểm tra dữ liệu và thử lại.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteInspection = async () => {
    if (!inspectionId || isReadOnly) {
      return;
    }

    try {
      setCompleting(true);
      setError('');
      setInfoMessage('');
      await completeInspection(inspectionId);
      await fetchInspectionDetail();
      setInfoMessage('Giám định đã chuyển sang hoàn tất');
    } catch (err) {
      console.log('Lỗi hoàn tất giám định:', err);
      setError('Không thể hoàn tất giám định');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <AppLoader message="Đang tải chi tiết giám định..." />
      </SafeAreaView>
    );
  }

  if (error && !inspectionId && !damages.length) {
    return (
      <SafeAreaView style={styles.container}>
        <AppErrorState message={error} onRetry={fetchInspectionDetail} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.status}>
            Trạng thái: {isCompleted ? 'Hoàn tất' : 'Nháp'}
          </Text>
        </View>

        {isReadOnly ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>
              Phiếu đã hoàn tất: không thể thay đổi.
            </Text>
          </View>
        ) : null}

        {error ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{error}</Text>
          </View>
        ) : null}

        {infoMessage ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{infoMessage}</Text>
          </View>
        ) : null}

        <SectionCard title="Thông tin giám định">
          <FormField
            label="Mã container"
            value={containerId}
            onChangeText={setContainerId}
            keyboardType="number-pad"
            readOnly={isReadOnly}
            placeholder="Ví dụ: 1"
          />

          <FormField
            label="Mã người giám định"
            value={surveyorId}
            onChangeText={setSurveyorId}
            keyboardType="number-pad"
            readOnly={isReadOnly}
            placeholder="Ví dụ: 2"
          />

          <FormField
            label="Mã phiếu giám định"
            value={inspectionCode}
            onChangeText={setInspectionCode}
            readOnly={isReadOnly}
            placeholder="GD202603310001"
          />

          <FormField
            label="Ngày giám định (YYYY-MM-DD)"
            value={inspectionDate}
            onChangeText={setInspectionDate}
            readOnly={isReadOnly}
            placeholder="2026-03-31"
          />

          <FormField
            label="Kết quả"
            value={result}
            onChangeText={setResult}
            readOnly={isReadOnly}
            multiline
            placeholder="Kết quả giám định"
          />

          <FormField
            label="Ghi chú"
            value={note}
            onChangeText={setNote}
            readOnly={isReadOnly}
            multiline
            placeholder="Ghi chú"
          />
        </SectionCard>

        <SectionCard title="Danh sách hư hỏng">
          {damages.length === 0 ? (
            <AppEmptyState
              title="Chưa có hư hỏng"
              message="Thêm hư hỏng để mô tả chi tiết hiện trạng container."
            />
          ) : (
            damages.map((damage, index) => (
              <DamageItemCard
                key={damage.temp_id}
                item={damage}
                index={index}
                editable={!isReadOnly}
                onChangeField={updateDamageField}
                onRemove={removeDamageByTempId}
                onAddImage={addImageToDamage}
                onRemoveImage={removeImageFromDamage}
              />
            ))
          )}

          {!isReadOnly ? (
            <PrimaryButton
              title="+ Thêm hư hỏng"
              variant="secondary"
              onPress={addDamage}
            />
          ) : null}
        </SectionCard>

        <SectionCard title="Thao tác">
          <PrimaryButton
            title={saving ? 'Đang lưu...' : 'Lưu giám định'}
            onPress={handleSaveInspection}
            loading={saving}
            disabled={isReadOnly}
          />

          <View style={styles.rowButtons}>
            <PrimaryButton
              title={completing ? 'Đang hoàn tất...' : 'Hoàn tất giám định'}
              onPress={handleCompleteInspection}
              loading={completing}
              disabled={!inspectionId || isReadOnly || saving}
              variant="danger"
              style={styles.rowButtonItem}
            />

            <PrimaryButton
              title="Về danh sách"
              onPress={() => navigation.goBack()}
              variant="ghost"
              style={styles.rowButtonItem}
            />
          </View>
        </SectionCard>

        <View style={styles.footerGap} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default InspectionDetailScreen;
