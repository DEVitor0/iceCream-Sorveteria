import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import SoftBox from '../../../components/Dashboard/SoftBox';
import {
  useSoftUIController,
  setLayout,
} from '../../../contexts/Reducer/index';
import VerticalMenu from '../../../templates/dashboard/components/DashboardBar/VerticalMenu/index';
import IconProvider from '../../../contexts/IconsContext/IconProvider/index';
import { bgcolor } from '@mui/system';

function DashboardLayout({ children }) {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();

  useEffect(() => {
    setLayout(dispatch, 'dashboard');
  }, [pathname, dispatch]);

  return (
    <SoftBox
      sx={{
        display: 'flex', // Use flexbox para organizar o layout
        minHeight: '100vh', // Garante que o layout ocupe toda a altura da tela
      }}
    >
      <IconProvider>
        <VerticalMenu />
      </IconProvider>

      {/* Conteúdo Principal */}
      <SoftBox
        sx={{
          p: 3,
          flexGrow: 1, // Faz o conteúdo principal ocupar o espaço restante
          marginLeft: 3, // Remove o marginLeft
          paddingLeft: 0, // Remove o paddingLeft
          width: `calc(100% - ${miniSidenav ? '120px' : '250px'})`, // Ajusta a largura do conteúdo
          transition: 'width 0.3s ease-in-out', // Transição suave
        }}
      >
        {children}
      </SoftBox>
    </SoftBox>
  );
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
