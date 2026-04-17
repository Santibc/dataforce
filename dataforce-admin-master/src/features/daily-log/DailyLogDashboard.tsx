import { Box, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import { FC, useMemo } from 'react';
import { IDailyLog } from 'src/api/dailyLogRepository';
import Chart, { useChart } from 'src/components/chart';
import Iconify from 'src/components/iconify';
import { EVENT_TYPE_LABEL_MAP } from './dailyLogConstants';

interface DailyLogDashboardProps {
  data: IDailyLog[];
}

type KpiColor = 'primary' | 'success' | 'warning' | 'error' | 'info';

interface KpiCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: KpiColor;
  subtitle?: string;
}

const KpiCard: FC<KpiCardProps> = ({ title, value, icon, color, subtitle }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      borderRadius: 3,
      height: '100%',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': { transform: 'translateY(-2px)', boxShadow: 8 },
    }}
  >
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          bgcolor: (theme) => theme.palette[color].lighter,
          color: (theme) => theme.palette[color].dark,
        }}
      >
        <Iconify icon={icon} width={32} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h3" fontWeight={800} lineHeight={1.1}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  </Paper>
);

const ChartCard: FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => (
  <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" fontWeight={700}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
    {children}
  </Paper>
);

const EmptyState: FC = () => (
  <Paper elevation={3} sx={{ p: 6, borderRadius: 3, textAlign: 'center' }}>
    <Iconify icon="eva:bar-chart-2-outline" width={64} sx={{ color: 'text.disabled', mb: 2 }} />
    <Typography variant="h6" color="text.secondary">
      No data available yet
    </Typography>
    <Typography variant="body2" color="text.disabled">
      Create daily logs to start seeing metrics and trends.
    </Typography>
  </Paper>
);

