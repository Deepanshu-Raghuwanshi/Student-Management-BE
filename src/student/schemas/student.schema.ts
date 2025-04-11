import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Address, AddressSchema } from './address.schema';

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dob: Date;

  @Prop({ required: true, enum: ['Male', 'Female', 'Other'] })
  gender: string;

  @Prop({ required: true, unique: true })
  studentCode: string;

  @Prop({ type: [AddressSchema], default: [] })
  addresses: Address[];

  @Prop()
  email?: string;

  @Prop()
  mobile?: string;

  @Prop({
    type: {
      fatherName: String,
      motherName: String,
    },
  })
  parents?: {
    fatherName: string;
    motherName: string;
  };

  @Prop({ type: [Types.ObjectId], ref: 'Course', default: [] })
  courses: Types.ObjectId[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);
