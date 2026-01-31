import { 
  IsString, 
  IsNotEmpty, 
  IsUUID, 
  IsOptional,
  Allow
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSubmissionDto {
  @IsString()
  @IsNotEmpty({ message: 'Judul pengajuan harus diisi' })
  @Transform(({ value }) => value?.trim())
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Summary deskripsi tidak boleh kosong' })
  @Transform(({ value }) => value?.trim())
  description: string;

  @IsUUID('4', { message: 'ID Enrollment harus berupa UUID yang valid' })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  enrollmentId: string;

  /**
   * Jika field ini diisi, berarti submission ini adalah 
   * perbaikan (FIX REVISI) dari submission sebelumnya.
   */
  @IsUUID('4', { message: 'ID Parent harus berupa UUID yang valid' })
  @IsOptional()
  @Transform(({ value }) => value?.trim() || undefined)
  parentId?: string;

  // Allow files field to be present in request (handled separately by @UploadedFiles)
  @Allow()
  files?: any;

  // Note: Files are handled separately via @UploadedFiles() in controller
}