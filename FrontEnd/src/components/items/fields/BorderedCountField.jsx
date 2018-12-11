import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
const styles = theme => ({

  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

class BorderedCountField extends Component {

  /*
  constructor(props) {
    super(props);

    this.state = {
      charCount: false,
      value: '',
    };
  }

  handleChangeText = (event) => {
    this.setState({
      //charCount: event.target.value.length
      value: event.target.value,
    });

  }
  */

  render() {
    const { classes, onChange, value, id, fullWidth, maxLenght, header } = this.props;
    
    return (
      <>
        <InputLabel shrink htmlFor="bootstrap-input" className={classes.bootstrapFormLabel}>
          {header}
          <br />
          {`${value.lenght} / ${maxLenght} caractères`}
        </InputLabel>
        {`${charCount} / ${maxLenght} caractères`}
        <OutlinedInput
          id={`BorderedTextFiel-${id}`}
          className={classes.textField}
          value={value}
          onChange={onChange}
          type={showPassword ? 'text' : 'password'}
          fullWidth={fullWidth}
        />
      </>
    );
  }
}

BorderedCountField.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  id: PropTypes.string,
  defaultValue: PropTypes.string,
  fullWidth: PropTypes.bool,
  maxLenght: PropTypes.number,
};

BorderedCountField.defaultProps = {
  value: '',
  id: '',
  defaultValue: '',
  fullWidth: false,
  maxLenght: 16,
  header: '',
};

export default withStyles(styles)(BorderedCountField);
