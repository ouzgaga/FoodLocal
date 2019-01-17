import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Slider from '@material-ui/lab/Slider';

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
import ErrorLoading from '../ErrorLoading';
import Loading from '../Loading';


const GET_PRODUCTS_CATEGORIES = gql`
query {
  productTypeCategories(first:6) {
    edges {
      node {
        id
        name
        image
      }
    }
  }
}
`;

const GET_NUMBER_OF_PRODUCTS_TYPE = gql`
query($productTypeCategoryId: ID!) {
  productTypesOfCategory(productTypeCategoryId: $productTypeCategoryId, first:3) {
    totalCount
  }
}
`;


const GET_PRODUCTS_TYPES_OF_CATEGORY = gql`
  query ($productTypeCategoryId: ID!, $first:Int) {
    productTypesOfCategory(productTypeCategoryId : $productTypeCategoryId, first: $first) {
      edges {
        node {
          id
          name
          image
        }
      }
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
    paddingTop: 8,
    paddingLeft: 10,

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
  slider: {
    width: 400,
    padding: '30px 0px',
    overflowX: 'hidden',
  },
  margin: {
    marginLeft: 10,
  }
};


function has(products, product) {
  let hasProduct = false;
  products.forEach((item) => {
    if (item === product) {
      hasProduct = true;
    }
  });
  return hasProduct;
}


class FilerProducts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openFiltresProducts: false,
      openFiltresDistance: false,
      value: null,
      distance: props.maxDistance,
    };
  }

  // ouvre le pop-up pour les filtres
  handleClickOpenFiltersProducts = () => {
    this.setState({ openFiltresProducts: true });
  };

  // ferme le pop-up des filtres
  handleCloseFiltersProducts = () => {
    this.setState({ openFiltresProducts: false });
  };

  // ouvre le pop-up pour les filtres de distance
  handleClickOpenFiltersDistance = () => {
    this.setState({ openFiltresDistance: true });
  };

  // ferme le pop-up des filtres de distance
  handleCloseFiltersProductsDistance = (event) => {
    this.setState({ openFiltresDistance: false });
  };

  handleCloseFiltersProductsDistanceWithValue = (event) => {
    event.preventDefault();
    this.props.changeMaxDistance(this.state.distance);
    this.handleClickOpenFiltersDistance();
  };

  changeDistance = (event, value) => {
    this.setState({
      distance: value
    });
  };

  onclick = id => (event) => {
    event.preventDefault();
    this.setState({ value: id });
  };

  render() {
    const { classes } = this.props;
    const { fullScreen } = this.props;
    const { value, distance } = this.state;
    const {
      products, addProduct, removeProduct, maxDistance, changeMaxDistance
    } = this.props;
    return (

      <div className={classes.filterBar}>

        <div className={classes.filters}>
          {products.length === 0
            ? (
              <Button onClick={this.handleClickOpenFiltersProducts} variant="outlined" size="small" className={classes.margin}>
                {'Produits'}
              </Button>
            )
            : (
              <Button onClick={this.handleClickOpenFiltersProducts} variant="contained" size="small" className={classes.margin} color="primary">
                {`Produits : ${products.length}`}
              </Button>
            )}

          <Button onClick={this.handleClickOpenFiltersDistance} variant="outlined" size="small" className={classes.margin}>
            {`Distance : ${maxDistance === 100 ? 'Max' : `${maxDistance}km`} `}
          </Button>

        </div>

        <Dialog
          fullScreen={fullScreen}
          fullWidth
          maxWidth={false}
          open={this.state.openFiltresProducts}
          onClose={this.handleCloseFiltersProducts}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">Séléctionnez les produits que vous cherchez</DialogTitle>
          <DialogContent>
            <div className={classes.root}>
              <Grid container spacing={24}>
                <Query query={GET_PRODUCTS_CATEGORIES}>
                  {({ data, loading, error }) => {
                    if (error) return <ErrorLoading />;
                    if (loading) return <Loading />;
                    const { productTypeCategories } = data;

                    return (
                      productTypeCategories.edges.map(({ node }) => (
                        <Grid item xs={4} sm={2} key={node.id}>
                          <div className={classes.paper}>
                            <Card className={classes.media} style={{ margin: '0 auto' }}>
                              <CardActionArea onClick={this.onclick(node.id)}>
                                {value === node.id
                                  ? (
                                    <CardMedia className={classes.media2} image={node.image} title={node.name} />
                                  ) : (
                                    <CardMedia className={classes.media} image={node.image} title={node.name} />
                                  )}
                              </CardActionArea>
                            </Card>

                            <div className={classes.paper}>
                              <Typography align="center" className={classes.typo} variant="body1" gutterBottom>
                                {node.name}
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

                  <Query query={GET_PRODUCTS_TYPES_OF_CATEGORY} variables={{ productTypeCategoryId: value }}>
                    {({ data, loading, error }) => {
                      if (error) return <ErrorLoading />;
                      if (loading) return <Loading />;
                      const { productTypesOfCategory } = data;
                      return (
                        productTypesOfCategory.edges.map(({ node }) => (
                          <Grid item xs={4} sm={2}>

                            <Card className={classes.media} style={{ margin: '0 auto' }}>

                              {has(products, node.id)
                                ? (
                                  <CardActionArea onClick={removeProduct(node.id)}>

                                    <CardMedia className={classes.media2} image={node.image} title={node.name} />
                                  </CardActionArea>
                                )
                                : (
                                  <CardActionArea onClick={addProduct(node.id)}>
                                    <CardMedia className={classes.media} image={node.image} title={node.name} />
                                  </CardActionArea>
                                )
                              }

                            </Card>
                            <div className={classes.paper}>
                              <Typography className={classes.typo} variant="body1" gutterBottom>
                                {node.id}
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
            <Button variant="contained" onClick={this.handleCloseFiltersProducts} color="primary" autoFocus>
              {'Voir les producteurs'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullScreen={fullScreen}
          open={this.state.openFiltresDistance}
          onClose={this.handleCloseFiltersProductsDistance}
        >
          <DialogTitle>Distance de recherche</DialogTitle>
          <DialogContent>

            <Typography>{`Distance maximum : ${distance === 100 ? 'Max' : `${distance}km`}`}</Typography>

            <Slider
              classes={{ container: classes.slider }}
              value={distance}
              min={1}
              max={100}
              step={1}
              onChange={this.changeDistance}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseFiltersProductsDistance} color="primary">Annuler</Button>
            <Button variant="contained" onClick={changeMaxDistance(distance)} color="primary">Voir les producteurs</Button>
          </DialogActions>
        </Dialog>

      </div>
    );
  }
}

export default withStyles(styles)(withMobileDialog()(FilerProducts));
