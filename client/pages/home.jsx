import React from 'react';
// import SearchPage from './search-page';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';
import { CSSTransition } from 'react-transition-group';

export default class Home extends React.Component {
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
    }, 1000);
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
      in={true}
        timeout={3000}
        classNames="fade"
      >
        <div className="animate__animated animate__fadeOut animate__delay-3s home-page">
        <div className="home-title-container">
            <div className="animate__animated animate__fadeInUp home-title">BookShelf</div>
          <div className="home-description">Your Own Personal Library</div>
        </div>
          <div className=" img-container">
            <div className="animate__animated animate__fadeInLeft book-img"></div>
          <div className="back"></div>
        </div>

      </div>
      </CSSTransition>
    );
  }

}
Home.contextType = AppContext;
