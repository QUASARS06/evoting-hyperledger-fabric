import React, { Fragment } from 'react';
import spinner from '../images/loading2.gif';

const Spinner = () => (
  <Fragment>
    <img src={spinner} alt='Loading...' style={{ width: '200px' }} />
  </Fragment>
);

export default Spinner;
