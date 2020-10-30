const mongoose = require('mongoose');

const SportSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a sport title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  rules: {
    type: String,
    required: [true, 'Please add the rules']
  },
  cost: {
    type: Number
  },
  level: {
    type: String,
    enum: ['all','beginner', 'intermediate', 'advanced'],
    default:'all'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Sport', SportSchema);