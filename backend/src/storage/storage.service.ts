import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import * as path from 'path';
import 'multer';

const ALLOWED_MIME_TYPES = ['image/jpeg','image/jpg','image/png','image/webp'];
const MAX_FILE_SIZE_MB   = 10;

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3: S3Client | null = null;
  private bucket: string;
  private cdnUrl: string;

  constructor(private config: ConfigService) {
    const accessKey = config.get<string>('STORAGE_ACCESS_KEY');
    const secretKey = config.get<string>('STORAGE_SECRET_KEY');
    const region    = config.get<string>('STORAGE_REGION', 'ap-south-1');
    const endpoint  = config.get<string>('STORAGE_ENDPOINT');

    this.bucket = config.get<string>('STORAGE_BUCKET', 'cleancare-uploads');
    this.cdnUrl = config.get<string>('STORAGE_CDN_URL', '');

    if (accessKey && secretKey && !accessKey.startsWith('replace_')) {
      this.s3 = new S3Client({
        region,
        credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
        ...(endpoint ? { endpoint } : {}),
      });
    } else {
      this.logger.warn('S3 credentials not configured — file uploads will use local fallback');
    }
  }

  async upload(file: Express.Multer.File, folder = 'uploads'): Promise<string> {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Allowed: JPEG, PNG, WebP');
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      throw new BadRequestException(`File too large. Max ${MAX_FILE_SIZE_MB}MB`);
    }

    const ext      = path.extname(file.originalname).toLowerCase();
    const filename = `${folder}/${crypto.randomBytes(16).toString('hex')}${ext}`;

    if (!this.s3) {
      // Dev fallback: return a placeholder URL
      this.logger.debug(`[DEV] File upload skipped: ${filename}`);
      return `/uploads/${filename}`;
    }

    await this.s3.send(new PutObjectCommand({
      Bucket:      this.bucket,
      Key:         filename,
      Body:        file.buffer,
      ContentType: file.mimetype,
      ACL:         'public-read' as any,
    }));

    return this.cdnUrl
      ? `${this.cdnUrl}/${filename}`
      : `https://${this.bucket}.s3.amazonaws.com/${filename}`;
  }

  async delete(url: string): Promise<void> {
    if (!this.s3) return;
    const key = url.split('/').slice(-2).join('/');
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }
}
