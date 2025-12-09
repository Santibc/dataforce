import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { httpClient } from 'src/utils/httpClient';

export interface Performance {
  id: string | null;
  overall_tier: string | null;
  fico_score: string | null;
  seatbelt_off_rate: string | null;
  speeding_event_ratio: string | null;
  distraction_rate: string | null;
  following_distance_rate: string | null;
  signal_violations_rate: string | null;
  cdf: string | null;
  dcr: string | null;
  pod: string | null;
  cc: string | null;
  cc_o: string | null;
  ced: string | null;
  swc_ad: string | null;
  dsb_dnr: string | null;
  week: number;
  year: number;
}

export interface IRecievedCoaching {
  id: number;
  name: string;
  driver_amazon_id: string;
  performances: Performance[];
}

export interface IUpdateCoaching {
  subject: string;
  week: number;
  year: number;
  category: string;
  content: string;
  users: number[];
  type: 'congrats' | 'coach';
}

export const recievedCoachingMapper = (x: any): IRecievedCoaching => ({
  ...x,
  performances: x.performances.map((y: any) => ({ ...y, dnr: y.dsb_dnr })),
});

export class CoachingRepository {
  keys = {
    all: () => ['coaching'],
    one: (id: any) => ['coaching', id],
  };

  getAll = async () => {
    const { data } = await httpClient.get<any[]>(`admin/coaching`);
    return data.map(recievedCoachingMapper);
  };

  sendCoachingEmail = async (jobsite: IUpdateCoaching) =>
    httpClient.post(`admin/coaching`, jobsite);
}

const repo = new CoachingRepository();

export const useAllCoachingsQuery = () =>
  useQuery({
    queryKey: repo.keys.all(),
    queryFn: () => repo.getAll(),
  });

export const useSendCoachingEmailMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.sendCoachingEmail,
    onSuccess: () => {
      enqueueSnackbar('Email sent', { variant: 'success' });
    },
  });
};
