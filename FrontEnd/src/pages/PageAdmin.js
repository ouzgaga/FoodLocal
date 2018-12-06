import React, { Component } from 'react';
import Admin from '../components/admin/Admin';

class PageAdmin extends Component {
  constructor(props) {
    super(props);
    document.title = 'Devenir Producteur';
  }

  render() {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor:'white' }}>
        <Admin />
      </div>
    );
  }
}

export default PageAdmin;
