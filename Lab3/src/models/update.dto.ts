import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from '@nestjs/class-validator';

export class UpdateDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  Status: string;
}