import { createConnection } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Lecturer } from '../../lecturers/entities/lecturer.entity';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import { GuidanceAgenda } from '../../guidance-agendas/entities/guidance-agenda.entity';
import { Submission } from '../../submissions/entities/submission.entity';
import { Feedback } from '../../submissions/entities/feedback.entity';
import { Attachment } from '../../submissions/entities/attachment.entitiy';

async function dropDatabase() {
  try {
    const connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5435', 10),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DB || 'mybimbingan_dev',
      entities: [Student, Lecturer, Enrollment, GuidanceAgenda, Submission, Feedback, Attachment],
      logging: true,
    });

    console.log('🗑️  Dropping all tables...');
    await connection.dropDatabase();
    console.log('✅ All tables dropped successfully!');
    
    await connection.close();
  } catch (error) {
    if (error.code === '3D000') {
      console.log('ℹ️  Database does not exist, skipping drop operation.');
      return;
    }
    console.error('❌ Error dropping database:', error);
    process.exit(1);
  }
}

dropDatabase();