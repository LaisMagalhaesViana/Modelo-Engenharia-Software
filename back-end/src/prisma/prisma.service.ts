import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import 'dotenv/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  transaction: any;
	async onModuleInit() {
		await this.$connect();
	}
	constructor() {
		const adapter = new PrismaPg({
			connectionString: process.env['DATABASE_URL'],
		});
		super({ adapter });
	}
}
