import React from 'react';

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null

    };
    this.handleResult = this.handleResult.bind(this);
    this.handleAuthor = this.handleAuthor.bind(this);
  }

  handleAuthor(author) {
    return author.join(', ');
  }

  handleResult() {
    const results = this.props.value;
    // const title = this.props.name;
    const detailsId = this.props.id;
    for (let i = 0; i < results.items.length; i++) {
      if (results.items[i].id === detailsId) {
        return results.items[i];
      }
    }
  }

  render() {
    const book = this.handleResult();
    // console.log(book);
    const title = book.volumeInfo.title;
    const thumbNail = (book.volumeInfo.imageLinks) ? book.volumeInfo.imageLinks.thumbnail : null;
    const author = book.volumeInfo.authors;
    const authors = this.handleAuthor(author);
    const year = parseInt(book.volumeInfo.publishedDate, 10);
    const text = book.volumeInfo.description;
    const isbn = book.volumeInfo.industryIdentifiers[1].identifier;
    // const description = this.handleDescription(text);

    return (
      <div className="details-container">
        <div className='details-pic-container'>
          <img src={thumbNail} alt={title} />
        </div>
        <div className="book-details">
          <h1 className="heading ">{title}</h1>
          <div className="heading four">by {authors}</div>
          <div className="heading three">Published in {year}</div>
          <div className="heading three">ISBN: {isbn}</div>
        </div>
        <p>{text}</p>

      </div>
    );
  }
}
