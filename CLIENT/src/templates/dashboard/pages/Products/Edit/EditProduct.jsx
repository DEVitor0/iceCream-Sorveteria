import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pencil } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import VerticalMenu from '../../../components/DashboardBar/VerticalMenu/index';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar/index';
import TagsNavBar from '../../../../../examples/Navbars/TagsNavBar/TagsNavBar';
import { debounce } from 'lodash';
import { useApi } from '../../../../../contexts/RequestCSRFToken/ApiContextCSRFToken';
import CryptoJS from 'crypto-js';

const CACHE_KEY = 'products_cache_v2';
const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

const styles = `
  .marquee-container {
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  .marquee-content {
    display: inline-block;
    white-space: nowrap;
    animation: marquee 15s linear infinite;
    padding-left: 100%;
  }

  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }
`;

const encryptData = (data) => {
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const decryptData = (encryptedData) => {
  try {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error('Erro ao descriptografar dados do cache:', error);
    return null;
  }
};

const getCachedProducts = () => {
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (!cachedData) return null;

  const parsedData = decryptData(cachedData);
  if (!parsedData) return null;

  if (new Date().getTime() > parsedData.expiration) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }

  return parsedData;
};

const setCachedProducts = (data, timestamp) => {
  const cacheData = {
    data: data,
    expiration: new Date().getTime() + CACHE_EXPIRATION_TIME,
    lastUpdated: timestamp || new Date().getTime(),
  };
  localStorage.setItem(CACHE_KEY, encryptData(cacheData));
};

const fetchProducts = debounce(async (forceUpdate = false) => {
  try {
    // Se não for forçado, verifica o cache primeiro
    if (!forceUpdate) {
      const cached = getCachedProducts();
      if (cached) {
        return { data: cached.data, fromCache: true };
      }
    }

    // Faz a requisição e armazena no cache
    const response = await axios.get('/api/Dashboard/editar-produtos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.data) {
      setCachedProducts(response.data);
    }

    return { data: response.data || [], fromCache: false };
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    // Se houver erro, tenta retornar do cache se existir
    const cached = getCachedProducts();
    if (cached) {
      return { data: cached.data, fromCache: true, error: true };
    }
    return { data: [], fromCache: false, error: true };
  }
}, 1000);

