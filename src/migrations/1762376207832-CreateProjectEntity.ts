import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProjectEntity1762376207832 implements MigrationInterface {
  name = 'CreateProjectEntity1762376207832';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create project_status enum type
    await queryRunner.query(`
      CREATE TYPE "project_status_enum" AS ENUM('active', 'completed', 'on_hold')
    `);

    // Create projects table
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "description" text,
        "start_date" date NOT NULL,
        "end_date" date,
        "status" "project_status_enum" NOT NULL DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_projects_id" PRIMARY KEY ("id")
      )
    `);

    // Create indexes for performance optimization
    await queryRunner.query(`
      CREATE INDEX "IDX_projects_status" ON "projects" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_projects_start_date" ON "projects" ("start_date")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_projects_end_date" ON "projects" ("end_date")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_projects_created_at" ON "projects" ("created_at")
    `);

    // Create partial index for non-deleted projects (soft delete optimization)
    await queryRunner.query(`
      CREATE INDEX "IDX_projects_active" ON "projects" ("id") WHERE "deleted_at" IS NULL
    `);

    // Add check constraint to ensure end_date is after start_date
    await queryRunner.query(`
      ALTER TABLE "projects" ADD CONSTRAINT "CHK_projects_date_range" 
      CHECK ("end_date" IS NULL OR "end_date" > "start_date")
    `);

    // Ensure uuid-ossp extension is enabled (may already be enabled from user migration)
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop check constraint
    await queryRunner.query(`
      ALTER TABLE "projects" DROP CONSTRAINT "CHK_projects_date_range"
    `);

    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_projects_active"`);
    await queryRunner.query(`DROP INDEX "IDX_projects_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_projects_end_date"`);
    await queryRunner.query(`DROP INDEX "IDX_projects_start_date"`);
    await queryRunner.query(`DROP INDEX "IDX_projects_status"`);

    // Drop projects table
    await queryRunner.query(`DROP TABLE "projects"`);

    // Drop enum type
    await queryRunner.query(`DROP TYPE "project_status_enum"`);
  }
}
