import React,{ Component} from 'react';

class KeyBox extends Component {
  constructor() {
    super();
    this.state = {
      value: "xzq"
    };
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  render() {
    return (
      <div>
        {this.props.key}:
        <input type="text" value={this.state.value} onChange={this.handleChange.bind(this)}/>
      </div>
    )
  }
}


function App() {
  return (
    <KeyBox key="iioioio"/>
  );
}

export default App;
