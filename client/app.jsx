import React from 'react';
import parseRoute from './lib/parse-route';
import SearchPage from './pages/search-page';
import AdvancedSearch from './pages/advanced-search';
import AppDrawer from './components/appdrawer';
import Results from './pages/results';
import AppContext from './lib/app-context';
import PageContainer from './components/page-container';
// import Header from './components/header';
import Details from './pages/details';
import Library from './pages/library';
import ReadingList from './pages/reading-list';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      data: null
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    }
    );
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === 'search-page' || route.path === '') {
      return <SearchPage />;
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
  }

  render() {
    const { data, route } = this.state;
    const contextValue = { data, route };
    return (
      <AppContext.Provider value={contextValue}>
        <>
        {/* {route.path !== 'search-page' &&
        route.path !== 'advanced-search' &&
        route.path !== '' &&
          <Header />} */}
          <AppDrawer />
          <PageContainer>
            {this.renderPage()}
          </PageContainer>
        </>
      </AppContext.Provider>
    );
  }
}
App.contextType = AppContext;
