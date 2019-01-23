import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography, Button, CardActionArea, Grid, Card
} from '@material-ui/core';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const VALIDATE = gql`
  mutation validate($producerId :ID!, $validationState: Boolean!) {
  validateAProducer(producerId: $producerId, validationState: $validationState){
    id
  }
}

`;


function TableProducerItem(props) {
  const {
    producer
  } = props;

  return (
    <Card>
      <Grid container spacing={16} direction="row">

        <Grid item xs={12} sm={4}>
          <CardActionArea href={`/producer/${producer.id}`} target="_blank">

            <Typography variant="body1">{producer.id}</Typography>
          </CardActionArea>

        </Grid>
        <Grid item sm={2} xs={4}>
          <Typography variant="body1">{producer.isValidated ? 'validé' : 'non validé'}</Typography>
        </Grid>


        <Mutation mutation={VALIDATE}>
          {validateAProducer => (
            <Grid item xs={4}>

              {producer.isValidated
                ? (
                  <Button variant="contained" color="primary" onClick={(e) => { e.preventDefault(); validateAProducer({ variables: { producerId: producer.id, validationState: false } }); window.location.reload(true); }}>
                    {'Bloquer ce producteur'}
                  </Button>
                )
                : (
                  <Button variant="contained" color="primary" onClick={(e) => { e.preventDefault(); validateAProducer({ variables: { producerId: producer.id, validationState: true } }); window.location.reload(true); }}>
                    {'Valider'}
                  </Button>
                )
              }

            </Grid>
          )}
        </Mutation>

      </Grid>
    </Card>

  );
}

TableProducerItem.propTypes = {
  producer: PropTypes.shape().isRequired,
};

export default TableProducerItem;
