import {
  CompanyPlanInfoRepository,
  useCompanyPlanInfoQuery,
} from 'src/api/companyPlanInfoRepository';

const companyPlanRepo = new CompanyPlanInfoRepository();

const useAdminPlanInfo = () => {
  const { data, isLoading } = useCompanyPlanInfoQuery();

  const handleViewHistory = async () => {
    const data = await companyPlanRepo.getBillingPortalUrl();
    window.location.href = data;
  };

  return {
    data,
    isLoading,
    handlers: {
      handleViewHistory,
    },
  };
};

export default useAdminPlanInfo;
