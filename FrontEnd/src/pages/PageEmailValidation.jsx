import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import CenteredPaper from '../components/items/CenteredPaper';
import NewValidationEmail from '../components/NewValidationEmail';  

//import { AuthContext } from '../components/providers/AuthProvider';

const styles = {
  paper: {
    backgroundColor: 'rgba(255, 10, 0, 1)'
  }
};

// mutation permettant la validation d'email d'un utilisateur
const mutation = gql`
mutation ($emailToken: String!){
  validateAnEmailToken(emailValidationToken: $emailToken){
    token
  }
}
`;


class DoMutation extends React.Component {
  componentDidMount() {
    const { mutate } = this.props;
    mutate();
  };

  render() {
    return null;
  };
};

class PageEmailValidation extends Component {
  render() {
    const { classes } = this.props;
    const { token } = this.props.match.params;
    console.info("tok", token);
    return (
      <div>
        <CenteredPaper className={classes.paper}>
          <Typography variant="h3" color="secondary">
            Validation d'email
          </Typography>
          <Mutation mutation={mutation} variables={{ emailToken: token }}>
            {(validate, { data, loading, error }) => (
              <div>
                <DoMutation mutate={validate} />
                {error && (
                  <>
                  {
                    (
                      <>
                      {console.info(error.error)}
                      <br/>
                      <Typography  color="error">Le lien de validation n'est plus valide</Typography>
                      <br/>
                      <NewValidationEmail />
                      </>
                    )
                  }
                  
                    
                  </>
                  
                
                  
                )}
                {loading && <Typography  color="secondary">Loading</Typography>}
                {data && (
                  <>

                    <Typography >Email confirmé, vous pouvez vous connecter.</Typography>

                  </>
                )}
              </div>
            )}
          </Mutation>
        </CenteredPaper>
      </div>
    );
  }
}

export default withStyles(styles)(PageEmailValidation);
