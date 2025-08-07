import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Address, UserPreferences } from '@/types';

export interface UserDocument extends Omit<User, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AddressSchema = new Schema<Address>({
  type: { type: String, enum: ['shipping', 'billing'], required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  company: { type: String },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const UserPreferencesSchema = new Schema<UserPreferences>({
  newsletter: { type: Boolean, default: true },
  emailNotifications: { type: Boolean, default: true },
  smsNotifications: { type: Boolean, default: false },
  favoriteGenres: [{ type: String }],
  preferredLanguage: { type: String, default: 'en' },
  currency: { type: String, default: 'USD' }
});

const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date },
  phone: { type: String },
  addresses: [AddressSchema],
  preferences: { type: UserPreferencesSchema, default: () => ({}) },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for orders
UserSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'userId'
});

export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);