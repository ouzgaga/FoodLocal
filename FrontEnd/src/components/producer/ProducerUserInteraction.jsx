import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Hidden } from '@material-ui/core';
import UserContext from '../UserContext';
import RatingItem from '../items/RatingItem';
import SimpleInfoDialog from '../items/SimpleInfoDialog';
import { AuthContext } from '../providers/AuthProvider';
import { Query, Mutation } from 'react-apollo';


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

const DIALOG_USER_NOT_LOG = "Vous devez être connecté pour pouvoir suivre ou juger un producteur.";
const DIALOG_NO_RATING_VALUE = "Le producteur doit au moins avoir 1 carotte";

class ProducerUserInteraction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      infoDialogOpen: false,
      infoDialogText: "",
      userRating: 0,
    };
  }

  componentWillMount() {
    let userRating = 0;
    if (UserContext.Provider.jsToken) {
      // Fetch data => rank of this producer from user
    }
    this.setState({
      userRating: userRating,
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

  fetchUserFolowProducer = (user) => {
    // TODO: Recherchi si 'utilisateur suit ou pas
    return true;
  }

  displayIfUserFollow = () => {
    const user = UserContext.Provider.jsToken;
    if (user === null || this.fetchUserFolowProducer(user)) {
      return 'Suivre';
    }
    return ('Ne plus suivre');
  }


  render() {
    const { classes, followersCount } = this.props;
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
              { /* Affiche une pop-up d'erreur si l'utiliateur n'es pas connecté */}
              <SimpleInfoDialog
                open={infoDialogOpen}
                handleClose={this.handleClose.bind(this)}
                text={infoDialogText}
              />

              <Grid container spacing={16} justify="center">
                <Grid container alignItems="center" className={classes.centerBox}>
                  <Grid item sm={6} xs={12}>
                    <Grid container alignItems="center" className={classes.centerBox}>

                      <Button variant="contained" className={classes.button} onClick={this.handleClickRating}>
                        {this.displayIfUserFollow()}
                      </Button>

                      <Typography>
                        {displayFolowerCount(followersCount)}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Hidden smUp>
                    <div style={{ height: 100 }} />
                  </Hidden>


                  <Grid item sm={6} xs={12}>

                    <Grid container alignItems="center" className={classes.centerBox}>

                      <RatingItem
                        onChange={this.handleChangeUserRating}
                        defaultValue={userRating}
                      />
                    </Grid>

                    <Grid container alignItems="center" className={classes.centerBox}>
                      <Typography>Notez ce producteur</Typography>
                      <Button variant="contained" className={classes.button} onClick={this.handleClickRating}>Vote</Button>
                    </Grid>
                  </Grid>
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
