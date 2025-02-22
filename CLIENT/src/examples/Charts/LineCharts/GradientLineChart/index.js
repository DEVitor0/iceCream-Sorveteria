import { useRef, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Card from '@mui/material/Card';
import SoftBox from '../../../../components/Dashboard/SoftBox';
import SoftTypography from '../../../../components/Dashboard/SoftTypography';
import gradientChartLine from '../../../../media/theme/functions/gradientChartLine';
import colors from '../../../../media/theme/base/colors';
import typography from '../../../../media/theme/base/typography';

// Registre os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function GradientLineChart({
  title = '',
  description = '',
  height = '19.125rem',
  chart = { labels: [], datasets: [] }, // Valor padrão
}) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({ data: {}, options: {} });

  useEffect(() => {
    console.log('Chart data received:', chart);

    // Verifique se chart.labels e chart.datasets são arrays válidos
    if (chart && Array.isArray(chart.labels) && Array.isArray(chart.datasets)) {
      const chartDatasets = chart.datasets.map((dataset) => ({
        ...dataset,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 3,
        borderColor: colors[dataset.color]
          ? colors[dataset.color].main
          : colors.dark.main,
        fill: true,
        maxBarThickness: 6,
        backgroundColor: gradientChartLine(
          chartRef.current.children[0],
          colors[dataset.color] ? colors[dataset.color].main : colors.dark.main,
        ),
      }));

      setChartData({
        data: {
          labels: chart.labels,
          datasets: chartDatasets,
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
                display: true,
                drawOnChartArea: true,
                drawTicks: false,
                borderDash: [5, 5],
              },
              ticks: {
                display: true,
                padding: 10,
                color: '#b2b9bf',
                font: {
                  size: 11,
                  family: typography.fontFamily,
                  style: 'normal',
                  lineHeight: 2,
                },
              },
            },
            x: {
              grid: {
                drawBorder: false,
                display: false,
                drawOnChartArea: false,
                drawTicks: false,
                borderDash: [5, 5],
              },
              ticks: {
                display: true,
                color: '#b2b9bf',
                padding: 20,
                font: {
                  size: 11,
                  family: typography.fontFamily,
                  style: 'normal',
                  lineHeight: 2,
                },
              },
            },
          },
        },
      });
    } else {
      console.error('Invalid chart data:', chart);
      // Defina um fallback para dados inválidos
      setChartData({
        data: {
          labels: [],
          datasets: [],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }
  }, [chart]);

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
      <SoftBox ref={chartRef} sx={{ height }}>
        <Line data={chartData.data} options={chartData.options} />
      </SoftBox>
    </SoftBox>
  );

  return title || description ? <Card>{renderChart}</Card> : renderChart;
}

export default GradientLineChart;
