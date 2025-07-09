import { Schema, model, Document } from 'mongoose';

export interface ISchedule extends Document {
  subject: string;
  className: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  teacherId: Schema.Types.ObjectId;
  schoolId: Schema.Types.ObjectId;
  room?: string;
  description?: string;
  isActive: boolean;
  updatedBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const scheduleSchema = new Schema<ISchedule>({
  subject: { 
    type: String, 
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  className: { 
    type: String, 
    required: [true, 'Class name is required'],
    trim: true,
    maxlength: [50, 'Class name cannot exceed 50 characters']
  },
  day: { 
    type: String,
    enum: {
      values: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      message: 'Day must be a valid weekday'
    },
    required: [true, 'Day is required']
  },
  startTime: { 
    type: String, 
    required: [true, 'Start time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format']
  },
  endTime: { 
    type: String, 
    required: [true, 'End time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format']
  },
  teacherId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Teacher is required']
  },
  schoolId: { 
    type: Schema.Types.ObjectId, 
    ref: 'School', 
    required: [true, 'School is required']
  },
  room: { 
    type: String,
    trim: true,
    maxlength: [50, 'Room cannot exceed 50 characters']
  },
  description: { 
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  isActive: { type: Boolean, default: true },
  updatedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Updated by is required']
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for better performance
scheduleSchema.index({ teacherId: 1 });
scheduleSchema.index({ schoolId: 1 });
scheduleSchema.index({ day: 1 });
scheduleSchema.index({ className: 1 });
scheduleSchema.index({ isActive: 1 });

// Compound index for better query performance
scheduleSchema.index({ schoolId: 1, day: 1, isActive: 1 });

export default model<ISchedule>('Schedule', scheduleSchema);
