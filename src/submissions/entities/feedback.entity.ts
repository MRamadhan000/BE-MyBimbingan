import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn
} from 'typeorm';
import { Submission } from './submission.entity';

export enum FeedbackStatus {
  NEEDS_REVISION = 'NEEDS_REVISION',
  APPROVED = 'APPROVED'
}

@Entity('feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string; // Isi komentar/revisi

  @Column({
    type: 'enum',
    enum: FeedbackStatus,
    default: FeedbackStatus.NEEDS_REVISION
  })
  status: FeedbackStatus;

  @ManyToOne(() => Submission, (sub) => sub.feedbacks)
  submission: Submission;

  @CreateDateColumn()
  createdAt: Date;
}