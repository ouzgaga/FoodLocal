import React, { Component, Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = ({

  textField: {
    margin: 0,
    padding: 0,
  },
  typo: {
    marginBottom: 0,
  },
});

class InputForm extends Component {
  handleChange = (handleChangeProperty, fieldNameToChange) => (e) => {
    e.preventDefault();
    handleChangeProperty(fieldNameToChange, e.target.value);
  }

  render() {
    const {
      classes, required, handleChangeProperty, inputTitle, fieldNameToChange, value, multiline, placeholder
    } = this.props;

    return (
      <Fragment>
        <Typography variant="body1" className={classes.typo} gutterBottom>
          {inputTitle}
        </Typography>
        <TextField
          className={classes.textField}
          id={fieldNameToChange}
          variant="outlined"
          fullWidth
          multiline={multiline}
          placeholder={placeholder}
          margin="normal"
          onChange={this.handleChange(handleChangeProperty, fieldNameToChange)}
          defaultValue={value}
          required={required}
        />
      </Fragment>
    );
  }
}

InputForm.propTypes = {
  classes: PropTypes.shape().isRequired,
  handleChangeProperty: PropTypes.func.isRequired,
  inputTitle: PropTypes.string.isRequired,
  fieldNameToChange: PropTypes.string.isRequired,
  value: PropTypes.shape().isRequired,
  multiline: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
  required: PropTypes.bool,
};

InputForm.defaultProps = {
  required: false,
}

export default withStyles(styles)(InputForm);
