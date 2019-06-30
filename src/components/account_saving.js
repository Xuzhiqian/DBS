import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button, Table } from 'antd';
import socket from '../socket';

let info = [
    {
        key: 'acountID',
        keyName: '账户ID',
        dcol:'ID'
    },
    {
        key: 'staffID',
        keyName: '负责人ID',
        dcol:'E_ID'
    },
    {
        key: 'bankID',
        keyName: '支行ID',
        dcol:'B_ID'
    },
    {
        key: 'customerID',
        keyName: '客户ID',
        dcol:'C_ID'
    },
    {
        key: 'currencyTypeIn',
        keyName: '货币类型',
        dcol:'CurrencyType'
    }
];
let edit_info = [
    {
        key: 'accountID',
        keyName: '账户ID'
    },
    {
        key: 'rateIn',
        keyName: '新利率'
    },
    {
        key: 'currencyTypeIn',
        keyName: '新货币类型'
    }
];

class Saving extends Component {
    constructor(props) {
        super(props);
        this.state = { add: {}, find: {}, edit: {} };
    }

    handleChange(type, e) {
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
        let sql = 'CALL createSavingAccount(';
        for (let i = 0; i < info.length; i++) {
            sql = sql + (!b[info[i].key] ? "null" : this.wrap(b[info[i].key]));
            if (i < info.length - 1)
                sql = sql + ',';
            else
                sql = sql + ');'
        }
        socket.emit("add", sql);
        socket.once("add_resp", ((msg) => {
            alert(msg);
            this.find();
        }).bind(this));
    }

    del(e) {
        let sql = 'CALL deleteAcount(' + e.ID + ');';
        socket.emit("del", sql);
        socket.once("del_resp", ((msg) => {
            alert(msg);
            this.find();
        }).bind(this));
    }

    edit() {
        let b = this.state.edit;
        console.log(b);
        let sql = 'CALL editSavingInfos('; 
        for (let i = 0; i < edit_info.length; i++) {
            sql = sql + (!b[edit_info[i].key] ? "null" : this.wrap(b[edit_info[i].key]));
            if (i < edit_info.length - 1)
                sql = sql + ',';
            else
                sql = sql + ');'
        }
        console.log(sql);
        socket.emit("edit", sql);
        socket.once("edit_resp", ((msg) => {
            alert(msg);
            this.find();
        }).bind(this));
    }

    find() {
        let b = this.state.find;
        let obj = ['account_open_record,saving_account'];
        obj.push(['saving_account.ID', 'account_open_record.ID','raw']);
        for (let i = 0; i < info.length; i++)
            if (b[info[i].key])
                obj.push([info[i].dcol, b[info[i].key]]);
        
        socket.emit("find", JSON.stringify(obj));
        socket.once("find_result", (res) => {
            res = JSON.parse(res.replace(/"null"/g, '""'));

            let col = [];
            for (let i = 0; i < info.length; i++)
                col.push({
                    title: info[i].dcol,
                    dataIndex: info[i].dcol,
                    key: info[i].dcol,
                    width:"10%"
                });
            col.push({
                title: "Action", key: "operation", width: "10%", render: (e) =>
                        <Button onClick={this.del.bind(this, e)}>删除</Button>
            });
            for (let d in res)
                res[d].key = d.toString();
            ReactDOM.render(<Table columns={col} dataSource={res} bordered scroll={{ x:'100%', y:500 }}/>, document.getElementById("account_table"));
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
                <h1>添加账户</h1>
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
                <br />
                <h1>精确查询</h1>
                <Form layout="inline">
                    {find}
                    <Form.Item>
                        <Button type="primary" onClick={this.find.bind(this)}>查询</Button>
                    </Form.Item>
                </Form>
                <br />
                <div id="account_table" />
            </div>      
        )    
    }  
}
  
export default Saving;