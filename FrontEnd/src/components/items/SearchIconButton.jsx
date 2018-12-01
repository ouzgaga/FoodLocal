import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search';

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  },
  button: {
    margin: theme.spacing.unit,
    size: 'auto',
  },
});

class SearchForm extends React.Component {
  state = {
    text: "",
  };

  handleClick= () => {
      this.props.onClickk();
  }

  render() {
    const { classes, onClickk } = this.props;

    

    return (
      
        <IconButton className={classes.button} aria-label="Delete" onClick={this.handleClick}>
          <SearchIcon />
        </IconButton>
      
    );
  }
}

SearchForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SearchForm);
