import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, styled } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CryptoJS from 'crypto-js';
import FetchImageProducts from '../FetchImageProducts/FetchImageProducts';
import TitleProducts from '../TitleProducts/TitleProducts';
import ProductPrices from '../PriceProducts/PriceProducts';
import AddMoreProducts from '../AddMoreProducts/AddMoreProducts';
import ShoppingCartButton from '../ButtonIconSpecial/ButtonIconText';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY || 'fallback';

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decryptData = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (err) {
    console.error('Erro ao descriptografar cache:', err);
    return null;
  }
};

const CACHE_PREFIX = 'icecream_products_';

const getCachedProducts = (tag) => {
  const cacheKey = `${CACHE_PREFIX}${tag || 'all'}`;
  const cachedData = localStorage.getItem(cacheKey);
  if (!cachedData) return null;

  try {
    const { data: encryptedData, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < 300000) {
      return decryptData(encryptedData);
    }
  } catch (err) {
    console.error('Erro ao ler cache:', err);
  }

  localStorage.removeItem(cacheKey);
  return null;
};

const setCachedProducts = (tag, data) => {
  const cacheKey = `${CACHE_PREFIX}${tag || 'all'}`;
  const cacheData = {
    data: encryptData(data),
    timestamp: Date.now(),
  };
  localStorage.setItem(cacheKey, JSON.stringify(cacheData));
};

// Animações
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
  hover: {
    y: -5,
    transition: { duration: 0.2 },
  },
};

const imageVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
  hover: {
    scale: 1.05,
  },
};

// Estilos
const ProductsContainerWrapper = styled(motion.div)(({ theme }) => ({
  width: '240px',
  minHeight: '360px',
  padding: '16px',
  position: 'relative',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  boxShadow: theme.shadows[3],
  backgroundColor: '#ffffff',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
    backgroundColor: '#51497D',
    '& .ProductsContainer__TitleSession': {
      opacity: 0,
    },
    '& .ProductsContainer__PriceSession': {
      color: 'white',
      transform: 'translateY(-28px)',
    },
    '& .ProductsContainer__Actions': {
      opacity: 1,
    },
  },
}));

const TitleSession = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '60px',
  fontFamily: 'Poppins, sans-serif',
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#2A2A2A',
  transition: 'opacity 0.3s ease',
  textAlign: 'center',
  padding: '0 8px',
  boxSizing: 'border-box',
});

const PriceSession = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  fontFamily: 'Poppins, sans-serif',
  fontSize: '1.3rem',
  fontWeight: 700,
  color: '#51497D',
  transition: 'color 0.3s ease, transform 0.3s ease',
  margin: '8px 0',
});

const ActionsContainer = styled(Box)({
  display: 'flex',
  gap: '12px',
  justifyContent: 'center',
  width: '100%',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  position: 'absolute',
  bottom: '24px',
  left: '0',
  padding: '0 16px',
  boxSizing: 'border-box',
});

// Componente principal
const ProductsContainer = ({ selectedTag }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const cachedProducts = getCachedProducts(selectedTag);
        if (cachedProducts) {
          setProducts(cachedProducts);
          setLoading(false);
          return;
        }

        const response = await axios.get('/api/products', {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'max-age=300',
          },
        });

        let filteredProducts = response.data;

        if (selectedTag) {
          filteredProducts = filteredProducts.filter(
            (product) => product.tag === selectedTag,
          );
        }

        const productsToShow = filteredProducts.slice(0, 8);
        setProducts(productsToShow);
        setCachedProducts(selectedTag, productsToShow);
        setLoading(false);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error('Erro ao buscar produtos:', err);
          const cached = getCachedProducts(selectedTag);
          if (cached) {
            setProducts(cached);
            setError('Dados podem estar desatualizados (modo offline)');
          } else {
            setError('Erro ao carregar produtos');
          }
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, [selectedTag]);

  const updateQuantity = (productId, newValue) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]:
        typeof newValue === 'function'
          ? newValue(prev[productId] || 0)
          : newValue,
    }));
  };

  const handleAddToCart = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: 0,
    }));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px',
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear',
          }}
        >
          🍦
        </motion.div>
      </Box>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px',
            color: 'error.main',
          }}
        >
          {error}
        </Box>
      </motion.div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px',
          }}
        >
          Nenhum produto encontrado{' '}
          {selectedTag && `para a tag "${selectedTag}"`}
        </Box>
      </motion.div>
    );
  }

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 3,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 3,
        justifyContent: 'center',
      }}
    >
      <AnimatePresence>
        {products.map((product) => (
          <ProductsContainerWrapper
            key={product._id}
            variants={itemVariants}
            whileHover="hover"
            layout
          >
            <Box
              component={motion.div}
              variants={imageVariants}
              sx={{
                width: '100%',
                height: '180px',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <FetchImageProducts
                imageUrl={product.imageUrl || product.webImageUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>

            <TitleSession className="ProductsContainer__TitleSession">
              <TitleProducts name={product.name} />
            </TitleSession>

            <PriceSession className="ProductsContainer__PriceSession">
              <ProductPrices price={product.price} />
            </PriceSession>

            <ActionsContainer className="ProductsContainer__Actions">
              <AddMoreProducts
                quantity={quantities[product._id] || 0}
                setQuantity={(newQty) => updateQuantity(product._id, newQty)}
              />
              <ShoppingCartButton
                productId={product._id}
                currentQuantity={quantities[product._id] || 0}
                onAddToCart={() => handleAddToCart(product._id)}
              />
            </ActionsContainer>
          </ProductsContainerWrapper>
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default ProductsContainer;
