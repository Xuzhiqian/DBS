import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import socket from '../socket';
import EditableTable from './table';

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
        this.state = { add: {}, find: {}};
    }

    handleChangeAdd(e) {
        let st = Object.assign({}, this.state);
        if (!e.target.value)
            delete st['add'][e.target.name];
        else
            st['add'][e.target.name] = e.target.value;
        this.setState(st);
    }

    handleChangeFind(e) {
        let st = Object.assign({}, this.state);
        if (!e.target.value)
            delete st['find'][e.target.name];
        else
            st['find'][e.target.name] = e.target.value;
        this.setState(st);
    }

    wrap(str) {
        return '"' + str + '"';
    }

    add() {
        let b = this.state.add;
        let sql = 'CALL addBank(' + (!b.bankName ? "null" : this.wrap(b.bankName))
            + ',' + (!b.bankCity ? "null" : this.wrap(b.bankCity))
            + ',' + (!b.bankID ? "null" : this.wrap(b.bankID)) + ');';
        socket.emit("add", sql);
    }

    find() {
        let b = this.state.find;
        let obj = ['bank'];
        if (b.bankName) {
            obj.push('B_Name');
            obj.push(b.bankName);
        }
        if (b.bankCity) {
            obj.push('B_City');
            obj.push(b.bankCity);
        }
        if (b.bankID) {
            obj.push('B_ID');
            obj.push(b.bankID);
        }
        socket.emit("find", JSON.stringify(obj));
        socket.once("find_result", (res) => {
            res = res.replace(/null/g, "");
            let col = [
                { title: "B_Name" },
                { title: "B_City" },
                { title: "B_ID" }
            ];
            ReactDOM.render(<EditableTable data={JSON.parse(res)} col={col}/>, document.getElementById("bank_table"));
        });
    }

    render() {
        let add = info.map((k) => {
            return <Form.Item><Input name={k.key} addonBefore={k.keyName} key={k.key} onChange={this.handleChangeAdd.bind(this)}/></Form.Item>
        });
        let find = info.map((k) => {
            return <Form.Item><Input name={k.key} addonBefore={k.keyName} key={k.key} onChange={this.handleChangeFind.bind(this)}/></Form.Item>
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
                <div id="bank_table" />
                <EditableTable data='[{"B_Name":"qqqq","B_City":"qwww","B_ID":7}]' col={[{title:"B_Name"},{title:"B_city"},{title:"B_ID"}]}/>
            </div>      
        )    
    }  
}
  
export default Bank