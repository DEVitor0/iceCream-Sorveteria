import { Box, Typography, Container } from '@mui/material';
import { styled } from '@mui/system';
import Brand from '../brand';
import Styles from './footer.module.scss';

const FooterBox = styled(Box)({
  position: 'relative',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '3px',
    background:
      'linear-gradient(90deg, $emphasis-color 0%, $background-session-color-special 100%)',
  },
});

const Footer = () => {
  return (
    <FooterBox component="footer" className={Styles.footer}>
      <Container maxWidth="xl" className={Styles.footer__container}>
        <Box className={Styles.footer__mainContent}>
          {/* Seção da Marca */}
          <Box className={Styles.footer__brandSection}>
            <Brand />
          </Box>

          {/* Seção de Links */}
          <Box className={Styles.footer__linksSection}>
            <Box className={Styles.footer__linksGroup}>
              <Typography variant="h6" className={Styles.footer__groupTitle}>
                Navegação
              </Typography>
              <ul className={Styles.footer__linksList}>
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/cardapio">Cardápio</a>
                </li>
                <li>
                  <a href="/sobre">Sobre Nós</a>
                </li>
                <li>
                  <a href="/contato">Contato</a>
                </li>
              </ul>
            </Box>

            <Box className={Styles.footer__linksGroup}>
              <Typography variant="h6" className={Styles.footer__groupTitle}>
                Informações
              </Typography>
              <ul className={Styles.footer__linksList}>
                <li>Rua dos Sorvetes, 123</li>
                <li>Sorvetópolis - SP</li>
                <li>(11) 98765-4321</li>
                <li>contato@icecream.com</li>
              </ul>
            </Box>

            <Box className={Styles.footer__linksGroup}>
              <Typography variant="h6" className={Styles.footer__groupTitle}>
                Horário
              </Typography>
              <ul className={Styles.footer__linksList}>
                <li>Seg-Sex: 13h-21h</li>
                <li>Sábado: 12h-22h</li>
                <li>Domingo: 12h-20h</li>
              </ul>
            </Box>
          </Box>
        </Box>

        {/* Copyright */}
        <Box className={Styles.footer__copyright}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Ice Cream Sobremesas. Todos os direitos
            reservados.
          </Typography>
        </Box>
      </Container>
    </FooterBox>
  );
};

export default Footer;
