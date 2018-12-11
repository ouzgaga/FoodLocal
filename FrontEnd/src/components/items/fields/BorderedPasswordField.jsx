import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';


const styles = theme => ({

  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

class BorderedPasswordField extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showPassword: false,
    };
  }

  handleClick = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  }

  render() {
    const { classes, onChange, defaultValue, id, fullWidth } = this.props;
    const { showPassword } = this.state;

    return (
      <>
        <OutlinedInput
          id={`BorderedTextFiel-${id}`}
          className={classes.textField}
          defaultValue={defaultValue}
          onChange={onChange}
          type={showPassword ? 'text' : 'password'}
          fullWidth={fullWidth}
          endAdornment={(
            <InputAdornment position="end">
              <IconButton
                readOnly
                tabIndex="-1"
                aria-label="Toggle password visibility"
                onClick={this.handleClick}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          )}
        />
      </>
    );
  }
}

BorderedPasswordField.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  id: PropTypes.string,
  defaultValue: PropTypes.string,
  fullWidth: PropTypes.bool,
};

BorderedPasswordField.defaultProps = {
  id: '',
  defaultValue: '',
  fullWidth: false,
};

export default withStyles(styles)(BorderedPasswordField);