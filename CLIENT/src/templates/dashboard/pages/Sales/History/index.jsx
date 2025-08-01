import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  MenuItem,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Collapse,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  FilterList,
  Refresh,
  Person,
} from '@mui/icons-material';
import VerticalMenu from '../../../components/DashboardBar/VerticalMenu/index';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar/index';
import axios from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Estilos consistentes com o design system existente
const styles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  content: {
    flexGrow: 1,
    padding: '32px',
    width: 'calc(100% - 280px)',
  },
  container: {
    maxWidth: 'none !important',
    width: '100%',
    paddingLeft: '0 !important',
    paddingRight: '0 !important',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  title: {
    color: '#8C4FED',
    fontWeight: 700,
    fontSize: '1.75rem',
  },
  paper: {
    borderRadius: '12px',
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
    overflowX: 'auto', // Permite rolagem horizontal apenas se necessário
    width: '100%',
  },
  tableContainer: {
    maxHeight: 'calc(100vh - 300px)',
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      height: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#c0c4c6',
      borderRadius: '4px',
    },
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    '& th': {
      fontWeight: 600,
      fontSize: '0.875rem', // Tamanho do cabeçalho mantido
      color: '#555',
      padding: '12px 16px',
      borderBottom: '1px solid #e0e0e0',
      position: 'sticky',
      top: 0,
      backgroundColor: '#f5f5f5',
      zIndex: 1,
      whiteSpace: 'nowrap',
    },
  },
  tableCell: {
    padding: '12px 16px',
    verticalAlign: 'middle',
    fontSize: '0.8125rem', // Tamanho reduzido para o conteúdo
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  firstTableCell: {
    width: '10px !important', // Diminuindo a largura
    padding: '12px 0 12px 16px !important', // Removendo padding-right
    minWidth: '10px !important',
  },
  tableCellContent: {
    fontSize: '0.8125rem', // Tamanho reduzido para o conteúdo
    lineHeight: '1.5',
  },
  statusChip: {
    fontWeight: 600,
    fontSize: '0.75rem',
    padding: '4px 8px',
    borderRadius: '12px',
  },
  actionButton: {
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: '8px',
    padding: '8px 16px',
  },
  filterButton: {
    backgroundColor: '#8C4FED',
    color: 'white',
    '&:hover': {
      backgroundColor: '#7B3AED',
    },
  },
  detailBox: {
    backgroundColor: '#fafafa',
    borderRadius: '8px',
    padding: '16px',
    margin: '8px 0',
  },
  productItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #eee',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
};

