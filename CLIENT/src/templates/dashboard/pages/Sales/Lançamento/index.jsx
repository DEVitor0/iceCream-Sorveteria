import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPackage,
  FiTruck,
  FiX,
  FiClock,
  FiLoader,
  FiUser,
  FiMapPin,
} from 'react-icons/fi';
import VerticalMenu from '../../../components/DashboardBar/VerticalMenu/index';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar/index';
import SuccessPopup from 'examples/Cards/SuccessPopup/SuccessPopup';

// Cores principais
const colors = {
  primary: '#8C4FED',
  secondary: '#4CAF50',
  danger: '#F44336',
  background: '#F5F7FA',
  cardBackground: '#FFFFFF',
  textPrimary: '#2D3748',
  textSecondary: '#718096',
  border: '#E2E8F0',
};

// Layout principal
const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${colors.background};
  font-family: 'Poppins', sans-serif;
`;

const SidebarWrapper = styled.div`
  width: 280px; // Mesma largura do seu VerticalMenu
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 10;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const NavbarWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;
  width: 100%;
  background: ${colors.background}; // Cor do fundo da página
  padding: 15px 0; // Espaçamento vertical
`;

const NavbarContainer = styled.div`
  width: 95%;
  max-width: 1800px; // Ajuste conforme necessário
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  margin-left: 0; // Remove qualquer margem que possa interferir
  overflow-y: auto;
`;

// Estilos da vitrine de pedidos
const OrdersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const OrderCard = styled(motion.div)`
  background: ${colors.cardBackground};
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid ${colors.border};
  padding: 16px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${colors.border};
`;

const OrderTime = styled.div`
  font-size: 13px;
  color: ${colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const OrderStatus = styled.span`
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  background: ${(props) =>
    props.status === 'delivered'
      ? '#E6FFFA'
      : props.status === 'cancelled'
      ? '#FFF5F5'
      : '#EBF4FF'};
  color: ${(props) =>
    props.status === 'delivered'
      ? '#38B2AC'
      : props.status === 'cancelled'
      ? '#E53E3E'
      : colors.primary};
`;

const Section = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.primary};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 6px;
  font-size: 13px;
`;

const InfoLabel = styled.span`
  font-weight: 500;
  color: ${colors.textPrimary};
  min-width: 80px;
`;

const InfoValue = styled.span`
  color: ${colors.textSecondary};
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${colors.border};
  &:last-child {
    border-bottom: none;
  }
`;

const ProductImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 12px;
  border: 1px solid ${colors.border};
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductName = styled.div`
  font-weight: 500;
  color: ${colors.textPrimary};
  font-size: 13px;
`;

const QuantityTag = styled.span`
  background: rgba(140, 79, 237, 0.1);
  color: ${colors.primary};
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  margin-top: 4px;
  display: inline-block;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;
`;

const Button = styled(motion.button)`
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: ${colors.primary};
  color: white;

  &:hover:not(:disabled) {
    background: #7B3AED;
  }
