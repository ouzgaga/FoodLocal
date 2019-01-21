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
      <Typography color="primary" variant="body1">
        {'Adresse'}
      </Typography>
      <Typography variant="body1">
        {`${street} ${number}`}
      </Typography>
      <Typography variant="body1">
        {`${postalCode} ${city}`}
      </Typography>
      <Typography variant="body1">
        {`${state} ${country}`}
      </Typography>
    </Fragment>
  );
}

AddressInfo.propTypes = {
  address: PropTypes.shape().isRequired,
};

export default (AddressInfo);
