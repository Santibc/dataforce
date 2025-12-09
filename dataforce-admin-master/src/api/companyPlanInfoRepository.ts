import { useQuery } from '@tanstack/react-query';
import { httpClient } from 'src/utils/httpClient';

export interface SubscriptionInfoResponse {
  id: number;
  status: StripeSubscriptionStatus;
  ends_at: null;
  seats: number;
}

export enum StripeSubscriptionStatus {
  incomplete = 'incomplete',
  incomplete_expired = 'incomplete_expired',
  trialing = 'trialing',
  active = 'active',
  past_due = 'past_due',
  canceled = 'canceled',
  unpaid = 'unpaid',
  paused = 'paused',
}

export class CompanyPlanInfoRepository {
  keys = {
    all: () => ['plan-info'],
    get: (id?: number) => ['plan-info', id],
    getCheckoutSignedUrl: () => ['checkout-signed-url'],
  };

  get = async () => {
    const { data } = await httpClient.get<SubscriptionInfoResponse>(
      `admin/companies/me/subscription`
    );
    return data;
  };

  getSubscriptionInfo = () =>
    httpClient.get<SubscriptionInfoResponse | null>(`admin/companies/me/subscription`);

  getCheckoutSignedUrl = async () => {
    const { data } = await httpClient.get<string>('admin/companies/me/stripe-checkout-url');
    return data;
  };

  getBillingPortalUrl = async () => {
    const { data } = await httpClient.get<string>('admin/companies/me/stripe-billing-portal-url');
    return data;
  };
}

const repo = new CompanyPlanInfoRepository();

export const useCompanyPlanInfoQuery = () =>
  useQuery({
    queryKey: repo.keys.get(),
    queryFn: () => repo.get(),
  });

export const useCheckoutSignedUrlQuery = () =>
  useQuery({
    queryKey: repo.keys.getCheckoutSignedUrl(),
    queryFn: () => repo.getCheckoutSignedUrl(),
  });
