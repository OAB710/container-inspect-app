import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import {DamageImage} from '../../../types/inspection';
import AppColors from '../../../constants/app-colors';

interface DamageImageGalleryProps {
  images: DamageImage[];
}

const DamageImageGallery: React.FC<DamageImageGalleryProps> = ({images}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  if (!images || images.length === 0) {
    return null;
  }

  const selectedImage =
    selectedImageIndex !== null ? images[selectedImageIndex] : null;
  const imageUrl = selectedImage?.image_url || selectedImage?.uri;

  return (
    <>
      <View style={styles.galleryContainer}>
        <Text style={styles.galleryTitle}>Ảnh hư hỏng ({images.length})</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailScroll}>
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedImageIndex(index)}
              style={styles.thumbnailWrapper}>
              <Image
                source={{
                  uri:
                    image.image_url ||
                    image.uri ||
                    'https://via.placeholder.com/80',
                }}
                style={[
                  styles.thumbnail,
                  selectedImageIndex === index && styles.thumbnailSelected,
                ]}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Modal
        visible={selectedImageIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImageIndex(null)}>
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedImageIndex(null)}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {imageUrl && (
            <Image
              source={{uri: imageUrl}}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}

          <View style={styles.imageInfo}>
            <Text style={styles.imageCounter}>
              {selectedImageIndex !== null
                ? `${selectedImageIndex + 1}/${images.length}`
                : ''}
            </Text>
          </View>

          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={[
                styles.navButton,
                selectedImageIndex === 0 && styles.navButtonDisabled,
              ]}
              onPress={() => {
                if (selectedImageIndex !== null && selectedImageIndex > 0) {
                  setSelectedImageIndex(selectedImageIndex - 1);
                }
              }}
              disabled={selectedImageIndex === 0}>
              <Text style={styles.navButtonText}>← Trước</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navButton,
                selectedImageIndex === images.length - 1 &&
                  styles.navButtonDisabled,
              ]}
              onPress={() => {
                if (
                  selectedImageIndex !== null &&
                  selectedImageIndex < images.length - 1
                ) {
                  setSelectedImageIndex(selectedImageIndex + 1);
                }
              }}
              disabled={selectedImageIndex === images.length - 1}>
              <Text style={styles.navButtonText}>Sau →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  galleryContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    paddingTop: 12,
  },
  galleryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.text,
    marginBottom: 8,
  },
  thumbnailScroll: {
    flexDirection: 'row',
  },
  thumbnailWrapper: {
    marginRight: 8,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  thumbnailSelected: {
    borderWidth: 2,
    borderColor: AppColors.primary || '#007AFF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height - 200,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  imageInfo: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  imageCounter: {
    fontSize: 14,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  navigationButtons: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  navButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DamageImageGallery;
