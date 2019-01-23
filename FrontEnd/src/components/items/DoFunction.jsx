
import React from 'react';

class DoFunction extends React.Component {
  componentDidMount() {
    const { func } = this.props;
    func();
  };

  render() {
    return null;
  };
};

export default DoFunction;