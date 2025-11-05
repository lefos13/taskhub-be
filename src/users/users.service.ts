import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { hash, compare } from 'bcrypt';

/**
 * Users service for user management business logic
 *
 * @service UsersService
 *
 * @remarks
 * This service handles user CRUD operations, password hashing,
 * and user validation logic.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a new user with hashed password
   *
   * @param userData - User data including email, password, and optional fields
   * @returns Promise<User> - Created user entity
   * @throws ConflictException - If email already exists
   */
  async create(userData: {
    email: string;
    password: string;
    role?: UserRole;
    firstName?: string;
    lastName?: string;
  }): Promise<User> {
    // Check if user with email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password with bcrypt (minimum 10 rounds for security)
    const saltRounds = 12;
    const hashedPassword = await hash(userData.password, saltRounds);

    // Create user entity
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  /**
   * Find user by ID
   *
   * @param id - User UUID
   * @returns Promise<User> - User entity
   * @throws NotFoundException - If user not found
   */
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Find user by email
   *
   * @param email - User email address
   * @returns Promise<User | null> - User entity or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  /**
   * Get all users with pagination
   *
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 20, max: 100)
   * @returns Promise<{ users: User[], total: number, page: number, limit: number }>
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
  }> {
    // Ensure limit doesn't exceed maximum
    const maxLimit = Math.min(limit, 100);
    const skip = (page - 1) * maxLimit;

    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take: maxLimit,
      order: { createdAt: 'DESC' },
    });

    return {
      users,
      total,
      page,
      limit: maxLimit,
    };
  }

  /**
   * Update user information
   *
   * @param id - User UUID
   * @param updateData - Partial user data to update
   * @returns Promise<User> - Updated user entity
   * @throws NotFoundException - If user not found
   */
  async update(
    id: string,
    updateData: {
      email?: string;
      password?: string;
      role?: UserRole;
      firstName?: string;
      lastName?: string;
    },
  ): Promise<User> {
    const user = await this.findById(id);

    // Hash password if provided
    if (updateData.password) {
      const saltRounds = 12;
      updateData.password = await hash(updateData.password, saltRounds);
    }

    // Check email uniqueness if email is being updated
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateData.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Update user
    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  /**
   * Delete user by ID
   *
   * @param id - User UUID
   * @returns Promise<void>
   * @throws NotFoundException - If user not found
   */
  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }

  /**
   * Validate user password
   *
   * @param plainPassword - Plain text password
   * @param hashedPassword - Hashed password from database
   * @returns Promise<boolean> - True if password matches
   */
  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await compare(plainPassword, hashedPassword);
  }
}
