import { Module, forwardRef } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { Attachment } from './entities/attachment.entitiy';
import { Feedback } from './entities/feedback.entity';
// import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { AuthModule } from '../auth/auth.module';
import { EnrollmentsModule } from '../enrollments/enrollments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission, Attachment, Feedback]),
    forwardRef(() => AuthModule),
    forwardRef(() => EnrollmentsModule),
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
})
export class SubmissionsModule {}
