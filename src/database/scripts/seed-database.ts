import { createConnection } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Lecturer } from '../../lecturers/entities/lecturer.entity';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import { GuidanceAgenda } from '../../guidance-agendas/entities/guidance-agenda.entity';
import { Submission } from '../../submissions/entities/submission.entity';
import { Feedback } from '../../submissions/entities/feedback.entity';
import { Attachment } from '../../submissions/entities/attachment.entitiy';
import * as bcrypt from 'bcrypt';

async function seedDatabase() {
  try {
    const connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5435', 10),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DB || 'mybimbingan_dev',
      entities: [Student, Lecturer, Enrollment, GuidanceAgenda, Submission, Feedback, Attachment],
      synchronize: false,
      logging: true,
    });

    console.log('🌱 Seeding database...');

    const studentRepository = connection.getRepository(Student);
    const lecturerRepository = connection.getRepository(Lecturer);

    // Seed Students
    console.log('📚 Creating students...');
    const studentsData = [
      { name: 'Alice Johnson', studentNumber: '2021001', major: 'Computer Science', password: '123456' },
      { name: 'Bob Smith', studentNumber: '2021002', major: 'Information Systems', password: '123456' },
      { name: 'Charlie Brown', studentNumber: '2021003', major: 'Software Engineering', password: '123456' },
      { name: 'Diana Prince', studentNumber: '2021004', major: 'Computer Science', password: '123456' },
      { name: 'Edward Norton', studentNumber: '2021005', major: 'Information Technology', password: '123456' },
      { name: 'Fiona Green', studentNumber: '2021006', major: 'Computer Science', password: '123456' },
      { name: 'George Wilson', studentNumber: '2021007', major: 'Software Engineering', password: '123456' },
      { name: 'Hannah Davis', studentNumber: '2021008', major: 'Information Systems', password: '123456' },
      { name: 'Ivan Petrov', studentNumber: '2021009', major: 'Computer Science', password: '123456' },
      { name: 'Julia Roberts', studentNumber: '2021010', major: 'Information Technology', password: '123456' },
    ];

    for (const studentData of studentsData) {
      const student = studentRepository.create({
        ...studentData,
      });
      await studentRepository.save(student);
    }

    // Seed Lecturers
    console.log('👨‍🏫 Creating lecturers...');
    const lecturersData = [
      { name: 'Dr. Michael Anderson', nuptk: '1001', interests: ['Machine Learning', 'AI'], password: '123456' },
      { name: 'Prof. Sarah Williams', nuptk: '1002', interests: ['Web Development', 'Frontend'], password: '123456' },
      { name: 'Dr. David Chen', nuptk: '1003', interests: ['Database Systems', 'Backend'], password: '123456' },
      { name: 'Prof. Emily Rodriguez', nuptk: '1004', interests: ['Mobile Development', 'React Native'], password: '123456' },
      { name: 'Dr. James Taylor', nuptk: '1005', interests: ['Cybersecurity', 'Network'], password: '123456' },
      { name: 'Prof. Lisa Kumar', nuptk: '1006', interests: ['Data Science', 'Analytics'], password: '123456' },
      { name: 'Dr. Robert Zhang', nuptk: '1007', interests: ['Cloud Computing', 'AWS'], password: '123456' },
      { name: 'Prof. Maria Garcia', nuptk: '1008', interests: ['Software Engineering', 'Agile'], password: '123456' },
      { name: 'Dr. Kevin Lee', nuptk: '1009', interests: ['Game Development', 'Unity'], password: '123456' },
      { name: 'Prof. Amanda White', nuptk: '1010', interests: ['DevOps', 'Docker'], password: '123456' },
    ];

    for (const lecturerData of lecturersData) {
      const lecturer = lecturerRepository.create({
        ...lecturerData,
      });
      await lecturerRepository.save(lecturer);
    }

    console.log('✅ Database seeded successfully!');
    console.log('📋 Summary:');
    console.log(`   - ${studentsData.length} students created`);
    console.log(`   - ${lecturersData.length} lecturers created`);
    console.log('🔑 Default password for all users: 123456');
    
    await connection.close();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();