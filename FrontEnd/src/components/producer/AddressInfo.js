import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

function AddressInfo(props) {

  const { address } = props;

  const {
    number, street, city, postalCode, state, country
  } = address;

  return (
    <Fragment>
      <Typography color="primary">
        {'Adresse'}
      </Typography>
      <Typography>
        {`${street} ${number}`}
      </Typography>
      <Typography>
        {`${postalCode} ${city}`}
      </Typography>
      <Typography>
        {`${state} ${country}`}
      </Typography>
    </Fragment>
  );
}


export default (AddressInfo);
