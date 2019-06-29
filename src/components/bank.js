import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import connection from '../DB';

let info = [
    {
        keyName: '支行名称'
    },
    {
        keyName: '地点'
    },
    {
        keyName: 'ID'
    }
];

class Bank extends Component {
    constructor(props) {
        super(props);
        this.state = { add: {}};
    }

    handleChange(e) {
        this.setState({ add: { value: event.target.value } });
    }

    add() {
        console.log(this.state.add);
    }

    render() {
        let add = info.map((k,index) => {
            return <Form.Item><Input addonBefore={k.keyName} key={index.toString()} onChange={this.handleChange}/></Form.Item>
        });
        return (
            <div>
                <h1>添加支行</h1>
                <Form layout="inline">
                    {add}
                    <Form.Item>
                        <Button type="primary" onClick={this.add}>添加</Button>
                    </Form.Item>
                </Form>
            </div>      
        )    
    }  
}
  
export default Bank