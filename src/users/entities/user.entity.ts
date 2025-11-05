import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';

/**
 * User role enumeration for role-based access control (RBAC)
 */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  MEMBER = 'member',
}

/**
 * User entity representing system users with authentication and role management
 *
 * @entity users
 * @description Core user management entity with UUID primary key, email authentication,
 * password hashing, role-based access control, and audit timestamps
 */
@Entity('users')
@Index(['email'], { unique: true })
@Index(['role'])
export class User {
  /**
   * UUID primary key for distributed system compatibility and security
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * User email address - unique constraint enforced at database level
   * Used for authentication and user identification
   */
  @Column({ unique: true, length: 255 })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  /**
   * Bcrypt hashed password - never store plain text passwords
   * Minimum 8 characters required for security compliance
   */
  @Column({ length: 255 })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  /**
   * User role for role-based access control (RBAC)
   * Default role is MEMBER for new users
   */
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  @IsEnum(UserRole, { message: 'Role must be admin, manager, or member' })
  role: UserRole;

  /**
   * Optional first name for user profile
   */
  @Column({ nullable: true, length: 100 })
  @IsOptional()
  @IsNotEmpty({ message: 'First name cannot be empty if provided' })
  firstName?: string;

  /**
   * Optional last name for user profile
   */
  @Column({ nullable: true, length: 100 })
  @IsOptional()
  @IsNotEmpty({ message: 'Last name cannot be empty if provided' })
  lastName?: string;

  /**
   * Audit timestamp - automatically set when user is created
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * Audit timestamp - automatically updated when user is modified
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Note: Relationships will be added as other entities are implemented
  // @OneToMany(() => Assignment, (assignment) => assignment.user)
  // assignments: Assignment[];

  // @OneToMany(() => TimeTracking, (timeTracking) => timeTracking.user)
  // timeEntries: TimeTracking[];

  // @OneToMany(() => Comment, (comment) => comment.user)
  // comments: Comment[];

  // @OneToMany(() => Notification, (notification) => notification.user)
  // notifications: Notification[];

  // @ManyToMany(() => Team, (team) => team.members)
  // teams: Team[];
}
