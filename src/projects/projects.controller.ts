import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { Project } from './entities/project.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * Controller for project management endpoints
 * Handles HTTP requests for project CRUD operations
 */
@ApiTags('Projects')
@Controller('v1/projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * Create a new project
   */
  @Post()
  @ApiOperation({
    summary: 'Create a new project',
    description:
      'Creates a new project with the provided information. Validates date ranges and sets default status to active.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Project created successfully',
    type: Project,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or end date is not after start date',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  async create(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.create(createProjectDto);
  }

  /**
   * Get all projects with optional filtering and pagination
   */
  @Get()
  @ApiOperation({
    summary: 'Get all projects',
    description:
      'Retrieves a paginated list of projects with optional filtering by status, name, and date ranges.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by project status',
    enum: ['active', 'completed', 'on_hold'],
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by project name (partial match)',
  })
  @ApiQuery({
    name: 'startDateFrom',
    required: false,
    description: 'Filter projects starting from this date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'startDateTo',
    required: false,
    description: 'Filter projects starting until this date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDateFrom',
    required: false,
    description: 'Filter projects ending from this date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDateTo',
    required: false,
    description: 'Filter projects ending until this date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (default: 20, max: 100)',
    type: Number,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: 'Sort field (default: createdAt)',
    enum: ['name', 'status', 'startDate', 'endDate', 'createdAt'],
  })
  @ApiQuery({
    name: 'order',
    required: false,
    description: 'Sort order (default: DESC)',
    enum: ['ASC', 'DESC'],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Projects retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        projects: {
          type: 'array',
          items: { $ref: '#/components/schemas/Project' },
        },
        total: { type: 'number', description: 'Total number of projects' },
        page: { type: 'number', description: 'Current page number' },
        limit: { type: 'number', description: 'Items per page' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid query parameters',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  async findAll(@Query() queryDto: QueryProjectDto): Promise<{
    projects: Project[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.projectsService.findAll(queryDto);
  }

  /**
   * Get a specific project by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get project by ID',
    description: 'Retrieves a specific project by its UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project retrieved successfully',
    type: Project,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Project> {
    return this.projectsService.findOne(id);
  }

  /**
   * Update an existing project
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update project',
    description:
      'Updates an existing project with the provided information. Validates date ranges if dates are updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project updated successfully',
    type: Project,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or end date is not after start date',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectsService.update(id, updateProjectDto);
  }

  /**
   * Soft delete a project
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete project',
    description:
      'Soft deletes a project (sets deletedAt timestamp). The project can be restored later.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Project deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.projectsService.remove(id);
  }

  /**
   * Restore a soft-deleted project
   */
  @Patch(':id/restore')
  @ApiOperation({
    summary: 'Restore deleted project',
    description:
      'Restores a soft-deleted project by removing the deletedAt timestamp.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project restored successfully',
    type: Project,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid UUID format or project is not deleted',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  async restore(@Param('id', ParseUUIDPipe) id: string): Promise<Project> {
    return this.projectsService.restore(id);
  }
}
