import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import VerticalMenu from '../../../components/DashboardBar/VerticalMenu/index';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styled, { createGlobalStyle } from 'styled-components';
import {
  Search as SearchIcon,
  Email as EmailIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon,
  Sort as SortIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Home as HomeIcon,
  LocalShipping as LocalShippingIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';

const Notification = styled(motion.div)`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background-color: #38a169;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1000;

  .MuiSvgIcon-root {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Poppins', sans-serif;
  }
`;

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
`;

const ContentArea = styled(motion.div)`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #718096;
  margin-bottom: 2rem;
`;

const Input = styled.div`
  position: relative;
  width: 100%;

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.9rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #4299e1;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
    }
  }

  .MuiSvgIcon-root {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    color: #a0aec0;
  }
`;

const Select = styled.div`
  position: relative;

  select {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.9rem;
    appearance: none;
    background-color: white;
    padding-right: 2.5rem;

    &:focus {
      outline: none;
      border-color: #4299e1;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
    }
  }

  .MuiSvgIcon-root {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    pointer-events: none;
    color: #a0aec0;
  }
`;

const DatePickerWrapper = styled.div`
  position: relative;

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: #4299e1;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
    }
  }

  .MuiSvgIcon-root {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    color: #a0aec0;
  }
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  .MuiSvgIcon-root {
    width: 1rem;
    height: 1rem;
  }

  &.primary {
    background-color: #4299e1;
    color: white;
    border: none;

    &:hover {
      background-color: #3182ce;
      transform: translateY(-1px);
    }
  }

  &.secondary {
    background-color: white;
    color: #4299e1;
    border: 1px solid #4299e1;

    &:hover {
      background-color: #ebf8ff;
      transform: translateY(-1px);
    }
  }

  &.ghost {
    background-color: transparent;
    color: #4a5568;
    border: none;

    &:hover {
      background-color: #edf2f7;
      transform: translateY(-1px);
    }
  }
`;

const TableContainer = styled.div`
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: #f8fafc;

  th {
    padding: 1.2rem;
    text-align: left;
    font-size: 0.8rem;
    font-weight: 600;
    color: #718096;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #e2e8f0;

    &:first-child {
      padding-left: 2rem;
    }

    &:last-child {
      padding-right: 2rem;
    }
  }
`;

const TableRow = styled(motion.tr)`
  &:hover {
    background-color: #f8fafc;
  }

  td {
    padding: 1.2rem;
    border-bottom: 1px solid #edf2f7;
    font-size: 0.9rem;
    color: #4a5568;

    &:first-child {
      padding-left: 2rem;
    }

    &:last-child {
      padding-right: 2rem;
    }
  }

  &:last-child td {
    border-bottom: none;
  }
`;

const Avatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: ${(props) => props.color || '#e2e8f0'};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-right: 1rem;
  color: white;
  font-weight: 600;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .MuiSvgIcon-root {
    width: 24px;
    height: 24px;
  }
`;

const UserCell = styled.td`
  display: flex;
  align-items: center;

  div {
    display: flex;
    flex-direction: column;

    strong {
      font-weight: 500;
      color: #2d3748;
    }

    span {
      font-size: 0.8rem;
      color: #718096;
    }
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;

  .MuiSvgIcon-root {
    width: 14px;
    height: 14px;
  }

  &.completed {
    background-color: #f0fff4;
    color: #38a169;
    border: 1px solid #c6f6d5;
  }

  &.processing {
    background-color: #fffaf0;
    color: #dd6b20;
    border: 1px solid #feebc8;
  }

  &.cancelled {
    background-color: #fff5f5;
    color: #e53e3e;
    border: 1px solid #fed7d7;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.9rem;
    color: #718096;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: #718096;
    padding: 0.5rem;
    border-radius: 50%;

    .MuiSvgIcon-root {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 2fr;
  }
`;

const InfoCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;

  h3 {
    font-size: 0.875rem;
    color: #718096;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .MuiSvgIcon-root {
      width: 1rem;
      height: 1rem;
    }
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;

  ${Avatar} {
    width: 64px;
    height: 64px;
    font-size: 1.5rem;
  }

  div {
    h4 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 0.25rem;
    }

    p {
      font-size: 0.9rem;
      color: #718096;
    }
  }
