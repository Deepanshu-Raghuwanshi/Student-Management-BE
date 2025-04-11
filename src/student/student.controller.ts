import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentService } from './student.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Student')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all students or filter by name' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter students by name',
  })
  @ApiResponse({ status: 200, description: 'List of students' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  findAll(@Query('name') name?: string) {
    if (name) {
      return this.studentService.findByName(name);
    }
    return this.studentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Student details.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({ status: 201, description: 'Student created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.createStudent(createStudentDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student profile' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Student updated successfully.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Student deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get students by course' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({
    status: 200,
    description: 'List of students enrolled in the course.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  findByCourse(@Param('courseId') courseId: string) {
    return this.studentService.findStudentsByCourse(courseId);
  }

  @Get(':id/courses')
  @ApiOperation({ summary: 'Get courses enrolled by a student' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'List of courses enrolled by the student.',
  })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  getEnrolledCourses(@Param('id') id: string) {
    return this.studentService.getEnrolledCourses(id);
  }

  @Delete(':studentId/courses/:courseId')
  @ApiOperation({ summary: 'Student leaves a course' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({
    status: 200,
    description: 'Student left the course successfully.',
  })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  leaveCourse(
    @Param('studentId') studentId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.studentService.leaveCourse(studentId, courseId);
  }
}
