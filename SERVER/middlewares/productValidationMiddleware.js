const { body, validationResult } = require('express-validator');

const validateProduct = [
  body('name').notEmpty().withMessage('O nome do produto é obrigatório.'),
  body('price').isFloat({ gt: 0 }).withMessage('O preço deve ser um número maior que 0.'),
  body('tag').notEmpty().withMessage('A tag do produto é obrigatória.'),
  body('costPrice').isFloat({ gt: 0 }).withMessage('O preço de custo deve ser um número maior que 0.'),
  body('quantity').isInt({ gt: 0 }).withMessage('A quantidade deve ser um número maior que 0.'),
  body('expirationDate').isDate().withMessage('A data de validade deve ser uma data válida.'),
  body('description').optional().isLength({ max: 500 }).withMessage('A descrição não pode ultrapassar 500 caracteres.'),
  body('webImageUrl').optional().isURL().withMessage('URL da imagem inválida.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateProduct };