import { Module, forwardRef } from '@nestjs/common';
import { LecturersService } from './lecturers.service';
import { LecturersController } from './lecturers.controller';
import { Lecturer } from './entities/lecturer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lecturer]), forwardRef(() => AuthModule)],
  controllers: [LecturersController],
  providers: [LecturersService],
  exports: [LecturersService],  
})
export class LecturersModule {}
