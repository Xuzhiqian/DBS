import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd';


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
    render() {
        let add = info.map((k) => {
            return <Form.Item><Input addonBefore={k.keyName} /></Form.Item>
        });
        return (
            <div>
                <h1>添加支行</h1>
                <Form layout="inline" onSubmit={this.add}>
                    {add}
                    <Form.Item>
                        <Button type="primary">添加</Button>
                    </Form.Item>
                </Form>
            </div>      
        )    
    }  
}
  
export default Bank