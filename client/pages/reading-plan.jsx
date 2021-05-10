import React from 'react';
import { CSSTransition } from 'react-transition-group';
import Header from '../components/header';
import AppContext from '../lib/app-context';

export default class ReadingPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      networkError: false,
      result: null
    };
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

  renderReadingListBooks() {
    const { result } = this.state;
    if (!result) return null;
    const bookResults = (
      <>
      <label htmlFor="books">Choose A Book</label>
      <select id="books" name="books" className="reading-plan-container">
        {(result.length === 0) &&
          <option value="none" className="title two">No Books In Reading List!</option>}
          {
            result.map(book => {
              const title = book.title;
              const bookId = book.bookId;
              return (
                <option key={bookId} value={bookId}>{title}</option>
              );
            })
          }
      </select>
      </>
    );
    return bookResults;
  }

  render() {
    const { isLoading } = this.state;
    const { result } = this.state;
    if (!result) return null;
    const bookResults = (
        <select id="books" name="books" className="reading-plan-container text-box">
          {(result.length === 0) &&
            <option value="none" className="title two">No Books In Reading List!</option>}
          {
            result.map(book => {
              const title = book.title;
              const bookId = book.bookId;
              return (
                <option key={bookId} value={bookId}>{title}</option>
              );
            })
          }
        </select>
    );
    return (
       <>
        <Header />
        <div className="details-title">
          <div className="heading two-white">Reading Plan</div>
        </div>
        <CSSTransition
          in={!isLoading}
          appear={true}
          timeout={500}
          classNames="fade">
          <div className="reading-plan-page">
            <div className="reading-plan-container">
            <form className="reading-plan-form">
              <label>Choose A Book</label>
              {bookResults}
              <input className="button submit" type="submit" />
            </form>
            </div>
          </div>
        </CSSTransition>
      </>

    );
  }
}

ReadingPlan.contextType = AppContext;
