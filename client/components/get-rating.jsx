import React from 'react';

export default class GetRating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: null
    };
  }

  render() {
    const { rating } = this.state;
    return (
      <div>
        {[...Array(5)].map((star, index) => {
          const stars = index + 1;
          return (
            <label key={index}>
              <input className="star-radio" type='radio' name="rating" value={stars} onClick={() => {
                this.setState({ rating: stars });
              }} />
              <i className={(stars <= rating) ? 'star-icon fas fa-star' : 'star-icon far fa-star'}></i>
            </label>

          );
        })}
      </div>
    );
  }
}
