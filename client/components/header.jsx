import React from 'react';
import AppContext from '../lib/app-context';

export default class Header extends React.Component {

  render() {
    // const { route } = this.context;
    // console.log(route);
    return (
      <div className="header"></div>
    );
  }
}

Header.contextType = AppContext;
