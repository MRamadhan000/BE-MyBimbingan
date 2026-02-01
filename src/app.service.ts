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
    // Log Environment Information
    this.logger.debug('🚀 Starting MyBimbingan Backend Application');
    this.logger.debug(`📋 NODE_ENV: ${process.env.NODE_ENV}'`);
    this.logger.debug(`� Using environment file: .env.${process.env.NODE_ENV}`);
    this.logger.debug(`��� JWT_SECRET: ${process.env.JWT_SECRET ? '***configured***' : 'NOT SET'}`);

    // Database Configuration
    this.logger.debug('🗄️  Database Configuration:');
    this.logger.debug(`   Host: ${process.env.POSTGRES_HOST}`);
    this.logger.debug(`   Port: ${process.env.POSTGRES_PORT}`);
    this.logger.debug(`   Database: ${process.env.POSTGRES_DB}`);
    this.logger.debug(`   User: ${process.env.POSTGRES_USER}`);
    this.logger.debug(`   Password: ${process.env.POSTGRES_PASSWORD}`);

    // Redis Configuration
    this.logger.debug('🔴 Redis Configuration:');
    this.logger.debug(`   Host: ${process.env.REDIS_HOST}`);
    this.logger.debug(`   Port: ${process.env.REDIS_PORT}`);

    // Check Database Connection
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