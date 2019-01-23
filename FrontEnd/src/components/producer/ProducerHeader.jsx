import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import DefaultUserLogo from '../../img/DefaultUserLogo.jpg';
import RatingItem from '../items/RatingItem';
import SimpleImageDialog from '../items/SimpleImageDialog';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    padding: theme.spacing.unit * 2,
    textAlign: 'justify',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  leftBox: {
    flexGrow: 1,
    maxWidth: 256,
    padding: theme.spacing.unit * 2,
    textAlign: 'justify',
  },
  image: {
    width: 256,
    height: 256,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

function ProducerHeader(props) {
  const {
    classes, name, firstname, lastname, description, image, ratingValue, nbRating
  } = props;

  return (
    <div className={classes.root}>
      <Grid container spacing={16}>
        <Grid item xs={6} sm container className={classes.leftBox}>
          <ButtonBase className={classes.image}>
            <SimpleImageDialog
              image={image}
            />
          </ButtonBase>

          <RatingItem
            readOnly
            defaultValue={Math.round(ratingValue)}
          />
          <Typography wrap="nowrap">
            {`pour ${nbRating || 0} votes.`}
          </Typography>

        </Grid>

        <Grid item xs={10} sm container>
          <Grid item xs container direction="column" spacing={16}>
            <Grid item xs>
              <Typography variant="h6" wrap="nowrap">
                {`${name}` || 'Pas de nom de point de vente'}
              </Typography>
              <Paper elevation={1}>
                <Typography gutterBottom variant="body1">
                  {description || 'Pas de description.'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

ProducerHeader.propTypes = {
  classes: PropTypes.shape().isRequired,
  lastname: PropTypes.string.isRequired,
  firstname: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string,
  ratingValue: PropTypes.number.isRequired,
  nbRating: PropTypes.number.isRequired,
};

ProducerHeader.defaultProps = {
  image: DefaultUserLogo,
};

export default withStyles(styles)(ProducerHeader);
