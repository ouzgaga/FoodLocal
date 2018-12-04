import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import defaultImage from '../../img/guidouxFruits.png';
import MarkerCarotte from '../../img/strawberry2.png';

const styles = theme => ({
  card: {
    maxWidth: 400,
    width: '100%',
    paddingTop: 0,
  },
  cardContent: {
    root: {
      paddingTop: 0,
    }
  },
  titleItem: {
    backgroundColor: '#A6D9D5',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
    padding: 10,
  },
  gridListTile: {
    maxHeight: 100,
    maxWidth: 100,
  },
  media: {
    height: 70,
    width: 70,
    borderStyle: 'solid',
    borderWidth: '1px',
  },
  paper: {
    textAlign: 'center',
    maxHeight: 100,
    maxWidth: 100,
  },
});

function ListItemProducer(props) {
  const { classes } = props;
  const { salepoint } = props;
  const { products } = props;
  const { producer } = props;
  const place = 'Yverdon';
  //const link = `/producer/${salepoint.producers[0]}`; // TODO

  return (
    <Card className={classes.card}>
      <CardActionArea target="_blank">
        <CardHeader title={producer.salesPoint.name} subheader={place} className={classes.titleItem} />
        <div className={classes.root}>
          <GridList className={classes.gridList}>
            {producer.products.map(item => (
              <div className={classes.paper}>

                <GridListTile key={item.productType.name} className={classes.gridListTile} style={{ margin: '0 auto' }}>
                  <CardMedia className={classes.media} image={item.productType.image} title={item.productType.name} />
                  <Typography className={classes.typo} variant="body1" gutterBottom> {item.productType.name} </Typography>
                </GridListTile>
              </div>

            ))}
          </GridList>

        </div>
      </CardActionArea>

    </Card>
  );
}

export default withStyles(styles, { withTheme: true })(ListItemProducer);
