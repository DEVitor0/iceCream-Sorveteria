import React from 'react';
import { Typography } from '@mui/material';

const TitleProducts = ({ name }) => {
  return (
    <Typography
      variant="h4"
      sx={{
        color: '#000 !important',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 500,
      }}
      position="absolute"
    >
      {name}
    </Typography>
  );
};

export default TitleProducts;
