require("dotenv").config();
const EMAIL_ADMIN = process.env.USER_ADMIN;
const PASSWORD_ADMIN = process.env.PASSWORD_ADMIN;

const User = require("../model/userModel");

const createAdminUser = async () => {
    try {
        const existingUser = await User.findOne({ email: EMAIL_ADMIN });
        if (existingUser) {
            console.log("Admin user already exists.");
            return;
        }

        const newUser = new User({
            email: EMAIL_ADMIN,
            password: PASSWORD_ADMIN,
            role: 'admin'
        });

        await newUser.save();
        console.log("Admin user created successfully.");
    } catch (err) {
        console.error("Error creating admin user:", err);
    }
};

module.exports = createAdminUser;