import React, { Component } from 'react';

class PageNewAccount extends Component {
  constructor(props) {
    super(props);
    document.title = 'Nouveau Compte';
  }
  
  render() {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor:'white' }}>
      </div>
    );
  }
}

export default PageNewAccount;
