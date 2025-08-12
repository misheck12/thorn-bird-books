import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Event from '../models/Event';
import EventRegistration from '../models/EventRegistration';
import User from '../models/User';
import { EventFilters } from '../types';

interface AuthRequest extends Request {
  user?: any;
}

// Get all events with filtering and pagination
export const getEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      city,
      date,
      isFree,
      search,
      sort = 'date',
      order = 'asc'
    } = req.query as EventFilters & { search?: string };

    const query: any = { isActive: true };

    // Apply filters
    if (type) {
      query.type = type;
    }

    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    if (date) {
      const targetDate = new Date(date as string);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      query.date = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }

    if (isFree !== undefined) {
      query.isFree = String(isFree) === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj: any = {};
    sortObj[sort as string] = sortOrder;

    const pageNum = parseInt(String(page));
    const limitNum = parseInt(String(limit));
    const skip = (pageNum - 1) * limitNum;

    const events = await Event.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .select('-__v');

    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      data: events,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single event by ID
export const getEventById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).select('-__v');

    if (!event) {
      res.status(404).json({
        success: false,
        error: 'Event not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// Register for an event
export const registerForEvent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(id);

    if (!event) {
      res.status(404).json({
        success: false,
        error: 'Event not found'
      });
      return;
    }

    if (!event.isActive) {
      res.status(400).json({
        success: false,
        error: 'Event is not active'
      });
      return;
    }

    if (event.date < new Date()) {
      res.status(400).json({
        success: false,
        error: 'Cannot register for past events'
      });
      return;
    }

    if (event.registeredCount >= event.capacity) {
      res.status(400).json({
        success: false,
        error: 'Event is full'
      });
      return;
    }

    // Check if user is already registered
    const existingRegistration = await EventRegistration.findOne({
      eventId: id,
      userId,
      status: { $ne: 'cancelled' }
    });

    if (existingRegistration) {
      res.status(400).json({
        success: false,
        error: 'You are already registered for this event'
      });
      return;
    }

    // Create registration
    const registration = await EventRegistration.create({
      eventId: id,
      userId,
      paymentStatus: event.isFree ? 'paid' : 'pending'
    });

    // Update event registered count
    event.registeredCount += 1;
    await event.save();

    res.status(201).json({
      success: true,
      data: registration,
      message: 'Successfully registered for event'
    });
  } catch (error) {
    next(error);
  }
};

// Cancel event registration
export const cancelRegistration = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const registration = await EventRegistration.findOne({
      eventId: id,
      userId,
      status: 'registered'
    });

    if (!registration) {
      res.status(404).json({
        success: false,
        error: 'Registration not found or already cancelled'
      });
      return;
    }

    const event = await Event.findById(id);
    if (event) {
      // Check if cancellation is allowed (e.g., not too close to event date)
      const hoursUntilEvent = (event.date.getTime() - new Date().getTime()) / (1000 * 60 * 60);
      
      if (hoursUntilEvent < 24) {
        res.status(400).json({
          success: false,
          error: 'Cannot cancel registration less than 24 hours before the event'
        });
        return;
      }

      // Update registration status
      registration.status = 'cancelled';
      await registration.save();

      // Update event registered count
      event.registeredCount = Math.max(0, event.registeredCount - 1);
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get user's event registrations
export const getUserRegistrations = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const query: any = { userId };
    if (status) {
      query.status = status;
    }

    const registrations = await EventRegistration.find(query)
      .populate('eventId', 'title description date startTime endTime location price isFree')
      .sort({ registrationDate: -1 });

    res.status(200).json({
      success: true,
      data: registrations
    });
  } catch (error) {
    next(error);
  }
};

// Get event registrations (for event organizers/admins)
export const getEventRegistrations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    const query: any = { eventId: id };
    if (status) {
      query.status = status;
    }

    const registrations = await EventRegistration.find(query)
      .populate('userId', 'firstName lastName email phoneNumber')
      .sort({ registrationDate: -1 });

    res.status(200).json({
      success: true,
      data: registrations
    });
  } catch (error) {
    next(error);
  }
};

// Create new event (admin only)
export const createEvent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
      return;
    }

    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      data: event,
      message: 'Event created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update event (admin only)
export const updateEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      res.status(404).json({
        success: false,
        error: 'Event not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: event,
      message: 'Event updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete event (admin only)
export const deleteEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      res.status(404).json({
        success: false,
        error: 'Event not found'
      });
      return;
    }

    // Also delete all registrations for this event
    await EventRegistration.deleteMany({ eventId: id });

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};