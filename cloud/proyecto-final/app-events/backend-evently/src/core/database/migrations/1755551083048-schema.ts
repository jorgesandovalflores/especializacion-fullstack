import { MigrationInterface, QueryRunner } from "typeorm";

export class Schema1755551083048 implements MigrationInterface {
    name = 'Schema1755551083048'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`event_subscriptions\` (\`id\` varchar(36) NOT NULL, \`subscribed_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NOT NULL, \`eventId\` varchar(36) NOT NULL, UNIQUE INDEX \`IDX_8418b92dfde435c0a6fb084631\` (\`userId\`, \`eventId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`events\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(200) NOT NULL, \`description\` text NULL, \`location\` varchar(200) NOT NULL, \`date\` datetime NOT NULL, \`status\` enum ('ACTIVE', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`createdById\` varchar(36) NOT NULL, INDEX \`IDX_217a680273e6f360857e9c5326\` (\`date\`), INDEX \`IDX_03dcebc1ab44daa177ae9479c4\` (\`status\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(150) NOT NULL, \`email\` varchar(180) NOT NULL, \`password_hash\` varchar(255) NOT NULL, \`role\` enum ('admin', 'organizer', 'attendee') NOT NULL DEFAULT 'attendee', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`event_subscriptions\` ADD CONSTRAINT \`FK_70b4045d9b8f44983470c05b21c\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`event_subscriptions\` ADD CONSTRAINT \`FK_b8098aa0cce62cd5a573f771900\` FOREIGN KEY (\`eventId\`) REFERENCES \`events\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_2fb864f37ad210f4295a09b684d\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_2fb864f37ad210f4295a09b684d\``);
        await queryRunner.query(`ALTER TABLE \`event_subscriptions\` DROP FOREIGN KEY \`FK_b8098aa0cce62cd5a573f771900\``);
        await queryRunner.query(`ALTER TABLE \`event_subscriptions\` DROP FOREIGN KEY \`FK_70b4045d9b8f44983470c05b21c\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_03dcebc1ab44daa177ae9479c4\` ON \`events\``);
        await queryRunner.query(`DROP INDEX \`IDX_217a680273e6f360857e9c5326\` ON \`events\``);
        await queryRunner.query(`DROP TABLE \`events\``);
        await queryRunner.query(`DROP INDEX \`IDX_8418b92dfde435c0a6fb084631\` ON \`event_subscriptions\``);
        await queryRunner.query(`DROP TABLE \`event_subscriptions\``);
    }

}
