import { Box, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import {
  HitDataGridFilterResetButton,
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
} from './coaching-table-components/Metrics';
import { CustomHitDatagrid } from './custom-hitdatagrid/CustomHitDatagrid';

const MetricComponent = ({ column, value }: { column: string; value: number | string | null }) => {
  switch (column) {
    case 'swc_ad':
      return <AdMetric value={value} />;
    case 'cc':
      return <CcMetric value={value} />;
    case 'cc_o':
      return <CcOpsMetric value={value} />;
    case 'cdf':
      return <CdfMetric value={value} />;
    case 'ced':
      return <CedMetric value={value} />;
    case 'dcr':
      return <DcrMetric value={value} />;
    case 'dsb_dnr':
      return <DnrMetric value={value} />;
    case 'fico_score':
      return <FicoScoreMetric value={value} />;
    case 'pod':
      return <PodMetric value={value} />;
    default:
      return <Typography variant="subtitle2">{value}</Typography>;
  }
};

interface CoachingTableProps {
  data: any[];
  tableTab: string;
  tableWeekHeaders: {
    week1: string;
    week2: string;
    week3: string;
    week4: string;
    week5: string;
    week6: string;
  };
  onEmail: () => any;
}

export const CoachingTable: React.FC<CoachingTableProps> = ({
  data,
  onEmail,
  tableTab,
  tableWeekHeaders,
}) => {
  const hf = useForm();

  const columns = useColumns<(typeof data)[0]>(
    [
      {
        field: 'position',
        headerName: '#',
        type: 'string',
        valueGetter: (params) => params.row.id,
        maxWidth: 35,
      },
      {
        field: 'name',
        headerName: 'Name',
        type: 'string',
      },
      {
        field: 'week6',
        headerName: tableWeekHeaders.week6,
        type: 'string',
        maxWidth: 250,
        renderCell: (params) => <MetricComponent value={params.row.week6} column={tableTab} />,
      },
      {
        field: 'week5',
        headerName: tableWeekHeaders.week5,
        type: 'string',
        maxWidth: 250,
        renderCell: (params) => <MetricComponent value={params.row.week5} column={tableTab} />,
      },
      {
        field: 'week4',
        headerName: tableWeekHeaders.week4,
        type: 'string',
        maxWidth: 250,
        renderCell: (params) => <MetricComponent value={params.row.week4} column={tableTab} />,
      },
      {
        field: 'week3',
        headerName: tableWeekHeaders.week3,
        type: 'string',
        maxWidth: 250,
        renderCell: (params) => <MetricComponent value={params.row.week3} column={tableTab} />,
      },
      {
        field: 'week2',
        headerName: tableWeekHeaders.week2,
        type: 'string',
        maxWidth: 250,
        renderCell: (params) => <MetricComponent value={params.row.week2} column={tableTab} />,
      },
      {
        field: 'week1',
        headerName: tableWeekHeaders.week1,
        type: 'string',
        maxWidth: 250,
        renderCell: (params) => <MetricComponent value={params.row.week1} column={tableTab} />,
      },
    ],
    [tableTab]
  );

  return (
    <Box>
      <CustomHitDatagrid
        onEmail={onEmail}
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
        disableColumnFilter
      />
    </Box>
  );
};
