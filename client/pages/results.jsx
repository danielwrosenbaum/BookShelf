import React from 'react';
import parseRoute from '../lib/parse-route';
import Header from '../components/header';
import Loader from '../components/loader';
import InfiniteScroll from 'react-infinite-scroller';
import AppContext from '../lib/app-context';
import SignIn from '../components/sign-in';
import Error from '../components/error';
import { CSSTransition } from 'react-transition-group';
const apiKey = process.env.API_KEY;
const bookURL = 'https://www.googleapis.com/books/v1/volumes?q=';

export default class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSaved: false,
      networkError: false,
      isError: false,
      isAdded: false,
      alreadyRead: null,
      alreadyAdded: null,
      isLoading: true,
      redirect: null,
      route: parseRoute(window.location.hash),
      inputValue: null,
      items: 10,
      hasMoreItems: true,
      results: null,
      info: null
    };
    this.handleSave = this.handleSave.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleClickBack = this.handleClickBack.bind(this);
    this.renderIcons = this.renderIcons.bind(this);
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
    fetch(bookURL + query + '&maxResults=40&' + 'key=' + apiKey)
      .then(res => res.json())
      .then(
        result => {
          this.renderData();
          this.setState({
            isLoading: false,
            inputValue: query,
            results: result
          });
        }
      )
      .catch(error => {
        console.error(error);
        if (error) {
          this.setState({
            isLoading: false,
            networkError: true
          });
        }
      });
  }

  componentWillUnmount() {
    clearTimeout(this.errorSaveTimer);
    clearTimeout(this.errorAddTimer);
    clearTimeout(this.saveTimer);
    clearTimeout(this.addTimer);
  }

  renderDescription(text) {
    if (!text) {
      return 'No Description Available';
    }
    const newText = text.split(' ').slice(0, 60);
    if (newText.length === 60) {
      const joined = newText.join(' ');
      return joined + '... (Click "Details" to read more)';
    } else {
      const joined = newText.join(' ');
      return joined;
    }
  }

  getAuthor(author) {
    return author.join(', ');
  }

  getSavedItem(target) {
    const name = target.getAttribute('name');
    const { results } = this.state;
    const { user } = this.context;
    const books = results.items;
    for (let i = 0; i < books.length; i++) {
      if (books[i].id === target.id) {
        let info;
        if (name === 'save') {
          info = {
            title: books[i].volumeInfo.title,
            bookId: books[i].id,
            coverUrl: (books[i].volumeInfo.imageLinks) ? books[i].volumeInfo.imageLinks.thumbnail : null,
            author: this.getAuthor(books[i].volumeInfo.authors),
            userId: user.userId,
            isRead: true,
            rating: 0
          };
        }
        if (name === 'add') {
          info = {
            title: books[i].volumeInfo.title,
            bookId: books[i].id,
            coverUrl: (books[i].volumeInfo.imageLinks) ? books[i].volumeInfo.imageLinks.thumbnail : null,
            author: this.getAuthor(books[i].volumeInfo.authors),
            userId: user.userId,
            isRead: false,
            rating: null
          };
        }
        return info;
      }
    }
  }

  handleSave(event) {
    const target = event.target;
    const { user } = this.context;
    if (!user) {
      this.setState({ redirect: 'save' });
      return null;
    }
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.getSavedItem(target))
    };
    fetch('/api/bookShelf/', req)
      .then(res => res.json())
      .then(result => {
        if (result.error) {
          this.setState({
            isError: true
          });
          this.errorSaveTimer = setTimeout(() => {
            this.setState({
              isError: false
            });
          }, 3000);
        } else {
          this.setState({
            isSaved: true
          });
          this.saveTimer = setTimeout(() => {
            this.setState({
              isSaved: false
            });
          }, 3000);
        }
      })
      .catch(error => {
        if (error) {
          this.setState({
            isLoading: false,
            networkError: true
          });
        }
        console.error(error);
      });
  }

  handleAdd(event) {
    const { user } = this.context;
    if (!user) {
      this.setState({ redirect: 'add' });
      return null;
    }
    const target = event.target;
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.getSavedItem(target))
    };
    fetch('/api/bookShelf/', req)
      .then(res => res.json())
      .then(result => {
        if (result.error) {
          this.setState({
            isError: true
          });
          this.errorAddTimer = setTimeout(() => {
            this.setState({
              isError: false
            });
          }, 3000);
        } else {
          this.setState({
            isAdded: true
          });
          this.addTimer = setTimeout(() => {
            this.setState({
              isAdded: false
            });
          }, 3000);
        }
      })
      .catch(error => {
        if (error) {
          this.setState({
            isLoading: false,
            networkError: true
          });
        }
        console.error(error);
      });
  }

  handleClickBack() {
    const { redirect } = this.state;
    if (redirect) {
      this.setState({ redirect: null });
    } else {
      return null;
    }
  }

  renderHeading() {
    const { isSaved, isError, inputValue, isAdded } = this.state;
    if (isSaved) {
      return (
        <div className="save-header heading five">
          <div className="save-title">Saved to Your Library!</div>
        </div>
      );
    } else if (isError) {
      return (
        <div className="error-header heading five">
          <div className="error-title">Already Added!</div>
        </div>
      );
    } else if (isAdded) {
      return (
        <div className="add-header heading five">
          <div className="add-title">Added to Your Reading List!</div>
        </div>
      );
    } else {
      return (
        <div className="result-title">
          <div className="heading two-white">Results</div>
          <div className="heading">for {inputValue}</div>
        </div>
      );
    }
  }

  renderModal() {
    const { isSaved, isAdded } = this.state;
    if (isSaved) {
      return (
        <div className='pop-up saved'>Saved!</div>
      );
    } else if (isAdded) {
      return (
        <div className='pop-up added'>Added!</div>
      );
    } else {
      return null;
    }
  }

  renderData() {
    const { user } = this.context;
    if (user) {
      const { userId } = user;
      fetch(`/api/bookShelf/${userId}`)
        .then(res => res.json())
        .then(result => {
          const addedArray = [];
          const savedArray = [];
          for (let i = 0; i < result.length; i++) {
            if (result[i].isRead) {
              savedArray.push(result[i]);
            } else {
              addedArray.push(result[i]);
            }
          }
          this.setState({ alreadyAdded: addedArray, alreadyRead: savedArray });
        });
    }

  }

  renderIcons(list, book) {
    const { alreadyAdded, alreadyRead } = this.state;
    if (alreadyAdded) {
      if (list === 'add') {
        const icon = (alreadyAdded.map(addedBook => {
          if (addedBook.bookId === book) {
            return 'plus-icon fas fa-plus fa-1x red-icon';
          } else {
            return 'plus-icon fas fa-plus fa-1x';
          }
        }));
        return icon;
      }
    }
    if (alreadyRead) {
      if (list === 'save') {
        const icon = (
          alreadyRead.map(readBook => {
            if (readBook.bookId === book) {
              return 'red-icon heart-icon fas fa-heart fa-1x';
            } else {
              return 'heart-icon far fa-heart fa-1x';
            }
          })
        );
        return icon;
      }
    }
  }

  getResults() {
    const { results } = this.state;
    const books = results.items;
    const bookArr = [];
    const bookResults = (
      <div className="results-container">
        {
          books.map((book, index) => {
            const title = book.volumeInfo.title;
            const thumbNail = (book.volumeInfo.imageLinks) ? book.volumeInfo.imageLinks.thumbnail : null;
            const author = (book.volumeInfo.authors) ? book.volumeInfo.authors : null;
            const authors = (author) ? this.getAuthor(author) : 'Unknown';
            const year = (book.volumeInfo.publishedDate) ? parseInt(book.volumeInfo.publishedDate, 10) : null;
            const text = book.volumeInfo.description;
            const description = this.renderDescription(text);
            const pageCount = book.volumeInfo.pageCount;
            const bookId = book.id;
            const oneBook = (
              <div key={bookId} name={title} className="card">
                <div className="row">
                  <div className='col-book-third'>
                    <img className="thumbnail " src={thumbNail} alt={title} />
                  </div>
                  <div className="col-book-two-thirds">
                    <div className="add-save-results col-full">
                      <div className="add-message">Add to Reading List</div>
                      <i name="add" className={this.renderIcons('add', bookId)} id={bookId} onClick={this.handleAdd}></i>
                    </div>
                    <div className="row">
                        <div className="book-col">
                          <div className="book-sub-col">
                            <div className="sub-heading six">{title}</div>
                            <div className="sub-heading three">by {authors}</div>
                            <div className="sub-heading three">{pageCount} pages </div>
                            <div className="sub-heading three">{year}</div>
                          </div>
                          <div>
                            <a href={`#details?bookId=${bookId}`}>
                              <button id={bookId} name={title} className="search-details button">Details</button>
                            </a>
                          </div>
                        </div>
                        <div className="description">{description}</div>
                    </div>
                    <div className="row" >
                      <div className="add-save-results col-full">
                        <div className="add-message">Already Read</div>
                        <i name="save" className={this.renderIcons('save', bookId)} id={bookId} onClick={this.handleSave} ></i>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            );
            if (index < this.state.items) {
              bookArr.push(oneBook);
              return oneBook;
            }
            return null;
          })
        }
      </div>
    );
    return bookResults;
  }

  loadMore() {
    if (this.state.items === 40) {
      this.setState({ hasMoreItems: false });
    } else {
      setTimeout(() => {
        this.setState({ items: this.state.items + 10 });
      }, 1000);
    }
  }

  render() {
    const { results, isLoading, redirect, networkError } = this.state;
    if (networkError) {
      return <Error />;
    }
    if (isLoading) {
      return <Loader />;
    }
    if (!this.state.results) {
      return null;
    }
    const books = results.items;
    if (!books) {
      return <div className="results-container heading two">Try again!</div>;
    }
    return (
      <>
        <Header />
        {this.renderHeading()}
        <CSSTransition
          in={!isLoading}
          appear={true}
          timeout={500}
          classNames="fade">
          <div className="results-page" onClick={this.handleClickBack}>
            {(redirect) &&
              <SignIn id={redirect} />}
            <div style={{ height: '100vh', overflow: 'auto' }}>
              <InfiniteScroll
                loadMore={this.loadMore.bind(this)}
                hasMore={this.state.hasMoreItems}
                useWindow={false}>
                {this.getResults()}
                {(this.state.hasMoreItems) &&
                  <div className="loader-container">
                    <div className="loader"></div>
                  </div>}
              </InfiniteScroll>
            </div>
          </div>
        </CSSTransition>
        {this.renderModal()}
      </>
    );
  }
}

Results.contextType = AppContext;
