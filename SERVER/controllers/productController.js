const Product = require('../model/productModel');

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      tag,
      description,
      webImageUrl,
      costPrice,
      brand,
      quantity,
      expirationDate,
    } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !price || !tag || !costPrice || !quantity || !expirationDate) {
      return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    if (!imageUrl && !webImageUrl) {
      return res.status(400).json({ message: 'Uma imagem é obrigatória.' });
    }

    const newProduct = new Product({
      name,
      price,
      tag,
      description,
      webImageUrl,
      imageUrl,
      costPrice,
      brand,
      quantity,
      expirationDate,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Produto cadastrado com sucesso!', newProduct });
  } catch (error) {
    console.error('Erro ao cadastrar o produto:', error);
    res.status(500).json({ message: 'Erro ao cadastrar o produto.', error: error.message });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos', error });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produto', error });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, tag, description, webImageUrl } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (price && isNaN(price)) {
      return res.status(400).json({ message: 'O preço deve ser um número válido.' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.tag = tag || product.tag;
    product.description = description || product.description;
    product.webImageUrl = webImageUrl || product.webImageUrl;
    if (imageUrl) {
      product.imageUrl = imageUrl;
    }

    await product.save();
    res.status(200).json({ message: 'Produto atualizado com sucesso!', product });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar o produto.', error });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se o produto existe
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: 'Produto excluído com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir o produto.', error });
  }
};
