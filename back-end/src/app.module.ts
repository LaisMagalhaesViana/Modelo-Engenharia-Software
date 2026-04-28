import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
	imports: [HealthModule, AuthModule, UserModule, PrismaModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
