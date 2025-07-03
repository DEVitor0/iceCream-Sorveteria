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
import typography from '../../media/theme/base/typography';

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
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const api = axios.create({
  baseURL: 'https://allowing-llama-seemingly.ngrok-free.app',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

function GroupedBarChart({
  title = '',
  description = '',
  height = '20.25rem',
  chart = { labels: [], datasets: [] },
}) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    data: { labels: [], datasets: [] },
    options: {},
  });

  // Cores personalizadas para as barras
  const barColors = ['#ACCBE1', '#7C98B3', '#637081'];

  useEffect(() => {
    let isMounted = true;

    const initChart = async () => {
      try {
        if (!chartRef.current) return;

        const hasData =
          chart?.labels?.length > 0 && chart?.datasets?.length > 0;

        if (!hasData) {
          if (isMounted) {
            setChartData({
              data: { labels: [], datasets: [] },
              options: {},
            });
          }
          return;
        }

        const newDatasets = chart.datasets.map((dataset, index) => {
          const colorIndex = index % barColors.length;
          return {
            ...dataset,
            barPercentage: 0.8,
            categoryPercentage: 0.8,
            borderWidth: 1,
            borderColor: barColors[colorIndex],
            backgroundColor: barColors[colorIndex],
            hoverBackgroundColor: barColors[colorIndex],
            hoverBorderColor: barColors[colorIndex],
          };
        });

        if (isMounted) {
          setChartData({
            data: {
              labels: chart.labels,
              datasets: newDatasets,
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                  labels: {
                    color: '#6355a8',
                    font: {
                      size: 12,
                      family: typography.fontFamily,
                    },
                    padding: 20,
                    boxWidth: 12,
                    usePointStyle: false,
                  },
                },
              },
              interaction: {
                intersect: false,
                mode: 'index',
              },
              scales: {
                y: {
                  beginAtZero: true,
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
                    color: '#6355a8',
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
                  },
                  ticks: {
                    display: true,
                    color: '#6355a8',
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
            <Bar data={chartData.data} options={chartData.options} />
          ) : (
            <SoftBox
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <SoftTypography variant="body2" color="text">
                Nenhum dado disponível para exibir
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    revenue: { value: 0, percentage: 0 },
    profit: { value: 0, percentage: 0 },
    newUsers: { value: 0, percentage: 0 },
    accessCount: { value: 0, percentage: 0 },
    loading: true,
    error: null,
    percentageChange: 0,
  });

  const [categoriesData, setCategoriesData] = useState({
    labels: [],
    datasets: [],
    loading: true,
    error: null,
    percentageChange: 0,
  });

  const [weeklyStats, setWeeklyStats] = useState({
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    data: [0, 0, 0, 0, 0, 0, 0],
    percentageChange: 0,
    loading: true,
    error: null,
  });

  const [weeklySummary, setWeeklySummary] = useState({
    orders: 0,
    revenue: 0,
    abandoned: 0,
    peakHour: 0,
    loading: true,
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const fetchCategoriesData = async () => {
    try {
      const response = await api.get('/api/stats/top-categories-yearly');

      // Verifica se a resposta é válida e tem dados
      if (!response.data || !response.data.data) {
        return setCategoriesData({
          labels: [],
          datasets: [],
          percentageChange: 0,
          loading: false,
          error: null,
        });
      }

      const responseData = response.data.data;
      let percentageChange = 0;

      // Verifica se existem datasets antes de calcular a porcentagem
      if (responseData.datasets && responseData.datasets.length > 0) {
        const currentData = responseData.datasets[0].data || [];
        const lastQuarter = currentData.slice(-3).reduce((a, b) => a + b, 0);
        const previousQuarter = currentData
          .slice(-6, -3)
          .reduce((a, b) => a + b, 0);

        if (previousQuarter > 0) {
          percentageChange = Math.round(
            ((lastQuarter - previousQuarter) / previousQuarter) * 100,
          );
        } else if (lastQuarter > 0) {
          percentageChange = 100;
        }
      }

      setCategoriesData({
        labels: responseData.labels || [],
        datasets: (responseData.datasets || [])
          .slice(0, 3)
          .map((dataset, index) => ({
            label: dataset.label || `Categoria ${index + 1}`,
            color: ['info', 'dark', 'success'][index],
            data: dataset.data || [],
          })),
        percentageChange,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching categories data:', error);
      setCategoriesData((prev) => ({
        ...prev,
        error: 'Erro ao carregar categorias',
        loading: false,
      }));
    }
  };

  const fetchWeeklySummary = async () => {
    try {
      const response = await api.get('/api/stats/weekly-summary');

      setWeeklySummary({
        orders: response.data.data.weeklyOrderCount,
        revenue: response.data.data.weeklyRevenue,
        abandoned: response.data.data.abandonedOrdersCount,
        peakHour: response.data.data.peakOrderHour,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching weekly summary:', error);
      setWeeklySummary((prev) => ({
        ...prev,
        error: 'Erro ao carregar resumo semanal',
        loading: false,
      }));
    }
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await api.get(`/api/stats/daily?date=${today}`);

        setStats({
          revenue: {
            value: response.data.revenue,
            percentage: response.data.percentages.revenue || 0,
          },
          profit: {
            value: response.data.profit,
            percentage: response.data.percentages.profit || 0,
          },
          newUsers: {
            value: response.data.newUsers,
            percentage: response.data.percentages.newUsers || 0,
          },
          accessCount: {
            value: response.data.accessCount,
            percentage: response.data.percentages.accessCount || 0,
          },
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats((prev) => ({
          ...prev,
          error: 'Erro ao carregar estatísticas',
          loading: false,
        }));
      }
    };

    const fetchWeeklyStats = async () => {
      try {
        const response = await api.get('/api/stats/weekly-orders');

        // Extrai os dados da semana atual
        const currentWeekData = response.data.map((day) => day.count);

        // Calcula a variação em relação à semana anterior
        let percentageChange = 0;
        if (response.data.length > 0) {
          const totalCurrentWeek = currentWeekData.reduce((a, b) => a + b, 0);
          const totalLastWeek = response.data.reduce(
            (a, day) => a + (day.lastWeekCount || 0),
            0,
          );

          if (totalLastWeek > 0) {
            percentageChange = Math.round(
              ((totalCurrentWeek - totalLastWeek) / totalLastWeek) * 100,
            );
          } else if (totalCurrentWeek > 0) {
            percentageChange = 100;
          }
        }

        setWeeklyStats({
          labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
          data: currentWeekData,
          percentageChange,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching weekly stats:', error);
        setWeeklyStats((prev) => ({
          ...prev,
          error: 'Erro ao carregar estatísticas semanais',
          loading: false,
        }));
      }
    };

    if (isAuthenticated) {
      fetchStats();
      fetchWeeklyStats();
      fetchWeeklySummary();
      fetchCategoriesData();
    }
  }, [isAuthenticated]);

  if (
    loading ||
    stats.loading ||
    weeklyStats.loading ||
    weeklySummary.loading ||
    categoriesData.loading
  ) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox py={3} textAlign="center">
          <SoftTypography variant="h6">Carregando dados...</SoftTypography>
        </SoftBox>
      </DashboardLayout>
    );
  }

  // Atualize a verificação de erro
  if (
    stats.error ||
    weeklyStats.error ||
    weeklySummary.error ||
    categoriesData.error
  ) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox py={3} textAlign="center">
          <SoftTypography variant="h6" color="error">
            {stats.error ||
              weeklyStats.error ||
              weeklySummary.error ||
              categoriesData.error}
          </SoftTypography>
        </SoftBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid
            container
            sx={{
              width: '100% !important',
              margin: '0 !important',
              padding: '0 8px !important',
              boxSizing: 'border-box !important',
              display: 'flex !important',
              flexWrap: 'nowrap !important',
              overflowX: 'auto !important',
            }}
          >
            <Grid
              item
              sx={{
                width: '23% !important',
                minWidth: '23% !important',
                flex: '0 0 auto !important',
                margin: '0 8px !important',
              }}
            >
              <MiniStatisticsCard
                title={{ text: 'Faturamento diário' }}
                count={formatCurrency(stats.revenue.value)}
                percentage={{
                  color: stats.revenue.percentage >= 0 ? 'success' : 'error',
                  text: `${
                    stats.revenue.percentage >= 0 ? '+' : ''
                  }${Math.round(stats.revenue.percentage)}%`,
                }}
                icon={{ color: 'info', component: 'paid' }}
                sx={{ width: '100% !important', height: '100% !important' }}
              />
            </Grid>
            <Grid
              item
              sx={{
                width: '23% !important',
                minWidth: '23% !important',
                flex: '0 0 auto !important',
                margin: '0 8px !important',
              }}
            >
              <MiniStatisticsCard
                title={{ text: 'Acessos hoje' }}
                count={stats.accessCount.value.toString()}
                percentage={{
                  color:
                    stats.accessCount.percentage >= 0 ? 'success' : 'error',
                  text: `${
                    stats.accessCount.percentage >= 0 ? '+' : ''
                  }${Math.round(stats.accessCount.percentage)}%`,
                }}
                icon={{ color: 'info', component: 'public' }}
                sx={{ width: '100% !important', height: '100% !important' }}
              />
            </Grid>
            <Grid
              item
              sx={{
                width: '23% !important',
                minWidth: '23% !important',
                flex: '0 0 auto !important',
                margin: '0 8px !important',
              }}
            >
              <MiniStatisticsCard
                title={{ text: 'Novos clientes' }}
                count={`+${stats.newUsers.value}`}
                percentage={{
                  color: stats.newUsers.percentage >= 0 ? 'success' : 'error',
                  text: `${
                    stats.newUsers.percentage >= 0 ? '+' : ''
                  }${Math.round(stats.newUsers.percentage)}%`,
                }}
                icon={{ color: 'info', component: 'emoji_events' }}
                sx={{ width: '100% !important', height: '100% !important' }}
              />
            </Grid>
            <Grid
              item
              sx={{
                width: '23% !important',
                minWidth: '23% !important',
                flex: '0 0 auto !important',
                margin: '0 8px !important',
              }}
            >
              <MiniStatisticsCard
                title={{ text: 'Lucro diário' }}
                count={formatCurrency(stats.profit.value)}
                percentage={{
                  color: stats.profit.percentage >= 0 ? 'success' : 'error',
                  text: `${stats.profit.percentage >= 0 ? '+' : ''}${Math.round(
                    stats.profit.percentage,
                  )}%`,
                }}
                icon={{ color: 'info', component: 'shopping_cart' }}
                sx={{ width: '100% !important', height: '100% !important' }}
              />
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox mb={3} sx={{ margin: '20px 0 0 0 !important' }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <ReportsBarChart
                color="info"
                title="Vendas semanais"
                description={
                  weeklyStats.percentageChange >= 0
                    ? `(+${weeklyStats.percentageChange}%) em relação à semana anterior`
                    : `(${weeklyStats.percentageChange}%) em relação à semana anterior`
                }
                chart={{
                  labels: weeklyStats.labels,
                  datasets: {
                    label: 'Vendas',
                    data: weeklyStats.data,
                  },
                }}
                items={[
                  {
                    icon: { color: 'primary', component: 'library_books' },
                    label: 'Pedidos',
                    progress: {
                      content: weeklySummary.orders.toString(),
                      percentage: 45,
                    },
                  },
                  {
                    icon: { color: 'warning', component: 'payment' },
                    label: 'Receita',
                    progress: {
                      content: weeklySummary.revenue.toFixed(2),
                      percentage: 70,
                    },
                  },
                  {
                    icon: { color: 'info', component: 'touch_app' },
                    label: 'Desistências',
                    progress: {
                      content: weeklySummary.abandoned.toString(),
                      percentage: 0,
                    },
                  },
                  {
                    icon: { color: 'error', component: 'timer' },
                    label: 'Pico',
                    progress: {
                      content: `${weeklySummary.peakHour}h`,
                      percentage: 80,
                    },
                  },
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 7 }}>
              <GroupedBarChart
                title="Categorias mais vendidas"
                description={
                  categoriesData.loading ? null : (
                    <SoftBox display="flex" alignItems="center">
                      {categoriesData.datasets.length > 0 ? (
                        <>
                          <SoftBox
                            fontSize="lg"
                            color={
                              categoriesData.percentageChange >= 0
                                ? 'success'
                                : 'error'
                            }
                            mb={0.3}
                            mr={0.5}
                            lineHeight={0}
                          >
                            <Icon className="font-bold">
                              {categoriesData.percentageChange >= 0
                                ? 'arrow_upward'
                                : 'arrow_downward'}
                            </Icon>
                          </SoftBox>
                          <SoftTypography
                            variant="button"
                            color="text"
                            fontWeight="medium"
                          >
                            {Math.abs(categoriesData.percentageChange)}%{' '}
                            <SoftTypography
                              variant="button"
                              color="text"
                              fontWeight="regular"
                            >
                              {categoriesData.percentageChange >= 0
                                ? 'a mais'
                                : 'a menos'}{' '}
                              no último trimestre
                            </SoftTypography>
                          </SoftTypography>
                        </>
                      ) : (
                        <SoftTypography
                          variant="button"
                          color="text"
                          fontWeight="regular"
                        >
                          Sem dados suficientes para comparação
                        </SoftTypography>
                      )}
                    </SoftBox>
                  )
                }
                height="20.25rem"
                chart={{
                  labels: categoriesData.labels,
                  datasets: categoriesData.datasets,
                }}
              />
            </Grid>
          </Grid>
        </SoftBox>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6, lg: 8 }}>
            <Projects />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <OrderOverview />
          </Grid>
        </Grid>
      </SoftBox>
    </DashboardLayout>
  );
}

export default Dashboard;
