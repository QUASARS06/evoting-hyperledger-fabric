import { Typography } from '@mui/material';
import React from 'react';

const Error = ({ error }) => {
  return (
    <div>
      <Typography sx={{ mt: 2 }} color='error'>
        {error}
      </Typography>
    </div>
  );
};

export default Error;
