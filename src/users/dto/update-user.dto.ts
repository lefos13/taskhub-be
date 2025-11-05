import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

/**
 * Data Transfer Object for updating an existing user
 *
 * @dto UpdateUserDto
 *
 * @remarks
 * This DTO defines the structure and validation rules for user update requests.
 * All fields are optional since this is for partial updates.
 */
export class UpdateUserDto {
  /**
   * User email address - must be unique and valid email format
   */
  @ApiPropertyOptional({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email cannot be empty if provided' })
  email?: string;

  /**
   * User password - minimum 8 characters for security
   */
  @ApiPropertyOptional({
    description: 'User password',
    example: 'NewSecurePassword123!',
    minLength: 8,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Password cannot be empty if provided' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;

  /**
   * User role for access control
   */
  @ApiPropertyOptional({
    description: 'User role for access control',
    enum: UserRole,
    example: UserRole.MANAGER,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be admin, manager, or member' })
  role?: UserRole;

  /**
   * User first name
   */
  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
    maxLength: 100,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'First name cannot be empty if provided' })
  firstName?: string;

  /**
   * User last name
   */
  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
    maxLength: 100,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Last name cannot be empty if provided' })
  lastName?: string;
}
