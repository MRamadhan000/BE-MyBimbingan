import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lecturer } from './entities/lecturer.entity';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';

@Injectable()
export class LecturersService {
  constructor(
    @InjectRepository(Lecturer)
    private readonly lecturerRepository: Repository<Lecturer>,
  ) {}

  // --- CRUD METHODS ---

  async create(createLecturerDto: CreateLecturerDto): Promise<Lecturer> {
    try {
      const lecturer = this.lecturerRepository.create(createLecturerDto);
      return await this.lecturerRepository.save(lecturer);
    } catch (error) {
      this.handleDatabaseExceptions(error);
    }
  }

  async findAll(): Promise<Lecturer[]> {
    return await this.lecturerRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Lecturer> {
    return await this.getLecturerOrThrow(id);
  }

  async update(id: string, updateLecturerDto: UpdateLecturerDto): Promise<Lecturer> {
    const lecturer = await this.getLecturerOrThrow(id);
    
    try {
      const updatedLecturer = this.lecturerRepository.merge(lecturer, updateLecturerDto);
      return await this.lecturerRepository.save(updatedLecturer);
    } catch (error) {
      this.handleDatabaseExceptions(error);
    }
  }

  async findByNuptk(nuptk: string): Promise<Lecturer | null> {
    return await this.lecturerRepository.findOne({ where: { nuptk } });
  }

  // --- HELPER FUNCTIONS ---

  /**
   * Helper untuk mencari dosen atau lempar 404 jika tidak ada
   */
  private async getLecturerOrThrow(id: string): Promise<Lecturer> {
    const lecturer = await this.lecturerRepository.findOne({ where: { id } });
    if (!lecturer) {
      throw new NotFoundException(`Dosen dengan ID ${id} tidak ditemukan`);
    }
    return lecturer;
  }

  /**
   * Helper untuk menangani error spesifik PostgreSQL
   */
  private handleDatabaseExceptions(error: any): never {
    if (error.code === '23505') {
      throw new ConflictException('NUPTK sudah terdaftar di sistem');
    }
    
    // Log error di server (opsional) untuk keperluan debugging
    console.error(error); 
    throw new InternalServerErrorException('Terjadi kesalahan pada server');
  }
}