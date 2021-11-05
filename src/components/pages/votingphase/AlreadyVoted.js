import React from 'react';
import { Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import bjpimg from '../../images/bjp.jpeg';
import incimg from '../../images/inc.jpeg';
import ncpimg from '../../images/ncp.jpeg';
import aitcimg from '../../images/aitc.jpeg';
import ssimg from '../../images/ss.jpeg';
import notaimg from '../../images/nota.jpeg';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const parties = [
  {
    partyName: 'Bharatiya Janata Party',
    partyId: 'BJP',
    partyLeader: 'J. P. Nadda',
    partyImgUrl: bjpimg,
  },
  {
    partyName: 'Indian National Congress',
    partyId: 'INC',
    partyLeader: 'Rahul Gandhi',
    partyImgUrl: incimg,
  },
  {
    partyName: 'Nationalist Congress Party',
    partyId: 'NCP',
    partyLeader: 'Sharad Pawar',
    partyImgUrl: ncpimg,
  },
  {
    partyName: 'All India Trinamool Congress',
    partyId: 'AITC',
    partyLeader: 'Mamata Banerjee',
    partyImgUrl: aitcimg,
  },
  {
    partyName: 'Shiv Sena',
    partyId: 'SS',
    partyLeader: 'Uddhav Thackeray',
    partyImgUrl: ssimg,
  },
  {
    partyName: 'None of the Above',
    partyId: 'NOTA',
    partyLeader: 'N.A.',
    partyImgUrl: notaimg,
  },
];

const party = parties[0];

const AlreadyVoted = () => {
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
                Thank You for Voting
              </Typography>
              <Typography
                variant='h5'
                align='center'
                color='text.secondary'
                paragraph
              >
                You have voted successfully for BJP.
              </Typography>
            </Container>
          </Box>

          <Container maxWidth='sm'>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div>
                <img
                  alt={party.partyId}
                  src={party.partyImgUrl}
                  style={{
                    width: '224px',
                    height: '224px',
                    padding: '24px',
                  }}
                />
              </div>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant='h5' component='h2'>
                  {party.partyName} <br />({party.partyId})
                </Typography>
                <br />
                <Typography variant='h6' component='h2'>
                  {party.partyLeader}
                </Typography>
              </CardContent>
            </Card>
          </Container>
        </main>
      </ThemeProvider>
    </div>
  );
};

export default AlreadyVoted;
