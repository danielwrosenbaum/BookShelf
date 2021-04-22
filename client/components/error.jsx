import React from 'react';
import Home from '../pages/home';

export default class Error extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      isClicked: true
    });
  }

  render() {
    const { isClicked } = this.state;
    if (isClicked) {
      return <Home />;
    }
    return <div className="error-box" onClick={this.handleClick}>
      <div className="network-error">
Uh oh! There seems to be an issue with your connection. Please check that your network is online and try again.
      </div>
      </div>;
  }
}
