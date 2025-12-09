import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Box, Divider, MenuItem, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
// routes
import { PATHS } from '../../../routes/paths';
// auth
import { useAuthContext } from '../../../features/auth/useAuthContext';
// components
import { IoIosCard, IoMdInformationCircleOutline } from 'react-icons/io';
import { IoLogOutOutline } from 'react-icons/io5';
import { CustomRoleGuard } from 'src/components/custom-role-guard/CustomRoleGuard';
import { HeaderLink } from 'src/features/admin-info-update/components/HeaderLink';
import useSuperAdminCompanyInspect from 'src/hooks/useSuperAdminCompanyInspect';
import { IconButtonAnimate } from '../../../components/animate';
import { CustomAvatar } from '../../../components/custom-avatar';
import MenuPopover from '../../../components/menu-popover';
import { useSnackbar } from '../../../components/snackbar';

// ----------------------------------------------------------------------

const OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
  },
  {
    label: 'Profile',
    linkTo: '/',
  },
  {
    label: 'Settings',
    linkTo: '/',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();

  const { user, logout, roles } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const { isBeingInspected, handleOnCloseInspect } = useSuperAdminCompanyInspect();

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleLogout = async () => {
    try {
      logout();
      navigate(PATHS.auth.login, { replace: true });
      handleClosePopover();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  const handleClickItem = (path: string) => {
    handleClosePopover();
    navigate(path);
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpenPopover}
        sx={{
          p: 0,
          ...(openPopover && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <CustomAvatar src={user?.photoURL} alt={user?.displayName} name={user?.displayName} />
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 200, p: 0 }}>
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        {/* <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
              {option.label}
            </MenuItem>
          ))}
          </Stack>*/}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <CustomRoleGuard roles={['owner', 'admin']}>
          <MenuItem
            sx={{ m: 1 }}
            onClick={() => {
              navigate(PATHS.config.company.root);
              handleClosePopover();
            }}
          >
            <HeaderLink
              icon={<IoMdInformationCircleOutline size={22} />}
              to={PATHS.config.company.root}
              text="Company info"
            />
          </MenuItem>
        </CustomRoleGuard>
        <CustomRoleGuard roles={['owner', 'admin']}>
          <MenuItem
            sx={{ m: 1 }}
            onClick={() => {
              navigate(PATHS.config.company.plan);
              handleClosePopover();
            }}
          >
            <HeaderLink
              icon={<IoIosCard size={22} />}
              to={PATHS.config.company.plan}
              text="Plan info"
            />
          </MenuItem>
        </CustomRoleGuard>
        {isBeingInspected ? (
          <MenuItem onClick={handleOnCloseInspect} sx={{ m: 1 }}>
            <HeaderLink icon={<IoLogOutOutline size={22} />} text="Return to Panel" />
          </MenuItem>
        ) : (
          <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
            <HeaderLink icon={<IoLogOutOutline size={22} />} text="Logout" />
          </MenuItem>
        )}
      </MenuPopover>
    </>
  );
}
