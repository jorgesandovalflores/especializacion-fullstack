// UtilLog.ts (FIX)
import UtilDate from "./UtilDate";

// Import de solo efectos: aplica el patch a String.prototype
import "colors"; // ✅ sin default import, sin enable()

enum LogLevel {
    INFO = "INFO___",
    ERROR = "ERROR__",
    WARNING = "WARNING",
    SUCCESS = "SUCCESS",
}

const USE_COLOR =
    // Permite forzar color con FORCE_COLOR, o desactivar con NO_COLOR
    (process.env.NO_COLOR ? false : true) &&
    (process.stdout.isTTY || !!process.env.FORCE_COLOR);

// Helpers por si el entorno no soporta color
const colorize = (s: string, code: string) =>
    USE_COLOR ? `\u001b[${code}m${s}\u001b[0m` : s;

export default class UtilLog {
    public static logError(message: string, requestId?: string | null) {
        const line = `${UtilDate.getNowMysql()} [${LogLevel.ERROR}]: [${requestId}] ${message}`;
        console.log(colorize(line, "31")); // rojo
    }

    public static logSuccess(message: string, requestId?: string | null) {
        const line = `${UtilDate.getNowMysql()} [${LogLevel.SUCCESS}]: [${requestId}] ${message}`;
        console.log(colorize(line, "32")); // verde
    }

    public static logInfo(message: string, requestId?: string | null) {
        const line = `${UtilDate.getNowMysql()} [${LogLevel.INFO}]: [${requestId}] ${message}`;
        console.log(colorize(line, "37")); // blanco
    }

    public static logWarn(message: string, requestId?: string | null) {
        const line = `${UtilDate.getNowMysql()} [${LogLevel.WARNING}]: [${requestId}] ${message}`;
        console.log(colorize(line, "33")); // amarillo
    }
}
