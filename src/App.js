import React,{ Component} from 'react';

class KeyBox extends Component {
  render() {
    this.props.keyType = this.props.keyType || "text";
    return (
      <div>
        {this.props.keyName}:
        <input type={this.props.keyType} />
      </div>
    )
  }
}


function App() {
  return (
    <form>
      <KeyBox keyName="iioioio" />
      <KeyBox keyName="日期" keyType="date"/>
    </form>
    
  );
}

export default App;
