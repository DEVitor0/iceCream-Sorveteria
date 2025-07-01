import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';

// @mui material components
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LinearProgress from '@mui/material/LinearProgress';

// Soft UI Dashboard React components
import SoftBox from '../../../../components/Dashboard/SoftBox';
import SoftTypography from '../../../../components/Dashboard/SoftTypography';

// Componente estilizado para células de status
const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  fontSize: '0.75rem',
  padding: '4px 12px',
  borderRadius: '12px',
  backgroundColor:
    status === 'Concluído'
      ? 'rgba(93, 208, 158, 0.2)'
      : status === 'Pendente'
      ? 'rgba(255, 193, 7, 0.2)'
      : status === 'Cancelado'
      ? 'rgba(255, 76, 81, 0.2)'
      : 'rgba(93, 80, 158, 0.1)',
  color:
    status === 'Concluído'
      ? '#5dd09e'
      : status === 'Pendente'
      ? '#ffc107'
      : status === 'Cancelado'
      ? '#ff4c51'
      : '#5d509e',
}));

// Componentes estilizados para a tabela
const CustomTableContainer = styled('div')({
  width: '100%',
  overflowX: 'auto',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  borderRadius: '12px',
  marginTop: '16px',
});

const CustomTable = styled('table')({
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '600px',
});

const CustomTableHead = styled('thead')({
  backgroundColor: 'rgba(93, 80, 158, 0.03)',
  position: 'sticky',
  top: 0,
  zIndex: 1,
});

const CustomTableRow = styled('tr')({
  '&:nth-of-type(even)': {
    backgroundColor: 'rgba(93, 80, 158, 0.02)',
  },
  '&:hover': {
    backgroundColor: 'rgba(93, 80, 158, 0.05) !important',
  },
});

const CustomTableCell = styled('td')(({ align }) => ({
  padding: '8px 12px',
  textAlign: align || 'left',
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  verticalAlign: 'middle',
  fontSize: '0.875rem',
  fontFamily: "'Roboto', sans-serif",
}));

const CustomTableHeaderCell = styled('th')(({ align }) => ({
  padding: '12px',
  textAlign: align || 'left',
  fontWeight: '600 !important',
  fontSize: '0.75rem !important',
  textTransform: 'uppercase',
  color: '#5d509e !important',
  letterSpacing: '0.5px',
  fontFamily: "'Roboto', sans-serif",
}));

