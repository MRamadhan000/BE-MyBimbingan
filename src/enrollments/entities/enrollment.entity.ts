import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Lecturer } from '../../lecturers/entities/lecturer.entity';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, { eager: true })
  student: Student;

  @ManyToOne(() => Lecturer, { eager: true })
  lecturer: Lecturer;

  @CreateDateColumn()
  createdAt: Date;
}