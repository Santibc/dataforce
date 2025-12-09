import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpClient } from 'src/utils/httpClient';

export interface ICreateSetPassword {
  password: string;
  token: string;
}

export const recievedSetPasswordMapper = (x: any): ICreateSetPassword => x;

export class SetPasswordRepository {
  keys = {
    all: () => ['setpassword'],
    one: (id: number) => ['setpassword', id],
  };

  create = (setpassword: ICreateSetPassword) => httpClient.post('set-password', setpassword);
}

const repo = new SetPasswordRepository();

export const useSetPasswordMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.create,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.all());
    },
  });
};
