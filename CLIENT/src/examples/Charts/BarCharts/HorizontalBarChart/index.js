import { useMemo } from 'react';

// prop-types is a library for typechecking of props
import PropTypes from 'prop-types';

// react-chartjs-2 components
import { Bar } from 'react-chartjs-2';

// @mui material components
import Card from '@mui/material/Card';

// Soft UI Dashboard React components
import SoftBox from '../../../../components/Dashboard/SoftBox';
import SoftTypography from '../../../../components/Dashboard/SoftTypography';

// HorizontalBarChart configurations
import configs from 'examples/Charts/BarCharts/HorizontalBarChart/configs';

// Soft UI Dashboard React base styles
import colors from 'assets/theme/base/colors';

function HorizontalBarChart({ title, description, height, chart = {} }) {
  const { datasets = [], labels = [] } = chart;

  const chartDatasets = datasets.map((dataset) => ({
    ...dataset,
    weight: 5,
    borderWidth: 0,
    borderRadius: 4,
    backgroundColor: colors[dataset.color]
      ? colors[dataset.color || 'dark'].main
      : colors.dark.main,
    fill: false,
    maxBarThickness: 35,
  }));

  const { data, options } = configs(labels, chartDatasets);

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
            <Bar data={data} options={options} />
          </SoftBox>
        ),
        [data, height, options],
      )}
    </SoftBox>
  );

  return title || description ? <Card>{renderChart}</Card> : renderChart;
}

// Setting default values for the props of HorizontalBarChart
HorizontalBarChart.defaultProps = {
  title: '',
  description: '',
  height: '19.125rem',
  chart: { labels: [], datasets: [] },
};

// Typechecking props for the HorizontalBarChart
HorizontalBarChart.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chart: PropTypes.shape({
    labels: PropTypes.array,
    datasets: PropTypes.array,
  }).isRequired,
};

export default HorizontalBarChart;
