const Product = require('../model/productModel');

const getAllTags = async (req, res) => {
    try {
        const products = await Product.find({}, 'tag');

        const tags = [...new Set(products.map(product => product.tag))];

        res.json({ tags });
    } catch (error) {
        console.error('Erro ao buscar tags:', error);
        res.status(500).json({ message: 'Erro ao buscar tags' });
    }
};

module.exports = {
    getAllTags
};
