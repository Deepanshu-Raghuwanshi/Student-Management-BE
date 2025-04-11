import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Student, StudentDocument } from '../student/schemas/student.schema';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      const course = new this.courseModel(createCourseDto);
      return await course.save();
    } catch (error) {
      console.error('Error creating course:', error);
      throw new InternalServerErrorException('Failed to create course');
    }
  }

  async findAll(): Promise<Course[]> {
    try {
      return await this.courseModel.find().exec();
    } catch (error) {
      console.error('Error finding courses:', error);
      throw new InternalServerErrorException('Failed to fetch courses');
    }
  }

  async findOne(id: string): Promise<Course> {
    try {
      const course = await this.courseModel.findById(id).exec();
      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      return course;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error finding course:', error);
      throw new InternalServerErrorException('Failed to fetch course');
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    try {
      const updatedCourse = await this.courseModel
        .findByIdAndUpdate(id, updateCourseDto, { new: true })
        .exec();

      if (!updatedCourse) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      return updatedCourse;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error updating course:', error);
      throw new InternalServerErrorException('Failed to update course');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.courseModel.findByIdAndDelete(id).exec();

      if (!result) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      // Remove course reference from all students
      await this.studentModel.updateMany(
        { courses: new Types.ObjectId(id) },
        { $pull: { courses: new Types.ObjectId(id) } },
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error removing course:', error);
      throw new InternalServerErrorException('Failed to remove course');
    }
  }

  async findByTopic(topic: string): Promise<Course[]> {
    try {
      return await this.courseModel.find({ topics: { $in: [topic] } }).exec();
    } catch (error) {
      console.error('Error finding courses by topic:', error);
      throw new InternalServerErrorException(
        'Failed to fetch courses by topic',
      );
    }
  }

  async assignStudentToCourse(
    courseId: string,
    studentId: string,
  ): Promise<Course> {
    try {
      // Check if course exists
      const course = await this.courseModel.findById(courseId);
      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }

      // Check if student exists
      const student = await this.studentModel.findById(studentId);
      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }

      // Add student to course if not already added
      if (!course.students.includes(new Types.ObjectId(studentId))) {
        course.students.push(new Types.ObjectId(studentId));
        await course.save();
      }

      // Add course to student if not already added
      if (!student.courses.includes(new Types.ObjectId(courseId))) {
        student.courses.push(new Types.ObjectId(courseId));
        await student.save();
      }

      return course;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error assigning student to course:', error);
      throw new InternalServerErrorException(
        'Failed to assign student to course',
      );
    }
  }

  async removeStudentFromCourse(
    courseId: string,
    studentId: string,
  ): Promise<void> {
    try {
      // Remove course from student
      await this.studentModel.findByIdAndUpdate(studentId, {
        $pull: { courses: new Types.ObjectId(courseId) },
      });

      // Remove student from course
      await this.courseModel.findByIdAndUpdate(courseId, {
        $pull: { students: new Types.ObjectId(studentId) },
      });
    } catch (error) {
      console.error('Error removing student from course:', error);
      throw new InternalServerErrorException(
        'Failed to remove student from course',
      );
    }
  }

  async getStudentsByCourse(courseId: string): Promise<any[]> {
    try {
      const course = await this.courseModel.findById(courseId).exec();
      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }

      return await this.studentModel
        .find({ _id: { $in: course.students } })
        .select('name studentCode email')
        .exec();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error getting students by course:', error);
      throw new InternalServerErrorException(
        'Failed to get students by course',
      );
    }
  }
}
