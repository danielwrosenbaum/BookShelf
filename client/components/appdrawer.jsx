import React from 'react';

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
      return 'modal hidden';
    } else {
      return 'modal';
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
    return (
      <div className={nonModalClass} onClick={this.handleClick}>
        <a className={buttonClass} onClick={this.handleClick}><i className="fas fa-bars fa-3x"></i></a>
        <div className={modalClass} onClick={this.handleClick}>
          <div className={'menu'}>
            <div className="heading two menu-item">Menu</div>
            <a href="#search-page" className="heading four menu-item">
              Search
            </a>
            <a href="#library" className="heading four menu-item">
              Library
            </a>
            <a href="#reading-list" className="heading four menu-item">
              Reading List
            </a>
          </div>
        </div>
      </div>
    );
  }
}
