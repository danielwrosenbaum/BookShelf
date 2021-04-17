import React from 'react';
import AppContext from '../lib/app-context';

export default class AppDrawer extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      isClicked: false
    };
  }

  handleClick() {
    const isClicked = this.state.isClicked;
    if (!isClicked) {
      this.setState({ isClicked: true });
    } else {
      this.setState({ isClicked: false });

    }
  }

  hideButton() {
    const isClicked = this.state.isClicked;
    if (!isClicked) {
      return 'icon';
    } else {
      return 'button hidden';
    }
  }

  hideModal() {
    const isClicked = this.state.isClicked;
    if (!isClicked) {
      return 'modal-hidden';
    } else {
      return 'modal';
    }
  }

  hideMenu() {
    const isClicked = this.state.isClicked;
    if (!isClicked) {
      return 'menu hidden';
    } else {
      return 'menu';
    }
  }

  overlay() {
    const isClicked = this.state.isClicked;
    if (!isClicked) {
      return 'menu-icon';
    } else {
      return 'overlay';
    }
  }

  render() {
    const buttonClass = this.hideButton();
    const modalClass = this.hideModal();
    const nonModalClass = this.overlay();
    const { user, handleSignOut } = this.context;
    return (
      <div className={nonModalClass} onClick={this.handleClick}>
        <a className={buttonClass} onClick={this.handleClick}><i className="fas fa-bars fa-3x"></i></a>
        <div className="modal-container">
          <div className={modalClass} onClick={this.handleClick}>
            <div className={this.hideMenu()}>
              <div className='menu-heading-container'>
                <div>
                  {user !== null &&
                    <button className="btn btn-dark" onClick={handleSignOut}>
                      Sign out
                <i className="ms-2 fas fa-sign-out-alt" />
                    </button>
                  }
                  {user === null &&
                    <>
                      <a href="#sign-in" className="btn btn-primary">
                        Sign In
                </a>
                      <a href="#sign-up" className="btn btn-dark">
                        Sign Up
                </a>
                    </>
                  }
                </div>
                <div className="menu-heading">Menu</div>
              </div>
              <div className="menu-list">
                <a href="#search-page">
                  <div className="menu-item">Search</div>
                </a>
                <a href="#library">
                  <div className="menu-item">Library</div>
                </a>
                <a href="#reading-list">
                  <div className="menu-item">Reading List</div>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
AppDrawer.contextType = AppContext;
