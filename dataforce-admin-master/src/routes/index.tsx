import { createHashRouter, Navigate, Outlet, RouteObject } from 'react-router-dom';
// auth
import AuthGuard from '../features/auth/AuthGuard';
import GuestGuard from '../features/auth/GuestGuard';
// layouts
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config';

import App from 'src/App';

import { ElementType, lazy, Suspense } from 'react';
import LoadingScreen from 'src/components/loading-screen';
import { LoadingSpinner } from 'src/components/loading-spinner';
import { AdminInfoUpdatePage } from 'src/features/admin-info-update/AdminInfoUpdatePage';
import AdminPlanInfoPage from 'src/features/admin-plan-info/AdminPlanInfoPage';
import { SuccessUserResetPasswordPage } from 'src/features/auth/login/reset-password-user/SuccessUserResetPasswordPage';
import UserResetPasswordPage from 'src/features/auth/login/reset-password-user/UserResetPasswordPage';
import { RegisterCompanyPage } from 'src/features/auth/register-company/RegisterCompanyPage';
import RoleBasedGuard from 'src/features/auth/RoleBasedGuard';
import { SetPasswordPage } from 'src/features/auth/set-password/SetPasswordPage';
import { SuccessSetPasswordPage } from 'src/features/auth/set-password/SuccessSetPasswordPage';
import StripeGuard from 'src/features/auth/StripeGuard';
import { CoachingPage } from 'src/features/coaching/CoachingPage';
import { DashboardPerformancePage } from 'src/features/dashboard-performance/DashboardPerformancePage';
import { DocumentsPage } from 'src/features/documents/DocumentsPage';
import { CreateJobsitePage } from 'src/features/jobsites/create/CreateJobsitePage';
import { EditJobsitePage } from 'src/features/jobsites/edit/EditJobsitePage';
import { JobsitesPage } from 'src/features/jobsites/JobsitesPage';
import { PeeekUserPerformancePage } from 'src/features/performance/peek/PeekUserPerformancePage';
import { PerformancePage } from 'src/features/performance/PerformancePage';
import { PositionsPage } from 'src/features/positions/PositionsPage';
import { SchedulerMain } from 'src/features/scheduler/SchedulerMain';
import { SuperAdminCompanyPage } from 'src/features/super-admin-companies/company/SuperAdminCompanyPage';
import { SuperAdminInfoUpdatePage } from 'src/features/super-admin-companies/super-admin-edit-company-info/SuperAdminInfoUpdatePage';
import { SuperAdminEditJobsitePage } from 'src/features/super-admin-companies/super-admin-edit-jobsite/SuperAdminEditJobsite';
import { SuperAdminEditUserPage } from 'src/features/super-admin-companies/super-admin-edit-user/SuperAdminEditUserPage';
import { SuperAdminCompaniesPage } from 'src/features/super-admin-companies/SuperAdminCompaniesPage';
import { CreateUserPage } from 'src/features/users/create/CreateUserPage';
import { EditUserPage } from 'src/features/users/edit/EditUserPage';
import { UsersPage } from 'src/features/users/UsersPage';
import ErrorPage from 'src/pages/ErrorPage';
import NotAllowedPage from 'src/pages/NotAllowedPage';
import { DeleteAccountPage } from 'src/pages/DeleteAccountPage';
import { PrivacyPolicyPage } from 'src/pages/PrivacyPolicyPage';

/**
 * This will show a full screen spinner while the component is loading.
 * It is meant to we used for pages
 */
const withLoadingScreen = (Component: ElementType) => (props: any) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

/**
 * This will show a spinner while the component is loading
 * It is meant to we used for components where you do not want to block the whole page
 */
