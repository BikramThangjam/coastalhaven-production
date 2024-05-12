import React from 'react';
import "../styles/Loader.scss";
import {CircularProgress} from '@mui/material';

const Loader = () => {
  return (
   <div className='loader'>
     <CircularProgress color="secondary" />
   </div>
  )
}

export default Loader;
