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
import gql from 'graphql-tag';
import { Query } from 'react-apollo';


const query = gql`
{
  productTypeCategories {
    id
    name
    image
  }
}
`;

const query2 = gql`
  query Dog($productTypeCategoryId: ID!) {
    productTypesOfCategory(productTypeCategoryId : $productTypeCategoryId) {
      id
      name
      image
    }
  }
`;

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
  filters: {
    paddingTop:8,
    paddingLeft:10,

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
      openFiltres: false,
      value: null,
    };
  }

  // ouvre le pop-up pour les filtres
  handleClickOpenFilters = () => {
    this.setState({ openFiltres: true });
  };

  // ferme le pop-up des filtres
  handleClose = () => {
    this.setState({ openFiltres: false });
  };

  onclick = id => (event) => {
    event.preventDefault();
    this.setState({ value: id });
  }

  render() {
    const { classes } = this.props;
    const { fullScreen } = this.props;
    const { value } = this.state;
    const { items, addItem, removeItem } = this.props;
    return (

      <div className={classes.filterBar}>

        <div className={classes.filters}>
          {items.length === 0 ? (
            <Button onClick={this.handleClickOpenFilters} variant="outlined" size="small" className={classes.margin}>
              {'Produits'}
            </Button>
          ) : (
              <Button onClick={this.handleClickOpenFilters} variant="contained" size="small" className={classes.margin} color="primary">
                {`Produits : ${items.length}`}
              </Button>
            )}
</div>
        
        
        
        <Dialog
          fullScreen={fullScreen}
          fullWidth
          maxWidth={false}
          open={this.state.openFiltres}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">Séléctionnez les produits que vous cherchez</DialogTitle>
          <DialogContent>
            <div className={classes.root}>
              <Grid container spacing={24}>
                <Query query={query}>
                  {({ data, loading, error }) => {
                    if (error) return 'Oups an error occured. Please check the console';
                    if (loading) return 'Loading...';
                    const { productTypeCategories } = data;

                    return (
                      productTypeCategories.map(product => (
                        <Grid item xs={4} sm={2} key={product.id}>
                          <div className={classes.paper}>
                            <Card className={classes.media} style={{ margin: '0 auto' }}>
                              <CardActionArea onClick={this.onclick(product.id)}>
                                {value === product.id
                                  ? (
                                    <CardMedia className={classes.media2} image={product.image} title={product.name} />
                                  ) : (
                                    <CardMedia className={classes.media} image={product.image} title={product.name} />
                                  )}
                              </CardActionArea>
                            </Card>

                            <div className={classes.paper}>
                              <Typography align="center" className={classes.typo} variant="body1" gutterBottom>
                                {product.name}
                              </Typography>
                            </div>
                          </div>
                        </Grid>
                      ))
                    );
                  }}
                </Query>

                <Grid item xs={12}>
                  <Divider variant="middle" />
                </Grid>
                {value !== null && (

                  <Query query={query2} variables={{ productTypeCategoryId: value }}>
                    {({ data, loading, error }) => {
                      if (error) return 'Oups an error occured.2 Please check the console';
                      if (loading) return 'Loading...';
                      const { productTypesOfCategory } = data;
                      return (
                        productTypesOfCategory.map(product => (
                          <Grid item xs={4} sm={2}>

                            <Card className={classes.media} style={{ margin: '0 auto' }}>

                              {has(items, product.id) ? (
                                <CardActionArea onClick={removeItem(product.id)}>

                                  <CardMedia className={classes.media2} image={product.image} title={product.name} />
                                </CardActionArea>

                              ) : (
                                  <CardActionArea onClick={addItem(product.id)}>
                                    <CardMedia className={classes.media} image={product.image} title={product.name} />
                                  </CardActionArea>
                                )
                              }

                            </Card>
                            <div className={classes.paper}>
                              <Typography className={classes.typo} variant="body1" gutterBottom>
                                {product.name}
                              </Typography>
                            </div>
                          </Grid>
                        ))
                      );
                    }}
                  </Query>

                )}
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={this.handleClose} color="primary" autoFocus>
              {'Voir les producteurs'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(withMobileDialog()(FilerProducts));
