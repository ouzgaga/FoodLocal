import React, { Component } from 'react';

import PropTypes from 'prop-types';
import compose from 'recompose/compose';

import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';


import { AuthContext } from '../providers/AuthProvider';
import BoxLeftRight from './BoxLeftRight';


// Mutation pour que l'utilisateur puisse supprimer son compte
const mutDeleteuser = gql`
  mutation {
    deletePersonAccount
  }
  `;

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    padding: theme.spacing.unit * 2,
    textAlign: 'justify',
    backgroundColor: 'rgba(255, 255, 240, 0.8)',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

/**
 * Permet à l'utilisateur de supprimer son compte définitivement.
 */
class DeleteAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <>
        <Mutation
          mutation={mutDeleteuser}
        >
          {(updateTodo, { data, loading, error }) => (
            <form
              id="form-delete-acount"
            >
              <BoxLeftRight
                title="Supprimer votre compte"
              >
                <>
                  <Button
                    variant="contained"
                    className={classes.button}
                    color="error"
                    type="button"
                    id="delete-account-button"
                    onClick={this.handleClickOpen}
                  >
                    {`Supprimer`}
                  </Button>
                  {loading && <p>Chargement...</p>}
                  {error && (
                    <>
                      {console.info(error)}
                      <Typography color="error">
                        Une erreur est survenur
                      </Typography>
                    </>
                  )}
                  {data && (
                    <AuthContext>
                      {({ signOut }) => signOut()}
                    </AuthContext>
                  )}
                  <AuthContext>
                    {({ signOut }) => (
                      <Dialog
                        fullScreen
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="responsive-dialog-title"
                      >
                        <DialogTitle id="responsive-dialog-title">{"Voulez-vous vraiment supprimer votre compte?"}</DialogTitle>
                        <DialogContent>
                          <DialogContentText>Apès avoir suuprimé votre compte, toutes vos information seront supprimées ormis. Vous ne pourrez plus vous connecter avec celui-ci sur foodloacl.ch.</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button type="button" onClick={this.handleClose} color="default">Annuler</Button>
                          <Button
                            type="button"
                            color="primary"
                            autoFocus
                            id="delete-account-button-dialog"
                            onClick={
                              (e) => {
                                e.preventDefault();
                                updateTodo();
                                //signOut();
                                console.info("yoo");
                              }
                            }
                          >
                              Supprimer
                            </Button>
                        </DialogActions>
                      </Dialog>
                    )}
                  </AuthContext>
                </>
              </BoxLeftRight>
            </form>
          )}
        </Mutation>
      </>
    );
  }
}

DeleteAccount.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withMobileDialog(),
  withStyles(styles)
)(DeleteAccount);
