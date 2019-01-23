
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import NotificationsNoneIcone from '@material-ui/icons/NotificationsNone';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 3,
  },
});

/**
 * Composant qui affiche l'icone de notification avec un nombre à coté.
 * Le nombre max est 99. Si le nombre == 0, il n'est pas affiché
 */
function NotificationBagde(props) {
  const { value } = props;

  return (
    <React.Fragment>
      <Badge badgeContent={value} max={99} color="primary">
        <NotificationsNoneIcone />
      </Badge>
    </React.Fragment>
  );
}

NotificationBagde.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.number.isRequired,
};

export default withStyles(styles)(NotificationBagde);
