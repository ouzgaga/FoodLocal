import React, { Fragment } from 'react'
import { GridList, GridListTile, Typography, Card, Divider } from '@material-ui/core'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SearchBar from 'material-ui-search-bar'
import CardActionArea from "@material-ui/core/CardActionArea";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  card: {
    width: '100px'
  },
  media: {
    height: 140
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
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
});





const tileData = [
  {

    "id": 1,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.783,
      "lng": 6.65
    }

  },
  {

    "id": 2,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.783,
      "lng": 6.65
    }

  },
  {

    "id": 3,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.783,
      "lng": 6.65
    }

  },
  {

    "id": 4,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.783,
      "lng": 6.65
    }

  },
  {
    "id": 5,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.783,
      "lng": 6.65
    }
  },
  {
    "id": 6,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.783,
      "lng": 6.65
    }
  },
  {
    "id": 7,
    "title": "Guidoux Fruits",
    "position": {
      "lat": 46.783,
      "lng": 6.65
    }
  }
];

class Search extends React.Component {

  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    return (
      <Fragment>
        <Divider />
        <SearchBar
          onChange={() => console.log('onChange')}
          onRequestSearch={() => console.log('onRequestSearch')}
          style={{
            margin: '0 auto',
            maxWidth: 800
          }}
        />
        <List >

          {tileData.map(tile => (
            <Fragment>
              <ListItem key={tile.id} style={{ height: 200 }}>

                <Card className={styles.card}>
                  <CardActionArea>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        Lizard
          </Typography>
                      <Typography component="p">
                        Lizards are a widespread group of squamate reptiles, with over 6,000
                        species, ranging across all continents except Antarctica
          </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </ListItem>
              <Divider />
            </Fragment>
          ))
          }

        </List>
      </Fragment>
    )
  }
}


export default Search