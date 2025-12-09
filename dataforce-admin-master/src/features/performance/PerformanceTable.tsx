import { Box, IconButton } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import {
  HitDataGridFilterResetButton,
  HitDatagrid,
  HitDatagridFilterSubmitButton,
  useColumns,
} from 'src/components/datagrid';
import { HitFormActions, HitFormGrid, HitTextField } from 'src/components/form';
import Iconify from 'src/components/iconify';
import { LastWeekPerformance } from 'src/models/Performance';
import { PATHS } from 'src/routes/paths';
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
} from '../coaching/coaching-table-components/Metrics';

interface PerformanceTableProps {
  data: LastWeekPerformance[];
}

export const compareValues = (v1: string, v2: string, order: string[]) =>
  order.indexOf(v1) - order.indexOf(v2);

export const PerformanceTable: React.FC<PerformanceTableProps> = ({ data }) => {
  const hf = useForm();
  const navigate = useNavigate();

  const columns = useColumns<(typeof data)[0]>([
    {
      field: 'user_id',
      headerName: '#',
      type: 'string',
      minWidth: 80,
    },
    {
      field: 'user_name',
      headerName: 'Name',
      type: 'string',
      minWidth: 125,
    },
    {
      field: 'fico_score',
      headerName: 'Fico Score',
      type: 'string',
      minWidth: 125,
      renderCell: (params) => <FicoScoreMetric value={params.row.fico_score} />,
    },
    {
      field: 'seatbelt_off_rate',
      headerName: 'Seatbelt Off Rate',
      type: 'string',
      minWidth: 125,
    },
    {
      field: 'speeding_event_ratio',
      headerName: 'Speeding Event Rate',
      type: 'string',
      minWidth: 125,
    },
    {
      field: 'distraction_rate',
      headerName: 'Distractions Rate',
      type: 'string',
      minWidth: 125,
    },
    {
      field: 'following_distance_rate',
      headerName: 'Following Distance Rate',
      type: 'string',
      minWidth: 125,
    },
    {
      field: 'signal_violations_rate',
      headerName: 'Sign/Signal Violations Rate',
      type: 'string',
      minWidth: 125,
    },
    {
      field: 'cdf',
      headerName: 'CDF',
      type: 'string',
      minWidth: 100,
      renderCell: (params) => <CdfMetric value={params.row.cdf} />,
    },
    {
      field: 'dcr',
      headerName: 'DCR',
      type: 'string',
      minWidth: 100,
      renderCell: (params) => <DcrMetric value={params.row.dcr} />,
    },
    {
      field: 'pod',
      headerName: 'POD',
      type: 'string',
      minWidth: 100,
      renderCell: (params) => <PodMetric value={params.row.pod} />,
    },
    {
      field: 'cc',
      headerName: 'CC',
      type: 'string',
      minWidth: 100,
      renderCell: (params) => <CcMetric value={params.row.cc} />,
    },
    {
      field: 'ced',
      headerName: 'CED',
      type: 'string',
      renderCell: (params) => <CedMetric value={params.row.ced} />,
      minWidth: 80,
    },
    {
      field: 'swc_ad',
      headerName: 'AD',
      type: 'string',
      renderCell: (params) => <AdMetric value={params.row.swc_ad} />,
      minWidth: 80,
    },
    {
      field: 'dsb_dnr',
      headerName: 'DNR',
      type: 'string',
      renderCell: (params) => <DnrMetric value={params.row.dsb_dnr} />,
      minWidth: 80,
    },
    {
      field: 'cc_o',
      headerName: 'CC Ops',
      type: 'string',
      renderCell: (params) => <CcOpsMetric value={params.row.cc_o} />,
      minWidth: 80,
    },
    {
      field: 'overall_tier',
      headerName: 'Overall Tier',
      type: 'string',
      renderCell: (params) => <TierMetric value={params.row.overall_tier} />,
      sortComparator: (v1, v2) => compareValues(v1, v2, ['Fantastic', 'Great', 'Fair', 'Poor']),
      minWidth: 125,
    },
    {
      field: 'action',
      headerName: ' ',
      type: 'actions',
      minWidth: 70,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={(e) => {
              navigate(PATHS.dashboard.performance.peek(params.row.user_id));
            }}
          >
            <Iconify icon="eva:eye-fill" />
          </IconButton>
        </>
      ),
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
                name="user_name"
                render={(field) => <HitTextField {...field} label="Name" />}
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
