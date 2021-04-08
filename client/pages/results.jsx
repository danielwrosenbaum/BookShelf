import React from 'react';
import AppContext from '../lib/app-context';
import parseRoute from '../lib/parse-route';
const apiKey = process.env.API_KEY;
const bookURL = 'https://www.googleapis.com/books/v1/volumes?q=';

export default class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      results: null
    };
    this.handleDescription = this.handleDescription.bind(this);
  }

  componentDidMount() {
    const searchTerms = this.state.route.params;
    function getParams() {
      const newArr = [];
      for (const term of searchTerms) {
        newArr.push(term[1]);
      }
      return newArr;
    }
    const query = getParams();
    fetch(bookURL + query + '&' + 'key=' + apiKey)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            inputValue: query,
            results: result
          });
        }
      )
      .catch(error => console.error(error));
  }

  handleDescription(text) {
    if (text) {
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

  }

  render() {
    if (!this.state.results) {
      return null;
    }
    const { results, inputValue } = this.state;
    const books = results.items;
    const bookResults = (
      <div className="results-container">
        {
          books.map((book, index) => {
            const title = book.volumeInfo.title;
            const thumbNail = (book.volumeInfo.imageLinks) ? book.volumeInfo.imageLinks.thumbnail : null;
            const author = book.volumeInfo.authors;
            const year = parseInt(book.volumeInfo.publishedDate, 10);
            const text = book.volumeInfo.description;
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
        <div href="#results" className="result-title">
          <div className="heading two-white">Results</div>
          <div className="heading">for {inputValue}</div>
        </div>
        <div href="#results">
          {bookResults}
        </div>
      </>
    );
  }
}
Results.contextType = AppContext;
