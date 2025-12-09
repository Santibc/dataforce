import { Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

interface HeaderLinkProps {
    text: string;
    icon?: React.ReactNode;
    to?: string;
}

const LIGHT_SECONDARY = '#637381';

export const HeaderLink: React.FC<HeaderLinkProps> = ({ text, icon, to }) => {
    const location = useLocation();
    // Check if the current path includes link's "to" prop
    const isActive = to && location.pathname.includes(to); // Check if "to" is defined before checking isActive
    return (
        to ? (
            <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: isActive ? '' : LIGHT_SECONDARY }}>{icon}</Box>
                    <span style={{ color: isActive ? '' : LIGHT_SECONDARY }}>
                        {text}
                    </span>
                </Box>
            </Link>
        ) : (
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', color: isActive ? '' : LIGHT_SECONDARY }}>{icon}</Box>
                <span style={{ color: isActive ? '' : LIGHT_SECONDARY }}>
                    {text}
                </span>
            </Box>
        )
    );
};