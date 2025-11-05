import axios from "axios";
import UtilLog from "src/commons/utils/UtilLog";

// Variables de entorno
const BREVO_API_KEY = String(process.env.BREVO_API_KEY ?? "");
const BREVO_TEXT_SMS = String(process.env.BREVO_TEXT_SMS ?? "");
const BREVO_SENDER = String(process.env.BREVO_SENDER ?? "");
const BREVO_TAG_SMS = String("accountValidation");

export default class BrevoNetwork {
    public static async sendSMS(
        msisdn: string,
        code: string,
    ): Promise<string | null> {
        try {
            const url = "https://api.brevo.com/v3/transactionalSMS/sms";

            const body = {
                type: "transactional",
                unicodeEnabled: true,
                sender: BREVO_SENDER,
                recipient: `+${msisdn}`,
                content: `${BREVO_TEXT_SMS} ${code}`,
                tag: BREVO_TAG_SMS,
            };

            const headers = {
                accept: "application/json",
                "api-key": BREVO_API_KEY,
                "Content-Type": "application/json",
            };

            const response = await axios.post(url, body, { headers });

            UtilLog.logInfo(
                `# Brevo SMS sent: ${JSON.stringify(response.data)}`,
            );

            return response.data.messageId ?? null;
        } catch (exception: any) {
            UtilLog.logInfo(
                `# error BrevoNetwork.sendSMS detail = ${JSON.stringify(exception.response?.data ?? exception.message)}`,
            );
            UtilLog.logError(
                `# error BrevoNetwork.sendSMS = ${exception.message}`,
            );
            return null;
        }
    }
}
