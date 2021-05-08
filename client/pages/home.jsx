import React from 'react';
// import SearchPage from './search-page';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';
import bookCover from '../../server/public/book-cover.jpeg';

export default class Home extends React.Component {
  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    return (
        // <SearchPage />
        <div className="home-page">
        {/* <div className="home-title">BookShelf</div> */}
          <div className="img-container">
          <img className="book-cover" src={bookCover} alt="book" />
          </div>

        </div>
    );
  }

}
Home.contextType = AppContext;
