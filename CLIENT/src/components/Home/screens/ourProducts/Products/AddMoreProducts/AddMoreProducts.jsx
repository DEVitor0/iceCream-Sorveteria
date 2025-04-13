import { Button, Box, Typography } from '@mui/material';

const AddMoreProducts = ({ quantity, setQuantity }) => {
  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      borderRadius="5px"
      sx={{
        width: '110px',
        height: '42px',
        border: '2px solid white',
        bgcolor: 'transparent',
        overflow: 'hidden',
      }}
    >
      <Button
        variant="text"
        onClick={handleDecrement}
        sx={{
          minWidth: '35px',
          color: '#fff',
          fontSize: '20px',
          height: '100%',
          borderRight: '2px solid white',
          borderRadius: 0,
          '&:hover': {
            backgroundColor: '#5E5787',
            color: '#fff',
          },
        }}
      >
        -
      </Button>

      <Typography
        variant="body1"
        sx={{
          color: '#fff',
          fontWeight: 600,
          fontSize: '18px',
          width: '40px',
          textAlign: 'center',
        }}
      >
        {quantity}
      </Typography>

      <Button
        variant="text"
        onClick={handleIncrement}
        sx={{
          minWidth: '35px',
          color: '#fff',
          fontSize: '20px',
          height: '100%',
          borderLeft: '2px solid white',
          borderRadius: 0,
          '&:hover': {
            backgroundColor: '#5E5787',
            color: '#fff',
          },
        }}
      >
        +
      </Button>
    </Box>
  );
};

export default AddMoreProducts;
