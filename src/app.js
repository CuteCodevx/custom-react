import FirstChildCmp from './components/cmp1';
import SecondChildCmp from './components/cmp2';
import React from './React';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [1, 1, 1]
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const list = this.state.list;
    list.push(1);

    this.setState({
      list: list
    });
  }

  render() {
    return (
      <div id='container'>
        <FirstChildCmp />
        <SecondChildCmp />
        <button onClick={this.handleClick}>click</button>
        {this.state.list.map(item => {
          return <div>{item}</div>;
        })}
      </div>
    );
  }
}

export default MyComponent;
