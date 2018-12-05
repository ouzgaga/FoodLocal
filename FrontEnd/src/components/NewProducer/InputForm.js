import React, { Component, Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
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
    const { classes, handleChangeProperty, inputTitle, fieldNameToChange, value, multiline, placeholder } = this.props;

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
        />
      </Fragment>
    );
  }
}

export default withStyles(styles)(InputForm);
