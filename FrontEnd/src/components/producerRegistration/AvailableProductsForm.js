import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { IncriptionProducerContext } from './InscriptionProducer';
import ErrorLoading from '../ErrorLoading';

const query = gql`
  query {
  productTypeCategories {
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

const query2 = gql`
 query($productTypeCategoryId: ID!) {
  productTypesOfCategory(productTypeCategoryId: $productTypeCategoryId) {
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

const styles = ({
  root: {
    flexGrow: 1,
  },
  paper: {
    textAlign: 'center',
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
});

function has(items, product) {
  let hasItem = false;
  items.forEach((item) => {
    if (item.item === product) {
      hasItem = true;
    }
  });
  return hasItem;
}

class AvailableProductsForm extends Component {
  state = {
    value: null,
  }

  onclick = id => (event) => {
    event.preventDefault();
    this.setState({ value: id });
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <IncriptionProducerContext>
        {({
          values, nextStep, prevStep, addItem, removeItem
        }) => (
            <div className={classes.root}>
              <Grid container spacing={24}>
                <Query query={query}>
                  {({ data, loading, error }) => {
                    if (error) return <ErrorLoading />;
                    if (loading) return <p>Chargement...</p>;
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

                  <Query query={query2} variables={{ productTypeCategoryId: value }}>
                    {({ data, loading, error }) => {
                      if (error) return <ErrorLoading />;
                      if (loading) return <p>Chargement...</p>;
                      const { productTypesOfCategory } = data;
                      return (
                        productTypesOfCategory.edges.map(({ node }) => (
                          <Grid item xs={4} sm={2}>

                            <Card className={classes.media} style={{ margin: '0 auto' }}>

                              {has(values.items, node)
                                ? (
                                  <CardActionArea onClick={removeItem(node)}>

                                    <CardMedia className={classes.media2} image={node.image} title={node.name} />
                                  </CardActionArea>

                                )
                                : (
                                  <CardActionArea onClick={addItem(node)}>
                                    <CardMedia className={classes.media} image={node.image} title={node.name} />
                                  </CardActionArea>
                                )
                              }

                            </Card>
                            <div className={classes.paper}>
                              <Typography className={classes.typo} variant="body1" gutterBottom>
                                {node.name}
                              </Typography>
                            </div>
                          </Grid>
                        ))
                      );
                    }}
                  </Query>

                )}
                <Grid item xs={12}>
                  <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item xs={4}>
                      <div className={classes.paper}>
                        <Button variant="contained" onClick={(e) => { e.preventDefault(); prevStep(); }} color="inherit">PRÉCÉDENT</Button>
                      </div>
                    </Grid>
                    <Grid item xs={4}>
                      <div className={classes.paper}>
                        <Button variant="contained" onClick={(e) => { e.preventDefault(); nextStep(); }} color="primary">SUIVANT</Button>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          )}
      </IncriptionProducerContext>
    );
  }
}

AvailableProductsForm.propTypes = {
  classes: PropTypes.shape().isRequired,
};

export default withStyles(styles)(AvailableProductsForm);
