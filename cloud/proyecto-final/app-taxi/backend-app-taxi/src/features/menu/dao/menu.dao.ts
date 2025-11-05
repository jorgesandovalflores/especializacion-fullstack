import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MenuEntity } from "../entities/menu.entity";
import { MenuApplication } from "../enum/menu-application.enum";
import { MenuStatus } from "../enum/menu-status.enum";

@Injectable()
export class MenuDao {
    constructor(
        @InjectRepository(MenuEntity)
        private readonly repo: Repository<MenuEntity>,
    ) {}

    /** Lista menús ACTIVOS por aplicación, ordenados ascendentemente por `order`. */
    async findActiveByApplication(
        application: MenuApplication,
    ): Promise<MenuEntity[]> {
        return this.repo.find({
            where: { application, status: MenuStatus.ACTIVE },
            order: { order: "ASC" },
        });
    }
}
