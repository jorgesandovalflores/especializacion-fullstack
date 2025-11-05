import {
    Controller,
    Get,
    Query,
    HttpException,
    HttpStatus,
    UseGuards,
    HttpCode,
} from "@nestjs/common";
import { AddressService } from "../services/address.service";
import { AccessTokenGuard } from "src/core/http/guard/AccessTokenGuard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("address")
@Controller("address")
export class AddressController {
    constructor(private readonly addressService: AddressService) {}

    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth()
    @Get("search")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Search address in lima" })
    async searchAddress(
        @Query("q") query: string,
        @Query("limit") limit?: number,
    ) {
        try {
            const results = await this.addressService.searchInLima(
                query,
                limit || 10,
            );

            return {
                success: true,
                provider: this.addressService.getActiveProvider(),
                count: results.length,
                results,
            };
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth()
    @Get("details")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "detail from address" })
    async getDetails(
        @Query("placeId") placeId: string,
        @Query("source") source: "nominatim" | "google",
    ) {
        try {
            const details = await this.addressService.getPlaceDetails(
                placeId,
                source,
            );
            return {
                success: true,
                details,
            };
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
