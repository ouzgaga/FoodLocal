import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';

import TablePaginationActionsWrapped from './TablePaginationActions';
import TableProducerItem from './TableProducerItem';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

/**
 * Classe pour la table contenant les différente issues
 */
class TableProducers extends React.Component {

  render() {
    const {
      classes, entries
    } = this.props;



    console.log(entries)
    return (
      <Table className={classes.table}>
        {entries.edges.map(({ node }) => (
          node.salespoint
          && (
            <TableRow style={{ padding: 0 }}>
              <div>{node.salespoint.name}</div>
            </TableRow>
          )))}



      </Table>

    );
  }
}

TableProducers.propTypes = {
  classes: PropTypes.shape().isRequired,
  username: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
};

export default withStyles(styles)(TableProducers);
