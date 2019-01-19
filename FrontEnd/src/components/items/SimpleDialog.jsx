import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import withMobileDialog from '@material-ui/core/withMobileDialog';

/**
 * Composant contenant une Dialog vide (pop-up)
 */
function SimpleDialog(props) {
  const { open, onClose, children, fullScreen } = props;

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
      >
        {children}
      </Dialog>
    </div>
  );

}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  fullScreen: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

SimpleDialog.defaultProps = {
  children: null,
  fullScreen: false,
}


export default withMobileDialog()(SimpleDialog);
