import React from 'react';
import { Typography } from '@mui/material';

const ProductPrices = ({ price }) => {
  return (
    <Typography
      className="ProductsContainer__PriceSession"
      sx={{
        fontSize: '1.8rem',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 600,
        transition: 'color 0.3s ease',
      }}
    >
      R$ {price.toFixed(2).replace('.', ',')}
    </Typography>
  );
};

export default ProductPrices;
