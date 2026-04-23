import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [HealthModule, AuthModule, UserModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
