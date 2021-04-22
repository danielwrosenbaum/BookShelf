import React from 'react';
import Header from '../components/header';
import Loader from '../components/loader';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';
import Error from '../components/error';

export default class ReadingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      networkError: false,
      isBuyClicked: false,
      isLoading: true,
      result: null,
      targetId: null,
      isDeleteClicked: false,
      targetTitle: null
    };
    this.handleBuyClick = this.handleBuyClick.bind(this);
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  componentDidMount() {
    const { user } = this.context;
    if (!user) return null;
    const userId = user.userId;
    fetch(`/api/bookShelf/readingList/${userId}`)
      .then(res => res.json())
      .then(result => {
        this.setState({
          result,
          isLoading: false
        });
      })
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

  handleBuyClick(event) {
    this.setState({
      isBuyClicked: true,
      targetTitle: event.target.value

    });
  }

  handleClickBack() {
    const { isDeleteClicked } = this.state;
    if (isDeleteClicked) {
      this.setState({ isDeleteClicked: false });
    }
    this.setState({
      isBuyClicked: false,
      targetTitle: null
    });
  }

  handleDeleteClick(event) {
    const title = event.target.getAttribute('name');
    this.setState({
      isDeleteClicked: true,
      targetId: event.target.id,
      deleteTitle: title
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
    fetch(`/api/bookShelf/readingList/${userId}`)
      .then(res => res.json())
      .then(result => {
        this.setState({
          isLoading: false,
          result

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

  renderPopUp() {
    const { isBuyClicked, targetTitle } = this.state;
    const title = targetTitle;
    const indieBound = 'https://www.indiebound.org/search/book?keys=';
    if (isBuyClicked) {
      return (
        <div className="buy-overlay">
          <div className='buy-modal'>
            <div className='sub-heading buy-question'> Search indiebound.com for a copy of this book?</div>
            <div className='buy-buttons'>
              <button className="buy-no" onClick={this.handleClickBack}>No</button>
              <a href={`${indieBound}${title}`} target="_blank" rel='noreferrer'>
                <button className="buy-yes" onClick={this.handleClickBack}>Yes</button>
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  renderDeleteModal() {
    const { isDeleteClicked, targetId, deleteTitle } = this.state;
    const title = deleteTitle;
    if (isDeleteClicked) {
      return (
        <div className="delete-overlay">
          <div className='delete-modal'>
            <div className='sub-heading buy-question'>Delete <span className='italic bold'>{title}</span> from your Reading List?</div>
            <div className='delete-buttons'>
              <button className="delete-no" onClick={this.handleClickBack}>No</button>
              <button id={targetId} className="delete-yes" onClick={this.handleDelete}>Yes</button>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    const { result, isLoading, networkError } = this.state;
    const { user } = this.context;
    if (!user) return <Redirect to="sign-in" />;
    if (isLoading) {
      return <Loader />;
    }
    if (networkError) {
      return <Error />;
    }
    if (!result) return null;
    const books = result;
    const bookResults = (
      <div className="rl-container">
        {(result.length === 0) &&
          <div className="title two">Nothing Here!</div>}
        {
          books.map(book => {
            const title = book.title;
            const thumbNail = book.coverUrl;
            const bookId = book.bookId;
            const author = book.author;
            return (
              <div key={bookId} className="rl-card">
                <div className="rl-card-info">
                  <div className='pic-container'>
                    <img className="thumbnail" src={thumbNail} alt={title} />
                  </div>
                  <div className="rl-col">
                    <div className="rl-book-info">
                      <div className="sub-heading six">{title}</div>
                      <div className="sub-heading three">by {author}</div>
                    </div>
                    <div className="rl-button-container">
                      <button value={title} className="rl-buy" onClick={this.handleBuyClick}>Buy It!</button>
                      <a href={`#details?bookId=${bookId}`}>
                        <button className="rl-info">Details</button>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="delete-container">
                  <i id={bookId} name={title} className="delete-button fas fa-times" onClick={this.handleDeleteClick}></i>
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
          <div className="heading two-white">Reading List</div>
        </div>
        <div className="rl-page">
          {this.renderDeleteModal()}
          {this.renderPopUp()}
          {bookResults}
        </div>
      </>
    );
  }
}

ReadingList.contextType = AppContext;
