import apiInstance from './apiInstance';

const imageApi = {
  /**
   * Upload image file to Cloudinary via backend using FormData
   * @param uri - Local file URI
   * @param fileName - File name
   * @param fileType - MIME type (e.g. 'image/jpeg')
   * @returns Cloudinary URL
   */
  uploadImageFile: async (
    uri: string,
    fileName: string,
    fileType: string = 'image/jpeg',
  ): Promise<string> => {
    try {
      if (!uri || !fileName) {
        throw new Error('Missing uri or fileName');
      }

      console.log('📤 [Frontend] Uploading file:', {
        fileName,
        fileType,
        uri: uri.substring(0, 50),
      });

      // Create FormData
      const formData = new FormData();
      
      // Append file
      formData.append('file', {
        uri,
        type: fileType,
        name: fileName,
      } as any);

      console.log('📬 [Frontend] Sending FormData to /images/upload...');

      const response = (await apiInstance.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })) as { image_url?: string; image_name?: string };

      console.log('📬 [Frontend] Response received:', {
        data: response,
      });

      // Return the Cloudinary URL from backend response
      if (response?.image_url) {
        console.log('✅ [Frontend] Upload successful:', response.image_url);
        return response.image_url;
      }

      throw new Error('No image URL returned from server');
    } catch (error: any) {
      console.error('❌ [Frontend] Image upload error:', error);
      throw error;
    }
  },

  /**
   * Upload multiple image files and return their Cloudinary URLs
   */
  uploadMultipleImageFiles: async (
    images: Array<{ uri: string; fileName: string; type: string }>,
  ): Promise<string[]> => {
    try {
      const uploadPromises = images
        .filter(img => img.uri && img.fileName)
        .map(img => {
          console.log('📸 [Frontend] Queuing upload for:', img.fileName);
          return imageApi.uploadImageFile(img.uri, img.fileName, img.type);
        });

      return Promise.all(uploadPromises);
    } catch (error) {
      console.error('❌ [Frontend] Batch upload error:', error);
      throw error;
    }
  },

  /**
   * Legacy placeholder - kept for backward compatibility
   */
  uploadImage: (
    imagePath: string,
    imageType: string,
  ): Promise<{ image_url: string; image_name: string }> => {
    return Promise.resolve({
      image_url: imagePath,
      image_name: imagePath.split('/').pop() || 'image.jpg',
    });
  },
};

export default imageApi;
