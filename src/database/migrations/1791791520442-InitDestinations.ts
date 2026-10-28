import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDestinations1791791520442 implements MigrationInterface {
    name = 'InitDestinations1791791520442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "destinations" ("id" SERIAL NOT NULL, "code" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, "short_description" text, "banner_url" character varying(500), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_7d5e4137d2a342e01a17a94a444" UNIQUE ("code"), CONSTRAINT "PK_69c5e8db964dcb83d3a0640f3c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "destination_images" ("id" SERIAL NOT NULL, "destination_id" integer NOT NULL, "url" character varying(500) NOT NULL, "public_id" character varying(255), "caption" character varying(255), "sort_order" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b5f3c336fc65b76734af31b77c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "destination_images" ADD CONSTRAINT "FK_1d23921a8483ecb6e3b21a57074" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "destination_images" DROP CONSTRAINT "FK_1d23921a8483ecb6e3b21a57074"`);
        await queryRunner.query(`DROP TABLE "destination_images"`);
        await queryRunner.query(`DROP TABLE "destinations"`);
    }

}
