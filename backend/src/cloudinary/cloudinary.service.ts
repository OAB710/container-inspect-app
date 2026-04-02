import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    // If CLOUDINARY_URL is set, use it directly (Cloudinary SDK understands this format)
    if (process.env.CLOUDINARY_URL) {
      cloudinary.config({
        secure: true,
      });
    } else {
      // Otherwise, use individual env variables
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    }
  }

  async uploadFile(file: Express.Multer.File, folder = 'container-inspection') {
    return new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            console.error('❌ [Cloudinary] File upload failed:', error);
            return reject(error);
          }
          if (result?.secure_url) {
            console.log(
              '✅ [Cloudinary] File upload successful:',
              result.secure_url,
            );
            resolve(result);
          } else {
            console.error(
              '❌ [Cloudinary] No secure_url in file upload result',
            );
            reject(new Error('No secure_url in Cloudinary response'));
          }
        },
      );

      stream.end(file.buffer);
    });
  }

  async deleteFile(publicId: string) {
    return cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });
  }
}
