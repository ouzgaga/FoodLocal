import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Hidden } from '@material-ui/core';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import UserContext from '../UserContext';
import RatingItem from '../items/RatingItem';
import { AuthContext } from '../providers/AuthProvider';
import ErrorLoading from '../ErrorLoading';
import Loading from '../Loading';


const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',

    padding: theme.spacing.unit * 2,
    textAlign: 'justify',
    backgroundColor: 'rgba(255, 255, 240, 0.8)',
  },
  leftBox: {
    padding: theme.spacing.unit * 2,
    textAlign: 'justify',
  },
  button: {
    margin: theme.spacing.unit,
  },
  centerBox: {
    justifyContent: 'center',
  },
});

const CHECK_IF_PERSON_FOLLOW_PRODUCER = gql`
query($producerId : ID!) {
  checkIfPersonFollowProducer(producerId: $producerId)
}
`;

const ADD_FOLLOWER_TO_PRODUCER = gql`
mutation($producerId : ID!, $followerId: ID!) {
  addFollowerToProducer(producerId: $producerId, followerId:$followerId) {
    id
  }
}
`;

const REMOVE_FOLLOWER_TO_PRODUCER = gql`
mutation($producerId : ID!, $followerId: ID!) {
  removeFollowerToProducer(producerId: $producerId, followerId:$followerId) {
    id
  }
}
`;

const RATING_ABOUT_PRODUCER_MADE_BY_A_PERSON = gql`
query($personId: ID!, $producerId: ID!) {
  ratingAboutProducerMadeByPerson(personId: $personId, producerId: $producerId) {
    rating
  }
}
`;


const ADD_OR_UPDATE_PRODUCER_RATING = gql`
mutation($rating : PersonRatingProducerInput!) {
  addOrUpdateProducerRating(rating : $rating) {
    id
  }
}
`;

const DIALOG_USER_NOT_LOG = 'Vous devez être connecté pour pouvoir suivre ou juger un producteur.';
const DIALOG_NO_RATING_VALUE = 'Le producteur doit au moins avoir 1 carotte';

class ProducerUserInteraction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      infoDialogOpen: false,
      infoDialogText: '',
      userRating: 0,
    };
  }

  componentWillMount() {
    const userRating = 0;
    if (UserContext.Provider.jsToken) {
      // Fetch data => rank of this producer from user
    }
    this.setState({
      userRating,
    });
  }

  handleClose = () => {
    this.setState({ infoDialogOpen: false });
  }

  handleChangeUserRating = (value) => {
    this.setState({
      userRating: value,
    });
  }

  handleClick = () => {
    if (!UserContext.Provider.jsToken) {
      this.setState({ infoDialogOpen: true });
    }
  }

  handleClickRating = () => {
    if (!UserContext.Provider.jsToken) {
      this.setState({
        infoDialogText: DIALOG_USER_NOT_LOG,
        infoDialogOpen: true,
      });
    } else if (true) {
      this.setState({
        infoDialogText: DIALOG_NO_RATING_VALUE,
        infoDialogOpen: true,
      });
    }
    // TODO: Insére les données dans la db.
  }

  handleClickFollow = () => {
    if (!UserContext.Provider.jsToken) {
      this.setState({
        infoDialogText: DIALOG_USER_NOT_LOG,
        infoDialogOpen: true,
      });
    }

    // TODO: Insére les données dans la db.
  }

  fetchUserFolowProducer = (user) =>
    // TODO: Recherchi si 'utilisateur suit ou pas
    true


  displayIfUserFollow = () => {
    const user = UserContext.Provider.jsToken;
    if (user === null || this.fetchUserFolowProducer(user)) {
      return 'Suivre';
    }
    return ('Ne plus suivre');
  }


  render() {
    const { classes, followersCount, producerId, refetchParent } = this.props;
    const { infoDialogOpen, userRating, infoDialogText } = this.state;


    // fromatage du text en français
    function displayFolowerCount(count) {
      if (count <= 1) {
        return (`${count} abonné`);
      }
      return (`${count} abonnés`);
    }

    return (


      <div className={classes.root}>
        <AuthContext>
          {({ userId }) => userId && (
            <>
              <Grid container spacing={16} justify="center">
                <Grid container alignItems="center" className={classes.centerBox}>
                  <Grid item sm={6} xs={12}>
                    <Grid container alignItems="center" className={classes.centerBox}>


                      <Query
                        query={CHECK_IF_PERSON_FOLLOW_PRODUCER}
                        variables={{ producerId }}
                      >
                        {({
                          data, loading, error, refetch
                        }) => {
                          if (error) return <ErrorLoading />;
                          if (loading) return <Loading />;

                          const { checkIfPersonFollowProducer } = data;
                          return (
                            <>
                              <Mutation mutation={checkIfPersonFollowProducer ? REMOVE_FOLLOWER_TO_PRODUCER : ADD_FOLLOWER_TO_PRODUCER} onCompleted={() => { refetch(); refetchParent(); }}>
                                {dow => (
                                  <>
                                    <Button variant="contained" className={classes.button} onClick={(e) => { e.preventDefault(); dow({ variables: { producerId, followerId: userId } }); }}>
                                      {checkIfPersonFollowProducer ? 'Ne plus suivre' : 'suivre'}
                                    </Button>
                                    <Typography>
                                      {displayFolowerCount(followersCount)}
                                    </Typography>
                                  </>
                                )}
                              </Mutation>
                            </>
                          );
                        }}
                      </Query>

                    </Grid>
                  </Grid>

                  <Hidden smUp>
                    <div style={{ height: 100 }} />
                  </Hidden>

                  <Query
                    query={RATING_ABOUT_PRODUCER_MADE_BY_A_PERSON}
                    variables={{ producerId, personId: userId }}
                  >
                    {({
                      data, loading, error, refetch
                    }) => {
                      if (error) return <ErrorLoading />;
                      if (loading) return <Loading />;

                      const { ratingAboutProducerMadeByPerson } = data;
                      return (
                        <>
                          <Grid item sm={6} xs={12}>
                            <Grid container alignItems="center" className={classes.centerBox}>
                              <RatingItem
                                onChange={this.handleChangeUserRating}
                                defaultValue={ratingAboutProducerMadeByPerson ? ratingAboutProducerMadeByPerson.rating : null}
                              />
                            </Grid>

                            <Grid container alignItems="center" className={classes.centerBox}>
                              <Typography>Notez ce producteur</Typography>
                              <Mutation mutation={ADD_OR_UPDATE_PRODUCER_RATING} onCompleted={() => { refetch(); refetchParent(); }}>
                                {dow => (
                                  <>
                                    <Button variant="contained" className={classes.button} onClick={(e) => { e.preventDefault(); dow({ variables: { rating: { producerId, personId: userId, rating: userRating } } }); }}>Vote</Button>
                                  </>
                                )}
                              </Mutation>
                            </Grid>
                          </Grid>

                        </>
                      );
                    }}
                  </Query>





                </Grid>
              </Grid>
            </>
          )}
        </AuthContext>
      </div>

    );
  }
}

ProducerUserInteraction.propTypes = {
  classes: PropTypes.object.isRequired,
  followersCount: PropTypes.number.isRequired,
};

export default withStyles(styles)(ProducerUserInteraction);
