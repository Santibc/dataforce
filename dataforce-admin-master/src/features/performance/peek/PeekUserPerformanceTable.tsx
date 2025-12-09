import { Box } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import {
  HitDataGridFilterResetButton,
  HitDatagrid,
  HitDatagridFilterSubmitButton,
  useColumns,
} from 'src/components/datagrid';
import { HitFormActions, HitFormGrid, HitTextField } from 'src/components/form';
import {
  AdMetric,
  CcMetric,
  CcOpsMetric,
  CdfMetric,
  CedMetric,
  DcrMetric,
  DnrMetric,
  FicoScoreMetric,
  PodMetric,
  TierMetric,
} from 'src/features/coaching/coaching-table-components/Metrics';
import { PerformanceUserPeek } from 'src/models/Performance';

interface PeekUserPerformanceTableProps {
  data: PerformanceUserPeek[];
}

export const PeekUserPerformanceTable: React.FC<PeekUserPerformanceTableProps> = ({ data }) => {
  const hf = useForm();
  const columns = useColumns<(typeof data)[0]>([
    {
      field: 'week',
      headerName: 'Week',
      type: 'string',
      maxWidth: 400,
      renderCell: (params) => `Week ${params.row.week}`,
    },
    {
      field: 'fico_score',
      headerName: 'Fico Score',
      type: 'string',
      maxWidth: 100,
      renderCell: (params) => <FicoScoreMetric value={params.row.fico_score} />,
    },
    {
      field: 'seatbelt_off_rate',
      headerName: 'Seatbelt Off Rate',
      type: 'string',
    },
    {
      field: 'speeding_event_ratio',
      headerName: 'Speeding Event Rate',
      type: 'string',
    },
    {
      field: 'distraction_rate',
      headerName: 'Distractions Rate',
      type: 'string',
    },
    {
      field: 'following_distance_rate',
      headerName: 'Following Distance Rate',
      type: 'string',
    },
    {
      field: 'signal_violations_rate',
      headerName: 'Sign/Signal Violations Rate',
      type: 'string',
    },
    {
      field: 'cdf',
      headerName: 'CDF',
      type: 'string',
      maxWidth: 70,
      renderCell: (params) => <CdfMetric value={params.row.cdf} />,
    },
    {
      field: 'dcr',
      headerName: 'DCR',
      type: 'string',
      maxWidth: 70,
      renderCell: (params) => <DcrMetric value={params.row.dcr} />,
    },
    {
      field: 'pod',
      headerName: 'POD',
      type: 'string',
      maxWidth: 70,
      renderCell: (params) => <PodMetric value={params.row.pod} />,
    },
    {
      field: 'cc',
      headerName: 'CC',
      type: 'string',
      maxWidth: 70,
      renderCell: (params) => <CcMetric value={params.row.cc} />,
    },
    {
      field: 'ced',
      headerName: 'CED',
      type: 'string',
      maxWidth: 70,
      renderCell: (params) => <CedMetric value={params.row.ced} />,
    },
    {
      field: 'swc_ad',
      headerName: 'AD',
      type: 'string',
      maxWidth: 70,
      renderCell: (params) => <AdMetric value={params.row.swc_ad} />,
    },
    {
      field: 'dsb_dnr',
      headerName: 'DNR',
      type: 'string',
      maxWidth: 70,
      renderCell: (params) => <DnrMetric value={params.row.dsb_dnr} />,
    },
    {
      field: 'cc_o',
      headerName: 'CC Ops',
      type: 'string',
      maxWidth: 70,
      renderCell: (params) => <CcOpsMetric value={params.row.cc_o} />,
    },
    {
      field: 'overall_tier',
      headerName: 'Overall Tier',
      type: 'string',
      renderCell: (params) => <TierMetric value={params.row.overall_tier} />,
      valueGetter: (params) => params.row.overall_tier,
      maxWidth: 105,
    },
  ]);

  return (
    <Box>
      <HitDatagrid
        filter={{
          hf,
          render: (
            <HitFormGrid>
              <Controller
                name="week"
                render={(field) => <HitTextField {...field} label="Week" />}
              />
              <HitFormActions>
                <HitDataGridFilterResetButton />
                <HitDatagridFilterSubmitButton />
              </HitFormActions>
            </HitFormGrid>
          ),
        }}
        rows={data}
        columns={columns}
      />
    </Box>
  );
};
