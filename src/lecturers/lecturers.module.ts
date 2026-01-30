import { Module } from '@nestjs/common';
import { LecturersService } from './lecturers.service';
import { LecturersController } from './lecturers.controller';
import { Lecturer } from './entities/lecturer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Lecturer])],
  controllers: [LecturersController],
  providers: [LecturersService],
  exports: [LecturersService],  
})
export class LecturersModule {}
