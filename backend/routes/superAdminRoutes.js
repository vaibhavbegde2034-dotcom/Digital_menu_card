const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Food = require('../models/Food');
const { protect } = require('../middleware/authMiddleware');

// Middleware to check if the user is a Super Admin
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
        const { months } = req.body;
        const admin = await Admin.findById(req.params.id);
        
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        
        const currentDate = admin.subscriptionEndDate && new Date() < admin.subscriptionEndDate 
            ? admin.subscriptionEndDate 
            : new Date();
            
        currentDate.setMonth(currentDate.getMonth() + months);
        
        admin.subscriptionEndDate = currentDate;
        admin.planDurationMonths = (admin.planDurationMonths || 0) + months;
        await admin.save();
        
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
