import React from 'react';
import { Alert, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MSection from '../../../components/MSection';
import MButton from '../../../components/MButton';
import { DamageItem } from '../../../types/inspection';
import { InspectionStackParamList } from '../../../types/navigations/inspection-navigation';
import DamageCard from './DamageCard';
import inspectionDetailStyle from '../styles/inspection-detail.style';

interface DamageListSectionProps {
  damages: DamageItem[];
  readonly?: boolean;
  navigation: NativeStackNavigationProp<InspectionStackParamList>;
  onDeleteDamage: (index: number) => void;
}

const DamageListSection: React.FC<DamageListSectionProps> = ({
  damages,
  readonly = false,
  navigation,
  onDeleteDamage,
}) => {
  const handleDelete = (index: number) => {
    Alert.alert('Xóa hư hỏng', 'Bạn có chắc muốn xóa hư hỏng này không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => onDeleteDamage(index),
      },
    ]);
  };

  return (
    <MSection title="Danh sách hư hỏng">
      <View style={inspectionDetailStyle.damageHeaderRow}>
        <Text style={inspectionDetailStyle.damageTitle}>
          Tổng số hư hỏng: {damages.length}
        </Text>

        {!readonly && (
          <MButton
            title="Thêm"
            variant="outline"
            onPress={() => navigation.navigate('DamageFormScreen')}
          />
        )}
      </View>

      {damages.length === 0 ? (
        <Text style={inspectionDetailStyle.emptyText}>Chưa có hư hỏng nào</Text>
      ) : (
        damages.map((damage, index) => (
          <DamageCard
            key={`${damage.damage_position}-${index}`}
            item={damage}
            index={index}
            readonly={readonly}
            onEdit={() =>
              navigation.navigate('DamageFormScreen', {
                damageIndex: index,
                damageItem: damage,
                readonly,
              })
            }
            onDelete={() => handleDelete(index)}
          />
        ))
      )}
    </MSection>
  );
};

export default DamageListSection;