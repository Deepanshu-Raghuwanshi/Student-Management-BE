import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Course')
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({ status: 200, description: 'List of all courses.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  findAll() {
    return this.courseService.findAll();
  }

  @Get('topic')
  @ApiOperation({ summary: 'Find courses by topic' })
  @ApiQuery({ name: 'name', required: true, description: 'Topic name' })
  @ApiResponse({
    status: 200,
    description: 'List of courses with the specified topic.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  findByTopic(@Query('name') topic: string) {
    return this.courseService.findByTopic(topic);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course details.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a course' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course updated successfully.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }

  @Post(':courseId/students/:studentId')
  @ApiOperation({ summary: 'Assign a student to a course' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Student assigned to course successfully.',
  })
  @ApiResponse({ status: 404, description: 'Course or student not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  assignStudent(
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.courseService.assignStudentToCourse(courseId, studentId);
  }

  @Delete(':courseId/students/:studentId')
  @ApiOperation({ summary: 'Remove a student from a course' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Student removed from course successfully.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  removeStudent(
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.courseService.removeStudentFromCourse(courseId, studentId);
  }

  @Get(':id/students')
  @ApiOperation({ summary: 'Get all students enrolled in a course' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({
    status: 200,
    description: 'List of students enrolled in the course.',
  })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  getStudents(@Param('id') id: string) {
    return this.courseService.getStudentsByCourse(id);
  }
}
