import { IsString, IsNotEmpty, IsUUID, IsEnum } from 'class-validator';

export enum SenderType {
  STUDENT = 'STUDENT',
  LECTURER = 'LECTURER'
}

export class CreateFeedbackDto {
  @IsUUID()
  @IsNotEmpty()
  submissionId: string;

  @IsString()
  @IsNotEmpty({ message: 'Komentar tidak boleh kosong' })
  content: string;

  @IsEnum(SenderType)
  @IsNotEmpty()
  senderType: SenderType;
}