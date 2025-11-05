import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTokenDto {
  @ApiProperty({
    description: 'Unique device identifier',
    example: 'device123',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  deviceId: string;
}
