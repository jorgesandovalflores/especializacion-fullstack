import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    UseGuards,
} from "@nestjs/common";
import { EventsService } from "./events.service";
import { CreateEventDto } from "./dtos/create-event.dto";
import { UpdateEventDto } from "./dtos/update-event.dto";
import { RolesGuard } from "src/core/http/guards/roles.guard";
import { JwtAccessGuard } from "src/core/http/guards/jwt-access.guard";
import { Roles } from "src/core/http/decorators/roles.decorator";
import { Role } from "src/core/http/enums/role.enum";

@Controller("events")
export class EventsController {
    constructor(private readonly events: EventsService) {}

    @Get()
    listPublic() {
        return this.events.listPublic();
    }

    @Get(":id")
    get(@Param("id") id: string) {
        return this.events.findById(id);
    }

    @Post()
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Roles(Role.ORGANIZER, Role.ADMIN)
    create(@Body() dto: CreateEventDto, @Req() req: any) {
        return this.events.create(dto, { id: req.user.sub } as any);
    }

    @Put(":id")
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Roles(Role.ORGANIZER, Role.ADMIN)
    update(
        @Param("id") id: string,
        @Body() dto: UpdateEventDto,
        @Req() req: any,
    ) {
        return this.events.updateWithPermissions(id, dto, req.user);
    }

    @Delete(":id")
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Roles(Role.ORGANIZER, Role.ADMIN)
    delete(@Param("id") id: string, @Req() req: any) {
        return this.events.removeWithPermissions(id, req.user);
    }

    @Post(":id/cancel")
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Roles(Role.ORGANIZER, Role.ADMIN)
    cancel(@Param("id") id: string, @Req() req: any) {
        return this.events.cancelWithPermissions(id, req.user);
    }
}
