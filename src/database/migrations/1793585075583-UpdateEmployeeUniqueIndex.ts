import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEmployeeUniqueIndex1762030000000 implements MigrationInterface {
  name = 'UpdateEmployeeUniqueIndex1762030000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "idx_employees_company_registration";
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "idx_employees_company_registration"
      ON "employees" ("company_id", "registration")
      WHERE "deleted_at" IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "idx_employees_company_registration";
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "idx_employees_company_registration"
      ON "employees" ("company_id", "registration");
    `);
  }
}
