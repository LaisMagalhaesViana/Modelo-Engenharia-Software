import { Body, Controller, Delete, Get, Param, Put, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUserDto';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return await this.userService.findOne(id);
	}

	@Put(':id')
	async update(@Param('id') id: string, @Body(new ValidationPipe()) updateUserDto: UpdateUserDto) {
		return await this.userService.update(id, updateUserDto);
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		return await this.userService.remove(id);
	}
}
