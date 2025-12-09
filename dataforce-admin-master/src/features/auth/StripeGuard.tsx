import React from 'react';
import { Navigate } from 'react-router-dom';
import { StripeSubscriptionStatus } from 'src/api/companyPlanInfoRepository';
import { useAuthContext } from './useAuthContext';

const StripeGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { stripeSubscriptionStatus } = useAuthContext();

  if (stripeSubscriptionStatus !== StripeSubscriptionStatus.active) {
    return <Navigate to="/warning-payment" />;
  }

  return <>{children}</>;
};

export default StripeGuard;
