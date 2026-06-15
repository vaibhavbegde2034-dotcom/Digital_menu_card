const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    logo: { type: String },
    isSuperAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    subscriptionEndDate: { type: Date },
    planDurationMonths: { type: Number, default: 0 }
}, { timestamps: true });


module.exports = mongoose.model('Admin', adminSchema);

