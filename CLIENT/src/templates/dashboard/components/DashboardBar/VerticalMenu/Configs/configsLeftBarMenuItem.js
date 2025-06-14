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
      },
    },
    Sales: {
      text: 'Vendas',
      icon: 'basketShopping',
      actions: {
        launch: { text: 'Lançamento' },
        History: { text: 'Histórico' },
        Cupon: { text: 'Cupom' },
      },
    },
    Customers: {
      text: 'Clientes',
      icon: 'user',
      actions: {
        message: { text: 'Mensagem' },
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
