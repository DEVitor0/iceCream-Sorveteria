import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

const AuthPopup = ({ open, message, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          padding: '20px',
          maxWidth: '400px',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, color: '#52478C' }}>
        Atenção
      </DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            mr: 2,
            borderRadius: '12px',
            color: '#52478C',
            '&:hover': {
              backgroundColor: '#E3E3EC',
              color: '#7D75A8',
              border: '1px solid #52478C',
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{
            backgroundColor: '#52478C',
            color: '#fff',
            borderRadius: '12px',
            '&:hover': {
              backgroundColor: '#3d3568',
              color: '#fff',
            },
          }}
        >
          Ir para Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthPopup;
