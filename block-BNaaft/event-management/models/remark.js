const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const remarkSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, default: "User" },
    likes: { type: Number, default: 0 },        
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true},
}, {timestamps: true});

module.exports = mongoose.model('Remark', remarkSchema);