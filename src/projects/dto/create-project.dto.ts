import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
  MaxLength,
  ValidateIf,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';

/**
 * Custom validator to ensure end date is after start date
 */
@ValidatorConstraint({ name: 'isEndDateAfterStartDate', async: false })
export class IsEndDateAfterStartDate implements ValidatorConstraintInterface {
  validate(endDate: string, args: ValidationArguments) {
    const object = args.object as CreateProjectDto;
    if (!endDate || !object.startDate) {
      return true; // Let other validators handle required field validation
    }
    return new Date(endDate) > new Date(object.startDate);
  }

  defaultMessage() {
    return 'End date must be after start date';
  }
}

/**
 * Data Transfer Object for creating a new project
 */
export class CreateProjectDto {
  /**
   * Project name - required field for project identification
   */
  @ApiProperty({
    description: 'Project name',
    example: 'TaskHub Mobile App Development',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Project name is required' })
  @MaxLength(255, { message: 'Project name cannot exceed 255 characters' })
  name: string;

  /**
   * Optional project description for detailed project information
   */
  @ApiProperty({
    description: 'Project description',
    example:
      'Development of a mobile application for the TaskHub project management system',
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @MaxLength(2000, {
    message: 'Project description cannot exceed 2000 characters',
  })
  description?: string;

  /**
   * Project start date - required for project timeline management
   */
  @ApiProperty({
    description: 'Project start date',
    example: '2024-01-15',
    type: 'string',
    format: 'date',
  })
  @IsNotEmpty({ message: 'Start date is required' })
  @IsDateString({}, { message: 'Start date must be a valid date (YYYY-MM-DD)' })
  startDate: string;

  /**
   * Project end date - optional but must be after start date if provided
   */
  @ApiProperty({
    description: 'Project end date',
    example: '2024-06-30',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid date (YYYY-MM-DD)' })
  @ValidateIf(
    (dto: CreateProjectDto) =>
      dto.endDate !== null && dto.endDate !== undefined,
  )
  @Validate(IsEndDateAfterStartDate)
  endDate?: string;

  /**
   * Project status for lifecycle management
   * Default status is ACTIVE for new projects
   */
  @ApiProperty({
    description: 'Project status',
    enum: ProjectStatus,
    example: ProjectStatus.ACTIVE,
    default: ProjectStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ProjectStatus, {
    message: 'Status must be active, completed, or on_hold',
  })
  status?: ProjectStatus;
}
