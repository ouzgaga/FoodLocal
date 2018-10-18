import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';


class PageError404 extends Component {
  render() {
    const {location} = this.props;
    return (
      <div>
        <Typography variant="h3" color="inherit" >Error404: Page NotFound. </Typography>
        <Typography variant="h6" color="inherit" >No match for www.foodlocal.ch{location.pathname} </Typography>
      </div>
    );
  }
}

export default PageError404;