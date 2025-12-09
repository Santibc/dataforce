import { Box, Popover, Typography } from '@mui/material';
import React, { FC } from 'react';
import { useNavigate } from 'react-router';
import { useAuthContext } from 'src/features/auth/useAuthContext';
import AnalyticsIcon from 'src/features/icons/AnalyticsIcon';
import Calendar from 'src/features/icons/Calendar';
import DashboardIcon from 'src/features/icons/DashboardIcon';
import FileIcon from 'src/features/icons/FileIcon';
import JobsitesIcon from 'src/features/icons/JobsitesIcon';
import MessageIcon from 'src/features/icons/MessageIcon';
import PositionsIcon from 'src/features/icons/PositionsIcon';
import RequestTimeOffIcon from 'src/features/icons/RequestTimeOffIcon';
import UserIcon from 'src/features/icons/UserIcon';
import { PATHS } from 'src/routes/paths';
import { NavMenuButton } from './NavMenuButton';
import { NavMenuButtonLink } from './NavMenuButtonLink';

interface NavMenuProps {}

export const NavMenu: FC<NavMenuProps> = (props) => {
  const auth = useAuthContext();

  if (auth.roles.includes('super_admin')) {
    return <NavMenuSuperAdmin />;
  }
  return <NavMenuCompany />;
};

const NavMenuCompany = () => {
  const [open, setOpen] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: 'flex',
        paddingX: '40px',
        gap: 2,
        background: 'white',
      }}
    >
      <Box>
        <NavMenuButton
          icon={<Calendar />}
          text="Scheduler"
          selected={open === 1}
          chevron
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
            setOpen(1);
          }}
        />
        <Popover
          open={open === 1}
          anchorEl={anchorEl}
          onClose={() => setOpen(0)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Typography sx={{ p: 2 }}>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
              onClick={() => {
                setOpen(0);
                setAnchorEl(null);
              }}
            >
              <NavMenuButtonLink
                to={PATHS.dashboard.schedule.root}
                text="Schedules"
                icon={<Calendar />}
              />
              <NavMenuButtonLink
                to={PATHS.dashboard.positions.root}
                text="Positions"
                icon={<PositionsIcon />}
              />
              <NavMenuButtonLink
                to={PATHS.dashboard.jobsites.list}
                text="Job sites"
                icon={<JobsitesIcon />}
              />
              <NavMenuButtonLink
                to={PATHS.dashboard.requestTimeOff.root}
                text="Time Off Requests"
                icon={<RequestTimeOffIcon />}
              />
            </Box>
          </Typography>
        </Popover>
      </Box>
      <Box>
        <NavMenuButton
          icon={<AnalyticsIcon />}
          text="Performance"
          selected={open === 2}
          chevron
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
            setOpen(2);
          }}
        />
        <Popover
          open={open === 2}
          anchorEl={anchorEl}
          onClose={() => setOpen(0)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Typography sx={{ p: 2 }}>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
              onClick={() => {
                setOpen(0);
                setAnchorEl(null);
              }}
            >
              <NavMenuButtonLink
                to={PATHS.dashboard.dashboardPerformance.root}
                text="Dashboard"
                icon={<DashboardIcon />}
              />
              <NavMenuButtonLink
                to={PATHS.dashboard.documents.root}
                text="Documents"
                icon={<FileIcon />}
              />
              <NavMenuButtonLink
                to={PATHS.dashboard.performance.list}
                text="Performance"
                icon={<AnalyticsIcon />}
              />
              <NavMenuButtonLink
                to={PATHS.dashboard.coaching.root}
                text="Coaching"
                icon={<MessageIcon />}
              />
            </Box>
          </Typography>
        </Popover>
      </Box>
      <Box>
        <NavMenuButton
          icon={<UserIcon />}
          text="Users"
          selected={open === 3}
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
            setOpen(3);
            navigate(PATHS.dashboard.users.list);
          }}
        />
      </Box>
    </Box>
  );
};

const NavMenuSuperAdmin = () => {
  const navigation = useNavigate();
  return (
    <Box
      sx={{
        display: 'flex',
        paddingX: '40px',
        gap: 2,
        background: 'white',
      }}
    >
      <Box>
        <NavMenuButton
          icon={<UserIcon />}
          text="Companies"
          selected
          onClick={(e) => {
            navigation(PATHS.superAdmin.root);
          }}
        />
      </Box>
    </Box>
  );
};
