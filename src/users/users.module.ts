import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

/**
 * Users module for user management functionality
 *
 * @module UsersModule
 *
 * @remarks
 * This module handles user management including CRUD operations,
 * authentication support, and role-based access control.
 *
 * @decorator `@Module`
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
