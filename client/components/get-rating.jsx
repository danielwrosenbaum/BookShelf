import React from 'react';
import AppContext from '../lib/app-context';

export default class GetRating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: this.props.value
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const bookId = event.target.id;
    const { user } = this.context;
    const newRating = {
      rating: event.target.value,
      userId: user.userId
    };
    this.setState({
      rating: event.target.value
    });
    fetch(`/api/bookShelf/${bookId}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(newRating)
    })
      .then(res => {
        res.json();
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    const { rating } = this.state;
    return (
      <div id={this.props.id}>
        {[...Array(5)].map((star, index) => {
          const stars = index + 1;
          return (
            <label key={index}>
              <input id={this.props.id} className="star-radio" type='radio' name="rating" value={stars} onClick={this.handleClick} />
              <i className={(stars <= rating) ? 'star-icon red fas fa-star' : 'star-icon far fa-star'}></i>
            </label>
          );
        })}
      </div>
    );
  }
}

GetRating.contextType = AppContext;
