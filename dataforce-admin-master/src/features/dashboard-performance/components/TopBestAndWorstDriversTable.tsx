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
import { BestAndWorstPerformances } from 'src/models/Performance';

interface TobBestDriversTableProps {
  data: BestAndWorstPerformances[];
}

export const TopBestAndWorstDriversTable: React.FC<TobBestDriversTableProps> = ({ data }) => {
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
      field: 'pod',
      headerName: 'POD',
      type: 'string',
      minWidth: 100,
      renderCell: (params) => <PodMetric value={params.row.pod} />,
    },
    {
      field: 'psb',
      headerName: 'PSB',
      type: 'string',
      minWidth: 125,
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
      minWidth: 80,
      renderCell: (params) => <CedMetric value={params.row.ced} />,
    },
    {
      field: 'swc_ad',
      headerName: 'AD',
      type: 'string',
      minWidth: 80,
      renderCell: (params) => <AdMetric value={params.row.swc_ad} />,
    },
    {
      field: 'dsb_dnr',
      headerName: 'DNR',
      type: 'string',
      minWidth: 80,
      renderCell: (params) => <DnrMetric value={params.row.dsb_dnr} />,
    },
    {
      field: 'cc_o',
      headerName: 'CC Ops',
      type: 'string',
      minWidth: 80,
      renderCell: (params) => <CcOpsMetric value={params.row.cc_o} />,
    },
    {
      field: 'overall_tier',
      headerName: 'Overall Tier',
      type: 'string',
      renderCell: (params) => <TierMetric value={params.row.overall_tier} />,
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
