import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import MainMap from '../components/MapPage/MainMap';


const query = gql`
{
  producers {
    salesPoint {
      name 
      address {
        city
      }
    }
    products {
      productType {
        name
        image
      }
    }
  }
}
`;

class PageMap extends React.Component {
  constructor(props) {
    super(props);
    document.title = 'Carte';
  }

  render() {
    return (
      <Query query={query}>
        {({ data, loading, error }) => {
          if (error) return 'Oups an error occured. Please check the console';
          if (loading) return 'Loading...';
          return (
            <MainMap data={data} />
          );
        }}
      </Query>
    );
  }
}

PageMap.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default PageMap;
