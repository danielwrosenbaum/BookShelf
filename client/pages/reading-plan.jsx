import React from 'react';
import Loader from '../components/loader';
import Header from '../components/header';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';
import { CSSTransition } from 'react-transition-group';

export default class ReadingPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      networkError: false,
      result: null,
      selectedPageCount: '',
      selectedBookId: null,
      readingDays: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleReadingDays = this.handleReadingDays.bind(this);
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

  handleSubmit() {
    event.preventDefault();

  }

  handleReadingDays(event) {
    this.setState({ readingDays: event.target.value });

  }

  handleChange() {
    const { result } = this.state;
    const bookId = event.target.value;
    const book = result.find(book => book.bookId === bookId);

    this.setState({ selectedPageCount: book.pageCount, selectedBookId: book.bookId });
  }

  renderBooks(result) {

    const bookResults = (
        <select onChange={this.handleChange} id="books" name="books" className="reading-plan-container text-box">
          {(result.length === 0) &&
            <option value="none" className="title two">No Books In Reading List!</option>}
            <option value="none">Choose A Book From Reading List</option>
          {
            result.map(book => {
              const title = book.title;
              const bookId = book.bookId;
              const pageCount = book.pageCount;
              return (
                <option key={bookId} name={title} props={pageCount} value={bookId}>{title}</option>
              );
            })
          }
        </select>
    );
    return bookResults;

  }

  render() {
    const { user } = this.context;
    if (!user) return <Redirect to="sign-in" />;
    const { isLoading, result, selectedPageCount } = this.state;
    if (isLoading) {
      return <Loader />;
    }
    if (!result) return null;
    return (
      <>
        <Header />
        <div className="details-title">
          <div className="heading two-white">Reading Plan</div>
        </div>
        <CSSTransition
          in={true}
          appear={true}
          timeout={500}
          classNames="fade">
          <div className="reading-plan-page">
            <div className="reading-plan-container">
              <form className="reading-plan-form">
                <label htmlFor="books">Choose A Book</label>
                {this.renderBooks(result)}
                <label>Number of Pages</label>
                <input placeholder="Pages" required type="text" className="text-box" onChange={this.handleChange} value={selectedPageCount} name="pages" />
                <label>How Many Days A Week Do You Read?</label>
                <input placeholder="Number of Days" value={this.state.readingDays} required type="number" className="text-box" onChange={this.handleReadingDays} />
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
