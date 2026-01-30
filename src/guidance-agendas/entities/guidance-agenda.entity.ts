import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Lecturer } from '../../lecturers/entities/lecturer.entity';

export enum GuidanceType {
  OFFLINE = 'offline',
  ONLINE = 'online',
}

export enum AgendaStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  UPCOMING = 'upcoming',
}

@Entity('guidance_agendas')
export class GuidanceAgenda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: GuidanceType,
  })
  type: GuidanceType;

  @Column({ nullable: true })
  location: string; // Untuk Offline (Nama Ruangan)

  @Column({ nullable: true })
  meetingLink: string; // Untuk Online (Zoom/GMeet)

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  startTime: string; // Format: HH:mm

  @Column({ type: 'time' })
  endTime: string; // Format: HH:mm

  @Column({
    type: 'enum',
    enum: AgendaStatus,
    default: AgendaStatus.UPCOMING,
  })
  status: AgendaStatus;

  @ManyToOne(() => Lecturer, { eager: true })
  lecturer: Lecturer;

  @CreateDateColumn()
  createdAt: Date;
}
