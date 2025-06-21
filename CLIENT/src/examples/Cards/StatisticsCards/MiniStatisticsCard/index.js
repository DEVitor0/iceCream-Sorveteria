import PropTypes from 'prop-types';

// @mui material components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';

// Soft UI Dashboard React components
import SoftBox from '../../../../components/Dashboard/SoftBox';
import SoftTypography from '../../../../components/Dashboard/SoftTypography';

function MiniStatisticsCard({
  bgColor = 'white',
  title = { fontWeight: 'medium', text: '' },
  count,
  percentage = { color: 'success', text: '' },
  icon,
  direction = 'right',
}) {
  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'visible',
        borderRadius: '12px !important',
      }}
    >
      <SoftBox
        bgColor={bgColor}
        variant="gradient"
        sx={{ borderRadius: '12px' }}
      >
        <SoftBox p={2}>
          <Grid container alignItems="center">
            {direction === 'left' ? (
              <Grid item>
                <SoftBox
                  variant="gradient"
                  bgColor={bgColor === 'white' ? icon.color : 'white'}
                  color={bgColor === 'white' ? 'white' : 'dark'}
                  width="3rem"
                  height="3rem"
                  borderRadius="md"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  shadow="md"
                >
                  <Icon fontSize="small" color="inherit">
                    {icon.component}
                  </Icon>
                </SoftBox>
              </Grid>
            ) : null}
            <Grid item xs={direction === 'right' ? 8 : 12}>
              <SoftBox ml={direction === 'left' ? 2 : 0} lineHeight={1}>
                <SoftTypography
                  variant="button"
                  color={bgColor === 'white' ? 'text' : 'white'}
                  opacity={bgColor === 'white' ? 1 : 0.7}
                  textTransform="capitalize"
                  fontWeight={title.fontWeight}
                >
                  {title.text}
                </SoftTypography>
                <SoftTypography
                  variant="h5"
                  fontWeight="bold"
                  color={bgColor === 'white' ? 'dark' : 'white'}
                >
                  {count}{' '}
                  <SoftTypography
                    variant="button"
                    color={percentage.color}
                    fontWeight="bold"
                  >
                    {percentage.text}
                  </SoftTypography>
                </SoftTypography>
              </SoftBox>
            </Grid>
          </Grid>

          {/* Ícone posicionado absolutamente */}
          {direction === 'right' && (
            <SoftBox
              variant="gradient"
              bgColor={bgColor === 'white' ? icon.color : 'white'}
              color={bgColor === 'white' ? 'white' : 'dark'}
              width="3rem"
              height="3rem"
              borderRadius="md"
              display="flex"
              justifyContent="center"
              alignItems="center"
              shadow="md"
              sx={{
                position: 'absolute',
                right: '16px',
                bottom: '16px',
              }}
            >
              <Icon fontSize="small" color="inherit">
                {icon.component}
              </Icon>
            </SoftBox>
          )}
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

// Typechecking props for the MiniStatisticsCard
MiniStatisticsCard.propTypes = {
  bgColor: PropTypes.oneOf([
    'white',
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'dark',
  ]),
  title: PropTypes.shape({
    fontWeight: PropTypes.oneOf(['light', 'regular', 'medium', 'bold']),
    text: PropTypes.string,
  }),
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOf([
      'primary',
      'secondary',
      'info',
      'success',
      'warning',
      'error',
      'dark',
      'white',
    ]),
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  icon: PropTypes.shape({
    color: PropTypes.oneOf([
      'primary',
      'secondary',
      'info',
      'success',
      'warning',
      'error',
      'dark',
    ]),
    component: PropTypes.node.isRequired,
  }).isRequired,
  direction: PropTypes.oneOf(['right', 'left']),
};

export default MiniStatisticsCard;
