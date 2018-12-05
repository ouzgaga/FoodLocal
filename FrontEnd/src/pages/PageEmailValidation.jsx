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
    return (
      <div>
        <CenteredPaper className={classes.paper}>
          <Typography variant="h3" color="secondary">
            Validation d'email
          </Typography>
          <Mutation mutation={mutation} variables={{ token }}>
            {(validate, { data, loading, error }) => (
              <div>
                <DoMutation mutate={validate} />
                {error && <div><Typography variant="h3" color="secondary">Error - Token not valide</Typography><Button>Send new email confimation</Button></div>}
                {loading && <Typography variant="h3" color="secondary">Loading</Typography>}
                {data && <Typography variant="h3" color="secondary">Email confirmé</Typography>}
              </div>
            )}
          </Mutation>
        </CenteredPaper>
      </div>
    );
  }
}

export default withStyles(styles)(PageEmailValidation);
