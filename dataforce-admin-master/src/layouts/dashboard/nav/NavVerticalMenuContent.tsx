import { Box, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';
import { NavVerticalMenuButton } from './NavVerticalMenuButton';
import Calendar from 'src/features/icons/Calendar';
import { useNavigate } from 'react-router';
import { PATHS } from 'src/routes/paths';
import UserIcon from 'src/features/icons/UserIcon';
import { NavMenuButtonLink } from './NavMenuButtonLink';
import PositionsIcon from 'src/features/icons/PositionsIcon';
import JobsitesIcon from 'src/features/icons/JobsitesIcon';
import RequestTimeOffIcon from 'src/features/icons/RequestTimeOffIcon';
import DashboardIcon from 'src/features/icons/DashboardIcon';
import FileIcon from 'src/features/icons/FileIcon';
import AnalyticsIcon from 'src/features/icons/AnalyticsIcon';
import MessageIcon from 'src/features/icons/MessageIcon';

export const NavVerticalMenuContent = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(0);
    const navigate = useNavigate();

    const handleOpen = (event: any, menuNumber: any) => {
        setAnchorEl(event.currentTarget);
        setOpen(menuNumber);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpen(0);
    };
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                gap: 1,
            }}
        >
            <Typography variant="overline" color="grey" sx={{ paddingX: 3 }}>
                BOSMETRICS
            </Typography>
            <Box>
                <NavVerticalMenuButton
                    icon={<Calendar style={{ transform: 'scale(1.5)', width: 24, height: 24 }} />}
                    text="Scheduler"
                    selected={open === 1}
                    chevron
                    onClick={(e) => handleOpen(e, 1)}
                    sx={{ paddingY: 1, justifyContent: 'flex-start', paddingX: 3, fontSize: 20 }}
                />
                <Menu
                    open={open === 1}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={() => {
                        navigate(PATHS.dashboard.schedule.root);
                        handleClose();
                    }}>
                        <NavMenuButtonLink
                            to={PATHS.dashboard.schedule.root}
                            text="Schedules"
                            icon={<Calendar />}
                        />
                    </MenuItem>
                    <MenuItem onClick={() => {
                        navigate(PATHS.dashboard.positions.root);
                        handleClose();
                    }}>
                        <NavMenuButtonLink
                            to={PATHS.dashboard.positions.root}
                            text="Positions"
                            icon={<PositionsIcon />}
                        />
                    </MenuItem>
                    <MenuItem onClick={() => {
                        navigate(PATHS.dashboard.jobsites.list);
                        handleClose();
                    }}>
                        <NavMenuButtonLink
                            to={PATHS.dashboard.jobsites.list}
                            text="Job sites"
                            icon={<JobsitesIcon />}
                        />
                    </MenuItem>
                    <MenuItem onClick={() => {
                        navigate(PATHS.dashboard.requestTimeOff.root);
                        handleClose();
                    }}>
                        <NavMenuButtonLink
                            to={PATHS.dashboard.requestTimeOff.root}
                            text="Time Off Requests"
                            icon={<RequestTimeOffIcon />}
                        />
                    </MenuItem>
                </Menu>
            </Box>
            <Box>
                <NavVerticalMenuButton
                    icon={<AnalyticsIcon style={{ transform: 'scale(1.2)', width: 24, height: 24 }} />}
                    text="Performance"
                    selected={open === 2}
                    chevron
                    onClick={(e) => handleOpen(e, 2)}
                    sx={{ paddingY: 1, justifyContent: 'flex-start', paddingX: 3, fontSize: 20 }}
                />
                <Menu
                    open={open === 2}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    sx={{ paddingY: 1, justifyContent: 'flex-start', paddingX: 3 }}
                >
                    <MenuItem onClick={() => {
                        navigate(PATHS.dashboard.dashboardPerformance.root);
                        handleClose();
                    }}>
                        <NavMenuButtonLink
                            to={PATHS.dashboard.dashboardPerformance.root}
                            text="Dashboard"
                            icon={<DashboardIcon />}
                        />
                    </MenuItem>
                    <MenuItem onClick={() => {
                        navigate(PATHS.dashboard.documents.root);
                        handleClose();
                    }}>
                        <NavMenuButtonLink
                            to={PATHS.dashboard.documents.root}
                            text="Documents"
                            icon={<FileIcon />}
                        />
                    </MenuItem>
                    <MenuItem onClick={() => {
                        navigate(PATHS.dashboard.performance.list);
                        handleClose();
                    }}>
                        <NavMenuButtonLink
                            to={PATHS.dashboard.performance.list}
                            text="Performance"
                            icon={<AnalyticsIcon />}
                        />
                    </MenuItem>
                    <MenuItem onClick={() => {
                        navigate(PATHS.dashboard.coaching.root);
                        handleClose();
                    }}>
                        <NavMenuButtonLink
                            to={PATHS.dashboard.coaching.root}
                            text="Coaching"
                            icon={<MessageIcon />}
                        />
                    </MenuItem>
                </Menu>
            </Box>
            <Box>
                <NavVerticalMenuButton
                    icon={<UserIcon style={{ transform: 'scale(1.5)', width: 24, height: 24 }} />}
                    text="Users"
                    selected={open === 3}
                    onClick={(e) => {
                        setAnchorEl(e.currentTarget);
                        setOpen(3);
                        navigate(PATHS.dashboard.users.list);
                    }}
                    sx={{ paddingY: 1, justifyContent: 'flex-start', paddingX: 3 }}
                />
            </Box>
        </Box>
    );
};
