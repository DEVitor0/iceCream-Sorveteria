import React, { useState, useEffect } from 'react';
import VerticalMenu from '../../../components/DashboardBar/VerticalMenu/index';
import { fetchCsrfToken } from '../../../../../utils/csrf/csurfValidation';
import styled from 'styled-components';

// Componentes estilizados com Styled Components
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Inter', sans-serif;
`;

const Content = styled.div`
  flex: 1;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #7b3aed;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  flex: 1;
  min-width: 250px;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #7b3aed;
    box-shadow: 0 0 0 2px rgba(123, 58, 237, 0.2);
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #7b3aed;
    box-shadow: 0 0 0 2px rgba(123, 58, 237, 0.2);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const TableHeader = styled.th`
  background-color: #f9f5ff;
  text-align: left;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  color: #7b3aed;
  font-weight: 600;
  position: sticky;
  top: 0;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  background-color: ${(props) => {
    switch (props.role) {
      case 'admin':
        return '#f0e7ff';
      case 'moder':
        return '#e3f2fd';
      default:
        return '#e8f5e9';
    }
  }};
  color: ${(props) => {
    switch (props.role) {
      case 'admin':
        return '#7b3aed';
      case 'moder':
        return '#1976d2';
      default:
        return '#2e7d32';
    }
  }};
`;

const RoleSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: white;
  color: #333;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #7b3aed;
  }
`;

const SaveButton = styled.button`
  background-color: #7b3aed;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-left: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;

  &:hover {
    background-color: #6a2ed6;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid #e0e0e0;
  background-color: ${(props) => (props.active ? '#7b3aed' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#333')};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.active ? '#7b3aed' : '#f9f5ff')};
    border-color: ${(props) => (props.active ? '#7b3aed' : '#d1c4e9')};
  }
`;

const StatusMessage = styled.p`
  margin: 1rem 0;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;

  &.loading {
    background-color: #fff8e1;
    color: #ff8f00;
  }

  &.error {
    background-color: #ffebee;
    color: #c62828;
  }

  &.success {
    background-color: #e8f5e9;
    color: #2e7d32;
  }
`;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    page: 1,
    limit: 10,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [editingRoles, setEditingRoles] = useState({});

  // Obter CSRF Token
  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const token = await fetchCsrfToken();
        if (token) setCsrfToken(token);
      } catch (err) {
        console.error('Erro ao obter CSRF token:', err);
        setError('Falha na segurança. Recarregue a página.');
      }
    };
    getCsrfToken();
  }, []);

  // Buscar usuários
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/users?${queryParams.toString()}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': csrfToken,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar usuários');
      }

      const data = await response.json();
      setUsers(data.data);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      setError(err.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters, csrfToken]);

  // Atualizar role do usuário
  const updateUserRole = async (userId) => {
    if (!editingRoles[userId]) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!csrfToken) {
        const newToken = await fetchCsrfToken();
        if (!newToken) throw new Error('Falha ao obter token de segurança');
        setCsrfToken(newToken);
      }

      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': csrfToken,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: editingRoles[userId] }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar role do usuário');
      }

      const updatedUser = await response.json();

      setUsers(
        users.map((user) => (user._id === userId ? updatedUser.data : user)),
      );

      // Limpar estado de edição para este usuário
      setEditingRoles((prev) => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao atualizar role:', err);
      setError(err.message || 'Erro ao atualizar role do usuário');
    } finally {
      setLoading(false);
    }
  };

  // Manipuladores de eventos
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleRoleChange = (userId, value) => {
    setEditingRoles((prev) => ({ ...prev, [userId]: value }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <Container>
      <VerticalMenu />

      <Content>
        <Header>
          <Title>Gerenciamento de Usuários</Title>
        </Header>

        <Card>
          <FilterContainer>
            <FilterInput
              type="text"
              name="search"
              placeholder="Buscar por nome ou email..."
              value={filters.search}
              onChange={handleFilterChange}
            />

            <FilterSelect
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
            >
              <option value="">Todas as Roles</option>
              <option value="user">User</option>
              <option value="moder">Moderador</option>
              <option value="admin">Admin</option>
            </FilterSelect>
          </FilterContainer>

          {loading && (
            <StatusMessage className="loading">
              Carregando usuários...
            </StatusMessage>
          )}
          {error && <StatusMessage className="error">{error}</StatusMessage>}
          {success && (
            <StatusMessage className="success">
              Role atualizada com sucesso!
            </StatusMessage>
          )}

          <Table>
            <thead>
              <tr>
                <TableHeader>Nome</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Ações</TableHeader>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <TableCell>{user.fullName || 'N/A'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {editingRoles[user._id] ? (
                      <RoleSelect
                        value={editingRoles[user._id]}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                      >
                        <option value="user">User</option>
                        <option value="moder">Moderador</option>
                        <option value="admin">Admin</option>
                      </RoleSelect>
                    ) : (
                      <RoleBadge role={user.role}>{user.role}</RoleBadge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRoles[user._id] ? (
                      <SaveButton onClick={() => updateUserRole(user._id)}>
                        <span>Salvar</span>
                      </SaveButton>
                    ) : (
                      <SaveButton
                        onClick={() => handleRoleChange(user._id, user.role)}
                        style={{ backgroundColor: '#f0f0f0', color: '#333' }}
                      >
                        <span>Editar</span>
                      </SaveButton>
                    )}
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <Pagination>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PageButton
                    key={page}
                    onClick={() => handlePageChange(page)}
                    active={filters.page === page}
                  >
                    {page}
                  </PageButton>
                ),
              )}
            </Pagination>
          )}
        </Card>
      </Content>
    </Container>
  );
};

export default UserManagement;
