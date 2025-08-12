import express from 'express';
import {
  getEvents,
  getEventById,
  registerForEvent,
  cancelRegistration,
  getUserRegistrations,
  getEventRegistrations,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController';
import { protect, authorize } from '../middleware/auth';
import { validateEvent } from '../middleware/validation';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management and registration
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     tags: [Events]
 *     summary: Get all events with filtering
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [book_signing, reading, workshop, discussion, launch]
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: isFree
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of events retrieved successfully
 */
router.get('/', getEvents);

/**
 * @swagger
 * /api/events/my-registrations:
 *   get:
 *     tags: [Events]
 *     summary: Get user's event registrations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [registered, attended, cancelled]
 *     responses:
 *       200:
 *         description: User registrations retrieved successfully
 */
router.get('/my-registrations', protect, getUserRegistrations);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     tags: [Events]
 *     summary: Get event by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *       404:
 *         description: Event not found
 */
router.get('/:id', getEventById);

/**
 * @swagger
 * /api/events/{id}/register:
 *   post:
 *     tags: [Events]
 *     summary: Register for an event
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Successfully registered for event
 *       400:
 *         description: Registration failed (event full, already registered, etc.)
 *       404:
 *         description: Event not found
 */
router.post('/:id/register', protect, registerForEvent);

/**
 * @swagger
 * /api/events/{id}/cancel:
 *   post:
 *     tags: [Events]
 *     summary: Cancel event registration
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registration cancelled successfully
 *       400:
 *         description: Cannot cancel registration
 *       404:
 *         description: Registration not found
 */
router.post('/:id/cancel', protect, cancelRegistration);

/**
 * @swagger
 * /api/events/{id}/registrations:
 *   get:
 *     tags: [Events]
 *     summary: Get event registrations (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [registered, attended, cancelled]
 *     responses:
 *       200:
 *         description: Event registrations retrieved successfully
 */
router.get('/:id/registrations', protect, authorize('admin'), getEventRegistrations);

// Admin routes for event management
/**
 * @swagger
 * /api/events:
 *   post:
 *     tags: [Events]
 *     summary: Create new event (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - type
 *               - date
 *               - startTime
 *               - endTime
 *               - location
 *               - capacity
 *               - organizer
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [book_signing, reading, workshop, discussion, launch]
 *               date:
 *                 type: string
 *                 format: date-time
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *               capacity:
 *                 type: integer
 *               price:
 *                 type: number
 *               organizer:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event created successfully
 */
router.post('/', protect, authorize('admin'), validateEvent, createEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     tags: [Events]
 *     summary: Update event (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       404:
 *         description: Event not found
 */
router.put('/:id', protect, authorize('admin'), updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     tags: [Events]
 *     summary: Delete event (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 */
router.delete('/:id', protect, authorize('admin'), deleteEvent);

export default router;