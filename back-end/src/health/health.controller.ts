import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
	@Get()
	@ApiOperation({ summary: 'Verifica o status da API' })
	@ApiOkResponse({
		description: 'Retorna uma mensagem de sucesso',
		type: String,
	})
	async health() {
		return 'Olá, a api está funcionando perfeitamente';
	}
}
