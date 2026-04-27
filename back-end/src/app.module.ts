import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { CategoryModule } from './category/category.module';

@Module({
	imports: [HealthModule, AuthModule, UserModule, CategoryModule],
	controllers: [AppController],
	providers: [AppService, PrismaService],
})
export class AppModule {}
