import React, { Fragment } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import Error from '../layout/Error';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Register = () => {
  const [username, setUsername] = React.useState('');
  const [org, setOrg] = React.useState('Org1');
  const [err, setErr] = React.useState('');

  const handleChange = (event, newAlignment) => {
    setOrg(newAlignment);
  };

  const setError = (errMsg) => {
    setErr(errMsg);
    setTimeout(() => {
      setErr('');
    }, 2000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (username.trim() === '') {
      setError('Username cannot be Empty.');
      return;
    }

    // eslint-disable-next-line no-console
    const bodyParameters = {
      username: username,
      orgName: org,
    };

    axios
      .post('http://localhost:4000/register', bodyParameters)
      .then((response) => {
        const res = response.data;
        console.log(res);

        if (res.success) {
          console.log(res.token);
          localStorage.setItem('jwttoken', res.token);
          localStorage.setItem('username', username);
          localStorage.setItem('org', org);
          window.location.reload();
        } else {
          setError(res.message);
        }
      })
      .catch((err) => console.log(err));

    console.log(bodyParameters);
  };

  const isAuthenticated = localStorage.getItem('jwttoken');

  return (
    <Fragment>
      {isAuthenticated !== null ? (
        <Navigate to='/' />
      ) : (
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
                Register With Organization
              </Typography>
              {err.trim() !== '' ? <Error error={err} /> : false}
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
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  <ToggleButton value='Org1'>Organization 1</ToggleButton>
                  <ToggleButton value='Org2'>Organization 2</ToggleButton>
                </ToggleButtonGroup>

                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  sx={{ mt: 3, mb: 2 }}
                >
                  Register
                </Button>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      )}
    </Fragment>
  );
};

export default Register;
