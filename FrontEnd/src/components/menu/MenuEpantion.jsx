import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { withStyles } from '@material-ui/core/styles';

import MenuContent from './MenuContent';

const styles = {
  root: {
    flexGrow: 1,
    position: 'fixed',
    weight: '100%',
    height: '64px',
    top: 0,
    shadow: 'none',
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -7,
    marginRight: 20,
    paddingTop: 4,
    height: '60px',
    outline: 'none',
  },
  LinkButton: {
    textDecoration: 'none',
    color: 'secondary',
  }
};

class MenuEpantion extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClickMenu = prop => (event) => {
    console.log(prop);
    this.setState({ anchorEl: event.currentTarget });
    return this.props.onClick(prop);
  };


  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { onClick } = this.props;
    const { anchorEl } = this.state;

    return (
      <>
        <Button
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          Open
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuContent onClick={ this.handleClickMenu} />
        </Menu>
      </>
    );
  }
}

export default withStyles(styles)(MenuEpantion);