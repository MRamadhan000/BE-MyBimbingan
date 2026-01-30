import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SubmissionStatus } from './entities/submission.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  // ==========================================
  // ENDPOINT MAHASISWA (Submission)
  // ==========================================

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateSubmissionDto) {
    // Endpoint ini otomatis menghandle bimbingan baru ATAU fix revisi (jika ada parentId)
    return this.submissionsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.submissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.submissionsService.findOne(id);
  }

  // ==========================================
  // ENDPOINT DOSEN (Review & Feedback)
  // ==========================================

  @Post('feedbacks')
  @HttpCode(HttpStatus.CREATED)
  createFeedback(@Body() createFeedbackDto: CreateFeedbackDto) {
    // Gunakan ini untuk menambah komentar/diskusi di dalam submission
    return this.submissionsService.createFeedback(createFeedbackDto);
  }

  @Get(':id/feedbacks')
  getFeedbacks(@Param('id', ParseUUIDPipe) id: string) {
    // Ambil semua riwayat chat berdasarkan ID submission
    return this.submissionsService.findOne(id).then((sub) => sub.feedbacks);
  }

  @Patch(':id/review')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: SubmissionStatus,
    @Body('comment') comment: string,
  ) {
    // Dosen mengubah status dan memberi komentar dalam satu request
    return this.submissionsService.updateStatusAndFeedback(id, status, comment);
  }

  // ==========================================
  // ENDPOINT ATTACHMENT & FILE
  // ==========================================

  @Delete('attachments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFile(@Param('id', ParseUUIDPipe) id: string) {
    return this.submissionsService.removeAttachment(id);
  }
}
