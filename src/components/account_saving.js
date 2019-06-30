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
        key: 'Rate',
        keyName: '利率',
        dcol: 'Rate'
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

let take_info = [
    {
        key: 'acountID',
        keyName:'账户ID'
    },
    {
        key: 'moneyNum',
        keyName:'取款金额'
    }
];

class Saving extends Component {
    constructor(props) {
        super(props);
        this.state = { add: {}, find: {}, edit: {}, save: {}, take: {} };
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
        let sql = 'CALL createSavingAcount(';
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
        let obj = ['account_open_record,saving_account,bank_account'];
        obj.push(['saving_account.ID', 'account_open_record.ID', 'raw']);
        obj.push(['saving_account.ID', 'bank_account.ID','raw']);
        for (let i = 0; i < find_info.length; i++)
            if (b[find_info[i].key])
                if (find_info[i].dcol === 'ID')
                    obj.push(['saving_account.ID', b[find_info[i].key]]);
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

    take() {
        let b = this.state.take;
        let sql = 'CALL takeMoney(';
        for (let i = 0; i < take_info.length; i++) {
            sql = sql + (!b[take_info[i].key] ? "null" : this.wrap(b[take_info[i].key]));
            if (i < take_info.length - 1)
                sql = sql + ',';
            else
                sql = sql + ');'
        }
        socket.emit("take", sql);
        socket.once("take_resp", ((msg) => {
            alert(msg);
            this.find();
        }).bind(this));
    }

    render() {
        let add = info.map((k) => {
            return <Form.Item><Input name={k.key} addonBefore={k.keyName} key={k.key} onChange={this.handleChange.bind(this, 'add')}/></Form.Item>
        });
        let find = find_info.map((k) => {
            return <Form.Item><Input name={k.key} addonBefore={k.keyName} key={k.key} onChange={this.handleChange.bind(this, 'find')}/></Form.Item>
        });
        let edit = edit_info.map((k) => {
            return <Form.Item><Input name={k.key} addonBefore={k.keyName} key={k.key} onChange={this.handleChange.bind(this, 'edit')}/></Form.Item>
        });
        let save = save_info.map((k) => {
            return <Form.Item><Input name={k.key} addonBefore={k.keyName} key={k.key} onChange={this.handleChange.bind(this, 'save')}/></Form.Item>
        });
        let take = take_info.map((k) => {
            return <Form.Item><Input name={k.key} addonBefore={k.keyName} key={k.key} onChange={this.handleChange.bind(this, 'take')}/></Form.Item>
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
                <h1>存款</h1>
                <Form layout="inline">
                    {save}
                    <Form.Item>
                        <Button type="primary" onClick={this.save.bind(this)}>存款</Button>
                    </Form.Item>
                </Form>
                <br />
                <h1>取款</h1>
                <Form layout="inline">
                    {take}
                    <Form.Item>
                        <Button type="primary" onClick={this.take.bind(this)}>取款</Button>
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