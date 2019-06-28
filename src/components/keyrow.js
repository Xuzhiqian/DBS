import React, { Component } from 'react'
import { Input } from 'antd';
const InputGroup = Input.Group;

class KeyRow extends Component {
  render() {
    let _keys = this.props.keys || [{ keyName: "test" }];
    let keys = _keys.map((k) => {
      return <Input addonBefore={k.keyName} />
    });
      
    return (
        <InputGroup compact>
          {keys}
        </InputGroup>
    )
  }
}
  
export default KeyRow