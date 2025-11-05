import { ApiProperty } from "@nestjs/swagger";
import { MenuApplication } from "../enum/menu-application.enum";
import { MenuStatus } from "../enum/menu-status.enum";

/* -------------------------------------------------------
   DTO de lectura para Menu (1:1 con la entidad)
   - Usado típicamente como respuesta en controladores
-------------------------------------------------------- */
export class MenuDto {
    @ApiProperty({ description: "Menu ID (UUID v4)", format: "uuid" })
    id!: string;

    @ApiProperty({
        description: "Unique key identifier for this menu item",
        maxLength: 24,
    })
    key!: string;

    @ApiProperty({
        description: "Display text for the menu item",
        maxLength: 164,
    })
    text!: string;

    @ApiProperty({
        description: "Full URL of the icon used in the menu item",
        maxLength: 255,
    })
    iconUrl!: string;

    @ApiProperty({
        description: "Deep link (internal or external) for this menu item",
        maxLength: 255,
    })
    deeplink!: string;

    @ApiProperty({
        description:
            "Order position (ascending order defines display priority)",
        example: 1,
    })
    order!: number;

    @ApiProperty({
        description:
            "Application that owns this menu (e.g., PASSENGER, DRIVER)",
        enum: MenuApplication,
        enumName: "MenuApplication",
        default: MenuApplication.PASSENGER,
    })
    application!: MenuApplication;

    @ApiProperty({
        description: "Business status of the menu item",
        enum: MenuStatus,
        enumName: "MenuStatus",
        default: MenuStatus.ACTIVE,
    })
    status!: MenuStatus;
}
