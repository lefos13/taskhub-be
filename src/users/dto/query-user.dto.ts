import { IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

/**
 * Data Transfer Object for querying users with filters and pagination
 *
 * @dto QueryUserDto
 *
 * @remarks
 * This DTO defines the structure and validation rules for user query requests
 * including filtering, sorting, and pagination parameters.
 */
export class QueryUserDto {
  /**
   * Page number for pagination
   */
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  /**
   * Number of items per page
   */
  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 20;

  /**
   * Filter by user role
   */
  @ApiPropertyOptional({
    description: 'Filter by user role',
    enum: UserRole,
    example: UserRole.MEMBER,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be admin, manager, or member' })
  role?: UserRole;

  /**
   * Search by email (partial match)
   */
  @ApiPropertyOptional({
    description: 'Search by email (partial match)',
    example: 'john@example.com',
  })
  @IsOptional()
  email?: string;

  /**
   * Search by first name (partial match)
   */
  @ApiPropertyOptional({
    description: 'Search by first name (partial match)',
    example: 'John',
  })
  @IsOptional()
  firstName?: string;

  /**
   * Search by last name (partial match)
   */
  @ApiPropertyOptional({
    description: 'Search by last name (partial match)',
    example: 'Doe',
  })
  @IsOptional()
  lastName?: string;

  /**
   * Sort field
   */
  @ApiPropertyOptional({
    description: 'Sort field',
    enum: ['email', 'firstName', 'lastName', 'role', 'createdAt', 'updatedAt'],
    example: 'createdAt',
    default: 'createdAt',
  })
  @IsOptional()
  @IsEnum(
    ['email', 'firstName', 'lastName', 'role', 'createdAt', 'updatedAt'],
    {
      message:
        'Sort field must be one of: email, firstName, lastName, role, createdAt, updatedAt',
    },
  )
  sort?: string = 'createdAt';

  /**
   * Sort order
   */
  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
    default: 'DESC',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'Order must be ASC or DESC' })
  order?: 'ASC' | 'DESC' = 'DESC';
}
