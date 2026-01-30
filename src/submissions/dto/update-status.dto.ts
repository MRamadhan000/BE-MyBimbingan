import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export enum SubmissionStatus {
  PENDING = 'MENUNGGU_REVIEW',
  REVISION = 'REVISI',
  APPROVED = 'DISETUJUI'
}

export class UpdateSubmissionStatusDto {
  @IsEnum(SubmissionStatus, { message: 'Status harus antara: MENUNGGU_REVIEW, REVISI, atau DISETUJUI' })
  @IsNotEmpty()
  status: SubmissionStatus;

  @IsString()
  @IsOptional()
  note?: string; // Catatan singkat alasan perubahan status
}