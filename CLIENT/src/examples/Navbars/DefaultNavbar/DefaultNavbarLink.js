import { Link } from 'react-router-dom';

// prop-types is a library for typechecking of props
import PropTypes from 'prop-types';

// @mui material components
import Icon from '@mui/material/Icon';

// Soft UI Dashboard React components
import SoftBox from '../../../components/Dashboard/SoftBox';
import SoftTypography from '../../../components/Dashboard/SoftTypography';

function DefaultNavbarLink({ icon, name, route, light }) {
  return (
    <SoftBox
      component={Link}
      to={route}
      mx={1}
      p={1}
      display="flex"
      alignItems="center"
      sx={{ cursor: 'pointer', userSelect: 'none' }}
    >
      <Icon
        sx={{
          fontSize: 24,
          color: ({ palette: { white, secondary } }) =>
            light ? white.main : secondary.main,
          verticalAlign: 'middle',
        }}
      >
        {icon}
      </Icon>
      <SoftTypography
        variant="button"
        fontWeight="regular"
        fontSize="1rem"
        color={light ? 'white' : 'dark'}
        textTransform="capitalize"
        sx={{ width: '100%', lineHeight: 1.5 }}
      >
        &nbsp;{name}
      </SoftTypography>
    </SoftBox>
  );
}

// Typechecking props for the DefaultNavbarLink
DefaultNavbarLink.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  light: PropTypes.bool.isRequired,
};

export default DefaultNavbarLink;
