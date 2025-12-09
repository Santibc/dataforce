import {
  Box,
  Divider,
  Typography,
  Button,
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
} from '@mui/material';
import React, { FC } from 'react';
import { IoMdClose } from 'react-icons/io';

interface CopyPrevWeekOptionsProps {
  onSubmit: (option: keyof typeof COPY_PREVIOUS_WEEK_OPTIONS) => void;
  onClose: () => void;
  weeks: 2 | 1 | 0;
}

export const COPY_PREVIOUS_WEEK_OPTIONS = {
  ALLOW_CONFLICTS: 'ALLOW_CONFLICTS' as const,
  AVOID_CONFLICTS: 'AVOID_CONFLICTS' as const,
  OVERWRITE_CONFLICTS: 'OVERWRITE_CONFLICTS' as const,
} as const;

export const CopyPrevWeekOptions: FC<CopyPrevWeekOptionsProps> = ({ onSubmit, onClose, weeks }) => {
  const [value, setValue] = React.useState<keyof typeof COPY_PREVIOUS_WEEK_OPTIONS>(
    COPY_PREVIOUS_WEEK_OPTIONS.ALLOW_CONFLICTS
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(
      (event.target as HTMLInputElement).value as unknown as keyof typeof COPY_PREVIOUS_WEEK_OPTIONS
    );
  };
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      width="100%"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" pb="1rem" width="100%">
        <Typography variant="h4">Copy Previous {weeks === 2 ? 'Weeks' : weeks === 1 ? 'Week' : 'Day'}</Typography>
        <IoMdClose size={20} color="#637381" onClick={onClose} cursor="pointer" />
      </Box>
      <Divider sx={{ height: 1, width: 1 }} />
      <Box
        sx={{
          py: 5,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <FormControl>
          <Typography variant="h4" sx={{ pb: 5 }}>
            How would you like to copy the previous {weeks === 2 ? 'weeks' : weeks === 1 ? 'week' : 'day'}?
          </Typography>

          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={value}
            onChange={handleChange}
            sx={{}}
          >
            {/* <FormControlLabel
              value={COPY_PREVIOUS_WEEK_OPTIONS.ALLOW_CONFLICTS}
              control={<Radio />}
              label="Allow conflicts"
            /> */}
            <FormControlLabel
              value={COPY_PREVIOUS_WEEK_OPTIONS.AVOID_CONFLICTS}
              control={<Radio />}
              label="Avoid conflicts"
            />
            <FormControlLabel
              value={COPY_PREVIOUS_WEEK_OPTIONS.OVERWRITE_CONFLICTS}
              control={<Radio />}
              label="Overwrite conflicts"
            />
          </RadioGroup>
        </FormControl>
      </Box>
      <Divider sx={{ height: 1, width: 1 }} />
      <Box
        pt="2rem"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        width="100%"
        gap={2}
      >
        <Button variant="outlined" sx={{ padding: '1rem', fontSize: 16 }} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ padding: '1rem', fontSize: 16 }}
          onClick={() => onSubmit(value)}
        >
          Create shifts
        </Button>
      </Box>
    </Box>
  );
};
