import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { randomUUID } from "crypto";
import { AcceptLanguageResolver, I18nModule } from "nestjs-i18n";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { APP_FILTER } from "@nestjs/core";
import { typeOrmConfig } from "./core/database/typeorm.config";
import { HttpExceptionFilter } from "./core/http/filters/http-exception.filter";
import { PassengerModule } from "./features/passengers/passenger.module";
import { MenuModule } from "./features/menu/menu.module";
import { AddressModule } from "./features/addresses/address.module";
import { WebsocketsModule } from "./features/websockets/websockets.module";

const isDebug = process.env.NODE_DEBUG === "true";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        LoggerModule.forRoot({
            pinoHttp: {
                level: isDebug ? "debug" : "info",
                genReqId: (req) => {
                    return (
                        req.headers["x-request-id"]?.toString() || randomUUID()
                    );
                },
                customProps: (req) => {
                    return {
                        requestId: req.id,
                    };
                },
                transport: isDebug
                    ? {
                          target: "pino-pretty",
                          options: {
                              colorize: true,
                              levelFirst: true,
                              translateTime: "SYS:standard",
                          },
                      }
                    : undefined,
            },
        }),
        I18nModule.forRootAsync({
            useFactory: () => ({
                fallbackLanguage: "es",
                loaderOptions: {
                    path: join(__dirname, "/core/i18n/"),
                    watch: true,
                },
            }),
            resolvers: [
                {
                    use: AcceptLanguageResolver,
                    options: { matchType: "strict" },
                },
            ],
        }),
        TypeOrmModule.forRoot(typeOrmConfig),
        PassengerModule,
        MenuModule,
        AddressModule,
        WebsocketsModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {}
