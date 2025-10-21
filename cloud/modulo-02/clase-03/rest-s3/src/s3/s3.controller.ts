import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    UseInterceptors,
    UploadedFiles,
    UploadedFile,
    Body,
    Query,
    BadRequestException,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { S3Service } from "./s3.service";
import {
    S3File,
    PresignedUrlResponse,
} from "./interfaces/file-upload.interface";

@Controller("s3")
export class S3Controller {
    constructor(private readonly s3Service: S3Service) {}

    @Post("upload")
    @UseInterceptors(FileInterceptor("file"))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body("folder") folder?: string,
    ): Promise<S3File> {
        if (!file) {
            throw new BadRequestException("No file provided");
        }

        return this.s3Service.uploadFile(
            {
                fieldname: file.fieldname,
                originalname: file.originalname,
                encoding: file.encoding,
                mimetype: file.mimetype,
                buffer: file.buffer,
                size: file.size,
            },
            folder,
        );
    }

    @Post("upload-multiple")
    @UseInterceptors(FilesInterceptor("files", 10)) // Máximo 10 archivos
    async uploadMultipleFiles(
        @UploadedFiles() files: Express.Multer.File[],
        @Body("folder") folder?: string,
    ): Promise<S3File[]> {
        if (!files || files.length === 0) {
            throw new BadRequestException("No files provided");
        }

        const uploadFiles = files.map((file) => ({
            fieldname: file.fieldname,
            originalname: file.originalname,
            encoding: file.encoding,
            mimetype: file.mimetype,
            buffer: file.buffer,
            size: file.size,
        }));

        return this.s3Service.uploadMultipleFiles(uploadFiles, folder);
    }

    @Get("presigned-url")
    async generatePresignedUrl(
        @Query("key") key: string,
        @Query("expiresIn") expiresIn: string,
    ): Promise<PresignedUrlResponse> {
        if (!key) {
            throw new BadRequestException("Key is required");
        }

        return this.s3Service.generatePresignedUrl(
            key,
            parseInt(expiresIn) || 3600,
        );
    }

    @Get("upload-presigned-url")
    async generateUploadPresignedUrl(
        @Query("key") key: string,
        @Query("contentType") contentType: string = "application/octet-stream",
        @Query("expiresIn") expiresIn: string,
    ): Promise<PresignedUrlResponse> {
        if (!key) {
            throw new BadRequestException("Key is required");
        }

        return this.s3Service.generateUploadPresignedUrl(
            key,
            contentType,
            parseInt(expiresIn) || 3600,
        );
    }

    @Get("files")
    async listFiles(@Query("prefix") prefix?: string): Promise<S3File[]> {
        return this.s3Service.listFiles(prefix);
    }

    @Delete("files/:key")
    async deleteFile(@Param("key") key: string): Promise<{ message: string }> {
        await this.s3Service.deleteFile(key);
        return { message: "File deleted successfully" };
    }

    @Get("files/:key")
    async getFile(@Param("key") key: string): Promise<{ url: string }> {
        const presignedUrl = await this.s3Service.generatePresignedUrl(
            key,
            3600,
        );
        return { url: presignedUrl.url };
    }
}
