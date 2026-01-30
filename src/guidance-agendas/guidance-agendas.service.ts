import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuidanceAgenda, GuidanceType } from './entities/guidance-agenda.entity';
import { CreateGuidanceAgendaDto } from './dto/create-guidance-agenda.dto';
import { UpdateGuidanceAgendaDto } from './dto/update-guidance-agenda.dto';

@Injectable()
export class GuidanceAgendasService {
  constructor(
    @InjectRepository(GuidanceAgenda)
    private readonly agendaRepository: Repository<GuidanceAgenda>,
  ) {}

  async create(createDto: CreateGuidanceAgendaDto): Promise<GuidanceAgenda> {
    // Helper untuk validasi input berdasarkan tipe guidance
    this.validateGuidanceTypeDetails(createDto);

    try {
      const agenda = this.agendaRepository.create({
        ...createDto,
        lecturer: { id: createDto.lecturerId },
      });
      return await this.agendaRepository.save(agenda);
    } catch (error) {
      if (error.code === '23503') {
        throw new NotFoundException('Dosen pengampu tidak ditemukan');
      }
      console.error(error);
      throw new InternalServerErrorException('Gagal memproses agenda bimbingan');
    }
  }

  async findAll(): Promise<GuidanceAgenda[]> {
    return await this.agendaRepository.find({
      order: { date: 'DESC', startTime: 'ASC' },
    });
  }

  async findByLecturer(lecturerId: string): Promise<GuidanceAgenda[]> {
    return await this.agendaRepository.find({
      where: { lecturer: { id: lecturerId } },
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string): Promise<GuidanceAgenda> {
    return await this.getAgendaOrThrow(id);
  }

  async update(id: string, updateDto: UpdateGuidanceAgendaDto): Promise<GuidanceAgenda> {
    const agenda = await this.getAgendaOrThrow(id);
    
    // Validasi ulang jika tipe diubah
    if (updateDto.type) {
      this.validateGuidanceTypeDetails({ ...agenda, ...updateDto } as CreateGuidanceAgendaDto);
    }

    try {
      const updated = this.agendaRepository.merge(agenda, updateDto);
      return await this.agendaRepository.save(updated);
    } catch (error) {
      if (error.code === '23503') {
        throw new NotFoundException('Dosen pengampu tidak ditemukan');
      }
      console.error(error);
      throw new InternalServerErrorException('Gagal memproses agenda bimbingan');
    }
  }

  async remove(id: string): Promise<void> {
    const agenda = await this.getAgendaOrThrow(id);
    await this.agendaRepository.remove(agenda);
  }

  // --- HELPER FUNCTIONS ---

  private async getAgendaOrThrow(id: string): Promise<GuidanceAgenda> {
    const agenda = await this.agendaRepository.findOne({ where: { id } });
    if (!agenda) {
      throw new NotFoundException(`Agenda dengan ID ${id} tidak ditemukan`);
    }
    return agenda;
  }

  /**
   * Validasi logika bisnis: 
   * Jika OFFLINE wajib ada lokasi. Jika ONLINE wajib ada link.
   */
  private validateGuidanceTypeDetails(dto: CreateGuidanceAgendaDto) {
    if (dto.type === GuidanceType.OFFLINE && !dto.location) {
      throw new BadRequestException('Lokasi ruangan wajib diisi untuk bimbingan offline');
    }
    if (dto.type === GuidanceType.ONLINE && !dto.meetingLink) {
      throw new BadRequestException('Link meeting wajib diisi untuk bimbingan online');
    }
  }
}