const withLoadingSpinner = (Component: ElementType) => (props: any) =>
  (
    <Suspense fallback={<LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  );

const LazyPage404 = withLoadingScreen(lazy(() => import('../pages/Page404')));
const LazyLoginPage = withLoadingScreen(lazy(() => import('src/features/auth/login/LoginPage')));
const LazySuccessPaymentPage = withLoadingScreen(
  lazy(() => import('src/pages/SuccessPaymentPage'))
);
const LazyWarningPaymentPage = withLoadingScreen(
  lazy(() => import('src/pages/WarningPaymentPage'))
);
const LazyResetPasswordPage = withLoadingScreen(
  lazy(() => import('src/features/auth/reset-password/ResetPasswordPage'))
);
const LazyNewPasswordPage = withLoadingScreen(
  lazy(() => import('src/features/auth/new-password/NewPasswordPage'))
);
const LazyVerifyCodePage = withLoadingScreen(
  lazy(() => import('src/features/auth/verify-code/VerifyCodePage'))
);
const LazyAdminUsersListPage = withLoadingSpinner(
  lazy(() => import('src/features/admin-user-crud/AdminUserListPage'))
);
const LazyAdminUsersCreatePage = withLoadingSpinner(
  lazy(() => import('src/features/admin-user-crud/AdminUserCreatePage'))
);
const LazyAdminUsersEditPage = withLoadingSpinner(
  lazy(() => import('src/features/admin-user-crud/AdminUserEditPage'))
);

const ROUTES: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
      { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
      { path: 'delete-account', element: <DeleteAccountPage /> },

      { path: 'set-password/:id', element: <SetPasswordPage /> },
      { path: 'successfully-set-password', element: <SuccessSetPasswordPage /> },
      {
        path: 'auth',
        element: (
          <GuestGuard>
            <Outlet />
          </GuestGuard>
        ),
        children: [
          {
            path: 'login',
            element: <LazyLoginPage />,
            errorElement: <ErrorPage />,
          },
          {
            path: 'register-company',
            element: <RegisterCompanyPage />,
          },
          { path: 'password-successfully-reset', element: <SuccessUserResetPasswordPage /> },
          {
            element: <CompactLayout />,
            children: [
              { path: 'reset-password/:token', element: <UserResetPasswordPage /> },
              { path: 'reset-password', element: <LazyResetPasswordPage /> },
              { path: 'new-password', element: <LazyNewPasswordPage /> },
              { path: 'verify', element: <LazyVerifyCodePage /> },
            ],
          },
          { element: <Navigate to="login" replace />, index: true },
        ],
      },
      {
        path: 'super-admin',
        errorElement: <ErrorPage />,
        element: (
          <AuthGuard>
            <RoleBasedGuard>
              <DashboardLayout />
            </RoleBasedGuard>
          </AuthGuard>
        ),
        children: [
          { element: <Navigate to="/super-admin/view" replace />, index: true },
          { path: 'view', element: <SuperAdminCompaniesPage /> },
          { path: 'company/:id', element: <SuperAdminCompanyPage /> },
          { path: 'jobsite/:id', element: <SuperAdminEditJobsitePage /> },
          { path: 'user/:id', element: <SuperAdminEditUserPage /> },
          { path: 'companyinfo/:id', element: <SuperAdminInfoUpdatePage /> },
        ],
      },

      {
        path: 'dashboard',
        errorElement: <ErrorPage />,
        element: (
          <AuthGuard>
            <RoleBasedGuard>
              <StripeGuard>
                <DashboardLayout />
              </StripeGuard>
            </RoleBasedGuard>
          </AuthGuard>
        ),
        children: [
          { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
          {
            path: 'admin-users',
            children: [
              { element: <Navigate to="/dashboard/admin-users/list" replace />, index: true },
              { path: 'list', element: <LazyAdminUsersListPage /> },
              { path: 'create', element: <LazyAdminUsersCreatePage /> },
              { path: 'edit/:id', element: <LazyAdminUsersEditPage /> },
            ],
          },
          {
            path: 'users',
            children: [
              { element: <Navigate to="/dashboard/users/list" replace />, index: true },
              { path: 'list', element: <UsersPage /> },
              { path: 'create', element: <CreateUserPage /> },
              { path: 'edit/:id', element: <EditUserPage /> },
            ],
          },
          {
            path: 'schedule',
            element: <SchedulerMain />,
          },
          {
            path: 'positions',
            element: <PositionsPage />,
          },
          {
            path: 'jobsites',
            children: [
              { element: <Navigate to="/dashboard/jobsites/list" replace />, index: true },
              { path: 'list', element: <JobsitesPage /> },
              { path: 'create', element: <CreateJobsitePage /> },
              { path: 'edit/:id', element: <EditJobsitePage /> },
            ],
          },

          {
            path: 'coaching',
            element: <CoachingPage />,
          },
          {
            path: 'performance',
            children: [
              { element: <Navigate to="/dashboard/performance/list" replace />, index: true },
              { path: 'list', element: <PerformancePage /> },
              { path: 'peek/:id', element: <PeeekUserPerformancePage /> },
            ],
          },
          {
            path: 'performancedashboard',
            element: <DashboardPerformancePage />,
          },
          {
            path: 'documents',
            element: <DocumentsPage />,
          },
        ],
      },
      {
        path: 'config',
        errorElement: <ErrorPage />,
        element: (
          <AuthGuard>
            <RoleBasedGuard>
              <StripeGuard>
                <DashboardLayout />
              </StripeGuard>
            </RoleBasedGuard>
          </AuthGuard>
        ),
        children: [
          {
            path: 'company-info',
            element: <AdminInfoUpdatePage />,
          },
          {
            path: 'plan-info',
            element: <AdminPlanInfoPage />,
          },
        ],
      },

      {
        element: <CompactLayout />,
        children: [
          { path: '404', element: <LazyPage404 /> },
          { path: 'not-allowed', element: <NotAllowedPage /> },
          { path: 'success-payment', element: <LazySuccessPaymentPage /> },
          { path: 'warning-payment', element: <LazyWarningPaymentPage /> },
        ],
      },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
];

export const router = createHashRouter(ROUTES);
