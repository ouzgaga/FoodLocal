import React, { Component } from 'react';
import axios from 'axios';
import AddressSuggest from './AddressSuggest';
import AddressInput from './AddressInput';



class AddressForm extends Component {
  constructor(props) {
    super(props);

    const address = '';
    this.state = {
      'address': address,
      'query': '',
      'locationId': ''
    }

    this.onQuery = this.onQuery.bind(this);
  }

  onQuery(evt) {
    const query = evt.target.value;
    if (!query.length > 0) {
      const address = '';
      return this.setState({
        'address': address,
        'query': '',
        'locationId': ''
      })
    }

    const self = this;
    axios.get('https://autocomplete.geocoder.api.here.com/6.2/suggest.json', {
      'params': {
        'app_id': 'qSO8SUPISJTK5GNE0ndG',
        'app_code': 'rTBAuzJ7lhT97Pv8c2H8QA',
        'query': query,
        'maxresults': 1,
      }
    }).then(function (response) {
      const address = response.data.suggestions[0].address;
      const id = response.data.suggestions[0].locationId;
      self.setState({
        'address': address,
        'query': query,
        'locationId': id,
      });
    });
  }

  render() {
    return (
      <div class="container">
        <AddressSuggest
          query={this.state.query}
          onChange={this.onQuery}
        />
        <AddressInput
          street={this.state.address.street}
          city={this.state.address.city}
          state={this.state.address.state}
          postalCode={this.state.address.postalCode}
          country={this.state.address.country}
        />
        <br />
        <button type="submit" className="btn btn-primary">Check</button>
        <button type="submit" className="btn btn-outline-secondary">Clear</button>
      </div>
    );
  }
}

export default AddressForm;