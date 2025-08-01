import { useMemo } from 'react';

// porp-types is a library for typechecking of props
import PropTypes from 'prop-types';

// react-chartjs-2 components
import { Pie } from 'react-chartjs-2';

// @mui material components
import Card from '@mui/material/Card';

// Soft UI Dashboard React components
import SoftBox from '../../../components/Dashboard/SoftBox';
import SoftTypography from '../../../components/Dashboard/SoftTypography';

// PieChart configurations
import configs from './configs/index';

function PieChart({ title, description, height, chart }) {
  const { data, options } = configs(chart.labels || [], chart.datasets || {});

  const renderChart = (
    <SoftBox p={2}>
      {title || description ? (
        <SoftBox px={description ? 1 : 0} pt={description ? 1 : 0}>
          {title && (
            <SoftBox mb={1}>
              <SoftTypography variant="h6">{title}</SoftTypography>
            </SoftBox>
          )}
          <SoftBox mb={2}>
            <SoftTypography
              component="div"
              variant="button"
              fontWeight="regular"
              color="text"
            >
              {description}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      ) : null}
      {useMemo(
        () => (
          <SoftBox height={height}>
            <Pie data={data} options={options} />
          </SoftBox>
        ),
        [data, height, options],
      )}
    </SoftBox>
  );

  return title || description ? <Card>{renderChart}</Card> : renderChart;
}

// Setting default values for the props of PieChart
PieChart.defaultProps = {
  title: '',
  description: '',
  height: '19.125rem',
};

// Typechecking props for the PieChart
PieChart.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chart: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  ).isRequired,
};

export default PieChart;
