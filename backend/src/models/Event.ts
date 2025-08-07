import mongoose, { Schema, Document } from 'mongoose';
import { IEvent } from '../types';

interface IEventDocument extends IEvent, Document {}

const locationSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
}, { _id: false });

const eventSchema = new Schema<IEventDocument>({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  type: {
    type: String,
    enum: ['book_signing', 'reading', 'workshop', 'discussion', 'launch'],
    required: [true, 'Event type is required'],
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(value: Date) {
        return value > new Date();
      },
      message: 'Event date must be in the future',
    },
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)'],
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)'],
  },
  location: {
    type: locationSchema,
    required: true,
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1'],
  },
  registeredCount: {
    type: Number,
    default: 0,
    min: [0, 'Registered count cannot be negative'],
  },
  price: {
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative'],
  },
  isFree: {
    type: Boolean,
    default: function(this: IEventDocument) {
      return this.price === 0;
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  featuredImage: String,
  organizer: {
    type: String,
    required: [true, 'Organizer is required'],
  },
  requirements: [String],
  tags: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
});

// Indexes
eventSchema.index({ date: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ 'location.city': 1 });
eventSchema.index({ isActive: 1 });
eventSchema.index({ isFree: 1 });

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function(this: IEventDocument) {
  return this.capacity - this.registeredCount;
});

// Virtual for is full
eventSchema.virtual('isFull').get(function(this: IEventDocument) {
  return this.registeredCount >= this.capacity;
});

export default mongoose.model<IEventDocument>('Event', eventSchema);