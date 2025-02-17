import PropTypes from 'prop-types';

// @mui material components
import Icon from '@mui/material/Icon';

// Soft UI Dashboard React base styles
import typography from '../../../../media/theme/base/typography';

// Soft UI Dashboard React components
import SoftBox from '../../../../components/Dashboard/SoftBox';
import SoftTypography from '../../../../components/Dashboard/SoftTypography';
import SoftProgress from '../../../../components/Dashboard/SoftProgress';

function ReportsBarChartItem({ color = 'dark', icon, label, progress }) {
  const { size } = typography;

  return (
    <SoftBox width="100%">
      <SoftBox display="flex" alignItems="center" mb={2}>
        <SoftBox
          bgColor={icon.color}
          width="1.25rem"
          height="1.25rem"
          borderRadius="sm"
          color="white"
          fontSize={size.xs}
          display="flex"
          justifyContent="center"
          alignItems="center"
          shadow="md"
          mr={1}
          variant="gradient"
        >
          <Icon>{icon.component}</Icon>
        </SoftBox>
        <SoftTypography
          variant="caption"
          textTransform="capitalize"
          fontWeight="medium"
          color="text"
        >
          {label}
        </SoftTypography>
      </SoftBox>
      <SoftBox mt={1}>
        <SoftTypography variant="h4" fontWeight="bold" color={color}>
          {progress.content}
        </SoftTypography>
        <SoftBox width="75%" mt={0.5}>
          <SoftProgress value={progress.percentage} color={color} />
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
}

// Typechecking props for the ReportsBarChartItem
ReportsBarChartItem.propTypes = {
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'dark',
  ]),
  icon: PropTypes.shape({
    color: PropTypes.oneOf([
      'primary',
      'secondary',
      'info',
      'success',
      'warning',
      'error',
      'dark',
    ]).isRequired,
    component: PropTypes.node.isRequired,
  }).isRequired,
  label: PropTypes.string.isRequired,
  progress: PropTypes.shape({
    content: PropTypes.string.isRequired,
    percentage: PropTypes.number.isRequired,
  }).isRequired,
};

export default ReportsBarChartItem;
