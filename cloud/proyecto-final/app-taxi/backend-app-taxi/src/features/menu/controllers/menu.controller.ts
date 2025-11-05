import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseEnumPipe,
    UseGuards,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";

import { MenuService } from "../services/menu.service";
import { MenuApplication } from "../enum/menu-application.enum";
import { MenuDto } from "../dto/menu.dto";
import { AccessTokenGuard } from "src/core/http/guard/AccessTokenGuard";

@ApiBearerAuth()
@ApiTags("Menu")
@Controller("menu")
export class MenuController {
    constructor(private readonly menuService: MenuService) {}

    /* -------------------------------------------------------
       GET /menu/active/:application
       Lista menús activos por aplicación (orden ASC por `order`)
    -------------------------------------------------------- */
    @Get("active/:application")
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "List active menus by application (ordered by `order` ASC)",
    })
    @ApiParam({
        name: "application",
        enum: MenuApplication,
        enumName: "MenuApplication",
        description: "Application owner of the menu (e.g., PASSENGER, DRIVER)",
    })
    @ApiResponse({
        status: 200,
        description: "Array of active menus",
        type: MenuDto,
        isArray: true,
    })
    async getActiveByApplication(
        @Param("application", new ParseEnumPipe(MenuApplication))
        application: MenuApplication,
    ): Promise<MenuDto[]> {
        return this.menuService.getActiveMenusByApplication(application);
    }
}
