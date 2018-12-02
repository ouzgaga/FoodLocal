import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 1200,

  },
});

class ResearchMap extends React.Component {
  constructor(props) {
    super(props);
    
  }

  render() {
    const { classes } = this.props;   

    return (
      <div>
        <div>
          this is a map
        </div>

        <div>
          <div>
            this is the research field
          </div>
          <div>
            this the adress
          </div>
        </div>
      </div>
    );
  }
}

ResearchMap.propTypes = {
  classes: PropTypes.object.isRequired,
};




export default withStyles(styles)(ResearchMap);