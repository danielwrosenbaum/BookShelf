import React from 'react';
import { CSSTransition } from 'react-transition-group';
import Header from '../components/header';

export default class ReadingPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true

    };
  }

  render() {
    const { isLoading } = this.state;
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
          </div>
        </CSSTransition>
      </>

    );
  }
}
