export class HttpCustomException extends Error {
	constructor(
		public readonly statusCode: number,
		public readonly message: string,
		public readonly context?: any,
	) {
		super(message);
	}
}