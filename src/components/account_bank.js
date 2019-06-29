import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button, Table } from 'antd';
import socket from '../socket';

let info = [
    {
        key: 'acountID',
        keyName: '账户ID',
        dcol:'E_ID'
    },
    {
        key: 'bankID',
        keyName: '支行ID',
        dcol:'B_ID'
    },
    {
        key: 'staffName',
        keyName: '姓名',
        dcol:'E_Name'
    },
    {
        key: 'staffPhone',
        keyName: '电话',
        dcol:'E_Phone'
    },
    {
        key: 'staffAddr',
        keyName: '地址',
        dcol:'E_Addr'
    },
    {
        key: 'staffStation',
        keyName: 'Station',
        dcol:'E_Station'
    },
    {
        key: 'staffTime',
        keyName: '入职时间',
        dcol:'E_STime'
    },
    {
        key: 'staffDepartment',
        keyName: '部门',
        dcol:'E_Department'
    }
];
let edit_info = [
    {
        key: 'staffID',
        keyName: '员工ID'
    },
    {
        key: 'newstaffID',
        keyName: '新ID'
    },
    {
        key: 'bankID',
        keyName: '新支行ID'
    },
    {
        key: 'staffName',
        keyName: '新姓名'
    },
    {
        key: 'staffPhone',
        keyName: '新电话'
    },
    {
        key: 'staffAddr',
        keyName: '新地址'
    },
    {
        key: 'staffStation',
        keyName: '新Station'
    },
    {
        key: 'staffTime',
        keyName: '新入职时间'
    },
    {
        key: 'staffDepartment',
        keyName: '新部门'
    }
];

class Person extends Component {
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
        let sql = 'CALL addStaff(';
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
        let sql = 'CALL deleteStaff(' + e.E_ID + ');';
        socket.emit("del", sql);
        socket.once("del_resp", ((msg) => {
            alert(msg);
            this.find();
        }).bind(this));
    }

    edit() {
        let b = this.state.edit;
        console.log(b);
        let sql = 'CALL editStaffInfos('; 
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
        let obj = ['staff'];

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
            ReactDOM.render(<Table columns={col} dataSource={res} bordered scroll={{ x:'100%', y:500 }}/>, document.getElementById("person_table"));
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
                <h1>添加员工</h1>
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
                <div id="person_table" />
            </div>      
        )    
    }  
}
  
export default Person;