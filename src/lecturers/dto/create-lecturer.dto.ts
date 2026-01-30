import { 
  IsString, 
  IsNotEmpty, 
  IsArray, 
  ArrayMinSize, 
  IsOptional, 
  MaxLength,
  MinLength
} from 'class-validator';

export class CreateLecturerDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama dosen tidak boleh kosong' })
  @MaxLength(100, { message: 'Nama terlalu panjang, maksimal 100 karakter' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'NUPTK wajib diisi' })
  @MaxLength(20, { message: 'NUPTK maksimal 20 karakter' })
  nuptk: string;

  @IsArray({ message: 'Bidang minat harus berupa array' })
  @IsString({ each: true, message: 'Setiap bidang minat harus berupa teks' })
  @ArrayMinSize(1, { message: 'Minimal masukkan satu bidang minat' })
  interests: string[];

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsNotEmpty({ message: 'Password wajib diisi' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;
}