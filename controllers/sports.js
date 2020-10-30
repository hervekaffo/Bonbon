const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Sport = require('../models/Sport');
const Event = require('../models/Event');

// @desc      Get Sports 
// @route     GET /api/v1/sports
// @route     GET /api/v1/events/:eventId/sports
// @access    Public
exports.getSports = asyncHandler(async (req, res, next) => {
  if (req.params.eventId) {
    const sports = await Sport.find({ event: req.params.eventId });

    return res.status(200).json({
      success: true,
      count: sports.length,
      data: sports
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single sport
// @route     GET /api/v1/sports/:id
// @access    Public
exports.getSport = asyncHandler(async (req, res, next) => {
  const sport = await Sport.findById(req.params.id).populate({
    path: 'event',
    select: 'name description'
  });

  if (!sport) {
    return next(
      new ErrorResponse(`No sport with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: sport
  });
});

// @desc      Add sport
// @route     POST /api/v1/events/:eventId/sports
// @access    Private
exports.addSport = asyncHandler(async (req, res, next) => {
  req.body.event = req.params.eventId;
  req.body.user = req.user.id;

  console.log(req.user.id);
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    return next(
      new ErrorResponse(
        `No event with the id of ${req.params.eventId}`,
        404
      )
    );
  }

  // Make sure user is event owner
  if (event.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a sport to event ${event._id}`,
        401
      )
    );
  }

  const sport = await Sport.create(req.body);

  res.status(200).json({
    success: true,
    data: sport
  });
});

// @desc      Update Sport
// @route     PUT /api/v1/sports/:id
// @access    Private
exports.updateSport = asyncHandler(async (req, res, next) => {
  let sport = await Sport.findById(req.params.id);

  if (!sport) {
    return next(
      new ErrorResponse(`No sport with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is sport owner
  if (sport.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update sport ${sport._id}`,
        401
      )
    );
  }

  sport = await Sport.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  sport.save();

  res.status(200).json({
    success: true,
    data: sport
  });
});

// @desc      Delete Sport
// @route     DELETE /api/v1/sports/:id
// @access    Private
exports.deleteSport = asyncHandler(async (req, res, next) => {
  const sport = await Sport.findById(req.params.id);

  if (!sport) {
    return next(
      new ErrorResponse(`No sport with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is sport owner
  if (sport.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete sport ${sport._id}`,
        401
      )
    );
  }

  await sport.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
