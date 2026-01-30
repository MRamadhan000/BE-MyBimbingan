import { 
  IsString, 
  IsNotEmpty, 
  IsUUID, 
  IsArray, 
  ValidateNested, 
  IsOptional 
} from 'class-validator';
import { Type } from 'class-transformer';

// Sub-DTO untuk menangani metadata file
class FileAttachmentDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama file tidak boleh kosong' })
  fileName: string;

  @IsString()
  @IsNotEmpty({ message: 'URL file harus ada' })
  fileUrl: string;

  @IsString()
  @IsNotEmpty({ message: 'Ukuran file harus dicantumkan' })
  fileSize: string;
}

export class CreateSubmissionDto {
  @IsString()
  @IsNotEmpty({ message: 'Judul pengajuan harus diisi' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Summary deskripsi tidak boleh kosong' })
  description: string;

  @IsUUID('4', { message: 'ID Dosen harus berupa UUID yang valid' })
  @IsNotEmpty()
  lecturerId: string;

  @IsUUID('4', { message: 'ID Mahasiswa harus berupa UUID yang valid' })
  @IsNotEmpty()
  studentId: string;

  /**
   * Jika field ini diisi, berarti submission ini adalah 
   * perbaikan (FIX REVISI) dari submission sebelumnya.
   */
  @IsUUID('4', { message: 'ID Parent harus berupa UUID yang valid' })
  @IsOptional()
  parentId?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FileAttachmentDto)
  files: FileAttachmentDto[];
}