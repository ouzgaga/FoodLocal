import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import CenteredPaper from '../components/items/CenteredPaper';
import Button from '@material-ui/core/Button';

const styles = {
  paper: {
    backgroundColor: 'rgba(255, 10, 0, 1)'
  }
};

const mutation = gql`
    mutation($token: String!){
        validateToken(token: $token)
    }
`;

class PageEmailValidation extends Component {
  render() {
    const { classes } = this.props;
    const { token } = this.props.match.params;
    return (
      <div>
        <Mutation mutation={mutation} variables={{ token }}>
          {(validate, { data, loading, error }) => (
            <Button
              className={'RepositoryItem-title-action'}
              onClick={validate}
            >
              result
            </Button>
          )}
        </Mutation>
      </div>
    );
  }
}

export default withStyles(styles)(PageEmailValidation);