export default function EditProduct() {
  const [products, setProducts] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();
  const descriptionRefs = useRef([]);
  const apiCSRFToken = useApi();
  const [lastUpdate, setLastUpdate] = useState(0);

  const checkForUpdates = async () => {
    try {
      // Verifica a última atualização no servidor
      const response = await axios.head('/api/Dashboard/editar-produtos', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const serverLastModified = new Date(
        response.headers['last-modified'],
      ).getTime();
      const cachedData = getCachedProducts();

      // Se não tem cache ou o servidor tem dados mais recentes, força atualização
      if (!cachedData || serverLastModified > cachedData.lastUpdated) {
        const { data } = await fetchProducts(true);
        setProducts(data);
        setLastUpdate(serverLastModified);
      }
    } catch (error) {
      console.error('Erro ao verificar atualizações:', error);
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      const productsData = await fetchProducts();
      setProducts(productsData);
    };

    getProducts();
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      // Primeiro carrega do cache para exibição imediata
      const cached = getCachedProducts();
      if (cached) {
        setProducts(cached.data);
      }

      // Depois verifica se precisa atualizar
      await checkForUpdates();
    };

    loadInitialData();

    // Configura verificação periódica (a cada 2 minutos)
    const interval = setInterval(checkForUpdates, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const refreshProducts = async () => {
    const { data } = await fetchProducts(true);
    setProducts(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, csrfResponse] = await Promise.all([
          axios.get('/api/Dashboard/editar-produtos', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }),
          apiCSRFToken.get('/csrf-token'),
        ]);

        if (productsResponse.data) {
          setCachedProducts(productsResponse.data);
        }

        setProducts(productsResponse.data || []);
        setCsrfToken(csrfResponse.data.csrfToken || '');
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setProducts([]);
      }
    };

    fetchData();
  }, [apiCSRFToken]);

  useEffect(() => {
    descriptionRefs.current.forEach((ref) => {
      if (ref && ref.scrollWidth > ref.offsetWidth) {
        ref.classList.add('marquee-container');
        ref.innerHTML = `<div class="marquee-content">${ref.textContent}</div>`;
      }
    });
  }, [products]);

  const handleEditClick = (productId) => {
    navigate(`/Dashboard/cadastrar?edit=${productId}`);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `/api/Dashboard/editar-produtos${productToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'X-CSRF-Token': csrfToken,
          },
        },
      );
      const updatedProducts = products.filter(
        (product) => product._id !== productToDelete._id,
      );
      setProducts(updatedProducts);
      setCachedProducts(updatedProducts);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const filteredProducts = selectedTag
    ? (products || []).filter((product) => product.tag === selectedTag) // Ensure products is defined before filtering
    : products || []; // Fallback to an empty array if products is undefined

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <style>{styles}</style>
      <div style={{ width: '250px', flexShrink: 0 }}>
        <VerticalMenu />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            width: '95%',
            marginTop: '16px',
            padding: '10px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <DashboardNavbar />
          <TagsNavBar selectedTag={selectedTag} onTagSelect={setSelectedTag} />
        </div>

        <div style={{ flex: 1, padding: '24px' }}>
          {/* Ensure filteredProducts is defined before accessing its length */}
          {!filteredProducts || filteredProducts.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60vh',
              }}
            >
              <Typography variant="h2" color="textSecondary">
                Nenhum produto ainda cadastrado :(
              </Typography>
            </Box>
          ) : (
            <Grid
              component={motion.div}
              layout
              container
              spacing={4}
              sx={{ maxWidth: 1400, margin: '0 auto' }}
            >
              <AnimatePresence initial={false}>
                {filteredProducts.map((product, index) => (
                  <Grid
                    key={product._id}
                    size={{ xs: 12, sm: 6, md: 4 }}
                    component={motion.div}
                    layout
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{
                      type: 'spring',
                      stiffness: 100,
                      damping: 20,
                      duration: 0.3,
                    }}
                  >
                    <Card
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        gap: 2,
                        padding: 3,
                        height: 200,
                        width: '100%',
                        overflow: 'hidden',
                      }}
                      component={motion.div}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Avatar
                        src={product.webImageUrl || product.imageUrl}
                        alt={product.name}
                        sx={{ width: 100, height: 100, borderRadius: 2 }}
                      />
                      <CardContent
                        sx={{
                          flex: 1,
                          padding: '0 !important',
                          minWidth: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{
                            pr: 10,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.5,
                            flex: 1,
                          }}
                        >
                          {product.description}
                        </Typography>
                        <div style={{ marginTop: 'auto' }}>
                          <Typography
                            variant="body1"
                            color="success.main"
                            fontWeight="bold"
                          >
                            R$ {product.price?.toFixed(2) || '0.00'}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              bgcolor: 'grey.200',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              display: 'inline-block',
                              mt: 1,
                            }}
                          >
                            {product.tag}
                          </Typography>
                        </div>
                      </CardContent>
                      <motion.div
                        style={{
                          position: 'absolute',
                          right: 16,
                          top: 16,
                          display: 'flex',
                          gap: 4,
                        }}
                      >
                        <IconButton
                          onClick={() => handleEditClick(product._id)}
                        >
                          <Pencil className="text-blue-500" />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(product)}>
                          <DeleteIcon className="text-red-500" />
                        </IconButton>
                      </motion.div>
                    </Card>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </div>
      </div>

      {/* Diálogo de Confirmação de Exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 24,
            backgroundColor: 'background.paper',
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            backgroundColor: '#8C4FED',
            color: 'white !important',
            py: 2,
          }}
        >
          Excluir Produto
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              mt: 2,
            }}
          >
            <Avatar
              src={productToDelete?.webImageUrl || productToDelete?.imageUrl}
              alt={productToDelete?.name}
              sx={{ width: 120, height: 120, borderRadius: 2 }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                {productToDelete?.name}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Tem certeza que deseja excluir este produto? Esta ação não pode
                ser desfeita.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{
              color: 'text.primary',
              borderColor: 'text.primary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{
              backgroundColor: 'error.main',
              color: '#fff',
              '&:hover': {
                backgroundColor: 'error.dark',
              },
            }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
