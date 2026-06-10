const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

router.get('/', optionalProtect, async (req, res) => {
    try {
        const adminId = req.adminId || req.query.admin;
        const query = adminId ? { admin: adminId } : {};
        const categories = await Category.find(query);
        res.json(categories);
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

router.post('/', async (req, res) => {
    try {
        const category = await Category.create({ name: req.body.name, admin: req.adminId });
        res.status(201).json(category);
    } catch (error) {
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
