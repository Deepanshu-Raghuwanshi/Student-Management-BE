import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    enum: ['Technical', 'Non-Technical', 'Language', 'Soft Skills'],
  })
  type: string;

  @Prop({ required: true })
  duration: string;

  @Prop({ type: [String], default: [] })
  topics: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Student' }] })
  students: Types.ObjectId[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
