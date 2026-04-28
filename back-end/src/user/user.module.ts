import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserGuard } from './user.guard';

@Module({
	imports: [PrismaModule],
	controllers: [UserController],
	providers: [UserService, UserGuard],
	exports: [UserService],
})
export class UserModule {}
