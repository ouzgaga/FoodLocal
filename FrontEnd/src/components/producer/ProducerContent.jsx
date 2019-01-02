import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import ProducerInformations from './ProducerInformations';

const styles = {
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    widht: 1000,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
};

const GET_PRODUCER_INFORMATIONS = gql`
query($producer: ID!) {
  producer(producerId: $producer) {
    email
    phoneNumber
    website
    salespoint {
      name
      address {
        number
        street
        city
        postalCode
        state
        country
        longitude
        latitude
      }
      schedule {
        monday {
          openingHour
          closingHour
        }
        tuesday {
          openingHour
          closingHour
        }
        wednesday {
          openingHour
          closingHour
        }
        thursday {
          openingHour
          closingHour
        }
        friday {
          openingHour
          closingHour
        }
        saturday {
          openingHour
          closingHour
        }
        sunday {
          openingHour
          closingHour
        }
      }
    }
  }
}
`;

class ProducerContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, producerId } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Informations" />
          <Tab label="Produits" />
          <Tab label="Fil d'actualités" />
        </Tabs>
        {value === 0
          && (
            <Query
              query={GET_PRODUCER_INFORMATIONS}
              variables={{ producer: producerId }}
            >
              {({ data, loading, error }) => {
                if (error) return 'Oups une erreur est survenue, veuillez rafraichir la page.';
                if (loading) return 'Loading...';
                return (
                  <ProducerInformations data={data} />
                );
              }}
            </Query>
          )

        }
        {value === 1 && 'Produits'}
        {value === 2 && 'Fil d\'actualité'}
      </div>
    );
  }
}

ProducerContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProducerContent);