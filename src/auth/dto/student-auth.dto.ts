import { IsString, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class StudentRegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama mahasiswa harus diisi' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor induk mahasiswa wajib diisi' })
  @MinLength(5, { message: 'NIM minimal 5 karakter' })
  studentNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Jurusan wajib dipilih' })
  major: string;

  @IsString()
  @IsNotEmpty({ message: 'Password wajib diisi' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @IsString()
  @IsOptional()
  image?: string;
}

export class StudentLoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Nomor induk mahasiswa wajib diisi' })
  studentNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Password wajib diisi' })
  password: string;
}