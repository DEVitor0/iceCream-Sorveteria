import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import Icon from '@mui/material/Icon';
import SoftBox from '../../../components/Dashboard/SoftBox';
import DefaultNavbarLink from './DefaultNavbarLink';
import DefaultNavbarMobile from './DefaultNavbarMobile';
import breakpoints from '../../../media/theme/base/breakpoints';
import image from '../../../utils/imageManager/imageManager';

function DefaultNavbar({ transparent, light, action }) {
  const [mobileNavbar, setMobileNavbar] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [hover, setHover] = useState(false);

  const openMobileNavbar = () => setMobileNavbar(true);
  const closeMobileNavbar = () => setMobileNavbar(false);

  useEffect(() => {
    function displayMobileNavbar() {
      if (window.innerWidth < breakpoints.values.lg) {
        setMobileView(true);
        setMobileNavbar(false);
      } else {
        setMobileView(false);
        setMobileNavbar(false);
      }
    }

    window.addEventListener('resize', displayMobileNavbar);
    displayMobileNavbar();
    return () => window.removeEventListener('resize', displayMobileNavbar);
  }, []);

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '1200px',
        position: 'relative',
      }}
    >
      <SoftBox
        py={1.5}
        px={5}
        width="100%"
        borderRadius="15px"
        shadow="md"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        position="absolute"
        top={hover ? '0px' : '-60px'}
        left={0}
        zIndex={3}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{
          backgroundColor: '#f5f5f5',
          backdropFilter: 'saturate(200%) blur(30px)',
          paddingLeft: '24px',
          paddingRight: '24px',
          transition: 'top 0.3s ease-in-out',
        }}
      >
        <SoftBox component={Link} to="/" lineHeight={0.1}>
          <SoftBox
            component="img"
            src={image.fitBrand}
            alt="IceCream Sorveteria"
            sx={{
              height: '50px',
              objectFit: 'contain',
            }}
          />
        </SoftBox>
        <SoftBox color="black" display={{ xs: 'none', lg: 'flex' }}>
          <DefaultNavbarLink icon="home" name="Home" route="/" />
          <DefaultNavbarLink
            icon="shopping_bag"
            name="Produtos"
            route="/produtos"
          />
          <DefaultNavbarLink
            icon="account_circle"
            name="Contato"
            route="/authentication/sign-up"
          />
          <DefaultNavbarLink
            icon="key"
            name="Registrar"
            route="/authentication/sign-in"
          />
        </SoftBox>
        <SoftBox
          display={{ xs: 'inline-block', lg: 'none' }}
          py={1.5}
          pl={1.5}
          sx={{ cursor: 'pointer' }}
          onClick={openMobileNavbar}
        >
          <Icon fontSize="default" sx={{ color: 'black' }}>
            {mobileNavbar ? 'close' : 'menu'}
          </Icon>
        </SoftBox>
      </SoftBox>

      {mobileView && (
        <DefaultNavbarMobile open={mobileNavbar} close={closeMobileNavbar} />
      )}
    </Container>
  );
}

DefaultNavbar.defaultProps = {
  transparent: false,
  light: false,
  action: false,
};

DefaultNavbar.propTypes = {
  transparent: PropTypes.bool,
  light: PropTypes.bool,
  action: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      type: PropTypes.oneOf(['external', 'internal']).isRequired,
      route: PropTypes.string.isRequired,
      color: PropTypes.oneOf([
        'primary',
        'secondary',
        'info',
        'success',
        'warning',
        'error',
        'dark',
        'light',
      ]),
      label: PropTypes.string.isRequired,
    }),
  ]),
};

export default DefaultNavbar;
