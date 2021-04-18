import React from 'react';
import SearchPage from './search-page';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';

export default class Home extends React.Component {
  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    return (
        <SearchPage />
    );
  }

}
Home.contextType = AppContext;
