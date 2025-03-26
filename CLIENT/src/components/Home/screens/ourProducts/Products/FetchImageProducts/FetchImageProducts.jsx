import React from 'react';

const FetchImageProducts = ({ imageUrl }) => {
  return (
    <div
      style={{
        width: '220px',
        height: '220px',
        borderRadius: '15px',
        overflow: 'hidden',
      }}
    >
      <img
        src={imageUrl}
        alt="Produto"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};

export default FetchImageProducts;
