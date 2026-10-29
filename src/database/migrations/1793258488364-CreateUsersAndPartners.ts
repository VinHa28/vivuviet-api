import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersAndPartners1793258488364 implements MigrationInterface {
    name = 'CreateUsersAndPartners1793258488364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'PARTNER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, "role" "public"."users_role_enum" NOT NULL, "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."partners_tier_enum" AS ENUM('BASIC', 'STANDARD', 'PREMIUM')`);
        await queryRunner.query(`CREATE TYPE "public"."partners_status_enum" AS ENUM('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "partners" ("user_id" integer NOT NULL, "id" SERIAL NOT NULL, "business_name" character varying(255) NOT NULL, "phone" character varying(20) NOT NULL, "website" character varying(500), "fanpage" character varying(500), "logo_url" character varying(500), "tier" "public"."partners_tier_enum" NOT NULL, "status" "public"."partners_status_enum" NOT NULL DEFAULT 'PENDING', "rejection_reason" text, "approved_at" TIMESTAMP(3) WITH TIME ZONE, "created_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_095f5cc2d94806580c52df24a55" UNIQUE ("phone"), CONSTRAINT "REL_6aee7fd33891dbfa5ccbbdfe08" UNIQUE ("user_id"), CONSTRAINT "PK_998645b20820e4ab99aeae03b41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "partners" ADD CONSTRAINT "FK_6aee7fd33891dbfa5ccbbdfe084" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partners" DROP CONSTRAINT "FK_6aee7fd33891dbfa5ccbbdfe084"`);
        await queryRunner.query(`DROP TABLE "partners"`);
        await queryRunner.query(`DROP TYPE "public"."partners_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."partners_tier_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
