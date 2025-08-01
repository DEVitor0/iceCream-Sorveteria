import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import WarningIcon from '@mui/icons-material/Warning';

function OrdersOverview() {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        const response = await fetch('/api/low-stock');
        const data = await response.json();
        setLowStockProducts(data.products);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error('Erro ao buscar produtos com estoque baixo:', error);
      }
    };

    fetchLowStockProducts();
  }, []);

  // Cor personalizada
  const customColor = '#6C5EAB';

  return (
    <Card className="h-100" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: customColor }}>
            Estoque Baixo
          </Typography>
          <WarningIcon sx={{ color: customColor, ml: 1 }} />
        </Box>

        {lowStockProducts.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Nenhum produto com estoque baixo
          </Typography>
        ) : (
          <Box sx={{ overflow: 'auto', maxHeight: 300 }}>
            {lowStockProducts.map((product) => (
              <Box
                key={product._id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease',
                  },
                }}
              >
                <Box
                  component="img"
                  src={product.imageUrl}
                  alt={product.name}
                  sx={{
                    width: 48,
                    height: 48,
                    mr: 2,
                    borderRadius: 2,
                    objectFit: 'cover',
                    border: `1px solid #eee`,
                  }}
                />
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle2"
                    noWrap
                    sx={{ fontWeight: 500, color: 'text.primary' }}
                  >
                    {product.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Quantidade: {product.quantity}
                  </Typography>
                </Box>
                <Chip
                  label="Baixo"
                  size="small"
                  sx={{
                    ml: 1,
                    backgroundColor: customColor,
                    color: 'white !important',
                    fontWeight: 500,
                    borderRadius: 1,
                  }}
                />
              </Box>
            ))}

            {hasMore && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  mt: 1,
                  color: customColor,
                  fontWeight: 500,
                }}
              >
                + Mais produtos com estoque baixo
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default OrdersOverview;
