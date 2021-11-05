import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const theme = createTheme();

const Login = () => {
  const [username, setUsername] = React.useState('');
  const [org, setOrg] = React.useState('org1');

  const handleChange = (event, newAlignment) => {
    setOrg(newAlignment);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // eslint-disable-next-line no-console
    console.log({
      username,
      org,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin='normal'
              required
              fullWidth
              id='username'
              label='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <br />
            <br />

            <ToggleButtonGroup
              color='primary'
              exclusive
              fullWidth
              value={org}
              onChange={handleChange}
            >
              <ToggleButton value='org1'>Organization 1</ToggleButton>
              <ToggleButton value='org2'>Organization 2</ToggleButton>
            </ToggleButtonGroup>

            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Link href='/register' variant='body2'>
              {"Don't have an account? Register Now"}
            </Link>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
