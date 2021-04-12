import React from 'react';

export default class Library extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <>
      <div className="details-title">
          <div className="heading two-white">Library</div>
        </div>
      <div className="library-page">
        <div className="library-container"></div>
      </div>
      </>
    );
  }
}
