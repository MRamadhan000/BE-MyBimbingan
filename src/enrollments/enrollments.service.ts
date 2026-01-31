import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  InternalServerErrorException,
  Logger 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  private readonly logger = new Logger(EnrollmentsService.name);

  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  async create(lecturerId: string, studentId: string): Promise<Enrollment> {
    this.logger.log(`Attempting to create enrollment for student ${studentId} with lecturer ${lecturerId}`);
    try {
      // Cek apakah mahasiswa sudah mendaftar ke dosen ini sebelumnya (Duplicate Check)
      const existing = await this.enrollmentRepository.findOne({
        where: {
          student: { id: studentId },
          lecturer: { id: lecturerId },
        },
      });

      if (existing) {
        throw new ConflictException('Mahasiswa sudah terdaftar pada dosen ini');
      }

      const enrollment = this.enrollmentRepository.create({
        student: { id: studentId },
        lecturer: { id: lecturerId },
      });

      return await this.enrollmentRepository.save(enrollment);
    } catch (error) {
      if (error instanceof ConflictException) {
        this.logger.warn(`Enrollment creation failed - duplicate: student ${studentId} already enrolled with lecturer ${lecturerId}`);
        throw error;
      }
      
      // Error 23503: Foreign Key Violation (ID Student/Lecturer tidak ada di tabel asalnya)
      if (error.code === '23503') {
        this.logger.warn(`Enrollment creation failed - foreign key violation: invalid student ${studentId} or lecturer ${lecturerId}`);
        throw new NotFoundException('Data Mahasiswa atau Dosen tidak ditemukan');
      }
      this.logger.error(`Enrollment creation failed for student ${studentId} and lecturer ${lecturerId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Terjadi kesalahan pada server');
    }
  }

  async findAll(): Promise<Enrollment[]> {
    try {
      return await this.enrollmentRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(`Error fetching all enrollments: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Terjadi kesalahan saat mengambil data pendaftaran');
    }
  }

  async findByStudentId(studentId: string): Promise<Enrollment[]> {
    try {
      return await this.enrollmentRepository.find({
        where: { student: { id: studentId } },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(`Error fetching enrollments for student ${studentId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Terjadi kesalahan saat mengambil data pendaftaran Anda');
    }
  }

  async findOne(id: string): Promise<Enrollment> {
    try {
      return await this.getEnrollmentOrThrow(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error fetching enrollment with ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Terjadi kesalahan saat mengambil data pendaftaran');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const enrollment = await this.getEnrollmentOrThrow(id);
      await this.enrollmentRepository.remove(enrollment);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error removing enrollment with ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Terjadi kesalahan saat menghapus data pendaftaran');
    }
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