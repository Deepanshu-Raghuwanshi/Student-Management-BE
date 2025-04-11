import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Name of the course',
    example: 'Introduction to Web Development',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the course',
    example:
      'A comprehensive introduction to modern web development technologies',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Type of the course',
    enum: ['Technical', 'Non-Technical', 'Language', 'Soft Skills'],
    example: 'Technical',
  })
  @IsEnum(['Technical', 'Non-Technical', 'Language', 'Soft Skills'])
  type: 'Technical' | 'Non-Technical' | 'Language' | 'Soft Skills';

  @ApiProperty({
    description: 'Duration of the course',
    example: '3 months',
  })
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiProperty({
    description: 'List of topics covered in the course',
    example: ['HTML', 'CSS', 'JavaScript', 'React'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  topics: string[];
}
