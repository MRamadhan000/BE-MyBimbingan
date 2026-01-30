import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    
    this.logger.log(`Auth attempt: ${method} ${url} from IP: ${ip}`);
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;

    if (err) {
      this.logger.error(`Auth error: ${err.message} - ${method} ${url} from IP: ${ip}`, err.stack);
      throw err;
    }

    if (!user) {
      this.logger.warn(`Auth failed: Invalid token - ${method} ${url} from IP: ${ip}`);
      throw info || new Error('Unauthorized');
    }

    this.logger.log(`Auth success: User ${user.id} (${user.role}) - ${method} ${url} from IP: ${ip}`);
    return user;
  }
}