const statusColors = {
  pending: { bg: '#FFF3E0', text: '#E65100' },
  processing: { bg: '#E3F2FD', text: '#1565C0' },
  completed: { bg: '#E8F5E9', text: '#2E7D32' },
  cancelled: { bg: '#FFEBEE', text: '#C62828' },
  refunded: { bg: '#F3E5F5', text: '#7B1FA2' },
  failed: { bg: '#EEEEEE', text: '#424242' },
  preparing: { bg: '#FFF8E1', text: '#FF8F00' },
  ready_for_pickup: { bg: '#E1F5FE', text: '#0277BD' },
  out_for_delivery: { bg: '#EDE7F6', text: '#4527A0' },
  delivered: { bg: '#E8F5E9', text: '#2E7D32' },
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    status: '',
    deliveryStatus: '',
    startDate: '',
    endDate: '',
  });
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.status) params.append('status', filters.status);
      if (filters.deliveryStatus)
        params.append('deliveryStatus', filters.deliveryStatus);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await axios.get(`/api/orders?${params.toString()}`);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setPage(0);
    fetchOrders();
    setFilterOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      deliveryStatus: '',
      startDate: '',
      endDate: '',
    });
    fetchOrders();
  };

  const toggleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Box sx={styles.root}>
      <VerticalMenu />

      <Box sx={styles.content}>
        <Box sx={styles.container}>
          <Box
            sx={{
              backgroundColor: '#fff !important',
              marginBottom: '15px',
              borderRadius: '10px',
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
            }}
          >
            <DashboardNavbar />
          </Box>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper elevation={0} sx={styles.paper}>
              <Box sx={{ p: 3 }}>
                <Box sx={styles.header}>
                  <Typography variant="h4" sx={styles.title}>
                    Histórico de Vendas
                  </Typography>

                  <Box display="flex" gap={2}>
                    <Button
                      startIcon={<FilterList />}
                      onClick={() => setFilterOpen(!filterOpen)}
                      variant="outlined"
                      sx={{
                        ...styles.actionButton,
                        borderColor: '#8C4FED',
                        color: '#8C4FED',
                      }}
                    >
                      Filtros
                    </Button>
                    <Button
                      startIcon={<Refresh />}
                      onClick={fetchOrders}
                      variant="contained"
                      sx={{
                        ...styles.actionButton,
                        ...styles.filterButton,
                        color: '#fff !important',
                      }}
                    >
                      Atualizar
                    </Button>
                  </Box>
                </Box>

                <Collapse in={filterOpen}>
                  <Box
                    sx={{
                      p: 2,
                      mb: 3,
                      backgroundColor: '#f9f9f9',
                      borderRadius: '12px',
                      border: '1px solid #eee',
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection={{ xs: 'column', sm: 'row' }}
                      gap={2}
                      flexWrap="wrap"
                    >
                      {/* Status do Pedido */}
                      <Box sx={{ minWidth: '180px', flex: 1 }}>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '0.75rem',
                            color: '#555',
                            marginBottom: '4px',
                            fontWeight: '500',
                          }}
                        >
                          Status do Pedido
                        </label>
                        <select
                          name="status"
                          value={filters.status}
                          onChange={handleFilterChange}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontSize: '0.875rem',
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="">Todos os status</option>
                          <option value="pending">Pendente</option>
                          <option value="processing">Processando</option>
                          <option value="completed">Completo</option>
                          <option value="cancelled">Cancelado</option>
                          <option value="refunded">Reembolsado</option>
                          <option value="failed">Falhou</option>
                        </select>
                      </Box>

                      {/* Status de Entrega */}
                      <Box sx={{ minWidth: '180px', flex: 1 }}>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '0.75rem',
                            color: '#555',
                            marginBottom: '4px',
                            fontWeight: '500',
                          }}
                        >
                          Status de Entrega
                        </label>
                        <select
                          name="deliveryStatus"
                          value={filters.deliveryStatus}
                          onChange={handleFilterChange}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontSize: '0.875rem',
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="">Todos os status</option>
                          <option value="preparing">Preparando</option>
                          <option value="ready_for_pickup">
                            Pronto para retirada
                          </option>
                          <option value="out_for_delivery">
                            Saiu para entrega
                          </option>
                          <option value="delivered">Entregue</option>
                        </select>
                      </Box>

                      {/* Data Inicial */}
                      <Box sx={{ minWidth: '180px', flex: 1 }}>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '0.75rem',
                            color: '#555',
                            marginBottom: '4px',
                            fontWeight: '500',
                          }}
                        >
                          Data Inicial
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={filters.startDate}
                          onChange={handleFilterChange}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontSize: '0.875rem',
                            backgroundColor: '#fff',
                          }}
                        />
                      </Box>

                      {/* Data Final */}
                      <Box sx={{ minWidth: '180px', flex: 1 }}>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '0.75rem',
                            color: '#555',
                            marginBottom: '4px',
                            fontWeight: '500',
                          }}
                        >
                          Data Final
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={filters.endDate}
                          onChange={handleFilterChange}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontSize: '0.875rem',
                            backgroundColor: '#fff',
                          }}
                        />
                      </Box>
                    </Box>

                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      mt={2}
                      gap={1}
                    >
                      <button
                        onClick={resetFilters}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: '1px solid #8C4FED',
                          backgroundColor: 'transparent',
                          color: '#8C4FED',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: '#f5f0ff',
                          },
                        }}
                      >
                        Limpar filtros
                      </button>
                      <button
                        onClick={applyFilters}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: '#8C4FED',
                          color: '#fff',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: '#7B3AED',
                          },
                        }}
                      >
                        Aplicar filtros
                      </button>
                    </Box>
                  </Box>
                </Collapse>

                {loading ? (
                  <Box display="flex" justifyContent="center" py={6}>
                    <CircularProgress sx={{ color: '#8C4FED' }} />
                  </Box>
                ) : (
                  <>
                    <TableContainer sx={styles.tableContainer}>
                      <Table
                        sx={{
                          minWidth: '100%',
                          tableLayout: 'fixed',
                        }}
                        stickyHeader
                      >
                        <TableHead sx={styles.tableHeader}>
                          <TableRow>
                            <TableCell sx={styles.firstTableCell} />
                            <TableCell
                              sx={{
                                width: '16%',
                                minWidth: '120px',
                                ...styles.tableCell,
                              }}
                            >
                              Pedido
                            </TableCell>
                            <TableCell
                              sx={{
                                width: '20%',
                                minWidth: '180px',
                                ...styles.tableCell,
                              }}
                            >
                              Cliente
                            </TableCell>
                            <TableCell
                              sx={{
                                width: '15%',
                                minWidth: '140px',
                                ...styles.tableCell,
                              }}
                            >
                              Data
                            </TableCell>
                            <TableCell
                              sx={{
                                width: '12%',
                                minWidth: '120px',
                                textAlign: 'right',
                                ...styles.tableCell,
                              }}
                            >
                              Valor
                            </TableCell>
                            <TableCell
                              sx={{
                                width: '15%',
                                minWidth: '140px',
                                ...styles.tableCell,
                              }}
                            >
                              Status
                            </TableCell>
                            <TableCell
                              sx={{
                                width: '15%',
                                minWidth: '140px',
                                ...styles.tableCell,
                              }}
                            >
                              Entrega
                            </TableCell>
                            <TableCell
                              sx={{
                                width: '11%',
                                minWidth: '160px',
                                ...styles.tableCell,
                              }}
                            >
                              Ações
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orders
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage,
                            )
                            .map((order) => (
                              <React.Fragment key={order._id}>
                                <TableRow hover>
                                  <TableCell sx={styles.firstTableCell}>
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        toggleExpandOrder(order._id)
                                      }
                                      sx={{
                                        color: '#8C4FED',
                                        padding: '4px', // Reduzido ainda mais se necessário
                                        '& svg': {
                                          fontSize: '1rem', // Tamanho do ícone
                                        },
                                      }}
                                    >
                                      {expandedOrder === order._id ? (
                                        <KeyboardArrowUp />
                                      ) : (
                                        <KeyboardArrowDown />
                                      )}
                                    </IconButton>
                                  </TableCell>
                                  <TableCell sx={styles.tableCell}>
                                    <Typography
                                      sx={styles.tableCellContent}
                                      fontWeight="500"
                                    >
                                      #{order._id.substring(0, 8).toUpperCase()}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={styles.tableCell}>
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      gap={1}
                                    >
                                      <Avatar
                                        sx={{
                                          width: 28,
                                          height: 28,
                                          bgcolor: '#8C4FED',
                                        }}
                                      >
                                        <Person sx={{ fontSize: '0.875rem' }} />
                                      </Avatar>
                                      <Box>
                                        <Typography
                                          sx={styles.tableCellContent}
                                          fontWeight="500"
                                        >
                                          {order.userId?.name ||
                                            'Cliente não identificado'}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          sx={{ fontSize: '0.75rem' }}
                                          color="textSecondary"
                                        >
                                          {order.userId?.email || ''}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </TableCell>
                                  <TableCell sx={styles.tableCell}>
                                    <Typography sx={styles.tableCellContent}>
                                      {formatDate(order.createdAt)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      ...styles.tableCell,
                                      textAlign: 'right',
                                    }}
                                  >
                                    <Typography
                                      sx={styles.tableCellContent}
                                      fontWeight="500"
                                    >
                                      {formatCurrency(order.totalAmount)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={styles.tableCell}>
                                    <Chip
                                      label={order.status}
                                      sx={{
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        backgroundColor:
                                          statusColors[order.status]?.bg,
                                        color: statusColors[order.status]?.text,
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell sx={styles.tableCell}>
                                    <Chip
                                      label={order.deliveryStatus}
                                      sx={{
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        backgroundColor:
                                          statusColors[order.deliveryStatus]
                                            ?.bg,
                                        color:
                                          statusColors[order.deliveryStatus]
                                            ?.text,
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell sx={styles.tableCell}>
                                    <TextField
                                      select
                                      fullWidth
                                      size="small"
                                      value={order.status}
                                      onChange={(e) =>
                                        updateOrderStatus(
                                          order._id,
                                          e.target.value,
                                        )
                                      }
                                      sx={{
                                        '& .MuiSelect-select': {
                                          padding: '6px 12px',
                                          fontSize: '0.8125rem',
                                        },
                                      }}
                                    >
                                      <MenuItem value="pending">
                                        Pendente
                                      </MenuItem>
                                      <MenuItem value="processing">
                                        Processando
                                      </MenuItem>
                                      <MenuItem value="completed">
                                        Completo
                                      </MenuItem>
                                      <MenuItem value="cancelled">
                                        Cancelado
                                      </MenuItem>
                                      <MenuItem value="refunded">
                                        Reembolsado
                                      </MenuItem>
                                    </TextField>
                                  </TableCell>
                                </TableRow>
                              </React.Fragment>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <TablePagination
                      rowsPerPageOptions={[10, 25, 50]}
                      component="div"
                      count={orders.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      labelRowsPerPage="Linhas por página:"
                      labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} de ${count}`
                      }
                      sx={{
                        '& .MuiTablePagination-toolbar': {
                          paddingLeft: 0,
                          display: 'flex',
                          flexWrap: 'nowrap',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          overflow: 'hidden',
                        },
                        '& .MuiTablePagination-selectRoot': {
                          marginRight: 1,
                          marginLeft: 1,
                        },
                        '& .MuiTablePagination-displayedRows': {
                          minWidth: '120px',
                          whiteSpace: 'nowrap',
                        },
                        '& .MuiTablePagination-actions': {
                          marginLeft: 'auto',
                        },
                        // Estilos específicos para reduzir a largura do select
                        '& .MuiInputBase-root': {
                          width: '40% !important', // Largura fixa reduzida
                        },
                        '& .MuiSelect-select': {
                          padding: '8px 26px 8px 8px !important', // Padding ajustado
                        },
                      }}
                    />
                  </>
                )}
              </Box>
            </Paper>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderHistoryPage;
