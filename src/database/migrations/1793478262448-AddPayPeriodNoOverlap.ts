import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPayPeriodNoOverlap1793478262448 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS btree_gist;
            `);

    await queryRunner.query(`
            ALTER TABLE pay_periods
            ADD CONSTRAINT pay_periods_no_overlap
            EXCLUDE USING gist (
                company_id WITH =,
                daterange(startDate, endDate, '[]') WITH &&
            );   
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE pay_periods
            DROP CONSTRAINT IF EXISTS pay_periods_no_overlap;
        `);
  }
}
