import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ default: 'user@example.com' })
    email: string;
    @ApiProperty()
    password: string;
}