`;

const DangerButton = styled(Button)`
  background: ${colors.danger};
  color: white;

  &:hover:not(:disabled) {
    background: #E53E3E;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: ${colors.cardBackground};
  border-radius: 12px;
  border: 1px solid ${colors.border};
  text-align: center;
  grid-column: 1 / -1;
`;

const EmptyIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(140, 79, 237, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: ${colors.primary};
`;

const EmptyTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin-bottom: 8px;
`;

const EmptyText = styled.p`
  color: ${colors.textSecondary};
  font-size: 14px;
  margin-bottom: 0;
`;

const ErrorMessage = styled.div`
  background: #FFF5F5;
  color: ${colors.danger};
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  grid-column: 1 / -1;
  border-left: 3px solid ${colors.danger};
  font-size: 14px;
`;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Primeiro obtemos o CSRF token se necessário
        if (!csrfToken) {
          const tokenResponse = await axios.get('/csrf-token', {
            withCredentials: true,
          });
          setCsrfToken(tokenResponse.data.csrfToken);
        }

        // Depois fazemos a requisição dos pedidos
        const response = await axios.get('/api/orders/completed', {
          headers: {
            'X-CSRF-Token': csrfToken,
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        });

        if (response.data.success) {
          setOrders(response.data.data || []);
        } else {
          setError(response.data.message || 'Erro ao carregar pedidos');
        }
      } catch (err) {
        console.error('Erro na requisição:', err);

        // Tratamento especial para erros CSRF
        if (err.response?.status === 403) {
          try {
            // Tenta obter novo token CSRF e recarregar
            const tokenResponse = await axios.get('/csrf-token', {
              withCredentials: true,
            });
            setCsrfToken(tokenResponse.data.csrfToken);
            fetchOrders(); // Chama a função novamente com o novo token
            return;
          } catch (tokenError) {
            console.error('Erro ao obter CSRF token:', tokenError);
          }
        }

        setError(err.response?.data?.message || 'Erro ao carregar pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [csrfToken]); // Adicione csrfToken como dependência

  const updateStatus = async (orderId, status) => {
    try {
      setUpdating((prev) => ({ ...prev, [orderId]: true }));

      const response = await axios.put(
        `/api/orders/${orderId}/status`,
        { status },
        {
          headers: {
            'X-CSRF-Token': csrfToken,
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        },
      );

      // Remove o pedido da lista apenas se for enviado (ready_for_pickup)
      if (status === 'ready_for_pickup') {
        setOrders(orders.filter((order) => order._id !== orderId));
      }

      return true; // Indica sucesso
    } catch (err) {
      console.error('Erro ao atualizar status:', err);

      // Se o erro for de CSRF inválido, tentamos novamente com um novo token
      if (
        err.response?.status === 403 &&
        err.response?.data?.code === 'EBADCSRFTOKEN'
      ) {
        try {
          const response = await axios.get('/csrf-token', {
            withCredentials: true,
          });
          setCsrfToken(response.data.csrfToken);

          // Tenta novamente com o novo token
          await axios.put(
            `/api/orders/${orderId}/status`,
            { status },
            {
              headers: {
                'X-CSRF-Token': response.data.csrfToken,
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              withCredentials: true,
            },
          );

          setOrders(
            orders.map((order) =>
              order._id === orderId
                ? { ...order, deliveryStatus: status }
                : order,
            ),
          );

          const statusText = getStatusText(status);
          setSuccessMessage(`Status atualizado para: ${statusText}`);
          setTimeout(() => setSuccessMessage(''), 3000);
        } catch (retryError) {
          setError(
            retryError.response?.data?.message || 'Erro ao atualizar status',
          );
        }
      } else {
        setError(err.response?.data?.message || 'Erro ao atualizar status');
      }
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const formatDate = (dateString) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'processing':
        return 'Em preparo';
      case 'out_for_delivery':
        return 'Em transporte';
      case 'delivered':
        return 'Entregue';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <AppContainer>
      <SidebarWrapper>
        <VerticalMenu />
      </SidebarWrapper>

      <MainContent>
        <NavbarWrapper>
          <NavbarContainer>
            <DashboardNavbar />
          </NavbarContainer>
        </NavbarWrapper>

        <ContentArea>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          {loading ? (
            <EmptyState>
              <EmptyIcon>
                <FiLoader size={24} className="spin" />
              </EmptyIcon>
              <EmptyTitle>Carregando pedidos...</EmptyTitle>
            </EmptyState>
          ) : orders.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <FiPackage size={24} />
              </EmptyIcon>
              <EmptyTitle>Nenhum pedido encontrado</EmptyTitle>
              <EmptyText>Não há pedidos para preparação no momento.</EmptyText>
            </EmptyState>
          ) : (
            <OrdersContainer>
              <AnimatePresence>
                {orders.map((order) => (
                  <OrderCard
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <OrderHeader>
                      <OrderTime>
                        <FiClock size={14} />
                        {formatDate(order.createdAt)}
                      </OrderTime>
                      <OrderStatus status={order.deliveryStatus}>
                        {getStatusText(order.deliveryStatus)}
                      </OrderStatus>
                    </OrderHeader>

                    <Section>
                      <SectionTitle>
                        <FiUser size={14} />
                        Cliente
                      </SectionTitle>
                      <InfoRow>
                        <InfoLabel>Nome:</InfoLabel>
                        <InfoValue>
                          {order.userId?.name || 'Não informado'}
                        </InfoValue>
                      </InfoRow>
                      <InfoRow>
                        <InfoLabel>Email:</InfoLabel>
                        <InfoValue>
                          {order.userId?.email || 'Não informado'}
                        </InfoValue>
                      </InfoRow>
                    </Section>

                    {order.shippingAddress && (
                      <Section>
                        <SectionTitle>
                          <FiMapPin size={14} />
                          Endereço
                        </SectionTitle>
                        <InfoRow>
                          <InfoLabel>Endereço:</InfoLabel>
                          <InfoValue>{order.shippingAddress.address}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>Cidade/UF:</InfoLabel>
                          <InfoValue>
                            {order.shippingAddress.city} -{' '}
                            {order.shippingAddress.state}
                          </InfoValue>
                        </InfoRow>
                      </Section>
                    )}

                    <Section>
                      <SectionTitle>
                        <FiPackage size={14} />
                        Itens ({order.items.length})
                      </SectionTitle>
                      {order.items.map((item, index) => (
                        <ProductItem key={index}>
                          {item.imageUrl && (
                            <ProductImage src={item.imageUrl} alt={item.name} />
                          )}
                          <ProductDetails>
                            <ProductName>{item.name}</ProductName>
                            <QuantityTag>{item.quantity} unid.</QuantityTag>
                          </ProductDetails>
                        </ProductItem>
                      ))}
                    </Section>

                    <ActionButtons>
                      {/* BOTÃO DE ENVIAR (muda para ready_for_pickup) */}
                      <PrimaryButton
                        onClick={async () => {
                          const success = await updateStatus(
                            order._id,
                            'ready_for_pickup',
                          );
                          if (success) {
                            setPopupMessage('Pedido enviado para retirada!');
                            setShowSuccessPopup(true);
                          }
                        }}
                        disabled={
                          updating[order._id] ||
                          order.deliveryStatus !== 'preparing'
                        }
                      >
                        {updating[order._id] ? (
                          <FiLoader size={14} className="spin" />
                        ) : (
                          <>
                            <FiTruck size={14} />
                            Enviar Pedido
                          </>
                        )}
                      </PrimaryButton>

                      {/* BOTÃO DE CANCELAR */}
                      <DangerButton
                        onClick={async () => {
                          const success = await updateStatus(
                            order._id,
                            'cancelled',
                          );
                          if (success) {
                            setPopupMessage('Pedido cancelado com sucesso!');
                            setShowSuccessPopup(true);
                          }
                        }}
                        disabled={
                          updating[order._id] ||
                          order.deliveryStatus !== 'preparing'
                        }
                      >
                        {updating[order._id] ? (
                          <FiLoader size={14} className="spin" />
                        ) : (
                          <>
                            <FiX size={14} />
                            Cancelar
                          </>
                        )}
                      </DangerButton>
                    </ActionButtons>
                  </OrderCard>
                ))}
              </AnimatePresence>
            </OrdersContainer>
          )}
        </ContentArea>
      </MainContent>
      {showSuccessPopup && (
        <SuccessPopup
          message={popupMessage}
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
    </AppContainer>
  );
};

export default OrdersPage;
