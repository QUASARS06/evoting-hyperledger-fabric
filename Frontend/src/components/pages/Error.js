import { Typography } from '@mui/material';
import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import CachedIcon from '@mui/icons-material/Cached';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Error = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 16,
          pb: 4,
        }}
        style={{ height: '81.5vh' }}
      >
        <Container maxWidth='sm'>
          <Typography
            component='h1'
            variant='h2'
            align='center'
            color='text.primary'
            gutterBottom
          >
            Something Went Wrong !!!
          </Typography>
          <Typography
            variant='h5'
            align='center'
            color='text.secondary'
            paragraph
          >
            Please reload the page.
          </Typography>
        </Container>

        <Button
          variant='outlined'
          size='large'
          endIcon={<CachedIcon />}
          sx={{ mt: 10 }}
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default Error;
