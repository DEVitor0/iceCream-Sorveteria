import { useState, useContext } from 'react';
import ImageContext from '../../../contexts/ImagesContext/ImageContext';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';

import SoftBox from '../../../components/Dashboard/SoftBox';
import SoftTypography from '../../../components/Dashboard/SoftTypography';
import SoftInput from '../../../components/Dashboard/SoftInput';
import SoftButton from '../../../components/Dashboard/SoftButton';

import BasicLayout from '../components/BasicLayout';
import Socials from '../components/Socials';
import Separator from '../components/Separator';

function SignUp() {
  const image = useContext(ImageContext);
  const [agreement, setAgremment] = useState(true);

  const handleSetAgremment = () => setAgremment(!agreement);

  return (
    <BasicLayout
      title="Bem-vindo!"
      image={image.massSignUp}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <SoftBox
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '450px',
          mx: 'auto',
          px: 2,
        }}
      >
        <Card
          sx={{
            mt: -5,
            width: '100%',
            boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
          }}
        >
          <SoftBox p={3} textAlign="center">
            <SoftTypography variant="h5" fontWeight="medium">
              Registre-se com
            </SoftTypography>
          </SoftBox>

          <SoftBox mb={2}>
            <Socials />
          </SoftBox>

          <Separator />

          <SoftBox pt={2} pb={3} px={3}>
            <SoftBox component="form" role="form">
              <SoftBox mb={2}>
                <SoftInput placeholder="Name" fullWidth />
              </SoftBox>
              <SoftBox mb={2}>
                <SoftInput type="email" placeholder="Email" fullWidth />
              </SoftBox>
              <SoftBox mb={2}>
                <SoftInput type="password" placeholder="Password" fullWidth />
              </SoftBox>

              <SoftBox display="flex" alignItems="center">
                <Checkbox checked={agreement} onChange={handleSetAgremment} />
                <SoftTypography
                  variant="button"
                  fontWeight="regular"
                  onClick={handleSetAgremment}
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  &nbsp;&nbsp;Eu concordo com os&nbsp;
                </SoftTypography>
                <SoftTypography
                  component="a"
                  href="#"
                  variant="button"
                  fontWeight="bold"
                  textGradient
                >
                  Termos e Condições
                </SoftTypography>
              </SoftBox>

              <SoftBox mt={4} mb={1}>
                <SoftButton variant="gradient" color="dark" fullWidth>
                  sign up
                </SoftButton>
              </SoftBox>
            </SoftBox>
          </SoftBox>
        </Card>
      </SoftBox>

      <SoftBox
        sx={{
          py: 2,
          textAlign: 'center',
          width: '100%',
          maxWidth: '450px',
          mx: 'auto',
          mt: 3,
          px: 2,
        }}
      >
        <SoftTypography variant="button" color="text" fontWeight="regular">
          Already have an account?&nbsp;
          <SoftTypography
            component={Link}
            to="/authentication/sign-in"
            variant="button"
            color="dark"
            fontWeight="bold"
            textGradient
          >
            Sign in
          </SoftTypography>
        </SoftTypography>
      </SoftBox>
    </BasicLayout>
  );
}

export default SignUp;
