import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSuperAdminGetCompanyTokenMutation } from 'src/api/superAdminRepository';
import useLocalStorage from './useLocalStorage';

const useSuperAdminCompanyInspect = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { mutateAsync: getToken, isLoading } = useSuperAdminGetCompanyTokenMutation();
  const [inspectedCompany, setInspectedCompany] = useLocalStorage<{ id?: number; token?: string }>(
    'inspected_company',
    {}
  );
  const [adminAccessToken, setAdminAccessToken] = useLocalStorage<{ token?: string }>(
    'adminAccessToken',
    {}
  );

  useEffect(() => {
    if (localStorage.getItem('navigatePostReload') === 'true') {
      localStorage.removeItem('navigatePostReload');
      navigate('/dashboard/superadmin/view');
    }
  }, [navigate]);

  const handleOnInspect = async () => {
    const { token } = await getToken(Number(id));
    const accessToken = localStorage.getItem('accessToken') || '';
    setInspectedCompany({ id: Number(id), token });
    setAdminAccessToken({ token: accessToken });

    localStorage.setItem('accessToken', token);
    window.location.reload();
    window.location.href = '/';
  };

  const handleOnCloseInspect = () => {
    localStorage.setItem('accessToken', adminAccessToken.token || '');
    localStorage.setItem('navigatePostReload', 'true');
    localStorage.removeItem('inspected_company');
    localStorage.removeItem('adminAccessToken');
    window.location.reload();
  };

  return {
    isBeingInspected: Boolean(inspectedCompany.id),
    handleOnInspect,
    handleOnCloseInspect,
    isLoading,
  };
};

export default useSuperAdminCompanyInspect;
