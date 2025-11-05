# Requirements Document

## Introduction

This specification defines the requirements for implementing the complete database schema for the TaskHub project management system. The TaskHub system is designed to help Team Leaders and Project Managers organize tasks, manage teams, track workloads, and monitor deadlines. The database schema forms the foundational layer that will support all core business functionality including user management, project organization, task tracking, team collaboration, and time management.

## Glossary

- **TaskHub_System**: The complete project management application backend built with NestJS and PostgreSQL
- **User_Entity**: Database table storing user profiles, authentication credentials, and role information
- **Project_Entity**: Database table containing project information, dates, and status tracking
- **Task_Entity**: Database table storing individual task details, priorities, deadlines, and manday estimates
- **Team_Entity**: Database table managing team composition and project assignments
- **Assignment_Entity**: Junction table linking users to tasks with role specifications
- **Subtask_Entity**: Database table enabling hierarchical task breakdown and detailed planning
- **Time_Tracking_Entity**: Database table recording actual hours worked on tasks for manday calculations
- **Notification_Entity**: Database table storing system notifications for deadline alerts and status updates
- **Comment_Entity**: Database table enabling task-specific discussions and collaboration
- **TypeORM**: Object-Relational Mapping library used for database operations and entity management
- **UUID**: Universally Unique Identifier used as primary keys for distributed system compatibility
- **RBAC**: Role-Based Access Control system with admin, manager, and member roles
- **Enum_Type**: Database enumeration type for status and priority fields ensuring data consistency
- **Foreign_Key_Constraint**: Database constraint ensuring referential integrity between related entities
- **Database_Index**: Performance optimization structure for frequently queried columns
- **Migration_File**: TypeORM file defining database schema changes and version control

## Requirements

### Requirement 1

**User Story:** As a system administrator, I want a comprehensive user management system, so that I can control access and maintain user profiles across the TaskHub system.

#### Acceptance Criteria

1. THE TaskHub_System SHALL create a User_Entity with UUID primary key, email, password hash, role enumeration, and audit timestamps
2. WHEN a user is created, THE TaskHub_System SHALL enforce unique email constraints and validate role assignments
3. THE TaskHub_System SHALL implement bcrypt password hashing with minimum 10 rounds for security compliance
4. THE TaskHub_System SHALL support RBAC with admin, manager, and member role enumerations
5. THE TaskHub_System SHALL include created_at and updated_at timestamp fields for audit trail requirements

### Requirement 2

**User Story:** As a project manager, I want a structured project organization system, so that I can manage multiple projects with clear status tracking and team assignments.

#### Acceptance Criteria

1. THE TaskHub_System SHALL create a Project_Entity with UUID primary key, name, description, start date, end date, and status enumeration
2. THE TaskHub_System SHALL implement project status enumeration with active, completed, and on_hold values
3. WHEN a project is created, THE TaskHub_System SHALL validate date constraints ensuring end date is after start date
4. THE TaskHub_System SHALL establish foreign key relationships between Project_Entity and Team_Entity for team assignments
5. THE TaskHub_System SHALL include audit timestamps and soft delete capabilities for project lifecycle management

### Requirement 3

**User Story:** As a team leader, I want comprehensive task management capabilities, so that I can track task progress, priorities, deadlines, and resource allocation effectively.

#### Acceptance Criteria

1. THE TaskHub_System SHALL create a Task_Entity with UUID primary key, title, description, status, priority, deadline, estimated mandays, and consumed mandays
2. THE TaskHub_System SHALL implement task status enumeration with todo, in_progress, and done values
3. THE TaskHub_System SHALL implement priority enumeration with low, medium, high, and critical values
4. THE TaskHub_System SHALL establish foreign key relationship between Task_Entity and Project_Entity for project association
5. THE TaskHub_System SHALL support manday estimation and tracking fields for resource planning and progress monitoring

### Requirement 4

**User Story:** As a team member, I want hierarchical task organization, so that I can break down complex tasks into manageable subtasks with independent tracking.

#### Acceptance Criteria

1. THE TaskHub_System SHALL create a Subtask_Entity with UUID primary key, parent task reference, title, description, and status
2. THE TaskHub_System SHALL establish self-referencing foreign key relationship between Subtask_Entity and Task_Entity
3. WHEN a subtask is created, THE TaskHub_System SHALL validate parent task existence and prevent circular references
4. THE TaskHub_System SHALL support independent status tracking for subtasks while maintaining parent task relationships
5. THE TaskHub_System SHALL implement cascade delete behavior when parent tasks are removed

