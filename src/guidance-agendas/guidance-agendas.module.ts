import { Module } from '@nestjs/common';
import { GuidanceAgendasService } from './guidance-agendas.service';
import { GuidanceAgendasController } from './guidance-agendas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuidanceAgenda } from './entities/guidance-agenda.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([GuidanceAgenda]), AuthModule],
  controllers: [GuidanceAgendasController],
  providers: [GuidanceAgendasService],
  exports: [GuidanceAgendasService],
})
export class GuidanceAgendasModule {}