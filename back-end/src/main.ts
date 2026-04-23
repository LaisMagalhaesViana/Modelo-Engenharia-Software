import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: [
			'http://localhost:5173',
			'https://modelo-engenharia-software-ig8sf8rup-allukazs-projects.vercel.app',
		],
		credentials: true,
	});

	const config = new DocumentBuilder()
		.setTitle('Documentação da api')
		.setDescription('A descrição da api')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document);

	await app.listen(process.env.PORT ?? 3000);
}

bootstrap();