import React from 'react';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Modal from '@mui/material/Modal';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import bjpimg from '../../images/bjp.jpeg';
import incimg from '../../images/inc.jpeg';
import ncpimg from '../../images/ncp.jpeg';
import aitcimg from '../../images/aitc.jpeg';
import ssimg from '../../images/ss.jpeg';
import notaimg from '../../images/nota.jpeg';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const VotingPhase = () => {
  const [open, setOpen] = React.useState(false);
  const [voteFor, setVoteFor] = React.useState('');
  const handleOpen = (p) => {
    setVoteFor(p);
    setOpen(true);
  };
  const handleClose = () => {
    setVoteFor('');
    setOpen(false);
  };

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

  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const handleVote = () => {
    console.log('Voting for ' + voteFor);

    const isAuthenticated = localStorage.getItem('jwttoken');
    const config = {
      headers: { Authorization: `Bearer ${isAuthenticated}` },
    };

    const bodyParameters = {
      fcn: 'voteCar',
      peers: ['peer0.org1.example.com', 'peer0.org2.example.com'],
      chaincodeName: 'fabcar',
      channelName: 'mychannel',
      args: [voteFor],
    };

    axios
      .post(
        'http://localhost:4000/channels/mychannel/chaincodes/fabcar',
        bodyParameters,
        config
      )
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err));
  };

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
                Voting Phase
              </Typography>
              <Typography
                variant='h5'
                align='center'
                color='text.secondary'
                paragraph
              >
                You can vote only once, So make your Vote carefully.
              </Typography>
            </Container>
          </Box>

          <Container maxWidth='lg'>
            {/* End hero unit */}
            <Grid container spacing={6}>
              {parties.map((party) => (
                <Grid item key={party.partyId} xs={12} sm={6} md={4}>
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
                    <CardActions>
                      <Button
                        variant='outlined'
                        size='large'
                        fullWidth
                        onClick={() => handleOpen(party.partyId)}
                      >
                        Vote
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>
        {/* Footer */}
        <Box sx={{ bgcolor: 'background.paper', p: 6 }} component='footer'>
          <Typography
            variant='subtitle1'
            align='center'
            color='text.secondary'
            component='p'
          >
            All Rights Reserved, 2021.
          </Typography>
        </Box>
        {/* End footer */}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style} textAlign='center'>
            <Typography id='modal-modal-title' variant='h6' component='h2'>
              You have opted to Vote for {voteFor}
            </Typography>
            <Typography id='modal-modal-description' sx={{ mt: 2 }}>
              Do you want to Confirm your selection?
            </Typography>

            <Button
              variant='outlined'
              color='success'
              startIcon={<DoneRoundedIcon />}
              sx={{ mt: 4 }}
              onClick={handleVote}
            >
              Confirm
            </Button>
          </Box>
        </Modal>
      </ThemeProvider>
    </div>
  );
};

export default VotingPhase;
