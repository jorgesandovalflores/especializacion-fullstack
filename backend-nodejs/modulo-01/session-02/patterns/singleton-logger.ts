class Logger {
  private static instance: Logger;
  private constructor() {}
  static getInstance() {
    if (!Logger.instance) Logger.instance = new Logger();
    return Logger.instance;
  }
  log(msg: string) {
    console.log(msg);
  }
}
export const logger = Logger.getInstance();