import React from 'react';
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
    this.handleAuthor = this.handleAuthor.bind(this);
  }

  componentDidMount() {
    const searchTerms = this.state.route.params;
    function getParams() {
      const newArr = [];
      for (const term of searchTerms) {
        if (term[0] === 'search') {
          newArr.push(term[1]);
        } else {
          const splitTerm = term[1].split(':');
          newArr.push(splitTerm[1]);
        }
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
    if (!text) {
      return '';
    }
    const newText = text.split(' ').slice(0, 60);
    if (newText.length === 60) {
      const joined = newText.join(' ');
      return joined + '... (Click More Info to read more)';
    } else {
      const joined = newText.join(' ');
      return joined;
    }
  }

  handleAuthor(author) {
    return author.join(', ');
  }

  render() {
    if (!this.state.results) {
      return null;
    }

    const { results, inputValue } = this.state;
    const books = results.items;
    if (!books) {
      return <div className="results-container heading two">Try again!</div>;
    }
    const bookResults = (
         <div className="results-container">
        {
          books.map((book, index) => {
            const title = book.volumeInfo.title;
            const thumbNail = (book.volumeInfo.imageLinks) ? book.volumeInfo.imageLinks.thumbnail : null;
            const author = book.volumeInfo.authors;
            const authors = this.handleAuthor(author);
            const year = parseInt(book.volumeInfo.publishedDate, 10);
            const text = book.volumeInfo.description;
            const description = this.handleDescription(text);
            return (
              <div key={index} className="card">
                <div className="result-info">
                  <img className="thumbnail" src={thumbNail} alt={title} />
                  <div className="book-col">
                    <div className="book-info">
                      <h3 className="heading three no-top">{title}</h3>
                      <h4 className="heading three no-top no-bottom">by {authors}</h4>
                      <div className="heading three">{year}</div>
                    </div>
                    <button className="info button">More Info</button>
                  </div>
                  <div className="description">{description}</div>
                </div>
                <div className="card-icons">
                  <i className="fas fa-plus fa-1x"></i>
                  <i className="far fa-heart fa-1x"></i>
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
