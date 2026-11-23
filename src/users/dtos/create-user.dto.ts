import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRoles } from 'src/enums/user-roles.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'João Souza',
    description: 'Nome do usuário',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'joaosouza021@gmail.com',
    description: 'E-mail de acesso do usuário',
    maxLength: 255,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: 'js295502#',
    description: 'Senha de acesso do usuário',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'supervisor',
    description: 'Papeis de acesso do usuário no sistema',
    enum: UserRoles,
  })
  @IsOptional()
  @IsEnum(UserRoles)
  role?: UserRoles;
}
