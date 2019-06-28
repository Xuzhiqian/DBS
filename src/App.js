import React,{ Component} from 'react';

class KeyBox extends Component {
  render() {
    let type = this.props.keyType || "text";
    return (
      <div>
        {this.props.keyName}:
        <input type={type} />
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
