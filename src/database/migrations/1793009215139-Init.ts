import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1793009215139 implements MigrationInterface {
    name = 'Init1793009215139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "provinces" ("id" SERIAL NOT NULL, "code" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, "short_description" text, "banner_url" character varying(500), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_f4b684af62d5cb3aa174f6b9b8a" UNIQUE ("code"), CONSTRAINT "PK_2e4260eedbcad036ec53222e0c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."destinations_status_enum" AS ENUM('DRAFT', 'PUBLISHED')`);
        await queryRunner.query(`CREATE TABLE "destinations" ("id" SERIAL NOT NULL, "province_id" integer NOT NULL, "slug" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, "short_description" text, "banner_url" character varying(500), "status" "public"."destinations_status_enum" NOT NULL DEFAULT 'DRAFT', "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_30864aeaf404f4a6d3f816bd8c5" UNIQUE ("slug"), CONSTRAINT "PK_69c5e8db964dcb83d3a0640f3c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "destinations" ADD CONSTRAINT "FK_d607549c15284d83c87d4cf4319" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "destinations" DROP CONSTRAINT "FK_d607549c15284d83c87d4cf4319"`);
        await queryRunner.query(`DROP TABLE "destinations"`);
        await queryRunner.query(`DROP TYPE "public"."destinations_status_enum"`);
        await queryRunner.query(`DROP TABLE "provinces"`);
    }

}
