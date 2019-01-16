import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';

import BorderedPasswordField from '../items/fields/BorderedPasswordField';
import BoxLeftRight from './BoxLeftRight';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width:'100%',
    height: '100%',
    padding: theme.spacing.unit * 2,
    textAlign: 'justify',
    backgroundColor: 'rgba(255, 255, 240, 0.8)',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  centerBox: {
    justifyContent: 'flex-start',
  },
  rightBox: {
    justifyContent: 'flex-start',
  },
  leftBox: {
    justifyContent: 'flex-end',
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class ChangePassword extends Component {

  constructor(props) {
    super(props);

    this.state = {
      oldPassword: '',
      newPassword: '',
      confPassword: '',
    };
  }

  handleChange = prop => (event) => {
    this.setState({
      [prop]: event.target.value,
    });
  }

  handleSubmit = (event) => {
    const { oldPassword, newPassword, confPassword } = this.state;

    event.preventDefault();
    // TODO: Verifier la validité de oldPassword
    if (newPassword !== confPassword) {
      // TODO afficher erreur
      return;
    }
    // TODO: Changer password
  }

  render() {
    const { classes } = this.props;
    const { oldPassword, newPassword, confPassword } = this.state;

    return (
      <>
        <form id="form-change-password" onSubmit={this.handleSubmit}>
          <BoxLeftRight
            title="Ancien mot de passe"
          >
            <BorderedPasswordField
              required
              id="personal-information-oldPassword"
              className={classes.textField}
              onChange={this.handleChange('oldPassword')}
              defaultValue={oldPassword}
              fullWidth
            />
          </BoxLeftRight>
          <BoxLeftRight
            title="Nouveau mot de passe"
          >
            <BorderedPasswordField
              required
              id="personal-information-newPassword"
              className={classes.textField}
              onChange={this.handleChange('newPassword')}
              defaultValue={newPassword}
              fullWidth
            />
          </BoxLeftRight>
          <BoxLeftRight
            title="Confirmation du mot de passe"
          >
            <BorderedPasswordField
              required
              id="personal-information-confPassword"
              className={classes.textField}
              onChange={this.handleChange('confPassword')}
              defaultValue={confPassword}
              fullWidth
            />
          </BoxLeftRight>
          <BoxLeftRight
            title=""
          >
            <Button
              variant="contained"
              className={classes.button}
              //onClick={this.handleClick}
              color="primary"
              type="submit"
              id="change-password-button"
            >
              { `Valider` }
            </Button>
          </BoxLeftRight>
        </form>
      </>
    );
  }
}

export default withStyles(styles)(ChangePassword);
