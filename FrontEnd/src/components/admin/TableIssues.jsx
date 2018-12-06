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
import TableIssueItem from './TableProducerItem';

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
class TableIssues extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
    };
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const {
      classes, datas, username, repo, state,
    } = this.props;
    const {
      rowsPerPage, page,
    } = this.state;

    const emptyRows = rowsPerPage
      - Math.min(rowsPerPage, datas.length - page * rowsPerPage);
    return (

      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableBody>
              {datas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                <TableRow key={row.cursor} style={{ padding: 0 }}>
                  <TableCell style={{ padding: 0 }}>

                    <TableIssueItem
                      title={row.node.title}
                      number={row.node.number}
                      createdAt={row.node.createdAt}
                      state={state}
                      login={row.node.author.login}
                      username={username}
                      repo={repo}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={3}
                  count={datas.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActionsWrapped}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
    );
  }
}

TableIssues.propTypes = {
  classes: PropTypes.shape().isRequired,
  datas: PropTypes.instanceOf(Array).isRequired,
  username: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
};

export default withStyles(styles)(TableIssues);
