import React, { useState } from 'react';
import { Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import * as ImagePicker from 'react-native-image-picker';
import MainLayout from '../../components/MainLayout';
import MSection from '../../components/MSection';
import MButton from '../../components/MButton';
import MInput from '../../components/MInput';
import MTextArea from '../../components/MTextArea';
import MDropdown from '../../components/MDropdown';
import MUpload from '../../components/MUpload';
import { DAMAGE_TYPE_OPTIONS, SEVERITY_OPTIONS } from '../../constants/app';
import { DamageFormValues, DamageImage } from '../../types/inspection';
import { InspectionStackParamList } from '../../types/navigations/inspection-navigation';
import { useDamageDraftStore } from '../../stores/damageDraftStore';

type Props = NativeStackScreenProps<InspectionStackParamList, 'DamageFormScreen'>;

const DamageFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const damageIndex = route.params?.damageIndex;
  const damageItem = route.params?.damageItem;
  const readonly = route.params?.readonly || false;

  const { addDamage, updateDamage } = useDamageDraftStore();
  const [images, setImages] = useState<DamageImage[]>(damageItem?.images || []);

  const { control, handleSubmit } = useForm<DamageFormValues>({
    defaultValues: {
      damage_position: damageItem?.damage_position || '',
      damage_type: damageItem?.damage_type || '',
      severity: damageItem?.severity || 'medium',
      description: damageItem?.description || '',
      repair_method: damageItem?.repair_method || '',
    },
  });

  const mapAssetsToImages = (assets?: ImagePicker.Asset[]): DamageImage[] => {
    return (assets || []).map(asset => ({
      uri: asset.uri,
      fileName: asset.fileName || `image-${Date.now()}.jpg`,
      type: asset.type || 'image/jpeg',
      is_local: true,
    }));
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 0,
      });

      if (result.didCancel) return;

      const mappedImages = mapAssetsToImages(result.assets);
      setImages(prev => [...prev, ...mappedImages]);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chọn ảnh');
    }
  };

  const handleOpenCamera = async () => {
    try {
      const result = await ImagePicker.launchCamera({
        mediaType: 'photo',
        saveToPhotos: true,
      });

      if (result.didCancel) return;

      const mappedImages = mapAssetsToImages(result.assets);
      setImages(prev => [...prev, ...mappedImages]);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chụp ảnh');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;

    setImages(prev => {
      const cloned = [...prev];
      [cloned[index - 1], cloned[index]] = [cloned[index], cloned[index - 1]];
      return cloned;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;

    setImages(prev => {
      const cloned = [...prev];
      [cloned[index], cloned[index + 1]] = [cloned[index + 1], cloned[index]];
      return cloned;
    });
  };

  const onSubmit = (values: DamageFormValues) => {
    const payload = {
      ...values,
      images,
    };

    if (typeof damageIndex === 'number') {
      updateDamage(damageIndex, payload);
    } else {
      addDamage(payload);
    }

    Alert.alert('Thành công', 'Đã lưu hư hỏng tạm');
    navigation.goBack();
  };

  return (
    <MainLayout>
      <MSection title="Thông tin hư hỏng">
        <MInput
          control={control}
          name="damage_position"
          label="Vị trí hư hỏng"
          placeholder="Ví dụ: Cửa sau"
          required
          disabled={readonly}
          rules={{
            required: 'Vui lòng nhập vị trí hư hỏng',
          }}
        />

        <MDropdown
          control={control}
          name="damage_type"
          label="Loại hư hỏng"
          placeholder="Chọn loại hư hỏng"
          required
          disabled={readonly}
          options={DAMAGE_TYPE_OPTIONS}
          rules={{
            required: 'Vui lòng chọn loại hư hỏng',
          }}
        />

        <MDropdown
          control={control}
          name="severity"
          label="Mức độ hư hỏng"
          placeholder="Chọn mức độ"
          required
          disabled={readonly}
          options={SEVERITY_OPTIONS}
          rules={{
            required: 'Vui lòng chọn mức độ hư hỏng',
          }}
        />

        <MTextArea
          control={control}
          name="description"
          label="Mô tả chi tiết"
          placeholder="Nhập mô tả chi tiết"
          required
          disabled={readonly}
          rules={{
            required: 'Vui lòng nhập mô tả',
          }}
        />

        <MTextArea
          control={control}
          name="repair_method"
          label="Phương án sửa chữa"
          placeholder="Nhập phương án sửa chữa"
          required
          disabled={readonly}
          rules={{
            required: 'Vui lòng nhập phương án sửa chữa',
          }}
        />
      </MSection>

      <MSection title="Danh sách ảnh">
        <MUpload
          images={images}
          readonly={readonly}
          onPickImage={handlePickImage}
          onOpenCamera={handleOpenCamera}
          onRemoveImage={handleRemoveImage}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
        />
      </MSection>

      {!readonly && (
        <MButton title="Lưu hư hỏng tạm" onPress={handleSubmit(onSubmit)} />
      )}
    </MainLayout>
  );
};

export default DamageFormScreen;