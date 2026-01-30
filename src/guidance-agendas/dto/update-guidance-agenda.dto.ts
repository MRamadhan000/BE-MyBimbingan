import { PartialType } from '@nestjs/mapped-types';
import { CreateGuidanceAgendaDto } from './create-guidance-agenda.dto';

export class UpdateGuidanceAgendaDto extends PartialType(CreateGuidanceAgendaDto) {}
