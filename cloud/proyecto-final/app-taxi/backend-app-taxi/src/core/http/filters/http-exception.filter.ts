import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from "@nestjs/common";
import { Response } from "express";
import { I18nService } from "nestjs-i18n";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly i18n: I18nService) {}

    async catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        if (status === 200) {
            return response.status(status).json(exceptionResponse);
        }

        const responseBody: {
            status_code: number;
            message: string;
            errors: Array<{ field: string; message: string }>;
        } = {
            status_code: status,
            message: "Error",
            errors: [],
        };

        if (typeof exceptionResponse === "string") {
            responseBody.message = exceptionResponse;
        } else if (typeof exceptionResponse === "object") {
            const res: any = exceptionResponse;

            if (res.status_code === 422) {
                return response.status(status).json(res);
            }

            if (res.status_code === 500) {
                responseBody.status_code = 500;
            }

            if (Array.isArray(res.message)) {
                responseBody.message = "Error de validación";

                responseBody.errors = await Promise.all(
                    res.message.map(async (error: any) => {
                        if (error.property && error.constraints) {
                            const firstKey = Object.values(
                                error.constraints,
                            )[0] as string;
                            const [key, payloadRaw] = firstKey.split("|");
                            let payload = {};
                            try {
                                payload = JSON.parse(payloadRaw);
                            } catch (_) {}

                            const message = await this.i18n.translate(key, {
                                lang:
                                    request.headers["accept-language"] || "es",
                                args: payload,
                            });

                            return {
                                field: error.property,
                                message,
                            };
                        }

                        // fallback general
                        const rawMessage =
                            typeof error === "string"
                                ? error
                                : "Error desconocido";
                        const [key, payloadRaw] = rawMessage.split("|");
                        let payload = {};
                        try {
                            payload = JSON.parse(payloadRaw);
                        } catch (_) {}

                        const message = await this.i18n.translate(key, {
                            lang: request.headers["accept-language"] || "es",
                            args: payload,
                        });

                        return {
                            field: "general",
                            message,
                        };
                    }),
                );
            } else if (res.message) {
                responseBody.message = res.message;
            }

            if (res.error) {
                responseBody.message = res.error;
            }
        }

        return response.status(status).json(responseBody);
    }
}
