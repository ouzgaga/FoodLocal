import React from 'react';
import { Divider } from '@material-ui/core';

import red from '@material-ui/core/colors/red';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import SearchBar from 'material-ui-search-bar';
import { withStyles } from '@material-ui/core/styles';
import ListItemProducer from './ListItemProducer';

const styles = theme => ({

  card: {
    maxWidth: '400px',
    maxHeight: '300px',

  },
  avatar: {
    backgroundColor: red[500],
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  subheader: {
    width: '100%',
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  list: {
    backgroundColor: 'transparent',
  },
  listItem: {
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 10,
    paddingTop: 0,
  },
});

function getSalespoints() {
  return fetch('http://api.foodlocal.ch/salespoints?limit=10')
    .then(res => res.json())
    .catch(err => console.log(err));
}

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      salespoints: [],
    };
    getSalespoints().then((res) => {
      this.setState({ salespoints: res });
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.list}>
        <Divider key="divider" />
        <SearchBar
          key="SearchBar"
          onChange={() => console.log('onChange')}
          onRequestSearch={() => console.log('onRequestSearch')}
          style={{
            margin: '0 auto',
            maxWidth: 800,
          }}
        />
        <List key="list" className={classes.list}>

          {this.state.salespoints.map(tile => (

            <ListItem className={classes.listItem} key={tile._id}>

              <ListItemProducer key={tile._id} salepoint={tile} />

            </ListItem>
          ))
          }

        </List>
      </div>
    );
  }
}



export default withStyles(styles)(Search);
