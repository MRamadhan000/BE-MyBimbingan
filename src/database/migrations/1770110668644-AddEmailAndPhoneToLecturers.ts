import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailAndPhoneToLecturers1770110668644 implements MigrationInterface {
    name = 'AddEmailAndPhoneToLecturers1770110668644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add email column as nullable first
        await queryRunner.query(`ALTER TABLE "lecturers" ADD "email" character varying`);
        
        // Add phoneNumber column (nullable)
        await queryRunner.query(`ALTER TABLE "lecturers" ADD "phoneNumber" character varying`);
        
        // Update existing records with temporary email values if needed
        // In production, you should update manually or through a data migration script
        await queryRunner.query(`UPDATE "lecturers" SET "email" = 'temp_' || "nuptk" || '@example.com' WHERE "email" IS NULL`);
        
        // Now make email NOT NULL and add unique constraint
        await queryRunner.query(`ALTER TABLE "lecturers" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lecturers" ADD CONSTRAINT "UQ_3bf0b8dac54e0e07b5c3078f52d" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lecturers" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "lecturers" DROP CONSTRAINT "UQ_3bf0b8dac54e0e07b5c3078f52d"`);
        await queryRunner.query(`ALTER TABLE "lecturers" DROP COLUMN "email"`);
        // Skip dropping students email since it wasn't added by this migration
        // await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "email"`);
    }

}
