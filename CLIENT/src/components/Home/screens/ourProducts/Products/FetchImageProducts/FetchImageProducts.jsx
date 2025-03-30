import React, { useState } from 'react';

const FetchImageProducts = ({ imageUrl }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      style={{
        width: '220px',
        height: '220px',
        borderRadius: '15px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: loaded ? 'transparent' : '#f5f5f5',
      }}
    >
      <img
        src={imageUrl}
        alt="Produto"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        onLoad={() => setLoaded(true)}
        loading="lazy" // Adiciona lazy loading
      />
    </div>
  );
};

export default FetchImageProducts;
