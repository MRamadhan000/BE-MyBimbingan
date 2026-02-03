import { createConnection } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Lecturer } from '../../lecturers/entities/lecturer.entity';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import { GuidanceAgenda } from '../../guidance-agendas/entities/guidance-agenda.entity';
import { Submission } from '../../submissions/entities/submission.entity';
import { Feedback } from '../../submissions/entities/feedback.entity';
import { Attachment } from '../../submissions/entities/attachment.entity';

async function syncDatabase() {
  try {
    const connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5435', 10),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DB || 'mybimbingan_dev',
      entities: [Student, Lecturer, Enrollment, GuidanceAgenda, Submission, Feedback, Attachment],
      synchronize: true,
      logging: true,
    });

    console.log('🔄 Synchronizing database schema...');
    await connection.synchronize();
    console.log('✅ Database schema synchronized successfully!');
    
    await connection.close();
  } catch (error) {
    console.error('❌ Error synchronizing database:', error);
    process.exit(1);
  }
}

syncDatabase();