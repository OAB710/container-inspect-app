import React, { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppColors from '../constants/app-colors';
import MLabel from './MLabel';

type MDateTimeProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
};

const MDateTime = <T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  disabled = false,
}: MDateTimeProps<T>) => {
  const [open, setOpen] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: 'Vui lòng chọn ngày giám định',
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const currentDate = (() => {
          if (!value) return new Date();
          const parsed = new Date(value as string);
          return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
        })();

        const displayValue = value
          ? new Date(value as string).toLocaleString('vi-VN')
          : 'Chọn ngày giờ';

        const handleChange = (_event: any, selectedDate?: Date) => {
          if (Platform.OS === 'android') {
            setOpen(false);
          }
          if (selectedDate) {
            onChange(selectedDate.toISOString());
          }
        };

        return (
          <View style={styles.wrapper}>
            {!!label && <MLabel text={label} required={required} />}

            <Pressable
              style={[
                styles.input,
                disabled && styles.disabledInput,
                !!error && styles.errorInput,
              ]}
              onPress={() => {
                if (!disabled) setOpen(true);
              }}
            >
              <Text
                style={[
                  styles.inputText,
                  !value && styles.placeholderText,
                  disabled && styles.disabledText,
                ]}
              >
                {displayValue}
              </Text>
            </Pressable>

            {!!error?.message && <Text style={styles.errorText}>{error.message}</Text>}

            {open && Platform.OS === 'android' && (
              <DateTimePicker
                value={currentDate}
                mode="datetime"
                display="default"
                onChange={handleChange}
              />
            )}

            {open && Platform.OS === 'ios' && (
              <Modal transparent animationType="slide">
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Pressable onPress={() => setOpen(false)}>
                        <Text style={styles.modalAction}>Đóng</Text>
                      </Pressable>
                      <Pressable onPress={() => setOpen(false)}>
                        <Text style={styles.modalAction}>Xong</Text>
                      </Pressable>
                    </View>

                    <DateTimePicker
                      value={currentDate}
                      mode="datetime"
                      display="spinner"
                      onChange={handleChange}
                      style={styles.iosPicker}
                    />
                  </View>
                </View>
              </Modal>
            )}
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: AppColors.white,
  },
  inputText: {
    fontSize: 15,
    color: AppColors.text,
  },
  placeholderText: {
    color: AppColors.textSecondary,
  },
  disabledInput: {
    backgroundColor: '#F1F5F9',
  },
  disabledText: {
    color: AppColors.textSecondary,
  },
  errorInput: {
    borderColor: AppColors.danger,
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: AppColors.danger,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: AppColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    minHeight: 52,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalAction: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.primary,
  },
  iosPicker: {
    alignSelf: 'center',
  },
});

export default MDateTime;