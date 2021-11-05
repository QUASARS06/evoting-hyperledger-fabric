import { Typography } from '@mui/material';
import React from 'react';
import Spinner from '../../layout/Spinner';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const RegisPhase = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 16,
          pb: 4,
        }}
        style={{ height: '83.5vh' }}
      >
        <Container maxWidth='sm'>
          <Typography
            component='h1'
            variant='h2'
            align='center'
            color='text.primary'
            gutterBottom
          >
            Registration Phase
          </Typography>
          <Typography
            variant='h5'
            align='center'
            color='text.secondary'
            paragraph
          >
            Voting Phase will begin Shortly.
          </Typography>
        </Container>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Spinner />
      </Box>
    </ThemeProvider>
  );
};

export default RegisPhase;
