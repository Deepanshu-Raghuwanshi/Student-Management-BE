import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AddressDto {
  @ApiProperty({
    description: 'Type of address',
    enum: ['Permanent', 'Correspondence', 'Current'],
    example: 'Permanent',
  })
  @IsEnum(['Permanent', 'Correspondence', 'Current'])
  type: 'Permanent' | 'Correspondence' | 'Current';

  @ApiProperty({
    description: 'Street address',
    example: '123 Main St',
  })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({
    description: 'City',
    example: 'New York',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'State',
    example: 'NY',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    description: 'Zip code',
    example: '10001',
  })
  @IsString()
  @IsNotEmpty()
  zipCode: string;
}

class ParentsDto {
  @ApiProperty({
    description: "Father's name",
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  fatherName?: string;

  @ApiProperty({
    description: "Mother's name",
    example: 'Jane Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  motherName?: string;
}

export class CreateStudentDto {
  @ApiProperty({
    description: 'Student name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Date of birth',
    example: '2000-01-01',
  })
  @IsDateString()
  dob: string;

  @ApiProperty({
    description: 'Gender',
    enum: ['Male', 'Female', 'Other'],
    example: 'Male',
  })
  @IsEnum(['Male', 'Female', 'Other'])
  gender: 'Male' | 'Female' | 'Other';

  @ApiProperty({
    description: 'Unique student code',
    example: 'STU001',
  })
  @IsString()
  @IsNotEmpty()
  studentCode: string;

  @ApiProperty({
    description: 'Student addresses',
    type: [AddressDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses: AddressDto[];

  @ApiProperty({
    description: 'Student email',
    example: 'student@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Student mobile number',
    example: '1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  mobile?: string;

  @ApiProperty({
    description: 'Student parents information',
    type: ParentsDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => ParentsDto)
  @IsOptional()
  parents?: ParentsDto;
}
