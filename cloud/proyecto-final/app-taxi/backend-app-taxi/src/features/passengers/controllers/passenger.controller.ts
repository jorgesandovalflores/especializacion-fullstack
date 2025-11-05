import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Put,
    Req,
    UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PassengerService } from "../services/passenger.service";
import { AccessTokenGuard } from "src/core/http/guard/AccessTokenGuard";
import { PassengerSignUpRequest } from "../dto/passenger-signup.request";

@ApiTags("passenger")
@Controller("passenger")
export class PassengerController {
    constructor(private readonly service: PassengerService) {}

    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth()
    @Put("signup")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Update passenger basic information" })
    async updateMyProfile(
        @Req() req: any,
        @Body() dto: PassengerSignUpRequest,
    ) {
        return this.service.updateMyProfile(req.user, dto);
    }
}
