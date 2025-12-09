import React, { FC } from 'react';
import { Box, Checkbox, Typography, Popover } from '@mui/material';
import { WiTime3 } from 'react-icons/wi';
import { IoChevronDownOutline } from 'react-icons/io5';
import { IoWarning } from "react-icons/io5";
import { PopoverButton } from './PopoverButton';
import { useNavigate } from 'react-router';
import { PATHS } from 'src/routes/paths';
import { FaCheckCircle } from "react-icons/fa";


interface UserTableCheckboxProps {
  checked: boolean;
  userName: string;
  confirmedWeek: boolean;
  idUser: number;
  onCopy: () => void;
  onDelete: () => void;
  time: {
    totalHours?: number;
    hoursWorked?: number;
  };
  onClick: () => void;
}

export const UserTableCheckbox: FC<UserTableCheckboxProps> = ({ 
  checked, 
  userName, 
  time, 
  onClick, 
  onCopy, 
  onDelete, 
  idUser,
  confirmedWeek 
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();
  console.log(time.totalHours)

  return (
    <Box sx={{ display: 'flex',  alignItems: 'center' }}>
      <Checkbox checked={checked} onChange={onClick} />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography fontSize={'12px'} fontWeight={600} >{userName}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <WiTime3 fontSize={25} style={{ paddingRight: 2 }} />
          <Typography fontSize={'12px'} color={'#637381'} >{time.hoursWorked}</Typography>
          {
            (time.totalHours && time.totalHours != 8) && (
              <Typography fontSize={'12px'} mr={'5px'} color={'#637381'}>/{time.totalHours}</Typography>
            )
          }
          {
            (time.totalHours && time.hoursWorked) 
              && time.totalHours != 8
              && time.totalHours < time.hoursWorked 
                ? (
                  <IoWarning color="#B71D18" fontSize={22} />
                ) : <></>
          }
          {
            confirmedWeek && (
              <FaCheckCircle color="#1B806A" fontSize={16} style={{ marginRight: '5px' }} />
            )
          }
        </Box>
      </Box>
      <Box
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
          setOpen(true);
        }}
        sx={{ cursor: 'pointer', ml: 'auto' }}
      >
        <IoChevronDownOutline color="#212b36" fontSize={18} />
      </Box>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
          <PopoverButton text={`Copy ${userName}'s Previous Week`} onClick={() => { onCopy(); setOpen(false) }} />
          <PopoverButton text={`Edit ${userName}'s Details`} onClick={() => navigate(PATHS.dashboard.users.edit(idUser))} />
          <PopoverButton text={`Delete ${userName}'s Shifts`} onClick={() => { onDelete(); setOpen(false) }} />
        </Box>
      </Popover>
    </Box>
  );
};
