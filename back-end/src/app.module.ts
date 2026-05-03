import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
	imports: [HealthModule, AuthModule, UserModule, PrismaModule, CategoryModule, TransactionModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
