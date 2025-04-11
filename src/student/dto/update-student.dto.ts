import {
  IsArray,
  IsEmail,
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
  @IsString()
  type: 'Permanent' | 'Correspondence' | 'Current';

  @ApiProperty({
    description: 'Street address',
    example: '123 Main St',
  })
  @IsString()
  street: string;

  @ApiProperty({
    description: 'City',
    example: 'New York',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'State',
    example: 'NY',
  })
  @IsString()
  state: string;

  @ApiProperty({
    description: 'Zip code',
    example: '10001',
  })
  @IsString()
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

export class UpdateStudentDto {
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
    description: 'Student addresses',
    type: [AddressDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  @IsOptional()
  addresses?: AddressDto[];

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
