import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import ProducerHeader from '../components/producer/ProducerHeader';
import ProducerUserInteraction from '../components/producer/ProducerUserInteraction';
import ProducerContent from '../components/producer/ProducerContent';

const styles = theme => ({
  root: {
    width: 900,
    margin: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },

});

class PageProducer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //userId: props.match.params.producerId,
    };
  }



  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <ProducerHeader />
        <ProducerUserInteraction
          followersCount={100}
        />
        <ProducerContent />
      </div>
    );
  }
}

export default withStyles(styles)(PageProducer);
