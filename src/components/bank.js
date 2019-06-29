import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import socket from '../socket';

let info = [
    {
        key: 'bankName',
        keyName: '支行名称'
    },
    {
        key: 'bankCity',
        keyName: '地点'
    },
    {
        key: 'bankID',
        keyName: 'ID'
    }
];

class Bank extends Component {
    constructor(props) {
        super(props);
        this.state = { add: {}};
    }

    handleChange(e) {
        let n = {};
        if (!e.target.value) return;
        n[e.target.name] = e.target.value;
        let m = {};
        m[e.target.belong] = n;
        let st = Object.assign({}, this.state, m);
        this.setState(st);
        console.log(this.state);
        console.log(m);
        console.log(e.target);
    }

    add() {
        let b = this.state.add;
        let sql = 'CALL addBank("' + b.bankName + '","' + b.bankCity + '",' + b.bankID +');';
        socket.emit("add", sql);
    }

    find() {
        let b = this.state.find;
        let obj = ['bank'];
        if (b.bankName !== 'undefined') {
            obj.push('B_Name');
            obj.push(b.bankName);
        }
        if (b.bankCity !== 'undefined') {
            obj.push('B_City');
            obj.push(b.bankCity);
        }
        if (b.bankID !== 'undefined') {
            obj.push('B_ID');
            obj.push(b.bankID);
        }
        socket.emit("find", JSON.stringify(obj));
        socket.once("find_result", (res) => {
            console.log(JSON.parse(res)); 
        });
    }

    render() {
        let add = info.map((k,index) => {
            return <Form.Item><Input belong="add" name={k.key} addonBefore={k.keyName} key={k.key} onChange={this.handleChange.bind(this)}/></Form.Item>
        });
        let find = info.map((k, index) => {
            return <Form.Item><Input belong="find" name={k.key} addonBefore={k.keyName} key={k.key} onChange={this.handleChange.bind(this)}/></Form.Item>
        });
        return (
            <div>
                <h1>添加支行</h1>
                <Form layout="inline">
                    {add}
                    <Form.Item>
                        <Button type="primary" onClick={this.add.bind(this)}>添加</Button>
                    </Form.Item>
                </Form>
                <h1>精确查询</h1>
                <Form layout="inline">
                    {find}
                    <Form.Item>
                        <Button type="primary" onClick={this.find.bind(this)}>查询</Button>
                    </Form.Item>
                </Form>
            </div>      
        )    
    }  
}
  
export default Bank