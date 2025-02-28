import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';

import SoftBox from '../../../../components/Dashboard/SoftBox';
import SoftTypography from '../../../../components/Dashboard/SoftTypography';

import PageLayout from '../../../../examples/LayoutContainers/PageLayout';

import DefaultNavbar from '../../../../examples/Navbars/DefaultNavbar';

function CoverLayout({
  color,
  header,
  title,
  description,
  image,
  top,
  children,
}) {
  return (
    <PageLayout
      background="white"
      sx={{
        overflow: 'hidden',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <DefaultNavbar
        transparent
        light
        action={{
          type: 'internal',
          route: '/authentication/sign-in',
          label: 'Sign In',
          color: 'info',
        }}
      />

      <SoftBox
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          height: 'calc(100vh - 0px)',
        }}
      >
        <Grid
          container
          sx={{
            height: '100%',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Grid item xs={12} md={6}>
            <SoftBox
              sx={{
                maxWidth: '500px',
                mx: 'auto',
                px: 3,
                py: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <SoftBox>
                {!header ? (
                  <>
                    <SoftBox mb={2}>
                      <SoftTypography
                        variant="h3"
                        fontWeight="bold"
                        color={color}
                        textGradient
                      >
                        {title}
                      </SoftTypography>
                    </SoftBox>
                    <SoftTypography
                      variant="body2"
                      fontWeight="regular"
                      color="text"
                      mb={4}
                    >
                      {description}
                    </SoftTypography>
                  </>
                ) : (
                  header
                )}
                <SoftBox>{children}</SoftBox>
              </SoftBox>
            </SoftBox>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: { xs: 'none', md: 'block' } }}
          >
            <SoftBox
              sx={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '50%',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  zIndex: 1,
                },
              }}
            >
              <SoftBox
                sx={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  transform: 'scale(1.05)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              />
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
    </PageLayout>
  );
}

CoverLayout.defaultProps = {
  header: '',
  title: '',
  description: '',
  color: 'info',
  top: 0,
};

CoverLayout.propTypes = {
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
  header: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string.isRequired,
  top: PropTypes.number,
  children: PropTypes.node.isRequired,
};

export default CoverLayout;
