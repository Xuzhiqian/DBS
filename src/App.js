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
        {this.props.keyy}:
        <input type="text" value={this.state.value} onChange={this.handleChange.bind(this)}/>
      </div>
    )
  }
}


function App() {
  return (
    <KeyBox keyy="iioioio"/>
  );
}

export default App;
