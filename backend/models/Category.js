const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }
}, { timestamps: true });

categorySchema.index({ name: 1, admin: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
