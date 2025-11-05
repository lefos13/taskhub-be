import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsIn,
  IsOptional,
  IsNumberString,
} from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  @MinLength(32, { message: 'JWT_SECRET must be at least 32 characters long' })
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN: string;

  @IsString()
  @IsIn(['development', 'production', 'test'], {
    message: 'NODE_ENV must be development, production, or test',
  })
  NODE_ENV: string = 'development';

  @IsString()
  PORT: string = '3000';

  @IsString()
  @IsOptional()
  CORS_ORIGIN?: string = '*';

  // Database configuration
  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  @IsNumberString()
  @IsNotEmpty()
  DB_PORT: string;

  @IsString()
  @IsNotEmpty()
  DB_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DB_NAME: string;

  @IsString()
  @IsOptional()
  DB_SYNCHRONIZE?: string = 'false';

  @IsString()
  @IsOptional()
  DB_LOGGING?: string = 'false';
}
