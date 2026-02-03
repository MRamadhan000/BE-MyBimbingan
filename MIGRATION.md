# TypeORM Migration Guide - MyBimbingan Backend

Dokumentasi lengkap untuk mengelola database migrations di NestJS dengan TypeORM.

## 📋 Daftar Isi
- [Setup Awal](#setup-awal)
- [Cara Membuat Migration](#cara-membuat-migration)
- [Menjalankan Migration](#menjalankan-migration)
- [Rollback Migration](#rollback-migration)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🛠️ Setup Awal

### 1. Struktur Folder
```
src/
├── database/
│   ├── data-source.ts      # Konfigurasi TypeORM CLI
│   ├── migrations/         # Folder migration files
│   │   ├── 20260203161903-AddAddressToStudents.ts
│   │   └── 1770110668644-AddEmailAndPhoneToLecturers.ts
│   ├── scripts/           # Database utility scripts
│   └── seeders/          # Data seeding
└── **/*.entity.ts        # Entity files
```

### 2. Scripts yang Tersedia (package.json)
```json
{
  "scripts": {
    "migration:generate": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate -d src/database/data-source.ts",
    "migration:create": "typeorm migration:create",
    "migration:run": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d src/database/data-source.ts",
    "migration:revert": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:revert -d src/database/data-source.ts"
  }
}
```

## 🎯 Cara Membuat Migration

### Method 1: Auto-Generate (Recommended) 🚀

**Step 1: Ubah Entity**
```typescript
// src/students/entities/student.entity.ts
@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  // ✅ Tambahkan field baru
  @Column({ nullable: true })
  address: string;
  
  @Column({ unique: true })
  email: string;
}
```

**Step 2: Generate Migration Otomatis**
```bash
npm run migration:generate -- src/database/migrations/AddAddressToStudents
```

**Step 3: Review File Migration**
TypeORM akan generate file seperti ini:
```typescript
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAddressToStudents1770110668644 implements MigrationInterface {
    name = 'AddAddressToStudents1770110668644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students" ADD "address" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "address"`);
    }
}
```

### Method 2: Manual Creation

```bash
npm run migration:create -- src/database/migrations/CreateUserTable
```

Lalu edit manual:
```typescript
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTable1234567890 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "name",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isUnique: true
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }
}
```

## ▶️ Menjalankan Migration

### Run All Pending Migrations
```bash
npm run migration:run
```

**Output yang diharapkan:**
```
Migration AddAddressToStudents20260203161903 has been executed successfully.
Migration AddEmailAndPhoneToLecturers1770110668644 has been executed successfully.
```

### Check Migration Status
```bash
# Lihat migration yang sudah dijalankan
npm run migration:show
```

## ⏪ Rollback Migration

### Rollback Last Migration
```bash
npm run migration:revert
```

### Rollback Multiple Migrations
```bash
# Jalankan beberapa kali sesuai kebutuhan
npm run migration:revert  # Rollback migration terakhir
npm run migration:revert  # Rollback migration sebelumnya
```

**⚠️ Warning:** Rollback bisa menyebabkan data loss! Pastikan backup data terlebih dahulu.

## 🎯 Best Practices

### 1. Naming Convention
```bash
# ✅ Good
AddEmailToStudents
CreateSubmissionTable
AddIndexToUserEmail
RemoveDeprecatedFields

# ❌ Bad
UpdateDB
FixBug
NewChanges
```

### 2. Handle Existing Data
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
    // ✅ Tambah kolom sebagai nullable dulu
    await queryRunner.query(`ALTER TABLE "lecturers" ADD "email" character varying`);
    
    // ✅ Update existing records
    await queryRunner.query(`UPDATE "lecturers" SET "email" = 'temp_' || "nuptk" || '@example.com' WHERE "email" IS NULL`);
    
    // ✅ Baru set NOT NULL constraint
    await queryRunner.query(`ALTER TABLE "lecturers" ALTER COLUMN "email" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "lecturers" ADD CONSTRAINT "UQ_lecturer_email" UNIQUE ("email")`);
}
```

