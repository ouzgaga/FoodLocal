import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import ProducerHeader from '../components/producer/ProducerHeader';
import ProducerUserInteraction from '../components/producer/ProducerUserInteraction';
import ProducerContent from '../components/producer/ProducerContent';
import ErrorLoading from '../components/ErrorLoading';
import Loading from '../components/Loading';
import PageError404 from './PageError404';

const GET_PRODUCER_HEADER = gql`
query($producer: ID!) {
  producer(producerId: $producer) {
    lastname
    firstname
    image
    description
    rating {
      grade
      nbRatings
    }
    salespoint{
      name
    }
    followers {
      totalCount
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
            if (error) return <ErrorLoading />;
            if (loading) return <Loading />;

            if (data.producer === null) return <PageError404 location={{ pathname: `/producer/${producerId}` }} />;
            const {
              firstname, lastname, description, image, rating, salespoint, followers
            } = data.producer;

            let ratingValue;
            let nbRatings;
            if (rating === null) {
              ratingValue = null;
              nbRatings = null;
            } else {
              ratingValue = rating.grade;
              nbRatings = rating.nbRatings;
            }
            return (
              <>
                <ProducerHeader
                  lastname={lastname}
                  firstname={firstname}
                  description={description}
                  image={image}
                  ratingValue={ratingValue}
                  nbRating={nbRatings}
                  name={salespoint ? salespoint.name : 'Pas de nom de point de vente'}
                />

                <ProducerUserInteraction
                  followersCount={followers.totalCount}
                />
                <ProducerContent producerId={producerId} />
              </>
            );
          }}
        </Query>


      </div>
    );
  }
}

export default withStyles(styles)(PageProducer);
