import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async createStudent(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      const student = new this.studentModel(createStudentDto);
      return await student.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException(
          `Student with the same name already exists: ${JSON.stringify(error.keyValue)}`,
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        `Failed to create student: ${error?.response?.message || error?.response || 'Internal server error'}`,
        error?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByName(name: string): Promise<Student[]> {
    try {
      const regex = new RegExp(name, 'i');
      const students = await this.studentModel
        .find({ name: { $regex: regex } })
        .exec();

      if (students.length === 0) {
        throw new NotFoundException(`No students found with the name: ${name}`);
      }

      return students;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch students: ${error?.message || 'Internal server error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Student[]> {
    try {
      return await this.studentModel.find().exec();
    } catch (error) {
      throw new HttpException(
        `Failed to fetch students: ${error?.response?.message || 'Internal server error'}`,
        error?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<Student> {
    try {
      const student = await this.studentModel.findById(id).exec();
      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        `Failed to fetch student: ${error?.response?.message || 'Internal server error'}`,
        error?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    try {
      const updatedStudent = await this.studentModel
        .findByIdAndUpdate(id, updateStudentDto, { new: true })
        .exec();

      if (!updatedStudent) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      return updatedStudent;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        `Failed to update student: ${error?.response?.message || 'Internal server error'}`,
        error?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.studentModel.findByIdAndDelete(id).exec();

      if (!result) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        `Failed to remove student: ${error?.response?.message || 'Internal server error'}`,
        error?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findStudentsByCourse(courseId: string): Promise<Student[]> {
    try {
      return await this.studentModel
        .find({ courses: new Types.ObjectId(courseId) })
        .exec();
    } catch (error) {
      throw new HttpException(
        `Failed to fetch students by course: ${error?.response?.message || 'Internal server error'}`,
        error?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getEnrolledCourses(studentId: string): Promise<any[]> {
    try {
      const student = await this.studentModel
        .findById(studentId)
        .populate('courses')
        .exec();

      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }

      return student.courses;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        `Failed to get enrolled courses: ${error?.response?.message || 'Internal server error'}`,
        error?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async leaveCourse(studentId: string, courseId: string): Promise<void> {
    try {
      const student = await this.studentModel.findById(studentId);

      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }

      await this.studentModel.findByIdAndUpdate(studentId, {
        $pull: { courses: new Types.ObjectId(courseId) },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        `Failed to leave course: ${error?.response?.message || 'Internal server error'}`,
        error?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
