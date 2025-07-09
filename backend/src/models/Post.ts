import { Schema, model, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'document';
  category: 'education' | 'environment' | 'discussion' | 'announcement';
  tags: string[];
  author: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  views: number;
  isApproved: boolean;
  isPinned: boolean;
  moderatedBy?: Schema.Types.ObjectId;
  moderationNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>({
  title: { 
    type: String, 
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: { 
    type: String, 
    required: [true, 'Post content is required'],
    trim: true,
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  mediaUrl: { 
    type: String,
    trim: true
  },
  mediaType: { 
    type: String,
    enum: {
      values: ['image', 'video', 'audio', 'document'],
      message: 'Media type must be image, video, audio, or document'
    }
  },
  category: { 
    type: String,
    enum: {
      values: ['education', 'environment', 'discussion', 'announcement'],
      message: 'Category must be education, environment, discussion, or announcement'
    },
    required: [true, 'Category is required']
  },
  tags: { 
    type: [String],
    default: [],
    validate: {
      validator: function(v: string[]) {
        return v.length <= 10;
      },
      message: 'Cannot have more than 10 tags'
    }
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Author is required']
  },
  likes: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  views: { 
    type: Number, 
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  isApproved: { type: Boolean, default: true },
  isPinned: { type: Boolean, default: false },
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
postSchema.index({ author: 1 });
postSchema.index({ category: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ isApproved: 1 });
postSchema.index({ isPinned: 1 });
postSchema.index({ createdAt: -1 });

export default model<IPost>('Post', postSchema);