`;

const AddressCard = styled.div`
  padding: 1rem;
  border-left: 4px solid #4299e1;
  margin-bottom: 1rem;
  background-color: #f8fafc;
  border-radius: 8px;

  p {
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:first-child {
      font-weight: 500;
      color: #2d3748;
    }

    &:not(:first-child) {
      color: #718096;
    }

    .MuiSvgIcon-root {
      width: 1rem;
      height: 1rem;
      color: #a0aec0;
    }
  }

  span {
    font-size: 0.75rem;
    color: #a0aec0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;

    .MuiSvgIcon-root {
      width: 0.8rem;
      height: 0.8rem;
    }
  }
`;

const OrderCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;

  div {
    h5 {
      font-size: 1rem;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    p {
      font-size: 0.8rem;
      color: #718096;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .MuiSvgIcon-root {
      width: 1rem;
      height: 1rem;
    }
  }
`;

const OrderItem = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 1.2rem;
  border-bottom: 1px solid #edf2f7;

  &:last-child {
    border-bottom: none;
  }

  > div {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: #4a5568;

    ${Avatar} {
      width: 44px;
      height: 40px;
      border-radius: 6px;
      margin-right: 1rem;
    }
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9rem;
  min-height: 150px;
  margin-top: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }
`;

const ModalFooter = styled.div`
  padding: 1.2rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;

  &:after {
    content: "";
    width: 40px;
    height: 40px;
    border: 4px solid #e2e8f0;
    border-top-color: #4299e1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;

  .MuiSvgIcon-root {
    width: 48px;
    height: 48px;
    color: #cbd5e0;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    color: #718096;
  }
`;

// Função para gerar cor a partir da string
const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

// Componente Avatar do usuário
const UserAvatar = ({ user, size = 43 }) => {
  if (user?.photo) {
    return (
      <Avatar style={{ width: 44, height: 40 }}>
        <img src={user.photo} alt={user.fullName} />
      </Avatar>
    );
  }

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  const bgColor = stringToColor(user?.fullName || 'User');

  return (
    <Avatar color={bgColor} style={{ width: size, height: size }}>
      {size > 40 ? <PersonIcon /> : initials}
    </Avatar>
  );
};

const ClientAdminDashboard = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({ subject: '', message: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [csrfToken, setCsrfToken] = useState(''); // Estado para o token CSRF
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    sortBy: 'createdAt',
  });

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('/csrf-token', {
        withCredentials: true,
      });
      return response.data.csrfToken;
    } catch (error) {
      console.error('Erro ao buscar CSRF token:', error);
      return null;
    }
  };

  // Buscar token CSRF ao montar o componente
  useEffect(() => {
    const getCsrfToken = async () => {
      const token = await fetchCsrfToken();
      if (token) setCsrfToken(token);
    };
    getCsrfToken();
  }, []);

  // Buscar todos os clientes (atualizado com CSRF)
  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/clients', {
        headers: {
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });
      setClients(response.data.data);
      setFilteredClients(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      setLoading(false);
    }
  };

  // Buscar detalhes do cliente
  const fetchClientDetails = async (userId) => {
    try {
      const response = await axios.get(`/api/admin/clients/${userId}`, {
        headers: {
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });
      setSelectedClient(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do cliente:', error);
    }
  };

  // Enviar email
  const sendEmailToClient = async () => {
    try {
      if (!csrfToken) {
        const newToken = await fetchCsrfToken();
        if (!newToken) throw new Error('Falha ao obter token CSRF');
        setCsrfToken(newToken);
      }

      await axios.post(
        '/api/admin/clients/send-email',
        {
          userId: selectedClient.user._id,
          subject: emailData.subject,
          message: emailData.message,
        },
        {
          headers: {
            'X-CSRF-Token': csrfToken,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );

      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);

      setShowEmailModal(false);
      setEmailData({ subject: '', message: '' });
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    }
  };

  // Aplicar filtros
  const applyFilters = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('sortBy', filters.sortBy);
      params.append('sortOrder', 'desc');

      const response = await axios.get(
        `/api/admin/clients/search?${params.toString()}`,
        {
          headers: {
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        },
      );
      setFilteredClients(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao filtrar clientes:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, searchTerm]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <>
      <GlobalStyle />
      <DashboardContainer>
        <VerticalMenu />

        <ContentArea
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Cabeçalho */}
          <div>
            <Title>Gerenciamento de Clientes</Title>
            <Subtitle>
              Visualize e gerencie todos os clientes do sistema
            </Subtitle>
          </div>

          {/* Filtros */}
          <Card
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              <Input>
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Buscar por nome ou email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Input>

              <DatePickerWrapper>
                <CalendarIcon />
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters({ ...filters, startDate: e.target.value })
                  }
                />
              </DatePickerWrapper>

              <DatePickerWrapper>
                <CalendarIcon />
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters({ ...filters, endDate: e.target.value })
                  }
                  min={filters.startDate}
                />
              </DatePickerWrapper>

              <Select>
                <SortIcon />
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value })
                  }
                >
                  <option value="createdAt">Data de cadastro</option>
                  <option value="fullName">Nome</option>
                  <option value="lastLogin">Último login</option>
                </select>
              </Select>
            </div>
          </Card>

          {/* Tabela de clientes */}
          <Card
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {loading ? (
              <LoadingSpinner />
            ) : filteredClients.length === 0 ? (
              <EmptyState>
                <InfoIcon />
                <p>Nenhum cliente encontrado</p>
              </EmptyState>
            ) : (
              <TableContainer>
                <Table>
                  <TableHeader>
                    <tr>
                      <th>Cliente</th>
                      <th>Email</th>
                      <th>Último login</th>
                      <th>Data cadastro</th>
                      <th style={{ textAlign: 'right' }}>Ações</th>
                    </tr>
                  </TableHeader>
                  <tbody>
                    <AnimatePresence>
                      {filteredClients.map((client) => (
                        <TableRow
                          key={client._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <UserCell>
                            <UserAvatar user={client} />
                            <div>
                              <strong>{client.fullName}</strong>
                              <span>{client.role}</span>
                            </div>
                          </UserCell>
                          <td>{client.email}</td>
                          <td>{formatDate(client.lastLogin)}</td>
                          <td>{formatDate(client.createdAt)}</td>
                          <td style={{ textAlign: 'right' }}>
                            <Button
                              className="ghost"
                              onClick={() => fetchClientDetails(client._id)}
                            >
                              <InfoIcon /> Detalhes
                            </Button>
                            <Button
                              className="secondary"
                              onClick={() => {
                                setSelectedClient({ user: client });
                                setShowEmailModal(true);
                              }}
                              style={{ marginLeft: '0.5rem' }}
                            >
                              <EmailIcon /> Email
                            </Button>
                          </td>
                        </TableRow>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </ContentArea>

        <AnimatePresence>
          {selectedClient && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClient(null)}
            >
              <ModalContent
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ModalHeader>
                  <div>
                    <h2>Detalhes do Cliente</h2>
                    <p>Informações completas e histórico de compras</p>
                  </div>
                  <button onClick={() => setSelectedClient(null)}>
                    <CloseIcon />
                  </button>
                </ModalHeader>
                <ModalBody>
                  <Grid>
                    <InfoCard>
                      <h3>
                        <InfoIcon /> Informações Pessoais
                      </h3>
                      <UserInfo>
                        <UserAvatar user={selectedClient?.user} size={64} />
                        <div>
                          <h4>{selectedClient?.user?.fullName}</h4>
                          <p>{selectedClient?.user?.email}</p>
                        </div>
                      </UserInfo>
                      <div>
                        <p>
                          <strong>Cadastrado em:</strong>{' '}
                          {formatDate(selectedClient?.user?.createdAt)}
                        </p>
                        <p>
                          <strong>Último login:</strong>{' '}
                          {selectedClient?.user?.lastLogin
                            ? format(
                                parseISO(selectedClient.user.lastLogin),
                                'dd/MM/yyyy HH:mm',
                                { locale: ptBR },
                              )
                            : 'Nunca'}
                        </p>
                      </div>
                    </InfoCard>

                    <InfoCard>
                      <h3>
                        <HomeIcon /> Endereço Principal
                      </h3>
                      {selectedClient?.user?.addresses?.[0] ? (
                        <AddressCard>
                          <p>
                            <LocalShippingIcon />{' '}
                            {selectedClient.user.addresses[0].logradouro},{' '}
                            {selectedClient.user.addresses[0].numero}
                          </p>
                          <p>
                            {selectedClient.user.addresses[0].bairro} -
                            {selectedClient.user.addresses[0].cidade}/
                            {selectedClient.user.addresses[0].estado}
                          </p>
                          {selectedClient.user.addresses[0].cep && (
                            <span>
                              <PaymentIcon /> Complemento:{' '}
                              {selectedClient.user.addresses[0].complemento}
                            </span>
                          )}
                        </AddressCard>
                      ) : (
                        <p>Nenhum endereço cadastrado</p>
                      )}
                    </InfoCard>
                  </Grid>

                  <h3
                    style={{
                      marginBottom: '1.5rem',
                      fontSize: '0.875rem',
                      color: '#718096',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <ShoppingCartIcon /> Histórico de Compras
                  </h3>

                  {selectedClient?.orders?.length > 0 ? (
                    selectedClient.orders.map((order) => (
                      <OrderCard key={order._id}>
                        <OrderHeader>
                          <div>
                            <h5>Pedido #{order.orderNumber}</h5>
                            <p>{formatDate(order.createdAt)}</p>
                          </div>
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <span
                              style={{ marginRight: '1rem', fontWeight: '600' }}
                            >
                              Total: R$ {order.totalAmount.toFixed(2)}
                            </span>
                            <StatusBadge className={order.status}>
                              {order.status === 'completed'
                                ? 'Concluído'
                                : order.status === 'cancelled'
                                ? 'Cancelado'
                                : 'Processando'}
                            </StatusBadge>
                          </div>
                        </OrderHeader>
                        <div
                          style={{
                            padding: '0.8rem 1.2rem',
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr 1fr',
                            fontSize: '0.75rem',
                            color: '#718096',
                            fontWeight: '600',
                            backgroundColor: '#f8fafc',
                          }}
                        >
                          <div>Produto</div>
                          <div>Preço</div>
                          <div>Quantidade</div>
                          <div>Subtotal</div>
                        </div>
                        {order.items.map((item) => (
                          <OrderItem key={item._id}>
                            <div>
                              <Avatar>
                                <img
                                  src={
                                    item.productId.images[0] ||
                                    '/default-product.png'
                                  }
                                  alt={item.productId.name}
                                />
                              </Avatar>
                              {item.productId.name}
                            </div>
                            <div>R$ {item.price.toFixed(2)}</div>
                            <div>{item.quantity}</div>
                            <div>
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </div>
                          </OrderItem>
                        ))}
                      </OrderCard>
                    ))
                  ) : (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '2rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px dashed #e2e8f0',
                      }}
                    >
                      <p>Nenhum pedido encontrado</p>
                    </div>
                  )}
                </ModalBody>
              </ModalContent>
            </ModalOverlay>
          )}
        </AnimatePresence>

        {/* Modal de envio de email */}
        <AnimatePresence>
          {showEmailModal && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEmailModal(false)}
            >
              <ModalContent
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '500px' }}
              >
                <ModalHeader>
                  <div>
                    <h2>Enviar Email</h2>
                    <p>
                      Para: {selectedClient?.user?.fullName} (
                      {selectedClient?.user?.email})
                    </p>
                  </div>
                  <button onClick={() => setShowEmailModal(false)}>
                    <CloseIcon />
                  </button>
                </ModalHeader>
                <ModalBody>
                  <Input style={{ marginBottom: '1rem' }}>
                    <EmailIcon />
                    <input
                      type="text"
                      placeholder="Assunto"
                      value={emailData.subject}
                      onChange={(e) =>
                        setEmailData({ ...emailData, subject: e.target.value })
                      }
                    />
                  </Input>
                  <TextArea
                    placeholder="Mensagem"
                    value={emailData.message}
                    onChange={(e) =>
                      setEmailData({ ...emailData, message: e.target.value })
                    }
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="ghost"
                    onClick={() => setShowEmailModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button className="primary" onClick={sendEmailToClient}>
                    <EmailIcon /> Enviar Email
                  </Button>
                </ModalFooter>
              </ModalContent>
            </ModalOverlay>
          )}
        </AnimatePresence>
      </DashboardContainer>
      <AnimatePresence>
        {showNotification && (
          <Notification
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <EmailIcon />
            <span>Email enviado com sucesso!</span>
          </Notification>
        )}
      </AnimatePresence>
    </>
  );
};

export default ClientAdminDashboard;
