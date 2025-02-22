import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import SoftBox from '../../../../components/Dashboard/SoftBox';
import SoftTypography from '../../../../components/Dashboard/SoftTypography';
import SoftProgress from '../../../../components/Dashboard/SoftProgress';
import Icon from '@mui/material/Icon';

// Registre os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function ReportsBarChart({
  color = 'dark',
  title,
  description = '',
  chart = { labels: [], datasets: {} },
  items = [],
}) {
  // Configurações do gráfico
  const { data, options } = useMemo(() => {
    return {
      data: {
        labels: chart.labels,
        datasets: [
          {
            label: chart.datasets.label,
            tension: 0.4,
            borderWidth: 0,
            borderRadius: 4,
            borderSkipped: false,
            backgroundColor: '#fff',
            data: chart.datasets.data,
            maxBarThickness: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          y: {
            grid: {
              drawBorder: false,
              display: false,
              drawOnChartArea: false,
              drawTicks: false,
            },
            ticks: {
              suggestedMin: 0,
              suggestedMax: 500,
              beginAtZero: true,
              padding: 15,
              font: {
                size: 14,
                family: 'Roboto',
                style: 'normal',
                lineHeight: 2,
              },
              color: '#fff',
            },
          },
          x: {
            grid: {
              drawBorder: false,
              display: false,
              drawOnChartArea: false,
              drawTicks: false,
            },
            ticks: {
              display: false,
            },
          },
        },
      },
    };
  }, [chart]);

  // Renderiza os itens
  const renderItems = items.map(({ icon, label, progress }, index) => (
    <Grid item xs={6} sm={3} key={index}>
      {' '}
      {/* Use o índice como chave */}
      <SoftBox width="100%">
        <SoftBox display="flex" alignItems="center" mb={2}>
          <SoftBox
            bgColor={icon.color}
            width="1.25rem"
            height="1.25rem"
            borderRadius="sm"
            color="white"
            fontSize="0.875rem"
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
    </Grid>
  ));

  return (
    <Card sx={{ height: '100%' }}>
      <SoftBox padding="1rem">
        <SoftBox
          variant="gradient"
          bgColor={color}
          borderRadius="lg"
          py={2}
          pr={0.5}
          mb={3}
          height="12.5rem"
        >
          <Bar data={data} options={options} />
        </SoftBox>
        <SoftBox px={1}>
          <SoftBox mb={2}>
            <SoftTypography
              variant="h6"
              fontWeight="medium"
              textTransform="capitalize"
            >
              {title}
            </SoftTypography>
            <SoftTypography
              component="div"
              variant="button"
              color="text"
              fontWeight="regular"
            >
              {description}
            </SoftTypography>
          </SoftBox>
          <SoftBox py={1} px={0.5}>
            <Grid container spacing={2}>
              {renderItems}
            </Grid>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

// Typechecking props for the ReportsBarChart
ReportsBarChart.propTypes = {
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'dark',
  ]),
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  chart: PropTypes.shape({
    labels: PropTypes.array,
    datasets: PropTypes.shape({
      label: PropTypes.string,
      data: PropTypes.array,
    }),
  }).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.shape({
        color: PropTypes.string,
        component: PropTypes.node,
      }),
      label: PropTypes.string,
      progress: PropTypes.shape({
        content: PropTypes.string,
        percentage: PropTypes.number,
      }),
    }),
  ),
};

export default ReportsBarChart;
