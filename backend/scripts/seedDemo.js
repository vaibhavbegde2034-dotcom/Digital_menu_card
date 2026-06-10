require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Food = require('../models/Food');

const demoAdmin = {
    username: 'admin',
    password: 'password123'
};

const demoMenu = [
    {
        category: 'Starters',
        foods: [
            {
                name: 'Crispy Paneer Bites',
                description: 'Golden fried paneer tossed with peppers, onions, and house spice mix.',
                price: 149,
                availability: true
            },
            {
                name: 'Veg Spring Rolls',
                description: 'Crunchy rolls filled with fresh vegetables and served with sweet chili dip.',
                price: 129,
                availability: true
            }
        ]
    },
    {
        category: 'Main Course',
        foods: [
            {
                name: 'Butter Paneer Masala',
                description: 'Paneer cubes simmered in a creamy tomato gravy with mild spices.',
                price: 249,
                availability: true
            },
            {
                name: 'Veg Biryani',
                description: 'Fragrant basmati rice cooked with vegetables, herbs, and biryani spices.',
                price: 219,
                availability: true
            }
        ]
    },
    {
        category: 'Beverages',
        foods: [
            {
                name: 'Fresh Lime Soda',
                description: 'Chilled lime soda served sweet, salted, or mixed.',
                price: 79,
                availability: true
            },
            {
                name: 'Cold Coffee',
                description: 'Creamy iced coffee blended with milk and a smooth coffee finish.',
                price: 119,
                availability: true
            }
        ]
    }
];

async function seedDemo() {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not configured');
    }

    await mongoose.connect(process.env.MONGO_URI);

    try {
        await Category.collection.dropIndex('name_1');
    } catch (error) {
        if (error.codeName !== 'IndexNotFound') {
            throw error;
        }
    }
    await Category.syncIndexes();

    const hashedPassword = await bcrypt.hash(demoAdmin.password, 10);
    const admin = await Admin.findOneAndUpdate(
        { username: demoAdmin.username },
        { username: demoAdmin.username, password: hashedPassword },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    let categoryCount = 0;
    let foodCount = 0;

    for (const menuGroup of demoMenu) {
        const category = await Category.findOneAndUpdate(
            { name: menuGroup.category, admin: admin._id },
            { name: menuGroup.category, admin: admin._id },
            { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
        );
        categoryCount += 1;

        for (const foodItem of menuGroup.foods) {
            await Food.findOneAndUpdate(
                { name: foodItem.name, admin: admin._id },
                { ...foodItem, category: category._id, admin: admin._id, image: '' },
                { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
            );
            foodCount += 1;
        }
    }

    console.log(`Demo admin ready: ${demoAdmin.username} / ${demoAdmin.password}`);
    console.log(`Demo categories upserted: ${categoryCount}`);
    console.log(`Demo foods upserted: ${foodCount}`);
}

seedDemo()
    .catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
