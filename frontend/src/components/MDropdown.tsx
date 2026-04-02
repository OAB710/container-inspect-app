import React, {useMemo, useState} from 'react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AppColors from '../constants/app-colors';
import MLabel from './MLabel';
import {SelectOption} from '../types/common';

export type DropdownOption = SelectOption;

type MDropdownProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  required?: boolean;
  disabled?: boolean;
  disabledOptionAlertTitle?: string;
};

const MDropdown = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Chọn dữ liệu',
  options,
  rules,
  required = false,
  disabled = false,
  disabledOptionAlertTitle = 'Không thể chọn',
}: MDropdownProps<T>) => {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const normalizeStatus = (value?: string) => {
    if (!value) return '';
    return value.trim().toLowerCase();
  };

  const getStatusBadgeStyle = (status?: string) => {
    const normalized = normalizeStatus(status);
    if (['empty', 'available', 'active', 'surveyor'].includes(normalized)) {
      return styles.statusSuccess;
    }

    if (['repairing', 'maintenance', 'busy', 'draft'].includes(normalized)) {
      return styles.statusWarning;
    }

    if (['damaged', 'blocked', 'inactive'].includes(normalized)) {
      return styles.statusDanger;
    }

    return styles.statusDefault;
  };

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(option => {
      const haystack = [
        option.label,
        option.subtitle || '',
        option.meta || '',
        option.status || '',
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [options, searchQuery]);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        const selectedLabel = useMemo(() => {
          const found = options.find(item => item.value === value);
          return found?.label || '';
        }, [options, value]);

        return (
          <View style={styles.wrapper}>
            {!!label && <MLabel text={label} required={required} />}

            <Pressable
              onPress={() => {
                if (!disabled) {
                  setVisible(true);
                  setSearchQuery('');
                }
              }}
              style={[
                styles.input,
                disabled && styles.disabledInput,
                !!error && styles.errorInput,
              ]}>
              <Text
                style={[
                  styles.inputText,
                  !selectedLabel && styles.placeholderText,
                  disabled && styles.disabledText,
                ]}>
                {selectedLabel || placeholder}
              </Text>
              <Text style={styles.arrow}>▾</Text>
            </Pressable>

            {!!error?.message && (
              <Text style={styles.errorText}>{error.message}</Text>
            )}

            <Modal
              visible={visible}
              transparent
              animationType="fade"
              onRequestClose={() => setVisible(false)}>
              <Pressable
                style={styles.overlay}
                onPress={() => setVisible(false)}>
                <Pressable
                  style={styles.modalCard}
                  onPress={e => e.stopPropagation()}>
                  <Text style={styles.modalTitle}>
                    {label || 'Chọn dữ liệu'}
                  </Text>

                  <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm..."
                    placeholderTextColor={AppColors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCorrect={false}
                    spellCheck={false}
                  />

                  <ScrollView
                    showsVerticalScrollIndicator
                    persistentScrollbar
                    scrollIndicatorInsets={{right: 2}}
                    contentContainerStyle={styles.optionsListContent}
                    style={styles.optionsList}>
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map(option => {
                        const active = option.value === value;
                        const optionDisabled = Boolean(option.disabled);

                        return (
                          <Pressable
                            key={option.value}
                            style={[
                              styles.optionItem,
                              optionDisabled && styles.optionItemDisabled,
                              active && styles.optionItemActive,
                            ]}
                            onPress={() => {
                              if (optionDisabled) {
                                Alert.alert(
                                  disabledOptionAlertTitle,
                                  option.disabledReason ||
                                    'Giá trị này hiện không thể chọn.',
                                );
                                return;
                              }

                              onChange(option.value);
                              setVisible(false);
                              setSearchQuery('');
                            }}>
                            <View style={styles.optionTopRow}>
                              <Text
                                style={[
                                  styles.optionText,
                                  active && styles.optionTextActive,
                                  optionDisabled && styles.optionTextDisabled,
                                ]}
                                numberOfLines={1}>
                                {option.label}
                              </Text>

                              {!!option.meta && (
                                <View
                                  style={[
                                    styles.statusBadge,
                                    getStatusBadgeStyle(
                                      option.status || option.meta,
                                    ),
                                    active && styles.statusBadgeActive,
                                  ]}>
                                  <Text style={styles.statusText}>
                                    {option.meta}
                                  </Text>
                                </View>
                              )}
                            </View>

                            {!!option.subtitle && (
                              <Text
                                style={[
                                  styles.optionSubtitle,
                                  active && styles.optionSubtitleActive,
                                  optionDisabled &&
                                    styles.optionSubtitleDisabled,
                                ]}
                                numberOfLines={1}>
                                {option.subtitle}
                              </Text>
                            )}
                          </Pressable>
                        );
                      })
                    ) : (
                      <Text style={styles.emptyText}>
                        Không tìm thấy kết quả
                      </Text>
                    )}
                  </ScrollView>
                </Pressable>
              </Pressable>
            </Modal>
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
    backgroundColor: AppColors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 15,
    color: AppColors.text,
    flex: 1,
    marginRight: 12,
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
  arrow: {
    fontSize: 16,
    color: AppColors.textSecondary,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    maxHeight: '70%',
    backgroundColor: AppColors.white,
    borderRadius: 20,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    color: AppColors.text,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionsListContent: {
    paddingRight: 10,
  },
  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.white,
  },
  optionItemDisabled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.85,
  },
  optionItemActive: {
    backgroundColor: AppColors.primaryLight,
    borderColor: AppColors.primary,
  },
  optionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  optionText: {
    fontSize: 15,
    color: AppColors.text,
    flex: 1,
  },
  optionTextActive: {
    color: AppColors.primary,
    fontWeight: '700',
  },
  optionTextDisabled: {
    color: '#64748B',
  },
  optionSubtitle: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginTop: 4,
  },
  optionSubtitleActive: {
    color: AppColors.primary,
    opacity: 0.9,
  },
  optionSubtitleDisabled: {
    color: '#94A3B8',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusBadgeActive: {
    opacity: 0.9,
  },
  statusDefault: {
    backgroundColor: '#EEF2FF',
  },
  statusSuccess: {
    backgroundColor: '#DCFCE7',
  },
  statusWarning: {
    backgroundColor: '#FEF3C7',
  },
  statusDanger: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.text,
    textTransform: 'capitalize',
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default MDropdown;
