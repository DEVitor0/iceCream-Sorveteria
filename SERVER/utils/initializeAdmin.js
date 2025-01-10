require("dotenv").config();
const USER_ADMIN = process.env.USER_ADMIN;
const PASSWORD_ADMIN = process.env.PASSWORD_ADMIN;

const User = require("../model/userModel");

const createAdminUser = async () => {
    try {
        const existingUser = await User.findOne({ username: USER_ADMIN });
        if (existingUser) {
            console.log("Admin user already exists.");
            return;
        }

        const newUser = new User({
            username: USER_ADMIN,
            password: PASSWORD_ADMIN,
        });

        await newUser.save();
        console.log("Admin user created!");
    } catch (err) {
        console.error("Error creating admin user:", err);
    }
};

module.exports = createAdminUser;
