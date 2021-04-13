import React from 'react';

export default class GetRating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: this.props.value
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    // console.log(event.target);
    this.setState({ rating: event.target.value });
  }

  render() {
    const { rating } = this.state;
    return (
      <div id={this.props.id}>
        {[...Array(5)].map((star, index) => {
          const stars = index + 1;
          return (
            <label key={index}>
              <input className="star-radio" type='radio' name="rating" value={stars} onClick={this.handleClick} />
              <i className={(stars <= rating) ? 'star-icon fas fa-star' : 'star-icon far fa-star'}></i>
            </label>

          );
        })}
      </div>
    );
  }
}
