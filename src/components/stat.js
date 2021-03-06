import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button, Table } from 'antd';
import socket from '../socket';

const col = [
    {
        title: '支行ID',
        dataIndex: 'ID',
        key: 'ID',
        width:'25%'
    },
    {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
        width:'25%'
    },
    {
        title: '贷款业务金额',
        dataIndex: 'loan',
        key: 'loan',
        width:'25%'
    },
    {
        title: '用户数',
        dataIndex: 'user',
        key: 'user',
        width:'25%'
    }
];
class Stat extends Component {
    constructor(props) {
        super(props);

        let sql = "select * from loan_payed,loan where loan_payed.LO_ID=loan.LO_ID;";
        socket.emit("stat", sql);
        socket.once("stat_result", (obj) => {
            obj = JSON.parse(obj); 
            let bank = {};
            obj.forEach((row) => {
                if (!bank[row.B_ID])
                    bank[row.B_ID] = [row];
                else
                    bank[row.B_ID].push(row);
            });
            let data = [];
            let key_counter = 1;

            for (let id in bank) {
                let t = {};
                for (let row in bank[id]) {
                    let r = bank[id][row];
                    let year = new Date(r.PDate).getFullYear();
                    if (!t[year]) {
                        t[year] = { time: year, loan: r.PM, user: new Set() };
                        t[year].user.add(r.C_ID);
                    }
                    else {
                        t[year].loan += r.PM;
                        t[year].user.add(r.C_ID);
                    }
                }
                let l = [];
                for (let y in t)
                    l.push({
                        key: key_counter++,
                        ID:id,
                        time: y,
                        loan: t[y].loan,
                        user: t[y].user.size
                    });
                data.push({
                    key: key_counter++,
                    ID: id,
                    children: l
                });
            }
            ReactDOM.render(<Table columns={col} dataSource={data} bordered scroll={{ x:'100%', y:800 }}/>, document.getElementById("table"));
        });
    }

    render() {
        return (
            <div>
                <h1>贷款业务统计（年度）</h1>
                <br />
                <div id="table" />
            </div>      
        )    
    }  
}
  
export default Stat;