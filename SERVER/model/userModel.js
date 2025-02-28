const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [3, 'O nome de usuário deve ter pelo menos 3 caracteres.'],
        maxlength: [30, 'O nome de usuário pode ter no máximo 30 caracteres.']
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: [6, 'A senha deve ter pelo menos 6 caracteres.']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.matchPassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
