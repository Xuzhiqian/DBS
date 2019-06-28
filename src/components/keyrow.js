import { Input } from 'antd';
const InputGroup = Input.Group;

class KeyRow extends Component {
  render() {
    let keys = this.props.keys.map((k) => {
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