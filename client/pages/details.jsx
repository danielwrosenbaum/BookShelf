import React from 'react';

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null

    };
    this.handleResult = this.handleResult.bind(this);
  }

  handleResult() {
    const results = this.props.value;
    // const title = this.props.name;
    const detailsId = this.props.id;
    for (let i = 0; i < results.items.length; i++) {
      if (results.items[i].id === detailsId) {
        return results.items[i];
      }
    }
  }

  render() {
    // const element = this.handleResult();
    // console.log(element);

    return (
      <div className="details-container"></div>
    );
  }
}
