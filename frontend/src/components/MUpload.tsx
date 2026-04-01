import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import MButton from './MButton';
import AppColors from '../constants/app-colors';
import { DamageImage } from '../types/inspection';

interface MUploadProps {
  images: DamageImage[];
  readonly?: boolean;
  onPickImage?: () => void;
  onOpenCamera?: () => void;
  onRemoveImage?: (index: number) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
}

const MUpload: React.FC<MUploadProps> = ({
  images,
  readonly = false,
  onPickImage,
  onOpenCamera,
  onRemoveImage,
  onMoveUp,
  onMoveDown,
}) => {
  return (
    <View>
      {!readonly && (
        <>
          <MButton
            title="Chụp ảnh"
            variant="outline"
            onPress={onOpenCamera}
          />
          <View style={{ height: 12 }} />

          <MButton
            title="Chọn ảnh từ thư viện"
            variant="outline"
            onPress={onPickImage}
          />
          <View style={{ height: 12 }} />
        </>
      )}

      {images.length === 0 ? (
        <Text style={styles.emptyText}>Chưa có ảnh nào</Text>
      ) : (
        images.map((image, index) => {
          const imageUri = image.uri || image.image_url;

          return (
            <View key={`${image.fileName || image.image_name}-${index}`} style={styles.item}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.preview} />
              ) : (
                <View style={styles.noPreview}>
                  <Text style={styles.noPreviewText}>Không có preview</Text>
                </View>
              )}

              <View style={styles.info}>
                <Text style={styles.order}>Thứ tự: {index + 1}</Text>

                <Text style={styles.name} numberOfLines={2}>
                  {image.fileName || image.image_name || `Ảnh ${index + 1}`}
                </Text>

                {!readonly && (
                  <>
                    <View style={styles.actionRow}>
                      <MButton
                        title="Lên"
                        variant="outline"
                        style={styles.flexBtn}
                        onPress={() => onMoveUp?.(index)}
                        disabled={index === 0}
                      />
                      <MButton
                        title="Xuống"
                        variant="outline"
                        style={styles.flexBtn}
                        onPress={() => onMoveDown?.(index)}
                        disabled={index === images.length - 1}
                      />
                    </View>

                    <View style={{ height: 10 }} />

                    <MButton
                      title="Xóa ảnh"
                      variant="danger"
                      onPress={() => onRemoveImage?.(index)}
                    />
                  </>
                )}
              </View>
            </View>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyText: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  item: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#E2E8F0',
  },
  noPreview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPreviewText: {
    color: AppColors.textSecondary,
    fontSize: 14,
  },
  info: {
    gap: 10,
  },
  order: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.primary,
  },
  name: {
    fontSize: 14,
    color: AppColors.text,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  flexBtn: {
    flex: 1,
  },
});

export default MUpload;