import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

/**
 * Data Transfer Object for creating a new user
 *
 * @dto CreateUserDto
 *
 * @remarks
 * This DTO defines the structure and validation rules for user creation requests.
 * All fields are validated using class-validator decorators.
 */
export class CreateUserDto {
  /**
   * User email address - must be unique and valid email format
   */
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  /**
   * User password - minimum 8 characters for security
   */
  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  /**
   * User role for access control - defaults to MEMBER if not specified
   */
  @ApiPropertyOptional({
    description: 'User role for access control',
    enum: UserRole,
    example: UserRole.MEMBER,
    default: UserRole.MEMBER,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be admin, manager, or member' })
  role?: UserRole;

  /**
   * Optional first name
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
   * Optional last name
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
