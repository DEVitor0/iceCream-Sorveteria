import PropTypes from 'prop-types';

// @mui material components
import Menu from '@mui/material/Menu';
// import Grid from "@mui/material/Grid";

// Soft UI Dashboard React components
import SoftBox from '../../../components/Dashboard/SoftBox';

// Soft UI Dashboard React examples
import DefaultNavbarLink from './DefaultNavbarLink';

function DefaultNavbarMobile({ open, close }) {
  const { width } = open && open.getBoundingClientRect();

  return (
    <Menu
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      anchorEl={open}
      open={Boolean(open)}
      onClose={close}
      MenuListProps={{ style: { width: `calc(${width}px - 4rem)` } }}
    >
      <SoftBox px={0.5}>
        <DefaultNavbarLink
          icon="donut_large"
          name="dashboard"
          route="/dashboard"
        />
        <DefaultNavbarLink icon="person" name="profile" route="/profile" />
        <DefaultNavbarLink
          icon="account_circle"
          name="sign up"
          route="/authentication/sign-up"
        />
        <DefaultNavbarLink
          icon="key"
          name="sign in"
          route="/authentication/sign-in"
        />
      </SoftBox>
    </Menu>
  );
}

// Typechecking props for the DefaultNavbarMenu
DefaultNavbarMobile.propTypes = {
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  close: PropTypes.oneOfType([PropTypes.func, PropTypes.bool, PropTypes.object])
    .isRequired,
};

export default DefaultNavbarMobile;
