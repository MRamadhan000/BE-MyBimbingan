import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateEnrollmentDto {
  @IsUUID()
  @IsNotEmpty({ message: 'ID Mahasiswa wajib ada' })
  studentId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'ID Dosen wajib ada' })
  lecturerId: string;
}