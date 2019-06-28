import React, { Component } from 'react';
import Button from 'antd/es/button';
import './App.css';

class KeyBox extends Component {
  render() {
    let type = this.props.keyType || "text";
    return (
      <div>
        {this.props.keyName}：
        <input type={type} />
      </div>
    )
  }
}

class KeyBoxRow extends Component {
  render() {
    let boxes = this.props.boxes.map((box) => {
      return<KeyBox keyName={box.name} keyType={box.type} />
    });
    return (
      <div>
        {boxes}
      </div>
    );
  }
}


class App extends Component {
  render() {
    return (
      <div className="App">
        <Button type="primary">Button</Button>
      </div>
    );
  }
}

export default App;