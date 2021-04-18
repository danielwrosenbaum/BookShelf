import React from 'react';

export default class SignIn extends React.Component {
  render() {
    const { id } = this.props;
    let msg;
    if (id === 'save') {
      msg = 'save to your Library.';
    }
    if (id === 'add') {
      msg = 'add to your Reading List.';
    }
    return (
      <div className="overlay">
        <div className='pop-up-container'>
          <div className='sign-in-pop-up'>
            <div className=''>{
              `Please Sign in to ${msg}`
            }
          </div>
            <div className='sign-in-button-container'>
              <a href="#sign-in">
                <button className='sign-button'>Sign In</button>
              </a>
              <a href="#sign-up" >
                <button className="sign-button">Sign Up</button>
              </a>
            </div>
          </div>

        </div>

      </div>

    );
  }
}
