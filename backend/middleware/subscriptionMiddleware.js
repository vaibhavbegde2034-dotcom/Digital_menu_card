const Admin = require('../models/Admin');

const checkSubscription = async (req, res, next) => {
    try {
        const adminId = req.adminId || req.query.admin;
        if (!adminId) return next(); // Not accessing a specific admin's menu

        const admin = await Admin.findById(adminId);
        
        // If no admin or SuperAdmin, allow access
        if (!admin || admin.isSuperAdmin) return next();

        // Check if subscription has expired
        if (!admin.subscriptionEndDate || new Date() > admin.subscriptionEndDate) {
            return res.status(403).json({ message: 'Subscription expired. Please contact the administrator.' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Error checking subscription' });
    }
};

module.exports = { checkSubscription };
