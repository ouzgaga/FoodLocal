import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import ProducerHeader from '../components/producer/ProducerHeader';
import ProducerUserInteraction from '../components/producer/ProducerUserInteraction';
import ProducerContent from '../components/producer/ProducerContent';

const GET_REPOSITORY = gql`
query ($producer:ProducerInputGetAndDelete!) {
  producer(producer:$producer){
    firstname
    lastname
    email
    image
    description
    rating 
    totalCountRating
    subscribedUsers {
      totalCount
    }
  }
}`;


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

    this.state = {
      //userId: props.match.params.producerId,
    };
  }

  /*
  query = () => {
    return (
      <Query query={query}>
        {({ data, loading, error }) => {
          if (error) return 'Oups une erreur est survenue, veuillez rfraichir la page.';
          if (loading) return 'Loading...';
          return (
            <MainMap data={data} />
          );
        }}
      </Query>
    );
  }
  */

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <ProducerHeader
        />
        <ProducerUserInteraction
          followersCount={100}
        />
        <ProducerContent />
      </div>
    );
  }
}

export default withStyles(styles)(PageProducer);
