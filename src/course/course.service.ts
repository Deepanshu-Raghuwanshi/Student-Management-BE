import {
  HttpException,
  HttpStatus,
  Injectable,
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
      const existingCourse = await this.courseModel
        .findOne({
          $or: [{ name: createCourseDto.name }],
        })
        .exec();

      if (existingCourse) {
        throw new HttpException(
          `Course with the same name or code already exists`,
          HttpStatus.CONFLICT,
        );
      }

      const course = new this.courseModel(createCourseDto);
      return await course.save();
    } catch (error) {
      throw new HttpException(
        `Failed to create course: ${error?.message || 'Internal server error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Course[]> {
    try {
      return await this.courseModel.find().exec();
    } catch (error) {
      throw new HttpException(
        `Failed to fetch courses: ${error?.message || 'Internal server error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      throw new HttpException(
        `Failed to fetch course: ${error?.message || 'Internal server error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      throw new HttpException(
        `Failed to update course: ${error?.message || 'Internal server error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.courseModel.findByIdAndDelete(id).exec();

      if (!result) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      await this.studentModel.updateMany(
        { courses: new Types.ObjectId(id) },
        { $pull: { courses: new Types.ObjectId(id) } },
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        `Failed to remove course: ${error?.message || 'Internal server error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByTopic(topic: string): Promise<Course[]> {
    try {
      const regex = new RegExp(topic, 'i');
      return await this.courseModel.find({ topics: { $regex: regex } }).exec();
    } catch (error) {
      throw new HttpException(
        `Failed to fetch courses by topic: ${error?.message || 'Internal server error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async assignStudentToCourse(
    courseId: string,
    studentId: string,
  ): Promise<Course> {
    try {
      const course = await this.courseModel.findById(courseId);
      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }

      const student = await this.studentModel.findById(studentId);
      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }

      if (!course.students.includes(new Types.ObjectId(studentId))) {
        course.students.push(new Types.ObjectId(studentId));
        await course.save();
      }

      if (!student.courses.includes(new Types.ObjectId(courseId))) {
        student.courses.push(new Types.ObjectId(courseId));
        await student.save();
      }

      return course;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        `Failed to assign student to course: ${error?.message || 'Internal server error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeStudentFromCourse(
    courseId: string,
    studentId: string,
  ): Promise<void> {
    try {
      await this.studentModel.findByIdAndUpdate(studentId, {
        $pull: { courses: new Types.ObjectId(courseId) },
      });

      await this.courseModel.findByIdAndUpdate(courseId, {
        $pull: { students: new Types.ObjectId(studentId) },
      });
    } catch (error) {
      throw new HttpException(
        `Failed to remove student from course: ${error?.message || 'Internal server error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
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
      throw new HttpException(
        `Failed to get students by course: ${error?.message || 'Internal server error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
