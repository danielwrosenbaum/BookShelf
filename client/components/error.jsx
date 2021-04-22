import React from 'react';

export default class Error extends React.Component {
  render() {
    return <div className="error-box">
      <div className="network-error">
Uh oh! There seems to be an issue with your connection. Please check that your network is online and try again.
      </div>
      </div>;
  }
}
