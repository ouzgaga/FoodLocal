import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import PersonalInformation from '../components/accouontCRUD/PersonalInformation';
import PersonalDescription from '../components/accouontCRUD/PersonalDescription';
import ChangePassword from '../components/accouontCRUD/ChangePassword';
import BoxWithHeader from '../components/items/BoxWithHeader';

/*
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
*/

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

class PagePersonalInformations extends React.Component {

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
        <BoxWithHeader
          header="Informations personnels"
        >
          <PersonalInformation />
        </BoxWithHeader>
        <BoxWithHeader
          header="Changer de mot de passe"
        >
          <ChangePassword />
        </BoxWithHeader>
        <BoxWithHeader
          header="Changer votre description"
        >
          <PersonalDescription />
        </BoxWithHeader>
      </div>
    );
  }
}

export default withStyles(styles)(PagePersonalInformations);
