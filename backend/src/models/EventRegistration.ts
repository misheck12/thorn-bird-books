import mongoose, { Schema, Document } from 'mongoose';
import { IEventRegistration } from '../types';

interface IEventRegistrationDocument extends IEventRegistration, Document {}

const eventRegistrationSchema = new Schema<IEventRegistrationDocument>({
  eventId: {
    type: String,
    ref: 'Event',
    required: true,
  },
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['registered', 'attended', 'cancelled'],
    default: 'registered',
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  notes: String,
}, {
  timestamps: true,
});

// Compound index to prevent duplicate registrations
eventRegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });
eventRegistrationSchema.index({ eventId: 1 });
eventRegistrationSchema.index({ userId: 1 });

export default mongoose.model<IEventRegistrationDocument>('EventRegistration', eventRegistrationSchema);