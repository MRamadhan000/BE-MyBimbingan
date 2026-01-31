import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  InternalServerErrorException,
  Inject,
  Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Submission, SubmissionStatus } from '../submissions/entities/submission.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Feedback } from '../submissions/entities/feedback.entity';

@Injectable()
export class StudentsService {
  private readonly logger = new Logger(StudentsService.name);
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    console.log('Creating student in service:', createStudentDto);
    try {
      const student = this.studentRepository.create(createStudentDto);
      console.log('Student entity created:', student);
      const saved = await this.studentRepository.save(student);
      console.log('Student saved:', saved);
      return saved;
    } catch (error) {
      console.error('Error in students service create:', error);
      if (error.code === '23505') {
        throw new ConflictException('Nomor mahasiswa sudah terdaftar');
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<Student[]> {
    return await this.studentRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException(`Mahasiswa dengan ID ${id} tidak ditemukan`);
    }
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);
    
    try {
      const updatedStudent = this.studentRepository.merge(student, updateStudentDto);
      return await this.studentRepository.save(updatedStudent);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Nomor mahasiswa sudah digunakan oleh data lain');
      }
      throw new InternalServerErrorException();
    }
  }

  async findByStudentNumber(studentNumber: string): Promise<Student | null> {
    return await this.studentRepository.findOne({ where: { studentNumber } });
  }

  async getStudentStatistics(studentId: string) {
    const cacheKey = `student:stats:${studentId}`;
    const cachedStats = await this.cacheManager.get(cacheKey);
    if (cachedStats) {
      this.logger.debug(`Returning cached statistics for student ${studentId}`);
      return cachedStats;
    }

    this.logger.debug(`Calculating statistics for student ${studentId}`);

    const student = await this.findOne(studentId);

    // Get enrollments for this student
    const enrollments = await this.enrollmentRepository.find({
      where: { student: { id: studentId } },
      relations: ['lecturer'],
    });

    // Get submissions through enrollments
    const enrollmentIds = enrollments.map(e => e.id);
    const submissions = await this.submissionRepository.find({
      where: enrollmentIds.length > 0 ? { enrollment: { id: In(enrollmentIds) } } : {},
      relations: ['enrollment'],
    });

    // Count submissions by status
    const submissionsByStatus = {
      pending: submissions.filter(s => s.status === SubmissionStatus.PENDING).length,
      revision: submissions.filter(s => s.status === SubmissionStatus.REVISION).length,
      approved: submissions.filter(s => s.status === SubmissionStatus.APPROVED).length,
    };

    // Get feedbacks for submissions
    const submissionIds = submissions.map(s => s.id);
    const feedbacks = submissionIds.length > 0 
      ? await this.feedbackRepository.find({
          where: { submission: { id: In(submissionIds) } },
        })
      : [];

    const stats = {
      student: {
        id: student.id,
        name: student.name,
        studentNumber: student.studentNumber,
        major: student.major,
      },
      statistics: {
        totalEnrollments: enrollments.length,
        totalSubmissions: submissions.length,
        submissionsByStatus,
        totalFeedbacks: feedbacks.length,
        lecturers: enrollments.map(e => ({
          id: e.lecturer.id,
          name: e.lecturer.name,
        })),
      },
    };

    // Cache for 5 minutes
    await this.cacheManager.set(cacheKey, stats, 300000);

    return stats;
  }
}