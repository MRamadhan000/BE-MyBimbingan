import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

// controllers & services
import { AppController } from './app.controller';
import { AppService } from './app.service';

// entities
import { Student } from './students/entities/student.entity';
import { Lecturer } from './lecturers/entities/lecturer.entity';
import { Enrollment } from './enrollments/entities/enrollment.entity';
import { GuidanceAgenda } from './guidance-agendas/entities/guidance-agenda.entity';
import { Submission } from './submissions/entities/submission.entity';
import { Feedback } from './submissions/entities/feedback.entity';
import { Attachment } from './submissions/entities/attachment.entity';

// modules
import { StudentsModule } from './students/students.module';
import { LecturersModule } from './lecturers/lecturers.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { GuidanceAgendasModule } from './guidance-agendas/guidance-agendas.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    /**
     * =============================
     * ENV CONFIG
     * Using: .env.${process.env.NODE_ENV || 'dev'} or .env.dev as fallback
     * =============================
     */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'dev'}`,
        '.env.dev', // fallback
      ],
    }),

    /**
     * =============================
     * REDIS CACHE
     * =============================
     */
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const logger = new Logger('Redis');
        logger.log(`🔴 Connecting to Redis at ${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`);

        const store = await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
          },
        });

        logger.log(
          `✅ Redis connected at ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        );

        return {
          store,
          ttl: 300, // default cache 5 menit
        };
      },
    }),

    /**
     * =============================
     * POSTGRES (TYPEORM)
     * =============================
     */
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const logger = new Logger('Database');
        logger.log(`🗄️  Connecting to PostgreSQL at ${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}`);
        logger.log(`   Database: ${process.env.POSTGRES_DB}`);
        logger.log(`   User: ${process.env.POSTGRES_USER}`);
        logger.log(`   Host: ${process.env.POSTGRES_HOST}`);

        return {
          type: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: Number(process.env.POSTGRES_PORT),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          entities: [
            Student,
            Lecturer,
            Enrollment,
            GuidanceAgenda,
            Submission,
            Feedback,
            Attachment,
          ],
          synchronize: false, // ❌ PROD HARUS FALSE
          logging: true,
          logger: 'advanced-console',
        };
      },
    }),

    /**
     * =============================
     * FEATURE MODULES
     * =============================
     */
    StudentsModule,
    LecturersModule,
    EnrollmentsModule,
    GuidanceAgendasModule,
    SubmissionsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
