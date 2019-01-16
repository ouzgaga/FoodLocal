import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

import ResearchMap from './ResearchMap';
import BorderedCountField from '../items/fields/BorderedCountField';


const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    maxWidth: 1200,
    padding: theme.spacing.unit * 2,
    textAlign: 'justify',
  },
  bootstrapRoot: {
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
  bootstrapInput: {

    minHeight: 100,

    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    //fontSize: 16,
    //padding: theme.spacing.unit,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  bootstrapFormLabel: {
    fontSize: 18,
  },
  margin: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class NewPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMap: false,
      charCount: 0,
      body: '',
    };
  }

  handleClickAddMap = () => {
    this.setState(prevState => ({
      showMap: !prevState.showMap
    }));
  }

  handleChangeText = (event) => {
    this.setState({
      body: event.target.value,
      charCount: event.target.value.length
    });
  }

  handleClickPost = (event) => {
    const post = event.target.value;
    if(this.state.showMap) {
      //NRécupérere l'adresse de la map
    }
    // TODO: insertGraphql
  }

  render() {
    const { classes, maxLenght } = this.props;   
    const { showMap, charCount, body} = this.state;
    return (
      <Paper className={classes.root}>
        <FormControl
          //className={classes.margin}
          margin="normal"
          noValidate
          autoComplete="off"
          fullWidth
        >
          <BorderedCountField
            header="Publier un nouveau post."
            id="new-post-input"
            maxLenght={1024}
            fullWidth
            onChange={this.handleChangeText}
          />
          <div>
            { showMap ? <ResearchMap /> : <div />}
            <Button variant="contained" className={classes.button} onClick={this.handleClickAddMap}>
              { showMap ? 'Retirer la carte' : 'Ajouter une carte'}
            </Button>
            <Button variant="contained" className={classes.button} onClick={this.handleClickPost}>
              Post
            </Button>
          </div>
        </FormControl>
      </Paper>
    );
  }
}

NewPost.propTypes = {
  classes: PropTypes.object.isRequired,
  maxLenght: PropTypes.number.isRequired,
};

export default withStyles(styles)(NewPost);
