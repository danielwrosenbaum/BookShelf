import React from 'react';
import GetRating from '../components/get-rating';
import Header from '../components/header';
import Loader from '../components/loader';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';
import Error from '../components/error';
import { CSSTransition } from 'react-transition-group';

export default class Library extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      networkError: false,
      result: null,
      targetId: null,
      isLoading: true,
      isDeleteClicked: false,
      deleteTitle: null,
      rating: null
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickBack = this.handleClickBack.bind(this);
  }

  componentDidMount() {
    const { user } = this.context;
    if (!user) return null;
    const userId = user.userId;
    fetch(`/api/bookShelf/library/${userId}`)
      .then(res => res.json())
      .then(result => {
        this.setState({
          result,
          isLoading: false
        });
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

  handleClick(event) {
    const title = event.target.getAttribute('name');
    this.setState({
      isDeleteClicked: true,
      targetId: event.target.id,
      deleteTitle: title
    });
  }

  renderDeleteModal() {
    const { isDeleteClicked, targetId, deleteTitle } = this.state;
    const title = deleteTitle;
    if (isDeleteClicked) {
      return (
        <div className="delete-overlay">
          <div className='delete-modal'>
            <div className='sub-heading buy-question'> Delete <span className="italic bold">{title}</span> from your Library?</div>
            <div className='delete-buttons'>
              <button className="delete-no" onClick={this.handleClickBack}>No</button>
              <button id={targetId} className="delete-yes" onClick={this.handleDelete}>Yes</button>
            </div>
          </div>
        </div>
      );
    }
  }

  handleClickBack() {
    this.setState({
      taregetId: null,
      isDeleteClicked: false
    });
  }

  handleDelete(event) {
    const { targetId } = this.state;
    const { user } = this.context;
    const userId = user.userId;
    const bookId = targetId;
    this.setState({ isDeleteClicked: false });
    const req = {
      method: 'DELETE'
    };
    fetch(`/api/bookShelf/${bookId}/${userId}`, req)
      .then(result => {
        this.setState({ isLoading: true });
        return result;
      })
      .catch(error => console.error(error));
    fetch(`/api/bookShelf/library/${userId}`)
      .then(res => res.json())
      .then(result => {
        this.setState({ result, isLoading: false });
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

  render() {
    const { user } = this.context;
    if (!user) return <Redirect to="sign-in" />;
    const { result, isLoading, networkError } = this.state;
    if (isLoading) {
      return <Loader />;
    }
    if (networkError) {
      return <Error />;
    }
    if (!result) {
      return null;
    }

    const books = result;
    const bookResults = (
      <div className="library-container">
        {(result.length === 0) &&
          <div className="title two">Nothing Here!</div>}
        {
          books.map(book => {
            const title = book.title;
            const thumbNail = book.coverUrl;
            const bookId = book.bookId;
            const author = book.author;
            const rating = book.rating;
            return (
              <div key={bookId} id={bookId} className="library-card">
                <div className="lib-info">
                  <img className="thumbnail" src={thumbNail} alt={title} />
                  <div className="lib-col">
                    <div className="sub-col">
                      <div className="sub-heading six">{title}</div>
                      <div className="sub-heading three">by {author}</div>
                    </div>
                    <div className="sub-col">
                      <a href={`#details?bookId=${bookId}`}>
                        <button className="lib-details button">Details</button>
                      </a>
                      <div id="rate" className="rating-container">
                        <div>Rate Book: </div>
                        <div className='star-container'>
                          <GetRating id={bookId} value={rating} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="delete-container">
                  <i id={bookId} name={title} className="delete-button fas fa-times" onClick={this.handleClick}></i>
                </div>
              </div>
            );
          })
        }
      </div>
    );
    return (
      <>
        <Header />
        <div className="details-title">
          <div className="heading two-white">Library</div>
        </div>
        <CSSTransition
          in={!isLoading}
          appear={true}
          timeout={500}
          classNames="fade">
          <div className="library-page">
            {this.renderDeleteModal()}
            {bookResults}
          </div>
        </CSSTransition>
      </>
    );
  }
}

Library.contextType = AppContext;
