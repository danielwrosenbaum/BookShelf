import React from 'react';
import AppContext from '../lib/app-context';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { action } = this.props;
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    };
    fetch(`/api/bookShelf/${action}`, req)
      .then(res => res.json())
      .then(result => {
        if (action === 'sign-up') {
          window.location.hash = 'sign-in';
        } else if (result.user && result.token) {
          this.props.onSignIn(result);
        }
      });
  }

  render() {
    const { action } = this.props;
    const { handleChange, handleSubmit } = this;
    const alternateActionHref = action === 'sign-up'
      ? '#sign-in'
      : '#sign-up';
    const alternatActionText = action === 'sign-up'
      ? 'Sign in instead'
      : 'Register now';
    const submitButtonText = action === 'sign-up'
      ? 'Register'
      : 'Log In';
    return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username" className="heading three">
          Username
          </label>
        <input
          required
          autoFocus
          id="username"
          type="text"
          name="username"
          onChange={handleChange}
          className="text-box" />
      </div>
      <div>
        <label htmlFor="password" className="heading three">
          Password
          </label>
        <input
          required
          id="password"
          type="password"
          name="password"
          onChange={handleChange}
          className="text-box" />
      </div>
      <div className="sign-in-button-container">
          <a className="button submit" href={alternateActionHref}>
            {alternatActionText}
          </a>
        <button type="submit" className="button submit">
          {submitButtonText}
        </button>
      </div>
    </form>
    );
  }
}

AuthForm.contextType = AppContext;
