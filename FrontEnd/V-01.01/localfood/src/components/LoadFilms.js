import React from 'react'
import { GridList, GridListTile, Typography, Paper } from '@material-ui/core'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    maxHeight:400,
  },
  gridList: {
    width: 700,
    height: 150, 
    
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

  render() {
    return (
      <div className={styles.root}>

      <GridList cellHeight={100} spacing={100} className={styles.gridList} cols={1}>
        {tileData.map(tile => (
          <GridListTile key={tile.id} cols={1} style={{backgroundColor:"lightgrey"}}>
          <Paper>  
          {tile.title}
          </Paper>
          
         
          </GridListTile>
        ))}
      </GridList>
      </div>
    )
  }
}


export default Search