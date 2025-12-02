import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMigration1764699939023 implements MigrationInterface {
    name = 'CreateMigration1764699939023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe" ADD "isFavorite" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "isFavorite"`);
    }

}
