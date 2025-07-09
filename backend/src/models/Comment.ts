import { Schema, model, Document } from 'mongoose';

export interface IComment extends Document {
  text: string;
  author: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  parentComment?: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  isApproved: boolean;
  moderatedBy?: Schema.Types.ObjectId;
  moderationNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
  text: { 
    type: String, 
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Author is required']
  },
  post: { 
    type: Schema.Types.ObjectId, 
    ref: 'Post', 
    required: [true, 'Post reference is required']
  },
  parentComment: { 
    type: Schema.Types.ObjectId, 
    ref: 'Comment',
    default: null
  },
  likes: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  isApproved: { type: Boolean, default: true },
  moderatedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User'
  },
  moderationNote: { 
    type: String,
    trim: true,
    maxlength: [500, 'Moderation note cannot exceed 500 characters']
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for better performance
commentSchema.index({ post: 1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ isApproved: 1 });
commentSchema.index({ createdAt: -1 });

export default model<IComment>('Comment', commentSchema);
