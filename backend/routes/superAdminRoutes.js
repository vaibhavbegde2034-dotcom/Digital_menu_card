const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Food = require('../models/Food');
const { protect } = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');

// Middleware to check if the user is a Super Admin
// ... (isSuperAdmin remains the same)

// Add this route
router.post('/admins', protect, isSuperAdmin, async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) return res.status(409).json({ message: 'Username already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const admin = await Admin.create({ username, password: hashedPassword });
        res.status(201).json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const isSuperAdmin = async (req, res, next) => {
    const admin = await Admin.findById(req.adminId);
    if (admin && admin.isSuperAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Super Admin only.' });
    }
};

router.get('/admins', protect, isSuperAdmin, async (req, res) => {
    try {
        const admins = await Admin.find({ isSuperAdmin: false }).lean();
        
        const adminsWithStats = await Promise.all(admins.map(async (admin) => {
            const foodCount = await Food.countDocuments({ admin: admin._id });
            return { ...admin, foodCount };
        }));
        
        res.json(adminsWithStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/admins/:id/subscription', protect, isSuperAdmin, async (req, res) => {
    try {
        const { endDate } = req.body;
        const admin = await Admin.findById(req.params.id);
        
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        
        admin.subscriptionEndDate = new Date(endDate);
        await admin.save();
        
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
