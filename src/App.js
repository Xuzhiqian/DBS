import React,{ Component} from 'react';

class KeyBox extends Component {
  constructor() {
    super();
    this.state = {
      value: ""
    };
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  render() {
    console.log(this.props)
    return (
      <div>
        {this.props.keyname}:
        <input type="text" value={this.state.value} onChange={this.handleChange.bind(this)} />
        <input type="date" />
        <button type="submit">Submit</button>
      </div>
    )
  }
}


function App() {
  return (
    <KeyBox keyname="iioioio"/>
  );
}

export default App;
