import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpClient} from 'app/main/services/httpClient';

export interface ICreateUserPreferences {
  available: boolean;
  date: string;
}

export interface IUpdateUserPreferences {
  id?: number;
  available: boolean;
  date: string;
}

export interface IRecievedUserPreferences {
  id: number;
  available: boolean;
  date: string;
}

export const recievedUserPreferencesMapper = (
  x: any,
): IRecievedUserPreferences => x;

export class UserPreferencesRepository {
  keys = {
    all: () => ['user-preferences'],
    one: (id: number) => ['user-preferences', id],
  };

  getAll = async ({from, to}: {from: string; to: string}) => {
    const data = await httpClient.get<any[]>(
      `user/preferences?from=${from}&to=${to}`,
    );
    return data.map(recievedUserPreferencesMapper);
  };

  update = async (jobsite: IUpdateUserPreferences[]) =>
    httpClient.post('user/preferences', {data: jobsite});

  repeatPreviousWeek = async (date: string) =>
    httpClient.post(`user/preferences/copy?date=${date}`);
}

const repo = new UserPreferencesRepository();

export const useAllUserPreferencesQuery = ({
  from,
  to,
}: {
  from: string;
  to: string;
}) =>
  useQuery({
    queryKey: repo.keys.all(),
    queryFn: () => repo.getAll({from, to}),
  });

export const useUpdateUserPreferencesMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.update,
    onSuccess: () => {
      qc.invalidateQueries({queryKey: repo.keys.all()});
    },
  });
};

export const useRepeatPreviousWeekUserPreferencesMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.repeatPreviousWeek,
    onSuccess: () => {
      qc.invalidateQueries({queryKey: repo.keys.all()});
    },
  });
};
