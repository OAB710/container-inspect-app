import React, {useMemo} from 'react';
import {Control, useWatch} from 'react-hook-form';
import {StyleSheet, Text, View} from 'react-native';
import MSection from '../../../components/MSection';
import MInput from '../../../components/MInput';
import MTextArea from '../../../components/MTextArea';
import MDateTime from '../../../components/MDateTime';
import MDropdown from '../../../components/MDropdown';
import {
  InspectionFormValues,
  Container,
  Surveyor,
} from '../../../types/inspection';
import {useContainerOptions} from '../../../queries/useContainer';
import {useSurveyorOptions} from '../../../queries/useSurveyor';
import AppColors from '../../../constants/app-colors';
import {useAuthStore} from '../../../stores/authStore';
import {formatContainerStatusLabel} from '../../../utils/inspectionDisplay';

interface InspectionInfoFormProps {
  control: Control<InspectionFormValues>;
  readonly?: boolean;
  container?: Container;
  surveyor?: Surveyor;
  canChooseSurveyor?: boolean;
}

const InspectionInfoForm: React.FC<InspectionInfoFormProps> = ({
  control,
  readonly = false,
  container,
  surveyor,
  canChooseSurveyor = false,
}) => {
  const currentUser = useAuthStore(state => state.user);
  const containerQuery = useContainerOptions();
  const surveyorQuery = useSurveyorOptions(undefined, canChooseSurveyor);
  const containerId = useWatch({control, name: 'container_id'});

  const currentUserLabel =
    currentUser?.full_name || currentUser?.username || 'Người dùng';
  const currentUserMeta = currentUser?.email || currentUser?.username || '--';
  const selectedContainer = useMemo(() => {
    if (!containerId) return undefined;
    return containerQuery.data.find(
      item => String(item.id) === String(containerId),
    );
  }, [containerId, containerQuery.data]);

  const renderContainerSummary = () => {
    const sourceContainer = container || selectedContainer;

    if (!sourceContainer) {
      if (containerId) {
        return (
          <View style={styles.readonlyField}>
            <Text style={styles.readonlyLabel}>Số container</Text>
            <Text style={styles.readonlyValue}>
              Đang tải thông tin container...
            </Text>
          </View>
        );
      }

      return null;
    }

    return (
      <View style={styles.readonlyField}>
        <Text style={styles.readonlyLabel}>Số container</Text>
        <Text style={styles.readonlyValue}>
          {sourceContainer.container_no} - {sourceContainer.container_type} (
          {sourceContainer.container_size}ft)
        </Text>
        <Text style={styles.readonlySubText}>
          Trạng thái: {formatContainerStatusLabel(sourceContainer.status)}
        </Text>
      </View>
    );
  };

  // Read-only display for container
  if (readonly && container) {
    return (
      <MSection title="Thông tin giám định">
        <View style={styles.readonlyField}>
          <Text style={styles.readonlyLabel}>Số container</Text>
          <Text style={styles.readonlyValue}>
            {container.container_no} - {container.container_type} (
            {container.container_size}ft)
          </Text>
          <Text style={styles.readonlySubText}>
            Trạng thái: {formatContainerStatusLabel(container.status)}
          </Text>
        </View>

        <View style={styles.readonlyField}>
          <Text style={styles.readonlyLabel}>Người giám định</Text>
          <Text style={styles.readonlyValue}>
            {surveyor?.full_name || 'Chưa có'}
            {surveyor?.email && (
              <Text style={styles.readonlySubText}> ({surveyor.email})</Text>
            )}
          </Text>
        </View>

        <MInput
          control={control}
          name="inspection_code"
          label="Mã giám định"
          placeholder="Mã được tự động tạo"
          required
          disabled={true}
          rules={{
            required: 'Vui lòng nhập mã giám định',
          }}
        />

        <MDateTime
          control={control}
          name="inspection_date"
          label="Ngày giám định"
          required
          disabled={true}
        />

        <MTextArea
          control={control}
          name="result"
          label="Kết quả giám định"
          placeholder="Nhập kết quả giám định"
          required
          disabled={readonly}
          rules={{
            required: 'Vui lòng nhập kết quả giám định',
          }}
        />

        <MTextArea
          control={control}
          name="note"
          label="Ghi chú"
          placeholder="Nhập ghi chú"
          disabled={readonly}
        />
      </MSection>
    );
  }

  // Editable form with dropdowns
  return (
    <MSection title="Thông tin giám định">
      <MDropdown
        control={control}
        name="container_id"
        label="Số container"
        placeholder={
          containerQuery.loading ? 'Đang tải container...' : 'Chọn container'
        }
        required
        disabled={readonly || containerQuery.loading}
        disabledOptionAlertTitle="Container không thể chọn"
        options={containerQuery.options}
        rules={{
          required: 'Vui lòng chọn container',
        }}
      />

      <Text style={styles.containerHint}>
        Chỉ container ở trạng thái "Đã giám định" là không thể chọn.
      </Text>

      {renderContainerSummary()}

      {canChooseSurveyor ? (
        <MDropdown
          control={control}
          name="surveyor_id"
          label="Người giám định"
          placeholder={
            surveyorQuery.loading
              ? 'Đang tải người giám định...'
              : 'Chọn người giám định'
          }
          required
          disabled={readonly || surveyorQuery.loading}
          options={surveyorQuery.options}
          rules={{
            required: 'Vui lòng chọn người giám định',
          }}
        />
      ) : (
        <View style={styles.readonlyField}>
          <Text style={styles.readonlyLabel}>Người giám định</Text>
          <Text style={styles.readonlyValue}>{currentUserLabel}</Text>
          <Text style={styles.readonlySubText}>{currentUserMeta}</Text>
        </View>
      )}

      <MInput
        control={control}
        name="inspection_code"
        label="Mã giám định"
        placeholder="Mã được tự động tạo"
        required
        disabled={true}
        rules={{
          required: 'Vui lòng nhập mã giám định',
        }}
      />

      <MDateTime
        control={control}
        name="inspection_date"
        label="Ngày giám định"
        required
        disabled={true}
      />

      <MTextArea
        control={control}
        name="result"
        label="Kết quả giám định"
        placeholder="Nhập kết quả giám định"
        required
        disabled={readonly}
        rules={{
          required: 'Vui lòng nhập kết quả giám định',
        }}
      />

      <MTextArea
        control={control}
        name="note"
        label="Ghi chú"
        placeholder="Nhập ghi chú"
        disabled={readonly}
      />
    </MSection>
  );
};

const styles = StyleSheet.create({
  readonlyField: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  readonlyLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.text,
    marginBottom: 4,
  },
  readonlyValue: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 20,
  },
  readonlySubText: {
    fontSize: 12,
    color: '#999',
  },
  containerHint: {
    marginTop: -8,
    marginBottom: 12,
    fontSize: 12,
    color: AppColors.textSecondary,
  },
});

export default InspectionInfoForm;
