import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SuccessPopup from '../../../../../../examples/Cards/SuccessPopup/SuccessPopup';
import ErrorPopup from '../../../../../../examples/Cards/ErrorPopup/index';
import ReactDOM from 'react-dom';

const ShoppingCartButton = ({ productId, quantity = 0 }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const notificationEl = document.createElement('div');
    notificationEl.id = 'notification-portal';
    notificationEl.style.position = 'fixed';
    notificationEl.style.top = '20px';
    notificationEl.style.right = '20px';
    notificationEl.style.zIndex = '9999';

    document.body.appendChild(notificationEl);

    return () => {
      const existingEl = document.getElementById('notification-portal');
      if (existingEl) {
        document.body.removeChild(existingEl);
      }
    };
  }, []);

  const addToCart = () => {
    try {
      if (quantity <= 0) {
        showNotification('error', 'Selecione um ou mais itens');
        return;
      }

      const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingProductIndex = currentCart.findIndex(
        (item) => item.productId === productId,
      );

      if (existingProductIndex >= 0) {
        // Se o produto já existe, soma a nova quantidade
        currentCart[existingProductIndex].quantity += quantity;
      } else {
        // Se não existe, adiciona novo item
        currentCart.push({
          productId,
          quantity: quantity,
          addedAt: new Date().toISOString(),
        });
      }

      localStorage.setItem('cart', JSON.stringify(currentCart));
      showNotification(
        'success',
        `Produto${quantity > 1 ? 's' : ''} adicionado${
          quantity > 1 ? 's' : ''
        } ao carrinho!`,
      );
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      showNotification('error', 'Erro ao adicionar produto ao carrinho');
    }
  };

  const renderNotification = () => {
    const portalEl = document.getElementById('notification-portal');
    if (!portalEl || !notification) return null;

    return ReactDOM.createPortal(
      notification.type === 'success' ? (
        <SuccessPopup
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      ) : (
        <ErrorPopup
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      ),
      portalEl,
    );
  };

  return (
    <>
      <Button
        variant="outlined"
        sx={{
          width: '45px',
          height: '40px',
          borderRadius: '8px',
          minWidth: 'unset',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid white',
          backgroundColor: 'transparent',
          '&:hover': {
            border: '2px solid white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
        onClick={addToCart}
      >
        <ShoppingBagIcon
          sx={{
            color: 'white',
            fontSize: '25px',
            width: '25px',
            height: '27px',
          }}
        />
      </Button>

      {renderNotification()}
    </>
  );
};

export default ShoppingCartButton;
