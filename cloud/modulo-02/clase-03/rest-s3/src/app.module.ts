import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { S3Module } from "./s3/s3.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        S3Module,
    ],
})
export class AppModule {}
