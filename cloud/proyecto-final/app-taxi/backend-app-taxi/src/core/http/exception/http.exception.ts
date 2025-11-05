import { HttpException, HttpStatus } from "@nestjs/common";

export class HttpCustomException extends HttpException {
    constructor(
        message: string,
        statusCode: HttpStatus = HttpStatus.UNPROCESSABLE_ENTITY,
    ) {
        super(
            {
                status_code: statusCode,
                message,
            },
            statusCode,
        );
    }
}
