import { Schema, model, Document } from 'mongoose';

export interface ISchool extends Document {
  name: string;
  domain: string;
  address: string;
  phone?: string;
  email?: string;
  principalName?: string;
  isActive: boolean;
  registeredAt: Date;
  updatedAt: Date;
}

const schoolSchema = new Schema<ISchool>({
  name: { 
    type: String, 
    required: [true, 'School name is required'],
    trim: true,
    maxlength: [200, 'School name cannot exceed 200 characters']
  },
  domain: { 
    type: String, 
    unique: true, 
    required: [true, 'School domain is required'],
    lowercase: true,
    trim: true,
    match: [/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid domain']
  },
  address: { 
    type: String, 
    required: [true, 'School address is required'],
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  phone: { 
    type: String,
    trim: true,
    match: [/^[+]?[0-9\s-()]{10,20}$/, 'Please enter a valid phone number']
  },
  email: { 
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  principalName: { 
    type: String,
    trim: true,
    maxlength: [100, 'Principal name cannot exceed 100 characters']
  },
  isActive: { type: Boolean, default: true },
  registeredAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for better performance
schoolSchema.index({ domain: 1 });
schoolSchema.index({ isActive: 1 });

export default model<ISchool>('School', schoolSchema);
