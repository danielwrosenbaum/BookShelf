import React from 'react';
import Redirect from '../components/redirect';
import AuthForm from '../components/auth-form';
import AppContext from '../lib/app-context';

export default class AuthPage extends React.Component {
  render() {

    const { user, route, handleSignIn } = this.context;
    if (user) return <Redirect to="search-page" />;
    const weclomeMessage = (
      (route.path === 'sign-in')
        ? 'Please sign in to continue'
        : 'Create an account to get started!'
    );
    return (
      <div className="sign-in-page">
        <div className="sign-in-container">
          <div className="title">
            <div className="title-heading one-blue">
              BookShelf
            </div>
          </div>
          <div className='sign-in-box'>
            <div className="heading three">{weclomeMessage}</div>
            <div className="sign-col">
              <AuthForm
                key={route.path}
                action={route.path}
                onSignIn={handleSignIn} />
            </div>
          </div>

        </div>
      </div>
    );
  }
}
AuthPage.contextType = AppContext;
