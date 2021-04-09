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
    const isbn = book.volumeInfo.industryIdentifiers[0].identifier;
    const subTitle = book.volumeInfo.subtitle;
    const category = book.volumeInfo.categories;
    const pages = book.volumeInfo.pageCount;

    // const description = this.handleDescription(text);

    return (
      <div className="details-page">
        <div className="details-container">
          <div className='details-pic-container'>
            <img src={thumbNail} alt={title} />
          </div>
          <div className="book-details">
            <div className="heading one-blue">{title}</div>
            <div className="heading sub">{subTitle}</div>
            <div className="heading four">by {authors}</div>
            <div className="small-details">
              <div className="heading three">{category}</div>
              <div className="heading three">Published in {year}</div>
              <div className="heading three">{pages} pages</div>
              <div className="heading three">ISBN: {isbn}</div>
              <p className="detail-description">{text}</p>
            </div>
          </div>
          <div className="button-container">
            <button className="details-button">Add to List</button>
            <button className="details-button">Read it!</button>
          </div>
        </div>
      </div>

    );
  }
}
