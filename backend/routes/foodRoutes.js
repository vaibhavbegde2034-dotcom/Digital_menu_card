const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const Category = require('../models/Category');
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const { checkSubscription } = require('../middleware/subscriptionMiddleware');
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
        folder: 'menu_card_foods',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});

const upload = multer({ storage });

router.get('/', optionalProtect, checkSubscription, async (req, res) => {
    try {
        const adminId = req.adminId || req.query.admin;
        const query = adminId ? { admin: adminId } : {};
        const foods = await Food.find(query).populate('category', 'name').lean();
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.use((req, res, next) => {
    if (req.method === 'GET') {
        return next();
    }
    return protect(req, res, next);
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category, availability, dietaryType, spicyLevel } = req.body;
        const image = req.file ? req.file.path : '';
        
        const categoryExists = await Category.exists({ _id: category, admin: req.adminId });

        if (!categoryExists) {
            return res.status(400).json({ message: 'Invalid category for this admin' });
        }
        
        const food = await Food.create({
            name, 
            description, 
            price, 
            category, 
            admin: req.adminId, 
            availability: availability === 'true' || availability === true, 
            image,
            dietaryType: dietaryType || 'veg',
            spicyLevel: Number(spicyLevel) || 0
        });
        res.status(201).json(food);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category, availability, dietaryType, spicyLevel } = req.body;
        const food = await Food.findOne({ _id: req.params.id, admin: req.adminId });

        if (food) {
            if (category) {
                const categoryExists = await Category.exists({ _id: category, admin: req.adminId });
                if (!categoryExists) {
                    return res.status(400).json({ message: 'Invalid category for this admin' });
                }
            }
            food.name = name || food.name;
            food.description = description || food.description;
            food.price = price || food.price;
            food.category = category || food.category;
            food.dietaryType = dietaryType || food.dietaryType;
            if (spicyLevel !== undefined) {
                food.spicyLevel = Number(spicyLevel);
            }
            if (availability !== undefined) {
                 food.availability = availability === 'true' || availability === true;
            }
            if (req.file) {
                 food.image = req.file.path;
            }

            const updatedFood = await food.save();
            res.json(updatedFood);
        } else {
            res.status(404).json({ message: 'Food not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const food = await Food.findOne({ _id: req.params.id, admin: req.adminId });

        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }

        if (food.image && food.image.includes('cloudinary.com')) {
            // Correct logic: extract the part after 'menu_card_foods/' and before the extension
            const match = food.image.match(/menu_card_foods\/([^/.]+)/);
            if (match) {
                const publicId = `menu_card_foods/${match[1]}`;
                console.log('DEBUG: Attempting to delete Cloudinary image with publicId:', publicId);
                const result = await cloudinary.uploader.destroy(publicId);
                console.log('DEBUG: Cloudinary deletion result:', result);
            }
        }

        await food.deleteOne();
        res.json({ message: 'Food removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