function Projects() {
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Calcula a data de 24 horas atrás
        const twentyFourHoursAgo = new Date(
          Date.now() - 24 * 60 * 60 * 1000,
        ).toISOString();

        const response = await axios.get('/api/orders', {
          params: {
            status: 'completed',
            sort: 'createdAt:desc',
            limit: 5, // Limita a 5 pedidos
            createdAt_gte: twentyFourHoursAgo, // Filtra pedidos das últimas 24 horas
          },
        });

        if (response.data && response.data.success && response.data.data) {
          // Filtra novamente no cliente para garantir (caso a API não respeite o filtro)
          const filteredOrders = response.data.data.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= new Date(twentyFourHoursAgo);
          });

          setOrders(filteredOrders.slice(0, 5)); // Garante no máximo 5 pedidos
        } else {
          setError('Formato de dados inesperado da API');
        }
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        setError('Erro ao carregar pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: '12px',
          padding: '8px 0',
          boxShadow: '0 10px 30px -5px rgba(93, 80, 158, 0.2)',
        },
      }}
    >
      <MenuItem
        onClick={() => {
          window.location.reload();
          closeMenu();
        }}
        sx={{
          '&:hover': {
            backgroundColor: '#5d509e15',
            color: '#5d509e',
          },
        }}
      >
        <Icon sx={{ mr: 1 }}>refresh</Icon> Atualizar
      </MenuItem>
      <MenuItem
        onClick={closeMenu}
        sx={{
          '&:hover': {
            backgroundColor: '#5d509e15',
            color: '#5d509e',
          },
        }}
      >
        <Icon sx={{ mr: 1 }}>download</Icon> Exportar
      </MenuItem>
    </Menu>
  );

  // Estrutura da tabela
  const tableColumns = [
    {
      name: 'Número',
      align: 'left',
      icon: 'tag',
      key: 'orderNumber',
      width: '120px',
    },
    {
      name: 'Cliente',
      align: 'left',
      icon: 'person',
      key: 'customer',
      width: '200px',
    },
    {
      name: 'Valor Total',
      align: 'center',
      icon: 'attach_money',
      key: 'totalAmount',
      width: '120px',
    },
    {
      name: 'Status',
      align: 'center',
      icon: 'hourglass_empty',
      key: 'status',
      width: '120px',
    },
    {
      name: 'Data/Hora',
      align: 'center',
      icon: 'schedule',
      key: 'createdAt',
      width: '180px',
    },
  ];

  const tableRows = useMemo(() => {
    return orders.map((order) => ({
      orderNumber: order.orderNumber ? `#${order.orderNumber}` : 'N/A',
      customer: order.customer?.name || 'N/A',
      totalAmount: order.totalAmount
        ? `R$ ${order.totalAmount.toFixed(2).replace('.', ',')}`
        : 'N/A',
      status: order.status || 'N/A',
      createdAt: order.createdAt
        ? new Date(order.createdAt).toLocaleString('pt-BR')
        : 'N/A',
    }));
  }, [orders]);

  if (loading) {
    return (
      <Card
        sx={{
          borderRadius: '16px',
          boxShadow: '0 10px 30px -5px rgba(93, 80, 158, 0.2)',
        }}
      >
        <SoftBox p={3}>
          <SoftTypography variant="h6">Carregando pedidos...</SoftTypography>
          <LinearProgress
            color="secondary"
            sx={{
              height: '4px',
              borderRadius: '4px',
              background: 'rgba(93, 80, 158, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#5d509e',
              },
            }}
          />
        </SoftBox>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        sx={{
          borderRadius: '16px',
          boxShadow: '0 10px 30px -5px rgba(93, 80, 158, 0.2)',
        }}
      >
        <SoftBox p={3}>
          <SoftTypography variant="h6" color="error">
            <Icon sx={{ verticalAlign: 'middle', mr: 1 }}>error</Icon>
            {error}
          </SoftTypography>
        </SoftBox>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px -5px rgba(93, 80, 158, 0.2)',
      }}
    >
      <SoftBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={3}
        sx={{
          background: 'linear-gradient(135deg, #5d509e 0%, #7a6bb8 100%)',
          color: 'white',
        }}
      >
        <SoftBox>
          <SoftTypography variant="h6" gutterBottom color="white">
            Últimos Pedidos (24h)
          </SoftTypography>
          <SoftBox display="flex" alignItems="center" lineHeight={0}>
            <Icon
              sx={{
                fontWeight: 'bold !important',
                color: 'white !important',
                mt: -0.5,
              }}
            >
              receipt
            </Icon>
            <SoftTypography variant="button" fontWeight="regular" color="white">
              &nbsp;<strong>{orders.length} pedidos</strong>
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        <SoftBox color="white" px={2}>
          <Icon
            sx={{
              cursor: 'pointer',
              fontWeight: 'bold',
              color: 'white !important',
            }}
            fontSize="small"
            onClick={openMenu}
          >
            more_vert
          </Icon>
        </SoftBox>
        {renderMenu}
      </SoftBox>

      <SoftBox p={2}>
        {orders.length > 0 ? (
          <CustomTableContainer>
            <CustomTable>
              <CustomTableHead>
                <tr>
                  {tableColumns.map((column) => (
                    <CustomTableHeaderCell
                      key={column.key}
                      align={column.align}
                      style={{ width: column.width }}
                    >
                      <SoftBox display="flex" alignItems="center">
                        {column.icon && (
                          <Icon
                            sx={{
                              fontSize: '1.5rem !important',
                              mr: 1,
                              opacity: 0.8,
                            }}
                          >
                            {column.icon}
                          </Icon>
                        )}
                        {column.name}
                      </SoftBox>
                    </CustomTableHeaderCell>
                  ))}
                </tr>
              </CustomTableHead>
              <tbody>
                {tableRows.map((row, index) => (
                  <CustomTableRow key={`row-${index}`}>
                    {tableColumns.map((column) => (
                      <CustomTableCell
                        key={`${column.key}-${index}`}
                        align={column.align}
                      >
                        {column.key === 'status' ? (
                          <StatusChip
                            label={row[column.key]}
                            status={row[column.key]}
                          />
                        ) : (
                          <SoftTypography
                            variant="button"
                            sx={{
                              fontSize: '0.8125rem',
                              fontFamily: "'Roboto', sans-serif !important",
                            }}
                          >
                            {row[column.key]}
                          </SoftTypography>
                        )}
                      </CustomTableCell>
                    ))}
                  </CustomTableRow>
                ))}
              </tbody>
            </CustomTable>
          </CustomTableContainer>
        ) : (
          <SoftBox p={3} textAlign="center">
            <Icon
              sx={{ fontSize: '3rem', color: 'rgba(93, 80, 158, 0.3)', mb: 1 }}
            >
              assignment
            </Icon>
            <SoftTypography variant="body2" color="text">
              Nenhum pedido encontrado nas últimas 24 horas
            </SoftTypography>
          </SoftBox>
        )}
      </SoftBox>
    </Card>
  );
}

export default Projects;
