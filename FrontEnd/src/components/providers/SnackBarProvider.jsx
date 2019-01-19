import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { SnackbarProvider, withSnackbar } from 'notistack';

class SnackBarProvider extends React.Component {
  handleClick = () => {
    this.props.enqueueSnackbar('I love snacks.');
  };

  handleClickVariant = variant => () => {
    // variant could be success, error, warning or info
    this.props.enqueueSnackbar('This is a warning message!', { variant });
  };

  render() {
    return (
      <React.Fragment>
        <Button onClick={this.handleClick}>Show snackbar</Button>
        <Button onClick={this.handleClickVariant('warning')}>Show warning snackbar</Button>
      </React.Fragment>
    );
  }
}

function IntegrationNotistack(props) {
  const { children } = props;
  return (
    <SnackbarProvider maxSnack={3}>
      {children}
    </SnackbarProvider>
  );
}

IntegrationNotistack.propTypes = {
  children: PropTypes.node,
};

IntegrationNotistack.defaultProps = {
  children: null,
};


export default withSnackbar(IntegrationNotistack);