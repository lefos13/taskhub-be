import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Project, ProjectStatus } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';

/**
 * Service for managing project operations
 * Handles CRUD operations, validation, and business logic for projects
 */
@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  /**
   * Create a new project with validation
   * @param createProjectDto - Project creation data
   * @returns Promise<Project> - Created project entity
   */
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    this.logger.log(`Creating new project: ${createProjectDto.name}`);

    // Validate date range if both dates are provided
    if (createProjectDto.endDate && createProjectDto.startDate) {
      const startDate = new Date(createProjectDto.startDate);
      const endDate = new Date(createProjectDto.endDate);

      if (endDate <= startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    try {
      const project = this.projectRepository.create({
        ...createProjectDto,
        startDate: new Date(createProjectDto.startDate),
        endDate: createProjectDto.endDate
          ? new Date(createProjectDto.endDate)
          : undefined,
        status: createProjectDto.status || ProjectStatus.ACTIVE,
      });

      const savedProject = await this.projectRepository.save(project);
      this.logger.log(
        `Project created successfully with ID: ${savedProject.id}`,
      );

      return savedProject;
    } catch (error) {
      this.logger.error(
        `Failed to create project: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new BadRequestException('Failed to create project');
    }
  }

  /**
   * Find all projects with optional filtering and pagination
   * @param queryDto - Query parameters for filtering and pagination
   * @returns Promise<{ projects: Project[]; total: number; page: number; limit: number }> - Paginated projects
   */
  async findAll(queryDto: QueryProjectDto): Promise<{
    projects: Project[];
    total: number;
    page: number;
    limit: number;
  }> {
    this.logger.log('Fetching projects with filters', queryDto);

    const queryBuilder = this.projectRepository.createQueryBuilder('project');

    // Apply filters
    this.applyFilters(queryBuilder, queryDto);

    // Apply sorting
    const sortField = this.validateSortField(queryDto.sort);
    queryBuilder.orderBy(`project.${sortField}`, queryDto.order);

    // Apply pagination
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 20;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    try {
      const [projects, total] = await queryBuilder.getManyAndCount();

      this.logger.log(`Found ${projects.length} projects (${total} total)`);

      return {
        projects,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch projects: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new BadRequestException('Failed to fetch projects');
    }
  }

  /**
   * Find a single project by ID
   * @param id - Project UUID
   * @returns Promise<Project> - Found project entity
   */
  async findOne(id: string): Promise<Project> {
    this.logger.log(`Fetching project with ID: ${id}`);

    try {
      const project = await this.projectRepository.findOne({
        where: { id },
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      return project;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch project: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new BadRequestException('Failed to fetch project');
    }
  }

  /**
   * Update an existing project
   * @param id - Project UUID
   * @param updateProjectDto - Project update data
   * @returns Promise<Project> - Updated project entity
   */
  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    this.logger.log(`Updating project with ID: ${id}`);

    const existingProject = await this.findOne(id);

    // Validate date range if dates are being updated
    const startDate = updateProjectDto.startDate
      ? new Date(updateProjectDto.startDate)
      : existingProject.startDate;
    const endDate = updateProjectDto.endDate
      ? new Date(updateProjectDto.endDate)
      : existingProject.endDate;

    if (endDate && startDate && endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    try {
      const updateData: Partial<Project> = {};

      // Copy non-date fields
      if (updateProjectDto.name !== undefined) {
        updateData.name = updateProjectDto.name;
      }
      if (updateProjectDto.description !== undefined) {
        updateData.description = updateProjectDto.description;
      }
      if (updateProjectDto.status !== undefined) {
        updateData.status = updateProjectDto.status;
      }

      // Handle date fields with proper conversion
      if (updateProjectDto.startDate) {
        updateData.startDate = new Date(updateProjectDto.startDate);
      }

      if (updateProjectDto.endDate) {
        updateData.endDate = new Date(updateProjectDto.endDate);
      }

      await this.projectRepository.update(id, updateData);

      const updatedProject = await this.findOne(id);
      this.logger.log(`Project updated successfully with ID: ${id}`);

      return updatedProject;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to update project: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new BadRequestException('Failed to update project');
    }
  }

  /**
   * Soft delete a project (sets deletedAt timestamp)
   * @param id - Project UUID
   * @returns Promise<void>
   */
  async remove(id: string): Promise<void> {
    this.logger.log(`Soft deleting project with ID: ${id}`);

    await this.findOne(id); // Verify project exists

    try {
      await this.projectRepository.softDelete(id);
      this.logger.log(`Project soft deleted successfully with ID: ${id}`);
    } catch (error) {
      this.logger.error(
        `Failed to delete project: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new BadRequestException('Failed to delete project');
    }
  }

  /**
   * Restore a soft-deleted project
   * @param id - Project UUID
   * @returns Promise<Project> - Restored project entity
   */
  async restore(id: string): Promise<Project> {
    this.logger.log(`Restoring project with ID: ${id}`);

    try {
      await this.projectRepository.restore(id);
      const restoredProject = await this.findOne(id);
      this.logger.log(`Project restored successfully with ID: ${id}`);

      return restoredProject;
    } catch (error) {
      this.logger.error(
        `Failed to restore project: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new BadRequestException('Failed to restore project');
    }
  }

  /**
   * Apply filters to the query builder
   * @private
   */
  private applyFilters(
    queryBuilder: SelectQueryBuilder<Project>,
    queryDto: QueryProjectDto,
  ): void {
    if (queryDto.status) {
      queryBuilder.andWhere('project.status = :status', {
        status: queryDto.status,
      });
    }

    if (queryDto.name) {
      queryBuilder.andWhere('project.name ILIKE :name', {
        name: `%${queryDto.name}%`,
      });
    }

    if (queryDto.startDateFrom) {
      queryBuilder.andWhere('project.startDate >= :startDateFrom', {
        startDateFrom: queryDto.startDateFrom,
      });
    }

    if (queryDto.startDateTo) {
      queryBuilder.andWhere('project.startDate <= :startDateTo', {
        startDateTo: queryDto.startDateTo,
      });
    }

    if (queryDto.endDateFrom) {
      queryBuilder.andWhere('project.endDate >= :endDateFrom', {
        endDateFrom: queryDto.endDateFrom,
      });
    }

    if (queryDto.endDateTo) {
      queryBuilder.andWhere('project.endDate <= :endDateTo', {
        endDateTo: queryDto.endDateTo,
      });
    }
  }

  /**
   * Validate and map sort field to entity property
   * @private
   */
  private validateSortField(sort?: string): string {
    const validSortFields = [
      'name',
      'status',
      'startDate',
      'endDate',
      'createdAt',
    ];
    const sortField = sort || 'createdAt';

    if (!validSortFields.includes(sortField)) {
      return 'createdAt';
    }

    return sortField;
  }
}
