import { Button, ButtonGroup } from '@mui/material';

const CarouselControls = ({ count, current, onChange }) => {
  return (
    <ButtonGroup
      variant="outlined"
      aria-label="carousel navigation"
      sx={{
        gap: '8px', // Espaço entre os botões
        '& .MuiButton-root': {
          minWidth: '44px',
          height: '44px',
          borderRadius: '8px !important',
          borderColor: '#52478C',
          color: '#52478C',
          fontSize: '16px',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: '#52478C',
            backgroundColor: 'rgba(82, 71, 140, 0.1)',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(82, 71, 140, 0.2)',
          },
        },
        '& .MuiButton-contained': {
          backgroundColor: '#52478C !important',
          color: '#fff !important',
          boxShadow: '0 2px 6px rgba(82, 71, 140, 0.4)',
          '&:hover': {
            backgroundColor: '#3f3870 !important',
            boxShadow: '0 4px 10px rgba(82, 71, 140, 0.5)',
          },
        },
        '& .MuiButton-outlined': {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Button
          key={index}
          variant={current === index ? 'contained' : 'outlined'}
          onClick={() => onChange(index)}
          sx={{
            '&:active': {
              transform: 'translateY(0) !important',
            },
          }}
        >
          {index + 1}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default CarouselControls;
