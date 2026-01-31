import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Student } from './students/entities/student.entity';
import { Lecturer } from './lecturers/entities/lecturer.entity';
import { Enrollment } from './enrollments/entities/enrollment.entity';
import { GuidanceAgenda } from './guidance-agendas/entities/guidance-agenda.entity';
import { Submission } from './submissions/entities/submission.entity';
import { Feedback } from './submissions/entities/feedback.entity';
import { Attachment } from './submissions/entities/attachment.entitiy';
import { StudentsModule } from './students/students.module';
import { LecturersModule } from './lecturers/lecturers.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { GuidanceAgendasModule } from './guidance-agendas/guidance-agendas.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.dev',
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const logger = new Logger('CacheModule');
        const store = await redisStore({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        });
        logger.log('✅ Connected to Redis successfully!');
        return {
          store,
          ttl: 300, // 5 minutes default TTL
        };
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5435', 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Student, Lecturer, Enrollment, GuidanceAgenda, Submission, Feedback, Attachment],
      synchronize: true, // ⚠️ PROD JANGAN true
      logging: true,
      logger: 'advanced-console',
    }),
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