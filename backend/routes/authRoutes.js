const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'menu_card_logos',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 200, height: 200, crop: 'limit' }]
    }
});

const upload = multer({ storage });

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Optimization: Use .lean() and only select necessary fields
        const admin = await Admin.findOne({ username }).select('+password').lean();

        if (admin && (await bcrypt.compare(password, admin.password))) {
            const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.json({ _id: admin._id, username: admin.username, logo: admin.logo, isSuperAdmin: admin.isSuperAdmin, token });
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
        const admins = await Admin.find().select('_id username logo createdAt').sort({ username: 1 }).lean();
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/public/:id', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select('_id username logo').lean();

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.json({ _id: admin._id, username: admin.username, logo: admin.logo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/me', protect, async (req, res) => {
    const admin = await Admin.findById(req.adminId).select('_id username logo isSuperAdmin');
    res.json({ _id: admin._id, username: admin.username, logo: admin.logo, isSuperAdmin: admin.isSuperAdmin });
});

router.put('/me', protect, upload.single('logo'), async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (req.file) {
            // Delete old logo from Cloudinary if it exists
            if (admin.logo && admin.logo.includes('cloudinary.com')) {
                const match = admin.logo.match(/menu_card_logos\/([^/.]+)/);
                if (match) {
                    const publicId = `menu_card_logos/${match[1]}`;
                    await cloudinary.uploader.destroy(publicId);
                }
            }
            admin.logo = req.file.path;
        }

        const updatedAdmin = await admin.save();
        res.json({ _id: updatedAdmin._id, username: updatedAdmin.username, logo: updatedAdmin.logo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
