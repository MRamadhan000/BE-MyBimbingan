import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Submission, SubmissionStatus } from './entities/submission.entity';
import { Attachment } from './entities/attachment.entitiy';
import { Feedback } from './entities/feedback.entity';
// import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class SubmissionsService {
  private readonly logger = new Logger(SubmissionsService.name);

  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepo: Repository<Submission>,
    @InjectRepository(Attachment)
    private readonly attachmentRepo: Repository<Attachment>,
    @InjectRepository(Feedback)
    private readonly feedbackRepo: Repository<Feedback>,
    // @InjectRepository(Enrollment)
    // private readonly enrollmentRepo: Repository<Enrollment>,
    private dataSource: DataSource,
  ) {}

  // ==========================================
  // LOGIKA SUBMISSION (Pusat Bimbingan)
  // ==========================================

  async create(dto: CreateSubmissionDto, studentId: string, files?: Express.Multer.File[]): Promise<Submission> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Cek jika ini adalah "Fix Revisi" (Tracking Parent)
      if (dto.parentId) {
        const parent = await this.submissionRepo.findOne({
          where: { id: dto.parentId },
        });
        if (!parent)
          throw new NotFoundException('Submission asal tidak ditemukan');
        if (parent.status !== SubmissionStatus.REVISION) {
          throw new BadRequestException(
            'Hanya submission berstatus REVISI yang bisa diperbaiki',
          );
        }
      }

      // 2. Validasi Enrollment Ownership - Pastikan enrollment milik student yang sedang login
      const enrollment = await this.dataSource
        .getRepository('Enrollment')
        .findOne({
          where: { id: dto.enrollmentId },
          relations: ['student']
        });
      
      if (!enrollment) {
        throw new NotFoundException('Enrollment tidak ditemukan');
      }
      
      if (enrollment.student.id !== studentId) {
        throw new BadRequestException('Anda tidak memiliki akses ke enrollment ini');
      }

      // 3. Simpan Data Submission
      const submission = this.submissionRepo.create({
        title: dto.title,
        description: dto.description,
        parentId: dto.parentId,
        enrollment: { id: dto.enrollmentId },
      });
      const savedSubmission = await queryRunner.manager.save(submission);

      // 4. Simpan File Attachment (jika ada)
      if (files && files.length > 0) {
        const attachments = files.map((file) =>
          this.attachmentRepo.create({
            fileName: file.originalname,
            fileData: file.buffer,
            fileSize: file.size.toString(),
            mimeType: file.mimetype,
            submission: savedSubmission
          }),
        );
        await queryRunner.manager.save(attachments);
      }

      await queryRunner.commitTransaction();
      // Return simplified submission data without file buffers
      const result = await this.findOneSimplified(savedSubmission.id);
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      )
        throw error;
      console.error(error);
      throw new InternalServerErrorException('Database Error');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    try {
      const submissions = await this.submissionRepo.find({
        relations: ['attachments', 'enrollment', 'enrollment.student', 'enrollment.lecturer'],
        order: { createdAt: 'DESC' },
      });
      
      // Simplify each submission
      return submissions.map(sub => ({
        ...sub,
        enrollment: {
          id: sub.enrollment.id,
          student: {
            id: sub.enrollment.student.id,
            name: sub.enrollment.student.name,
            studentNumber: sub.enrollment.student.studentNumber,
            major: sub.enrollment.student.major,
          },
          lecturer: {
            id: sub.enrollment.lecturer.id,
            name: sub.enrollment.lecturer.name,
            nuptk: sub.enrollment.lecturer.nuptk,
          },
          createdAt: sub.enrollment.createdAt,
        },
        attachments: sub.attachments.map(att => ({
          id: att.id,
          fileName: att.fileName,
          fileSize: att.fileSize,
          mimeType: att.mimeType,
        })),
      }));
    } catch (error) {
      this.logger.error(`Error fetching all submissions: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Terjadi kesalahan saat mengambil data submission');
    }
  }

  async findByEnrollment(enrollmentId: string, studentId: string) {
    try {
      // Validasi enrollment ownership
      const enrollment = await this.dataSource
        .getRepository('Enrollment')
        .findOne({
          where: { id: enrollmentId },
          relations: ['student']
        });
      
      if (!enrollment) {
        throw new NotFoundException('Enrollment tidak ditemukan');
      }
      if (enrollment.student.id !== studentId) {
        throw new BadRequestException('Anda tidak memiliki akses ke enrollment ini');
      }

      // Get submissions dengan feedback
      const submissions = await this.submissionRepo.find({
        where: { enrollment: { id: enrollmentId } },
        relations: ['attachments', 'enrollment', 'enrollment.student', 'enrollment.lecturer', 'feedbacks'],
        order: { createdAt: 'DESC' },
      });

      // Simplify submissions
      return submissions.map(sub => ({
        ...sub,
        enrollment: {
          id: sub.enrollment.id,
          student: {
            id: sub.enrollment.student.id,
            name: sub.enrollment.student.name,
            studentNumber: sub.enrollment.student.studentNumber,
            major: sub.enrollment.student.major,
          },
          lecturer: {
            id: sub.enrollment.lecturer.id,
            name: sub.enrollment.lecturer.name,
            nuptk: sub.enrollment.lecturer.nuptk,
          },
          createdAt: sub.enrollment.createdAt,
        },
        attachments: sub.attachments.map(att => ({
          id: att.id,
          fileName: att.fileName,
          fileSize: att.fileSize,
          mimeType: att.mimeType,
        })),
      }));
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error fetching submissions by enrollment: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Terjadi kesalahan saat mengambil data submission');
    }
  }

  async findOne(id: string) {
    try {
      const sub = await this.submissionRepo.findOne({
        where: { id },
        relations: ['attachments', 'feedbacks', 'children'],
      });
      if (!sub) throw new NotFoundException('Data tidak ditemukan');
      return sub;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error fetching submission with ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Terjadi kesalahan saat mengambil data submission');
    }
  }

  async findOneSimplified(id: string): Promise<any> {
    try {
      const sub = await this.submissionRepo.findOne({
        where: { id },
        relations: ['enrollment', 'enrollment.student', 'enrollment.lecturer', 'attachments', 'feedbacks'],
      });
      if (!sub) throw new NotFoundException('Data tidak ditemukan');
      
      // Remove sensitive data and file buffers
      const simplified = {
        ...sub,
        enrollment: {
          id: sub.enrollment.id,
          student: {
            id: sub.enrollment.student.id,
            name: sub.enrollment.student.name,
            studentNumber: sub.enrollment.student.studentNumber,
            major: sub.enrollment.student.major,
          },
          lecturer: {
            id: sub.enrollment.lecturer.id,
            name: sub.enrollment.lecturer.name,
            nuptk: sub.enrollment.lecturer.nuptk,
          },
          createdAt: sub.enrollment.createdAt,
        },
        attachments: sub.attachments.map(att => ({
          id: att.id,
          fileName: att.fileName,
          fileSize: att.fileSize,
          mimeType: att.mimeType,
        })),
      };
      
      return simplified;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error fetching simplified submission with ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Terjadi kesalahan saat mengambil data submission');
    }
  }

  // ==========================================
  // LOGIKA STATUS & FEEDBACK (Khusus Dosen)
  // ==========================================

  // Tambahkan di dalam class SubmissionsService
  async createFeedback(dto: CreateFeedbackDto): Promise<Feedback> {
    try {
      const submission = await this.submissionRepo.findOne({
        where: { id: dto.submissionId },
      });

      if (!submission) {
        throw new NotFoundException('Submission tidak ditemukan');
      }

      const feedback = this.feedbackRepo.create({
        content: dto.content,
        senderType: dto.senderType,
        submission: submission,
      });

      return await this.feedbackRepo.save(feedback);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error creating feedback for submission ${dto.submissionId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Terjadi kesalahan saat membuat feedback');
    }
  }

  async updateStatusAndFeedback(
    submissionId: string,
    status: SubmissionStatus,
    comment: string,
  ) {
    try {
      const submission = await this.findOne(submissionId);

      // Gunakan Transaction agar status berubah DAN feedback tersimpan (Atomic)
      return await this.dataSource.transaction(async (manager) => {
        // 1. Update Status Submission
        submission.status = status;
        await manager.save(submission);

        // 2. Tambahkan Feedback dari Dosen
        const feedback = this.feedbackRepo.create({
          content: comment,
          senderType: 'LECTURER',
          submission,
        });
        await manager.save(feedback);

        return submission;
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error updating status and feedback for submission ${submissionId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Terjadi kesalahan saat memperbarui status dan feedback');
    }
  }

  // ==========================================
  // LOGIKA ATTACHMENT (File Management)
  // ==========================================

  async removeAttachment(id: string) {
    try {
      const attachment = await this.attachmentRepo.findOne({ where: { id } });
      if (!attachment) throw new NotFoundException('File tidak ditemukan');
      return await this.attachmentRepo.remove(attachment);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error removing attachment with ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Terjadi kesalahan saat menghapus file');
    }
  }

  async getAttachment(id: string) {
    const attachment = await this.attachmentRepo.findOne({ 
      where: { id },
      relations: ['submission', 'submission.enrollment']
    });
    if (!attachment) throw new NotFoundException('File tidak ditemukan');
    return attachment;
  }
}
