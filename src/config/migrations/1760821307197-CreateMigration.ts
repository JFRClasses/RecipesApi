import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMigration1760821307197 implements MigrationInterface {
    name = 'CreateMigration1760821307197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recipe" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "category" character varying, "minutes" integer NOT NULL DEFAULT '0', "ingredients" jsonb NOT NULL, "instructions" jsonb NOT NULL, "imageUrl" character varying, "prompt" character varying, "stars" integer NOT NULL DEFAULT '0', "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD CONSTRAINT "FK_fe30fdc515f6c94d39cd4bbfa76" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe" DROP CONSTRAINT "FK_fe30fdc515f6c94d39cd4bbfa76"`);
        await queryRunner.query(`DROP TABLE "recipe"`);
    }

}
