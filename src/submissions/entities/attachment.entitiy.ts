import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { Submission } from './submission.entity';

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column()
  fileUrl: string;

  @Column()
  fileSize: string; // Simpan "1.8 MB" agar tidak perlu hitung ulang di FE

  @ManyToOne(() => Submission, (sub) => sub.attachments)
  submission: Submission;
}
