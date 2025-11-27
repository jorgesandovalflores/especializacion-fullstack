import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { JWT } from "google-auth-library";
import { ConfigService } from "@nestjs/config";

interface FcmMessage {
    token: string;
    notification: {
        title: string;
        body: string;
    };
    android?: {
        priority: string;
        notification: {
            sound: string;
            channelId: string;
        };
    };
    apns?: {
        headers: {
            "apns-priority": string;
        };
        payload: {
            aps: {
                sound: string;
                alert: {
                    title: string;
                    body: string;
                };
            };
        };
    };
    webpush?: {
        notification: {
            title: string;
            body: string;
            icon: string;
        };
    };
}

interface FcmRequest {
    message: FcmMessage;
}

interface FcmResponse {
    name: string;
}

@Injectable()
export class FcmRemote {
    private readonly fcmUrl: string;
    private readonly firebaseProjectId: string;
    private readonly firebaseClientEmail: string;
    private readonly firebasePrivateKey: string;
    private readonly jwtClient: JWT;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.firebaseProjectId =
            this.configService.get<string>("FIREBASE_PROJECT_ID") ?? "";
        this.firebaseClientEmail =
            this.configService.get<string>("FIREBASE_CLIENT_EMAIL") ?? "";
        this.firebasePrivateKey =
            this.configService.get<string>("FIREBASE_PRIVATE_KEY") ?? "";

        this.fcmUrl = `https://fcm.googleapis.com/v1/projects/${this.firebaseProjectId}/messages:send`;

        // Crear el cliente JWT una sola vez
        this.jwtClient = new JWT({
            email: this.firebaseClientEmail,
            key: this.firebasePrivateKey.replace(/\\n/g, "\n"),
            scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
        });
    }

    async sendPushByToken(
        token: string,
        title: string,
        body: string,
    ): Promise<boolean> {
        console.log(`# FcmService.sendPushByToken =>`, {
            token,
            title,
            body,
        });

        const iconUrl = `icon-192.png`;

        try {
            const accessToken = await this.generateToken();
            const request: FcmRequest = {
                message: {
                    token,
                    notification: { title, body },
                    android: {
                        priority: "HIGH",
                        notification: {
                            sound: "default",
                            channelId: "default",
                        },
                    },
                    apns: {
                        headers: {
                            "apns-priority": "10",
                        },
                        payload: {
                            aps: {
                                sound: "default",
                                alert: { title, body },
                            },
                        },
                    },
                    webpush: {
                        notification: {
                            title,
                            body,
                            icon: iconUrl,
                        },
                    },
                },
            };

            console.log(`# FcmService.sendPushByToken request =>`, request);

            const response = await firstValueFrom(
                this.httpService.post<FcmResponse>(this.fcmUrl, request, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }),
            );

            console.log(
                `# FcmService.sendPushByToken response =>`,
                response.data,
            );
            return true;
        } catch (error) {
            console.error(`# FcmService.sendPushByToken error =>`, error);
            return false;
        }
    }

    private async generateToken(): Promise<string> {
        try {
            const accessToken = await this.jwtClient.getAccessToken();
            return accessToken?.token || "";
        } catch (error) {
            console.error(`# FcmService.generateToken error =>`, error);
            throw error;
        }
    }
}
