import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseUUIDPipe, 
  Query 
} from '@nestjs/common';
import { GuidanceAgendasService } from './guidance-agendas.service';
import { CreateGuidanceAgendaDto } from './dto/create-guidance-agenda.dto';
import { UpdateGuidanceAgendaDto } from './dto/update-guidance-agenda.dto';

@Controller('guidance-agendas')
export class GuidanceAgendasController {
  constructor(private readonly agendasService: GuidanceAgendasService) {}

  @Post()
  create(@Body() createDto: CreateGuidanceAgendaDto) {
    return this.agendasService.create(createDto);
  }

  @Get()
  findAll() {
    return this.agendasService.findAll();
  }

  // Endpoint khusus untuk melihat jadwal dosen tertentu
  // Contoh: /guidance-agendas/lecturer/uuid-dosen
  @Get('lecturer/:lecturerId')
  findByLecturer(@Param('lecturerId', ParseUUIDPipe) lecturerId: string) {
    return this.agendasService.findByLecturer(lecturerId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.agendasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateDto: UpdateGuidanceAgendaDto
  ) {
    return this.agendasService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.agendasService.remove(id);
  }
}