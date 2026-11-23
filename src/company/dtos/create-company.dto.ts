import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    example: 'JsAgro',
    description: 'Nome da empresa',
    maxLength: 120,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;
}
