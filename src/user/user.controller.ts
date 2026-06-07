import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Anonymous, AuditEvent } from 'src/decorators';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('users')
@Controller('user')
export class UserController {
    constructor(private readonly service: UserService) { }
    @Get()
    // @Roles(Role.User, Role.Admin)
    @Anonymous()
    findAll() {
        return this.service.findAll();
    }
    
    @Post()
    // @Roles(Role.Admin)
    @Anonymous()
    @AuditEvent({ action: 'CREATE_USER', module: 'USER', table: 'users' })
    create(@Body() createDto: CreateUserDto) {
        return this.service.create(createDto);
    }

}