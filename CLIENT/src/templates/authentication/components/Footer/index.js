import Grid from '@mui/material/Grid';

// Soft UI Dashboard React components
import SoftBox from '../../../../components/Dashboard/SoftBox';
import SoftTypography from '../../../../components/Dashboard/SoftTypography';

function Footer() {
  return (
    <SoftBox component="footer" py={1}>
      <Grid container justifyContent="center">
        <Grid item xs={10} lg={8}>
          <SoftBox
            display="flex"
            justifyContent="center"
            flexWrap="wrap"
            mb={0}
            sx={{ gap: '1rem' }}
          >
            <SoftBox mr={{ xs: 2, lg: 3, xl: 6 }}>
              <SoftTypography
                component="a"
                href="#"
                variant="body2"
                color="secondary"
              >
                Home
              </SoftTypography>
            </SoftBox>
            <SoftBox mr={{ xs: 2, lg: 3, xl: 6 }}>
              <SoftTypography
                component="a"
                href="#"
                variant="body2"
                color="secondary"
              >
                Produtos
              </SoftTypography>
            </SoftBox>
            <SoftBox mr={{ xs: 0, lg: 3, xl: 6 }}>
              <SoftTypography
                component="a"
                href="#"
                variant="body2"
                color="secondary"
              >
                Endereço
              </SoftTypography>
            </SoftBox>
            <SoftBox mr={{ xs: 2, lg: 3, xl: 6 }}>
              <SoftTypography
                component="a"
                href="#"
                variant="body2"
                color="secondary"
              >
                Contato
              </SoftTypography>
            </SoftBox>
            <SoftBox mr={{ xs: 2, lg: 3, xl: 6 }}>
              <SoftTypography
                component="a"
                href="#"
                variant="body2"
                color="secondary"
              >
                Redes Sociais
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </Grid>
      </Grid>
    </SoftBox>
  );
}

export default Footer;
