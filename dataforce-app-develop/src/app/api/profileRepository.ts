import {useMutation} from '@tanstack/react-query';
import {httpClient} from 'app/main/services/httpClient';

export class ProfileRepository {
  keys = {
    me: () => ['users'],
  };

  delete = (user_id: string | number) =>
    httpClient.delete(`user/user/${user_id}`);
}
export const profileRepo = new ProfileRepository();

export const useDeleteUserMutation = () => {
  return useMutation({
    mutationFn: profileRepo.delete,
  });
};
