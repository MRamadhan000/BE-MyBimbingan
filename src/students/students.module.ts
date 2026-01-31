import { Module, forwardRef } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { Student } from './entities/student.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Submission } from '../submissions/entities/submission.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Feedback } from '../submissions/entities/feedback.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Submission, Enrollment, Feedback]), 
    forwardRef(() => AuthModule)
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}