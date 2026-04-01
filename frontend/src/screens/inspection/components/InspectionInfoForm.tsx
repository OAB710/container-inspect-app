import React from 'react';
import {Control, FieldValues} from 'react-hook-form';
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

interface InspectionInfoFormProps {
  control: Control<InspectionFormValues>;
  readonly?: boolean;
  container?: Container;
  surveyor?: Surveyor;
}

const InspectionInfoForm: React.FC<InspectionInfoFormProps> = ({
  control,
  readonly = false,
  container,
  surveyor,
}) => {
  const containerQuery = useContainerOptions();
  const surveyorQuery = useSurveyorOptions();

  // Read-only display for container
  if (readonly && container) {
    return (
      <MSection title="Thông tin giám định">
        <View style={styles.readonlyField}>
          <Text style={styles.readonlyLabel}>Container</Text>
          <Text style={styles.readonlyValue}>
            {container.container_no} - {container.container_type} (
            {container.container_size}ft)
          </Text>
        </View>

        <View style={styles.readonlyField}>
          <Text style={styles.readonlyLabel}>Người giám định</Text>
          <Text style={styles.readonlyValue}>
            {surveyor?.full_name || 'N/A'}
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
          disabled={readonly}
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
        label="Container"
        placeholder={
          containerQuery.loading ? 'Đang tải container...' : 'Chọn container'
        }
        required
        disabled={readonly || containerQuery.loading}
        options={containerQuery.options}
        rules={{
          required: 'Vui lòng chọn container',
        }}
      />

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
        disabled={readonly}
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
});

export default InspectionInfoForm;
