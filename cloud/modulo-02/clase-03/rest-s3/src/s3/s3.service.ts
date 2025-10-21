import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
    UploadedFile,
    S3File,
    PresignedUrlResponse,
} from "./interfaces/file-upload.interface";

@Injectable()
export class S3Service {
    private s3Client: S3Client;
    private bucketName: string;

    constructor(private configService: ConfigService) {
        this.bucketName =
            this.configService.get<string>("AWS_S3_BUCKET_NAME") ?? "";

        // Configuración automática con IAM Role - SIN CREDENCIALES
        this.s3Client = new S3Client({
            region: this.configService.get<string>("AWS_REGION") || "us-east-1",
        });
    }

    async uploadFile(file: UploadedFile, folder?: string): Promise<S3File> {
        const key = folder
            ? `${folder}/${Date.now()}-${file.originalname}`
            : `${Date.now()}-${file.originalname}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            Metadata: {
                originalName: file.originalname,
                uploadedAt: new Date().toISOString(),
            },
        });

        await this.s3Client.send(command);

        return {
            key,
            url: `https://${this.bucketName}.s3.${this.configService.get("AWS_REGION")}.amazonaws.com/${key}`,
            size: file.size,
            mimetype: file.mimetype,
        };
    }

    async uploadMultipleFiles(
        files: UploadedFile[],
        folder?: string,
    ): Promise<S3File[]> {
        const uploadPromises = files.map((file) =>
            this.uploadFile(file, folder),
        );
        return Promise.all(uploadPromises);
    }

    async generatePresignedUrl(
        key: string,
        expiresIn: number = 3600,
    ): Promise<PresignedUrlResponse> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        const url = await getSignedUrl(this.s3Client, command, { expiresIn });

        return {
            url,
            key,
            expiresIn,
        };
    }

    async generateUploadPresignedUrl(
        key: string,
        contentType: string,
        expiresIn: number = 3600,
    ): Promise<PresignedUrlResponse> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: contentType,
        });

        const url = await getSignedUrl(this.s3Client, command, { expiresIn });

        return {
            url,
            key,
            expiresIn,
        };
    }

    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        await this.s3Client.send(command);
    }

    async listFiles(prefix?: string): Promise<S3File[]> {
        const command = new ListObjectsV2Command({
            Bucket: this.bucketName,
            Prefix: prefix,
        });

        const response = await this.s3Client.send(command);

        if (!response.Contents) {
            return [];
        }

        return response.Contents.map((item) => ({
            key: item.Key!,
            url: `https://${this.bucketName}.s3.${this.configService.get("AWS_REGION")}.amazonaws.com/${item.Key}`,
            size: item.Size || 0,
            mimetype: "unknown",
            lastModified: item.LastModified,
        }));
    }

    async getFile(key: string): Promise<Buffer> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        const response = await this.s3Client.send(command);

        if (!response.Body) {
            throw new Error("File not found");
        }

        return Buffer.from(await response.Body.transformToByteArray());
    }
}
