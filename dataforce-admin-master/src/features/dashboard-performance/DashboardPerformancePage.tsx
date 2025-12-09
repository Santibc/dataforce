import { Box, Button } from '@mui/material';
import moment from 'moment';
import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useSendCoachingEmailMutation } from 'src/api/coachingRepository';
import { useAllDashboardPerformancesQuery } from 'src/api/dashboardPerformanceRepository';
import { IslandModal } from 'src/components/island-modal/IslandModal';
import { APP_NAME } from 'src/config';
import { AttachTableHeader } from './components/AttachTableHeader';
import { DashboardSummary } from './components/DashboardSummary';
import { GeneralCompanyMetrics } from './components/GeneralCompanyMetrics';
import { SendCoachingEmailForm } from './components/SendCoachingEmailForm';
import { SendCongratsEmailForm } from './components/SendCongratsEmailForm';
import { TopBestAndWorstDriversTable } from './components/TopBestAndWorstDriversTable';
import { TrailingWeekDriversTable } from './components/TrailingWeekDriversTable';
import { WeekClock } from './components/WeekClock';

interface DashboardPerformancePageProps {}

const PARAM_KEYS = {
  DATE: 'DATE',
} as const;

export const DashboardPerformancePage: FC<DashboardPerformancePageProps> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams({
    [PARAM_KEYS.DATE]: moment().format(),
  });

  const DATE = searchParams.get(PARAM_KEYS.DATE);
  const { mutateAsync: sendCoachingEmail } = useSendCoachingEmailMutation();
  const { data: dashboardPerformanceData } = useAllDashboardPerformancesQuery({
    week: moment(DATE).utc().isoWeek(),
    year: moment(DATE).utc().year(),
  });

  const [coachingBelowStandardEmailOpen, setCoachingBelowStandardEmailOpen] = React.useState(false);
  const [coachingWorstDriversEmailOpen, setCoachingWorstDriversEmailOpen] = React.useState(false);
  const [congratsEmailOpen, setCongratsEmailOpen] = React.useState(false);

  const topBestDriversTableData =
    dashboardPerformanceData?.best_drivers.map((x) => ({
      value: x.user_id,
      label: x.user_name,
    })) || [];

  const worstDriversTableData =
    dashboardPerformanceData?.worst_drivers.map((x) => ({
      value: x.user_id,
      label: x.user_name,
    })) || [];

  const belowStandardDriversTableData =
    dashboardPerformanceData?.below_standard.map((x) => ({
      value: x.user_id,
      label: x.user_name,
    })) || [];

  function navigateDays(days: number) {
    setSearchParams(
      (prev) => {
        prev.set(
          PARAM_KEYS.DATE,
          moment(prev.get(PARAM_KEYS.DATE) || '')
            .add(days, 'days')
            .format()
        );
        return prev;
      },
      { replace: true }
    );
  }

  function resetDateSearchParams() {
    setSearchParams((params) => {
      params.set(PARAM_KEYS.DATE, moment().format());
      return params;
    });
    return moment().utc().isoWeek();
  }
  return (
    <>
      <Helmet>
        <title> Performance Dashboard | {APP_NAME}</title>
      </Helmet>
      <Box sx={{ paddingX: 3 }}>
        <WeekClock
          week={
            Number.isNaN(moment(DATE).utc().isoWeek())
              ? resetDateSearchParams()
              : moment(DATE).utc().isoWeek()
          }
          onClickBackward={() => navigateDays(-7)}
          onClickForward={() => navigateDays(7)}
        />

        <Box sx={{ paddingBottom: '30px' }} />
        <DashboardSummary
          safetyAndCompliance={{
            status: dashboardPerformanceData?.safetys?.value || '-',
          }}
          quality={{
            status: dashboardPerformanceData?.qualitys?.value || '-',
          }}
          team={{
            status: dashboardPerformanceData?.teams?.value || '-',
          }}
          overallStanding={{
            status: dashboardPerformanceData?.overall_standings?.value || '-',
          }}
        />

        <Box sx={{ paddingBottom: '60px' }} />
        <AttachTableHeader
          title="Top Performers of the week"
          action={
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setCongratsEmailOpen(true)}
            >
              Congratulation
            </Button>
          }
        />
        <TopBestAndWorstDriversTable data={dashboardPerformanceData?.best_drivers || []} />

        <Box sx={{ paddingBottom: '60px' }} />
        <AttachTableHeader
          title="10 Bottom performers of the week"
          action={
            <Button
              variant="contained"
              sx={{ backgroundColor: '#00b8d9', ':hover': { backgroundColor: '#00778c' } }}
              onClick={() => setCoachingWorstDriversEmailOpen(true)}
            >
              Coaching
            </Button>
          }
        />
        <TopBestAndWorstDriversTable data={dashboardPerformanceData?.worst_drivers || []} />

        <Box sx={{ paddingBottom: '60px' }} />
        <AttachTableHeader
          title="Drivers Under performance standards"
          action={
            <Button
              variant="contained"
              sx={{ backgroundColor: '#00b8d9', ':hover': { backgroundColor: '#00778c' } }}
              onClick={() => setCoachingBelowStandardEmailOpen(true)}
            >
              Coaching
            </Button>
          }
        />
        <TrailingWeekDriversTable data={dashboardPerformanceData?.below_standard || []} />

        <Box sx={{ paddingBottom: '60px' }} />
        <GeneralCompanyMetrics
          qualitys={dashboardPerformanceData?.qualitys || null}
          safetys={dashboardPerformanceData?.safetys || null}
          teams={dashboardPerformanceData?.teams || null}
        />

        <IslandModal
          onClose={() => setCongratsEmailOpen(false)}
          open={congratsEmailOpen}
          maxWidth="600px"
        >
          <SendCongratsEmailForm
            initialValues={{
              emailTo: topBestDriversTableData.map((x) => x.value),
              column: '',
              emailContent: `Congratulations!
              </br></br>
Congrats! You were one of the top 5 drivers on last week’s scorecard. As former drivers, we understand the challenges you can encounter on the road, but you maintained the highest standards in all your deliveries.
</br></br>
You made customers smile and the company proud. Let’s keep working together and delivering one package at a time.`,
              subject: '',
              week: 0,
            }}
            emailsTo={topBestDriversTableData}
            onSubmit={async (values) =>
              sendCoachingEmail({
                category: '.',
                content: values.emailContent,
                subject: values.subject,
                type: 'congrats',
                users: values.emailTo,
                week: moment(DATE).utc().isoWeek(),
                year: moment(DATE).utc().year(),
              }).then(() => setCongratsEmailOpen(false))
            }
            onClose={() => setCongratsEmailOpen(false)}
          />
        </IslandModal>
        <IslandModal
          onClose={() => setCoachingWorstDriversEmailOpen(false)}
          open={coachingWorstDriversEmailOpen}
          maxWidth="600px"
        >
          <SendCoachingEmailForm
            initialValues={{
              emailTo: worstDriversTableData.map((x) => x.value),
              column: '',
              emailContent: `Oh no! You were amongs the bottom 10 performers for last week's scorecard. We understand your job is not easy, but as a company our main goal is customer satisfaction and safety. Please review your last available score and let's work together to improve in each one of the metrics.
</br></br>
If you have any questions, please reach out to your supervisor and see what can you do to improve.`,
              subject: '',
              week: 0,
            }}
            emailsTo={worstDriversTableData}
            onSubmit={async (values) =>
              sendCoachingEmail({
                category: '.',
                content: values.emailContent,
                subject: values.subject,
                type: 'coach',
                users: values.emailTo,
                week: moment(DATE).utc().isoWeek(),
                year: moment(DATE).utc().year(),
              }).then(() => setCoachingWorstDriversEmailOpen(false))
            }
            onClose={() => setCoachingWorstDriversEmailOpen(false)}
          />
        </IslandModal>
        <IslandModal
          onClose={() => setCoachingBelowStandardEmailOpen(false)}
          open={coachingBelowStandardEmailOpen}
          maxWidth="600px"
        >
          <SendCoachingEmailForm
            initialValues={{
              emailTo: belowStandardDriversTableData.map((x) => x.value),
              column: '',
              emailContent: `Here's your wake-up call! Your score has been below standards at least 4 times in the last 6 weeks.
</br></br>
Our main goal is customer satisfaction and safety. As a driver, you need to maintain high-quality deliveries. Your weekly score report includes an Overall Tier metric, which rates your performance as Fantastic, Great, Fair, or Poor.
</br></br>
Goal:
</br>
Always aim for a Fantastic rating.
</br>
Achieving less than Fantastic will hurt your overall score.
</br>
To be a High Performer, you need at least 4 out of the last 6 weeks rated as Fantastic.
</br></br>
Let’s work together to improve your performance and achieve High Performer status! not improving could end up on disciplinary actions.`,
              subject: '',
              week: 0,
            }}
            emailsTo={belowStandardDriversTableData}
            onSubmit={async (values) =>
              sendCoachingEmail({
                category: '.',
                content: values.emailContent,
                subject: values.subject,
                type: 'coach',
                users: values.emailTo,
                week: moment(DATE).utc().isoWeek(),
                year: moment(DATE).utc().year(),
              }).then(() => setCoachingBelowStandardEmailOpen(false))
            }
            onClose={() => setCoachingBelowStandardEmailOpen(false)}
          />
        </IslandModal>
      </Box>
    </>
  );
};
