import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Button, CardActionArea, Grid } from '@material-ui/core';

function TableProducerItem(props) {
  const {
    classes, id, name,
  } = props;

  return (
    <Grid container spacing={16}>
      <Grid item xs={8}>
        <CardActionArea href={`/producer/${id}`} target="_blank">
          <Typography variant="h6">{name}</Typography>
        </CardActionArea>
      </Grid>
      <Grid item xs={4}>
        <Button variant="contained" color="primary">
          {'Valider'}
        </Button>
      </Grid>
    </Grid>
  );
}

TableProducerItem.propTypes = {
  classes: PropTypes.shape().isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.number.isRequired,
};

export default TableProducerItem;