export const DailyLogDashboard: FC<DailyLogDashboardProps> = ({ data }) => {
  const theme = useTheme();

  const metrics = useMemo(() => {
    const total = data.length;
    const now = moment();
    const thisMonthStart = now.clone().startOf('month');
    const lastMonthStart = now.clone().subtract(1, 'month').startOf('month');
    const lastMonthEnd = now.clone().subtract(1, 'month').endOf('month');

    const thisMonthCount = data.filter((d) =>
      moment(d.date).isSameOrAfter(thisMonthStart)
    ).length;
    const lastMonthCount = data.filter((d) => {
      const date = moment(d.date);
      return date.isSameOrAfter(lastMonthStart) && date.isSameOrBefore(lastMonthEnd);
    }).length;

    const monthDelta =
      lastMonthCount === 0
        ? null
        : Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100);

    const severityCount = {
      low: data.filter((d) => d.severity === 'low').length,
      medium: data.filter((d) => d.severity === 'medium').length,
      high: data.filter((d) => d.severity === 'high').length,
    };

    const submittedCount = data.filter((d) => d.status === 'submitted').length;
    const draftCount = data.filter((d) => d.status === 'draft').length;

    const uniqueDrivers = new Set(data.map((d) => d.driver_id)).size;

    const eventTypeCount: Record<string, number> = {};
    data.forEach((d) => {
      const label = EVENT_TYPE_LABEL_MAP[d.event_type] || d.event_type;
      eventTypeCount[label] = (eventTypeCount[label] || 0) + 1;
    });
    const eventTypeSorted = Object.entries(eventTypeCount).sort(([, a], [, b]) => b - a);

    const driverCount: Record<string, number> = {};
    data.forEach((d) => {
      driverCount[d.driver_name] = (driverCount[d.driver_name] || 0) + 1;
    });
    const topDrivers = Object.entries(driverCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);

    const trend: { month: string; low: number; medium: number; high: number }[] = [];
    for (let i = 5; i >= 0; i -= 1) {
      const monthStart = now.clone().subtract(i, 'months').startOf('month');
      const monthEnd = monthStart.clone().endOf('month');
      const monthData = data.filter((d) => {
        const date = moment(d.date);
        return date.isSameOrAfter(monthStart) && date.isSameOrBefore(monthEnd);
      });
      trend.push({
        month: monthStart.format('MMM'),
        low: monthData.filter((d) => d.severity === 'low').length,
        medium: monthData.filter((d) => d.severity === 'medium').length,
        high: monthData.filter((d) => d.severity === 'high').length,
      });
    }

    return {
      total,
      thisMonthCount,
      monthDelta,
      highSeverity: severityCount.high,
      uniqueDrivers,
      severityCount,
      submittedCount,
      draftCount,
      eventTypeSorted,
      topDrivers,
      trend,
    };
  }, [data]);

  const severityColors = [
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];

  const trendOptions = useChart({
    chart: { type: 'area', stacked: true, toolbar: { show: false } },
    colors: severityColors,
    stroke: { width: 2, curve: 'smooth' },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.1, stops: [0, 100] },
    },
    xaxis: { categories: metrics.trend.map((t) => t.month) },
    yaxis: { labels: { formatter: (v: number) => `${Math.round(v)}` } },
    tooltip: { shared: true, intersect: false, y: { formatter: (v: number) => `${v} logs` } },
    legend: { position: 'top', horizontalAlign: 'right' },
  });

  const severityDonutOptions = useChart({
    chart: { type: 'donut' },
    labels: ['Low', 'Medium', 'High'],
    colors: severityColors,
    legend: { position: 'bottom' },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              formatter: () => String(metrics.total),
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (v: number) => `${Math.round(v)}%`,
      style: { fontSize: '12px', fontWeight: 700 },
    },
  });

  const statusDonutOptions = useChart({
    chart: { type: 'donut' },
    labels: ['Submitted', 'Draft'],
    colors: [theme.palette.info.main, theme.palette.grey[500]],
    legend: { position: 'bottom' },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              formatter: () => String(metrics.total),
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (v: number) => `${Math.round(v)}%`,
      style: { fontSize: '12px', fontWeight: 700 },
    },
  });

  const eventTypeOptions = useChart({
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: {
      bar: { horizontal: true, borderRadius: 6, barHeight: '60%', distributed: true },
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.success.main,
      theme.palette.error.main,
      theme.palette.secondary.main,
      theme.palette.primary.dark,
    ],
    dataLabels: { enabled: true, style: { colors: ['#fff'], fontWeight: 700 } },
    xaxis: { categories: metrics.eventTypeSorted.map(([k]) => k) },
    legend: { show: false },
    tooltip: { y: { formatter: (v: number) => `${v} logs` } },
  });

  const topDriversOptions = useChart({
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: {
      bar: { horizontal: true, borderRadius: 6, barHeight: '60%' },
    },
    colors: [theme.palette.primary.main],
    dataLabels: { enabled: true, style: { colors: ['#fff'], fontWeight: 700 } },
    xaxis: { categories: metrics.topDrivers.map(([k]) => k) },
    tooltip: { y: { formatter: (v: number) => `${v} logs` } },
  });

  if (data.length === 0) return <EmptyState />;

  const deltaBadge =
    metrics.monthDelta === null
      ? undefined
      : `${metrics.monthDelta >= 0 ? '+' : ''}${metrics.monthDelta}% vs last month`;

  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Total Logs"
            value={metrics.total}
            icon="eva:file-text-fill"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="This Month"
            value={metrics.thisMonthCount}
            icon="eva:calendar-fill"
            color="info"
            subtitle={deltaBadge}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="High Severity"
            value={metrics.highSeverity}
            icon="eva:alert-triangle-fill"
            color="error"
            subtitle={
              metrics.total
                ? `${Math.round((metrics.highSeverity / metrics.total) * 100)}% of total`
                : undefined
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Active Drivers"
            value={metrics.uniqueDrivers}
            icon="eva:people-fill"
            color="success"
            subtitle="with at least one log"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ChartCard title="Logs Trend" subtitle="Last 6 months by severity">
            <Chart
              type="area"
              height={340}
              options={trendOptions}
              series={[
                { name: 'Low', data: metrics.trend.map((t) => t.low) },
                { name: 'Medium', data: metrics.trend.map((t) => t.medium) },
                { name: 'High', data: metrics.trend.map((t) => t.high) },
              ]}
            />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartCard title="By Severity">
            <Chart
              type="donut"
              height={340}
              options={severityDonutOptions}
              series={[
                metrics.severityCount.low,
                metrics.severityCount.medium,
                metrics.severityCount.high,
              ]}
            />
          </ChartCard>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ChartCard title="By Event Type" subtitle="Distribution across categories">
            <Chart
              type="bar"
              height={Math.max(340, metrics.eventTypeSorted.length * 50)}
              options={eventTypeOptions}
              series={[{ name: 'Logs', data: metrics.eventTypeSorted.map(([, v]) => v) }]}
            />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Drivers with Most Logs"
            subtitle={`Top ${metrics.topDrivers.length} by log count`}
          >
            <Chart
              type="bar"
              height={Math.max(340, metrics.topDrivers.length * 42)}
              options={topDriversOptions}
              series={[{ name: 'Logs', data: metrics.topDrivers.map(([, v]) => v) }]}
            />
          </ChartCard>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ChartCard title="By Status" subtitle="Submitted vs Draft">
            <Chart
              type="donut"
              height={280}
              options={statusDonutOptions}
              series={[metrics.submittedCount, metrics.draftCount]}
            />
          </ChartCard>
        </Grid>
      </Grid>
    </Stack>
  );
};
