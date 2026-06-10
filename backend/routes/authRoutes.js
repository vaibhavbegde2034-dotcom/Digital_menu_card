const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (admin && (await bcrypt.compare(password, admin.password))) {
            const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.json({ _id: admin._id, username: admin.username, token });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/setup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingAdmin = await Admin.findOne({ username });

        if (existingAdmin) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const admin = await Admin.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
});

router.get('/public', async (req, res) => {
    try {
        const admins = await Admin.find().select('_id username createdAt').sort({ username: 1 });
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/public/:id', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select('_id username');

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.json({ _id: admin._id, username: admin.username });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/me', protect, async (req, res) => {
    const admin = await Admin.findById(req.adminId).select('_id username');
    res.json({ _id: admin._id, username: admin.username });
});

module.exports = router;
