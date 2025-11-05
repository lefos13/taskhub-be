import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserEntity1762374026344 implements MigrationInterface {
  name = 'CreateUserEntity1762374026344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create user_role enum type
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM('admin', 'manager', 'member')
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying(255) NOT NULL,
        "password" character varying(255) NOT NULL,
        "role" "user_role_enum" NOT NULL DEFAULT 'member',
        "firstName" character varying(100),
        "lastName" character varying(100),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    // Create unique constraint on email
    await queryRunner.query(`
      ALTER TABLE "users" ADD CONSTRAINT "UQ_users_email" UNIQUE ("email")
    `);

    // Create indexes for performance
    await queryRunner.query(`
      CREATE INDEX "IDX_users_email" ON "users" ("email")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_users_role" ON "users" ("role")
    `);

    // Enable uuid-ossp extension if not already enabled
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_users_role"`);
    await queryRunner.query(`DROP INDEX "IDX_users_email"`);

    // Drop unique constraint
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_users_email"`,
    );

    // Drop users table
    await queryRunner.query(`DROP TABLE "users"`);

    // Drop enum type
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
}
