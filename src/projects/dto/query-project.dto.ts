import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ProjectStatus } from '../entities/project.entity';

/**
 * Data Transfer Object for querying and filtering projects
 */
export class QueryProjectDto {
  /**
   * Filter by project status
   */
  @ApiProperty({
    description: 'Filter projects by status',
    enum: ProjectStatus,
    required: false,
    example: ProjectStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ProjectStatus, {
    message: 'Status must be active, completed, or on_hold',
  })
  status?: ProjectStatus;

  /**
   * Filter by project name (partial match)
   */
  @ApiProperty({
    description: 'Filter projects by name (partial match)',
    required: false,
    example: 'TaskHub',
  })
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * Filter projects starting from this date
   */
  @ApiProperty({
    description: 'Filter projects starting from this date',
    required: false,
    type: 'string',
    format: 'date',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Start date from must be a valid date (YYYY-MM-DD)' },
  )
  startDateFrom?: string;

  /**
   * Filter projects starting until this date
   */
  @ApiProperty({
    description: 'Filter projects starting until this date',
    required: false,
    type: 'string',
    format: 'date',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Start date to must be a valid date (YYYY-MM-DD)' },
  )
  startDateTo?: string;

  /**
   * Filter projects ending from this date
   */
  @ApiProperty({
    description: 'Filter projects ending from this date',
    required: false,
    type: 'string',
    format: 'date',
    example: '2024-06-01',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'End date from must be a valid date (YYYY-MM-DD)' },
  )
  endDateFrom?: string;

  /**
   * Filter projects ending until this date
   */
  @ApiProperty({
    description: 'Filter projects ending until this date',
    required: false,
    type: 'string',
    format: 'date',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'End date to must be a valid date (YYYY-MM-DD)' },
  )
  endDateTo?: string;

  /**
   * Page number for pagination (1-based)
   */
  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  /**
   * Number of items per page
   */
  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    minimum: 1,
    maximum: 100,
    default: 20,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 20;

  /**
   * Sort field
   */
  @ApiProperty({
    description: 'Field to sort by',
    required: false,
    enum: ['name', 'status', 'startDate', 'endDate', 'createdAt'],
    default: 'createdAt',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value as string) || 'createdAt')
  sort?: string = 'createdAt';

  /**
   * Sort order
   */
  @ApiProperty({
    description: 'Sort order',
    required: false,
    enum: ['ASC', 'DESC'],
    default: 'DESC',
    example: 'DESC',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value as string)?.toUpperCase() || 'DESC')
  order?: 'ASC' | 'DESC' = 'DESC';
}
