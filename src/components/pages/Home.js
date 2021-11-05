import React, { useState, Fragment, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Popover from '@mui/material/Popover';
import RegisPhase from './votingphase/RegisPhase';
import VotingPhase from './votingphase/VotingPhase';
import TallyPhase from './votingphase/TallyPhase';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const phaseStr = {
  'Phase I': 'Registration Phase',
  'Phase II': 'Voting Phase',
  'Phase III': 'Tally Phase',
};

const phaseComponents = {
  'Phase I': <RegisPhase />,
  'Phase II': <VotingPhase />,
  'Phase III': <TallyPhase />,
};

const Home = () => {
  const [phase, setPhase] = useState('Phase II');

  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const isAuthenticated = localStorage.getItem('jwttoken');

  useEffect(() => {
    //eslint-disable-next-line

    const config = {
      headers: { Authorization: `Bearer ${isAuthenticated}` },
      params: {
        args: [],
        peer: 'peer0.org1.example.com',
        fcn: 'queryPhase',
      },
    };

    axios
      .get('http://localhost:4000/channels/mychannel/chaincodes/fabcar', config)
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err));

    setPhase('Phase II');
  }, [isAuthenticated]);

  return (
    <Fragment>
      {isAuthenticated === null ? (
        <Navigate to='/login' />
      ) : (
        <ThemeProvider theme={theme}>
          <div>
            <Box sx={{ flexGrow: 1 }}>
              <AppBar position='fixed'>
                <Toolbar>
                  <Typography
                    variant='h6'
                    component='div'
                    aria-owns={open ? 'mouse-over-popover' : undefined}
                    aria-haspopup='true'
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                  >
                    {phase}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Typography>
                  <Popover
                    id='mouse-over-popover'
                    sx={{
                      pointerEvents: 'none',
                    }}
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                  >
                    <Typography sx={{ p: 1 }}>{phaseStr[phase]}</Typography>
                  </Popover>

                  <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                    Hyperledger Voting System
                  </Typography>

                  <VerifiedUserIcon sx={{ m: 1 }} />
                  <Typography>chiragjain291</Typography>
                </Toolbar>
              </AppBar>
              {phaseComponents[phase]}
            </Box>
          </div>
        </ThemeProvider>
      )}
    </Fragment>
  );
};

export default Home;
