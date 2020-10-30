const express = require('express');
//import the controller methods
const{
  getEvent,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsInRadius,
  eventPhotoUpload
} = require('../controllers/event');

const Event = require('../models/Event');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize} = require('../middleware/auth');

//Include other resource routers
const sportRouter = require('./sports');
const reviewRouter = require('./reviews');

const router = express.Router();

// Re-route into other resource routers
router.use('/:eventId/sports', sportRouter);
router.use('/:eventId/reviews', reviewRouter);

router.route('/radius/:zipcode/:distance').get(getEventsInRadius);

router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), eventPhotoUpload);

router
  .route('/')
  .get(advancedResults(Event, 'sports'), getEvents)
  .post(protect, authorize('publisher', 'admin'), createEvent);

  router
  .route('/:id')
  .get(getEvent)
  .put(protect, authorize('publisher', 'admin'), updateEvent)
  .delete(protect, authorize('publisher', 'admin'), deleteEvent);

  module.exports = router;