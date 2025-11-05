import { MenuDto } from "../dto/menu.dto";
import { MenuEntity } from "../entities/menu.entity";

export const toMenuDto = (entity: MenuEntity): MenuDto => {
    return {
        id: entity.id,
        key: entity.key,
        text: entity.text,
        iconUrl: entity.iconUrl,
        deeplink: entity.deeplink,
        order: entity.order,
        application: entity.application,
        status: entity.status,
    };
};
