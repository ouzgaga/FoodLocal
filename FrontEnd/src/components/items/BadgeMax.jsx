/*
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
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
      <Badge className={classes.margin} badgeContent={99} max={900} color="primary">
        <MailIcon />
      </Badge>
      <Badge className={classes.margin} badgeContent={100} max={900} color="primary">
        <MailIcon />
      </Badge>
      <Badge className={classes.margin} badgeContent={value} max={9} color="primary">
        <MailIcon />
      </Badge>
    </React.Fragment>
  );
}

NotificationBagde.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.number.isRequired,
};

export default withStyles(styles)(NotificationBagde);
*/
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import NotificationIcon from "@material-ui/icons/NotificationsNone";

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 3
  }
});

function BadgeMax(props) {
  const { classes } = props;

  return (
    <React.Fragment>
      <Badge
        className={classes.margin}
        badgeContent={1000}
        max={10}
        color="primary"
      >
        <NotificationIcon />
      </Badge>
    </React.Fragment>
  );
}

BadgeMax.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BadgeMax);
