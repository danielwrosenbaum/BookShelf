import React from 'react';
// import SearchPage from './search-page';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';

export default class Home extends React.Component {
  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    return (
      <div className="home-page">
        <div className="home-title-container">
          <div className="home-title">BookShelf</div>
          <div className="home-description">Your Own Personal Library</div>
        </div>
        <div className="img-container">
          <div className="book-img"></div>
          <div className="back"></div>
        </div>

      </div>
    );
  }

}
Home.contextType = AppContext;
