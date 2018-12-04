import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Rating from 'react-rating';

import MarkerCarotteEmpty from '../../img/MarkerCarotteEmpty.png';
import MarkerCarotteFull from '../../img/MarkerCarotteFull.png';


const styles = {
  root: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
    image:{
      maxWidth: 40,
      maxHeight: 40,
      height: '100%',
      width: '100%',
    }
  };

  


class RatingItem extends React.Component {
  constructor(props) {
    super(props);
    const maxValue = 5;
    this.state = {
        data: (props.defaultValue > maxValue ? maxValue : props.defaultValue),
    };
  }


  handleChange = (value) => {
    if(this.props.onChange) {
      this.props.onChange(value);
    }
    this.setState({ data: value });
  };

  render() {
    const { classes, readOnly } = this.props;
    const { data } = this.state;

    return (
      <div className={classes.root}>
        <Rating 
          onChange={this.handleChange}
          
          initialRating = { this.state.data }
          emptySymbol = {<img src={MarkerCarotteEmpty} className={classes.image}/>}
          fullSymbol = {<img src={MarkerCarotteFull} className={classes.image}/>}
          readonly = {readOnly}
        />
    </div>
    );
  }
}

RatingItem.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  defaultValue: PropTypes.number,
}

RatingItem.defaultProps = {
  readOnly: false,
  defaultValue: 0,
};


export default withStyles(styles)(RatingItem);