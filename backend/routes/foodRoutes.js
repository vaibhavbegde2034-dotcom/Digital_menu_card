const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const Category = require('../models/Category');
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.get('/', optionalProtect, async (req, res) => {
    try {
        const adminId = req.adminId || req.query.admin;
        const query = adminId ? { admin: adminId } : {};
        const foods = await Food.find(query).populate('category', 'name');
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
        const { name, description, price, category, availability } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : '';
        const categoryExists = await Category.exists({ _id: category, admin: req.adminId });

        if (!categoryExists) {
            return res.status(400).json({ message: 'Invalid category for this admin' });
        }
        
        const food = await Food.create({
            name, description, price, category, admin: req.adminId, availability: availability === 'true' || availability === true, image
        });
        res.status(201).json(food);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category, availability } = req.body;
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
            if (availability !== undefined) {
                 food.availability = availability === 'true' || availability === true;
            }
            if (req.file) {
                 food.image = `/uploads/${req.file.filename}`;
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
        await Food.findOneAndDelete({ _id: req.params.id, admin: req.adminId });
        res.json({ message: 'Food removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
