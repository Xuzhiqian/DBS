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

    add = e => {
        console.log(e);
    };

    render() {
        let add = info.map((k,index) => {
            return <Form.Item><Input addonBefore={k.keyName} key={index}/></Form.Item>
        });
        return (
            <div>
                <h1>添加支行</h1>
                <Form layout="inline" onSubmit={this.add}>
                    {add}
                    <Form.Item>
                        <Input type="submit" value="添加"/>
                    </Form.Item>
                </Form>
            </div>      
        )    
    }  
}
  
export default Bank