import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateCourseDto {
  @ApiProperty({
    description: 'Name of the course',
    example: 'Introduction to Web Development',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Description of the course',
    example:
      'A comprehensive introduction to modern web development technologies',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Type of the course',
    enum: ['Technical', 'Non-Technical', 'Language', 'Soft Skills'],
    example: 'Technical',
    required: false,
  })
  @IsEnum(['Technical', 'Non-Technical', 'Language', 'Soft Skills'])
  @IsOptional()
  type?: 'Technical' | 'Non-Technical' | 'Language' | 'Soft Skills';

  @ApiProperty({
    description: 'Duration of the course',
    example: '3 months',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  duration?: string;

  @ApiProperty({
    description: 'List of topics covered in the course',
    example: ['HTML', 'CSS', 'JavaScript', 'React'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  topics?: string[];
}
