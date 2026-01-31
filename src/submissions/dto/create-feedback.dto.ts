import { IsString, IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { FeedbackStatus } from '../entities/feedback.entity';

export class CreateFeedbackDto {
  @IsUUID()
  @IsNotEmpty()
  submissionId: string;

  @IsString()
  @IsNotEmpty({ message: 'Komentar tidak boleh kosong' })
  content: string;

  @IsEnum(FeedbackStatus)
  @IsNotEmpty()
  status: FeedbackStatus;
}