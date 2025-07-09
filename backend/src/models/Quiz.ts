import { Schema, model, Document } from 'mongoose';

export interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface IQuiz extends Document {
  title: string;
  description: string;
  subject: string;
  questions: IQuestion[];
  timeLimit: number; // in minutes
  maxAttempts: number;
  passingScore: number;
  createdBy: Schema.Types.ObjectId;
  schoolId?: Schema.Types.ObjectId;
  isActive: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>({
  question: { 
    type: String, 
    required: [true, 'Question text is required'],
    trim: true
  },
  options: { 
    type: [String], 
    required: [true, 'Question options are required'],
    validate: {
      validator: function(v: string[]) {
        return v && v.length >= 2 && v.length <= 5;
      },
      message: 'Question must have between 2 and 5 options'
    }
  },
  correctAnswer: { 
    type: Number, 
    required: [true, 'Correct answer index is required'],
    min: [0, 'Correct answer index must be at least 0']
  },
  explanation: { 
    type: String,
    trim: true,
    maxlength: [500, 'Explanation cannot exceed 500 characters']
  }
});

const quizSchema = new Schema<IQuiz>({
  title: { 
    type: String, 
    required: [true, 'Quiz title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Quiz description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  subject: { 
    type: String, 
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  questions: { 
    type: [questionSchema], 
    required: [true, 'Quiz must have at least one question'],
    validate: {
      validator: function(v: IQuestion[]) {
        return v && v.length > 0;
      },
      message: 'Quiz must have at least one question'
    }
  },
  timeLimit: { 
    type: Number, 
    required: [true, 'Time limit is required'],
    min: [1, 'Time limit must be at least 1 minute'],
    max: [300, 'Time limit cannot exceed 300 minutes']
  },
  maxAttempts: { 
    type: Number, 
    default: 3,
    min: [1, 'Maximum attempts must be at least 1'],
    max: [10, 'Maximum attempts cannot exceed 10']
  },
  passingScore: { 
    type: Number, 
    required: [true, 'Passing score is required'],
    min: [0, 'Passing score must be at least 0'],
    max: [100, 'Passing score cannot exceed 100']
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Creator is required']
  },
  schoolId: { 
    type: Schema.Types.ObjectId, 
    ref: 'School'
  },
  isActive: { type: Boolean, default: true },
  difficulty: { 
    type: String, 
    enum: {
      values: ['easy', 'medium', 'hard'],
      message: 'Difficulty must be easy, medium, or hard'
    },
    default: 'medium'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for better performance
quizSchema.index({ createdBy: 1 });
quizSchema.index({ schoolId: 1 });
quizSchema.index({ subject: 1 });
quizSchema.index({ difficulty: 1 });
quizSchema.index({ isActive: 1 });

export default model<IQuiz>('Quiz', quizSchema);
