/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import AppError from '../error/AppError';
import { StatusCodes } from 'http-status-codes';
import fs from 'fs/promises';

cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.cloud_api_key,
  api_secret: config.cloud_api_secret,
});

export const uploadImage = async (imageName: string, path: string) => {
  try {
    const imageLink = await cloudinary.uploader.upload(path, {
      public_id: imageName,
    });
    if (imageLink?.secure_url) {
      await fs.unlink(path);
      console.log('file deleted successfully');
    }
    return imageLink;
  } catch (error: any) {
    throw new AppError(StatusCodes.BAD_GATEWAY, error || 'image upload faild');
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file?.originalname);
  },
});

export const upload = multer({ storage: storage });
