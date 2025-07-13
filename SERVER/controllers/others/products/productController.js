const Product = require('../../../model/productModel');

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

exports.getAllProductsForCoupons = async (req, res) => {
  console.log('Acessando getAllProductsForCoupons');
  try {
    const products = await Product.find({}, 'id name');
    console.log('Produtos encontrados:', products.length);
    res.status(200).json(products.map(p => ({
      id: p._id,
      name: p.name
    })));
  } catch (error) {
    console.error('Erro em getAllProductsForCoupons:', error);
    res.status(500).json({ message: 'Erro ao buscar produtos', error });
  }
};

exports.getUniqueCategoriesFromTags = async (req, res) => {
  console.log('Acessando getUniqueCategoriesFromTags');
  try {
    const uniqueTags = await Product.aggregate([
      { $match: { tag: { $exists: true, $ne: "" } } },
      { $group: { _id: "$tag" } },
      { $project: { name: "$_id", _id: 0 } },
      { $sort: { name: 1 } }
    ]);

    console.log('Categorias únicas encontradas:', uniqueTags.length);

    const categories = uniqueTags.map((tag, index) => ({
      id: index + 1,
      name: tag.name
    }));

    res.status(200).json(categories);
  } catch (error) {
    console.error('Erro em getUniqueCategoriesFromTags:', error);
    res.status(500).json({
      message: 'Erro ao buscar categorias',
      error: error.message
    });
  }
};

exports.verifyCheckout = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Lista de itens inválida' });
    }

    const productIds = items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      const missingProducts = items.filter(item =>
        !products.some(p => p._id.toString() === item.productId)
      );
      return res.status(404).json({
        message: 'Alguns produtos não foram encontrados',
        missingProducts
      });
    }

    const outOfStock = [];
    const priceChanged = [];
    let total = 0;

    items.forEach(item => {
      const product = products.find(p => p._id.toString() === item.productId);

      if (product.quantity < item.quantity) {
        outOfStock.push({
          productId: product._id,
          name: product.name,
          available: product.quantity,
          requested: item.quantity
        });
      }

      if (Math.abs(product.price - item.price) > 0.01) {
        priceChanged.push({
          productId: product._id,
          name: product.name,
          oldPrice: item.price,
          newPrice: product.price
        });
      }

      total += product.price * item.quantity;
    });

    if (outOfStock.length > 0 || priceChanged.length > 0) {
      return res.status(409).json({
        message: 'Alguns produtos precisam de atenção',
        outOfStock,
        priceChanged,
        total
      });
    }

    res.status(200).json({
      message: 'Produtos verificados com sucesso',
      total
    });

  } catch (error) {
    console.error('Erro na verificação:', error);
    res.status(500).json({ message: 'Erro ao verificar produtos', error: error.message });
  }
};