### Requirement 5

**User Story:** As a project coordinator, I want flexible team management and task assignment capabilities, so that I can organize teams and assign tasks with proper role definitions.

#### Acceptance Criteria

1. THE TaskHub_System SHALL create a Team_Entity with UUID primary key, project reference, and team member relationships
2. THE TaskHub_System SHALL create an Assignment_Entity as junction table linking Task_Entity and User_Entity with role specifications
3. THE TaskHub_System SHALL establish foreign key constraints between Team_Entity, Project_Entity, and User_Entity
4. THE TaskHub_System SHALL support multiple users per task and multiple tasks per user through Assignment_Entity
5. THE TaskHub_System SHALL implement assignment role enumeration for task responsibility tracking

### Requirement 6

**User Story:** As a project manager, I want accurate time tracking and manday calculation, so that I can monitor actual effort against estimates and improve future planning.

#### Acceptance Criteria

1. THE TaskHub_System SHALL create a Time_Tracking_Entity with UUID primary key, task reference, user reference, hours worked, work date, and notes
2. THE TaskHub_System SHALL establish foreign key relationships between Time_Tracking_Entity, Task_Entity, and User_Entity
3. WHEN time is logged, THE TaskHub_System SHALL validate positive hour values and valid work dates
4. THE TaskHub_System SHALL support manday calculation aggregation from Time_Tracking_Entity records
5. THE TaskHub_System SHALL include notes field for detailed time entry descriptions and context

### Requirement 7

**User Story:** As a team member, I want collaborative communication features, so that I can participate in task-specific discussions and maintain project communication history.

#### Acceptance Criteria

1. THE TaskHub_System SHALL create a Comment_Entity with UUID primary key, task reference, user reference, content, and timestamps
2. THE TaskHub_System SHALL establish foreign key relationships between Comment_Entity, Task_Entity, and User_Entity
3. WHEN a comment is created, THE TaskHub_System SHALL validate content length and user authorization
4. THE TaskHub_System SHALL support chronological comment ordering and edit tracking
5. THE TaskHub_System SHALL implement soft delete for comment history preservation

### Requirement 8

**User Story:** As a system user, I want comprehensive notification management, so that I can receive timely alerts about deadlines, assignments, and status changes.

#### Acceptance Criteria

1. THE TaskHub_System SHALL create a Notification_Entity with UUID primary key, user reference, message content, read status, and timestamps
2. THE TaskHub_System SHALL establish foreign key relationship between Notification_Entity and User_Entity
3. THE TaskHub_System SHALL implement notification type enumeration for deadline alerts, task assignments, and status updates
4. WHEN notifications are created, THE TaskHub_System SHALL set default unread status and creation timestamps
5. THE TaskHub_System SHALL support bulk notification operations and read status management

### Requirement 9

**User Story:** As a database administrator, I want optimized database performance and data integrity, so that the system can handle production workloads efficiently and maintain data consistency.

#### Acceptance Criteria

1. THE TaskHub_System SHALL implement database indexes on frequently queried columns including user_id, project_id, status, and deadline fields
2. THE TaskHub_System SHALL enforce foreign key constraints across all entity relationships for referential integrity
3. THE TaskHub_System SHALL use UUID primary keys for distributed system compatibility and security
4. THE TaskHub_System SHALL implement TypeORM migration files for all entity definitions and schema changes
5. THE TaskHub_System SHALL include audit timestamp fields (created_at, updated_at) on all entities for change tracking

### Requirement 10

**User Story:** As a development team member, I want proper TypeORM entity configuration, so that the application can interact with the database efficiently and maintain type safety.

#### Acceptance Criteria

1. THE TaskHub_System SHALL implement TypeORM entity decorators for all database tables with proper column definitions
2. THE TaskHub_System SHALL configure entity relationships using TypeORM decorators including OneToMany, ManyToOne, and ManyToMany
3. THE TaskHub_System SHALL implement entity validation using class-validator decorators for data integrity
4. WHEN entities are created, THE TaskHub_System SHALL auto-generate UUID primary keys and timestamp fields
5. THE TaskHub_System SHALL configure TypeORM synchronization and migration settings for development and production environments
