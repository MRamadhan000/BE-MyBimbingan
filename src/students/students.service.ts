import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    console.log('Creating student in service:', createStudentDto);
    try {
      const student = this.studentRepository.create(createStudentDto);
      console.log('Student entity created:', student);
      const saved = await this.studentRepository.save(student);
      console.log('Student saved:', saved);
      return saved;
    } catch (error) {
      console.error('Error in students service create:', error);
      if (error.code === '23505') {
        throw new ConflictException('Nomor mahasiswa sudah terdaftar');
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<Student[]> {
    return await this.studentRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException(`Mahasiswa dengan ID ${id} tidak ditemukan`);
    }
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);
    
    try {
      const updatedStudent = this.studentRepository.merge(student, updateStudentDto);
      return await this.studentRepository.save(updatedStudent);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Nomor mahasiswa sudah digunakan oleh data lain');
      }
      throw new InternalServerErrorException();
    }
  }

  async findByStudentNumber(studentNumber: string): Promise<Student | null> {
    return await this.studentRepository.findOne({ where: { studentNumber } });
  }
}