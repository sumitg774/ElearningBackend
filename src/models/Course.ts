// models/Course.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  instructor: string;
  image?: string;
  lessons: Types.ObjectId[];
}

const CourseSchema: Schema = new Schema<ICourse>({
  title: { type: String, required: true },
  instructor: { type: String, required: true },
  image: { type: String },
  lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
});

export default model<ICourse>('Course', CourseSchema);
