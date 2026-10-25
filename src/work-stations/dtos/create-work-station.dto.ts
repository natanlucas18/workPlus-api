import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateWorkStationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  supervisor: string;
}
