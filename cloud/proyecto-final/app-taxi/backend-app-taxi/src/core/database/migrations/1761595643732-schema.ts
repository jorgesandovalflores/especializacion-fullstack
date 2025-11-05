import { MigrationInterface, QueryRunner } from "typeorm";

export class Schema1761595643732 implements MigrationInterface {
    name = 'Schema1761595643732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`entity_passenger\` (\`id_passenger\` varchar(36) NOT NULL, \`phone_number\` varchar(20) NOT NULL, \`given_name\` varchar(60) NULL, \`family_name\` varchar(60) NULL, \`email\` varchar(120) NULL, \`photo_url\` varchar(255) NULL, \`status\` enum ('ACTIVE', 'INACTIVE_REGISTER', 'SUSPENDED', 'DELETED') NOT NULL DEFAULT 'ACTIVE', \`last_login_at\` datetime NULL COMMENT 'Último inicio de sesión confirmado en servidor', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`UQ_passenger_email\` (\`email\`), UNIQUE INDEX \`UQ_passenger_phone_number\` (\`phone_number\`), INDEX \`IDX_passenger_status\` (\`status\`), PRIMARY KEY (\`id_passenger\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`entity_passenger_otp\` (\`id_passenger_otp\` varchar(36) NOT NULL, \`id_passenger\` varchar(255) NOT NULL, \`code\` varchar(6) NOT NULL COMMENT 'Código OTP para autenticación o verificación', \`expires_at\` datetime NOT NULL COMMENT 'Fecha y hora de expiración del OTP', \`used\` tinyint NOT NULL COMMENT 'Indica si el código ya fue utilizado' DEFAULT 0, \`used_at\` datetime NULL COMMENT 'Fecha y hora en que se usó el OTP (si aplica)', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, INDEX \`IX_passenger_otp_expires_at\` (\`expires_at\`), INDEX \`IX_passenger_otp_passenger_code\` (\`id_passenger\`, \`code\`), INDEX \`IX_passenger_otp_passenger_id\` (\`id_passenger\`), PRIMARY KEY (\`id_passenger_otp\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`entity_menu\` (\`id_menu\` varchar(36) NOT NULL, \`key\` varchar(24) NOT NULL, \`text\` varchar(164) NOT NULL, \`icon_url\` varchar(255) NOT NULL, \`deeplink\` varchar(255) NOT NULL, \`order\` int NOT NULL, \`application\` enum ('BACKOFFICE', 'PASSENGER', 'DRIVER') NOT NULL DEFAULT 'PASSENGER', \`status\` enum ('ACTIVE', 'INACTIVE', 'DELETED') NOT NULL DEFAULT 'ACTIVE', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`UQ_menu_application_order\` (\`application\`, \`order\`), UNIQUE INDEX \`UQ_menu_key\` (\`key\`), PRIMARY KEY (\`id_menu\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`entity_address\` (\`id_address\` varchar(36) NOT NULL, \`passenger_id\` varchar(36) NOT NULL, \`place_id\` varchar(255) NULL, \`latitude\` double NOT NULL, \`longitude\` double NOT NULL, \`description\` varchar(512) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, INDEX \`IDX_address_passenger_id\` (\`passenger_id\`), INDEX \`IDX_address_place_id\` (\`place_id\`), PRIMARY KEY (\`id_address\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`entity_passenger_otp\` ADD CONSTRAINT \`FK_e6fe313aea3df2aacf2d98e6da4\` FOREIGN KEY (\`id_passenger\`) REFERENCES \`entity_passenger\`(\`id_passenger\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`entity_address\` ADD CONSTRAINT \`FK_eec68451e0ab0b276a28d6ec5af\` FOREIGN KEY (\`passenger_id\`) REFERENCES \`entity_passenger\`(\`id_passenger\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`entity_address\` DROP FOREIGN KEY \`FK_eec68451e0ab0b276a28d6ec5af\``);
        await queryRunner.query(`ALTER TABLE \`entity_passenger_otp\` DROP FOREIGN KEY \`FK_e6fe313aea3df2aacf2d98e6da4\``);
        await queryRunner.query(`DROP INDEX \`IDX_address_place_id\` ON \`entity_address\``);
        await queryRunner.query(`DROP INDEX \`IDX_address_passenger_id\` ON \`entity_address\``);
        await queryRunner.query(`DROP TABLE \`entity_address\``);
        await queryRunner.query(`DROP INDEX \`UQ_menu_key\` ON \`entity_menu\``);
        await queryRunner.query(`DROP INDEX \`UQ_menu_application_order\` ON \`entity_menu\``);
        await queryRunner.query(`DROP TABLE \`entity_menu\``);
        await queryRunner.query(`DROP INDEX \`IX_passenger_otp_passenger_id\` ON \`entity_passenger_otp\``);
        await queryRunner.query(`DROP INDEX \`IX_passenger_otp_passenger_code\` ON \`entity_passenger_otp\``);
        await queryRunner.query(`DROP INDEX \`IX_passenger_otp_expires_at\` ON \`entity_passenger_otp\``);
        await queryRunner.query(`DROP TABLE \`entity_passenger_otp\``);
        await queryRunner.query(`DROP INDEX \`IDX_passenger_status\` ON \`entity_passenger\``);
        await queryRunner.query(`DROP INDEX \`UQ_passenger_phone_number\` ON \`entity_passenger\``);
        await queryRunner.query(`DROP INDEX \`UQ_passenger_email\` ON \`entity_passenger\``);
        await queryRunner.query(`DROP TABLE \`entity_passenger\``);
    }

}
