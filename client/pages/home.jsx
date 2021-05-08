import React from 'react';
// import SearchPage from './search-page';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';
import { CSSTransition } from 'react-transition-group';

export default class Home extends React.Component {
  // _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      logoChange: false
    };
  }

  componentDidMount() {
    const { logoChange } = this.state;
    if (!logoChange) {
      this.changePage = setTimeout(() => {
        this.setState({ logoChange: true });
      }, 2000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.changePage);
  }

  changePage() {
    const timer = setTimeout(() => {
      this.setState({ logoChange: true });
    }, 2000);
    return timer;
  }

  renderChange() {
    const { logoChange } = this.state;
    if (!logoChange) {
      this.changePage();
    }

  }

  render() {
    const { logoChange } = this.state;
    if (logoChange) {
      if (!this.context.user) {
        return <Redirect to="sign-in" />;
      } else {
        return <Redirect to="search-page" />;
      }
    }
    return (
      <CSSTransition
      timeout={2000}
      classNames="slide"
      >
      <div className="home-page">
        {/* {this.renderChange()} */}
        <div className="home-title-container">
          <div className="home-title">BookShelf</div>
          <div className="home-description">Your Own Personal Library</div>
        </div>
        <div className="img-container">
          <div className="book-img"></div>
          <div className="back"></div>
        </div>

      </div>
      </CSSTransition>
    );
  }

}
Home.contextType = AppContext;
