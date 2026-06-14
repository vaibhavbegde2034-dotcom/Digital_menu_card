const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Category = require('../models/Category');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

const Food = require('../models/Food');

router.get('/', optionalProtect, async (req, res) => {
    try {
        const adminId = req.adminId || req.query.admin;
        if (!adminId) {
            return res.json([]);
        }

        const adminObjectId = new mongoose.Types.ObjectId(adminId);

        const categoriesWithCount = await Category.aggregate([
            { $match: { admin: adminObjectId } },
            {
                $lookup: {
                    from: 'foods',
                    localField: '_id',
                    foreignField: 'category',
                    as: 'foods'
                }
            },
            {
                $project: {
                    name: 1,
                    admin: 1,
                    foodCount: { $size: '$foods' }
                }
            }
        ]);
        
        res.json(categoriesWithCount);
    } catch (error) {
        console.error('Error fetching categories with counts:', error);
        res.status(500).json({ message: error.message });
    }
});

router.use((req, res, next) => {
    if (req.method === 'GET') {
        return next();
    }
    return protect(req, res, next);
});

router.post('/', async (req, res) => {
    try {
        const category = await Category.create({ name: req.body.name, admin: req.adminId });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        console.log(`Updating category ${req.params.id} for admin ${req.adminId}`);
        const category = await Category.findOne({ _id: req.params.id, admin: req.adminId });
        if (!category) {
            console.log('Category not found or admin mismatch');
            return res.status(404).json({ message: 'Category not found' });
        }
        category.name = req.body.name;
        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        console.error('Update error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Category.findOneAndDelete({ _id: req.params.id, admin: req.adminId });
        res.json({ message: 'Category removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
