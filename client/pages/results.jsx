import React from 'react';
import AppContext from '../lib/app-context';

export default class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.handleDescription = this.handleDescription.bind(this);
  }

  handleDescription(text) {
    const newText = text.split(' ');
    const newArr = [];
    for (let i = 0; i < 60; i++) {
      newArr.push(newText[i]);
    }
    if (newText.length > 60) {
      const joined = newArr.join(' ');
      return joined + '... (Click More Info to read more)';
    } else {
      const joined = newArr.join(' ');
      return joined;
    }

  }

  render() {
    const { data, inputValue } = this.props.value;
    const books = data.items;
    const bookResults = (
      <div className="results-container">
        {
          books.map((books, index) => {
            const title = books.volumeInfo.title;
            const thumbNail = books.volumeInfo.imageLinks.thumbnail;
            const author = books.volumeInfo.authors;
            const year = parseInt(books.volumeInfo.publishedDate, 10);
            const text = books.volumeInfo.description;
            const description = this.handleDescription(text);
            return (

              <div key={index} className="card">
                <div className="result-info">
                  <img className="thumbnail" src={thumbNail} alt={title} />
                  <div className="book-col">
                    <div className="book-info">
                      <h2 className="heading three no-top">{title}</h2>
                      <h3 className="heading three no-top no-bottom">by {author}</h3>
                      <div className="heading three">{year}</div>
                    </div>
                    <button className="info button">More Info</button>
                  </div>
                  <div className="description">{description}</div>
                </div>
                <div className="card-icons">
                  <i className="fas fa-plus"></i>
                  <i className="far fa-heart"></i>
                </div>

              </div>
            );
          })
        }
      </div>
    );
    return (
      <>
<div className="heading two result-title">Results for {inputValue}</div>
      <div>
        { bookResults}
      </div>
</>
    );
  }
}
Results.contextType = AppContext;
