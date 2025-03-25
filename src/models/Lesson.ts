// models/Lesson.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface ILesson extends Document {
  title: string;
  content: string;
  videoUrl?: string;
  courseId: Types.ObjectId;
}

const LessonSchema: Schema = new Schema<ILesson>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  videoUrl: { type: String },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true }
});

export default model<ILesson>('Lesson', LessonSchema);
