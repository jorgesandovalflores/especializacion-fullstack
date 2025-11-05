export default class UtilDate {
    public static getNowMysql(): string {
        return new Date().toISOString().slice(0, 19).replace("T", " ");
    }

    public static getNowTimestamp(): number {
        return Date.now();
    }
}
