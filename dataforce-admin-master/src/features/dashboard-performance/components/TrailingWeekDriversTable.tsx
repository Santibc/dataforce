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
  CdfMetric,
  DSBMetric,
  DcrMetric,
  FicoScoreMetric,
  PodMetric,
  TierMetric,
} from 'src/features/coaching/coaching-table-components/Metrics';
import { BelowStandardPerformances } from 'src/models/Performance';

interface TrailingWeekDriversTableProps {
  data: BelowStandardPerformances[];
}

export const TrailingWeekDriversTable: React.FC<TrailingWeekDriversTableProps> = ({ data }) => {
  const hf = useForm();

  const columns = useColumns<(typeof data)[0]>([
    {
      field: 'id',
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
      field: 'dsb',
      headerName: 'DSB',
      type: 'string',
      minWidth: 100,
      renderCell: (params) => <DSBMetric value={params.row.dsb} />,
    },
    {
      field: 'swc_pod',
      headerName: 'SWC POD',
      type: 'string',
      minWidth: 100,
      renderCell: (params) => <PodMetric value={params.row.swc_pod} />,
    },
    {
      field: 'psb',
      headerName: 'PSB',
      type: 'string',
      minWidth: 125,
    },
    {
      field: 'swc_cc',
      headerName: 'SWC CC',
      type: 'string',
      minWidth: 80,
      renderCell: (params) => <CcMetric value={params.row.swc_cc} />,
    },
    {
      field: 'swc_ad',
      headerName: 'AD',
      type: 'string',
      minWidth: 80,
      renderCell: (params) => <AdMetric value={params.row.swc_ad} />,
    },

    {
      field: 'performer_status',
      headerName: 'Performer Status',
      type: 'string',
      renderCell: (params) => <TierMetric value={params.row.performer_status} />,
      minWidth: 125,
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
                name="name"
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
