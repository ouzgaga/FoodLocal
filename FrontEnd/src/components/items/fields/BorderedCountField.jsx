import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 1200,
    textAlign: 'justify',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  bootstrapRoot: {
    'label + &': {
      //marginTop: theme.spacing.unit * 5,
    },
  },
  bootstrapFormLabel: {
    fontSize: 18,
  },
});

class BorderedCountField extends Component {  
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.defaultValue,
    };
  }

  handleChangeText = (event) => {
    const { onChange, maxLenght } = this.props;
    const tmp = event.target.value;
    if (tmp.length <= maxLenght) {
      this.setState({
        data: tmp,
      });
      return onChange(event);
    }
  }


  render() {
    const { classes, defaultValue, id, fullWidth, maxLenght, header } = this.props;
    const { data } = this.state;

    return (
      <>
        <div className={classes.root}>
          <InputLabel shrink htmlFor="bootstrap-input" className={classes.bootstrapFormLabel}>
            {header}
            <br />
            {`${data.length} / ${maxLenght} caractères`}
          </InputLabel>
          
          <OutlinedInput
            labelWidth={0}
            id={`BorderedTextFiel-${id}`}
            onChange={this.handleChangeText}
            value={data}
            fullWidth={fullWidth}
            classes={{
              root: classes.bootstrapRoot,
              input: classes.bootstrapInput,
            }}
            multiline
            rows="4"
            rowsMax="6"
          />
        </div>
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
  id: '',
  defaultValue: '',
  fullWidth: false,
  maxLenght: 16,
  header: '',
};

export default withStyles(styles)(BorderedCountField);
