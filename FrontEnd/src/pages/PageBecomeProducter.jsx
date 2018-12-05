import React, { Component } from 'react';
import InscriptionProducer from '../components/NewProducer/InscriptionProducer';

class PageBecomeProducer extends Component {
  constructor(props) {
    super(props);
    document.title = 'Devenir Producteur';
  }

  render() {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor:'white' }}>
        <InscriptionProducer />
      </div>
    );
  }
}

export default PageBecomeProducer;
