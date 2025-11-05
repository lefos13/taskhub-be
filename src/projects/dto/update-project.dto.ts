import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsDateString,
  MaxLength,
  ValidateIf,
  Validate,
} from 'class-validator';
import {
  CreateProjectDto,
  IsEndDateAfterStartDate,
} from './create-project.dto';
import { ProjectStatus } from '../entities/project.entity';

/**
 * Data Transfer Object for updating an existing project
 * Extends CreateProjectDto with all fields optional
 */
export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  /**
   * Project name - optional for updates
   */
  @ApiProperty({
    description: 'Project name',
    example: 'TaskHub Mobile App Development - Updated',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @MaxLength(255, { message: 'Project name cannot exceed 255 characters' })
  name?: string;

  /**
   * Project description - optional for updates
   */
  @ApiProperty({
    description: 'Project description',
    example:
      'Updated description for the TaskHub mobile application development project',
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @MaxLength(2000, {
    message: 'Project description cannot exceed 2000 characters',
  })
  description?: string;

  /**
   * Project start date - optional for updates
   */
  @ApiProperty({
    description: 'Project start date',
    example: '2024-02-01',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid date (YYYY-MM-DD)' })
  startDate?: string;

  /**
   * Project end date - optional for updates, must be after start date if both are provided
   */
  @ApiProperty({
    description: 'Project end date',
    example: '2024-07-31',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid date (YYYY-MM-DD)' })
  @ValidateIf(
    (dto: UpdateProjectDto) =>
      dto.endDate !== null &&
      dto.endDate !== undefined &&
      dto.startDate !== undefined,
  )
  @Validate(IsEndDateAfterStartDate)
  endDate?: string;

  /**
   * Project status - optional for updates
   */
  @ApiProperty({
    description: 'Project status',
    enum: ProjectStatus,
    example: ProjectStatus.COMPLETED,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProjectStatus, {
    message: 'Status must be active, completed, or on_hold',
  })
  status?: ProjectStatus;
}
