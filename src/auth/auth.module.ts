import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { StudentsModule } from '../students/students.module';
import { LecturersModule } from '../lecturers/lecturers.module';
import { RolesGuard } from './guards/roles.guard';
import { AbilityFactory } from './abilities/ability.factory';
import { PoliciesGuard } from './guards/policies.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    StudentsModule,
    forwardRef(() => LecturersModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, AbilityFactory, PoliciesGuard],
  exports: [AuthService, RolesGuard, AbilityFactory, PoliciesGuard],
})
export class AuthModule {}
