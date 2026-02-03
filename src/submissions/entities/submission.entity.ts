import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import { Attachment } from './attachment.entity';
import { Feedback } from './feedback.entity';

export enum SubmissionStatus {
  PENDING = 'MENUNGGU_REVIEW',
  REVISION = 'REVISI',
  APPROVED = 'DISETUJUI',
}

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.PENDING,
  })
  status: SubmissionStatus;

  // --- LOGIKA TRACKING REVISI ---
  
  @Column({ nullable: true })
  parentId: string; // Menyimpan ID submission yang direvisi

  @ManyToOne(() => Submission, (submission) => submission.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Submission; // Menunjuk ke submission "lama"

  @OneToMany(() => Submission, (submission) => submission.parent)
  children: Submission[]; // Daftar submission "baru" (hasil revisi) yang menunjuk ke sini

  // ------------------------------

  @ManyToOne(() => Enrollment, { eager: true })
  enrollment: Enrollment;

  @OneToMany(() => Attachment, (attachment) => attachment.submission)
  attachments: Attachment[];

  @OneToMany(() => Feedback, (feedback) => feedback.submission)
  feedbacks: Feedback[];

  @CreateDateColumn()
  createdAt: Date;
}