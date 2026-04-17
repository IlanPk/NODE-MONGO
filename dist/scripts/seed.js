"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const User_1 = __importDefault(require("../models/User"));
const Card_1 = __importDefault(require("../models/Card"));
const seedData = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        // Clear existing data
        await User_1.default.deleteMany({});
        await Card_1.default.deleteMany({});
        console.log('Cleared existing data');
        // Create sample users
        const regularUser = new User_1.default({
            fullName: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            phone: '+1234567890',
            isBusiness: false,
            isAdmin: false,
        });
        const businessUser = new User_1.default({
            fullName: 'Jane Smith',
            email: 'jane@example.com',
            password: 'password123',
            phone: '+0987654321',
            isBusiness: true,
            isAdmin: false,
            businessNumber: 'BIZ-001-TECH',
        });
        const adminUser = new User_1.default({
            fullName: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            phone: '+1111111111',
            isBusiness: false,
            isAdmin: true,
        });
        await regularUser.save();
        await businessUser.save();
        await adminUser.save();
        console.log('Created 3 sample users');
        // Create sample cards
        const card1 = new Card_1.default({
            title: 'Tech Solutions',
            description: 'Professional software development and consulting services',
            phone: '+0987654321',
            email: 'tech@example.com',
            address: '123 Tech Street, Silicon Valley',
            businessNumber: 'BIZ001',
            image: 'https://via.placeholder.com/300',
            userId: businessUser._id,
        });
        const card2 = new Card_1.default({
            title: 'Design Studio',
            description: 'Creative design and branding solutions for your business',
            phone: '+1122334455',
            email: 'design@example.com',
            address: '456 Design Ave, New York',
            businessNumber: 'BIZ002',
            image: 'https://via.placeholder.com/300',
            userId: businessUser._id,
        });
        const card3 = new Card_1.default({
            title: 'Marketing Agency',
            description: 'Digital marketing and social media management services',
            phone: '+2233445566',
            email: 'marketing@example.com',
            address: '789 Marketing Blvd, Los Angeles',
            businessNumber: 'BIZ003',
            image: 'https://via.placeholder.com/300',
            userId: adminUser._id,
        });
        await card1.save();
        await card2.save();
        await card3.save();
        console.log('Created 3 sample cards');
        console.log('✅ Seed data created successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};
seedData();
//# sourceMappingURL=seed.js.map