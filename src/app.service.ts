import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async onModuleInit() {
    if (this.dataSource.isInitialized) {
      this.logger.log('✅ Connected to database successfully!');
    } else {
      this.logger.error('❌ Failed to connect to database');
    }

    // For Redis, since it's already logged in module, but we can check here if needed
    // The Redis connection is already logged in the CacheModule factory
  }

  getHello(): string {
    return 'Hello World!';
  }
}
