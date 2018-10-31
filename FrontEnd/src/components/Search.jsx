import React, { Fragment } from 'react';
import { Typography, Card, Divider } from '@material-ui/core';

import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SearchBar from 'material-ui-search-bar';
import CardActionArea from '@material-ui/core/CardActionArea';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { withStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import pomme from '../img/pomme.png';

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
});

const tileData = [
  {

    id: 1,
    title: 'Guidoux Fruits',
    position: {
      lat: 46.783,
      lng: 6.65,
    },

  },
  {

    id: 2,
    title: 'Guidoux Fruits',
    position: {
      lat: 46.783,
      lng: 6.65,
    },

  },
  {

    id: 3,
    title: 'Guidoux Fruits',
    position: {
      lat: 46.783,
      lng: 6.65,
    },

  },
  {

    id: 4,
    title: 'Guidoux Fruits',
    position: {
      lat: 46.783,
      lng: 6.65,
    },

  },
  {
    id: 5,
    title: 'Guidoux Fruits',
    position: {
      lat: 46.783,
      lng: 6.65,
    },
  },
  {
    id: 6,
    title: 'Guidoux Fruits',
    position: {
      lat: 46.783,
      lng: 6.65,
    },
  },
  {
    id: 7,
    title: 'Guidoux Fruits',
    position: {
      lat: 46.783,
      lng: 6.65,
    },
  },

];

function Search(props) {
  const { classes } = props;

  return (
    <Fragment  className={classes.list}>
      <Divider />
      <SearchBar
        onChange={() => console.log('onChange')}
        onRequestSearch={() => console.log('onRequestSearch')}
        style={{
          margin: '0 auto',
          maxWidth: 800,
        }}
      />
      <List className={classes.list}>

        {tileData.map(tile => (

          <ListItem key={tile.id}>
            <Card className={classes.card}>
              <CardActionArea>
                <CardHeader

                  title="Shrimp and Chorizo Paella"
                />
              </CardActionArea>

              <CardContent>


                <GridList className={classes.gridList} cols={2.5}>

                  {tileData.map(tile2 => (
                    <GridListTile key={tile2.img}>
                      <img src={pomme} alt={tile2.title} style={{ height: 100 }} />
                      <Typography variant="caption" gutterBottom align="center">
                        Pomme
        </Typography>
                    </GridListTile>
                  ))}
                </GridList>

              </CardContent>

            </Card>


          </ListItem>

        ))
        }

      </List>
    </Fragment>
  );

}


export default withStyles(styles)(Search);
