import React, { useEffect, useState, useRef } from 'react';
import { Button, Box } from '@mui/material';
import axios from 'axios';

const TagsNavBar = ({ selectedTag, onTagSelect }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const failedImages = useRef(new Set());

  // Mapeamento corrigido com caminhos absolutos
  const tagImages = {
    'sorvete de massa': '/image/mass.png',
    casquinha: '/image/ice-cream.png',
    picolé: '/image/navIceCream.png',
    açaí: '/image/acai.png',
    sundae: '/image/sundae.png',
    milkshake: '/image/milkshake.png',
    geladinho: '/image/toothpick.png',
    paleta: '/image/popsicle.png',
    granizado: '/image/shave.png',
  };

  // Fallback deve estar na pasta public/image
  const fallbackImage = '/image/fallback.png';

  const handleImageError = (e, tag) => {
    const img = e.target;
    const imageKey = tag.toLowerCase();

    if (failedImages.current.has(imageKey)) return;
    if (img.src === fallbackImage) return;

    failedImages.current.add(imageKey);
    img.src = fallbackImage;
    img.onerror = null;
  };

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchTags = async (retries = 3, backoff = 1000) => {
      if (!isMounted || retries <= 0) return;

      try {
        setLoading(true);
        const response = await axios.get('/tags', {
          signal: controller.signal,
          timeout: 5000,
        });

        if (isMounted) {
          setTags(response.data.tags);
          setLoading(false);
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error(`Tentativa ${4 - retries} falhou.`, error);

          if (error.response?.status === 429 && isMounted) {
            setTimeout(() => fetchTags(retries - 1, backoff * 2), backoff);
          } else {
            setLoading(false);
          }
        }
      }
    };

    fetchTags();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const getButtonStyles = (tag) => ({
    backgroundColor:
      selectedTag === tag ? '#52478C !important' : 'white !important',
    color: selectedTag === tag ? 'white !important' : '#000 !important',
    boxShadow:
      '0px 4px 12px rgba(0, 0, 0, 0.15), 0px 2px 4px rgba(0, 0, 0, 0.1) !important',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: '#52478C !important',
      color: 'white !important',
      transform: 'scale(1.05)',
      '& img': {
        filter: 'invert(1) grayscale(1) !important',
      },
    },
  });

  const getImageStyles = (tag) => ({
    width: '24px',
    height: '24px',
    filter: selectedTag === tag ? 'invert(1) grayscale(1)' : 'none',
    marginRight: '8px',
  });

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        p: 1,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {loading ? (
        <div>Carregando tags...</div>
      ) : (
        tags.map((tag, index) => {
          const imagePath =
            tagImages[tag.toLowerCase()] || '/image/ice-cream.png';

          return (
            <Button
              key={`${tag}-${index}`}
              variant="contained"
              onClick={() => onTagSelect(tag === selectedTag ? null : tag)}
              sx={getButtonStyles(tag)}
              startIcon={
                <img
                  src={imagePath}
                  alt={tag}
                  style={getImageStyles(tag)}
                  onError={(e) => handleImageError(e, tag)}
                  loading="lazy"
                />
              }
            >
              {tag}
            </Button>
          );
        })
      )}
    </Box>
  );
};

export default TagsNavBar;
