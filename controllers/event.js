const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async'); 
const geocoder = require('../utils/geocoder');
const Event = require('../models/Event');

//@description   Get all events
//@Route         GET /api/v1/events
//@Access        Public
exports.getEvents = asyncHandler(async(req, res, next) =>{
  res.status(200).json(res.advancedResults);
});

//@description   Get a single event
//@Route         GET /api/v1/events/:id
//@Access        Public
exports.getEvent = asyncHandler(async(req, res, next) =>{
  const event = await Event.findById(req.params.id);

  if(!event){
    return next(
      new ErrorResponse(`event not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({success: true, data:event});
});

//@description   Create a new event
//@Route         POST /api/v1/events
//@Access        private
exports.createEvent = asyncHandler(async(req, res, next) =>{
  //Add user to req.body
  req.body.user = req.user.id;

//Check for published event
const publishedEvent = await Event.findOne({ user: req.user.id });

//If the user is not an admin, they can only add one event
if (publishedEvent && req.user.role !== 'admin') {
  return next(
    new ErrorResponse(
      `The user with ID ${req.user.id} has already published an event`,
      400
    )
  );
}

  const ev = await Event.create(req.body);

  res.status(201).json({
    success: true,
    data: ev
  });
});

//@description   Update an event
//@Route         PUT /api/v1/events/:id
//@Access        Public
exports.updateEvent = asyncHandler(async(req, res, next) =>{
  let event = await Event.findById(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is event owner
  if (event.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this event`,
        401
      )
    );
  }
 
  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: event });
  
});

//@description   Delete an event
//@Route         DELETE /api/v1/events/:id
//@Access        Public
exports.deleteEvent = asyncHandler(async(req, res, next) =>{
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`event not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is event owner
  if (event.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this event`,
        401
      )
    );
  }

  await event.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc      Get events within a radius
// @route     GET /api/v1/events/radius/:zipcode/:distance
// @access    Private
exports.getEventsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const events = await Event.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
});

// @desc      Upload photo for event
// @route     PUT /api/v1/events/:id/photo
// @access    Private
exports.eventPhotoUpload = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`event not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is event owner
  if (event.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this event`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

 
  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${event._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Event.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});
