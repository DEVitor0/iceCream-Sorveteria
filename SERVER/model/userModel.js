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
        select: true,
        minlength: [6, 'A senha deve ter pelo menos 6 caracteres.']
    }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.matchPassword = async function(password) {
  try {
    console.log('Senha fornecida:', password);
    console.log('Senha hashada armazenada:', this.password);

    const isMatch = await bcrypt.compare(password, this.password);
    console.log('Senha válida:', isMatch);
    return isMatch;
  } catch (err) {
    console.error('Erro ao comparar senhas:', err);
    throw new Error("Erro na comparação da senha.");
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
