import React,{ Component} from 'react';

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


function App() {
  return (
    <form>
      <KeyBox keyName="iioioio" />
      <KeyBox keyName="日期" keyType="date"/>
    </form>
    
  );
}

export default App;