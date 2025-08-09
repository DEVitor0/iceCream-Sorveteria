const dataLeftBarMenuItem = {
  dashboard: {
    text: 'Dashboard',
    icon: 'houseChimney',
    path: '/Dashboard',
  },
  categories: {
    Products: {
      text: 'Produtos',
      icon: 'bagShopping',
      actions: {
        Register: { text: 'Cadastrar', path: '/Dashboard/Cadastrar' },
        Edit: { text: 'Editar', path: '/Dashboard/editar-produtos' },
      },
    },
    Sales: {
      text: 'Vendas',
      icon: 'basketShopping',
      actions: {
        launch: { text: 'Lançamento', path: '/Dashboard/Vendas/Lançamento' },
        History: { text: 'Histórico', path: '/Dashboard/Vendas/Histórico' },
        Cupon: { text: 'Cupom', path: '/Dashboard/Vendas/Cupom' },
      },
    },
    Customers: {
      text: 'Clientes',
      icon: 'user',
      actions: {
        message: { text: 'Mensagem', path: '/Dashboard/Clientes/Email' },
        History: { text: 'Histórico', path: '/Dashboard/Clientes/Histórico' },
      },
    },
    Finance: {
      text: 'Financeiro',
      icon: 'sackDollar',
      actions: {
        Reports: {
          text: 'Relatórios',
          path: '/Dashboard/Financeiro/relatorios',
        },
      },
    },
    Settings: {
      text: 'Configurações',
      icon: 'gear',
      actions: {
        Users: {
          text: 'Administradores',
          path: '/Dashboard/Configurações/Administradores',
        },
      },
    },
  },
  logout: {
    text: 'Sair',
    icon: 'goOut',
  },
};

export default dataLeftBarMenuItem;