### 3. Always Write Proper Down Migration
```typescript
public async down(queryRunner: QueryRunner): Promise<void> {
    // ✅ Reverse semua perubahan dalam urutan terbalik
    await queryRunner.query(`ALTER TABLE "lecturers" DROP CONSTRAINT "UQ_lecturer_email"`);
    await queryRunner.query(`ALTER TABLE "lecturers" DROP COLUMN "email"`);
}
```

### 4. Test Migration di Development
```bash
# 1. Run migration
npm run migration:run

# 2. Test aplikasi apakah berjalan normal
npm run start:dev

# 3. Test rollback
npm run migration:revert

# 4. Test lagi run migration
npm run migration:run
```

## 📊 Contoh Migration Patterns

### 1. Add Column
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "students" ADD "phoneNumber" character varying`);
}

public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "phoneNumber"`);
}
```

### 2. Add Index
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE INDEX "IDX_student_email" ON "students" ("email")`);
}

public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_student_email"`);
}
```

### 3. Add Foreign Key
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_enrollment_student" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE`);
}

public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_enrollment_student"`);
}
```

### 4. Rename Column
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "students" RENAME COLUMN "studentNumber" TO "nim"`);
}

public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "students" RENAME COLUMN "nim" TO "studentNumber"`);
}
```

### 5. Change Column Type
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "students" ALTER COLUMN "createdAt" TYPE timestamptz`);
}

public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "students" ALTER COLUMN "createdAt" TYPE timestamp`);
}
```

## 🚨 Troubleshooting

### Error: "column contains null values"
```bash
# Error saat menambah NOT NULL constraint
error: column "email" of relation "students" contains null values
```

**Solution:**
```typescript
// ❌ Wrong
await queryRunner.query(`ALTER TABLE "students" ADD "email" character varying NOT NULL`);

// ✅ Correct
await queryRunner.query(`ALTER TABLE "students" ADD "email" character varying`);
await queryRunner.query(`UPDATE "students" SET "email" = 'default@example.com' WHERE "email" IS NULL`);
await queryRunner.query(`ALTER TABLE "students" ALTER COLUMN "email" SET NOT NULL`);
```

### Error: "Cannot find module"
```bash
Error: Unable to open file: Cannot find module 'entity'
```

**Solution:**
Pastikan `data-source.ts` menggunakan path pattern:
```typescript
// ✅ Correct
entities: ['src/**/*.entity{.ts,.js}']

// ❌ Wrong  
entities: [Student, Lecturer, ...]
```

### Error: "Command not found"
**Solution:**
Update package.json scripts:
```json
{
  "migration:run": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d src/database/data-source.ts"
}
```

## 📝 Migration History Example

```bash
# Urutan migration yang sudah berjalan:
1. 20260203161903-AddAddressToStudents.ts        ✅ Executed
2. 1770110668644-AddEmailAndPhoneToLecturers.ts  ✅ Executed
3. 20260204120000-AddSubmissionStatusEnum.ts     ⏳ Pending
```

## 🔍 Useful Commands

```bash
# Development workflow
npm run migration:generate -- src/database/migrations/YourMigrationName
npm run migration:run
npm run start:dev

# Production deployment
NODE_ENV=production npm run migration:run

# Emergency rollback
npm run migration:revert

# Check database status
psql -h localhost -p 5435 -U postgres -d mybimbingan_dev -c "SELECT * FROM migrations;"
```

---

**💡 Tips:**
- Selalu backup database sebelum migration di production
- Test migration di development environment dulu
- Review auto-generated migration sebelum menjalankan
- Gunakan descriptive naming untuk migration
- Write proper rollback logic

**📚 References:**
- [TypeORM Migration Documentation](https://typeorm.io/migrations)
- [NestJS Database Guide](https://docs.nestjs.com/techniques/database)