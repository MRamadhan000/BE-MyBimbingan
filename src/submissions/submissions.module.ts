import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { Attachment } from './entities/attachment.entitiy';
import { Feedback } from './entities/feedback.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission, Attachment, Feedback]),
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
})
export class SubmissionsModule {}
