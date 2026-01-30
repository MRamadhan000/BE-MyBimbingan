import { 
  IsEnum, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsUUID, 
  IsDateString, 
  Matches 
} from 'class-validator';
import { GuidanceType, AgendaStatus } from '../entities/guidance-agenda.entity';

export class CreateGuidanceAgendaDto {
  @IsEnum(GuidanceType)
  @IsNotEmpty()
  type: GuidanceType;

  @IsString()
  @IsOptional()
  // Logika: Jika offline, biasanya ini wajib diisi di level service
  location?: string;

  @IsString()
  @IsOptional()
  // Logika: Jika online, link meeting wajib ada
  meetingLink?: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, { message: 'Format jam harus HH:mm' })
  @IsNotEmpty()
  startTime: string;

  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, { message: 'Format jam harus HH:mm' })
  @IsNotEmpty()
  endTime: string;

  @IsEnum(AgendaStatus)
  @IsOptional()
  status: AgendaStatus;

  @IsUUID()
  @IsNotEmpty()
  lecturerId: string;
}