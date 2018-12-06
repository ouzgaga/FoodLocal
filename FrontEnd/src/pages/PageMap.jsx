import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import MainMap from '../components/MapPage/MainMap';


const query = gql`
{
  producers {
    id
    salesPoint {
      name
      address {
        city
        latitude
        longitude
      }
    }
    products {
      productType {
        id
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

    this.state = {
      items: [],
    };
  }

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
    const { items } = this.state;

    return (
      <Query query={query}>
        {({ data, loading, error }) => {
          if (error) return 'Oups an error occured. Please check the console';
          if (loading) return 'Loading...';
          return (
            <MainMap data={data} items={items} addItem={this.addItem} removeItem={this.removeItem} />
          );
        }}
      </Query>
    );
  }
}

export default PageMap;
