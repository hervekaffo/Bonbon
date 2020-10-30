const express = require('express');
const {
  getSports,
  getSport,
  addSport,
  updateSport,
  deleteSport
} = require('../controllers/sports');

const Sport = require('../models/Sport');
const advancedResults = require('../middleware/advancedResults');
const {protect, authorize} = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Sport, {
      path: 'event',
      select: 'name description'
    }),
    getSports
  )
  .post(protect, authorize('publisher', 'admin'), addSport);

router
  .route('/:id')
  .get(getSport)
  .put(protect, authorize('publisher', 'admin'), updateSport)
  .delete(protect, authorize('publisher', 'admin'), deleteSport); 

module.exports = router;