import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MButton from '../../../components/MButton';
import AppColors from '../../../constants/app-colors';
import {DamageItem} from '../../../types/inspection';
import DamageImageGallery from './DamageImageGallery';
import {formatSeverityLabel} from '../../../utils/inspectionDisplay';

interface DamageCardProps {
  item: DamageItem;
  index: number;
  readonly?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const DamageCard: React.FC<DamageCardProps> = ({
  item,
  index,
  readonly = false,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Hư hỏng #{index + 1}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Vị trí:</Text>
        <Text style={styles.value}>{item.damage_position || '--'}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Loại:</Text>
        <Text style={styles.value}>{item.damage_type || '--'}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Mức độ:</Text>
        <Text style={styles.value}>{formatSeverityLabel(item.severity)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Mô tả:</Text>
        <Text style={styles.value}>{item.description || '--'}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Phương án sửa:</Text>
        <Text style={styles.value}>{item.repair_method || '--'}</Text>
      </View>

      {item.images && item.images.length > 0 && (
        <DamageImageGallery images={item.images} />
      )}

      {!readonly && (
        <View style={styles.actionRow}>
          <MButton
            title="Sửa"
            variant="outline"
            style={styles.actionBtn}
            onPress={onEdit}
          />
          <MButton
            title="Xóa"
            variant="danger"
            style={styles.actionBtn}
            onPress={onDelete}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 12,
  },
  row: {
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.text,
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 20,
  },
  actionRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
  },
});

export default DamageCard;
