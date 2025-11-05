import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';
import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

/**
 * Project status enumeration for project lifecycle management
 */
export enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
}

/**
 * Project entity representing project containers for task organization
 *
 * @entity projects
 * @description Core project management entity with UUID primary key, status tracking,
 * date validation, audit timestamps, and soft delete capabilities
 */
@Entity('projects')
@Index(['status'])
@Index(['startDate'])
@Index(['endDate'])
@Index(['createdAt'])
export class Project {
  /**
   * UUID primary key for distributed system compatibility and security
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Project name - required field for project identification
   */
  @Column({ length: 255 })
  @IsNotEmpty({ message: 'Project name is required' })
  @MaxLength(255, { message: 'Project name cannot exceed 255 characters' })
  name: string;

  /**
   * Optional project description for detailed project information
   */
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @MaxLength(2000, {
    message: 'Project description cannot exceed 2000 characters',
  })
  description?: string;

  /**
   * Project start date - required for project timeline management
   */
  @Column({ type: 'date', name: 'start_date' })
  @IsNotEmpty({ message: 'Start date is required' })
  @IsDateString({}, { message: 'Start date must be a valid date' })
  startDate: Date;

  /**
   * Project end date - optional but must be after start date if provided
   */
  @Column({ type: 'date', name: 'end_date', nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid date' })
  @ValidateIf(
    (project: Project) =>
      project.endDate !== null && project.endDate !== undefined,
  )
  endDate?: Date;

  /**
   * Project status for lifecycle management
   * Default status is ACTIVE for new projects
   */
  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  @IsEnum(ProjectStatus, {
    message: 'Status must be active, completed, or on_hold',
  })
  status: ProjectStatus;

  /**
   * Audit timestamp - automatically set when project is created
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * Audit timestamp - automatically updated when project is modified
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Soft delete timestamp - allows data preservation while marking as deleted
   */
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  // Note: Relationships will be added as other entities are implemented
  // @OneToMany(() => Team, (team) => team.project)
  // teams: Team[];

  // @OneToMany(() => Task, (task) => task.project)
  // tasks: Task[];

  /**
   * Custom validation to ensure end date is after start date
   */
  validateDateRange(): boolean {
    if (this.endDate && this.startDate) {
      return new Date(this.endDate) > new Date(this.startDate);
    }
    return true;
  }
}
