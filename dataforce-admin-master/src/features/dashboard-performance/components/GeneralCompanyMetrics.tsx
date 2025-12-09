import { Box, Grid, Paper, Typography } from '@mui/material';
import { FC } from 'react';
import { TierMetric } from 'src/features/coaching/coaching-table-components/Metrics';
import { QualityData, SafetyData, TeamData } from 'src/models/Performance';
import { Subitem } from './Subitem';

interface GeneralCompanyMetricsProps {
  safetys: SafetyData | null;
  qualitys: QualityData | null;
  teams: TeamData | null;
}

export const GeneralCompanyMetrics: FC<GeneralCompanyMetricsProps> = ({
  qualitys,
  safetys,
  teams,
}) => (
  <Grid container spacing={3}>
    <Grid item lg={4} xs={12}>
      <Paper elevation={11} sx={{ padding: 3, borderRadius: '16px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: '24px',
          }}
        >
          <Typography variant="h5">Safety and Compliance</Typography>
          {safetys && <TierMetric value={safetys.value} />}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">On-Road Safety Score</Typography>
          <Typography variant="h6" sx={{ color: '#38495c' }}>
            {safetys?.on_road_safety_score}
          </Typography>
        </Box>
        <Box sx={{ px: 3, py: 2 }}>
          <Subitem title="Safe Driving Metric" metric={safetys?.safe_driving_metric || '-'} />
          <Subitem title="Seatbelt-Off Rate" metric={safetys?.seatbelt_off_rate || '-'} />
          <Subitem title="Speeding Event Rate" metric={safetys?.speeding_event_rate || '-'} />
          <Subitem
            title="Sign/Signal Violations Rate"
            metric={safetys?.sign_violations_rate || '-'}
          />
          <Subitem title="Distractions Rate" metric={safetys?.distractions_rate || '-'} />
          <Subitem
            title="Following Distance Rate"
            metric={safetys?.following_distance_rate || '-'}
          />
        </Box>
        <Typography variant="h6">Compliance</Typography>
        <Box sx={{ px: 3, py: 2 }}>
          <Subitem title="Breach of Contract" metric={safetys?.breach_of_contract || '-'} />
          <Subitem title="Comprehensive Audit (CAS)" metric={safetys?.comprehensive_audit || '-'} />
          <Subitem
            title="Working Hour Compliance"
            metric={safetys?.working_hour_compliance || '-'}
          />
        </Box>
      </Paper>
    </Grid>
    <Grid item lg={4} xs={12}>
      <Paper elevation={11} sx={{ padding: 3, borderRadius: '16px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: '24px',
          }}
        >
          <Typography variant="h5">Quality</Typography>
          {qualitys && <TierMetric value={qualitys.value} />}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Customer Delivery Experience</Typography>
          <Typography variant="h6" sx={{ color: '#38495c' }}>
            {qualitys?.customer_delivery_experience || '-'}
          </Typography>
        </Box>
        <Box sx={{ px: 3, py: 2 }}>
          <Subitem
            title="Customer Escalation Defect DPMO"
            metric={qualitys?.customer_escalation_defect || '-'}
          />
          <Subitem
            title="Customer Delivery Feedback"
            metric={qualitys?.customer_delivery_feedback || '-'}
            hex="#38495c"
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: '12px',
          }}
        >
          <Typography variant="h6">Delivery Completion Rate</Typography>
          <Typography variant="h6" sx={{ color: '#38495c' }}>
            {qualitys?.delivery_completion_rate || '-'}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: '12px',
          }}
        >
          <Typography variant="h6">Delivered and Recieved</Typography>
          <Typography variant="h6" sx={{ color: '#38495c' }}>
            {qualitys?.delivered_and_received || '-'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Standard Work Compliance</Typography>
          <Typography variant="h6" sx={{ color: '#38495c' }}>
            {qualitys?.standard_work_compliance || '-'}
          </Typography>
        </Box>
        <Box sx={{ px: 3, py: 2 }}>
          <Subitem title="Photo-On-Delivery" metric={qualitys?.photo_on_delivery || '-'} />
          <Subitem title="Contact Compliance" metric={qualitys?.contact_compliance || '-'} />
          <Subitem
            title="Attended Delivery Accuracy"
            metric={qualitys?.attended_delivery_accuracy || '-'}
          />
        </Box>
      </Paper>
    </Grid>
    <Grid item xs={12} lg={4}>
      <Paper elevation={11} sx={{ padding: 3, borderRadius: '16px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: '24px',
          }}
        >
          <Typography variant="h5">Team</Typography>
          {teams && <TierMetric value={teams.value} />}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: '12px',
          }}
        >
          <Typography variant="h6">High Performers Share</Typography>
          <Typography variant="h6" sx={{ color: '#38495c' }}>
            {teams?.high_performers_share || '-'}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: '12px',
          }}
        >
          <Typography variant="h6">Low Performers Share</Typography>
          <Typography variant="h6" sx={{ color: '#38495c' }}>
            {teams?.low_performers_share || '-'}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: '12px',
          }}
        >
          <Typography variant="h6">Tenured Workforce</Typography>
          <Typography variant="h6" sx={{ color: '#38495c' }}>
            {teams?.tenured_workforce || '-'}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  </Grid>
);
