import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import defaultImage from '../img/guidouxFruits.png';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    // ⚠️ object-fit is not supported by IE 11.
    objectFit: 'cover',
  },
};

function ImgMediaCard(props) {
  const { classes } = props;
  const { salepoint } = props;
  return (
    <Card className={classes.card}>
      <CardActionArea href={123456} target="_blank">
        <CardMedia
          component="img"
          alt="Contemplative Reptile"
          className={classes.media}
          height="100"
          image={defaultImage}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {salepoint.name}
          </Typography>
          <Typography component="p">
            {salepoint.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

ImgMediaCard.propTypes = {
  classes: PropTypes.shape.isRequired,
  salepoint: PropTypes.shape.isRequired,
};

export default withStyles(styles)(ImgMediaCard);
