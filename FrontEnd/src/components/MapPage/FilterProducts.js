import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import MarkerCarotte from '../../img/MarkerCarotte.png';


const Products = require('../../Datas/Products.json'); // TODO

const styles = {
  map: {
    backgroundColor: '#CCCCCC',
    position: 'sticky',
    top: 0,
    left: 0,
    right: 0,
    height: 'calc(100vh - 114px)',
  },
  filterBar: {
    backgroundColor: '#FFFFFF',
    height: 50,
    width: '100%',
    borderBottom: '1px solid grey',
  },
  media: {
    height: 80,
    width: 80,
  },
  media2: {
    height: 80,
    width: 80,
    backgroundColor: '#66CCCC',
  },
};
const myIcon = L.icon({
  iconUrl: MarkerCarotte,
  iconSize: [40, 40],
  iconAnchor: [20, 37],
  PopupAnchor: [-20, -20],
});

function has(items, product) {
  let hasItem = false;
  items.forEach((item) => {
    if (item === product) {
      hasItem = true;
    }
  });
  return hasItem;
}


class FilerProducts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      openFiltresProducts: false,
      value: Products.products[0].items,
    };
  }

  // ouvre le pop-up pour les filtres
  handleClickOpenFilters = () => {
    this.setState({ openFiltresProducts: true }); // TODO :mettre ca au parent
  };

  // ferme le pop-up des filtres
  handleClose = () => {
    this.setState({ openFiltresProducts: false });
  };

  addItem = newItem => () => {
    const { items } = this.state;
    this.setState({
      items: [...items, newItem]
    });
  }

  // supprime un produit du tableau des produits
  removeItem = itemToDelete => () => {
    const { items } = this.state;
    const newItems = items.filter(item => item !== itemToDelete);

    this.setState({
      items: [...newItems]
    });
  }

  render() {
    const { classes } = this.props;
    const { fullScreen } = this.props;

    return (

      <Dialog
        fullScreen={fullScreen}
        fullWidth
        maxWidth={false}
        open={this.state.openFiltres}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Séléctionnez les produits que vous cherchez"}</DialogTitle>
        <DialogContent>
          <div className={classes.root}>
            <Grid container spacing={24}>
              {Products.products.map(product => (
                <Grid item xs={4} sm={2} key={product.name}>
                  <div className={classes.paper}>
                    <Card className={classes.media} style={{ margin: '0 auto' }}>
                      <CardActionArea onClick={() => { this.setState({ value: product.items }); }}>
                        {this.state.value === product.items
                          ? (
                            <CardMedia className={classes.media2} image={MarkerCarotte} title={product.name} />
                          ) : (
                            <CardMedia className={classes.media} image={MarkerCarotte} title={product.name} />
                          )}
                      </CardActionArea>
                    </Card>

                    <div className={classes.paper}>
                      <Typography className={classes.typo} variant="body1" gutterBottom>
                        {product.name}
                      </Typography>
                    </div>
                  </div>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Divider variant="middle" />
              </Grid>
              {this.state.value !== undefined && this.state.value.map(product => (
                <Grid item xs={4} sm={2}>

                  <Card className={classes.media} style={{ margin: '0 auto' }}>

                    {has(this.state.items, product) ? (
                      <CardActionArea onClick={this.removeItem(product)}>

                        <CardMedia className={classes.media2} image={MarkerCarotte} title={product} />
                      </CardActionArea>

                    ) : (
                        <CardActionArea onClick={this.addItem(product)}>
                          <CardMedia className={classes.media} image={MarkerCarotte} title={product} />
                        </CardActionArea>
                      )
                    }

                  </Card>
                  <div className={classes.paper}>
                    <Typography className={classes.typo} variant="body1" gutterBottom> {product} </Typography>
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={this.handleClose} color="primary" autoFocus>
            {'Voir les producteurs'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(withMobileDialog()(FilerProducts));
