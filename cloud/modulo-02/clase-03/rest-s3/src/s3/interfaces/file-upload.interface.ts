export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface S3File {
  key: string;
  url: string;
  size: number;
  mimetype: string;
  lastModified?: Date;
}

export interface PresignedUrlResponse {
  url: string;
  key: string;
  expiresIn: number;
}
