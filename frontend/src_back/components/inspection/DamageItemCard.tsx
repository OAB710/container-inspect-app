import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {
  DamageImage,
  DamageSeverity,
  EditableDamage,
} from '../../types/inspection.types';
import FormField from './FormField';
import PrimaryButton from './PrimaryButton';
import styles from './DamageItemCard.styles';

type EditableDamageField =
  | 'damage_position'
  | 'damage_type'
  | 'severity'
  | 'description'
  | 'repair_method';

interface DamageItemCardProps {
  item: EditableDamage;
  index: number;
  editable: boolean;
  onChangeField: (
    tempId: string,
    field: EditableDamageField,
    value: string,
  ) => void;
  onRemove: (tempId: string) => void;
  onAddImage: (tempId: string, localUri: string) => void;
  onRemoveImage: (tempId: string, image: DamageImage) => void;
}

function DamageItemCard({
  item,
  index,
  editable,
  onChangeField,
  onRemove,
  onAddImage,
  onRemoveImage,
}: DamageItemCardProps): JSX.Element {
  const [newImageUri, setNewImageUri] = React.useState<string>('');

  const pushImage = () => {
    if (!newImageUri.trim()) {
      return;
    }

    onAddImage(item.temp_id, newImageUri.trim());
    setNewImageUri('');
  };

  const severityToLabel: Record<DamageSeverity, string> = {
    low: 'Thấp',
    medium: 'Trung bình',
    high: 'Cao',
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>Hư hỏng #{index + 1}</Text>
        {editable ? (
          <Pressable onPress={() => onRemove(item.temp_id)}>
            <Text style={styles.removeText}>Xóa</Text>
          </Pressable>
        ) : null}
      </View>

      <FormField
        label="Vị trí hư hỏng"
        value={item.damage_position}
        onChangeText={value =>
          onChangeField(item.temp_id, 'damage_position', value)
        }
        readOnly={!editable}
        placeholder="Ví dụ: Cửa sau"
      />

      <FormField
        label="Loại hư hỏng"
        value={item.damage_type}
        onChangeText={value =>
          onChangeField(item.temp_id, 'damage_type', value)
        }
        readOnly={!editable}
        placeholder="Ví dụ: Móp méo"
      />

      <FormField
        label="Mức độ (low/medium/high)"
        value={item.severity}
        onChangeText={value => onChangeField(item.temp_id, 'severity', value)}
        readOnly={!editable}
        placeholder="low | medium | high"
      />

      {!editable ? (
        <Text style={styles.imageName}>
          Mức độ hiển thị: {severityToLabel[item.severity]}
        </Text>
      ) : null}

      <FormField
        label="Mô tả"
        value={item.description || ''}
        onChangeText={value =>
          onChangeField(item.temp_id, 'description', value)
        }
        readOnly={!editable}
        multiline
        placeholder="Mô tả chi tiết"
      />

      <FormField
        label="Phương án sửa chữa"
        value={item.repair_method || ''}
        onChangeText={value =>
          onChangeField(item.temp_id, 'repair_method', value)
        }
        readOnly={!editable}
        multiline
        placeholder="Đề xuất sửa chữa"
      />

      <Text style={styles.imageName}>Ảnh hư hỏng</Text>
      {item.images.length === 0 ? (
        <Text style={styles.imageUrl}>Chưa có ảnh</Text>
      ) : (
        item.images.map((image, imageIndex) => (
          <View
            key={`${image.id ?? 'new'}-${imageIndex}`}
            style={styles.imageItem}>
            <Text style={styles.imageName}>
              {image.image_name || `image-${imageIndex + 1}.jpg`}
            </Text>
            <Text style={styles.imageUrl}>
              {image.local_uri || image.image_url}
            </Text>
            {editable ? (
              <PrimaryButton
                title="Xóa ảnh"
                variant="ghost"
                onPress={() => onRemoveImage(item.temp_id, image)}
              />
            ) : null}
          </View>
        ))
      )}

      {editable ? (
        <View style={styles.addImageWrap}>
          <FormField
            label="URI ảnh mới"
            value={newImageUri}
            onChangeText={setNewImageUri}
            placeholder="file:///... hoặc content://..."
          />
          <PrimaryButton
            title="Thêm ảnh tạm"
            variant="secondary"
            onPress={pushImage}
          />
        </View>
      ) : null}
    </View>
  );
}

export default DamageItemCard;
