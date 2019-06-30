import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button, Table } from 'antd';
import socket from '../socket';

let info = [
    {
        key: 'loanID',
        keyName: '贷款ID',
        dcol:'LO_ID'
    },
    {
        key: 'staffID',
        keyName: '负责人姓名',
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
        key: 'loanMoney',
        keyName: '贷款额度',
        dcol:'LO_Money'
    }
];
let find_info = [
    {
        key: 'loanID',
        keyName: '贷款ID',
        dcol:'LO_ID'
    },
    {
        key: 'staffID',
        keyName: '负责人姓名',
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
        key: 'loanMoney',
        keyName: '贷款额度',
        dcol:'LO_Money'
    },
    {
        key: 'state',
        keyName: '状态',
        dcol:'LO_State'
    }
];
let pay_info = [
    {
        key: 'loanID',
        keyName: '贷款ID'
    },
    {
        key: 'payment',
        keyName:'发放金额'
    },
    {
        key: 'payDate',
        keyName:'发放日期'
    }
];

class Loan extends Component {
    constructor(props) {
        super(props);
        this.state = { add: {}, find: {}, pay: {} };
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
        let sql = 'CALL addLoan(';
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
        let sql = 'CALL deleteLoan(' + e.LO_ID + ');';
        socket.emit("del", sql);
        socket.once("del_resp", ((msg) => {
            alert(msg);
            this.find();
        }).bind(this));
    }

    pay() {
        let b = this.state.pay;
        let sql = 'CALL payLoan(';
        for (let i = 0; i < pay_info.length; i++) {
            sql = sql + (!b[pay_info[i].key] ? "null" : this.wrap(b[pay_info[i].key]));
            if (i < pay_info.length - 1)
                sql = sql + ',';
            else
                sql = sql + ');'
        }
        socket.emit("pay", sql);
        socket.once("pay_resp", ((msg) => {
            alert(msg);
            this.find();
        }).bind(this));
    }

    find() {
        let b = this.state.find;
        let obj = ['loan'];

        for (let i = 0; i < find_info.length; i++)
            if (b[find_info[i].key])
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
            ReactDOM.render(<Table columns={col} dataSource={res} bordered scroll={{ x:'100%', y:500 }}/>, document.getElementById("loan_table"));
        
        });

        let obj = ['loan_payed'];
        socket.emit("find", JSON.stringify(obj));
        socket.once("find_result", (res) => {
            let col = [
                {
                    title: 'LO_ID',
                    dataIndex: 'LO_ID',
                    key: 'LO_ID',
                    width: "25%"
                },
                {
                    title: 'Payment_ID',
                    dataIndex: 'Payment_ID',
                    key: 'Payment_ID',
                    width: "25%"
                },
                {
                    title: 'PM',
                    dataIndex: 'PM',
                    key: 'PM',
                    width: "25%"
                },
                {
                    title: 'PDate',
                    dataIndex: 'PDate',
                    key: 'PDate',
                    width: "25%"
                }
            ];
            for (let d in res)
                res[d].key = d.toString();
                ReactDOM.render(<Table columns={col} dataSource={res} bordered scroll={{ x:'100%', y:500 }}/>, document.getElementById("pay_table"));
        });
    }

    render() {
        let add = info.map((k) => {
            return <Form.Item><Input name={k.key} addonBefore={k.keyName} key={k.key} onChange={this.handleChange.bind(this, 'add')}/></Form.Item>
        });
        let find = find_info.map((k) => {
            return <Form.Item><Input name={k.key} addonBefore={k.keyName} key={k.key} onChange={this.handleChange.bind(this, 'find')}/></Form.Item>
        });
        let pay = pay_info.map((k) => {
            return <Form.Item><Input name={k.key} addonBefore={k.keyName} key={k.key} onChange={this.handleChange.bind(this, 'pay')}/></Form.Item>
        });
        return (
            <div>
                <h1>添加贷款</h1>
                <Form layout="inline">
                    {add}
                    <Form.Item>
                        <Button type="primary" onClick={this.add.bind(this)}>添加</Button>
                    </Form.Item>
                </Form>
                <br />
                <h1>发放贷款</h1>
                <Form layout="inline">
                    {pay}
                    <Form.Item>
                        <Button type="primary" onClick={this.pay.bind(this)}>发放</Button>
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
                <div id="loan_table" />
                <div id="pay_table" />
            </div>      
        )    
    }  
}
  
export default Loan;