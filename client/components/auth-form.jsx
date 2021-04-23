import React from 'react';
import AppContext from '../lib/app-context';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'guest',
      isClicked: false,
      error: false,
      password: 'guest',
      alreadyExists: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickBack = this.handleClickBack.bind(this);
    // this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleDemo() {
    if (window.location.hash === 'sign-in') {
      return 'guest';
    } else {
      return event.target.value;
    }
  }

  handleError() {
    return (
      <div className='error-container'>
        <div className="error-pop-up">
          <div>Incorrect Username or Password</div>
        </div>
      </div>
    );
  }

  userExists() {
    return (
      <div className='error-container'>
        <div className="error-pop-up">
          <div>Username is taken. Please try again!</div>
        </div>
      </div>

    );
  }

  handleClickBack() {
    this.setState({
      error: false,
      alreadyExists: false
    });
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
        if (result === 23505) {
          this.setState({ alreadyExists: true });
        } else {
          if (action === 'sign-up') {
            window.location.hash = 'sign-in';
          } else if (result.user && result.token) {
            this.props.onSignIn(result);
          } else {
            this.setState({ error: true });
          }
        }
      });
  }

  render() {
    const demoUser = value => {
      if (window.location.hash === '#sign-in') {
        return this.state.username;
      } else {
        return value;
      }
    };
    const demoPassword = value => {
      if (window.location.hash === '#sign-in') {
        return this.state.password;
      } else {
        return value;
      }
    };
    const { error, alreadyExists } = this.state;
    const { action } = this.props;
    const { handleChange, handleSubmit } = this;
    const alternateActionHref = action === 'sign-up'
      ? '#sign-in'
      : '#sign-up';
    const alternatActionText = action === 'sign-up'
      ? 'Sign in'
      : 'Register';
    const submitButtonText = action === 'sign-up'
      ? 'Register'
      : 'Log In';
    return (
    <form className='sign-in-form'onSubmit={handleSubmit} onClick={this.handleClickBack}>
      {(error) &&
      this.handleError()}
        {(alreadyExists) &&
          this.userExists()}
      <div className="sub-col">
        <label htmlFor="username" className="heading three">
          Username
          </label>
        <input
          required
          autoFocus
          id="username"
          type="text"
          name="username"
          value={demoUser(this.value)}
          onChange={handleChange}
          className="text-box" />
      </div>
      <div className='sub-col'>
        <label htmlFor="password" className="heading three">
          Password
          </label>
        <input
          required
          id="password"
          value={demoPassword(this.value)}
          type="password"
          name="password"
          onChange={handleChange}
          className="text-box" />
      </div>
      <div className="sign-in-button-container">
          <a className="sign-button" href={alternateActionHref}>
            {alternatActionText}
          </a>
        <button type="submit" className="sign-button" >
          {submitButtonText}
        </button>
      </div>
    </form>
    );
  }
}

AuthForm.contextType = AppContext;
