const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Usando bcryptjs em vez de bcrypt

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Garante que o username seja único
        trim: true, // Remove espaços extras do username
        minlength: [3, 'O nome de usuário deve ter pelo menos 3 caracteres.'], // Validação do comprimento
        maxlength: [30, 'O nome de usuário pode ter no máximo 30 caracteres.'] // Validação do comprimento
    },
    password: {
        type: String,
        required: true,
        select: true, // Não retornar a senha nas consultas
        minlength: [6, 'A senha deve ter pelo menos 6 caracteres.'] // Validação de comprimento mínimo
    }
});

// Middleware para hash da senha antes de salvar
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        // Hashing da senha com bcryptjs
        this.password = await bcrypt.hash(this.password, 10);
        next(); // Continua o processo de salvamento
    } catch (err) {
        next(err); // Passa o erro para o próximo middleware
    }
});

// Método para comparar senhas
userSchema.methods.matchPassword = async function(password) {
  try {
    console.log('Senha fornecida:', password);
    console.log('Senha hashada armazenada:', this.password); // Log da senha armazenada no DB

    const isMatch = await bcrypt.compare(password, this.password);
    console.log('Senha válida:', isMatch);
    return isMatch;
  } catch (err) {
    console.error('Erro ao comparar senhas:', err);
    throw new Error("Erro na comparação da senha.");
  }
};


// Criação do modelo
const User = mongoose.model("User", userSchema);

module.exports = User;
