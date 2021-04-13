import React from 'react';

export default class ReadingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <>
        <div className="details-title">
          <div className="heading two-white">Reading List</div>
        </div>
        <div className="reading-list-page">
          {/* {bookResults} */}
        </div>
      </>
    );
  }
}
