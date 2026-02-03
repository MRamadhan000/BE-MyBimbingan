import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAddressToStudents20260203161903 implements MigrationInterface {
    name = 'AddAddressToStudents20260203161903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students" ADD "address" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "address"`);
    }

}