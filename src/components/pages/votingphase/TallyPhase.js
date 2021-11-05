import React from 'react';
import { Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Bar } from 'react-chartjs-2';

const data = {
  labels: ['BJP', 'INC', 'NCP', 'AITC', 'SS', 'NOTA'],
  datasets: [
    {
      label: 'No. of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const options = {};

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const TallyPhase = () => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main>
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 16,
              pb: 4,
            }}
          >
            <Container maxWidth='md'>
              <Typography
                component='h1'
                variant='h2'
                align='center'
                color='text.primary'
                gutterBottom
              >
                Election Winner is BJP
              </Typography>
            </Container>
          </Box>
        </main>
        <div style={{ height: '500px', width: '50%', margin: '0 auto' }}>
          <Bar data={data} options={options} />
        </div>
      </ThemeProvider>
    </div>
  );
};

export default TallyPhase;
