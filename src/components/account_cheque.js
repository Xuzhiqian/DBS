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
    }
];
let find_info = [
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
        key: 'Balance',
        keyName: '余额',
        dcol:'Balance'
    },
    {
        key: 'Quota',
        keyName: '透支额',
        dcol: 'Quota'
    }
];

let draw_info = [
    {
        key: 'acountID',
        keyName:'账户ID'
    },
    {
        key: 'moneyNum',
        keyName:'透支额'
    }
];

let save_info = [
    {
        key: 'acountID',
        keyName:'账户ID'
    },
    {
        key: 'moneyNum',
        keyName:'储蓄金额'
    }
];

let repay_info = [
    {
        key: 'acountID',
        keyName:'账户ID'
    },
    {
        key: 'moneyNum',
        keyName:'还款额'
    }
];

class Cheque extends Component {
    constructor(props) {
        super(props);
        this.state = { add: {}, find: {}, edit: {}, draw: {}, repay: {}, save: {} };
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
        let sql = 'CALL createChequeAcount(';
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

    draw() {
        let b = this.state.draw;
        let sql = 'CALL overdrawMoney(';
        for (let i = 0; i < draw_info.length; i++) {
            sql = sql + (!b[draw_info[i].key] ? "null" : this.wrap(b[draw_info[i].key]));
            if (i < draw_info.length - 1)
                sql = sql + ',';
            else
                sql = sql + ');'
        }
        socket.emit("draw", sql);
        socket.once("draw_resp", ((msg) => {
            alert(msg);
            this.find();
        }).bind(this));
    }

    save() {
        let b = this.state.save;
        let sql = 'CALL saveMoney(';
        for (let i = 0; i < save_info.length; i++) {
            sql = sql + (!b[save_info[i].key] ? "null" : this.wrap(b[save_info[i].key]));
            if (i < save_info.length - 1)
                sql = sql + ',';
            else
                sql = sql + ');'
        }
        socket.emit("save", sql);
        socket.once("save_resp", ((msg) => {
            alert(msg);
            this.find();
        }).bind(this));
    }

    repay() {
        let b = this.state.repay;
        let sql = 'CALL repayMoney(';
        for (let i = 0; i < repay_info.length; i++) {
            sql = sql + (!b[repay_info[i].key] ? "null" : this.wrap(b[repay_info[i].key]));
            if (i < repay_info.length - 1)
                sql = sql + ',';
            else
                sql = sql + ');'
        }
        socket.emit("repay", sql);
        socket.once("repay_resp", ((msg) => {
            alert(msg);
            this.find();
        }).bind(this));
    }

    find() {
        let b = this.state.find;
        let obj = ['account_open_record,cheque_account,bank_account'];
        obj.push(['cheque_account.ID', 'account_open_record.ID', 'raw']);
        obj.push(['cheque_account.ID', 'bank_account.ID','raw']);
        for (let i = 0; i < find_info.length; i++)
            if (b[find_info[i].key])
                if (find_info[i].dcol === 'ID')
                    obj.push(['cheque_account.ID', b[find_info[i].key]]);
                else
                    obj.push([find_info[i].dcol, b[find_info[i].key]]);
        
        socket.emit("find", JSON.stringify(obj));
        socket.once("find_result", (res) => {
            res = JSON.parse(res.replace(/"null"/g, '""'));

            let col = [];
            for (let i = 0; i < find_info.length; i++)
                col.push({
                    title: find_info[i].dcol,
                    dataIndex: find_info[i].dcol,
                    key: find_info[i].dcol,
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
        let find = find_info.map((k) => {
            return <Form.Item><Input name={k.key} addonBefore={k.keyName} key={k.key} onChange={this.handleChange.bind(this, 'find')}/></Form.Item>
        });
        let draw = draw_info.map((k) => {
            return <Form.Item><Input name={k.key} addonBefore={k.keyName} key={k.key} onChange={this.handleChange.bind(this, 'draw')}/></Form.Item>
        });
        let repay = repay_info.map((k) => {
            return <Form.Item><Input name={k.key} addonBefore={k.keyName} key={k.key} onChange={this.handleChange.bind(this, 'repay')}/></Form.Item>
        });
        let save = save_info.map((k) => {
            return <Form.Item><Input name={k.key} addonBefore={k.keyName} key={k.key} onChange={this.handleChange.bind(this, 'save')}/></Form.Item>
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
                <h1>透支</h1>
                <Form layout="inline">
                    {draw}
                    <Form.Item>
                        <Button type="primary" onClick={this.draw.bind(this)}>透支</Button>
                    </Form.Item>
                </Form>
                <br />
                <h1>存款</h1>
                <Form layout="inline">
                    {save}
                    <Form.Item>
                        <Button type="primary" onClick={this.save.bind(this)}>存款</Button>
                    </Form.Item>
                </Form>
                <br />
                <h1>储蓄账户还款</h1>
                <Form layout="inline">
                    {repay}
                    <Form.Item>
                        <Button type="primary" onClick={this.repay.bind(this)}>还款</Button>
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
  
export default Cheque;