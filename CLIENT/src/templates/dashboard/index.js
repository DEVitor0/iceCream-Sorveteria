// @mui material components
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Card from '@mui/material/Card';

// Soft UI Dashboard React components
import SoftBox from '../../components/Dashboard/SoftBox';
import SoftTypography from '../../components/Dashboard/SoftTypography';

// Soft UI Dashboard React examples
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../examples/Navbars/DashboardNavbar';
import MiniStatisticsCard from '../../examples/Cards/StatisticsCards/MiniStatisticsCard';
import ReportsBarChart from '../../examples/Charts/BarCharts/ReportsBarChart';

// Soft UI Dashboard React base styles
import colors from '../../media/theme/base/colors';
import typography from '../../media/theme/base/typography';
import gradientChartLine from '../../media/theme/functions/gradientChartLine';

// Dashboard layout components
import Projects from './components/Projects';
import OrderOverview from './components/OrderOverview';

// Chart.js setup
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

import useAuth from '../../hooks/Authentication/UseAuth';

import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';

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
  height = '20.25rem',
  chart,
}) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    data: { labels: [], datasets: [] },
    options: {},
  });

  useEffect(() => {
    let isMounted = true;

    const initChart = async () => {
      try {
        if (!chartRef.current || !chart?.datasets) return;

        const newDatasets = chart.datasets.map((dataset) => {
          const chartCanvas = chartRef.current?.querySelector('canvas');
          if (!chartCanvas) return dataset;

          const ctx = chartCanvas.getContext('2d');
          if (!ctx) return dataset;

          return {
            ...dataset,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 3,
            borderColor: colors[dataset.color]?.main || colors.dark.main,
            fill: true,
            maxBarThickness: 6,
            backgroundColor: gradientChartLine(
              ctx,
              colors[dataset.color]?.main || colors.dark.main,
            ),
          };
        });

        if (isMounted) {
          setChartData({
            data: {
              labels: chart.labels || [],
              datasets: newDatasets.filter((d) => d),
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              interaction: { intersect: false, mode: 'index' },
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
        }
      } catch (error) {
        console.error('Error initializing chart:', error);
      }
    };

    initChart();
    return () => {
      isMounted = false;
    };
  }, [chart]);

  return (
    <Card>
      <SoftBox p={2}>
        {title && (
          <SoftBox mb={1}>
            <SoftTypography variant="h6">{title}</SoftTypography>
          </SoftBox>
        )}

        {description && (
          <SoftBox mb={2}>
            <SoftTypography variant="button" color="text" fontWeight="regular">
              {description}
            </SoftTypography>
          </SoftBox>
        )}

        <SoftBox ref={chartRef} sx={{ height }}>
          {chartData.data.labels.length > 0 &&
          chartData.data.datasets.length > 0 ? (
            <Line data={chartData.data} options={chartData.options} />
          ) : (
            <SoftTypography variant="body2" color="text">
              Carregando gráfico...
            </SoftTypography>
          )}
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return null;
  }

  const projectsData = {
    columns: [
      { name: 'companies', align: 'left' },
      { name: 'members', align: 'left' },
      { name: 'budget', align: 'center' },
      { name: 'completion', align: 'center' },
    ],
    rows: [
      {
        companies: ['Soft UI XD Version'],
        members: [
          'Ryan Tompson',
          'Romina Hadid',
          'Alexander Smith',
          'Jessica Doe',
        ],
        budget: '$14,000',
        completion: 60,
      },
      {
        companies: ['Add Progress Track'],
        members: ['Romina Hadid', 'Jessica Doe'],
        budget: '$3,000',
        completion: 10,
      },
      {
        companies: ['Fix Platform Errors'],
        members: ['Ryan Tompson', 'Alexander Smith'],
        budget: 'Not set',
        completion: 100,
      },
      {
        companies: ['Launch our Mobile App'],
        members: [
          'Jessica Doe',
          'Alexander Smith',
          'Romina Hadid',
          'Ryan Tompson',
        ],
        budget: '$20,500',
        completion: 100,
      },
      {
        companies: ['Add the New Pricing Page'],
        members: ['Jessica Doe'],
        budget: '$500',
        completion: 25,
      },
      {
        companies: ['Redesign New Online Shop'],
        members: ['Ryan Tompson', 'Jessica Doe'],
        budget: '$2,000',
        completion: 40,
      },
    ],
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "today's money" }}
                count="$53,000"
                percentage={{ color: 'success', text: '+55%' }}
                icon={{ color: 'info', component: 'paid' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "today's users" }}
                count="2,300"
                percentage={{ color: 'success', text: '+3%' }}
                icon={{ color: 'info', component: 'public' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: 'new clients' }}
                count="+3,462"
                percentage={{ color: 'error', text: '-2%' }}
                icon={{ color: 'info', component: 'emoji_events' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: 'sales' }}
                count="$103,430"
                percentage={{ color: 'success', text: '+5%' }}
                icon={{
                  color: 'info',
                  component: 'shopping_cart',
                }}
              />
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={5}>
              <ReportsBarChart
                color="info"
                title="Active Users"
                description="(+23%) than last week"
                chart={{
                  labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                  datasets: {
                    label: 'Sales',
                    data: [50, 20, 10, 22, 50, 10, 40],
                  },
                }}
                items={[
                  {
                    icon: { color: 'primary', component: 'library_books' },
                    label: 'items',
                    progress: { content: '36', percentage: 60 },
                  },
                  {
                    icon: { color: 'info', component: 'touch_app' },
                    label: 'clicks',
                    progress: { content: '2m', percentage: 90 },
                  },
                  {
                    icon: { color: 'warning', component: 'payment' },
                    label: 'sales',
                    progress: { content: '$435', percentage: 30 },
                  },
                  {
                    icon: { color: 'error', component: 'extension' },
                    label: 'items',
                    progress: { content: '43', percentage: 50 },
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12} lg={7}>
              <GradientLineChart
                title="Sales Overview"
                description={
                  <SoftBox display="flex" alignItems="center">
                    <SoftBox
                      fontSize="lg"
                      color="success"
                      mb={0.3}
                      mr={0.5}
                      lineHeight={0}
                    >
                      <Icon className="font-bold">arrow_upward</Icon>
                    </SoftBox>
                    <SoftTypography
                      variant="button"
                      color="text"
                      fontWeight="medium"
                    >
                      4% more{' '}
                      <SoftTypography
                        variant="button"
                        color="text"
                        fontWeight="regular"
                      >
                        in 2021
                      </SoftTypography>
                    </SoftTypography>
                  </SoftBox>
                }
                height="20.25rem"
                chart={{
                  labels: [
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ],
                  datasets: [
                    {
                      label: 'Mobile apps',
                      color: 'info',
                      data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
                    },
                    {
                      label: 'Websites',
                      color: 'dark',
                      data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
                    },
                  ],
                }}
              />
            </Grid>
          </Grid>
        </SoftBox>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Projects data={projectsData} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <OrderOverview />
          </Grid>
        </Grid>
      </SoftBox>
    </DashboardLayout>
  );
}

export default Dashboard;
