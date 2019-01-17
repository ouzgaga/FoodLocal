import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

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
    maxHeight: 150,
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
    maxHeight: 150,
    maxWidth: 100,
  },
});

function ListItemProducer(props) {
  const { classes } = props;
  const { producer, handleHover, resetHover } = props;
  const link = `/producer/${producer.id}`;

  return (
    <Fragment>
      {producer.salespoint !== null && (
        <Card className={classes.card} onMouseEnter={(e) => { e.preventDefault(); handleHover(producer.id); }} onMouseLeave={(e) => { e.preventDefault(); resetHover(); }}>
          <CardActionArea href={link} target="_blank">
            <CardHeader title={producer.salespoint.name} subheader={`${producer.salespoint.address.city} - ${(producer.salespoint.address.distance / 1000).toFixed(1)} km`} className={classes.titleItem} />
            <div className={classes.root}>
              <GridList className={classes.gridList}>
                {producer.products.edges.map(({ node }) => (
                  <div className={classes.paper} key={node.productType.id}>
                    <GridListTile key={node.productType.name} className={classes.gridListTile} style={{ margin: '0 auto' }}>
                      <CardMedia className={classes.media} image={node.productType.image} title={node.productType.name} />
                      <Typography className={classes.typo} variant="body1" gutterBottom>
                        {node.productType.name}
                      </Typography>
                    </GridListTile>
                  </div>
                ))}
              </GridList>

            </div>
          </CardActionArea>

        </Card>
      )}
    </Fragment>

  );
}

export default withStyles(styles, { withTheme: true })(ListItemProducer);
