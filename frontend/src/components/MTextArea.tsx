import React from 'react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { StyleSheet, Text, TextInput, View, TextInputProps } from 'react-native';
import AppColors from '../constants/app-colors';
import MLabel from './MLabel';

type MTextAreaProps<T extends FieldValues> = TextInputProps & {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  required?: boolean;
  disabled?: boolean;
};

const MTextArea = <T extends FieldValues>({
  control,
  name,
  label,
  rules,
  required = false,
  disabled = false,
  ...props
}: MTextAreaProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.wrapper}>
          {!!label && <MLabel text={label} required={required} />}

          <TextInput
            value={value ? String(value) : ''}
            onChangeText={onChange}
            onBlur={onBlur}
            editable={!disabled}
            multiline
            textAlignVertical="top"
            placeholderTextColor={AppColors.textSecondary}
            style={[
              styles.input,
              disabled && styles.disabledInput,
              !!error && styles.errorInput,
            ]}
            {...props}
          />

          {!!error?.message && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  input: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: AppColors.white,
    fontSize: 15,
    color: AppColors.text,
  },
  disabledInput: {
    backgroundColor: '#F1F5F9',
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
});

export default MTextArea;