/**
 * Every path that is used in the application must be added here. This way, if a path changes, it will be changed in one place only.
 */
export const PATHS = {
  path: '',
  'set-password': {
    root: '/set-password',
    set: (id: number | string) => `/set-password/${id}` as const,
  },
  'successfully-set-password': {
    root: '/successfully-set-password',
  },

  auth: {
    root: '/auth',
    login: '/auth/login',
    resetPassword: '/auth/reset-password',
    newPassword: '/auth/new-password',
    verify: '/auth/verify',
    register: '/auth/register',
    registerCompany: '/auth/register-company',
    passwordSuccessfullyReset: '/auth/password-successfully-reset',
  },
  config: {
    root: '/config',
    company: {
      root: '/config/company-info',
      plan: '/config/plan-info',
    },
  },
  superAdmin: {
    root: '/super-admin',
    view: '/super-admin/view',
    company: (id: number | string) => `/super-admin/company/${id}` as const,
    jobsite: (id: number | string) => `/super-admin/jobsite/${id}` as const,
    user: (id: number | string) => `/super-admin/user/${id}` as const,
    companyinfo: (id: number | string) => `/super-admin/companyinfo/${id}` as const,
  },
  dashboard: {
    root: '/dashboard',
    adminUsers: {
      root: '/dashboard/admin-users',
      list: '/dashboard/admin-users/list',
      create: '/dashboard/admin-users/create',
      edit: (id: number | string) => `/dashboard/admin-users/edit/${id}` as const,
    },
    users: {
      root: '/dashboard/users',
      list: '/dashboard/users/list',
      create: '/dashboard/users/create',
      edit: (id: number | string) => `/dashboard/users/edit/${id}` as const,
    },
    schedule: {
      root: '/dashboard/schedule',
    },
    positions: {
      root: '/dashboard/positions',
    },
    jobsites: {
      root: '/dashboard/jobsites',
      list: '/dashboard/jobsites/list',
      create: '/dashboard/jobsites/create',
      edit: (id: number | string) => `/dashboard/jobsites/edit/${id}` as const,
    },
    requestTimeOff: {
      root: '/dashboard/requesttimeoff',
    },
    coaching: {
      root: '/dashboard/coaching',
    },
    performance: {
      root: '/dashboard/performance',
      list: '/dashboard/performance/list',
      peek: (id: number | string) => `/dashboard/performance/peek/${id}` as const,
    },
    dashboardPerformance: {
      root: '/dashboard/performancedashboard',
    },
    documents: {
      root: '/dashboard/documents',
    },
  },
} as const;

/**
 * Every path that a role can access must be added here. Otherwise, the user will be redirected to the Not allowed page.
 */
export const PATHS_PER_ROLE = [
  {
    role: 'super_admin',
    paths: [
      PATHS.dashboard.root,
      PATHS['set-password'].root,
      PATHS['set-password'].set(':id'),
      PATHS.config.root,
      PATHS.config.company.root,
      PATHS.config.company.plan,
      PATHS.superAdmin.root,
      PATHS.superAdmin.view,
      PATHS.superAdmin.company(':id'),
      PATHS.superAdmin.jobsite(':id'),
      PATHS.superAdmin.user(':id'),
      PATHS.superAdmin.companyinfo(':id'),
    ],
  },
  {
    role: 'admin',
    paths: [
      PATHS.dashboard.root,
      PATHS.dashboard.adminUsers.root,
      PATHS.dashboard.adminUsers.list,
      PATHS.dashboard.adminUsers.create,
      PATHS.dashboard.adminUsers.edit(':id'),
      PATHS.dashboard.schedule.root,
      PATHS.dashboard.positions.root,
      PATHS.dashboard.jobsites.root,
      PATHS.dashboard.jobsites.list,
      PATHS.dashboard.jobsites.create,
      PATHS.dashboard.jobsites.edit(':id'),
      PATHS.dashboard.users.root,
      PATHS.dashboard.users.list,
      PATHS.dashboard.users.create,
      PATHS.dashboard.users.edit(':id'),
      PATHS.dashboard.requestTimeOff.root,
      PATHS.dashboard.coaching.root,
      PATHS.dashboard.performance.root,
      PATHS.dashboard.performance.list,
      PATHS.dashboard.performance.peek(':id'),
      PATHS.dashboard.dashboardPerformance.root,
      PATHS.dashboard.documents.root,
      PATHS['set-password'].root,
      PATHS['set-password'].set(':id'),
      PATHS['successfully-set-password'].root,
      PATHS.config.root,
      PATHS.config.company.root,
      PATHS.config.company.plan,
    ],
  },
];
