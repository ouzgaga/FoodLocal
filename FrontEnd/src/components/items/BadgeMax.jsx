
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

function NotificationBagde(props) {
  const { classes, value } = props;

  return (
    <React.Fragment>
      <Badge className={classes.margin} badgeContent={value} max={99} color="primary">
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
