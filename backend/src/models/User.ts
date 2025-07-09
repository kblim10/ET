import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: 'superadmin' | 'guru' | 'murid' | 'masyarakat';
  schoolId?: Schema.Types.ObjectId;
  profileImage?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  fullName: { 
    type: String, 
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: { 
    type: String, 
    unique: true, 
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: { 
    type: String, 
    enum: {
      values: ['superadmin', 'guru', 'murid', 'masyarakat'],
      message: 'Role must be either superadmin, guru, murid, or masyarakat'
    },
    required: [true, 'Role is required']
  },
  schoolId: { 
    type: Schema.Types.ObjectId, 
    ref: 'School', 
    default: null,
    required: function(this: IUser) {
      return this.role === 'guru' || this.role === 'murid';
    }
  },
  profileImage: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ schoolId: 1 });

// Pre-save middleware to update updatedAt
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default model<IUser>('User', userSchema);
