const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const addressSchema = new mongoose.Schema({
  cep: {
    type: String,
    required: true,
    match: [/^\d{5}-?\d{3}$/, 'CEP inválido']
  },
  logradouro: {
    type: String,
    required: true,
    trim: true
  },
  numero: {
    type: String,
    required: true
  },
  complemento: {
    type: String,
    trim: true
  },
  bairro: {
    type: String,
    required: true,
    trim: true
  },
  cidade: {
    type: String,
    required: true,
    trim: true
  },
  estado: {
    type: String,
    required: true,
    enum: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'],
    uppercase: true
  },
  principal: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
    password: {
        type: String,
        select: false,
        minlength: [6, 'A senha deve ter pelo menos 6 caracteres.']
    },
    googleSub: {
        type: String,
        unique: true,
        sparse: true
    },
    fullName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, insira um email válido']
    },
    photo: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moder'],
        default: 'user'
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    lastLogin: {
      type: Date,
      default: null
    },
    addresses: [addressSchema]
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || this.provider !== 'local') return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.matchPassword = async function(password) {
    if (this.provider !== 'local') return false;
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
