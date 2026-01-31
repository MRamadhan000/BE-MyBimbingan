import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseUUIDPipe, 
  Query,
  UseGuards,
  Req
} from '@nestjs/common';
import { GuidanceAgendasService } from './guidance-agendas.service';
import { CreateGuidanceAgendaDto } from './dto/create-guidance-agenda.dto';
import { UpdateGuidanceAgendaDto } from './dto/update-guidance-agenda.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { CheckPolicies } from '../auth/decorators/check-policies.decorator';
import { readGuidanceAgendaPolicy, createGuidanceAgendaPolicy, updateGuidanceAgendaPolicy, deleteGuidanceAgendaPolicy } from './policies/guidance-agenda-policies';

@Controller('guidance-agendas')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class GuidanceAgendasController {
  constructor(private readonly agendasService: GuidanceAgendasService) {}

  @Post()
  @CheckPolicies(createGuidanceAgendaPolicy)
  create(@Body() createDto: CreateGuidanceAgendaDto, @Req() req: any) {
    const lecturerId = req.user.id; // Get lecturer ID from JWT token
    return this.agendasService.create(createDto, lecturerId);
  }

  @Get()
  @CheckPolicies(readGuidanceAgendaPolicy)
  findAll() {
    return this.agendasService.findAll();
  }

  // Endpoint khusus untuk melihat jadwal dosen tertentu
  // Contoh: /guidance-agendas/lecturer/uuid-dosen
  @Get('lecturer/:lecturerId')
  @CheckPolicies(readGuidanceAgendaPolicy)
  findByLecturer(@Param('lecturerId', ParseUUIDPipe) lecturerId: string) {
    return this.agendasService.findByLecturer(lecturerId);
  }

  @Get(':id')
  @CheckPolicies(readGuidanceAgendaPolicy)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.agendasService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(updateGuidanceAgendaPolicy)
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateDto: UpdateGuidanceAgendaDto
  ) {
    return this.agendasService.update(id, updateDto);
  }

  @Delete(':id')
  @CheckPolicies(deleteGuidanceAgendaPolicy)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.agendasService.remove(id);
  }
}