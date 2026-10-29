import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ListDestinationsQuery {
  @ApiPropertyOptional({
    example: 'an-giang',
    description: 'Filter by province code',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  province?: string;
}
