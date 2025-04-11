import {
  Injectable,
  InternalServerErrorException,
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
      console.error('Error creating student:', error);
      throw new InternalServerErrorException('Failed to create student');
    }
  }

  async findByName(name: string): Promise<Student[]> {
    try {
      const regex = new RegExp(name, 'i'); // case-insensitive search
      return await this.studentModel.find({ name: { $regex: regex } }).exec();
    } catch (error) {
      console.error('Error finding students by name:', error);
      throw new InternalServerErrorException('Failed to fetch students');
    }
  }

  async findAll(): Promise<Student[]> {
    try {
      return await this.studentModel.find().exec();
    } catch (error) {
      console.error('Error finding all students:', error);
      throw new InternalServerErrorException('Failed to fetch students');
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
      console.error('Error finding student:', error);
      throw new InternalServerErrorException('Failed to fetch student');
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
      console.error('Error updating student:', error);
      throw new InternalServerErrorException('Failed to update student');
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
      console.error('Error removing student:', error);
      throw new InternalServerErrorException('Failed to remove student');
    }
  }

  async findStudentsByCourse(courseId: string): Promise<Student[]> {
    try {
      return await this.studentModel
        .find({ courses: new Types.ObjectId(courseId) })
        .exec();
    } catch (error) {
      console.error('Error finding students by course:', error);
      throw new InternalServerErrorException(
        'Failed to fetch students by course',
      );
    }
  }

  async getEnrolledCourses(studentId: string): Promise<Types.ObjectId[]> {
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
      console.error('Error getting enrolled courses:', error);
      throw new InternalServerErrorException('Failed to get enrolled courses');
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
      console.error('Error leaving course:', error);
      throw new InternalServerErrorException('Failed to leave course');
    }
  }
}
