import * as React from 'react';
import Navbar from './Navbar';
// import { Container } from '@mui/system';
import { Box } from '@mui/material';

export default function Layout(props) {
  return (
    <>
        <Navbar />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100%"
        >
          {props.children}
        </Box>
    </>
  );
}