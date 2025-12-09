import { Collection, createMSWHandlers } from './utils';

let collection = new Collection([
  {
    id: 1,
    email: 'hit@hitocean.com',
    roles: ['super_admin'],
  },
  {
    id: 2,
    email: 'hit@hitocean.com',
    roles: ['super_admin'],
  },
]);

const handlers = createMSWHandlers('admin-users', collection).toArray();

export const adminUserHandlers = handlers;
