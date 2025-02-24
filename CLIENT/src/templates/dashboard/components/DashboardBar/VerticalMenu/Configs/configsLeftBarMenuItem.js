const dataLeftBarMenuItem = {
  dashboard: {
    text: 'Dashboard',
    icon: 'houseChimney',
  },
  categories: {
    Products: {
      text: 'Produtos',
      icon: 'bagShopping',
      actions: {
        Register: { text: 'Cadastrar' },
        Edit: { text: 'Editar' },
        Delete: { text: 'Excluir' },
        Organize: { text: 'Organizar' },
      },
    },
    Sales: {
      text: 'Vendas',
      icon: 'basketShopping',
      actions: {
        History: { text: 'Histórico' },
        launch: { text: 'Lançamento' },
      },
    },
    Inventory: {
      text: 'Estoque',
      icon: 'box',
      actions: {
        Add: { text: 'Adicionar' },
        Remove: { text: 'Remover' },
        Adjust: { text: 'Ajustar' },
        View: { text: 'Visualizar' },
      },
    },
    Customers: {
      text: 'Clientes',
      icon: 'user',
      actions: {
        Status: { text: 'Status' },
        offer: { text: 'Oferta' },
        History: { text: 'Histórico' },
      },
    },
    Finance: {
      text: 'Financeiro',
      icon: 'sackDollar',
      actions: {
        CashFlow: { text: 'Fluxo' },
        Reports: { text: 'Relatórios' },
      },
    },
    Settings: {
      text: 'Configurações',
      icon: 'gear',
      actions: {
        Profile: { text: 'Perfil' },
        Users: { text: 'Administradores' },
        Data: { text: 'Dados' },
      },
    },
  },
  logout: {
    text: 'Sair',
    icon: 'goOut',
  },
};

export default dataLeftBarMenuItem;
