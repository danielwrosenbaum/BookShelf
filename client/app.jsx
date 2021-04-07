import React from 'react';
import parseRoute from './lib/parse-route';
import SearchPage from './pages/search-page';
import AdvancedSearch from './pages/advanced-search';
import AppDrawer from './components/appdrawer';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', e => {
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
  }

  render() {
    return (
    <>
    <AppDrawer />
    {this.renderPage()}
    </>
    );
  }
}
