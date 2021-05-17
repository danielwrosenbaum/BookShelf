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
      readingDays: '',
      pagesADay: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleReadingDays = this.handleReadingDays.bind(this);
    this.handlePages = this.handlePages.bind(this);
    this.handlePageCount = this.handlePageCount.bind(this);
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
    const { selectedPageCount, readingDays } = this.state;
    if (readingDays) {

      const total = (selectedPageCount / readingDays);
      this.setState({ pagesADay: total });
    }

  }

  handleReadingDays(event) {
    const { selectedPageCount } = this.state;
    const readingDays = (event.target.value) ? parseInt(event.target.value, 10) : '';
    const total = selectedPageCount / readingDays;
    this.setState({ readingDays: readingDays, pagesADay: total.toFixed(1) });

  }

  handleChange() {
    const { result } = this.state;
    const bookId = event.target.value;
    const book = result.find(book => book.bookId === bookId);
    this.setState({ selectedPageCount: book.pageCount, selectedBookId: book.bookId, readingDays: '', pagesADay: '' });
  }

  handlePageCount(event) {
    const pageCount = event.target.value;
    const { readingDays } = this.state;
    const total = pageCount / readingDays;
    this.setState({ selectedPageCount: pageCount, pagesADay: total });
  }

  handlePages(event) {
    const { selectedPageCount } = this.state;
    const total = selectedPageCount / event.target.value;
    this.setState({ pagesADay: event.target.value, readingDays: total.toFixed(1) });
  }

  renderBooks(result) {
    const bookResults = (
      <select onChange={this.handleChange} id="books" name="books" className="select-box">
        {(result.length === 0) &&
          <option value="none" className="title two">No Books In Reading List!</option>}
        <option value="none">Books:</option>
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
    const { isLoading, result, selectedPageCount, pagesADay, readingDays } = this.state;
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
                <label className="sub-heading two" htmlFor="books">Choose A Book From Your Reading List</label>
                {this.renderBooks(result)}
                <label className="sub-heading four">Number of Pages:</label>
                <input placeholder="Pages" required type="text" className="text-box" onChange={this.handlePageCount} value={selectedPageCount} name="pages" />
                <label className="sub-heading four">How Many Days Until You Need to Finish?</label>
                <input placeholder="Number of Days" value={readingDays} required type="number" className="text-box" onChange={this.handleReadingDays} />
                <label className="sub-heading four">Read This Many Pages A Day:</label>
                <input placeholder="Number of Pages" value={pagesADay} type="number" className="text-box" onChange={this.handlePages} />
              </form>
            </div>
          </div>
        </CSSTransition>
      </>

    );
  }
}

ReadingPlan.contextType = AppContext;
