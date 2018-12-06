import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({

  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

class BorderedTextField extends Component {

  constructor(props) {
    super(props);

    this.state = {
     
    };
  }

  render() {
    const { classes, onChange, defaultValue, id, fullWidth } = this.props;
    
    return (
      <>
        <TextField
          id={`BorderedTextFiel-${id}`}
          className={classes.textField}
          defaultValue={defaultValue}
          margin="normal"
          variant="outlined"
          onChange={onChange}
          fullWidth
        />
      </>
    );
  }
}

BorderedTextField.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  id: PropTypes.string,
  defaultValue: PropTypes.string,
  fullWidth: PropTypes.bool,
};

BorderedTextField.defaultProps = {
  id: '',
  defaultValue: '',
  fullWidth: false,
};

export default withStyles(styles)(BorderedTextField);
