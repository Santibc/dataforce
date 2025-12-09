import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';
//
import BackgroundIllustration from './BackgroundIllustration';

// ----------------------------------------------------------------------

function OrderCompleteIllustration({ ...other }: BoxProps) {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  const PRIMARY_DARKER = theme.palette.primary.darker;

  return (
    <Box {...other}>
      <svg width="100%" height="100%" viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg">
        <BackgroundIllustration />

        <image
          href="/assets/illustrations/characters/character_10.png"
          height="300"
          x="300"
          y="30"
        />




        <path
          fill="#fff"
          d="M254.289 279.577c23.907 0 43.288-19.381 43.288-43.288 0-23.908-19.381-43.289-43.288-43.289C230.381 193 211 212.381 211 236.289c0 23.907 19.381 43.288 43.289 43.288z"
        />

        <path
          fill="url(#paint3_linear_1_68)"
          d="M243.999 256.002l-15.183-16.746a3.15 3.15 0 01.214-4.444l4.219-3.833a3.146 3.146 0 014.444.214l9.144 10.065 25.184-23.417a3.149 3.149 0 014.444.16l3.876 4.176a3.146 3.146 0 01.843 2.255 3.148 3.148 0 01-1.004 2.189l-31.758 29.531a3.119 3.119 0 01-4.423-.15z"
        />

        <defs>
          <linearGradient
            id="paint0_linear_1_68"
            x1="267"
            x2="80.541"
            y1="272"
            y2="247.455"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={PRIMARY_MAIN} />
            <stop offset="1" stopColor={PRIMARY_DARK} />
          </linearGradient>

          <linearGradient
            id="paint1_linear_1_68"
            x1="80"
            x2="80"
            y1="155.117"
            y2="176.397"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={PRIMARY_LIGHT} />
            <stop offset="1" stopColor={PRIMARY_DARK} />
          </linearGradient>

          <linearGradient
            id="paint2_linear_1_68"
            x1="146.792"
            x2="146.792"
            y1="80"
            y2="97.537"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={PRIMARY_LIGHT} />
            <stop offset="1" stopColor={PRIMARY_DARK} />
          </linearGradient>

          <linearGradient
            id="paint3_linear_1_68"
            x1="228"
            x2="228"
            y1="217"
            y2="257"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={PRIMARY_LIGHT} />
            <stop offset="1" stopColor={PRIMARY_DARK} />
          </linearGradient>
        </defs>
      </svg>
    </Box>
  );
}

export default memo(OrderCompleteIllustration);
