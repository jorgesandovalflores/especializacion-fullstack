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
    private readonly s3Client: S3Client;
    private readonly bucketName: string;
    private readonly region: string;
    private readonly cdnBaseUrl?: string;

    constructor(private configService: ConfigService) {
        this.bucketName =
            this.configService.get<string>("AWS_S3_BUCKET_NAME") ?? "";
        this.region =
            this.configService.get<string>("AWS_REGION") || "us-east-1";
        this.cdnBaseUrl =
            this.configService.get<string>("CLOUDFRONT_BASE_URL") || undefined;

        // Credenciales implícitas via IAM Role (EC2/ECS/EKS) — SIN claves
        this.s3Client = new S3Client({ region: this.region });
    }

    /** Construye la URL pública usando CDN si está configurado, de lo contrario S3 regional. */
    private buildPublicUrl(key: string): string {
        if (this.cdnBaseUrl) {
            // Asegurar que no queden dobles slashes
            return `${this.cdnBaseUrl.replace(/\/+$/, "")}/${key.replace(/^\/+/, "")}`;
        }
        return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    }

    async uploadFile(file: UploadedFile, folder?: string): Promise<S3File> {
        const key = folder
            ? `${folder}/${Date.now()}-${file.originalname}`
            : `${Date.now()}-${file.originalname}`;

        const put = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            Metadata: {
                originalName: file.originalname,
                uploadedAt: new Date().toISOString(),
            },
        });

        await this.s3Client.send(put);

        return {
            key,
            url: this.buildPublicUrl(key),
            size: file.size,
            mimetype: file.mimetype,
        };
    }

    async uploadMultipleFiles(
        files: UploadedFile[],
        folder?: string,
    ): Promise<S3File[]> {
        return Promise.all(files.map((f) => this.uploadFile(f, folder)));
    }

    async generatePresignedUrl(
        key: string,
        expiresIn = 3600,
    ): Promise<PresignedUrlResponse> {
        const get = new GetObjectCommand({ Bucket: this.bucketName, Key: key });
        const url = await getSignedUrl(this.s3Client, get, { expiresIn });
        return { url, key, expiresIn };
        // Nota: si necesitas presignados “vía CloudFront”, debes implementar Signed URLs/Cookies.
    }

    async generateUploadPresignedUrl(
        key: string,
        contentType: string,
        expiresIn = 3600,
    ): Promise<PresignedUrlResponse> {
        const put = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: contentType,
        });
        const url = await getSignedUrl(this.s3Client, put, { expiresIn });
        return { url, key, expiresIn };
    }

    async deleteFile(key: string): Promise<void> {
        const del = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        await this.s3Client.send(del);
    }

    async listFiles(prefix?: string): Promise<S3File[]> {
        const list = new ListObjectsV2Command({
            Bucket: this.bucketName,
            Prefix: prefix,
        });
        const res = await this.s3Client.send(list);
        if (!res.Contents) return [];
        return res.Contents.map((o) => ({
            key: o.Key!,
            url: this.buildPublicUrl(o.Key!),
            size: o.Size || 0,
            mimetype: "unknown",
            lastModified: o.LastModified,
        }));
    }

    async getFile(key: string): Promise<Buffer> {
        const get = new GetObjectCommand({ Bucket: this.bucketName, Key: key });
        const res = await this.s3Client.send(get);
        if (!res.Body) throw new Error("File not found");
        return Buffer.from(await res.Body.transformToByteArray());
    }
}
