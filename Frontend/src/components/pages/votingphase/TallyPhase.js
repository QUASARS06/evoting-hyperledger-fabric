import React, { useEffect, useState, Fragment } from 'react';
import { Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import Error from '../Error';

const options = {};

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const TallyPhase = () => {
  const [err, setErr] = useState(null);

  const [voteMap, setVoteMap] = useState({
    BJP: 0,
    INC: 0,
    NCP: 0,
    AITC: 0,
    SS: 0,
    NOTA: 0,
  });

  const [winner, setWinner] = useState('T.B.D');

  const data = {
    labels: ['BJP', 'INC', 'NCP', 'AITC', 'SS', 'NOTA'],
    datasets: [
      {
        label: 'No. of Votes',
        data: [
          voteMap['BJP'],
          voteMap['INC'],
          voteMap['NCP'],
          voteMap['AITC'],
          voteMap['SS'],
          voteMap['NOTA'],
        ],
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

  const isAuthenticated = localStorage.getItem('jwttoken');

  useEffect(() => {
    //eslint-disable-next-line

    if (!isAuthenticated) return;

    const config = {
      headers: { Authorization: `Bearer ${isAuthenticated}` },
      params: {
        args: JSON.stringify([]),
        peer: 'peer0.org1.example.com',
        fcn: 'getAllVotesClient',
      },
    };

    axios
      .get('http://localhost:4000/channels/mychannel/chaincodes/fabcar', config)
      .then((response) => {
        const votingData = JSON.parse(response.data.result.data);
        console.log(votingData);
        setErr(null);
        setVoteMap(votingData);
        let maxVotes = 0;
        let maxParty = '';

        Object.keys(votingData).forEach((key) => {
          if (votingData[key] > maxVotes) {
            maxVotes = votingData[key];
            maxParty = key;
          }
        });
        setWinner(maxParty);
      })
      .catch((err) => {
        setErr(err);
        console.log(err);
      });
  }, [isAuthenticated]);

  return (
    <Fragment>
      {err != null ? (
        <Error />
      ) : (
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
                  Election Winner is {winner}
                </Typography>
              </Container>
            </Box>
          </main>
          <div style={{ height: '500px', width: '50%', margin: '0 auto' }}>
            <Bar data={data} options={options} />
          </div>
        </ThemeProvider>
      )}
    </Fragment>
  );
};

export default TallyPhase;
