import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DoneOutline from '@material-ui/icons/DoneOutline';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';

import BoxLeftRight from './BoxLeftRight';
import DropZone from '../items/DropZone';
import SimpleImageDialog from '../items/SimpleImageDialog';

const queryMe = gql`
  query($token: String!) {
    me(token: $token) {
      image
    }
  }
  `;

// mutation permettant la mise à jour de la description de l'utilisateur (nom, prénom sont des champs obligatoirs)
const mutUpdateProd = gql`
  mutation($user: ProducerInputUpdate!){
    updateProducer(producer: $user){
      image
    }
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
  image: {
    maxWidth: 256,
    maxHeight: 256,
  },
});

/**
 * Permet aux producteurs de mettre à jour leur description
 */
class ChangeProfilImage extends Component {

  constructor(props) {
    super(props);
     this.state = {
        image: null,
        myImage: null,
     };
  }

  updateImage = (img) => {
    this.setState({image: img});
  }

  render() {
    const { classes, userId, token } = this.props;
    const { image } = this.state;
    return (
      <>
        <Query
          query={queryMe}
          variables={{ token: token }}
        >
          {({ loading, error, data, refetch }) => {
            if (loading) return <p>Chargement...</p>;
            if (error) return <p><Typography color="error">Un probème est survenu, veuillez essayer plus tard.</Typography></p>;
            // Le retour d'une mutation s'appelle aussi data
            let datas = data;
            return (
              <>
                <Mutation
                  mutation={mutUpdateProd}
                  onCompleted={() => refetch()}
                >
                  {(updateTodo, { data, loading, error }) => (
                    <form
                      id="form-profile-image"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const user = {
                          id: userId,
                          image: this.state.image,
                        };
                       
                        updateTodo({
                          variables: { user: user }
                        });
                        refetch();
                      }}
                    >
                      <Grid container spacing={16}>
                        <Grid item xs={4} container alignItems="center" className={classes.leftBox}>
                          <ButtonBase className={classes.image}>
                            <SimpleImageDialog
                              className={classes.image}
                              image={datas.me.image}
                            />
                          </ButtonBase>
                        </Grid>
                        <Grid item xs={4} container alignItems="center" className={classes.rightBox}>
                          <DropZone onChange={this.updateImage} />
                        </Grid>
                      </Grid>
                      <BoxLeftRight
                        title=""
                      >
                        <>
                          <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            id="change-porfil-image"
                          >
                            {`Valider`}
                          </Button>
                          {loading && <p>Chargement...</p>}
                          {error && (
                            <>
                             
                              <Typography color="error">Un probème est survenu, veuillez essayer plus tard.</Typography>
                            </>
                          )}
                          {data && <DoneOutline color="secondary" />}
                        </>
                      </BoxLeftRight>
                    </form>

                  )}
                </Mutation>
              </>
            );
          }}
        </Query>
      </>
    );
  }
}

ChangeProfilImage.propTypes = {
  classes: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

export default withStyles(styles)(ChangeProfilImage);
