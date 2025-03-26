import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, styled } from '@mui/material';
import FetchImageProducts from '../FetchImageProducts/FetchImageProducts';
import TitleProducts from '../TitleProducts/TitleProducts';
import ProductPrices from '../PriceProducts/PriceProducts';
import AddMoreProducts from '../AddMoreProducts/AddMoreProducts';
import ShoppingCartButton from '../ButtonIconSpecial/ButtonIconText';

const ProductsContainerWrapper = styled(Box)(({ theme }) => ({
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
  gap: '16px',
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
      transform: 'translateY(-25px)',
    },
    '& .ProductsContainer__Actions': {
      opacity: 1,
    },
  },
}));

const TitleSession = styled(Box)({
  textAlign: 'center',
  fontFamily: 'Poppins, sans-serif',
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#2A2A2A',
  transition: 'opacity 0.3s ease',
  width: '100%',
  marginTop: '8px',
});

const PriceSession = styled(Box)({
  textAlign: 'center',
  fontFamily: 'Poppins, sans-serif',
  fontSize: '1.3rem',
  fontWeight: 700,
  color: '#51497D',
  transform: 'none',
  transition: 'color 0.3s ease, transform 0.3s ease',
  width: '100%',
  marginTop: '12px',
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

const ProductsContainer = ({ selectedTag }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Primeiro busca todos os produtos
        const response = await axios.get('/api/products', {
          signal: controller.signal,
        });

        let filteredProducts = response.data;

        // Se houver uma tag selecionada, filtra os produtos
        if (selectedTag) {
          filteredProducts = response.data.filter(
            (product) => product.tag === selectedTag,
          );
        }

        setProducts(filteredProducts.slice(0, 8)); // Limita a 8 produtos
        setLoading(false);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error('Erro ao buscar produtos:', err);
          setError('Erro ao carregar produtos');
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, [selectedTag]);

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
        <div>Carregando produtos...</div>
      </Box>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (products.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px',
        }}
      >
        Nenhum produto encontrado {selectedTag && `para a tag "${selectedTag}"`}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 3,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 3,
      }}
    >
      {products.map((product) => (
        <ProductsContainerWrapper key={product._id}>
          <Box
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
            <AddMoreProducts productId={product._id} />
            <ShoppingCartButton productId={product._id} />
          </ActionsContainer>
        </ProductsContainerWrapper>
      ))}
    </Box>
  );
};

export default ProductsContainer;
