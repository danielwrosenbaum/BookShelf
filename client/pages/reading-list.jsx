import React from 'react';

export default class ReadingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null
    };
  }

  componentDidMount() {
    fetch('/api/bookShelf/readingList')
      .then(res => res.json())
      .then(result => {
        this.setState({ result });
      })
      .catch(error => console.error(error));
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
