import { Schema, model, Document } from 'mongoose';

export interface IAchievement extends Document {
  userId: Schema.Types.ObjectId;
  quizId: Schema.Types.ObjectId;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  attemptNumber: number;
  isPassed: boolean;
  answers: {
    questionIndex: number;
    selectedAnswer: number;
    isCorrect: boolean;
    timeSpent: number;
  }[];
  completedAt: Date;
  createdAt: Date;
}

const achievementSchema = new Schema<IAchievement>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User is required']
  },
  quizId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Quiz', 
    required: [true, 'Quiz is required']
  },
  score: { 
    type: Number, 
    required: [true, 'Score is required'],
    min: [0, 'Score cannot be negative'],
    max: [100, 'Score cannot exceed 100']
  },
  totalQuestions: { 
    type: Number, 
    required: [true, 'Total questions is required'],
    min: [1, 'Total questions must be at least 1']
  },
  correctAnswers: { 
    type: Number, 
    required: [true, 'Correct answers is required'],
    min: [0, 'Correct answers cannot be negative']
  },
  timeSpent: { 
    type: Number, 
    required: [true, 'Time spent is required'],
    min: [0, 'Time spent cannot be negative']
  },
  attemptNumber: { 
    type: Number, 
    required: [true, 'Attempt number is required'],
    min: [1, 'Attempt number must be at least 1']
  },
  isPassed: { 
    type: Boolean, 
    required: [true, 'Pass status is required']
  },
  answers: [{
    questionIndex: { 
      type: Number, 
      required: [true, 'Question index is required'],
      min: [0, 'Question index cannot be negative']
    },
    selectedAnswer: { 
      type: Number, 
      required: [true, 'Selected answer is required'],
      min: [0, 'Selected answer cannot be negative']
    },
    isCorrect: { 
      type: Boolean, 
      required: [true, 'Correct status is required']
    },
    timeSpent: { 
      type: Number, 
      required: [true, 'Time spent is required'],
      min: [0, 'Time spent cannot be negative']
    }
  }],
  completedAt: { 
    type: Date, 
    required: [true, 'Completion date is required']
  },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for better performance
achievementSchema.index({ userId: 1 });
achievementSchema.index({ quizId: 1 });
achievementSchema.index({ score: -1 });
achievementSchema.index({ isPassed: 1 });
achievementSchema.index({ completedAt: -1 });

// Compound index for user quiz attempts
achievementSchema.index({ userId: 1, quizId: 1, attemptNumber: 1 });

export default model<IAchievement>('Achievement', achievementSchema);
