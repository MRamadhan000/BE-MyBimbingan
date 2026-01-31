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
    private dataSource: DataSource,
  ) {}

  // ==========================================
  // LOGIKA SUBMISSION (Pusat Bimbingan)
  // ==========================================

  async create(dto: CreateSubmissionDto, studentId: string): Promise<Submission> {
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

      // 2. Simpan Data Submission
      const submission = this.submissionRepo.create({
        ...dto,
        student: { id: studentId },
        lecturer: { id: dto.lecturerId },
      });
      const savedSubmission = await queryRunner.manager.save(submission);

      // 3. Simpan File Attachment (jika ada)
      if (dto.files && dto.files.length > 0) {
        const attachments = dto.files.map((f) =>
          this.attachmentRepo.create({ ...f, submission: savedSubmission }),
        );
        await queryRunner.manager.save(attachments);
      }

      await queryRunner.commitTransaction();
      return this.findOne(savedSubmission.id);
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
      return await this.submissionRepo.find({
        relations: ['attachments', 'student', 'lecturer'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(`Error fetching all submissions: ${error.message}`, error.stack);
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

        return { message: 'Status updated and feedback sent', status };
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
}
