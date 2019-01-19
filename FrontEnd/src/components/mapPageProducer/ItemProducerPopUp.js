/* Composant pour les pop-up lorsque l'on clique sur les markers de la carte
   Auteur : FoodLocal
*/
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Loading from '../Loading';
import ErrorLoading from '../ErrorLoading';

const styles = theme => ({
  card: {
    minWidth: 300,
    minHeight: 250,
    width: '100%',
    paddingTop: 0,
  },
  cardContent: {
    root: {
      paddingTop: 0,
    }
  },
  titleItem: {
    backgroundColor: '#E8F6F4',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
    padding: 10,
    minWidth:300,
  },
  gridListTile: {
    maxHeight: 200,
    maxWidth: 100,
  },
  media: {
    height: 60,
    width: 60,
    borderStyle: 'solid',
    borderWidth: '1px',
  },
  paper: {
    textAlign: 'center',
    maxHeight: 150,
    maxWidth: 100,
  },
});

// Permet de récupérer les informations nécessaires d'un producteur à partir de son id
const GET_PRODUCER_INFORMATIONS = gql`
query($producerId: ID!) {
  producer(producerId: $producerId) {
    salespoint{
      name
      address {
        distance
        city
      }
    }
    products {
      pageInfo{
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          productType {
            id
            name
            image
          }
        }
      }
    }
  }
}
`;

function ListItemProducer(props) {
  const { classes, producer } = props;
  const producerId = producer.id;
  const link = `/producer/${producerId}`;

  return (

    <Query
      query={GET_PRODUCER_INFORMATIONS}
      variables={{ producerId }}
    >
      {({
        data, loading, error
      }) => {
        if (error) return <ErrorLoading />;
        if (loading) return <Loading />;

        const producerDetails = data.producer;
        return (
          <Fragment>
            {
              producerDetails.salespoint !== null && (
                <Card className={classes.card}>
                  <CardActionArea href={link} target="_blank">
                    <CardHeader title={producerDetails.salespoint.name} subheader={producerDetails.salespoint.address.city} className={classes.titleItem} />
                    <div className={classes.root}>
                      <GridList className={classes.gridList}>
                        {producerDetails.products.edges.map(({ node }) => (
                          <div className={classes.paper} key={node.productType.id}>
                            <GridListTile key={node.productType.name} className={classes.gridListTile} style={{ margin: '0 auto' }}>
                              <CardMedia className={classes.media} image={node.productType.image} title={node.productType.name} />
                              <Typography className={classes.typo} gutterBottom>
                                {node.productType.name}
                              </Typography>
                            </GridListTile>
                          </div>
                        ))}
                      </GridList>
                    </div>
                  </CardActionArea>

                </Card>
              )
            }
          </Fragment>
        );
      }}
    </Query>
  );
}

ListItemProducer.propTypes = {
  classes: PropTypes.shape().isRequired,
  producer: PropTypes.shape().isRequired,
};

export default withStyles(styles, { withTheme: true })(ListItemProducer);
