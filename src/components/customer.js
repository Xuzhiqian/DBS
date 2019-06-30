import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button, Table } from 'antd';
import socket from '../socket';

let info = [
    {
        key: 'customerID',
        keyName: '客户ID',
        dcol:'C_ID'
    },
    {
        key: 'customerName',
        keyName: '姓名',
        dcol:'C_Name'
    },
    {
        key: 'customerPhone',
        keyName: '电话',
        dcol:'C_Phone'
    },
    {
        key: 'customerAddr',
        keyName: '地址',
        dcol:'C_Addr'
    },
    {
        key: 'personName',
        keyName: '联系人姓名',
        dcol:'P_Name'
    },
    {
        key: 'personPhone',
        keyName: '联系人电话',
        dcol:'P_Phone'
    },
    {
        key: 'personEmail',
        keyName: '联系人邮箱',
        dcol:'P_Email'
    },
    {
        key: 'personRelationship',
        keyName: '联系人关系',
        dcol:'P_Relationship'
    }
];
let edit_info = [
    {
        key: 'customerID',
        keyName: '客户ID'
    },
    {
        key: 'newcustomerID',
        keyName: '新ID'
    },
    {
        key: 'customerName',
        keyName: '新姓名'
    },
    {
        key: 'customerPhone',
        keyName: '新电话'
    },
    {
        key: 'customerAddr',
        keyName: '新地址'
    },
    {
        key: 'personName',
        keyName: '新联系人姓名'
    },
    {
        key: 'personPhone',
        keyName: '新联系人电话'
    },
    {
        key: 'personEmail',
        keyName: '新联系人邮箱'
    },
    {
        key: 'personRelationship',
        keyName: '新关系'
    }
];

class Customer extends Component {
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
        let sql = 'CALL addCustomer(';
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
        let sql = 'CALL deleteCustomer(' + e.C_ID + ');';
        socket.emit("del", sql);
        socket.once("del_resp", ((msg) => {
            alert(msg);
            this.find();
        }).bind(this));
    }

    edit() {
        let b = this.state.edit;
        console.log(b);
        let sql = 'CALL editCustomerInfos('; 
        for (let i = 0; i < 5; i++) {
            sql = sql + (!b[edit_info[i].key] ? "null" : this.wrap(b[edit_info[i].key]));
            if (i < 4)
                sql = sql + ',';
            else
                sql = sql + ');'
        }
        socket.emit("edit", sql);

        sql = 'CALL editPersonInfos(';
        sql = sql + (!b[edit_info[0].key] ? "null" : this.wrap(b[edit_info[0].key]));
        sql = sql + ',';
        for (let i = 5; i < 9; i++) {
            sql = sql + (!b[edit_info[i].key] ? "null" : this.wrap(b[edit_info[i].key]));
            if (i < 8)
                sql = sql + ',';
            else
                sql = sql + ');'
        }
        socket.emit("edit", sql);

        socket.once("edit_resp", ((msg) => {
            alert(msg);
            this.find();
        }).bind(this));
    }

    find() {
        let b = this.state.find;
        let obj = ['customer'];

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
            ReactDOM.render(<Table columns={col} dataSource={res} bordered scroll={{ x:'100%', y:500 }}/>, document.getElementById("customer_table"));
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
                <h1>添加客户</h1>
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
                <div id="customer_table" />
            </div>      
        )    
    }  
}
  
export default Customer;