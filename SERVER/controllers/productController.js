import Product from '../model/productModel.js';

export const createProduct = async (req, res) => {
  try {
    const { name, price, tag, imageUrl, imageFile } = req.body;

    const newProduct = new Product({
      name,
      price,
      tag,
      imageUrl,
      imageFile,
    });

    await newProduct.save();

    res.status(201).json({ message: 'Produto cadastrado com sucesso!', newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar o produto.', error: error.message });
  }
};
