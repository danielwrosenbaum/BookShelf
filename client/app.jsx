import React from 'react';
import parseRoute from './lib/parse-route';
import decodeToken from './lib/decode-token';
import SearchPage from './pages/search-page';
import AdvancedSearch from './pages/advanced-search';
import AppDrawer from './components/appdrawer';
import Results from './pages/results';
import AppContext from './lib/app-context';
import PageContainer from './components/page-container';
import Details from './pages/details';
import Library from './pages/library';
import ReadingList from './pages/reading-list';
import Auth from './pages/auth';
import Home from './pages/home';
import ReadingPlan from './pages/reading-plan';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthorizing: true,
      route: parseRoute(window.location.hash),
      data: null
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  // componentDidMount listens for a hashchange and then sets state with the parsed hash
  // it grabs the value of the key "react-context-jwt" that was passed when signing in and assigns to variable token
  // if there is a token, a user variable is created with the value of the decodetoken function with argument token
  // that user is set to state and isAuthorizing is set to false
  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    }
    );
    const token = window.localStorage.getItem('react-context-jwt');
    const user = token ? decodeToken(token) : null;
    this.setState({ user, isAuthorizing: false });
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('react-context-jwt', token);
    this.setState({ user });
  }

  handleSignOut() {
    window.localStorage.removeItem('react-context-jwt');
    this.setState({ user: null });
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === '' || route.path === 'home') {
      return <Home />;
    }
    if (route.path === 'search-page') {
      return <SearchPage />;
    }
    if (route.path === 'sign-in' || route.path === 'sign-up') {
      return <Auth />;
    }
    if (route.path === 'advanced-search') {
      return <AdvancedSearch />;
    }
    if (route.path === 'results') {
      return <Results />;
    }
    if (route.path === 'details') {
      return <Details />;
    }
    if (route.path === 'library') {
      return <Library />;
    }
    if (route.path === 'reading-list') {
      return <ReadingList />;
    }
    if (route.path === 'reading-plan') {
      return <ReadingPlan />;
    }
  }

  render() {
    const { user, route } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, route, handleSignIn, handleSignOut };
    return (
      <AppContext.Provider value={contextValue}>
        <>{(route.path !== '') &&
          <AppDrawer />
        }
          <PageContainer>
            {this.renderPage()}
          </PageContainer>
        </>
      </AppContext.Provider>
    );
  }
}
App.contextType = AppContext;
