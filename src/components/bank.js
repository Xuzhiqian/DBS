import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Icon, Input, Button, Table } from 'antd';
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
let edit_info = [
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
    },
    {
        ley: 'newBankID',
        keyName: '新ID'
    }
];

class Bank extends Component {
    constructor(props) {
        super(props);
        this.state = { add: {}, find: {}};
    }

    handleChange(e, type) {
        let st = Object.assign({}, this.state);
        if (!e.target.value)
            delete st[type][e.target.name];
        else
            st[type][e.target.name] = e.target.value;
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
        socket.once("add_resp", ((msg) => {
            alert(msg);
            this.find();
        }).bind(this));
    }

    del(e) {
        let sql = 'CALL deleteBank(' + e.B_ID + ');';
        socket.emit("del", sql);
        socket.once("del_resp", ((msg) => {
            alert(msg);
            this.find();
        }).bind(this));
    }

    edit() {
        let b = this.state.edit;
        let sql = 'CALL editBankInfos(' + (!b.bankName ? "null" : this.wrap(b.bankName))
            + ',' + (!b.bankCity ? "null" : this.wrap(b.bankCity))
            + ',' + (!b.newBankID ? "null" : this.wrap(b.newBankID))
            + ',' + (!b.bankID ? "null" : this.wrap(b.bankID)) + ');';
        socket.emit("edit", sql);
        socket.once("edit_resp", ((msg) => {
            alert(msg);
            this.find();
        }).bind(this));
    }

    find() {
        let b = this.state.find;
        let obj = ['bank'];
        if (b.bankName)
            obj.push([ 'B_Name', b.bankName ]);
        if (b.bankCity)
            obj.push([ 'B_City', b.bankCity ]);
        if (b.bankID)
            obj.push([ 'B_ID', b.bankID ]);
        socket.emit("find", JSON.stringify(obj));
        socket.once("find_result", (res) => {
            res = JSON.parse(res.replace(/"null"/g, '""'));
            let col = [
                { title: "B_Name",dataIndex: "B_Name",key:"B_Name" ,width:"30%"},
                { title: "B_City",dataIndex: "B_City",key:"B_City",width:"30%"},
                { title: "B_ID", dataIndex: "B_ID", key: "B_ID" ,width:"30%"},
                {
                    title: "Action", key: "operation", width: "10%", render: (e) =>
                        <Button onClick={this.del.bind(this, e)}>删除</Button>
                }
            ];
            for (let d in res)
                res[d].key = d.toString();
            ReactDOM.render(<Table columns={col} dataSource={res} bordered scroll={{ x:'100%', y:500 }}/>, document.getElementById("bank_table"));
        });
    }

    render() {
        let add = info.map((k) => {
            return <Form.Item><Input name={k.key} addonBefore={k.keyName} key={k.key} onChange={this.handleChange.bind(this, 'add')}/></Form.Item>
        });
        let find = info.map((k) => {
            return <Form.Item><Input name={k.key} addonBefore={k.keyName} key={k.key} onChange={this.handleChange.bind(this, 'find')}/></Form.Item>
        });
        let edit = edit_info.map((k) => {
            return <Form.Item><Input name={k.key} addonBefore={k.keyName} key={k.key} onChange={this.handleChange.bind(this, 'edit')}/></Form.Item>
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
                <br />
                <h1>修改信息</h1>
                <Form layout="inline">
                    {edit}
                    <Form.Item>
                        <Button type="primary" onClick={this.edit.bind(this)}>修改</Button>
                    </Form.Item>
                </Form>
                <h1>精确查询</h1>
                <Form layout="inline">
                    {find}
                    <Form.Item>
                        <Button type="primary" onClick={this.find.bind(this)}>查询</Button>
                    </Form.Item>
                </Form>
                <br />
                <div id="bank_table" />
            </div>      
        )    
    }  
}
  
export default Bank