import { Box, Tab, Tabs, Typography } from '@mui/material';
import moment from 'moment';
import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAllCoachingsQuery, useSendCoachingEmailMutation } from 'src/api/coachingRepository';
import { useAllUsersQuery } from 'src/api/usersRepository';
import { IslandModal } from 'src/components/island-modal/IslandModal';
import { APP_NAME } from 'src/config';
import { Tier } from 'src/models/Performance';
import { CoachingTable } from './CoachingTable';
import { EMAIL_CONTENT_BY_TAB } from './Emails';
import { SendEmailForm, SendEmailFormFields } from './SendEmailForm';
import { getMetricLevel } from './coaching-table-components/Metrics';

interface CoachingPageProps {}

export const TABS = {
  fico_score: 'Fico Score',
  seatbelt_off_rate: 'Seatbelt Off Rate',
  speeding_event_ratio: 'Speeding Event Rate',
  distraction_rate: 'Distractions Rate',
  following_distance_rate: 'Following Distance Rate',
  signal_violations_rate: 'Sign/Signal Violation Rate',
  cdf: 'CDF',
  dcr: 'DCR',
  pod: 'POD',
  cc: 'CC',
  ced: 'CED',
  swc_ad: 'AD',
  dsb_dnr: 'DNR',
  cc_o: 'CC Ops',
} as const;

export const CoachingPage: FC<CoachingPageProps> = (props) => {
  const [value, setValue] = React.useState<keyof typeof TABS>('fico_score');
  const [emailModalOpen, setEmailModalOpen] = React.useState(false);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue as keyof typeof TABS);
  };
  const coachingQuery = useAllCoachingsQuery();
  const { data: usersData } = useAllUsersQuery();

  let weeks: { value: number; label: string }[] = [];
  if (coachingQuery.data !== undefined && coachingQuery.data.length > 0) {
    weeks = coachingQuery.data[0].performances.map((x) => ({
      value: x.week,
      label: `Week ${x.week}`,
    }));
  }

  const { mutateAsync: sendCoachingEmail } = useSendCoachingEmailMutation();
  const coachingDataParsed = coachingQuery.data
    ?.map((item) => ({
      id: item.driver_amazon_id,
      position: item.id,
      driver_amazon_id: item.driver_amazon_id,
      name: item.name,
      week1: item?.performances[0] ? item?.performances[0][value] : '-',
      week2: item?.performances[1] ? item?.performances[1][value] : '-',
      week3: item?.performances[2] ? item?.performances[2][value] : '-',
      week4: item?.performances[3] ? item?.performances[3][value] : '-',
      week5: item?.performances[4] ? item?.performances[4][value] : '-',
      week6: item?.performances[5] ? item?.performances[5][value] : '-',
    }))
    .filter((x) => {
      const level = getMetricLevel(value, x.week6);
      return level === Tier.Poor || level === Tier.Fair || level === Tier.Great;
    });

  const usersDataForTable =
    usersData
      ?.filter((x) =>
        coachingDataParsed?.map((y) => y.driver_amazon_id).includes(x.driver_amazon_id)
      )
      ?.map((user) => ({
        value: user.id,
        label: `${user.firstname} ${user.lastname}`,
      })) || [];

  const driverIds = usersDataForTable.map((driver) => driver.value) || [];

  const handleSendEmail = async (values: SendEmailFormFields) => {
    if (coachingQuery.data === undefined) {
      return;
    }
    await sendCoachingEmail({
      category: value,
      content: values.emailContent,
      subject: values.subject,
      week: coachingQuery.data[0].performances[0].week,
      users: values.emailTo,
      year: moment().utc().year(),
      type: 'coach',
    });
    setEmailModalOpen(false);
  };
  return (
    <>
      <Helmet>
        <title> Coaching | {APP_NAME}</title>
      </Helmet>
      <Box sx={{ paddingX: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 4 }}>
          <Typography variant="h3">Coaching</Typography>
        </Box>
        <Box
          sx={{
            px: 2,
            backgroundColor: '#f4f6f8',
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            marginBottom: -1,
            paddingBottom: 1,
          }}
        >
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Fico Score" value={'fico_score'} />
            <Tab label="Seatbelt Off Rate" value={'seatbelt_off_rate'} />
            <Tab label="Speeding Event Rate" value={'speeding_event_ratio'} />
            <Tab label="Distractions Rate" value={'distraction_rate'} />
            <Tab label="Following Distance Rate" value={'following_distance_rate'} />
            <Tab label="Sign/Signal Violation Rate" value={'signal_violations_rate'} />
            <Tab label="CDF" value={'cdf'} />
            <Tab label="DCR" value={'dcr'} />
            <Tab label="POD" value={'pod'} />
            <Tab label="CC" value={'cc'} />
            <Tab label="CED" value={'ced'} />
            <Tab label="AD" value={'swc_ad'} />
            <Tab label="DNR" value={'dsb_dnr'} />
            <Tab label="CC Ops" value={'cc_o'} />
          </Tabs>
        </Box>
        <CoachingTable
          // Dirty fix for the table columns to reload when data is ready
          key={coachingQuery.dataUpdatedAt}
          tableWeekHeaders={{
            week1: weeks[0]?.label || '',
            week2: weeks[1]?.label || '',
            week3: weeks[2]?.label || '',
            week4: weeks[3]?.label || '',
            week5: weeks[4]?.label || '',
            week6: weeks[5]?.label || '',
          }}
          data={coachingDataParsed || []}
          tableTab={value}
          onEmail={() => setEmailModalOpen(true)}
        />
        <IslandModal open={emailModalOpen} onClose={() => setEmailModalOpen(false)}>
          <SendEmailForm
            column={TABS[value as keyof typeof TABS]}
            weeks={weeks}
            emailsTo={usersDataForTable}
            initialValues={{
              emailContent:
                EMAIL_CONTENT_BY_TAB[value as keyof typeof EMAIL_CONTENT_BY_TAB]?.emailContent ??
                '',
              subject:
                EMAIL_CONTENT_BY_TAB[value as keyof typeof EMAIL_CONTENT_BY_TAB]?.subject ?? '',
              emailTo: driverIds,
            }}
            onSubmit={handleSendEmail}
            onClose={() => setEmailModalOpen(false)}
          />
        </IslandModal>
      </Box>
    </>
  );
};
