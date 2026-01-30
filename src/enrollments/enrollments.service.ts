import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment>  {
    try {
      // Cek apakah mahasiswa sudah mendaftar ke dosen ini sebelumnya (Duplicate Check)
      const existing = await this.enrollmentRepository.findOne({
        where: {
          student: { id: createEnrollmentDto.studentId },
          lecturer: { id: createEnrollmentDto.lecturerId },
        },
      });

      if (existing) {
        throw new ConflictException('Mahasiswa sudah terdaftar pada dosen ini');
      }

      const enrollment = this.enrollmentRepository.create({
        student: { id: createEnrollmentDto.studentId },
        lecturer: { id: createEnrollmentDto.lecturerId },
      });

      return await this.enrollmentRepository.save(enrollment);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      
      // Error 23503: Foreign Key Violation (ID Student/Lecturer tidak ada di tabel asalnya)
      if (error.code === '23503') {
        throw new NotFoundException('Data Mahasiswa atau Dosen tidak ditemukan');
      }
      console.error(error);
      throw new InternalServerErrorException('Terjadi kesalahan pada server');
    }
  }

  async findAll(): Promise<Enrollment[]> {
    return await this.enrollmentRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Enrollment> {
    return await this.getEnrollmentOrThrow(id);
  }

  async remove(id: string): Promise<void> {
    const enrollment = await this.getEnrollmentOrThrow(id);
    await this.enrollmentRepository.remove(enrollment);
  }

  // --- HELPER FUNCTIONS ---

  private async getEnrollmentOrThrow(id: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({ where: { id } });
    if (!enrollment) {
      throw new NotFoundException(`Data pendaftaran dengan ID ${id} tidak ditemukan`);
    }
    return enrollment;
  }

}