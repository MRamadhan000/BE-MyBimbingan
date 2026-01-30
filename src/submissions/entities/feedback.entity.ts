import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn
} from 'typeorm';
import { Submission } from './submission.entity';

@Entity('feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string; // Isi komentar/revisi

  @Column()
  senderType: 'STUDENT' | 'LECTURER';

  @ManyToOne(() => Submission, (sub) => sub.feedbacks)
  submission: Submission;

  @CreateDateColumn()
  createdAt: Date;
}