const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: { type: String, required: true },
  summary: { type: String },
  host: { type: String },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  event_category: [{ type: String, required: true }],
  location: { type: String },
  likes: { type: Number, default: 0 },
  remarks: [{ type: Schema.Types.ObjectId, ref: 'Remark' }]
}, {timestamps: true});

module.exports = mongoose.model('Event', eventSchema);
