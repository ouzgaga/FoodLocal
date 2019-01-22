import React, { Component } from 'react';
import InscriptionProducer from '../components/producerRegistration/InscriptionProducer';
import {AuthContext} from '../components/providers/AuthProvider';
class PageProducerRegistration extends Component {
  constructor(props) {
    super(props);
    document.title = 'Devenir Producteur';
  }

  render() {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor:'white' }}>
        <AuthContext>
          {({ userId }) => <InscriptionProducer userId={userId} />}
        </AuthContext>
      </div>
    );
  }
}

export default PageProducerRegistration;
