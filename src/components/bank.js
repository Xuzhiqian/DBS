import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import io from "socket.io";

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
        n[e.target.name] = e.target.value;
        let adds = Object.assign({}, this.state.add, n);
        this.setState({ add: adds });
    }

    add() {
        io.connect();
        /*
        let b = this.state.add;
        let conn = connection.connection();
        let sql = 'CALL addBank(' + b.bankName + ',' + b.bankCity + ',' + b.bankID +');';
        conn.query(sql, (err) => {
            if (err) {
                console.log(err);
            }
        });*/
    }

    render() {
        let add = info.map((k,index) => {
            return <Form.Item><Input name={k.key} addonBefore={k.keyName} key={k.key} onChange={this.handleChange.bind(this)}/></Form.Item>
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
            </div>      
        )    
    }  
}
  
export default Bank