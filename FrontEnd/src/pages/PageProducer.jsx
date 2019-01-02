import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import ProducerHeader from '../components/producer/ProducerHeader';
import ProducerUserInteraction from '../components/producer/ProducerUserInteraction';
import ProducerContent from '../components/producer/ProducerContent';

const GET_PRODUCER_HEADER = gql`
query($producer: ID!) {
  producer(producerId: $producer) {
    lastname
    firstname
    image
    description
    rating {
      rating
      nbRatings
    }
  }
}
`;


const styles = theme => ({
  root: {
    width: 900,
    margin: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },

});

class PageProducer extends React.Component {

  constructor(props) {
    super(props);
    document.title = 'Détails Producteur';
  }

  render() {
    const { classes, match } = this.props;
    const { producerId } = match.params;

    return (
      <div className={classes.root}>

        <Query
          query={GET_PRODUCER_HEADER}
          variables={{ producer: producerId }}
        >
          {({ data, loading, error }) => {
            if (error) return 'Oups une erreur est survenue, veuillez rafraichir la page.';
            if (loading) return 'Loading...';
            const {
              firstname, lastname, description, image, rating
            } = data.producer;

            let ratingValue;
            let nbRatings;
            if (rating === null) {
              ratingValue = null;
              nbRatings = null;
            } else {
              ratingValue = rating.rating;
              nbRatings = { rating };
            }
            return (
              <ProducerHeader lastname={lastname} firstname={firstname} description={description} image={image} ratingValue={ratingValue} nbRating={nbRatings} />
            );
          }}
        </Query>

        <ProducerUserInteraction
          followersCount={100}
        />
        <ProducerContent producerId={producerId}/>
      </div>
    );
  }
}

export default withStyles(styles)(PageProducer);
